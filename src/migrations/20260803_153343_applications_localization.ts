import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "applications_locales" (
      "name" varchar NOT NULL,
      "description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    ALTER TABLE "applications_locales"
      ADD CONSTRAINT "applications_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."applications"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "applications_locales_locale_parent_id_unique"
      ON "applications_locales" USING btree ("_locale", "_parent_id");

    INSERT INTO "applications_locales" ("name", "description", "_locale", "_parent_id")
      SELECT "name", "description", 'en'::_locales, "id" FROM "applications";

    ALTER TABLE "applications" DROP COLUMN "name";
    ALTER TABLE "applications" DROP COLUMN "description";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "applications" ADD COLUMN "name" varchar;
    ALTER TABLE "applications" ADD COLUMN "description" varchar;

    UPDATE "applications"
      SET
        "name" = localized."name",
        "description" = localized."description"
      FROM "applications_locales" AS localized
      WHERE localized."_parent_id" = "applications"."id"
        AND localized."_locale" = 'en';

    ALTER TABLE "applications" ALTER COLUMN "name" SET NOT NULL;
    DROP TABLE "applications_locales" CASCADE;
  `)
}
