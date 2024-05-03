ALTER TABLE "user" ADD COLUMN "profile_picture_url" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "oauth_account" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "oauth_account" DROP COLUMN IF EXISTS "updated_at";