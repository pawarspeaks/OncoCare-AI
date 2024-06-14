// utils/openaiUtils.js
import { config } from 'dotenv';
config();

import openai from 'openai';

const openaiClient = new openai.OpenAI(process.env.OPENAI_API_KEY);

export const generatePrompts = async (structuredData) => {
  const prompts = [];
  // Implement logic to generate prompts based on structured data
  // Example logic:
  if (structuredData.diagnosisDate) {
    const response = await openaiClient.completions.create({
      model: 'text-davinci-003', // Adjust the model based on your requirements
      prompt: `Patient Name: John Doe\nWhen was the patient diagnosed with prostate cancer?`,
      max_tokens: 50,
    });
    prompts.push({
      context: `Patient Name: John Doe`,
      prompt: `When was the patient diagnosed with prostate cancer?`,
      answer: response.data.choices[0].text.trim(),
    });
  }
  // Add more prompts as needed based on structured data

  return prompts;
};
