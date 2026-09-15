CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY,
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"make" text NOT NULL,
	"category" text NOT NULL,
	"image" text NOT NULL,
	"price" integer NOT NULL,
	"year" integer NOT NULL,
	"miles" integer NOT NULL,
	"engine" text NOT NULL,
	"seats" integer DEFAULT 2 NOT NULL,
	"status" text DEFAULT 'not-imported' NOT NULL,
	"stock_hp" integer NOT NULL,
	"potential_hp" integer NOT NULL,
	"stock_speed" integer NOT NULL,
	"potential_speed" integer NOT NULL,
	"stock_rating" integer NOT NULL,
	"potential_rating" integer NOT NULL,
	"stock_accel" integer NOT NULL,
	"potential_accel" integer NOT NULL,
	"stock_grip" integer NOT NULL,
	"potential_grip" integer NOT NULL,
	"stock_platform" integer NOT NULL,
	"potential_platform" integer NOT NULL,
	"stock_braking" integer NOT NULL,
	"potential_braking" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "vehicles_category_idx" ON "vehicles" ("category");--> statement-breakpoint
CREATE INDEX "vehicles_make_idx" ON "vehicles" ("make");--> statement-breakpoint
CREATE INDEX "vehicles_status_idx" ON "vehicles" ("status");--> statement-breakpoint
CREATE INDEX "vehicles_price_idx" ON "vehicles" ("price");