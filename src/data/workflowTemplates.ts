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
    description: "Handle support tickets with AI triage, auto-responses, and escalation paths.",
    icon: "🎧",
    tags: ["Support", "AI"],
    build() {
      const start = tNode("start", { x: 80, y: 220 }, "Greet Customer", { greeting: "Hi! How can I help you today?" });
      const input = tNode("user_input", { x: 350, y: 220 }, "Get Issue", { prompt: "Describe your issue..." });
      const ai = tNode("ai_response", { x: 620, y: 120 }, "AI Triage", { model: "gemini-flash", systemPrompt: "You are a support agent. Classify the issue as billing, technical, or general. Provide a helpful response." });
      const cond = tNode("condition", { x: 890, y: 220 }, "Needs Human?", { expression: "confidence < 0.7", trueLabel: "Escalate", falseLabel: "Auto-reply" });
      const email = tNode("email_sender", { x: 1160, y: 100 }, "Escalate Email", { to: "support@company.com", subject: "Escalation: {{issue}}" });
      const end1 = tNode("end", { x: 1160, y: 340 }, "Resolved", { message: "Glad I could help! Anything else?" });
      const end2 = tNode("end", { x: 1430, y: 100 }, "Escalated", { message: "I've escalated your issue to our team. They'll reach out within 24h." });
      return {
        id: uuidv4(), name: "Customer Support Bot",
        nodes: [start, input, ai, cond, email, end1, end2],
        connections: [conn(start, input), conn(input, ai), conn(ai, cond), conn(cond, email, 0), conn(cond, end1, 1), conn(email, end2, 0)],
      };
    },
  },
  {
    id: "lead-qualifier",
    name: "Lead Qualifier",
    description: "Qualify inbound leads with smart questions, score them, and route to the right team.",
    icon: "🎯",
    tags: ["Sales", "AI"],
    build() {
      const start = tNode("start", { x: 80, y: 220 }, "Welcome", { greeting: "Welcome! Let me learn about your needs." });
      const q1 = tNode("user_input", { x: 350, y: 220 }, "Company Size", { prompt: "How many employees does your company have?" });
      const q2 = tNode("user_input", { x: 620, y: 220 }, "Budget", { prompt: "What's your approximate budget range?" });
      const ai = tNode("ai_response", { x: 890, y: 220 }, "Score Lead", { model: "gemini-flash", systemPrompt: "Score this lead 1-10 based on company size and budget. Output JSON: {score, tier}." });
      const cond = tNode("condition", { x: 1160, y: 220 }, "High Value?", { expression: "score >= 7" });
      const api = tNode("api_call", { x: 1430, y: 120 }, "Add to CRM", { url: "https://api.crm.com/leads", method: "POST" });
      const end1 = tNode("end", { x: 1430, y: 340 }, "Nurture", { message: "Thanks! We'll send you resources to help you decide." });
      const end2 = tNode("end", { x: 1700, y: 120 }, "Booked", { message: "Great fit! A rep will reach out to schedule a demo." });
      return {
        id: uuidv4(), name: "Lead Qualifier",
        nodes: [start, q1, q2, ai, cond, api, end1, end2],
        connections: [conn(start, q1), conn(q1, q2), conn(q2, ai), conn(ai, cond), conn(cond, api, 0), conn(cond, end1, 1), conn(api, end2, 0)],
      };
    },
  },
  {
    id: "faq-bot",
    name: "FAQ Bot",
    description: "Answer frequently asked questions using an AI knowledge base with fallback to human support.",
    icon: "📚",
    tags: ["Support", "Knowledge"],
    build() {
      const start = tNode("start", { x: 80, y: 200 }, "Hello", { greeting: "Hi! Ask me anything about our product." });
      const input = tNode("user_input", { x: 350, y: 200 }, "Question", { prompt: "What would you like to know?" });
      const db = tNode("db_query", { x: 620, y: 200 }, "Search KB", { query: "SELECT answer FROM faq WHERE question ILIKE '%{{input}}%' LIMIT 3" });
      const ai = tNode("ai_response", { x: 890, y: 200 }, "Generate Answer", { model: "gemini-flash", systemPrompt: "Answer the user's question using the provided FAQ context. Be concise and helpful." });
      const end = tNode("end", { x: 1160, y: 200 }, "Done", { message: "Hope that helps! Ask another question anytime." });
      return {
        id: uuidv4(), name: "FAQ Bot",
        nodes: [start, input, db, ai, end],
        connections: [conn(start, input), conn(input, db), conn(db, ai, 0), conn(ai, end)],
      };
    },
  },
  {
    id: "data-pipeline",
    name: "Data Pipeline",
    description: "Fetch data from a webhook, transform it with JS, store in a database, and notify via email.",
    icon: "⚡",
    tags: ["Data", "Automation"],
    build() {
      const webhook = tNode("webhook_trigger", { x: 80, y: 200 }, "Receive Data", { url: "/api/ingest", method: "POST" });
      const js = tNode("js_function", { x: 350, y: 200 }, "Transform", { code: "// Clean and transform\nreturn { ...data, processedAt: Date.now() };" });
      const db = tNode("db_query", { x: 620, y: 200 }, "Store", { query: "INSERT INTO records (data) VALUES ($1)", type: "insert" });
      const email = tNode("email_sender", { x: 890, y: 200 }, "Notify", { to: "team@company.com", subject: "New record processed" });
      const end = tNode("end", { x: 1160, y: 200 }, "Complete");
      return {
        id: uuidv4(), name: "Data Pipeline",
        nodes: [webhook, js, db, email, end],
        connections: [conn(webhook, js), conn(js, db), conn(db, email, 0), conn(email, end, 0)],
      };
    },
  },
];
