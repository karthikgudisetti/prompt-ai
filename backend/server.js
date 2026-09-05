const express = require('express');
const cors = require('cors');
const { db, initDB, seedTaxonomy } = require('./db/db');
const { getTopCandidates, validateIdeasSchema, validateMentorPlanSchema, validateReplanSchema } = require('./validation');
const llm = require('./llm');

const app = express();
app.use(cors());
app.use(express.json());

// Helpers for DB access
const runDb = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});
const getDb = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});
const allDb = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

app.post('/api/intake', async (req, res) => {
  try {
    const { name, skills, interests, team_size, weeks_available, constraints } = req.body;
    const parsedTeamSize = parseInt(team_size, 10) || 1;
    const parsedWeeks = parseInt(weeks_available, 10) || 4;

    const result = await runDb(
      `INSERT INTO students (name, skills, interests, team_size, weeks_available, constraints) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name || 'Student', skills || '', interests || '', parsedTeamSize, parsedWeeks, constraints || '']
    );
    res.json({ id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post('/api/ideas/generate', async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await getDb("SELECT * FROM students WHERE id = ?", [studentId]);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const taxonomyRows = await allDb("SELECT * FROM idea_taxonomy");
    const taxonomy = taxonomyRows.map(r => ({
      ...r,
      tech_tags: JSON.parse(r.tech_tags || '[]'),
      target_users: JSON.parse(r.target_users || '[]')
    }));

    let candidates = getTopCandidates(taxonomy, student, 5);
    // If strict filtering returned fewer than 3, fallback to top available taxonomy items
    if (candidates.length < 3 && taxonomy.length >= 3) {
      const existingIds = new Set(candidates.map(c => c.id));
      const remaining = taxonomy.filter(t => !existingIds.has(t.id));
      candidates = [...candidates, ...remaining].slice(0, 5);
    }
    
    let ideas;
    if (llm.isLiveMode) {
      ideas = await llm.generateIdeas(student, candidates);
    } else {
      // Deterministic demo mode
      ideas = candidates.slice(0, 3).map(c => ({
        title: `Demo: ${(c.base_description || 'Project').split(' ')[0]} Project`,
        pitch: c.base_description || 'A targeted project aligned with your skills.',
        difficulty: c.difficulty || 'Intermediate',
        fit_reason: "Matches your skills and timeline perfectly (Demo).",
        taxonomy_ref: c.id
      }));
    }

    validateIdeasSchema(ideas, candidates);

    const savedIdeas = [];
    for (const idea of ideas) {
      const result = await runDb(
        `INSERT INTO generated_ideas (student_id, taxonomy_ref, title, pitch, difficulty, fit_reason)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [studentId, idea.taxonomy_ref, idea.title, idea.pitch, idea.difficulty, idea.fit_reason]
      );
      savedIdeas.push({ id: result.lastID, ...idea });
    }

    res.json({
      ideas: savedIdeas,
      contract: {
        candidates_retrieved: candidates.length,
        validation_passed: true,
        mode: llm.isLiveMode ? "Live AI" : "Demo Mode"
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to generate ideas" });
  }
});

app.post('/api/mentor/generate', async (req, res) => {
  try {
    const { ideaId } = req.body;
    const idea = await getDb("SELECT * FROM generated_ideas WHERE id = ?", [ideaId]);
    if (!idea) return res.status(404).json({ error: "Idea not found" });

    const student = await getDb("SELECT * FROM students WHERE id = ?", [idea.student_id]);
    const taxRow = await getDb("SELECT * FROM idea_taxonomy WHERE id = ?", [idea.taxonomy_ref]);
    const taxonomy = taxRow ? { ...taxRow, tech_tags: JSON.parse(taxRow.tech_tags || '[]') } : { tech_tags: ["Fullstack"] };

    let plan;
    if (llm.isLiveMode) {
      plan = await llm.generateMentorPlan(student, idea, taxonomy);
    } else {
      const weeksCount = Math.max(1, parseInt(student?.weeks_available, 10) || 4);
      plan = {
        features_mvp: ["Core feature 1", "Core feature 2"],
        features_stretch: ["Extra feature 1"],
        tech_stack: [{ name: (taxonomy.tech_tags && taxonomy.tech_tags[0]) || "Python", reason: "Standard tech stack for this problem domain" }],
        roadmap: Array.from({ length: weeksCount }).map((_, i) => ({
          week: `Week ${i + 1}`,
          goal: `Sprint ${i + 1} milestone and deliverable`,
          tasks: ["Initial scaffolding and environment setup", "Feature implementation and unit testing"]
        })),
        pitfalls: ["Scope creep beyond timeline", "Underestimating third-party API setup"],
        wow_factor: "Polished end-to-end interactive demo with automated validation"
      };
    }

    validateMentorPlanSchema(plan);

    const result = await runDb(
      `INSERT INTO mentor_plans (idea_id, features_mvp, features_stretch, tech_stack, roadmap, pitfalls, wow_factor)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ideaId, JSON.stringify(plan.features_mvp), JSON.stringify(plan.features_stretch), 
       JSON.stringify(plan.tech_stack), JSON.stringify(plan.roadmap), JSON.stringify(plan.pitfalls), plan.wow_factor]
    );

    res.json({ id: result.lastID, ...plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to generate plan" });
  }
});

app.get('/api/mentor-plans/:id', async (req, res) => {
  try {
    const plan = await getDb("SELECT * FROM mentor_plans WHERE id = ?", [req.params.id]);
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    
    res.json({
      ...plan,
      features_mvp: JSON.parse(plan.features_mvp),
      features_stretch: JSON.parse(plan.features_stretch),
      tech_stack: JSON.parse(plan.tech_stack),
      roadmap: JSON.parse(plan.roadmap),
      pitfalls: JSON.parse(plan.pitfalls)
    });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.patch('/api/mentor-plans/:id/replan', async (req, res) => {
  try {
    const { constraint } = req.body;
    const planId = req.params.id;
    
    const planRow = await getDb("SELECT * FROM mentor_plans WHERE id = ?", [planId]);
    if (!planRow) return res.status(404).json({ error: "Plan not found" });

    const idea = await getDb("SELECT * FROM generated_ideas WHERE id = ?", [planRow.idea_id]);
    const student = await getDb("SELECT * FROM students WHERE id = ?", [idea.student_id]);

    const existingTech = JSON.parse(planRow.tech_stack);
    const existingRoadmap = JSON.parse(planRow.roadmap);

    let replan;
    if (llm.isLiveMode) {
      replan = await llm.generateReplan(student, idea, existingTech, existingRoadmap, constraint);
    } else {
      replan = {
        tech_stack: [...existingTech, {name: "Demo Tech", reason: "Adapted"}],
        roadmap: [{week: "Week 1", goal: "Adapted goal", tasks: []}]
      };
    }

    validateReplanSchema(replan);

    // Atomically update ONLY tech_stack and roadmap
    await runDb(
      `UPDATE mentor_plans SET tech_stack = ?, roadmap = ? WHERE id = ?`,
      [JSON.stringify(replan.tech_stack), JSON.stringify(replan.roadmap), planId]
    );

    // Create iteration log
    await runDb(
      `INSERT INTO iteration_log (plan_id, constraint_given, updated_plan_ref) VALUES (?, ?, ?)`,
      [planId, constraint, planId]
    );

    // Return the updated data
    const updatedPlan = await getDb("SELECT * FROM mentor_plans WHERE id = ?", [planId]);

    res.json({
      contract: {
        mutations_allowed: ["tech_stack", "roadmap"],
        immutable_preserved: ["features_mvp", "features_stretch", "pitfalls", "wow_factor"]
      },
      updated: {
        tech_stack: JSON.parse(updatedPlan.tech_stack),
        roadmap: JSON.parse(updatedPlan.roadmap)
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to replan" });
  }
});

const PORT = process.env.PORT || 3001;
initDB().then(() => seedTaxonomy()).then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}).catch(console.error);
