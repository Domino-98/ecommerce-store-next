ALTER TABLE "user" DROP CONSTRAINT "user_google_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "google_id";