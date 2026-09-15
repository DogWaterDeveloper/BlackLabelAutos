import type { Config, Context } from "@netlify/functions";
import { and, asc, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { timingSafeEqual } from "node:crypto";
import { db } from "../../db/index.js";
import { vehicles, type Vehicle } from "../../db/schema.js";

/**
 * Inventory API.
 *
 *   GET    /api/vehicles           list (optional filters + sort)
 *   GET    /api/vehicles/:slug     single vehicle
 *   POST   /api/vehicles           create            (admin)
 *   PATCH  /api/vehicles/:slug     partial update    (admin)
 *   DELETE /api/vehicles/:slug     remove            (admin)
 *
 * Writes require the INVENTORY_ADMIN_TOKEN environment variable to be set and
 * sent as `Authorization: Bearer <token>`. While that variable is unset the
 * inventory is read-only, so the public endpoint is safe by default.
 */

const NUMBER_FIELDS = [
  "price",
  "year",
  "miles",
  "seats",
  "stockHp",
  "potentialHp",
  "stockSpeed",
  "potentialSpeed",
  "stockRating",
  "potentialRating",
  "stockAccel",
  "potentialAccel",
  "stockGrip",
  "potentialGrip",
  "stockPlatform",
  "potentialPlatform",
  "stockBraking",
  "potentialBraking",
] as const;

const TEXT_FIELDS = ["slug", "name", "make", "category", "image", "engine", "status"] as const;

// Fields that must be present when creating a vehicle ("seats" and "status" have defaults).
const REQUIRED_ON_CREATE = [
  "slug",
  "name",
  "make",
  "category",
  "image",
  "engine",
  "price",
  "year",
  "miles",
  ...NUMBER_FIELDS.filter((f) => f.startsWith("stock") || f.startsWith("potential")),
] as const;

const SORTS = {
  "price-desc": desc(vehicles.price),
  "price-asc": asc(vehicles.price),
  "year-desc": desc(vehicles.year),
  "year-asc": asc(vehicles.year),
  "rating-desc": desc(vehicles.stockRating),
  "rating-asc": asc(vehicles.stockRating),
  "name-asc": asc(vehicles.name),
} as const;

const group = (n: number) => n.toLocaleString("en-US");

/** Shape a row into the display-ready record the Inventory page renders. */
function present(v: Vehicle) {
  return {
    id: v.id,
    slug: v.slug,
    name: v.name,
    make: v.make,
    category: v.category,
    image: v.image,
    price: `$${group(v.price)}`,
    priceNum: v.price,
    year: String(v.year),
    yearNum: v.year,
    miles: group(v.miles),
    milesNum: v.miles,
    rating: String(v.stockRating),
    ratingNum: v.stockRating,
    engine: v.engine,
    seats: String(v.seats),
    status: v.status,
    stats: {
      hp: `${v.stockHp}/${v.potentialHp}`,
      speed: `${v.stockSpeed}/${v.potentialSpeed}`,
      rating: `${v.stockRating}/${v.potentialRating}`,
      accel: `${v.stockAccel}/${v.potentialAccel}`,
      grip: `${v.stockGrip}/${v.potentialGrip}`,
      platform: `${v.stockPlatform}/${v.potentialPlatform}`,
      braking: `${v.stockBraking}/${v.potentialBraking}`,
    },
  };
}

const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });

