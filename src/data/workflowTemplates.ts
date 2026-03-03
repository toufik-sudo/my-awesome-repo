import { v4 as uuidv4 } from "uuid";
import type { Workflow, WorkflowNode, NodeType, Position } from "@/types/workflow";
import { NODE_TEMPLATES } from "@/types/workflow";

function tNode(type: NodeType, pos: Position, labelOverride?: string, configOverride?: Record<string, any>): WorkflowNode {
  const t = NODE_TEMPLATES[type];
  return {
    ...t,
    id: uuidv4(),
    label: labelOverride || t.label,
    position: pos,
    config: { ...t.config, ...configOverride },
    ports: {
      inputs: t.ports.inputs.map((p) => ({ ...p, id: `${uuidv4()}-${p.id}` })),
      outputs: t.ports.outputs.map((p) => ({ ...p, id: `${uuidv4()}-${p.id}` })),
    },
  };
}

function conn(from: WorkflowNode, to: WorkflowNode, fromPortIdx = 0, toPortIdx = 0) {
  return {
    id: uuidv4(),
    fromNodeId: from.id,
    fromPortId: from.ports.outputs[fromPortIdx].id,
    toNodeId: to.id,
    toPortId: to.ports.inputs[toPortIdx].id,
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  build: () => Workflow;
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "customer-support",
    name: "Customer Support Bot",
    description: "Handle support tickets with AI triage, satisfaction survey, and escalation to human agents.",
    icon: "🎧",
    tags: ["Support", "AI"],
    build() {
      const start = tNode("start", { x: 80, y: 220 }, "Greet Customer", { greeting: "Hi! 👋 Welcome to support. How can I help you today?" });
      const setUser = tNode("set_variable", { x: 350, y: 120 }, "Track Session", { variableName: "session_start", value: "{{timestamp}}", operation: "set" });
      const input = tNode("user_input", { x: 350, y: 280 }, "Describe Issue", { prompt: "Please describe your issue in detail...", enableSTT: true });
      const ai = tNode("ai_response", { x: 620, y: 220 }, "AI Triage", { model: "gemini-flash", systemPrompt: "You are a tier-1 support agent. Classify the issue as: billing, technical, account, or general. Provide a helpful initial response. If you can resolve it directly, do so. Otherwise indicate escalation is needed.", stream: true });
      const cond = tNode("condition", { x: 890, y: 220 }, "Needs Human?", { expression: "confidence < 0.7 || category === 'billing'" });
      const display = tNode("text_display", { x: 1160, y: 340 }, "AI Resolution", { text: "✅ **Issue Resolved**\n\n{{ai_response}}\n\nIs there anything else I can help with?", format: "markdown" });
      const buttons = tNode("button_input", { x: 1430, y: 340 }, "Satisfaction", { prompt: "How was your experience?", buttons: [{ label: "😊 Great", value: "great" }, { label: "😐 Okay", value: "okay" }, { label: "😞 Poor", value: "poor" }] });
      const email = tNode("email_sender", { x: 1160, y: 100 }, "Escalate", { to: "support-team@company.com", from: "bot@company.com", subject: "🔴 Escalation: {{category}} - Ticket #{{ticket_id}}", body: "Customer issue requires human attention.\n\nCategory: {{category}}\nDescription: {{user_message}}\nAI Analysis: {{ai_response}}" });
      const end1 = tNode("end", { x: 1700, y: 340 }, "Resolved", { message: "Thank you for your feedback! Have a wonderful day. 🎉" });
      const end2 = tNode("end", { x: 1430, y: 100 }, "Escalated", { message: "I've escalated your issue to our specialist team. You'll hear back within 2 hours. Ticket #{{ticket_id}}" });
      return {
        id: uuidv4(), name: "Customer Support Bot",
        nodes: [start, setUser, input, ai, cond, display, buttons, email, end1, end2],
        connections: [conn(start, setUser), conn(start, input), conn(input, ai), conn(ai, cond), conn(cond, email, 0), conn(cond, display, 1), conn(display, buttons), conn(buttons, end1, 0), conn(email, end2, 0)],
        globalVariables: [
          { id: uuidv4(), name: "ticket_id", type: "string", defaultValue: "", description: "Auto-generated support ticket ID" },
          { id: uuidv4(), name: "category", type: "string", defaultValue: "", description: "Issue category from AI triage" },
          { id: uuidv4(), name: "session_start", type: "string", defaultValue: "", description: "Session start timestamp" },
        ],
      };
    },
  },
  {
    id: "lead-qualifier",
    name: "Lead Qualifier",
    description: "Qualify inbound leads with progressive questions, AI scoring, and CRM integration.",
    icon: "🎯",
    tags: ["Sales", "AI"],
    build() {
      const start = tNode("start", { x: 80, y: 220 }, "Welcome", { greeting: "Welcome! 🚀 Let me help find the perfect solution for you." });
      const q1 = tNode("user_input", { x: 350, y: 120 }, "Company Info", { prompt: "What's your company name and how many employees do you have?" });
      const q2 = tNode("user_input", { x: 350, y: 320 }, "Use Case", { prompt: "What problem are you trying to solve?" });
      const q3 = tNode("button_input", { x: 620, y: 220 }, "Budget Range", { prompt: "What's your approximate budget?", buttons: [{ label: "< $1K/mo", value: "low" }, { label: "$1K-$5K/mo", value: "mid" }, { label: "$5K+/mo", value: "high" }] });
      const setVar = tNode("set_variable", { x: 890, y: 120 }, "Store Answers", { variableName: "lead_data", value: "{{answers}}", operation: "set" });
      const ai = tNode("ai_response", { x: 890, y: 320 }, "Score Lead", { model: "gemini-flash", systemPrompt: "You are a lead scoring expert. Based on company size, use case, and budget, score this lead 1-10. Output: {score: number, tier: 'hot'|'warm'|'cold', reasoning: string}.", stream: false });
      const cond = tNode("condition", { x: 1160, y: 220 }, "Hot Lead?", { expression: "score >= 7" });
      const api = tNode("api_call", { x: 1430, y: 120 }, "Add to CRM", { url: "https://api.hubspot.com/crm/v3/objects/contacts", method: "POST", body: '{"properties": {"company": "{{company}}", "lead_score": {{score}}, "budget": "{{budget}}"}}' });
      const display = tNode("text_display", { x: 1430, y: 340 }, "Nurture Path", { text: "📧 Thanks for your interest!\n\nBased on your needs, I recommend checking out:\n- Our **starter guide**\n- **Case studies** from similar companies\n\nWe'll send these to your email!", format: "markdown" });
      const end1 = tNode("end", { x: 1700, y: 120 }, "Demo Booked", { message: "Excellent! A solutions engineer will reach out within 1 hour to schedule your personalized demo. 🗓️" });
      const end2 = tNode("end", { x: 1700, y: 340 }, "Nurturing", { message: "Thanks for exploring! Check your inbox for helpful resources. We're here when you're ready! 📬" });
      return {
        id: uuidv4(), name: "Lead Qualifier",
        nodes: [start, q1, q2, q3, setVar, ai, cond, api, display, end1, end2],
        connections: [conn(start, q1), conn(q1, q2), conn(q2, q3), conn(q3, setVar, 0), conn(q3, ai, 0), conn(ai, cond), conn(cond, api, 0), conn(cond, display, 1), conn(api, end1, 0), conn(display, end2)],
        globalVariables: [
          { id: uuidv4(), name: "lead_score", type: "number", defaultValue: "0", description: "AI-calculated lead score 1-10" },
          { id: uuidv4(), name: "lead_data", type: "json", defaultValue: "{}", description: "Collected lead information" },
        ],
      };
    },
  },
  {
    id: "faq-bot",
    name: "FAQ Bot",
    description: "Answer frequently asked questions using AI + knowledge base with multi-turn conversations.",
    icon: "📚",
    tags: ["Support", "Knowledge"],
    build() {
      const start = tNode("start", { x: 80, y: 200 }, "Hello", { greeting: "Hi! 📚 I'm your knowledge assistant. Ask me anything about our product!" });
      const input = tNode("user_input", { x: 350, y: 200 }, "Ask Question", { prompt: "What would you like to know?", enableSTT: true });
      const counter = tNode("set_variable", { x: 350, y: 350 }, "Count Turns", { variableName: "turn_count", value: "1", operation: "increment" });
      const db = tNode("db_query", { x: 620, y: 200 }, "Search KB", { query: "SELECT question, answer, category FROM faq WHERE question ILIKE '%' || $1 || '%' OR answer ILIKE '%' || $1 || '%' ORDER BY similarity(question, $1) DESC LIMIT 5", type: "select" });
      const ai = tNode("ai_response", { x: 890, y: 200 }, "Generate Answer", { model: "gemini-flash", systemPrompt: "You are a knowledgeable product assistant. Use the provided FAQ context to answer accurately. If the FAQ doesn't cover it, say so honestly and suggest contacting support. Format with markdown for readability.", stream: true });
      const display = tNode("text_display", { x: 1160, y: 200 }, "Show Answer", { text: "### Answer\n\n{{ai_response}}\n\n---\n_Based on {{result_count}} knowledge base matches_", format: "markdown" });
      const buttons = tNode("button_input", { x: 1430, y: 200 }, "Next Action", { prompt: "Was this helpful?", buttons: [{ label: "✅ Yes, thanks!", value: "done" }, { label: "🔄 Ask another", value: "continue" }, { label: "👤 Talk to human", value: "escalate" }] });
      const end = tNode("end", { x: 1700, y: 200 }, "Done", { message: "Glad I could help! Come back anytime. 😊" });
      return {
        id: uuidv4(), name: "FAQ Bot",
        nodes: [start, input, counter, db, ai, display, buttons, end],
        connections: [conn(start, input), conn(input, counter), conn(input, db), conn(db, ai, 0), conn(ai, display), conn(display, buttons), conn(buttons, end, 0)],
        globalVariables: [
          { id: uuidv4(), name: "turn_count", type: "number", defaultValue: "0", description: "Number of Q&A turns in session" },
          { id: uuidv4(), name: "result_count", type: "number", defaultValue: "0", description: "KB matches found" },
        ],
      };
    },
  },
  {
    id: "data-pipeline",
    name: "Data Pipeline",
    description: "Ingest data via webhook, validate & transform with JS, store in DB, and send notifications.",
    icon: "⚡",
    tags: ["Data", "Automation"],
    build() {
      const webhook = tNode("webhook_trigger", { x: 80, y: 200 }, "Receive Payload", { url: "/api/v1/ingest", method: "POST", secret: "whsec_your_secret_here" });
      const validate = tNode("js_function", { x: 350, y: 200 }, "Validate", { code: "// Validate required fields\nconst { name, email, amount } = data;\nif (!name || !email) throw new Error('Missing required fields');\nreturn { ...data, valid: true, processedAt: new Date().toISOString() };" });
      const transform = tNode("js_function", { x: 620, y: 200 }, "Transform", { code: "// Normalize and enrich\nreturn {\n  ...data,\n  name: data.name.trim(),\n  email: data.email.toLowerCase(),\n  amount: parseFloat(data.amount) || 0,\n  currency: data.currency || 'USD'\n};" });
      const db = tNode("db_query", { x: 890, y: 200 }, "Store Record", { query: "INSERT INTO transactions (name, email, amount, currency, processed_at) VALUES ($1, $2, $3, $4, $5) RETURNING id", type: "insert" });
      const cond = tNode("condition", { x: 1160, y: 200 }, "High Value?", { expression: "amount >= 1000" });
      const email = tNode("email_sender", { x: 1430, y: 100 }, "Alert Team", { to: "finance@company.com", from: "pipeline@company.com", subject: "💰 High-value transaction: ${{amount}}", body: "A high-value transaction was processed:\n\nName: {{name}}\nEmail: {{email}}\nAmount: ${{amount}} {{currency}}\nRecord ID: {{record_id}}" });
      const end1 = tNode("end", { x: 1430, y: 300 }, "Stored", { message: "Record stored successfully" });
      const end2 = tNode("end", { x: 1700, y: 100 }, "Alerted", { message: "Record stored and team notified" });
      return {
        id: uuidv4(), name: "Data Pipeline",
        nodes: [webhook, validate, transform, db, cond, email, end1, end2],
        connections: [conn(webhook, validate), conn(validate, transform, 0), conn(transform, db, 0), conn(db, cond, 0), conn(cond, email, 0), conn(cond, end1, 1), conn(email, end2, 0)],
        globalVariables: [
          { id: uuidv4(), name: "record_id", type: "string", defaultValue: "", description: "Database record ID after insert" },
          { id: uuidv4(), name: "amount", type: "number", defaultValue: "0", description: "Transaction amount" },
        ],
      };
    },
  },
  {
    id: "onboarding-flow",
    name: "Onboarding Wizard",
    description: "Guide new users through setup with progressive steps, preferences, and a personalized welcome.",
    icon: "🧙",
    tags: ["UX", "Onboarding"],
    build() {
      const start = tNode("start", { x: 80, y: 200 }, "Welcome", { greeting: "Welcome aboard! 🎉 Let's get you set up in just a few steps." });
      const name = tNode("user_input", { x: 350, y: 200 }, "Your Name", { prompt: "What should we call you?" });
      const setName = tNode("set_variable", { x: 620, y: 100 }, "Save Name", { variableName: "user_name", value: "{{input}}", operation: "set" });
      const role = tNode("button_input", { x: 620, y: 300 }, "Your Role", { prompt: "What best describes you?", buttons: [{ label: "👩‍💻 Developer", value: "dev" }, { label: "📊 Manager", value: "mgr" }, { label: "🎨 Designer", value: "design" }] });
      const display = tNode("text_display", { x: 890, y: 200 }, "Personalized Tips", { text: "Great choice, **{{user_name}}**! 🙌\n\nHere are some tips tailored for you:\n\n{{personalized_tips}}", format: "markdown" });
      const api = tNode("api_call", { x: 1160, y: 200 }, "Create Profile", { url: "https://api.example.com/users/onboard", method: "POST", body: '{"name": "{{user_name}}", "role": "{{role}}"}' });
      const end = tNode("end", { x: 1430, y: 200 }, "Ready!", { message: "You're all set, {{user_name}}! 🚀 Enjoy exploring." });
      return {
        id: uuidv4(), name: "Onboarding Wizard",
        nodes: [start, name, setName, role, display, api, end],
        connections: [conn(start, name), conn(name, setName), conn(name, role), conn(role, display, 0), conn(display, api), conn(api, end, 0)],
        globalVariables: [
          { id: uuidv4(), name: "user_name", type: "string", defaultValue: "", description: "User's display name" },
          { id: uuidv4(), name: "role", type: "string", defaultValue: "", description: "User's selected role" },
        ],
      };
    },
  },
  {
    id: "appointment-scheduler",
    name: "Appointment Scheduler",
    description: "Let users book appointments with availability checking, confirmation, and reminder setup.",
    icon: "📅",
    tags: ["Booking", "Automation"],
    build() {
      const start = tNode("start", { x: 80, y: 200 }, "Book Appointment", { greeting: "Hi! 📅 I can help you schedule an appointment. Let's find a time that works." });
      const service = tNode("button_input", { x: 350, y: 200 }, "Select Service", { prompt: "What type of appointment?", buttons: [{ label: "📋 Consultation", value: "consult" }, { label: "🔧 Technical", value: "tech" }, { label: "💼 Sales Demo", value: "demo" }] });
      const date = tNode("user_input", { x: 620, y: 200 }, "Preferred Date", { prompt: "What date works best? (e.g., next Tuesday)" });
      const api = tNode("api_call", { x: 890, y: 200 }, "Check Availability", { url: "https://api.calendly.com/availability?date={{date}}&service={{service}}", method: "GET" });
      const display = tNode("text_display", { x: 1160, y: 200 }, "Available Slots", { text: "📋 **Available times on {{date}}:**\n\n{{available_slots}}\n\nPlease select your preferred time.", format: "markdown" });
      const confirm = tNode("user_input", { x: 1430, y: 200 }, "Confirm Time", { prompt: "Which time slot works for you?" });
      const email = tNode("email_sender", { x: 1700, y: 200 }, "Confirmation", { to: "{{user_email}}", from: "bookings@company.com", subject: "✅ Appointment Confirmed - {{date}} at {{time}}", body: "Your {{service}} appointment is confirmed!\n\nDate: {{date}}\nTime: {{time}}\n\nSee you there!" });
      const end = tNode("end", { x: 1970, y: 200 }, "Booked!", { message: "Your appointment is confirmed! 🎉 Check your email for details." });
      return {
        id: uuidv4(), name: "Appointment Scheduler",
        nodes: [start, service, date, api, display, confirm, email, end],
        connections: [conn(start, service), conn(service, date, 0), conn(date, api), conn(api, display, 0), conn(display, confirm), conn(confirm, email), conn(email, end, 0)],
        globalVariables: [
          { id: uuidv4(), name: "user_email", type: "string", defaultValue: "", description: "User's email for confirmation" },
          { id: uuidv4(), name: "service", type: "string", defaultValue: "", description: "Selected service type" },
        ],
      };
    },
  },
];
