import { v4 as uuidv4 } from "uuid";

// ─── Node Types ─────────────────────────────────
export type NodeType =
  | "start"
  | "ai_response"
  | "user_input"
  | "api_call"
  | "condition"
  | "action"
  | "end"
  | "email_sender"
  | "webhook_trigger"
  | "db_query"
  | "js_function"
  | "text_display"
  | "button_input"
  | "set_variable"
  | "component";

export interface Position {
  x: number;
  y: number;
}

export interface NodePort {
  id: string;
  label: string;
  type: "input" | "output";
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  position: Position;
  config: Record<string, any>;
  ports: {
    inputs: NodePort[];
    outputs: NodePort[];
  };
  /** IDs of child nodes contained in this component (only for type "component") */
  childNodeIds?: string[];
  /** If this node is inside a component, reference the parent component ID */
  parentComponentId?: string;
}

export interface Connection {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
}

export interface GlobalVariable {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "json";
  defaultValue: string;
  description: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: Connection[];
  globalVariables?: GlobalVariable[];
}

// ─── Chat Types ─────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

// ─── Execution Types ────────────────────────────
export type ExecutionStatus = "idle" | "running" | "paused" | "completed" | "error";

export interface ExecutionState {
  status: ExecutionStatus;
  currentNodeId: string | null;
  log: { nodeId: string; label: string; type: NodeType; output: string; timestamp: number }[];
}

// ─── Node Templates ─────────────────────────────
export const NODE_TEMPLATES: Record<NodeType, Omit<WorkflowNode, "id" | "position">> = {
  start: {
    type: "start",
    label: "Start",
    config: { greeting: "Hello! How can I help you?" },
    ports: { inputs: [], outputs: [{ id: "out", label: "Next", type: "output" }] },
  },
  user_input: {
    type: "user_input",
    label: "User Input",
    config: { prompt: "Type your message...", enableSTT: true },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [{ id: "out", label: "Next", type: "output" }],
    },
  },
  ai_response: {
    type: "ai_response",
    label: "AI Response",
    config: {
      model: "gemini-flash",
      systemPrompt: "You are a helpful assistant.",
      userMessageTemplate: "{{user_input}}",
      utterances: ["Hello", "Help me with", "Tell me about"],
      variables: [] as { name: string; value: string }[],
      stream: true,
    },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [{ id: "out", label: "Next", type: "output" }],
    },
  },
  api_call: {
    type: "api_call",
    label: "API Call",
    config: { url: "", method: "GET", headers: {}, body: "" },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [
        { id: "success", label: "Success", type: "output" },
        { id: "error", label: "Error", type: "output" },
      ],
    },
  },
  condition: {
    type: "condition",
    label: "Condition",
    config: { expression: "", trueLabel: "Yes", falseLabel: "No" },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [
        { id: "true", label: "Yes", type: "output" },
        { id: "false", label: "No", type: "output" },
      ],
    },
  },
  action: {
    type: "action",
    label: "Action",
    config: { functionName: "", params: {} },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [{ id: "out", label: "Next", type: "output" }],
    },
  },
  end: {
    type: "end",
    label: "End",
    config: { message: "Goodbye!" },
    ports: { inputs: [{ id: "in", label: "In", type: "input" }], outputs: [] },
  },
  email_sender: {
    type: "email_sender",
    label: "Email Sender",
    config: { to: "", subject: "", body: "", from: "" },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [
        { id: "sent", label: "Sent", type: "output" },
        { id: "error", label: "Error", type: "output" },
      ],
    },
  },
  webhook_trigger: {
    type: "webhook_trigger",
    label: "Webhook Trigger",
    config: { url: "", method: "POST", secret: "" },
    ports: {
      inputs: [],
      outputs: [{ id: "out", label: "Payload", type: "output" }],
    },
  },
  db_query: {
    type: "db_query",
    label: "Database Query",
    config: { query: "", connectionString: "", type: "select" },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [
        { id: "result", label: "Result", type: "output" },
        { id: "error", label: "Error", type: "output" },
      ],
    },
  },
  js_function: {
    type: "js_function",
    label: "JS Function",
    config: { code: "// input is available as `data`\nreturn data;" },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [
        { id: "out", label: "Result", type: "output" },
        { id: "error", label: "Error", type: "output" },
      ],
    },
  },
  text_display: {
    type: "text_display",
    label: "Text Display",
    config: { text: "Hello {{user_name}}!", format: "markdown" },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [{ id: "out", label: "Next", type: "output" }],
    },
  },
  button_input: {
    type: "button_input",
    label: "Button Choice",
    config: {
      prompt: "Choose an option:",
      buttons: [
        { label: "Option A", value: "a", bgColor: "", textColor: "", fontSize: "14" },
        { label: "Option B", value: "b", bgColor: "", textColor: "", fontSize: "14" },
        { label: "Option C", value: "c", bgColor: "", textColor: "", fontSize: "14" },
      ],
      layout: "horizontal" as "horizontal" | "vertical",
    },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [
        { id: "selected", label: "Selected", type: "output" },
      ],
    },
  },
  set_variable: {
    type: "set_variable",
    label: "Set Variable",
    config: { variableName: "", value: "", operation: "set" },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [{ id: "out", label: "Next", type: "output" }],
    },
  },
  component: {
    type: "component",
    label: "Component",
    config: { name: "My Component", description: "" },
    ports: {
      inputs: [{ id: "in", label: "In", type: "input" }],
      outputs: [{ id: "out", label: "Out", type: "output" }],
    },
  },
};

