import postgres from 'postgres';

const sql = postgres('postgresql://postgres:IZjqGtRulyf3CWQ5@db.udxvixjiihhtwrswahvf.supabase.co:5432/postgres', {
  ssl: 'require',
});

try {
  console.log('Testing connection...');
  const result = await sql`SELECT NOW() as time`;
  console.log('✅ Connection successful!');
  console.log('Server time:', result[0].time);
  
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  console.log('\nPublic tables:', tables.map(t => t.table_name));
  
  await sql.end();
  console.log('\n✅ All tests passed!');
} catch (err) {
  console.error('❌ Connection failed:', err.message);
  console.error('\nFull error:', err);
  process.exit(1);
}
