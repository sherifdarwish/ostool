import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "applications" ADD COLUMN "media_id" integer;
    ALTER TABLE "applications" ADD COLUMN "video_url" varchar;
    ALTER TABLE "applications" ADD COLUMN "application_url" varchar;

    ALTER TABLE "applications"
      ADD CONSTRAINT "applications_media_id_media_id_fk"
      FOREIGN KEY ("media_id") REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX "applications_media_idx" ON "applications" USING btree ("media_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "applications" DROP CONSTRAINT "applications_media_id_media_id_fk";
    DROP INDEX "applications_media_idx";
    ALTER TABLE "applications" DROP COLUMN "media_id";
    ALTER TABLE "applications" DROP COLUMN "video_url";
    ALTER TABLE "applications" DROP COLUMN "application_url";
  `)
}
