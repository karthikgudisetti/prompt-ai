const IDEA_GENERATION_PROMPT = `
You are an expert engineering mentor.
Based on the student's profile and the retrieved taxonomy candidates, generate exactly 3 project ideas.

STUDENT PROFILE:
Name: {name}
Skills: {skills}
Interests: {interests}
Team Size: {team_size}
Weeks Available: {weeks_available}
Constraints: {constraints}

RETRIEVED CANDIDATES (Choose from these ONLY):
{candidates}

RULES:
1. Generate exactly 3 ideas.
2. Each idea must reference one of the provided taxonomy IDs.
3. You must not invent new categories not in the candidates.
4. Adapt the pitch and fit explanation to the student's profile.
5. Return JSON only, with this exact schema:
[
  {
    "title": "string",
    "pitch": "string",
    "difficulty": "Beginner|Intermediate|Advanced",
    "fit_reason": "string",
    "taxonomy_ref": "string"
  }
]
`;

const MENTOR_DEEP_DIVE_PROMPT = `
You are an expert engineering mentor planning out a project.
Based on the selected idea, taxonomy, and student constraints, generate a detailed execution plan.

STUDENT PROFILE:
Skills: {skills}
Team Size: {team_size}
Weeks Available: {weeks_available}
Constraints: {constraints}

SELECTED IDEA:
Title: {title}
Pitch: {pitch}
Taxonomy Reference Data: {taxonomy}

RULES:
1. Generate an MVP and Stretch features list.
2. Select a technology stack, providing a reason for each choice. Prefer technologies the student already knows.
3. Build a week-by-week roadmap fitting exactly {weeks_available} weeks.
4. Identify potential pitfalls.
5. Provide ONE specific "wow_factor" that is technically interesting but achievable.
6. Return JSON only, with this exact schema:
{
  "features_mvp": ["string"],
  "features_stretch": ["string"],
  "tech_stack": [
    {
      "name": "string",
      "reason": "string"
    }
  ],
  "roadmap": [
    {
      "week": "Week 1",
      "goal": "string",
      "tasks": ["string"]
    }
  ],
  "pitfalls": ["string"],
  "wow_factor": "string"
}
`;

const REPLAN_PROMPT = `
You are modifying an existing engineering project plan.

A new student constraint has been introduced.

You may modify ONLY:
- tech_stack
- roadmap

IMMUTABLE:
- features_mvp
- features_stretch
- pitfalls
- wow_factor

Do not modify, regenerate, summarize, replace, reinterpret, or recreate immutable fields.

STUDENT PROFILE: {student_profile}
SELECTED PROJECT: {project}
EXISTING TECH STACK: {tech_stack}
EXISTING ROADMAP: {roadmap}
NEW CONSTRAINT: {constraint}

Return JSON ONLY:
{
  "tech_stack": [
    {
      "name": "string",
      "reason": "string"
    }
  ],
  "roadmap": [
    {
      "week": "Week 1",
      "goal": "string",
      "tasks": ["string"]
    }
  ]
}

No other keys are permitted.
`;

const JSON_REPAIR_PROMPT = `
You are a JSON repair tool. Fix the following malformed JSON so it is valid and strictly follows its intended schema.

Malformed JSON:
{malformed_json}

Return ONLY valid JSON.
`;

module.exports = {
  IDEA_GENERATION_PROMPT,
  MENTOR_DEEP_DIVE_PROMPT,
  REPLAN_PROMPT,
  JSON_REPAIR_PROMPT
};
