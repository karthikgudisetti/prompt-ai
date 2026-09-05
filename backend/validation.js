// Validation and Scoring Logic

const scoreCandidate = (candidate, student) => {
  let score = 0;

  // Domain match +30
  if (student.interests && student.interests.toLowerCase().includes(candidate.domain.toLowerCase())) {
    score += 30;
  }

  // Skill match +25
  const studentSkills = (student.skills || '').toLowerCase();
  const techTags = candidate.tech_tags || [];
  let skillMatchCount = 0;
  techTags.forEach(tag => {
    if (studentSkills.includes(tag.toLowerCase())) {
      skillMatchCount++;
    }
  });
  if (skillMatchCount > 0) {
    score += Math.min(25, skillMatchCount * 10); // up to 25 points
  }

  // Timeline compatibility +20
  if (student.weeks_available >= candidate.weeks_min && student.weeks_available <= candidate.weeks_max + 2) {
    score += 20;
  } else if (student.weeks_available >= candidate.weeks_min - 1) {
    score += 10;
  }

  // Team-size compatibility +10
  if (student.team_size >= candidate.team_size_min && student.team_size <= candidate.team_size_max) {
    score += 10;
  }

  // Difficulty compatibility +10 (Assume Beginner if not specified, advanced needs high skills)
  score += 10; // Simplify for now

  // Constraint compatibility +5
  score += 5;

  return Math.min(score, 100);
};

const filterCandidates = (taxonomy, student) => {
  const studentConstraints = (student.constraints || '').toLowerCase();
  const avoidsML = studentConstraints.includes('no machine learning') || studentConstraints.includes('no ml');
  const avoidsCloud = studentConstraints.includes('no cloud') || studentConstraints.includes('no aws') || studentConstraints.includes('no gcp');
  const avoidsHardware = studentConstraints.includes('no hardware') || studentConstraints.includes('no iot');

  return taxonomy.filter(item => {
    // Hard constraints
    if (item.requires_ml && avoidsML) return false;
    if (item.requires_cloud && avoidsCloud) return false;
    if (item.requires_hardware && avoidsHardware) return false;
    
    // Hard team size filter if completely out of bounds (e.g. requires 4, has 1)
    if (student.team_size < item.team_size_min) return false;
    
    // Timeline extreme filter (e.g. requires 10 weeks, has 2)
    if (student.weeks_available < item.weeks_min - 2) return false;

    return true;
  });
};

const getTopCandidates = (taxonomy, student, limit = 5) => {
  const valid = filterCandidates(taxonomy, student);
  valid.forEach(v => {
    v._score = scoreCandidate(v, student);
  });
  valid.sort((a, b) => b._score - a._score);
  return valid.slice(0, limit);
};

// Schema validations
const validateIdeasSchema = (ideas, candidates) => {
  if (!Array.isArray(ideas) || ideas.length !== 3) {
    throw new Error("Must return exactly 3 ideas");
  }

  const candidateIds = candidates.map(c => c.id);
  
  ideas.forEach(idea => {
    if (!idea.title || !idea.pitch || !idea.difficulty || !idea.fit_reason || !idea.taxonomy_ref) {
      throw new Error("Idea missing required fields");
    }
    if (!['Beginner', 'Intermediate', 'Advanced'].includes(idea.difficulty)) {
      throw new Error("Invalid difficulty enum");
    }
    if (!candidateIds.includes(idea.taxonomy_ref)) {
      throw new Error(`Taxonomy reference ${idea.taxonomy_ref} not in allowed candidates: ${candidateIds.join(', ')}`);
    }
  });
  return true;
};

const validateMentorPlanSchema = (plan) => {
  const requiredFields = ['features_mvp', 'features_stretch', 'tech_stack', 'roadmap', 'pitfalls', 'wow_factor'];
  requiredFields.forEach(f => {
    if (!plan[f]) throw new Error(`Missing required field: ${f}`);
  });
  
  if (!Array.isArray(plan.features_mvp) || !Array.isArray(plan.features_stretch) || !Array.isArray(plan.pitfalls)) {
    throw new Error("Features and pitfalls must be arrays");
  }
  
  if (!Array.isArray(plan.tech_stack) || plan.tech_stack.length === 0 || !plan.tech_stack[0].name) {
    throw new Error("Tech stack must be an array of objects with name and reason");
  }
  
  if (!Array.isArray(plan.roadmap) || plan.roadmap.length === 0 || !plan.roadmap[0].week) {
    throw new Error("Roadmap must be an array of objects with week, goal, tasks");
  }
  
  return true;
};

const validateReplanSchema = (replan) => {
  const allowedKeys = ['tech_stack', 'roadmap'];
  const keys = Object.keys(replan);
  
  keys.forEach(k => {
    if (!allowedKeys.includes(k)) {
      throw new Error(`Replan response contains forbidden key: ${k}`);
    }
  });

  if (!replan.tech_stack || !replan.roadmap) {
    throw new Error("Replan must include tech_stack and roadmap");
  }
  
  return true;
};

// Deep compare to ensure immutability
const ensureImmutable = (original, updated, fields) => {
  fields.forEach(f => {
    const origStr = JSON.stringify(original[f]);
    const updatedStr = JSON.stringify(updated[f]);
    if (origStr !== updatedStr) {
      throw new Error(`Invariant violation: Immutable field ${f} was changed.`);
    }
  });
};

module.exports = {
  getTopCandidates,
  validateIdeasSchema,
  validateMentorPlanSchema,
  validateReplanSchema,
  ensureImmutable
};
