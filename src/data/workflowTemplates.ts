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
  // ── Customer Support Bot ──────────────────────────
  {
    id: "customer-support",
    name: "Customer Support Bot",
    description: "AI-powered support with smart triage, satisfaction tracking, and human escalation workflows.",
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

  // ── Lead Qualifier ────────────────────────────────
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

  // ── FAQ Bot ───────────────────────────────────────
  {
    id: "faq-bot",
    name: "FAQ Bot",
    description: "AI knowledge assistant with multi-turn conversations, KB search, and smart escalation.",
    icon: "📚",
    tags: ["Support", "Knowledge"],
    build() {
      const start = tNode("start", { x: 80, y: 200 }, "Hello", { greeting: "Hi! 📚 I'm your knowledge assistant. Ask me anything about our product!" });
      const input = tNode("user_input", { x: 350, y: 200 }, "Ask Question", { prompt: "What would you like to know?", enableSTT: true });
      const counter = tNode("set_variable", { x: 350, y: 350 }, "Count Turns", { variableName: "turn_count", value: "1", operation: "increment" });
      const db = tNode("db_query", { x: 620, y: 200 }, "Search KB", { query: "SELECT question, answer, category FROM faq WHERE question ILIKE '%' || $1 || '%' ORDER BY similarity(question, $1) DESC LIMIT 5", type: "select" });
      const ai = tNode("ai_response", { x: 890, y: 200 }, "Generate Answer", { model: "gemini-flash", systemPrompt: "You are a knowledgeable product assistant. Use the provided FAQ context to answer accurately. If the FAQ doesn't cover it, say so honestly and suggest contacting support. Format with markdown.", stream: true });
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

  // ── Data Pipeline ─────────────────────────────────
  {
    id: "data-pipeline",
    name: "Data Pipeline",
    description: "Ingest, validate, transform, store, and notify — full ETL automation.",
    icon: "⚡",
    tags: ["Data", "Automation"],
    build() {
      const webhook = tNode("webhook_trigger", { x: 80, y: 200 }, "Receive Payload", { url: "/api/v1/ingest", method: "POST", secret: "whsec_your_secret_here" });
      const validate = tNode("js_function", { x: 350, y: 200 }, "Validate", { code: "const { name, email, amount } = data;\nif (!name || !email) throw new Error('Missing required fields');\nreturn { ...data, valid: true, processedAt: new Date().toISOString() };" });
      const transform = tNode("js_function", { x: 620, y: 200 }, "Transform", { code: "return {\n  ...data,\n  name: data.name.trim(),\n  email: data.email.toLowerCase(),\n  amount: parseFloat(data.amount) || 0,\n  currency: data.currency || 'USD'\n};" });
      const db = tNode("db_query", { x: 890, y: 200 }, "Store Record", { query: "INSERT INTO transactions (name, email, amount, currency, processed_at) VALUES ($1, $2, $3, $4, $5) RETURNING id", type: "insert" });
      const cond = tNode("condition", { x: 1160, y: 200 }, "High Value?", { expression: "amount >= 1000" });
      const email = tNode("email_sender", { x: 1430, y: 100 }, "Alert Team", { to: "finance@company.com", from: "pipeline@company.com", subject: "💰 High-value transaction: ${{amount}}", body: "A high-value transaction was processed:\n\nName: {{name}}\nEmail: {{email}}\nAmount: ${{amount}} {{currency}}" });
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

  // ── Onboarding Wizard ─────────────────────────────
  {
    id: "onboarding-flow",
    name: "Onboarding Wizard",
    description: "Guide new users through personalized setup with role-based tips and profile creation.",
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

  // ── Appointment Scheduler ─────────────────────────
  {
    id: "appointment-scheduler",
    name: "Appointment Scheduler",
    description: "Book appointments with availability checks, confirmations, and automated reminders.",
    icon: "📅",
    tags: ["Booking", "Automation"],
    build() {
      const start = tNode("start", { x: 80, y: 200 }, "Book Appointment", { greeting: "Hi! 📅 I can help you schedule an appointment. Let's find a time that works." });
      const service = tNode("button_input", { x: 350, y: 200 }, "Select Service", { prompt: "What type of appointment?", buttons: [{ label: "📋 Consultation", value: "consult" }, { label: "🔧 Technical", value: "tech" }, { label: "💼 Sales Demo", value: "demo" }] });
      const date = tNode("user_input", { x: 620, y: 200 }, "Preferred Date", { prompt: "What date works best? (e.g., next Tuesday)" });
      const api = tNode("api_call", { x: 890, y: 200 }, "Check Availability", { url: "https://api.calendly.com/availability?date={{date}}&service={{service}}", method: "GET" });
      const display = tNode("text_display", { x: 1160, y: 200 }, "Available Slots", { text: "📋 **Available times on {{date}}:**\n\n{{available_slots}}\n\nPlease select your preferred time.", format: "markdown" });
      const confirm = tNode("user_input", { x: 1430, y: 200 }, "Confirm Time", { prompt: "Which time slot works for you?" });
      const email = tNode("email_sender", { x: 1700, y: 200 }, "Confirmation", { to: "{{user_email}}", from: "bookings@company.com", subject: "✅ Appointment Confirmed - {{date}} at {{time}}", body: "Your {{service}} appointment is confirmed!\n\nDate: {{date}}\nTime: {{time}}" });
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

  // ── Property Rental Assistant ─────────────────────
  {
    id: "property-rental",
    name: "Property Rental Assistant",
    description: "Professional rental agent for houses, apartments, and hotels with gallery, booking, and payment.",
    icon: "🏠",
    tags: ["Real Estate", "Booking", "AI"],
    build() {
      const start = tNode("start", { x: 80, y: 260 }, "Welcome", { greeting: "Welcome to **LuxeStay** 🏡✨\n\nYour premium rental assistant. I'll help you find the perfect property — whether it's a cozy apartment, a spacious house, or a luxury hotel suite." });
      const propType = tNode("button_input", { x: 380, y: 160 }, "Property Type", { prompt: "What type of property are you looking for?", buttons: [{ label: "🏢 Apartment", value: "apartment", bgColor: "#6366f1", textColor: "#ffffff" }, { label: "🏠 House", value: "house", bgColor: "#8b5cf6", textColor: "#ffffff" }, { label: "🏨 Hotel Suite", value: "hotel", bgColor: "#a855f7", textColor: "#ffffff" }, { label: "🏖️ Vacation Villa", value: "villa", bgColor: "#d946ef", textColor: "#ffffff" }], layout: "vertical" });
      const location = tNode("user_input", { x: 380, y: 380 }, "Location & Dates", { prompt: "📍 Where would you like to stay and for what dates?\n\nExample: \"Paris, March 15-22\" or \"New York, 2 weeks from now\"", enableSTT: true });
      const setLoc = tNode("set_variable", { x: 680, y: 160 }, "Save Preferences", { variableName: "search_criteria", value: '{"type": "{{property_type}}", "location": "{{location}}", "dates": "{{dates}}"}', operation: "set" });
      const guests = tNode("button_input", { x: 680, y: 380 }, "Guests & Budget", { prompt: "How many guests and what's your nightly budget?", buttons: [{ label: "👤 1-2 · Under $100", value: "small_budget" }, { label: "👥 3-4 · $100-$300", value: "medium_mid" }, { label: "👨‍👩‍👧‍👦 5+ · $300+", value: "large_premium" }] });
      const searchApi = tNode("api_call", { x: 980, y: 260 }, "Search Properties", { url: "https://api.luxestay.com/v2/properties/search", method: "POST", body: '{"type": "{{property_type}}", "location": "{{location}}", "guests": "{{guests}}", "budget": "{{budget}}", "check_in": "{{check_in}}", "check_out": "{{check_out}}"}' });
      const aiRecommend = tNode("ai_response", { x: 1280, y: 160 }, "AI Recommendations", { model: "gemini-flash", systemPrompt: "You are a luxury property concierge. Analyze the search results and recommend the top 3 properties. For each, highlight: location benefits, unique amenities, value for money, and nearby attractions. Be enthusiastic but honest. Use emojis sparingly for visual appeal.", stream: true });
      const gallery = tNode("text_display", { x: 1280, y: 380 }, "Property Gallery", { text: "## 🏆 Top Picks For You\n\n---\n\n### 1. {{prop1_name}}\n📍 {{prop1_location}} · ⭐ {{prop1_rating}}/5\n\n![{{prop1_name}}]({{prop1_image}})\n\n💰 **{{prop1_price}}/night** · 🛏️ {{prop1_beds}} beds · 🚿 {{prop1_baths}} baths\n\n{{prop1_description}}\n\n**Amenities:** {{prop1_amenities}}\n\n---\n\n### 2. {{prop2_name}}\n📍 {{prop2_location}} · ⭐ {{prop2_rating}}/5\n\n![{{prop2_name}}]({{prop2_image}})\n\n💰 **{{prop2_price}}/night** · 🛏️ {{prop2_beds}} beds · 🚿 {{prop2_baths}} baths\n\n{{prop2_description}}\n\n---\n\n### 3. {{prop3_name}}\n📍 {{prop3_location}} · ⭐ {{prop3_rating}}/5\n\n![{{prop3_name}}]({{prop3_image}})\n\n💰 **{{prop3_price}}/night** · 🛏️ {{prop3_beds}} beds\n\n{{prop3_description}}", format: "markdown" });
      const selectProp = tNode("button_input", { x: 1580, y: 260 }, "Select Property", { prompt: "Which property would you like to book?", buttons: [{ label: "1️⃣ First Pick", value: "prop1", bgColor: "#10b981", textColor: "#ffffff" }, { label: "2️⃣ Second Pick", value: "prop2", bgColor: "#3b82f6", textColor: "#ffffff" }, { label: "3️⃣ Third Pick", value: "prop3", bgColor: "#8b5cf6", textColor: "#ffffff" }, { label: "🔍 See More", value: "more" }] });
      const contactInfo = tNode("user_input", { x: 1880, y: 160 }, "Guest Details", { prompt: "Great choice! 🎉 Please provide your booking details:\n\n• Full name\n• Email address\n• Phone number\n• Any special requests (late check-in, extra bed, etc.)" });
      const bookingApi = tNode("api_call", { x: 1880, y: 380 }, "Create Booking", { url: "https://api.luxestay.com/v2/bookings", method: "POST", body: '{"property_id": "{{selected_property_id}}", "guest_name": "{{guest_name}}", "email": "{{guest_email}}", "phone": "{{guest_phone}}", "check_in": "{{check_in}}", "check_out": "{{check_out}}", "guests": {{guest_count}}, "special_requests": "{{special_requests}}"}' });
      const confirmEmail = tNode("email_sender", { x: 2180, y: 260 }, "Booking Confirmation", { to: "{{guest_email}}", from: "reservations@luxestay.com", subject: "🎉 Booking Confirmed — {{prop_name}} | {{check_in}} to {{check_out}}", body: "Dear {{guest_name}},\n\nYour reservation is confirmed!\n\n🏡 Property: {{prop_name}}\n📍 Location: {{prop_location}}\n📅 Check-in: {{check_in}}\n📅 Check-out: {{check_out}}\n👥 Guests: {{guest_count}}\n💰 Total: {{total_price}}\n\nBooking ID: #{{booking_id}}\n\nSpecial Requests: {{special_requests}}\n\n📞 Need help? Call us at +1-800-LUXE-STAY\n\nWe look forward to hosting you!\n— The LuxeStay Team" });
      const summary = tNode("text_display", { x: 2480, y: 260 }, "Booking Summary", { text: "## ✅ Booking Confirmed!\n\n🏡 **{{prop_name}}**\n📍 {{prop_location}}\n\n| Detail | Info |\n|--------|------|\n| 📅 Check-in | {{check_in}} |\n| 📅 Check-out | {{check_out}} |\n| 👥 Guests | {{guest_count}} |\n| 💰 Total | {{total_price}} |\n| 🔖 Booking ID | #{{booking_id}} |\n\n---\n\n📧 A confirmation email has been sent to **{{guest_email}}**\n\n💡 **Tip:** Save your Booking ID for easy check-in!", format: "markdown" });
      const feedback = tNode("button_input", { x: 2780, y: 260 }, "Experience", { prompt: "How was your booking experience?", buttons: [{ label: "🌟 Excellent!", value: "excellent" }, { label: "👍 Good", value: "good" }, { label: "💬 Needs Improvement", value: "improve" }] });
      const end = tNode("end", { x: 3080, y: 260 }, "Thank You", { message: "Thank you for choosing LuxeStay! 🏡✨\n\nWe can't wait to welcome you. Have a wonderful trip!\n\n📱 Download our app for mobile check-in and local recommendations." });
      return {
        id: uuidv4(), name: "Property Rental Assistant",
        nodes: [start, propType, location, setLoc, guests, searchApi, aiRecommend, gallery, selectProp, contactInfo, bookingApi, confirmEmail, summary, feedback, end],
        connections: [
          conn(start, propType), conn(start, location),
          conn(propType, setLoc, 0), conn(location, guests),
          conn(setLoc, searchApi), conn(guests, searchApi, 0),
          conn(searchApi, aiRecommend, 0), conn(searchApi, gallery, 0),
          conn(aiRecommend, selectProp), conn(gallery, selectProp),
          conn(selectProp, contactInfo, 0),
          conn(contactInfo, bookingApi),
          conn(bookingApi, confirmEmail, 0),
          conn(confirmEmail, summary, 0),
          conn(summary, feedback),
          conn(feedback, end, 0),
        ],
        globalVariables: [
          { id: uuidv4(), name: "property_type", type: "string", defaultValue: "", description: "Selected property type" },
          { id: uuidv4(), name: "location", type: "string", defaultValue: "", description: "Desired location" },
          { id: uuidv4(), name: "check_in", type: "string", defaultValue: "", description: "Check-in date" },
          { id: uuidv4(), name: "check_out", type: "string", defaultValue: "", description: "Check-out date" },
          { id: uuidv4(), name: "guest_count", type: "number", defaultValue: "1", description: "Number of guests" },
          { id: uuidv4(), name: "booking_id", type: "string", defaultValue: "", description: "Generated booking reference" },
          { id: uuidv4(), name: "total_price", type: "string", defaultValue: "", description: "Calculated total price" },
          { id: uuidv4(), name: "search_criteria", type: "json", defaultValue: "{}", description: "Combined search filters" },
        ],
      };
    },
  },

  // ── E-Commerce Shopping Assistant ─────────────────
  {
    id: "ecommerce-assistant",
    name: "E-Commerce Assistant",
    description: "AI shopping assistant with product search, size recommendations, cart management, and checkout.",
    icon: "🛍️",
    tags: ["E-Commerce", "AI", "Sales"],
    build() {
      const start = tNode("start", { x: 80, y: 260 }, "Welcome Shopper", { greeting: "Welcome to **StyleHub** 👗✨\n\nI'm your personal shopping assistant! I'll help you find exactly what you're looking for." });
      const category = tNode("button_input", { x: 380, y: 260 }, "Shop Category", { prompt: "What are you shopping for today?", buttons: [{ label: "👔 Clothing", value: "clothing", bgColor: "#ec4899", textColor: "#fff" }, { label: "👟 Shoes", value: "shoes", bgColor: "#f97316", textColor: "#fff" }, { label: "💍 Accessories", value: "accessories", bgColor: "#eab308", textColor: "#fff" }, { label: "🎁 Gifts", value: "gifts", bgColor: "#22c55e", textColor: "#fff" }], layout: "vertical" });
      const prefs = tNode("user_input", { x: 680, y: 260 }, "Style Preferences", { prompt: "Tell me about your style preferences:\n• Preferred colors or patterns?\n• Occasion (casual, formal, sports)?\n• Any specific brands you love?", enableSTT: true });
      const ai = tNode("ai_response", { x: 980, y: 260 }, "AI Stylist", { model: "gemini-flash", systemPrompt: "You are a professional fashion stylist AI. Recommend 3 products based on the user's preferences. Include product name, price, key features, and why it matches their style. Be enthusiastic and fashion-forward.", stream: true });
      const products = tNode("text_display", { x: 1280, y: 260 }, "Product Showcase", { text: "## 🛍️ Curated For You\n\n{{ai_response}}\n\n---\n\n💳 All items include free shipping over $50\n🔄 30-day hassle-free returns", format: "markdown" });
      const action = tNode("button_input", { x: 1580, y: 260 }, "What's Next?", { prompt: "What would you like to do?", buttons: [{ label: "🛒 Add to Cart", value: "cart" }, { label: "📏 Size Guide", value: "size" }, { label: "🔍 More Options", value: "more" }, { label: "💬 Ask a Question", value: "question" }] });
      const sizeAi = tNode("ai_response", { x: 1880, y: 140 }, "Size Helper", { model: "gemini-flash", systemPrompt: "Help the user find their perfect size. Ask about height, weight, and usual sizes. Provide specific size recommendations for the selected items.", stream: true });
      const checkout = tNode("text_display", { x: 1880, y: 380 }, "Cart Summary", { text: "## 🛒 Your Cart\n\n{{cart_items}}\n\n---\n\n**Subtotal:** {{subtotal}}\n**Shipping:** Free ✨\n**Total:** **{{total}}**\n\n🔒 Secure checkout powered by Stripe", format: "markdown" });
      const end = tNode("end", { x: 2180, y: 260 }, "Thank You!", { message: "Thanks for shopping with StyleHub! 🛍️\n\nYour order is being processed. Check your email for tracking info.\n\n💝 Use code WELCOME10 for 10% off your next order!" });
      return {
        id: uuidv4(), name: "E-Commerce Assistant",
        nodes: [start, category, prefs, ai, products, action, sizeAi, checkout, end],
        connections: [conn(start, category), conn(category, prefs, 0), conn(prefs, ai), conn(ai, products), conn(products, action), conn(action, sizeAi, 0), conn(action, checkout, 1), conn(sizeAi, checkout), conn(checkout, end)],
        globalVariables: [
          { id: uuidv4(), name: "cart_items", type: "json", defaultValue: "[]", description: "Shopping cart contents" },
          { id: uuidv4(), name: "total", type: "string", defaultValue: "$0.00", description: "Cart total" },
        ],
      };
    },
  },

  // ── Restaurant Reservation Bot ────────────────────
  {
    id: "restaurant-reservation",
    name: "Restaurant Concierge",
    description: "Fine dining reservation assistant with menu preview, dietary filters, and table preferences.",
    icon: "🍽️",
    tags: ["Hospitality", "Booking"],
    build() {
      const start = tNode("start", { x: 80, y: 260 }, "Welcome", { greeting: "Welcome to **Maison Gourmet** 🍽️\n\nLet me help you reserve the perfect dining experience." });
      const occasion = tNode("button_input", { x: 380, y: 260 }, "Occasion", { prompt: "What's the occasion?", buttons: [{ label: "🥂 Celebration", value: "celebration", bgColor: "#d97706", textColor: "#fff" }, { label: "💼 Business", value: "business", bgColor: "#1e40af", textColor: "#fff" }, { label: "💑 Date Night", value: "date", bgColor: "#be185d", textColor: "#fff" }, { label: "👨‍👩‍👧‍👦 Family", value: "family", bgColor: "#15803d", textColor: "#fff" }] });
      const details = tNode("user_input", { x: 680, y: 260 }, "Reservation Details", { prompt: "Please share:\n• Date and preferred time\n• Number of guests\n• Any dietary requirements (vegetarian, gluten-free, allergies)" });
      const dietary = tNode("button_input", { x: 980, y: 160 }, "Seating Preference", { prompt: "Where would you like to sit?", buttons: [{ label: "🪟 Window Table", value: "window" }, { label: "🌿 Garden Terrace", value: "terrace" }, { label: "🕯️ Private Room", value: "private" }] });
      const menuAi = tNode("ai_response", { x: 980, y: 380 }, "Menu Suggestions", { model: "gemini-flash", systemPrompt: "You are the maître d' at a fine dining restaurant. Based on the occasion, dietary needs, and number of guests, suggest a curated 3-course menu with wine pairings. Include prices. Be elegant and descriptive.", stream: true });
      const menuDisplay = tNode("text_display", { x: 1280, y: 260 }, "Tonight's Menu", { text: "## 📜 Chef's Recommendations\n\n{{ai_response}}\n\n---\n\n🍷 *Wine pairing available for an additional $45/person*\n\n📸 Tag us @MaisonGourmet for a complimentary dessert!", format: "markdown" });
      const confirm = tNode("button_input", { x: 1580, y: 260 }, "Confirm", { prompt: "Shall I confirm your reservation?", buttons: [{ label: "✅ Book Now", value: "confirm", bgColor: "#16a34a", textColor: "#fff" }, { label: "📅 Change Date", value: "change" }, { label: "📞 Call Us", value: "call" }] });
      const email = tNode("email_sender", { x: 1880, y: 260 }, "Send Confirmation", { to: "{{guest_email}}", from: "reservations@maisongourmet.com", subject: "🍽️ Reservation Confirmed — {{date}} at {{time}}", body: "Dear {{guest_name}},\n\nYour table is reserved!\n\n📅 {{date}} at {{time}}\n👥 {{guests}} guests\n🪑 {{seating}}\n\nBooking Ref: #{{booking_ref}}\n\n— Maison Gourmet" });
      const end = tNode("end", { x: 2180, y: 260 }, "Bon Appétit!", { message: "Your reservation is confirmed! 🍽️\n\nWe look forward to welcoming you. Bon appétit! ✨" });
      return {
        id: uuidv4(), name: "Restaurant Concierge",
        nodes: [start, occasion, details, dietary, menuAi, menuDisplay, confirm, email, end],
        connections: [conn(start, occasion), conn(occasion, details, 0), conn(details, dietary), conn(details, menuAi), conn(dietary, menuDisplay, 0), conn(menuAi, menuDisplay), conn(menuDisplay, confirm), conn(confirm, email, 0), conn(email, end, 0)],
        globalVariables: [
          { id: uuidv4(), name: "guest_email", type: "string", defaultValue: "", description: "Guest email" },
          { id: uuidv4(), name: "guest_name", type: "string", defaultValue: "", description: "Guest name" },
          { id: uuidv4(), name: "booking_ref", type: "string", defaultValue: "", description: "Reservation reference" },
        ],
      };
    },
  },

  // ── Healthcare Appointment Bot ────────────────────
  {
    id: "healthcare-bot",
    name: "Healthcare Assistant",
    description: "Medical appointment booking with symptom pre-screening, doctor matching, and insurance verification.",
    icon: "🏥",
    tags: ["Healthcare", "Booking", "AI"],
    build() {
      const start = tNode("start", { x: 80, y: 260 }, "Welcome", { greeting: "Welcome to **MediCare Connect** 🏥\n\nI'll help you book a medical appointment quickly and easily." });
      const visitType = tNode("button_input", { x: 380, y: 260 }, "Visit Type", { prompt: "What type of visit do you need?", buttons: [{ label: "🩺 General Checkup", value: "checkup", bgColor: "#0ea5e9", textColor: "#fff" }, { label: "🤒 Sick Visit", value: "sick", bgColor: "#ef4444", textColor: "#fff" }, { label: "💊 Follow-up", value: "followup", bgColor: "#8b5cf6", textColor: "#fff" }, { label: "🧪 Lab Work", value: "lab", bgColor: "#14b8a6", textColor: "#fff" }] });
      const symptoms = tNode("user_input", { x: 680, y: 260 }, "Describe Symptoms", { prompt: "Please describe your symptoms or reason for visit.\n\n⚠️ If you're experiencing a medical emergency, please call 911 immediately.", enableSTT: true });
      const aiScreen = tNode("ai_response", { x: 980, y: 260 }, "Symptom Analysis", { model: "gemini-flash", systemPrompt: "You are a medical intake assistant (NOT a doctor). Based on symptoms, suggest the appropriate specialty and urgency level. Always include a disclaimer. Categories: urgent, soon, routine. Suggest relevant specialists.", stream: true });
      const specialtyMatch = tNode("text_display", { x: 1280, y: 160 }, "Doctor Match", { text: "## 👨‍⚕️ Recommended Specialists\n\nBased on your symptoms, we recommend:\n\n{{ai_response}}\n\n---\n\n⚕️ *This is not medical advice. Please consult with your doctor.*", format: "markdown" });
      const insurance = tNode("button_input", { x: 1280, y: 380 }, "Insurance", { prompt: "Do you have insurance?", buttons: [{ label: "✅ Yes, In-Network", value: "in_network" }, { label: "🔄 Yes, Out-of-Network", value: "out_network" }, { label: "❌ Self-Pay", value: "self_pay" }] });
      const dateSelect = tNode("user_input", { x: 1580, y: 260 }, "Schedule", { prompt: "When would you like to schedule your appointment?\n\nPlease share your preferred date, time, and doctor (if any)." });
      const bookApi = tNode("api_call", { x: 1880, y: 260 }, "Book Appointment", { url: "https://api.medicare-connect.com/appointments", method: "POST", body: '{"patient": "{{patient_name}}", "type": "{{visit_type}}", "specialty": "{{specialty}}", "date": "{{date}}", "insurance": "{{insurance_type}}"}' });
      const end = tNode("end", { x: 2180, y: 260 }, "Confirmed!", { message: "Your appointment is booked! 🏥\n\n📧 Check your email for pre-visit forms.\n📋 Remember to bring your insurance card and photo ID.\n\nStay healthy! 💪" });
      return {
        id: uuidv4(), name: "Healthcare Assistant",
        nodes: [start, visitType, symptoms, aiScreen, specialtyMatch, insurance, dateSelect, bookApi, end],
        connections: [conn(start, visitType), conn(visitType, symptoms, 0), conn(symptoms, aiScreen), conn(aiScreen, specialtyMatch), conn(aiScreen, insurance), conn(specialtyMatch, dateSelect), conn(insurance, dateSelect, 0), conn(dateSelect, bookApi), conn(bookApi, end, 0)],
        globalVariables: [
          { id: uuidv4(), name: "patient_name", type: "string", defaultValue: "", description: "Patient's full name" },
          { id: uuidv4(), name: "visit_type", type: "string", defaultValue: "", description: "Type of medical visit" },
          { id: uuidv4(), name: "insurance_type", type: "string", defaultValue: "", description: "Insurance coverage type" },
        ],
      };
    },
  },

  // ── HR / Interview Screening Bot ──────────────────
  {
    id: "hr-screening",
    name: "HR Interview Screener",
    description: "Automated candidate screening with skill assessment, culture fit scoring, and scheduling.",
    icon: "👔",
    tags: ["HR", "AI", "Automation"],
    build() {
      const start = tNode("start", { x: 80, y: 260 }, "Welcome Candidate", { greeting: "Welcome! 👋 Thank you for your interest in joining our team.\n\nI'll guide you through a quick pre-screening to get started." });
      const role = tNode("button_input", { x: 380, y: 260 }, "Position", { prompt: "Which position are you applying for?", buttons: [{ label: "💻 Engineering", value: "engineering", bgColor: "#3b82f6", textColor: "#fff" }, { label: "📊 Product", value: "product", bgColor: "#10b981", textColor: "#fff" }, { label: "🎨 Design", value: "design", bgColor: "#f59e0b", textColor: "#fff" }, { label: "📈 Marketing", value: "marketing", bgColor: "#ef4444", textColor: "#fff" }] });
      const experience = tNode("user_input", { x: 680, y: 260 }, "Experience", { prompt: "Tell us about your relevant experience:\n• Current role and company\n• Years of experience\n• Key achievements" });
      const techQ = tNode("user_input", { x: 980, y: 160 }, "Skills Assessment", { prompt: "Describe a challenging project you've led or contributed to. What was the outcome?" });
      const cultureQ = tNode("button_input", { x: 980, y: 380 }, "Work Style", { prompt: "What's your preferred work style?", buttons: [{ label: "🏢 Office", value: "office" }, { label: "🏠 Remote", value: "remote" }, { label: "🔄 Hybrid", value: "hybrid" }] });
      const aiScore = tNode("ai_response", { x: 1280, y: 260 }, "AI Assessment", { model: "gemini-flash", systemPrompt: "You are an HR screening assistant. Based on the candidate's responses, provide: 1) Skills match score (1-10), 2) Communication quality score (1-10), 3) Key strengths, 4) Areas to explore in interview, 5) Overall recommendation (proceed/hold/decline). Be objective and fair.", stream: false });
      const cond = tNode("condition", { x: 1580, y: 260 }, "Qualified?", { expression: "score >= 7" });
      const scheduleApi = tNode("api_call", { x: 1880, y: 160 }, "Schedule Interview", { url: "https://api.company.com/hr/schedule", method: "POST", body: '{"candidate": "{{candidate_name}}", "role": "{{role}}", "score": {{score}}}' });
      const rejectDisplay = tNode("text_display", { x: 1880, y: 380 }, "Thank You", { text: "Thank you for taking the time to apply! 🙏\n\nWe've reviewed your profile and while we're impressed, we don't have a match for this specific role right now.\n\nWe'll keep your profile on file and reach out if a suitable position opens up.", format: "markdown" });
      const end1 = tNode("end", { x: 2180, y: 160 }, "Interview Set!", { message: "Great news! 🎉 You've been selected for an interview!\n\n📧 Check your email for scheduling details.\n📋 Prepare a 5-min presentation about your best project.\n\nGood luck!" });
      const end2 = tNode("end", { x: 2180, y: 380 }, "On File", { message: "Thank you for your interest! We'll keep you in mind for future opportunities. 📬" });
      return {
        id: uuidv4(), name: "HR Interview Screener",
        nodes: [start, role, experience, techQ, cultureQ, aiScore, cond, scheduleApi, rejectDisplay, end1, end2],
        connections: [conn(start, role), conn(role, experience, 0), conn(experience, techQ), conn(experience, cultureQ), conn(techQ, aiScore), conn(cultureQ, aiScore, 0), conn(aiScore, cond), conn(cond, scheduleApi, 0), conn(cond, rejectDisplay, 1), conn(scheduleApi, end1, 0), conn(rejectDisplay, end2)],
        globalVariables: [
          { id: uuidv4(), name: "candidate_name", type: "string", defaultValue: "", description: "Candidate's name" },
          { id: uuidv4(), name: "role", type: "string", defaultValue: "", description: "Applied position" },
          { id: uuidv4(), name: "score", type: "number", defaultValue: "0", description: "AI screening score" },
        ],
      };
    },
  },

  // ── Travel Planner ────────────────────────────────
  {
    id: "travel-planner",
    name: "Travel Planner",
    description: "AI-powered trip planner with destination suggestions, itinerary building, and booking integration.",
    icon: "✈️",
    tags: ["Travel", "AI", "Booking"],
    build() {
      const start = tNode("start", { x: 80, y: 260 }, "Welcome Traveler", { greeting: "Welcome to **Wanderlust AI** ✈️🌍\n\nLet me plan your perfect trip! Tell me your dream destination or let me surprise you." });
      const travelStyle = tNode("button_input", { x: 380, y: 260 }, "Travel Style", { prompt: "What's your travel style?", buttons: [{ label: "🎒 Adventure", value: "adventure", bgColor: "#f97316", textColor: "#fff" }, { label: "🏖️ Relaxation", value: "relax", bgColor: "#06b6d4", textColor: "#fff" }, { label: "🏛️ Culture", value: "culture", bgColor: "#8b5cf6", textColor: "#fff" }, { label: "🍕 Food & Wine", value: "foodie", bgColor: "#ef4444", textColor: "#fff" }], layout: "vertical" });
      const dest = tNode("user_input", { x: 680, y: 260 }, "Destination & Dates", { prompt: "Where do you want to go and when?\n\nShare dates, budget, and number of travelers.\nOr say \"surprise me\" and I'll suggest destinations!", enableSTT: true });
      const aiPlan = tNode("ai_response", { x: 980, y: 260 }, "Build Itinerary", { model: "gemini-flash", systemPrompt: "You are an expert travel planner. Create a day-by-day itinerary based on the traveler's style, destination, dates, and budget. Include: must-see attractions, restaurant recommendations, local tips, estimated costs, and hidden gems. Format with emojis and markdown for readability.", stream: true });
      const itinerary = tNode("text_display", { x: 1280, y: 260 }, "Your Itinerary", { text: "## 🗺️ Your Custom Itinerary\n\n{{ai_response}}\n\n---\n\n💡 *Prices are estimates and may vary by season*\n📱 *Save this itinerary to your phone!*", format: "markdown" });
      const action = tNode("button_input", { x: 1580, y: 260 }, "Next Steps", { prompt: "What would you like to do?", buttons: [{ label: "✈️ Book Flights", value: "flights", bgColor: "#2563eb", textColor: "#fff" }, { label: "🏨 Book Hotels", value: "hotels", bgColor: "#7c3aed", textColor: "#fff" }, { label: "📋 Modify Plan", value: "modify" }, { label: "📧 Email Itinerary", value: "email" }] });
      const emailSend = tNode("email_sender", { x: 1880, y: 260 }, "Send Itinerary", { to: "{{traveler_email}}", from: "planner@wanderlust-ai.com", subject: "✈️ Your {{destination}} Itinerary is Ready!", body: "Hi {{traveler_name}}!\n\nYour personalized itinerary for {{destination}} is attached.\n\nHappy travels! 🌍\n— Wanderlust AI" });
      const end = tNode("end", { x: 2180, y: 260 }, "Bon Voyage!", { message: "Your trip is planned! ✈️🌍\n\nHave an amazing adventure. Don't forget travel insurance! 🛡️\n\n#WanderlustAI" });
      return {
        id: uuidv4(), name: "Travel Planner",
        nodes: [start, travelStyle, dest, aiPlan, itinerary, action, emailSend, end],
        connections: [conn(start, travelStyle), conn(travelStyle, dest, 0), conn(dest, aiPlan), conn(aiPlan, itinerary), conn(itinerary, action), conn(action, emailSend, 0), conn(emailSend, end, 0)],
        globalVariables: [
          { id: uuidv4(), name: "destination", type: "string", defaultValue: "", description: "Travel destination" },
          { id: uuidv4(), name: "traveler_email", type: "string", defaultValue: "", description: "Traveler's email" },
          { id: uuidv4(), name: "traveler_name", type: "string", defaultValue: "", description: "Traveler's name" },
          { id: uuidv4(), name: "budget", type: "string", defaultValue: "", description: "Trip budget" },
        ],
      };
    },
  },

  // ── Fitness Coach Bot ─────────────────────────────
  {
    id: "fitness-coach",
    name: "Fitness Coach",
    description: "Personalized workout plans with fitness assessment, goal tracking, and nutrition advice.",
    icon: "💪",
    tags: ["Health", "AI", "Coaching"],
    build() {
      const start = tNode("start", { x: 80, y: 260 }, "Hey Champ!", { greeting: "Welcome to **FitBot** 💪🔥\n\nI'm your AI fitness coach. Let's create a workout plan tailored just for you!" });
      const goal = tNode("button_input", { x: 380, y: 260 }, "Your Goal", { prompt: "What's your primary fitness goal?", buttons: [{ label: "🔥 Lose Weight", value: "weight_loss", bgColor: "#ef4444", textColor: "#fff" }, { label: "💪 Build Muscle", value: "muscle", bgColor: "#3b82f6", textColor: "#fff" }, { label: "🏃 Improve Cardio", value: "cardio", bgColor: "#10b981", textColor: "#fff" }, { label: "🧘 Flexibility", value: "flexibility", bgColor: "#a855f7", textColor: "#fff" }], layout: "vertical" });
      const fitness = tNode("user_input", { x: 680, y: 260 }, "Fitness Level", { prompt: "Tell me about yourself:\n• Age and current fitness level (beginner/intermediate/advanced)\n• How many days per week can you work out?\n• Any injuries or limitations?\n• Equipment available (gym/home/outdoor)" });
      const aiPlan = tNode("ai_response", { x: 980, y: 260 }, "Generate Plan", { model: "gemini-flash", systemPrompt: "You are an expert fitness coach. Create a detailed weekly workout plan based on the user's goal, fitness level, available time, and equipment. Include: exercise names, sets x reps, rest periods, warm-up, cool-down, and progression tips. Add nutrition guidelines. Format with markdown and emojis.", stream: true });
      const plan = tNode("text_display", { x: 1280, y: 260 }, "Your Plan", { text: "## 🏋️ Your Personalized Plan\n\n{{ai_response}}\n\n---\n\n🔄 This plan adjusts as you progress!\n📊 Track your workouts to see results faster.", format: "markdown" });
      const action = tNode("button_input", { x: 1580, y: 260 }, "What's Next?", { prompt: "Ready to start?", buttons: [{ label: "🚀 Start Today", value: "start" }, { label: "🍎 Nutrition Plan", value: "nutrition" }, { label: "🔄 Modify Plan", value: "modify" }] });
      const end = tNode("end", { x: 1880, y: 260 }, "Let's Go!", { message: "Your fitness journey starts now! 💪🔥\n\nRemember: Consistency beats intensity. Show up every day!\n\n📱 Set reminders for your workouts!" });
      return {
        id: uuidv4(), name: "Fitness Coach",
        nodes: [start, goal, fitness, aiPlan, plan, action, end],
        connections: [conn(start, goal), conn(goal, fitness, 0), conn(fitness, aiPlan), conn(aiPlan, plan), conn(plan, action), conn(action, end, 0)],
        globalVariables: [
          { id: uuidv4(), name: "fitness_goal", type: "string", defaultValue: "", description: "Primary fitness goal" },
          { id: uuidv4(), name: "fitness_level", type: "string", defaultValue: "beginner", description: "Current fitness level" },
        ],
      };
    },
  },
];
