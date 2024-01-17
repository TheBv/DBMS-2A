DO $$ BEGIN
 CREATE TYPE "eval_category" AS ENUM('physiology', 'psychology', 'training', 'performance', 'social', 'cognition');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "sport_category" AS ENUM('soccer', 'basketball', 'tennis', 'volleyball', 'handball', 'rugby', 'hockey', 'baseball', 'american_football', 'badminton', 'table_tennis');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"answer" varchar(1024),
	"timestamp" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256),
	"description" varchar(1024),
	"categories" eval_category[],
	"options" varchar(1024)[],
	"timing_rule" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"categories" sport_category[]
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_question_idx" ON "answers" ("user_id","question_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "title_idx" ON "questions" ("title");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "users" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answers" ADD CONSTRAINT "answers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
