/**
 * Utility functions for managing LLM prompts
 */

const LIGHTHOUSE_PROMPT_TEMPLATE = `You are a web performance and accessibility expert.

Given the following Lighthouse audit summary and issues, generate:

1. A concise, high-level summary of the website's overall health (2-3 sentences).
2. For each category (Performance, Accessibility, Best Practices, SEO):
   - List the top 2-3 most critical issues (if any), each with a one-sentence, actionable fix.
   - If there are no major issues, state that clearly.

Lighthouse Summary:
Performance: {performance}/100
Accessibility: {accessibility}/100
Best Practices: {bestPractices}/100
SEO: {seo}/100

Issues:
{issues}

Respond in plain text, no Markdown or bullet points. Separate sections with blank lines.`;

/**
 * Creates a prompt for Lighthouse analysis
 * @param {Object} summary - The Lighthouse summary scores
 * @param {Object} issues - The detailed issues from the audit
 * @returns {string} The formatted prompt
 */
export function createLighthousePrompt(summary, issues) {
  return LIGHTHOUSE_PROMPT_TEMPLATE
    .replace('{performance}', summary.performance)
    .replace('{accessibility}', summary.accessibility)
    .replace('{bestPractices}', summary.bestPractices)
    .replace('{seo}', summary.seo)
    .replace('{issues}', JSON.stringify(issues, null, 2));
}

/**
 * OpenAI API configuration for Lighthouse analysis
 */
export const OPENAI_CONFIG = {
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  max_tokens: 800,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
}; 