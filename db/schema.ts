import { pgTable, serial, text, integer, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Inventory of vehicles shown on the Inventory page.
 *
 * Only raw values are stored. Display strings ("$425,833", "4,954") are
 * formatted when the record is served, so there is one source of truth per fact.
 */
export const vehicles = pgTable(
  "vehicles",
  {
    id: serial().primaryKey(),

    // Stable, human-readable identifier used in URLs and for seeding/upserts.
    slug: text().notNull().unique(),

    // Identity
    name: text().notNull(),
    make: text().notNull(),
    category: text().notNull(),
    image: text().notNull(),

    // Listing details
    price: integer().notNull(),
    year: integer().notNull(),
    miles: integer().notNull(),
    engine: text().notNull(),
    seats: integer().notNull().default(2),
    status: text().notNull().default("not-imported"),

    // Stock / upgrade-potential performance pairs
    stockHp: integer("stock_hp").notNull(),
    potentialHp: integer("potential_hp").notNull(),
    stockSpeed: integer("stock_speed").notNull(),
    potentialSpeed: integer("potential_speed").notNull(),
    stockRating: integer("stock_rating").notNull(),
    potentialRating: integer("potential_rating").notNull(),
    stockAccel: integer("stock_accel").notNull(),
    potentialAccel: integer("potential_accel").notNull(),
    stockGrip: integer("stock_grip").notNull(),
    potentialGrip: integer("potential_grip").notNull(),
    stockPlatform: integer("stock_platform").notNull(),
    potentialPlatform: integer("potential_platform").notNull(),
    stockBraking: integer("stock_braking").notNull(),
    potentialBraking: integer("potential_braking").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("vehicles_category_idx").on(table.category),
    index("vehicles_make_idx").on(table.make),
    index("vehicles_status_idx").on(table.status),
    index("vehicles_price_idx").on(table.price),
  ],
);

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
