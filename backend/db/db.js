const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1';

const dbPath = isVercel
  ? '/tmp/database.sqlite'
  : path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath);

const initDB = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          skills TEXT,
          interests TEXT,
          team_size INTEGER,
          weeks_available INTEGER,
          constraints TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS idea_taxonomy (
          id TEXT PRIMARY KEY,
          domain TEXT,
          difficulty TEXT,
          tech_tags TEXT, -- JSON array
          base_description TEXT,
          target_users TEXT, -- JSON array
          engineering_challenge TEXT,
          team_size_min INTEGER,
          team_size_max INTEGER,
          weeks_min INTEGER,
          weeks_max INTEGER,
          requires_ml BOOLEAN,
          requires_cloud BOOLEAN,
          requires_hardware BOOLEAN
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS generated_ideas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER,
          taxonomy_ref TEXT,
          title TEXT,
          pitch TEXT,
          difficulty TEXT,
          fit_reason TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id),
          FOREIGN KEY (taxonomy_ref) REFERENCES idea_taxonomy(id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS mentor_plans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idea_id INTEGER,
          features_mvp TEXT, -- JSON array
          features_stretch TEXT, -- JSON array
          tech_stack TEXT, -- JSON array
          roadmap TEXT, -- JSON array
          pitfalls TEXT, -- JSON array
          wow_factor TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (idea_id) REFERENCES generated_ideas(id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS iteration_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          plan_id INTEGER,
          constraint_given TEXT,
          updated_plan_ref INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (plan_id) REFERENCES mentor_plans(id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

const seedTaxonomy = async () => {
  const seedPath = path.resolve(__dirname, '../../seed/taxonomy.json');
  if (!fs.existsSync(seedPath)) {
    console.log("No taxonomy.json found, skipping seed.");
    return;
  }

  const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS count FROM idea_taxonomy", (err, row) => {
      if (err) return reject(err);
      if (row.count > 0) {
        console.log("Taxonomy already seeded.");
        return resolve();
      }

      console.log(`Seeding ${data.length} taxonomy entries...`);
      const stmt = db.prepare(`
        INSERT INTO idea_taxonomy (
          id, domain, difficulty, tech_tags, base_description, target_users, 
          engineering_challenge, team_size_min, team_size_max, weeks_min, 
          weeks_max, requires_ml, requires_cloud, requires_hardware
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      data.forEach(item => {
        stmt.run(
          item.id, item.domain, item.difficulty, JSON.stringify(item.tech_tags),
          item.base_description, JSON.stringify(item.target_users),
          item.engineering_challenge, item.team_size_min, item.team_size_max,
          item.weeks_min, item.weeks_max, item.requires_ml, item.requires_cloud, item.requires_hardware
        );
      });
      
      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

module.exports = {
  db,
  initDB,
  seedTaxonomy
};
