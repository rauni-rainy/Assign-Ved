"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUserPrompt = exports.SYSTEM_PROMPT = void 0;
exports.SYSTEM_PROMPT = "You are an expert educational assessment designer with deep knowledge of CBSE/NCERT curriculum standards. You create well-structured, grade-appropriate question papers. You must ALWAYS return valid JSON and nothing else — no markdown fences, no preamble, no explanation. The JSON must exactly match the schema provided.";
const JSON_SCHEMA = `
{
  "sections": [
    {
      "title": "string (e.g., Section A)",
      "instructions": "string",
      "questions": [
        {
          "questionNumber": "number",
          "text": "string",
          "type": "string (MCQ, ShortAnswer, LongAnswer, TrueFalse, FillBlank)",
          "difficulty": "string (easy, medium, hard)",
          "bloomsLevel": "string (remember, understand, apply, analyze, evaluate, create)",
          "marks": "number",
          "options": ["string"], // optional, only for MCQ
          "expectedAnswer": "string" // hidden correct answer
        }
      ]
    }
  ]
}
`;
const buildUserPrompt = (assignment) => {
    let prompt = `Create a complete question paper for the following assignment:\n`;
    prompt += `- Subject: ${assignment.subject}\n`;
    prompt += `- Grade: ${assignment.grade}\n`;
    prompt += `- Board: ${assignment.board}\n`;
    if (assignment.uploadedFileContent) {
        const context = assignment.uploadedFileContent.substring(0, 2000);
        prompt += `- Use this curriculum context: ${context}\n`;
    }
    prompt += `\nGenerate the following questions:\n`;
    assignment.questionTypes.forEach(qt => {
        prompt += `- Generate exactly ${qt.count} ${qt.type} questions worth ${qt.marksEach} marks each\n`;
    });
    prompt += `\n- Distribute difficulty as: 30% easy, 50% medium, 20% hard\n`;
    prompt += `- Assign appropriate Bloom's taxonomy levels (remember, understand, apply, analyze, evaluate, create)\n`;
    prompt += `- Group questions into sections: Section A for objective/fill-blank, Section B for short answer, Section C for long answer. Each section must have a title and an instruction line.\n`;
    if (assignment.additionalInstructions) {
        prompt += `- Additional teacher instructions: ${assignment.additionalInstructions}\n`;
    }
    prompt += `\nReturn the data strictly in the following JSON schema:\n${JSON_SCHEMA}`;
    return prompt;
};
exports.buildUserPrompt = buildUserPrompt;
