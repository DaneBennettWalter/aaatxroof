/**
 * Auto-migration helper for Postgres adapter.
 * Runs once on first connection to ensure schema exists.
 */

import { sql, type PostgresJsDatabase } from "drizzle-orm/postgres-js";

export async function ensureSchema(db: PostgresJsDatabase) {
  try {
    // Check if leads table exists
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'leads'
      );
    `);
    
    const exists = result.rows[0]?.exists;
    
    if (!exists) {
      console.log('[db/postgres] Running initial schema migration...');
      await runMigration(db);
      console.log('[db/postgres] Migration complete');
    }
  } catch (err) {
    console.error('[db/postgres] Migration check failed:', err);
    // Don't throw - let the app try to continue
  }
}

async function runMigration(db: PostgresJsDatabase) {
  // Create enums
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quoted', 'won', 'lost');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE property_type AS ENUM ('residential', 'commercial');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE timeline AS ENUM ('emergency', '1-2-weeks', '1-3-months', 'flexible');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE budget_range AS ENUM ('under-5k', '5k-15k', '15k-30k', '30k-plus', 'unsure');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE inspection_type AS ENUM ('residential', 'commercial', 'storm-damage', 'insurance');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  // Create leads table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS leads (
      id VARCHAR(64) PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name VARCHAR(120) NOT NULL,
      phone VARCHAR(40) NOT NULL,
      address VARCHAR(300) NOT NULL,
      email VARCHAR(200),
      property_type property_type NOT NULL,
      property_age VARCHAR(40),
      property_size VARCHAR(40),
      stories VARCHAR(10),
      services JSONB NOT NULL,
      timeline timeline NOT NULL,
      budget budget_range,
      notes TEXT,
      status lead_status NOT NULL DEFAULT 'new',
      source VARCHAR(80),
      user_agent TEXT
    );
  `);

  // Create leads indexes
  await db.execute(sql`CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at);`);

  // Create appointments table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id VARCHAR(64) PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      scheduled_for TIMESTAMPTZ NOT NULL,
      customer_name VARCHAR(120) NOT NULL,
      customer_phone VARCHAR(40) NOT NULL,
      customer_email VARCHAR(200) NOT NULL,
      address VARCHAR(300) NOT NULL,
      inspection_type inspection_type NOT NULL,
      notes TEXT,
      status appointment_status NOT NULL DEFAULT 'scheduled'
    );
  `);

  // Create appointments indexes
  await db.execute(sql`CREATE INDEX IF NOT EXISTS appointments_scheduled_for_idx ON appointments(scheduled_for);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);`);

  // Partial unique constraint
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS appointments_slot_unique 
      ON appointments(scheduled_for) 
      WHERE status = 'scheduled';
  `);
}