function isAuthorized(req: Request) {
  const expected = process.env.INVENTORY_ADMIN_TOKEN;
  if (!expected) return false;
  const provided = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Pull known columns out of a request body, coercing numbers and rejecting bad values. */
function readFields(body: Record<string, unknown>) {
  const values: Record<string, string | number> = {};
  const errors: string[] = [];

  for (const field of TEXT_FIELDS) {
    if (body[field] === undefined) continue;
    const value = String(body[field]).trim();
    if (!value) errors.push(`"${field}" cannot be empty`);
    else values[field] = value;
  }

  for (const field of NUMBER_FIELDS) {
    if (body[field] === undefined) continue;
    // Accept "$425,833" and "4,954" as well as plain numbers.
    const parsed = Number(String(body[field]).replace(/[$,\s]/g, ""));
    if (!Number.isFinite(parsed)) errors.push(`"${field}" must be a number`);
    else values[field] = Math.round(parsed);
  }

  return { values, errors };
}

async function list(url: URL) {
  const params = url.searchParams;
  const multi = (key: string) =>
    params
      .getAll(key)
      .flatMap((value) => value.split(","))
      .map((value) => value.trim())
      .filter(Boolean);

  const conditions = [];
  const category = params.get("category");
  if (category && category !== "all") conditions.push(eq(vehicles.category, category));

  const make = params.get("make");
  if (make && make !== "all") conditions.push(eq(vehicles.make, make));

  const engines = multi("engine");
  if (engines.length) conditions.push(inArray(vehicles.engine, engines));

  const statuses = multi("status");
  if (statuses.length) conditions.push(inArray(vehicles.status, statuses));

  const search = params.get("search")?.trim();
  if (search) conditions.push(ilike(vehicles.name, `%${search}%`));

  const sortKey = params.get("sort") ?? "price-desc";
  const orderBy = SORTS[sortKey as keyof typeof SORTS] ?? SORTS["price-desc"];

  const rows = await db
    .select()
    .from(vehicles)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy);

  return json({ count: rows.length, vehicles: rows.map(present) });
}

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const slug = context.params.slug;

  try {
    if (req.method === "GET") {
      if (!slug) return await list(url);

      const [row] = await db.select().from(vehicles).where(eq(vehicles.slug, slug)).limit(1);
      if (!row) return json({ error: "Vehicle not found" }, 404);
      return json(present(row));
    }

    if (req.method === "POST" || req.method === "PATCH" || req.method === "PUT" || req.method === "DELETE") {
      if (!process.env.INVENTORY_ADMIN_TOKEN) {
        return json(
          { error: "Inventory writes are disabled. Set the INVENTORY_ADMIN_TOKEN environment variable to enable them." },
          503,
        );
      }
      if (!isAuthorized(req)) return json({ error: "Unauthorized" }, 401);
    }

    if (req.method === "POST") {
      if (slug) return json({ error: "POST to /api/vehicles, without a slug" }, 400);

      const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
      if (!body) return json({ error: "Expected a JSON body" }, 400);

      const { values, errors } = readFields(body);
      const missing = REQUIRED_ON_CREATE.filter((field) => values[field] === undefined);
      if (missing.length) errors.push(`missing required field(s): ${missing.join(", ")}`);
      if (errors.length) return json({ error: "Invalid vehicle", details: errors }, 400);

      const existing = await db.select({ id: vehicles.id }).from(vehicles).where(eq(vehicles.slug, String(values.slug))).limit(1);
      if (existing.length) return json({ error: `A vehicle with slug "${values.slug}" already exists` }, 409);

      const [created] = await db.insert(vehicles).values(values as never).returning();
      return json(present(created), 201);
    }

    if (req.method === "PATCH" || req.method === "PUT") {
      if (!slug) return json({ error: "Include the vehicle slug: /api/vehicles/:slug" }, 400);

      const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
      if (!body) return json({ error: "Expected a JSON body" }, 400);

      const { values, errors } = readFields(body);
      if (errors.length) return json({ error: "Invalid vehicle", details: errors }, 400);
      if (!Object.keys(values).length) return json({ error: "No updatable fields provided" }, 400);

      const [updated] = await db
        .update(vehicles)
        .set({ ...values, updatedAt: sql`now()` } as never)
        .where(eq(vehicles.slug, slug))
        .returning();

      if (!updated) return json({ error: "Vehicle not found" }, 404);
      return json(present(updated));
    }

    if (req.method === "DELETE") {
      if (!slug) return json({ error: "Include the vehicle slug: /api/vehicles/:slug" }, 400);

      const [deleted] = await db.delete(vehicles).where(eq(vehicles.slug, slug)).returning();
      if (!deleted) return json({ error: "Vehicle not found" }, 404);
      return json({ deleted: deleted.slug });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("Inventory API error:", error);
    return json({ error: "Unable to reach the inventory database" }, 500);
  }
};

export const config: Config = {
  path: ["/api/vehicles", "/api/vehicles/:slug"],
};