// ─── Example configs for each block type ────────
export const NODE_EXAMPLES: Record<NodeType, { title: string; config: Record<string, any> }[]> = {
  start: [
    { title: "Friendly greeting", config: { greeting: "Hey there! 👋 I'm your AI assistant. How can I help?" } },
    { title: "Formal welcome", config: { greeting: "Welcome. Please describe your inquiry and I'll assist you." } },
  ],
  user_input: [
    { title: "Email collection", config: { prompt: "What's your email address?", enableSTT: false } },
    { title: "Voice-first", config: { prompt: "Tell me what you need — I'm listening!", enableSTT: true } },
  ],
  ai_response: [
    { title: "Code assistant", config: { model: "gemini-flash", systemPrompt: "You are an expert programmer. Provide clean, well-commented code with explanations.", stream: true } },
    { title: "Translator", config: { model: "gemini-flash", systemPrompt: "You are a translator. Translate the user's text to the target language specified. Keep the original tone.", stream: true } },
    { title: "Summarizer", config: { model: "gemini-flash", systemPrompt: "Summarize the following text in 3 bullet points. Be concise.", stream: false } },
  ],
  api_call: [
    { title: "Weather API", config: { url: "https://api.openweathermap.org/data/2.5/weather?q={{city}}&appid={{API_KEY}}", method: "GET", body: "" } },
    { title: "Slack notification", config: { url: "https://hooks.slack.com/services/YOUR/HOOK/URL", method: "POST", body: '{"text": "{{message}}"}' } },
    { title: "REST create", config: { url: "https://api.example.com/items", method: "POST", body: '{"name": "{{item_name}}", "quantity": {{qty}}}' } },
  ],
  condition: [
    { title: "Sentiment check", config: { expression: "sentiment === 'positive'" } },
    { title: "Auth check", config: { expression: "user.isAuthenticated === true" } },
    { title: "Threshold", config: { expression: "score >= 80" } },
  ],
  action: [
    { title: "Log event", config: { functionName: "logAnalyticsEvent", params: { event: "user_action" } } },
    { title: "Clear session", config: { functionName: "clearSessionData", params: {} } },
  ],
  end: [
    { title: "Thank you", config: { message: "Thanks for chatting! Have a great day. 🎉" } },
    { title: "Ticket created", config: { message: "Your ticket #{{ticket_id}} has been created. We'll follow up via email." } },
  ],
  email_sender: [
    { title: "Welcome email", config: { to: "{{user_email}}", from: "welcome@app.com", subject: "Welcome to {{app_name}}!", body: "Hi {{user_name}},\n\nWelcome aboard! We're thrilled to have you." } },
    { title: "Alert email", config: { to: "ops@company.com", from: "alerts@app.com", subject: "⚠️ Alert: {{alert_type}}", body: "An alert was triggered:\n\n{{alert_details}}" } },
  ],
  webhook_trigger: [
    { title: "Stripe webhook", config: { url: "/webhooks/stripe", method: "POST", secret: "whsec_..." } },
    { title: "GitHub webhook", config: { url: "/webhooks/github", method: "POST", secret: "" } },
  ],
  db_query: [
    { title: "Find user", config: { query: "SELECT * FROM users WHERE email = $1 LIMIT 1", type: "select" } },
    { title: "Insert record", config: { query: "INSERT INTO logs (event, data, created_at) VALUES ($1, $2, NOW())", type: "insert" } },
    { title: "Analytics query", config: { query: "SELECT date_trunc('day', created_at) AS day, COUNT(*) FROM events GROUP BY 1 ORDER BY 1 DESC LIMIT 30", type: "select" } },
  ],
  js_function: [
    { title: "Parse JSON", config: { code: "// Parse and extract fields\nconst parsed = JSON.parse(data.body);\nreturn { name: parsed.name, email: parsed.email };" } },
    { title: "Format currency", config: { code: "// Format number as USD\nconst amount = parseFloat(data.amount);\nreturn { formatted: `$${amount.toFixed(2)}` };" } },
    { title: "Array filter", config: { code: "// Filter active items\nreturn data.items.filter(item => item.status === 'active');" } },
  ],
  text_display: [
    { title: "Welcome card", config: { text: "# Welcome, {{user_name}}!\nHere's your dashboard summary.", format: "markdown" } },
    { title: "Status message", config: { text: "✅ Your order **#{{order_id}}** is confirmed and being processed.", format: "markdown" } },
  ],
  button_input: [
    { title: "Satisfaction survey", config: { prompt: "How was your experience?", buttons: [{ label: "😊 Great", value: "great" }, { label: "😐 Okay", value: "okay" }, { label: "😞 Poor", value: "poor" }] } },
    { title: "Department routing", config: { prompt: "Which department do you need?", buttons: [{ label: "Sales", value: "sales" }, { label: "Support", value: "support" }, { label: "Billing", value: "billing" }] } },
  ],
  set_variable: [
    { title: "Set user name", config: { variableName: "user_name", value: "{{input}}", operation: "set" } },
    { title: "Increment counter", config: { variableName: "attempt_count", value: "1", operation: "increment" } },
  ],
  component: [
    { title: "API Gateway", config: { name: "API Gateway", description: "Handles authentication and rate limiting before forwarding requests" } },
    { title: "Email Pipeline", config: { name: "Email Pipeline", description: "Composes, validates, and sends emails with retry logic" } },
  ],
};

export function createNode(type: NodeType, position: Position): WorkflowNode {
  const template = NODE_TEMPLATES[type];
  return {
    ...template,
    id: uuidv4(),
    position,
    ports: {
      inputs: template.ports.inputs.map((p) => ({ ...p, id: `${uuidv4()}-${p.id}` })),
      outputs: template.ports.outputs.map((p) => ({ ...p, id: `${uuidv4()}-${p.id}` })),
    },
  };
}
