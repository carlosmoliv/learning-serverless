CREATE TABLE IF NOT EXISTS "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"description" text DEFAULT 'Default description...',
	"created_at" timestamp DEFAULT now()
);
