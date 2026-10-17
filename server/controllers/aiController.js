const DEFAULT_MODEL = 'gemini-2.5-flash';
// Tried in order if the primary model is unavailable for this key.
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-pro-latest'];
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const ROUTES = [
  '/dashboard', '/cars', '/cars/add', '/cars/availability', '/cars/damages',
  '/marques', '/modeles', '/car-events', '/reservations', '/reservations/add',
  '/clients', '/clients/add', '/active-rentals', '/archived-reservations',
  '/agents', '/alerts', '/agencies', '/accounting', '/settings', '/supervision',
  '/visites-techniques', '/centres-visite', '/assurances', '/assurance-agences',
  '/assistances', '/entretiens', '/taches', '/contrats', '/factures',
  '/accidents', '/versements', '/financements', '/traites', '/statistiques', '/rapports',
];

const buildSystemPrompt = (ctx = {}) => {
  const lang = ctx.lang === 'ar' ? 'ar' : 'fr';
  return `Tu es l'assistant vocal intelligent d'une application de location de voitures (RentCar).

# Langue — TRÈS IMPORTANT
- Parle en **Darija marocaine** (arabe marocain familier) quand l'utilisateur parle Darija ou arabe.
- Parle en **français** quand l'utilisateur parle français.
- Darija = mélange d'arabe darija et de mots français usuels, ton naturel et chaleureux. Exemples: "واش بغيتي؟", "آه واخا", "ماشي مشكل", "غادي ندير ليك هادشي", "عندك 12 طوموبيل".
- Réponds TOUJOURS en Darija si l'utilisateur a utilisé de l'arabe (même un peu). Sois naturel, pas formel, pas robotique.
- Tes réponses doivent être COURTES (1-2 phrases) car elles seront lues à voix haute.

# Ce que tu fais
Tu aides le gérant d'une agence de location de voitures à gérer ses données par la voix:
- **Créer un client**: "زيد عميل سميه أحمد بن علي ورقم هاتفو 0661234567"
- **Créer une voiture**: "زيد طوموبيل رينو كليو لوحة 12345-A-6"
- **Naviguer**: "وريني السيارات" / "مشي للفاتورة"
- **Répondre aux questions** sur les données fournies dans CONTEXTE (nombre de voitures, clients, disponibles, alertes, etc.)

// Règles de création
- **NE JAMAIS inventer un brandId, modelId ou autre ID.** Laisse-les VIDE si tu ne les connais pas.
- Utilise les IDs de CONTEXTE quand ils y sont. Sinon laisse brandId/modelId vide et renseigne brandName/modelName.
- Pour créer une voiture il faut une marque ET un modèle qui EXISTENT DÉJÀ dans CONTEXTE.brands / CONTEXTE.models.
- Si la marque n'existe pas : **NE CRÉE PAS la voiture**. Demande d'abord la permission :
  "Toyota machi fih. Nzidha?" / "Je ne trouve pas la marque Toyota. Je l'ajoute ?"
- Si le modèle n'existe pas pour cette marque : même chose, demande avant.
-UNIQUEMENT quand l'utilisateur accepte clairement ("ok", "واخا", "أوكي", "أضفها", "do it", "vas-y"),
  appelle create_brand / create_model, puis seulement ensuite create_car si l'utilisateur l'a demandé.
- Si l'utilisateur accepte d'ajouter une marque ET un modèle qui manquent, appelle les DEUX dans le
  même tour, puis create_car si la voiture complète a été demandée. Mets brandName/modelName partout.
- La plaque d'immatriculation est obligatoire. Si elle manque, demande-la.
- Les questions ("combien", "كم", "شحال", "شوف", "listi") se traitent avec les chiffres du CONTEXTE, sans rien créer.
- Après avoir créé une marque/modèle, confirme brièvement ce que tu as fait.

# Navigation
Pour naviguer, utilise la fonction "navigate" avec l'un de ces chemins (exactement) : ${ROUTES.join(', ')}.

# CONTEXTE (données actuelles de l'app — utilise-les pour les questions)
${JSON.stringify(ctx.summary || {}, null, 0)}`;
};

const TOOL_DECLARATIONS = [
  {
    function_declarations: [
      {
        name: 'create_car',
        description: 'Créer une nouvelle voiture dans la flotte. Utilise seulement quand toutes les infos requises sont connues (marque, modèle, plaque).',
        parameters: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING', description: 'Nom complet de la voiture, ex "Renault Clio"' },
            brandId: { type: 'STRING', description: 'ID de la marque (depuis CONTEXTE brands)' },
            brandName: { type: 'STRING', description: 'Nom de la marque, ex "Renault"' },
            modelId: { type: 'STRING', description: 'ID du modèle (depuis CONTEXTE models)' },
            modelName: { type: 'STRING', description: 'Nom du modèle, ex "Clio"' },
            licensePlate: { type: 'STRING', description: 'Plaque d\'immatriculation, obligatoire, ex "12345-A-6"' },
          },
          required: ['name', 'licensePlate'],
        },
      },
      {
        name: 'create_client',
        description: 'Créer un nouveau client. Nécessite au minimum le prénom et le nom.',
        parameters: {
          type: 'OBJECT',
          properties: {
            firstName: { type: 'STRING', description: 'Prénom du client' },
            lastName: { type: 'STRING', description: 'Nom du client' },
            phone: { type: 'STRING', description: 'Téléphone du client' },
            cin: { type: 'STRING', description: 'CIN / carte d\'identité' },
            email: { type: 'STRING', description: 'Email du client' },
          },
          required: ['firstName', 'lastName'],
        },
      },
      {
        name: 'create_brand',
        description: 'Créer une nouvelle marque. Appeler UNIQUEMENT après que l\'utilisateur a explicitement accepté de l\'ajouter.',
        parameters: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING', description: 'Nom de la marque, ex "Toyota"' },
          },
          required: ['name'],
        },
      },
      {
        name: 'create_model',
        description: 'Créer un nouveau modèle pour une marque existante. Appeler UNIQUEMENT après accord explicite de l\'utilisateur.',
        parameters: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING', description: 'Nom du modèle, ex "Camry"' },
            brandId: { type: 'STRING', description: 'ID de la marque (CONTEXTE). Laisse VIDE si inconnu.' },
            brandName: { type: 'STRING', description: 'Nom de la marque, ex "Toyota". OBLIGATOIRE si brandId est vide.' },
            category: { type: 'STRING', description: 'Catégorie, ex "Berline"' },
          },
          required: ['name'],
        },
      },
      {
        name: 'navigate',
        description: 'Naviguer vers une page de l\'application.',
        parameters: {
          type: 'OBJECT',
          properties: {
            path: { type: 'STRING', description: 'Chemin exact, ex "/cars" ou "/factures"' },
          },
          required: ['path'],
        },
      },
    ],
  },
];

