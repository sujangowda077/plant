const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');

// Enable WebSocket for serverless environments
require('@neondatabase/serverless').neonConfig.webSocketConstructor = ws;

const runMigration = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is required');
    return;
  }

  console.log('Connecting to database...');
  
  try {
    // Connect to the database
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    console.log('Creating database schema...');
    
    // Define SQL statements for creating tables
    const createPlantsTable = `
      CREATE TABLE IF NOT EXISTS plants (
        id SERIAL PRIMARY KEY,
        common_name TEXT NOT NULL,
        scientific_name TEXT NOT NULL,
        description TEXT NOT NULL,
        care_tips JSONB NOT NULL,
        fun_facts JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;
    
    const createIdentificationsTable = `
      CREATE TABLE IF NOT EXISTS identifications (
        id SERIAL PRIMARY KEY,
        plant_id INTEGER REFERENCES plants(id),
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        is_successful BOOLEAN DEFAULT TRUE NOT NULL,
        error_message TEXT
      );
    `;
    
    // Execute SQL statements
    await pool.query(createPlantsTable);
    console.log('Plants table created or already exists');
    
    await pool.query(createIdentificationsTable);
    console.log('Identifications table created or already exists');
    
    console.log('Database migration completed successfully!');
    
    // Close the pool
    await pool.end();
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

runMigration();
