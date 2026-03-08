export type Locale = "en" | "fr" | "ar";

export type TranslationKeys =
  | "app.title"
  | "app.subtitle"
  | "toolbar.save"
  | "toolbar.export"
  | "toolbar.import"
  | "toolbar.run"
  | "toolbar.stop"
  | "toolbar.undo"
  | "toolbar.redo"
  | "toolbar.templates"
  | "toolbar.variables"
  | "toolbar.chatStyle"
  | "toolbar.executing"
  | "toolbar.done"
  | "toolbar.error"
  | "view.builder"
  | "view.split"
  | "view.chat"
  | "palette.title"
  | "palette.search"
  | "palette.hint"
  | "palette.noResults"
  | "palette.flow"
  | "palette.logic"
  | "palette.integrations"
  | "chat.title"
  | "chat.run"
  | "chat.stop"
  | "chat.reset"
  | "chat.minimize"
  | "chat.idle"
  | "chat.running"
  | "chat.streaming"
  | "chat.waitingInput"
  | "chat.runFirst"
  | "chat.placeholder"
  | "chat.welcome"
  | "chat.completed"
  | "config.configure"
  | "config.label"
  | "config.examples"
  | "config.block"
  | "variables.title"
  | "variables.add"
  | "variables.empty"
  | "theme.title"
  | "lang.title"
  | "node.start"
  | "node.end"
  | "node.aiResponse"
  | "node.userInput"
  | "node.textDisplay"
  | "node.buttonChoice"
  | "node.condition"
  | "node.apiCall"
  | "node.action"
  | "node.emailSender"
  | "node.webhook"
  | "node.dbQuery"
  | "node.jsFunction"
  | "node.setVariable"
  | "node.component"
  | "node.timer"
  | "node.randomChoice"
  | "node.loop"
  | "node.imageGallery";

type TranslationMap = Record<TranslationKeys, string>;

const en: TranslationMap = {
  "app.title": "Agent Builder",
  "app.subtitle": "Visual AI workflow editor",
  "toolbar.save": "Save",
  "toolbar.export": "Export",
  "toolbar.import": "Import",
  "toolbar.run": "Run",
  "toolbar.stop": "Stop",
  "toolbar.undo": "Undo",
  "toolbar.redo": "Redo",
  "toolbar.templates": "Templates",
  "toolbar.variables": "Variables",
  "toolbar.chatStyle": "Chat Style",
  "toolbar.executing": "Executing…",
  "toolbar.done": "✓ Done",
  "toolbar.error": "✗ Error",
  "view.builder": "Builder",
  "view.split": "Split",
  "view.chat": "Chat",
  "palette.title": "Blocks",
  "palette.search": "Search blocks…",
  "palette.hint": "Drag blocks onto the canvas. Shift+click to multi-select.",
  "palette.noResults": "No blocks match",
  "palette.flow": "Flow",
  "palette.logic": "Logic",
  "palette.integrations": "Integrations",
  "chat.title": "Agent Preview",
  "chat.run": "Run",
  "chat.stop": "Stop",
  "chat.reset": "Reset",
  "chat.minimize": "Minimize chat",
  "chat.idle": "Idle",
  "chat.running": "Running",
  "chat.streaming": "Streaming",
  "chat.waitingInput": "Waiting for input...",
  "chat.runFirst": "Run the workflow first...",
  "chat.placeholder": "Type a message...",
  "chat.welcome": "Click Run to start a conversation",
  "chat.completed": "✅ Workflow completed.",
  "config.configure": "Configure",
  "config.label": "Label",
  "config.examples": "Examples",
  "config.block": "block",
  "variables.title": "Global Variables",
  "variables.add": "+ Add",
  "variables.empty": "No global variables yet. Click + Add to create one.",
  "theme.title": "Theme",
  "lang.title": "Language",
  "node.start": "Start",
  "node.end": "End",
  "node.aiResponse": "AI Response",
  "node.userInput": "User Input",
  "node.textDisplay": "Text Display",
  "node.buttonChoice": "Button Choice",
  "node.condition": "Condition",
  "node.apiCall": "API Call",
  "node.action": "Action",
  "node.emailSender": "Email Sender",
  "node.webhook": "Webhook",
  "node.dbQuery": "DB Query",
  "node.jsFunction": "JS Function",
  "node.setVariable": "Set Variable",
  "node.component": "Component",
  "node.timer": "Timer / Delay",
  "node.randomChoice": "Random Choice",
  "node.loop": "Loop",
  "node.imageGallery": "Image Gallery",
};

