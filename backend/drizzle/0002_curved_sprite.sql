ALTER TABLE "users" ADD COLUMN "email" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(256);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "token" varchar(32);