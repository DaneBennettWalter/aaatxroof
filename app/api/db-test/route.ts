import { NextResponse } from "next/server";
import postgres from "postgres";

export const dynamic = "force-dynamic";

/**
 * Direct database test - bypasses Drizzle to test raw connection
 */
export async function GET() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    return NextResponse.json({ error: "No DATABASE_URL" }, { status: 500 });
  }

  try {
    const client = postgres(connectionString, {
      ssl: { rejectUnauthorized: false },
      max: 1,
    });

    // Test 1: Basic connection
    const result = await client`SELECT NOW() as time`;
    const now = result[0]?.time;

    // Test 2: Check if leads table exists
    const tableCheck = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'leads'
      ) as exists
    `;
    const leadsTableExists = tableCheck[0]?.exists;

    // Test 3: Check if appointments table exists
    const appointmentsCheck = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'appointments'
      ) as exists
    `;
    const appointmentsTableExists = appointmentsCheck[0]?.exists;

    await client.end();

    return NextResponse.json({
      status: "ok",
      connection: "working",
      serverTime: now,
      tables: {
        leads: leadsTableExists,
        appointments: appointmentsTableExists,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        error: err.message,
        stack: err.stack?.split('\n').slice(0, 5),
      },
      { status: 500 },
    );
  }
}
