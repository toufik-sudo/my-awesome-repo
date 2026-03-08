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
  | "toolbar.saved"
  | "toolbar.savedDesc"
  | "toolbar.importSuccess"
  | "toolbar.importError"
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
  | "chat.noStartNode"
  | "chat.textDisplay"
  | "chat.imageGallery"
  | "chat.selectImage"
  | "chat.clickButton"
  | "chat.apiCall"
  | "chat.condition"
  | "chat.action"
  | "chat.dbQuery"
  | "chat.jsFunction"
  | "chat.loopIteration"
  | "chat.randomPicked"
  | "chat.emailSent"
  | "chat.speechNotSupported"
  | "config.configure"
  | "config.label"
  | "config.examples"
  | "config.block"
  | "config.greeting"
  | "config.prompt"
  | "config.expression"
  | "config.functionName"
  | "config.voiceInput"
  | "config.goodbye"
  | "config.webhookUrl"
  | "config.method"
  | "config.secret"
  | "config.variableName"
  | "config.value"
  | "config.operation"
  | "config.duration"
  | "config.displayMessage"
  | "config.branches"
  | "config.addBranch"
  | "config.iterations"
  | "config.counterVar"
  | "config.apiKeyVar"
  | "config.endpoint"
  | "config.model"
  | "config.headers"
  | "config.addHeader"
  | "config.systemPrompt"
  | "config.userTemplate"
  | "config.temperature"
  | "config.maxTokens"
  | "config.streaming"
  | "config.to"
  | "config.subject"
  | "config.body"
  | "config.provider"
  | "config.database"
  | "config.query"
  | "config.outputVar"
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
  "toolbar.saved": "Workflow saved",
  "toolbar.savedDesc": "saved to local storage",
  "toolbar.importSuccess": "Workflow imported successfully",
  "toolbar.importError": "Invalid JSON file",
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
  "chat.noStartNode": "⚠️ No Start node found in the workflow.",
  "chat.textDisplay": "📝 Text Display",
  "chat.imageGallery": "🖼️ Image Gallery",
  "chat.selectImage": "Select an image...",
  "chat.clickButton": "Click a button above...",
  "chat.apiCall": "🔗 API Call",
  "chat.condition": "🔀 Condition",
  "chat.action": "⚡ Action",
  "chat.dbQuery": "🗄️ DB Query",
  "chat.jsFunction": "💻 JS Function executed",
  "chat.loopIteration": "🔁 Loop iteration",
  "chat.randomPicked": "🎲 Random: picked",
  "chat.emailSent": "📧 Email sent to",
  "chat.speechNotSupported": "Speech recognition not supported.",
  "config.configure": "Configure",
  "config.label": "Label",
  "config.examples": "Examples",
  "config.block": "block",
  "config.greeting": "Greeting Message",
  "config.prompt": "Prompt Text",
  "config.expression": "Expression",
  "config.functionName": "Function Name",
  "config.voiceInput": "Enable voice input",
  "config.goodbye": "Goodbye Message",
  "config.webhookUrl": "Webhook URL",
  "config.method": "Method",
  "config.secret": "Secret",
  "config.variableName": "Variable Name",
  "config.value": "Value",
  "config.operation": "Operation",
  "config.duration": "Duration",
  "config.displayMessage": "Display Message (optional)",
  "config.branches": "Branches",
  "config.addBranch": "+ Add branch",
  "config.iterations": "Iterations",
  "config.counterVar": "Counter Variable",
  "config.apiKeyVar": "API Key Variable",
  "config.endpoint": "Endpoint URL",
  "config.model": "Model",
  "config.headers": "Headers",
  "config.addHeader": "+ Add header",
  "config.systemPrompt": "System Prompt",
  "config.userTemplate": "User Message Template",
  "config.temperature": "Temperature",
  "config.maxTokens": "Max Tokens",
  "config.streaming": "Enable streaming",
  "config.to": "To (Email)",
  "config.subject": "Subject",
  "config.body": "Body",
  "config.provider": "Provider",
  "config.database": "Database / Connection String",
  "config.query": "SQL Query",
  "config.outputVar": "Output Variable",
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
  "toolbar.saved": "Workflow sauvegardé",
  "toolbar.savedDesc": "sauvegardé dans le stockage local",
  "toolbar.importSuccess": "Workflow importé avec succès",
  "toolbar.importError": "Fichier JSON invalide",
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
  "chat.streaming": "Diffusion",
  "chat.waitingInput": "En attente d'une saisie...",
  "chat.runFirst": "Lancez le workflow d'abord...",
  "chat.placeholder": "Tapez un message...",
  "chat.welcome": "Cliquez sur Lancer pour démarrer une conversation",
  "chat.completed": "✅ Workflow terminé.",
  "chat.noStartNode": "⚠️ Aucun nœud de départ trouvé.",
  "chat.textDisplay": "📝 Affichage Texte",
  "chat.imageGallery": "🖼️ Galerie d'Images",
  "chat.selectImage": "Sélectionnez une image...",
  "chat.clickButton": "Cliquez sur un bouton ci-dessus...",
  "chat.apiCall": "🔗 Appel API",
  "chat.condition": "🔀 Condition",
  "chat.action": "⚡ Action",
  "chat.dbQuery": "🗄️ Requête BDD",
  "chat.jsFunction": "💻 Fonction JS exécutée",
  "chat.loopIteration": "🔁 Itération de boucle",
  "chat.randomPicked": "🎲 Aléatoire : choisi",
  "chat.emailSent": "📧 Email envoyé à",
  "chat.speechNotSupported": "Reconnaissance vocale non supportée.",
  "config.configure": "Configurer",
  "config.label": "Libellé",
  "config.examples": "Exemples",
  "config.block": "bloc",
  "config.greeting": "Message d'accueil",
  "config.prompt": "Texte d'invite",
  "config.expression": "Expression",
  "config.functionName": "Nom de la fonction",
  "config.voiceInput": "Activer la saisie vocale",
  "config.goodbye": "Message d'au revoir",
  "config.webhookUrl": "URL du Webhook",
  "config.method": "Méthode",
  "config.secret": "Secret",
  "config.variableName": "Nom de la variable",
  "config.value": "Valeur",
  "config.operation": "Opération",
  "config.duration": "Durée",
  "config.displayMessage": "Message affiché (optionnel)",
  "config.branches": "Branches",
  "config.addBranch": "+ Ajouter une branche",
  "config.iterations": "Itérations",
  "config.counterVar": "Variable compteur",
  "config.apiKeyVar": "Variable clé API",
  "config.endpoint": "URL du point de terminaison",
  "config.model": "Modèle",
  "config.headers": "En-têtes",
  "config.addHeader": "+ Ajouter un en-tête",
  "config.systemPrompt": "Prompt système",
  "config.userTemplate": "Modèle de message utilisateur",
  "config.temperature": "Température",
  "config.maxTokens": "Tokens maximum",
  "config.streaming": "Activer le streaming",
  "config.to": "Destinataire (Email)",
  "config.subject": "Sujet",
  "config.body": "Corps",
  "config.provider": "Fournisseur",
  "config.database": "Base de données / Chaîne de connexion",
  "config.query": "Requête SQL",
  "config.outputVar": "Variable de sortie",
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
  "app.title": "مُنشئ الوكيل",
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
  "toolbar.executing": "جارٍ التنفيذ…",
  "toolbar.done": "✓ تمّ",
  "toolbar.error": "✗ خطأ",
  "toolbar.saved": "تم حفظ سير العمل",
  "toolbar.savedDesc": "تم الحفظ في التخزين المحلي",
  "toolbar.importSuccess": "تم استيراد سير العمل بنجاح",
  "toolbar.importError": "ملف JSON غير صالح",
  "view.builder": "المُنشئ",
  "view.split": "مُقسَّم",
  "view.chat": "محادثة",
  "palette.title": "الكُتَل",
  "palette.search": "البحث عن كتل…",
  "palette.hint": "اسحب الكتل إلى اللوحة. Shift+نقر للتحديد المتعدد.",
  "palette.noResults": "لا توجد كتل مطابقة",
  "palette.flow": "التدفق",
  "palette.logic": "المنطق",
  "palette.integrations": "التكاملات",
  "chat.title": "معاينة الوكيل",
  "chat.run": "تشغيل",
  "chat.stop": "إيقاف",
  "chat.reset": "إعادة تعيين",
  "chat.minimize": "تصغير المحادثة",
  "chat.idle": "خامل",
  "chat.running": "قيد التشغيل",
  "chat.streaming": "بث مباشر",
  "chat.waitingInput": "بانتظار الإدخال...",
  "chat.runFirst": "قم بتشغيل سير العمل أولاً...",
  "chat.placeholder": "اكتب رسالة...",
  "chat.welcome": "اضغط على تشغيل لبدء المحادثة",
  "chat.completed": "✅ اكتمل سير العمل.",
  "chat.noStartNode": "⚠️ لم يتم العثور على عقدة بداية في سير العمل.",
  "chat.textDisplay": "📝 عرض نصي",
  "chat.imageGallery": "🖼️ معرض الصور",
  "chat.selectImage": "اختر صورة...",
  "chat.clickButton": "اضغط على زر أعلاه...",
  "chat.apiCall": "🔗 استدعاء API",
  "chat.condition": "🔀 شرط",
  "chat.action": "⚡ إجراء",
  "chat.dbQuery": "🗄️ استعلام قاعدة البيانات",
  "chat.jsFunction": "💻 تم تنفيذ دالة جافاسكريبت",
  "chat.loopIteration": "🔁 تكرار الحلقة",
  "chat.randomPicked": "🎲 عشوائي: تم الاختيار",
  "chat.emailSent": "📧 تم إرسال البريد إلى",
  "chat.speechNotSupported": "التعرف على الصوت غير مدعوم.",
  "config.configure": "إعداد",
  "config.label": "التسمية",
  "config.examples": "أمثلة",
  "config.block": "كتلة",
  "config.greeting": "رسالة الترحيب",
  "config.prompt": "نص المُوجِّه",
  "config.expression": "التعبير",
  "config.functionName": "اسم الدالة",
  "config.voiceInput": "تفعيل الإدخال الصوتي",
  "config.goodbye": "رسالة الوداع",
  "config.webhookUrl": "رابط الـ Webhook",
  "config.method": "الطريقة",
  "config.secret": "المفتاح السري",
  "config.variableName": "اسم المتغير",
  "config.value": "القيمة",
  "config.operation": "العملية",
  "config.duration": "المدة",
  "config.displayMessage": "رسالة العرض (اختياري)",
  "config.branches": "الفروع",
  "config.addBranch": "+ إضافة فرع",
  "config.iterations": "التكرارات",
  "config.counterVar": "متغير العداد",
  "config.apiKeyVar": "متغير مفتاح API",
  "config.endpoint": "رابط نقطة النهاية",
  "config.model": "النموذج",
  "config.headers": "الترويسات",
  "config.addHeader": "+ إضافة ترويسة",
  "config.systemPrompt": "مُوجِّه النظام",
  "config.userTemplate": "قالب رسالة المستخدم",
  "config.temperature": "درجة الحرارة",
  "config.maxTokens": "الحد الأقصى للرموز",
  "config.streaming": "تفعيل البث المباشر",
  "config.to": "إلى (البريد الإلكتروني)",
  "config.subject": "الموضوع",
  "config.body": "المحتوى",
  "config.provider": "المزود",
  "config.database": "قاعدة البيانات / سلسلة الاتصال",
  "config.query": "استعلام SQL",
  "config.outputVar": "متغير الإخراج",
  "variables.title": "المتغيرات العامة",
  "variables.add": "+ إضافة",
  "variables.empty": "لا توجد متغيرات عامة بعد. اضغط على + إضافة لإنشاء واحدة.",
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
  "node.emailSender": "إرسال بريد إلكتروني",
  "node.webhook": "ويب هوك",
  "node.dbQuery": "استعلام قاعدة بيانات",
  "node.jsFunction": "دالة جافاسكريبت",
  "node.setVariable": "تعيين متغير",
  "node.component": "مُكوِّن",
  "node.timer": "مؤقت / تأخير",
  "node.randomChoice": "اختيار عشوائي",
  "node.loop": "حلقة تكرارية",
  "node.imageGallery": "معرض الصور",
};

export const translations: Record<Locale, TranslationMap> = { en, fr, ar };