const fr: TranslationMap = {
  "app.title": "Agent Builder",
  "app.subtitle": "Éditeur visuel de workflows IA",
  "toolbar.save": "Sauvegarder",
  "toolbar.export": "Exporter",
  "toolbar.import": "Importer",
  "toolbar.run": "Lancer",
  "toolbar.stop": "Arrêter",
  "toolbar.undo": "Annuler",
  "toolbar.redo": "Rétablir",
  "toolbar.templates": "Modèles",
  "toolbar.variables": "Variables",
  "toolbar.chatStyle": "Style du Chat",
  "toolbar.executing": "Exécution…",
  "toolbar.done": "✓ Terminé",
  "toolbar.error": "✗ Erreur",
  "view.builder": "Éditeur",
  "view.split": "Divisé",
  "view.chat": "Chat",
  "palette.title": "Blocs",
  "palette.search": "Rechercher des blocs…",
  "palette.hint": "Glissez les blocs sur le canevas. Shift+clic pour multi-sélection.",
  "palette.noResults": "Aucun bloc trouvé",
  "palette.flow": "Flux",
  "palette.logic": "Logique",
  "palette.integrations": "Intégrations",
  "chat.title": "Aperçu de l'Agent",
  "chat.run": "Lancer",
  "chat.stop": "Arrêter",
  "chat.reset": "Réinitialiser",
  "chat.minimize": "Réduire le chat",
  "chat.idle": "Inactif",
  "chat.running": "En cours",
  "chat.streaming": "Streaming",
  "chat.waitingInput": "En attente d'une saisie...",
  "chat.runFirst": "Lancez le workflow d'abord...",
  "chat.placeholder": "Tapez un message...",
  "chat.welcome": "Cliquez sur Lancer pour démarrer une conversation",
  "chat.completed": "✅ Workflow terminé.",
  "config.configure": "Configurer",
  "config.label": "Libellé",
  "config.examples": "Exemples",
  "config.block": "bloc",
  "variables.title": "Variables Globales",
  "variables.add": "+ Ajouter",
  "variables.empty": "Aucune variable globale. Cliquez sur + Ajouter pour en créer une.",
  "theme.title": "Thème",
  "lang.title": "Langue",
  "node.start": "Début",
  "node.end": "Fin",
  "node.aiResponse": "Réponse IA",
  "node.userInput": "Saisie Utilisateur",
  "node.textDisplay": "Affichage Texte",
  "node.buttonChoice": "Choix par Bouton",
  "node.condition": "Condition",
  "node.apiCall": "Appel API",
  "node.action": "Action",
  "node.emailSender": "Envoi d'Email",
  "node.webhook": "Webhook",
  "node.dbQuery": "Requête BDD",
  "node.jsFunction": "Fonction JS",
  "node.setVariable": "Définir Variable",
  "node.component": "Composant",
  "node.timer": "Minuteur / Délai",
  "node.randomChoice": "Choix Aléatoire",
  "node.loop": "Boucle",
  "node.imageGallery": "Galerie d'Images",
};

const ar: TranslationMap = {
  "app.title": "Agent Builder",
  "app.subtitle": "محرر سير العمل المرئي بالذكاء الاصطناعي",
  "toolbar.save": "حفظ",
  "toolbar.export": "تصدير",
  "toolbar.import": "استيراد",
  "toolbar.run": "تشغيل",
  "toolbar.stop": "إيقاف",
  "toolbar.undo": "تراجع",
  "toolbar.redo": "إعادة",
  "toolbar.templates": "القوالب",
  "toolbar.variables": "المتغيرات",
  "toolbar.chatStyle": "نمط المحادثة",
  "toolbar.executing": "جاري التنفيذ…",
  "toolbar.done": "✓ تم",
  "toolbar.error": "✗ خطأ",
  "view.builder": "المحرر",
  "view.split": "مقسم",
  "view.chat": "محادثة",
  "palette.title": "الكتل",
  "palette.search": "البحث عن كتل…",
  "palette.hint": "اسحب الكتل إلى اللوحة. Shift+نقر للتحديد المتعدد.",
  "palette.noResults": "لا توجد كتل مطابقة",
  "palette.flow": "التدفق",
  "palette.logic": "المنطق",
  "palette.integrations": "التكاملات",
  "chat.title": "معاينة العميل",
  "chat.run": "تشغيل",
  "chat.stop": "إيقاف",
  "chat.reset": "إعادة تعيين",
  "chat.minimize": "تصغير المحادثة",
  "chat.idle": "خامل",
  "chat.running": "قيد التشغيل",
  "chat.streaming": "بث مباشر",
  "chat.waitingInput": "في انتظار الإدخال...",
  "chat.runFirst": "قم بتشغيل سير العمل أولاً...",
  "chat.placeholder": "اكتب رسالة...",
  "chat.welcome": "انقر على تشغيل لبدء محادثة",
  "chat.completed": "✅ اكتمل سير العمل.",
  "config.configure": "تكوين",
  "config.label": "التسمية",
  "config.examples": "أمثلة",
  "config.block": "كتلة",
  "variables.title": "المتغيرات العامة",
  "variables.add": "+ إضافة",
  "variables.empty": "لا توجد متغيرات عامة بعد. انقر على + إضافة لإنشاء واحدة.",
  "theme.title": "المظهر",
  "lang.title": "اللغة",
  "node.start": "البداية",
  "node.end": "النهاية",
  "node.aiResponse": "استجابة الذكاء الاصطناعي",
  "node.userInput": "إدخال المستخدم",
  "node.textDisplay": "عرض النص",
  "node.buttonChoice": "اختيار بزر",
  "node.condition": "شرط",
  "node.apiCall": "استدعاء API",
  "node.action": "إجراء",
  "node.emailSender": "إرسال بريد",
  "node.webhook": "ويب هوك",
  "node.dbQuery": "استعلام قاعدة بيانات",
  "node.jsFunction": "دالة جافاسكريبت",
  "node.setVariable": "تعيين متغير",
  "node.component": "مكون",
  "node.timer": "مؤقت / تأخير",
  "node.randomChoice": "اختيار عشوائي",
  "node.loop": "حلقة",
  "node.imageGallery": "معرض الصور",
};

export const translations: Record<Locale, TranslationMap> = { en, fr, ar };
