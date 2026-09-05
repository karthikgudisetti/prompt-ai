const { GoogleGenAI } = require('@google/genai');
const prompts = require('./prompts');
require('dotenv').config();

let ai;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Ensure structured JSON output via repair prompt if parsing fails
async function callGemini(promptText, schemaType = null) {
  if (!ai) {
    throw new Error("Live mode requested but GEMINI_API_KEY is missing");
  }

  // Using gemini-2.5-flash as default, since it's the current standard model
  const model = 'gemini-2.5-flash';
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Initial Gemini parse failed, attempting repair...");
    
    // Repair attempt
    try {
      const repairPrompt = prompts.JSON_REPAIR_PROMPT.replace('{malformed_json}', error.message || "Invalid JSON output from model");
      const repairResponse = await ai.models.generateContent({
        model: model,
        contents: repairPrompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      return JSON.parse(repairResponse.text);
    } catch (repairError) {
      console.error("JSON repair failed", repairError);
      throw new Error("Failed to generate valid JSON after repair attempt.");
    }
  }
}

async function generateIdeas(studentProfile, candidates) {
  const prompt = prompts.IDEA_GENERATION_PROMPT
    .replace('{name}', studentProfile.name || 'Student')
    .replace('{skills}', studentProfile.skills)
    .replace('{interests}', studentProfile.interests)
    .replace('{team_size}', studentProfile.team_size)
    .replace('{weeks_available}', studentProfile.weeks_available)
    .replace('{constraints}', studentProfile.constraints)
    .replace('{candidates}', JSON.stringify(candidates, null, 2));

  return await callGemini(prompt, 'ideas');
}

async function generateMentorPlan(studentProfile, idea, taxonomy) {
  const prompt = prompts.MENTOR_DEEP_DIVE_PROMPT
    .replace('{skills}', studentProfile.skills)
    .replace('{team_size}', studentProfile.team_size)
    .replace('{weeks_available}', studentProfile.weeks_available)
    .replace('{constraints}', studentProfile.constraints)
    .replace('{title}', idea.title)
    .replace('{pitch}', idea.pitch)
    .replace('{taxonomy}', JSON.stringify(taxonomy, null, 2));

  return await callGemini(prompt, 'mentor');
}

async function generateReplan(studentProfile, project, techStack, roadmap, constraint) {
  const prompt = prompts.REPLAN_PROMPT
    .replace('{student_profile}', JSON.stringify(studentProfile))
    .replace('{project}', JSON.stringify(project))
    .replace('{tech_stack}', JSON.stringify(techStack))
    .replace('{roadmap}', JSON.stringify(roadmap))
    .replace('{constraint}', constraint);

  return await callGemini(prompt, 'replan');
}

module.exports = {
  generateIdeas,
  generateMentorPlan,
  generateReplan,
  isLiveMode: !!ai
};
