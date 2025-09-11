import OpenAI from "openai";

// XAI integration - following the javascript_xai blueprint pattern
const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY;

if (!apiKey) {
  throw new Error("XAI_API_KEY environment variable is required. Please set your xAI API key in the environment variables.");
}

const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: apiKey
});

export async function grokChatCompletion(messages: any[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Grok API error:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function grokLegalAssistant(userMessage: string, conversationHistory: any[] = []): Promise<string> {
  try {
    const systemPrompt = {
      role: "system",
      content: `You are a professional legal assistant for Mason Martin Law, a Hawaii-based law firm specializing in civil litigation, trial advocacy, appellate law, and military law. 

Your role is to:
- Help potential clients understand legal services
- Schedule consultations and provide office information
- Answer general questions about legal processes
- Provide information about Mason Martin's background and experience
- Direct users to appropriate resources

Key Information:
- Mason Martin: 25+ years experience, former JAG Officer, Meritorious Service Medal recipient
- Licensed in 4 states, active in federal and appellate courts
- Masters in Accounting from University of Hawaii at Manoa
- Pro Bono award recipient 2019, 2020, 2021
- Radio show "On-Air and Off-The-Record" Saturdays 10:00 AM on AM690/94.3FM
- Office in Downtown Honolulu, Hawaii
- Phone: (808) 555-1234
- Email: mason@masonmartinlaw.com

Consultation Types:
- Free 15-minute phone review
- Virtual consultation: $200/hour
- In-person meeting: $250/hour

IMPORTANT: You cannot provide specific legal advice. Always recommend scheduling a consultation for case-specific guidance. Be professional, helpful, and informative while staying within appropriate boundaries.`
    };

    const messages = [
      systemPrompt,
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: messages,
      max_tokens: 400,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please contact our office directly at (808) 555-1234 for assistance.";
  } catch (error) {
    console.error("Grok legal assistant error:", error);
    return "I'm experiencing technical difficulties. Please contact Mason Martin Law directly at (808) 555-1234 or mason@masonmartinlaw.com for assistance.";
  }
}

export async function grokDocumentAnalysis(documentText: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "You are a legal document analysis assistant. Analyze the provided document and provide a professional summary highlighting key legal points, potential issues, and recommendations."
        },
        {
          role: "user",
          content: `Please analyze this legal document and provide a summary: ${documentText}`
        }
      ],
      max_tokens: 800,
      temperature: 0.5,
    });

    return response.choices[0].message.content || "Unable to analyze document at this time.";
  } catch (error) {
    console.error("Grok document analysis error:", error);
    throw new Error("Failed to analyze document");
  }
}
