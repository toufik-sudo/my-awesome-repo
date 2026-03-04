import React from "react";
import {
  Bot, MessageSquare, Globe, GitBranch, Zap, Play, Square,
  Mail, Webhook, Database, Code, Type, MousePointerClick, Variable,
  Box,
} from "lucide-react";
import type { NodeType } from "@/types/workflow";

export const NODE_ICONS: Record<NodeType, React.ReactNode> = {
  start: <Play className="w-4 h-4" />,
  user_input: <MessageSquare className="w-4 h-4" />,
  ai_response: <Bot className="w-4 h-4" />,
  api_call: <Globe className="w-4 h-4" />,
  condition: <GitBranch className="w-4 h-4" />,
  action: <Zap className="w-4 h-4" />,
  end: <Square className="w-4 h-4" />,
  email_sender: <Mail className="w-4 h-4" />,
  webhook_trigger: <Webhook className="w-4 h-4" />,
  db_query: <Database className="w-4 h-4" />,
  js_function: <Code className="w-4 h-4" />,
  text_display: <Type className="w-4 h-4" />,
  button_input: <MousePointerClick className="w-4 h-4" />,
  set_variable: <Variable className="w-4 h-4" />,
  component: <Box className="w-4 h-4" />,
};

export const NODE_COLORS: Record<NodeType, string> = {
  start: "bg-primary/20 border-primary text-primary",
  user_input: "bg-node-input/20 border-node-input text-node-input",
  ai_response: "bg-node-ai/20 border-node-ai text-node-ai",
  api_call: "bg-node-api/20 border-node-api text-node-api",
  condition: "bg-node-condition/20 border-node-condition text-node-condition",
  action: "bg-node-action/20 border-node-action text-node-action",
  end: "bg-muted border-muted-foreground text-muted-foreground",
  email_sender: "bg-node-email/20 border-node-email text-node-email",
  webhook_trigger: "bg-node-webhook/20 border-node-webhook text-node-webhook",
  db_query: "bg-node-db/20 border-node-db text-node-db",
  js_function: "bg-node-js/20 border-node-js text-node-js",
  text_display: "bg-node-text/20 border-node-text text-node-text",
  button_input: "bg-node-button/20 border-node-button text-node-button",
  set_variable: "bg-node-variable/20 border-node-variable text-node-variable",
  component: "bg-accent/20 border-accent text-accent",
};

export const NODE_ACCENT: Record<NodeType, string> = {
  start: "hsl(250, 80%, 65%)",
  user_input: "hsl(340, 75%, 55%)",
  ai_response: "hsl(250, 80%, 65%)",
  api_call: "hsl(170, 70%, 50%)",
  condition: "hsl(45, 90%, 55%)",
  action: "hsl(30, 90%, 55%)",
  end: "hsl(220, 10%, 55%)",
  email_sender: "hsl(200, 80%, 55%)",
  webhook_trigger: "hsl(280, 70%, 60%)",
  db_query: "hsl(160, 60%, 45%)",
  js_function: "hsl(50, 85%, 55%)",
  text_display: "hsl(190, 70%, 55%)",
  button_input: "hsl(310, 70%, 60%)",
  set_variable: "hsl(130, 60%, 50%)",
  component: "hsl(170, 70%, 50%)",
};
