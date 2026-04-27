#!/usr/bin/env node
/**
 * Run database migration for Postgres backend.
 * Creates enums and tables from lib/db/schema.ts
 */

import pg from 'pg';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

// Parse URL and ensure we're using IPv4
const url = new URL(DATABASE_URL);
const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port) || 5432,
  database: url.pathname.slice(1),
  user: url.username,
  password: url.password,
  ssl: { rejectUnauthorized: false },
  // Force IPv4
  family: 4,
});

const migration = `
-- Create enums
DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quoted', 'won', 'lost');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE property_type AS ENUM ('residential', 'commercial');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE timeline AS ENUM ('emergency', '1-2-weeks', '1-3-months', 'flexible');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE budget_range AS ENUM ('under-5k', '5k-15k', '15k-30k', '30k-plus', 'unsure');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE inspection_type AS ENUM ('residential', 'commercial', 'storm-damage', 'insurance');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create leads table
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

-- Create leads indexes
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at);

-- Create appointments table
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

-- Create appointments indexes
CREATE INDEX IF NOT EXISTS appointments_scheduled_for_idx ON appointments(scheduled_for);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON appointments(status);

-- Partial unique constraint: one active appointment per slot
CREATE UNIQUE INDEX IF NOT EXISTS appointments_slot_unique 
  ON appointments(scheduled_for) 
  WHERE status = 'scheduled';
`;

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Running database migration...');
    await client.query(migration);
    console.log('✅ Migration complete!');
    console.log('');
    console.log('Tables created:');
    console.log('  - leads');
    console.log('  - appointments');
    console.log('');
    console.log('Database is ready for production.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
