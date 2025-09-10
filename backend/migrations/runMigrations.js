const fs = require('fs');
const path = require('path');
const pool = require('../db');

async function runMigrations() {
  try {
    const migrationFiles = ['001_create_tables.sql'];
    for (const file of migrationFiles) {
      const migrationFile = path.join(__dirname, file);
      const sql = fs.readFileSync(migrationFile, 'utf-8');
      await pool.query(sql);
    }
    console.log('Migrations ran successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error running migrations:', err);
    process.exit(1);
  }
}

runMigrations();
