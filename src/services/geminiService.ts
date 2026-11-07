import { GoogleGenAI } from '@google/genai';
import { Partner, BrainDocument, Frontmatter } from '../types/brain';

// Initialize Gemini client if API key is provided in environment
const getApiKey = () => {
  if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) {
    return (import.meta as any).env.VITE_GEMINI_API_KEY;
  }
  return '';
};

const apiKey = getApiKey();
const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface AiTagSuggestionResult {
  suggestedTags: string[];
  suggestedCategory: string;
  suggestedStatus: string;
  suggestedOwners: Partner[];
  summary: string;
  actionItems: string[];
}

/**
 * Intelligent AI analysis to infer frontmatter metadata, tags, summary, and action items
 */
export async function analyzeDocumentWithAi(
  doc: BrainDocument,
  currentPartner: Partner
): Promise<AiTagSuggestionResult> {
  const contentSnippet = doc.content.slice(0, 3000);
  const prompt = `Analyze this markdown document from a shared couple life operating system (Key & Nura).
Document Title: "${doc.title}"
Domain: "${doc.domainId}"
Current Tags: ${JSON.stringify(doc.frontmatter.tags || [])}
Content:
${contentSnippet}

Return ONLY valid JSON matching this exact structure:
{
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4"],
  "suggestedCategory": "category name",
  "suggestedStatus": "Active" | "Draft" | "Review Needed" | "Approved",
  "suggestedOwners": ["Key"] | ["Nura"] | ["Key", "Nura"],
  "summary": "Concise 1-2 sentence executive summary for the couple",
  "actionItems": ["action item 1", "action item 2", "action item 3"]
}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags : ['priority', 'reviewed'],
          suggestedCategory: parsed.suggestedCategory || doc.domainId,
          suggestedStatus: parsed.suggestedStatus || 'Active',
          suggestedOwners: Array.isArray(parsed.suggestedOwners) ? parsed.suggestedOwners : ['Key', 'Nura'],
          summary: parsed.summary || `Executive briefing for ${doc.title}.`,
          actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent life OS heuristics fallback:', err);
    }
  }

  // High-fidelity heuristic fallback when offline or no API key configured
  const titleLower = doc.title.toLowerCase();
  const domainLower = doc.domainId.toLowerCase();
  const contentLower = doc.content.toLowerCase();

  const tags = new Set<string>(doc.frontmatter.tags || []);
  if (domainLower.includes('travel') || titleLower.includes('portugal') || titleLower.includes('lisbon')) {
    tags.add('portugal');
    tags.add('travel-2027');
    tags.add('logistics');
  } else if (domainLower.includes('finance') || titleLower.includes('budget') || titleLower.includes('saving')) {
    tags.add('finances');
    tags.add('shared-budget');
    tags.add('50-50');
  } else if (domainLower.includes('tech') || titleLower.includes('homelab') || titleLower.includes('server')) {
    tags.add('homelab');
    tags.add('systems');
    tags.add('automation');
  } else if (domainLower.includes('relation') || titleLower.includes('tradition') || titleLower.includes('date')) {
    tags.add('relationship');
    tags.add('rituals');
    tags.add('cherished');
  } else {
    tags.add('shared-os');
    tags.add('active-plan');
  }

  // Extract checklist items as action items
  const extractedActions: string[] = [];
  const lines = doc.content.split('\n');
  lines.forEach(l => {
    if (l.trim().startsWith('- [ ]') || l.trim().startsWith('- [x]')) {
      const cleaned = l.replace(/- \[(x| )\] /, '').trim();
      if (cleaned.length > 3) extractedActions.push(cleaned);
    }
  });

  if (extractedActions.length === 0) {
    extractedActions.push(`Review ${doc.title} with ${currentPartner === 'Key' ? 'Nura' : 'Key'}`);
    extractedActions.push('Confirm milestone deliverables & budget alignment');
  }

  return {
    suggestedTags: Array.from(tags).slice(0, 6),
    suggestedCategory: doc.domainId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    suggestedStatus: 'Active',
    suggestedOwners: ['Key', 'Nura'],
    summary: `Structured operational blueprint for "${doc.title}", aligning Key and Nura on priorities, action checkpoints, and collaborative execution.`,
    actionItems: extractedActions.slice(0, 4),
  };
}

/**
 * Generate a concise partner message / quick briefing for Chat
 */
export async function generatePartnerBriefingText(
  doc: BrainDocument,
  sender: Partner
): Promise<string> {
  const receiver: Partner = sender === 'Key' ? 'Nura' : 'Key';
  const prompt = `Write a warm, concise 2-sentence note from ${sender} to ${receiver} summarizing the key update in their shared life note "${doc.title}". Sound loving, practical, and clear.`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      if (response && response.text) {
        return response.text.trim();
      }
    } catch (e) {
      // fallback
    }
  }

  return `Hey ${receiver}! Just updated our "${doc.title}" plan in the Life OS with fresh checklist milestones. Take a look when you're free and let me know your thoughts! ❤️`;
}