const sanitizeMessages = (messages) => {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string' && m.text.trim())
    .slice(-20)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text.slice(0, 2000) }],
    }));
};

exports.chat = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ message: 'AI non configuré (clé Gemini manquante côté serveur).' });
  }

  const { messages, context } = req.body || {};
  const cleaned = sanitizeMessages(messages);
  if (!cleaned.length) {
    return res.status(400).json({ message: 'Aucun message.' });
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const body = {
    systemInstruction: { parts: [{ text: buildSystemPrompt(context || {}) }] },
    contents: cleaned,
    tools: TOOL_DECLARATIONS,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  // Primary model first, then fallbacks if it is unavailable for this key.
  const candidates = [model, ...FALLBACK_MODELS.filter((m) => m !== model)];
  let data = null;
  let lastError = null;

  for (const candidateModel of candidates) {
    try {
      const response = await fetch(`${GEMINI_BASE}/${candidateModel}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const detail = await response.text();
        lastError = { status: response.status, detail: detail.slice(0, 300), model: candidateModel };
        console.error('[ai] Gemini error', candidateModel, response.status, detail.slice(0, 200));
        continue; // try the next model
      }

      data = await response.json();
      break;
    } catch (e) {
      lastError = { status: 0, detail: e.message, model: candidateModel };
      console.error('[ai] Gemini request failed', candidateModel, e.message);
    }
  }

  if (!data) {
    if (lastError?.status === 429) {
      return res.status(429).json({ message: 'Quota Gemini atteint.' });
    }
    if (lastError?.status === 401 || lastError?.status === 403) {
      return res.status(502).json({ message: 'Clé Gemini refusée.' });
    }
    return res.status(502).json({
      message: `Erreur IA (${lastError?.status || 'inconnue'}).`,
      model: lastError?.model || null,
    });
  }

  try {
    const candidate = data?.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    if (!parts.length) {
      return res.json({
        reply: context?.lang === 'ar' ? 'ما فهمتش، عاود سمعني؟' : 'Je n\'ai pas compris, peux-tu répéter ?',
        actions: [],
        lang: context?.lang || 'fr',
      });
    }

    // A single turn can emit several function calls (e.g. brand + model + car).
    let reply = parts.map((p) => p.text || '').join(' ').trim();
    const actions = [];

    parts.forEach((part) => {
      const fc = part.functionCall;
      if (!fc) return;
      const args = fc.args || {};
      if (fc.name === 'create_car') actions.push({ type: 'create_car', payload: args });
      else if (fc.name === 'create_client') actions.push({ type: 'create_client', payload: args });
      else if (fc.name === 'create_brand') actions.push({ type: 'create_brand', payload: args });
      else if (fc.name === 'create_model') actions.push({ type: 'create_model', payload: args });
      else if (fc.name === 'navigate') actions.push({ type: 'navigate', path: args.path });
    });

    // Safety net: never let a car be created with an invented brand/model id.
    // A car with unknown ids is allowed ONLY if it carries brand/model NAMES,
    // which the frontend resolves after creating any missing brand/model.
    const brandIds = new Set(((context?.summary?.brands) || []).map((b) => b.id));
    const modelIds = new Set(((context?.summary?.models) || []).map((m) => m.id));
    const safeActions = [];
    let blockedCar = null;

    actions.forEach((a) => {
      if (a.type !== 'create_car') {
        safeActions.push(a);
        return;
      }
      const p = a.payload || {};
      const idsValid = brandIds.has(p.brandId) && modelIds.has(p.modelId);
      const namesPresent = Boolean(p.brandName && p.modelName);
      if (idsValid || namesPresent) safeActions.push(a);
      else blockedCar = p;
    });

    if (blockedCar) {
      const label = blockedCar.name
        || [blockedCar.brandName, blockedCar.modelName].filter(Boolean).join(' ')
        || (context?.lang === 'ar' ? 'هاد السيارة' : 'cette voiture');
      const ask = context?.lang === 'ar'
        ? `${label} ما كايناش فالقائمة ديالك. واش نزيدها؟`
        : `${label} n'existe pas encore dans ta liste. Je l'ajoute ?`;
      reply = reply && reply !== '…' ? `${reply} ${ask}` : ask;
    }

    res.json({
      reply: reply || '…',
      actions: safeActions,
      lang: context?.lang || 'fr',
    });
  } catch (error) {
    console.error('[ai] chat error', error);
    res.status(500).json({ message: 'Erreur interne de l\'assistant IA.' });
  }
};
