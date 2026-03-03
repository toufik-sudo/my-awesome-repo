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
  | "js_function";

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
}

export interface Connection {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: Connection[];
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
    config: { model: "gemini-flash", systemPrompt: "You are a helpful assistant.", stream: true },
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
      outputs: [{ id: "out", label: "Result", type: "output" }],
    },
  },
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
