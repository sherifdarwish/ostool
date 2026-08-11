import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "users"
    SET "role" = 'customer'
    WHERE "role" IS NULL;

    UPDATE "users"
    SET "onboarding_status" = 'company-required'
    WHERE "onboarding_status" IS NULL;

    UPDATE "users"
    SET "role" = 'admin', "onboarding_status" = 'complete'
    WHERE lower("email") = 'sherif.darwish@gmail.com';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "users"
    SET "role" = 'customer', "onboarding_status" = 'company-required'
    WHERE lower("email") = 'sherif.darwish@gmail.com';
  `)
}
