import { netlifyTable } from "@netlify/database/drizzle";
import { text, uuid, timestamp } from "drizzle-orm/pg-core";

// Define a 'users' table
export const users = netlifyTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
