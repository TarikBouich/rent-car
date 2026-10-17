// Free offline intent + action engine for the voice assistant.
// No API key, no network: maps natural language (FR / AR) -> structured actions.

const strip = (s = '') =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Latin diacritics
    .replace(/[\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g, '') // Arabic marks incl. hamza above/below
    .normalize('NFC')
    .trim();

const any = (t, words) => words.some((w) => t.includes(strip(w)));

const AR = /[\u0600-\u06FF]/;
export const detectLang = (raw = '') => (AR.test(String(raw)) ? 'ar' : 'fr');

// --- Keyword vocabularies ----------------------------------------------------
const CAR_NOUNS = ['voiture', 'voitures', 'car', 'cars', 'vehicule', 'vehicules', 'vehicule', 'fleet', 'سيارة', 'سياره', 'سيارات', 'طوموبيل', 'كرهبة', 'عربية'];
const CLIENT_NOUNS = ['client', 'clients', 'customer', ' customers', 'عميل', 'عميلة', 'عميله', 'عملاء', 'زبون', 'زبناء'];
const CREATE_VERBS = ['cree', 'creer', 'create', 'ajoute', 'ajouter', 'add', 'nouveau', 'nouvelle', 'new', 'enregistre', 'enregistrer', 'inscrire', 'اضف', 'أضف', 'انشئ', 'أنشئ', 'إنشاء', 'انشاء', 'اضافه', 'إضافة', 'جديد', 'جديدة', 'جديده', 'سجل', 'سجّل'];
const QUERY_MARKERS = ['combien', 'liste', 'list', 'montre', 'montre moi', 'show', 'who', 'qui sont', 'quel', 'quelle', 'quels', 'quelles', 'dis moi', 'donne moi', 'what is', 'how many', 'moyen', 'moyenne', 'disponibles', 'disponible', 'prix', 'price', 'tarif', 'cout', 'كم', 'شحال', 'عدد', 'قائمة', 'لائحة', 'وريني', 'بشحال', 'بكم', 'ثمن', 'سعر', 'متوسط', 'متاح', 'متاحة', 'متوفر', 'عرض لي'];
const NAV_MARKERS = ['va ', 'vais ', 'va a', 'va au', 'va aux', 'ouvre', 'ouvrir', 'go to', 'navigate', 'retourne', 'rend toi', 'affiche', 'page ', 'اذهب', 'افتح', 'فتح', 'انتقل', 'روح', 'سير'];

const ROUTES = [
  { path: '/dashboard', label: { fr: 'le tableau de bord', ar: 'لوحة التحكم' }, words: ['tableau de bord', 'dashboard', 'accueil', 'home', 'لوحة التحكم', 'لوحه التحكم', 'الرئيسية', 'الرئيسيه'] },
  { path: '/cars', label: { fr: 'les voitures', ar: 'السيارات' }, words: ['voitures', 'voiture', 'cars', 'car', 'vehicules', 'vehicule', 'parc', 'fleet', 'سيارات', 'سيارة', 'سياره', 'السيارات'] },
  { path: '/clients', label: { fr: 'les clients', ar: 'العملاء' }, words: ['clients', 'client', 'customers', 'العملاء', 'عملاء', 'الزبناء', 'زبناء'] },
  { path: '/reservations', label: { fr: 'les réservations', ar: 'الحجوزات' }, words: ['reservations', 'reservation', 'booking', 'bookings', 'حجوزات', 'الحجوزات', 'حجز'] },
  { path: '/active-rentals', label: { fr: 'les locations en cours', ar: 'الإيجارات الجارية' }, words: ['locations en cours', 'actives', 'encours', 'active rentals', 'rentals', 'إيجارات', 'الايجارات'] },
  { path: '/contrats', label: { fr: 'les contrats', ar: 'العقود' }, words: ['contrats', 'contrat', 'contracts', 'contract', 'عقود', 'العقود', 'عقد'] },
  { path: '/factures', label: { fr: 'les factures', ar: 'الفواتير' }, words: ['factures', 'facture', 'invoices', 'invoice', 'فواتير', 'الفواتير', 'فاتورة'] },
  { path: '/marques', label: { fr: 'les marques', ar: 'الماركات' }, words: ['marques', 'marque', 'brands', 'brand', 'ماركات', 'الماركات', 'ماركة'] },
  { path: '/modeles', label: { fr: 'les modèles', ar: 'الموديلات' }, words: ['modeles', 'modele', 'models', 'model', 'موديلات', 'الموديلات', 'موديل'] },
  { path: '/agencies', label: { fr: 'les agences', ar: 'الوكالات' }, words: ['agences', 'agence', 'agencies', 'agency', 'وكالات', 'الوكالات', 'وكالة'] },
  { path: '/agents', label: { fr: 'les agents', ar: 'الموظفون' }, words: ['agents', 'agent', 'utilisateurs', 'users', 'موظفين', 'الموظفين', 'مستخدمين', 'وكلاء'] },
  { path: '/accounting', label: { fr: 'la comptabilité', ar: 'المحاسبة' }, words: ['comptabilite', 'accounting', 'compta', 'محاسبة', 'المحاسبة'] },
  { path: '/settings', label: { fr: 'les paramètres', ar: 'الإعدادات' }, words: ['parametres', 'settings', 'configuration', 'reglages', 'اعدادات', 'الإعدادات', 'الضبط'] },
  { path: '/alerts', label: { fr: 'les alertes', ar: 'التنبيهات' }, words: ['alertes', 'alerte', 'alerts', 'alert', 'تنبيهات', 'التنبيهات'] },
  { path: '/entretiens', label: { fr: 'les entretiens', ar: 'الصيانة' }, words: ['entretien', 'entretiens', 'maintenance', 'vidange', 'صيانة', 'الصيانة'] },
  { path: '/assurances', label: { fr: 'les assurances', ar: 'التأمينات' }, words: ['assurances', 'assurance', 'insurance', 'تأمينات', 'التأمينات', 'تأمين'] },
  { path: '/visites-techniques', label: { fr: 'les visites techniques', ar: 'الفحص التقني' }, words: ['visite technique', 'visites techniques', 'فحص تقني', 'الفحص التقني'] },
  { path: '/accidents', label: { fr: 'les accidents', ar: 'الحوادث' }, words: ['accidents', 'accident', 'damages', 'dommages', 'حوادث', 'الحوادث'] },
  { path: '/statistiques', label: { fr: 'les statistiques', ar: 'الإحصائيات' }, words: ['statistiques', 'stats', 'statistics', 'chiffres', 'احصائيات', 'الإحصائيات'] },
  { path: '/rapports', label: { fr: 'les rapports', ar: 'التقارير' }, words: ['rapports', 'rapport', 'reports', 'report', 'تقارير', 'التقارير'] },
  { path: '/versements', label: { fr: 'les versements', ar: 'الدفعات' }, words: ['versements', 'versement', 'payments', 'paiements', 'دفعات', 'الدفعات'] },
  { path: '/super-admin', label: { fr: 'le super admin', ar: 'الإدارة العامة' }, words: ['super admin', 'superadmin', 'الادارة العامة'] },
];

const FUEL_TYPES = [
  { id: 'Diesel', words: ['diesel', 'gazole', 'ديزل', 'غازوال'] },
  { id: 'Essence', words: ['essence', 'benzine', 'gasoline', 'petrol', 'بنزين', 'اسانس'] },
  { id: 'Hybride', words: ['hybride', 'hybrid', 'هجين', 'هايبرد'] },
  { id: 'Electrique', words: ['electrique', 'electric', 'elec', 'كهربائية', 'كهرباء'] },
];

const COLORS = ['noir', 'blanc', 'gris', 'rouge', 'bleu', 'beige', 'vert', 'argent', 'marron', 'orange', 'jaune', 'black', 'white', 'gray', 'grey', 'silver', 'blue', 'red', 'green', 'أسود', 'ابيض', 'أبيض', 'رمادي', 'احمر', 'أحمر', 'ازرق', 'أزرق', 'فضي'];

// Latin <-> Arabic aliases so users can speak brand/model names either way.
const ALIASES = {
  renault: ['رينو'], peugeot: ['بيجو'], citroen: ['سيتروين', 'ستروين', 'ستورين', 'سيتروان'],
  dacia: ['داسيا', 'داتشيا'], volkswagen: ['فولكسفاغن', 'فولكس واجن', 'فولكس'], toyota: ['تويوتا'],
  hyundai: ['هيونداي', 'هيونداى'], kia: ['كيا'], nissan: ['نيسان'], fiat: ['فيات'],
  mercedes: ['مرسيدس', 'مرسيدس بنز'], bmw: ['بي ام دبليو', 'بي إم دبليو'], audi: ['اودي', 'أودي'],
  ford: ['فورد'], chevrolet: ['شيفروليه', 'شفروليه'], skoda: ['سكودا'], seat: ['سيات'],
  opel: ['اوبل', 'أوبل'], mazda: ['مازدا'], honda: ['هوندا'], mitsubishi: ['ميتسوبيشي'],
  suzuki: ['سوزوكي'], chery: ['شيري'], geely: ['جيلي'], lada: ['لادا'], byd: ['بي واي دي'],
  mg: ['ام جي'], jeep: ['جيب'], volvo: ['فولفو'], mini: ['ميني'], jaguar: ['جاكوار'], land: ['لاند روفر'],
  // Common models
  clio: ['كليو'], megane: ['ميغان', 'ميقان', 'ميجان'], duster: ['داستر'], sandero: ['سانديرو'],
  logan: ['لوغان', 'لوجان'], symbol: ['سمبول'], kangoo: ['كانغو'], captur: ['كابتور'],
  gol: ['غول'], passat: ['باسات'], golf: ['غولف'], polo: ['بولو', 'پولو'], tiguan: ['تيغوان'],
  corolla: ['كورولا'], yaris: ['ياريس'], hilux: ['هايلكس'], prado: ['برادو'],
  elantra: ['إلنترا', 'النترا'], tucson: ['توكسون'], accent: ['أكسنت', 'اكسنت'],
  sportage: ['سبورتاج'], rio: ['ريو'], sunny: ['صني'], qashqai: ['قشقاي'],
};

const PLATE_PATTERNS = [
  /\b(\d{4,5}\s*[- ]?\s*[a-zA-Z]\s*[- ]?\s?\d{1,2})\b/,
  /\b([a-zA-Z]{1,2}\s*[- ]?\s?\d{4,5}\s*[- ]?\s?[a-zA-Z]\s*[- ]?\s?\d{1,2})\b/,
  /\b(\d{1,4}\s*[- ]\s*[a-zA-Z]{1,3}\s*[- ]\s?\d{1,4})\b/,
];

// Map single Arabic letters to Latin so spoken plate letters (e.g. "أ") become "A".
const AR_LETTER_TO_LATIN = {
  ا: 'A', أ: 'A', إ: 'A', آ: 'A', ع: 'A', ة: 'A',
  ب: 'B', ت: 'T', ث: 'T', د: 'D', ذ: 'D', ض: 'D', ط: 'T', ظ: 'Z',
  ج: 'J', ح: 'H', خ: 'K', ه: 'H', ر: 'R', ز: 'Z', س: 'S', ش: 'C', ص: 'S',
  غ: 'G', ف: 'F', ق: 'Q', ك: 'K', ل: 'L', م: 'M', ن: 'N', و: 'W', ي: 'Y', ى: 'Y',
};

const translitPlate = (s) => String(s).split('').map((ch) => AR_LETTER_TO_LATIN[ch] || ch).join('');

const detectPlate = (raw) => {
  const text = translitPlate(String(raw));
  for (const p of PLATE_PATTERNS) {
    const m = text.match(p);
    if (m) return m[1].replace(/\s+/g, ' ').toUpperCase();
  }
  const token = text.split(/[\s,;]+/).find((w) => /[0-9]/.test(w) && /[a-zA-Z]/.test(w) && w.replace(/[^0-9a-zA-Z]/g, '').length >= 5);
  return token ? token.toUpperCase() : null;
};

const detectYear = (t) => {
  const m = t.match(/\b(19\d{2}|20\d{2})\b/);
  return m ? Number(m[1]) : null;
};

const detectPrice = (t) => {
  const m =
    t.match(/(\d[\d\s.,]*)\s*(?:dh|mad|dirham|euros?|euro|درهم|\/\s*jour|par jour|per day|day|jour|في اليوم|لليوم)/) ||
    t.match(/(?:prix|price|tarif|cout|ثمن|سعر)\D{0,12}(\d[\d\s.,]*)/);
  if (!m) return null;
  const n = Number(m[1].replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

const detectPhone = (t) => {
  const m = t.match(/(?:\+?\d[\d\s.-]{7,14}\d)/);
  if (!m) return null;
  const digits = m[0].replace(/[^\d+]/g, '');
  return digits.replace(/\D/g, '').length >= 8 ? digits : null;
};

const detectEmail = (t) => {
  const m = t.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  return m ? m[0] : null;
};

const detectNumberAfter = (t, keywords) => {
  for (const kw of keywords) {
    const re = new RegExp(`${kw}\\s*(\\d{1,5})`, 'i');
    const m = t.match(re);
    if (m) return Number(m[1]);
  }
  return null;
};

const findByName = (list, t, { preferBrandId } = {}) => {
  if (!Array.isArray(list) || !list.length) return null;
  const candidates = list
    .filter((it) => !preferBrandId || it.brandId === preferBrandId)
    .map((it) => ({ it, keys: [strip(it.name), ...(ALIASES[strip(it.name)] || []).map(strip)] }))
    .filter((x) => x.keys[0])
    .sort((a, b) => b.keys[0].length - a.keys[0].length);
  const has = (keys) => keys.some((k) => k && k.length > 1 && t.includes(k));
  const exact = candidates.find((x) => has(x.keys));
  if (exact) return exact.it;
  const word = candidates.find((x) => x.keys.some((k) => k.split(' ').some((w) => w.length > 2 && t.includes(w))));
  return word ? word.it : null;
};

// --- Field extraction --------------------------------------------------------
const extractCar = (raw, ctx, base = {}) => {
  const t = strip(raw);
  const out = { ...base };

  const brand = findByName(ctx.brandStore?.brands, t);
  if (brand) {
    out.brandId = brand.id;
    out.brandName = brand.name;
  }
  const model = findByName(ctx.modelStore?.models, t, { preferBrandId: out.brandId });
  if (model) {
    out.modelId = model.id;
    out.modelName = model.name;
  }

  const plate = detectPlate(raw);
  if (plate) out.licensePlate = plate;
  const year = detectYear(t);
  if (year) out.year = year;
  const price = detectPrice(t);
  if (price) out.pricePerDay = price;
  const seats = detectNumberAfter(t, ['places', 'passagers', 'seats', 'مقاعد']);
  if (seats) out.seats = seats;

  const fuel = FUEL_TYPES.find((f) => any(t, f.words));
  if (fuel) out.fuelType = fuel.id;

  if (any(t, ['automatique', 'automatic', 'اوتوماتيك', 'أوتوماتيك'])) out.transmission = 'automatic';
  else if (any(t, ['manuelle', 'manual', 'عادي'])) out.transmission = 'manual';

  const color = COLORS.find((c) => t.includes(c));
  if (color) out.color = color;

  if (!out.name) {
    out.name = [out.brandName, out.modelName].filter(Boolean).join(' ').trim();
  }
  return out;
};

const CAR_REQUIRED = [
  { key: 'licensePlate', ask: { fr: 'la plaque d’immatriculation', ar: 'رقم اللوحة' } },
  { key: 'brandId', ask: { fr: 'la marque (ex: Renault)', ar: 'الماركة (مثلاً رينو)' } },
  { key: 'modelId', ask: { fr: 'le modèle (ex: Clio)', ar: 'الموديل (مثلاً كليو)' } },
];

const extractClient = (raw, base = {}) => {
  const out = { ...base };

  const nom = raw.match(/(?:nom(?: de famille)?|last name|اسم العائلة|اللقب)\s*[:=]?\s*([\w\u0600-\u06FF' -]{2,})/i);
  const prenom = raw.match(/(?:prenom|prénom|first name|الاسم|الاسم الشخصي)\s*[:=]?\s*([\w\u0600-\u06FF' -]{2,})/i);
  if (nom) out.lastName = nom[1].trim().replace(/\s{2,}/g, ' ');
  if (prenom) out.firstName = prenom[1].trim().replace(/\s{2,}/g, ' ');

  if (!out.firstName && !out.lastName) {
    const m = raw.match(/(?:client|customer|nom|personne|عميل|زبون)\s+([\w\u0600-\u06FF' -]{2,40})/i);
    if (m) {
      const words = m[1].trim().split(/\s+/).filter(Boolean);
      const stop = new Set(['a', 'au', 'aux', 'le', 'la', 'les', 'nom', 'de', 'du']);
      const clean = words.filter((w) => !stop.has(w.toLowerCase()));
      if (clean.length === 1) out.firstName = clean[0];
      else if (clean.length > 1) {
        out.firstName = clean[0];
        out.lastName = clean.slice(1).join(' ');
      }
    }
  }

  const phone = detectPhone(raw);
  if (phone) out.phoneNumber = phone;
  const email = detectEmail(raw);
  if (email) out.email = email;

  const cin = raw.match(/(?:cin|cni|ciné|identite|identity|national id|cnic?|ب.ت.و|البطاقة الوطنية)\s*[:=]?\s*([A-Za-z0-9-]{5,})/i);
  if (cin) out.nationalId = cin[1];

  return out;
};

const CLIENT_REQUIRED = [
  { key: 'firstName', ask: { fr: 'le prénom', ar: 'الاسم الشخصي' } },
  { key: 'lastName', ask: { fr: 'le nom de famille', ar: 'اسم العائلة' } },
];

// --- Reply templates ---------------------------------------------------------
const T = {
  empty: { fr: 'Je vous écoute.', ar: 'أنا أسمعك.' },
  greeting: { fr: 'Bonjour ! Je suis votre assistant. Dites-moi ce que vous voulez faire.', ar: 'مرحبًا! أنا مساعدك الذكي. أخبرني بما تريد فعله.' },
  help: {
    fr: 'Je peux créer des voitures et des clients, répondre sur vos données et vous déplacer dans l’application. Essayez : crée une voiture Renault Clio 12345 A 6, ou combien de voitures disponibles.',
    ar: 'يمكنني إنشاء السيارات والعملاء، والإجابة عن بياناتك، والتنقل داخل التطبيق. جرّب: أنشئ سيارة رينو كليو 12345 أ 6، أو كم سيارة متاحة.',
  },
  missing: { fr: (a) => `Il me manque ${a}.`, ar: (a) => `ينقصني ${a}.` },
  carReady: { fr: (name, plate) => `C’est noté : ${name}, plaque ${plate}. Je crée la voiture.`, ar: (name, plate) => `تم التسجيل: ${name}، اللوحة ${plate}. جارٍ إنشاء السيارة.` },
  clientReady: { fr: (f, l) => `Client ${f} ${l} enregistré.`, ar: (f, l) => `تم إنشاء العميل ${f} ${l}.` },
  nav: { fr: (l) => `Je vous emmène : ${l}.`, ar: (l) => `أفتح لك: ${l}.` },
  carCreated: { fr: (name, plate) => `Voiture créée avec succès : ${name} (${plate}).`, ar: (name, plate) => `تم إنشاء السيارة بنجاح: ${name} (${plate}).` },
  clientCreated: { fr: (f, l) => `Client ${f} ${l} créé avec succès.`, ar: (f, l) => `تم إنشاء العميل ${f} ${l} بنجاح.` },
  carError: { fr: 'Impossible de créer la voiture. Vérifiez les champs requis.', ar: 'تعذّر إنشاء السيارة. تحقق من الحقول المطلوبة.' },
  clientError: { fr: 'Impossible de créer le client. Vérifiez les champs requis.', ar: 'تعذّر إنشاء العميل. تحقق من الحقول المطلوبة.' },
  limit: { fr: 'Limite de forfait dépassée.', ar: 'تم تجاوز حد العرض.' },
  micUnsupported: { fr: 'Votre navigateur ne gère pas la reconnaissance vocale. Utilisez le champ texte.', ar: 'متصفحك لا يدعم التعرف على الصوت. استخدم حقل الكتابة.' },
  micDenied: { fr: 'Autorisez le micro dans votre navigateur pour utiliser la voix.', ar: 'يرجى السماح باستخدام الميكروفون لتفعيل الصوت.' },
  speaker: { fr: 'Voix + texte activés', ar: 'الصوت والكتابة مفعّلان' },
  writingOnly: { fr: 'Micro non supporté (texte ok)', ar: 'بدون ميكروفون (الكتابة متاحة)' },
  listening: { fr: 'En écoute…', ar: 'أستمع…' },
  thinking: { fr: 'Réflexion…', ar: 'أفكر…' },
};

export const labels = T;

// --- Queries -----------------------------------------------------------------
const fmt = (n) => Number(n).toLocaleString('fr-FR');

const runQuery = (t, ctx, lang) => {
  const cars = ctx.carStore?.cars || [];
  const clients = ctx.clientStore?.clients || [];
  const brandOf = (id) => ctx.brandStore?.brands?.find((b) => b.id === id)?.name || '';

  const arAvailable = (a, total) => (lang === 'ar' ? `هناك ${a} سيارة متاحة من أصل ${total}.` : `Il y a ${fmt(a)} voiture${a > 1 ? 's' : ''} disponible${a > 1 ? 's' : ''} sur ${fmt(total)} au total.`);

  if (any(t, ['disponibles', 'disponible', 'available', 'libres', 'libre', 'متاح', 'متاحة', 'متوفر'])) {
    const avail = cars.filter((c) => (c.status || 'Available') === 'Available');
    return arAvailable(avail.length, cars.length);
  }

  if (any(t, CLIENT_NOUNS)) {
    if (any(t, ['liste', 'montre', 'show', 'quels', 'قائمة', 'لائحة', 'وريني'])) {
      const names = clients.slice(0, 8).map((c) => `${c.firstName || ''} ${c.lastName || ''}`.trim()).filter(Boolean);
      if (!names.length) return lang === 'ar' ? 'لا يوجد عملاء حاليًا.' : 'Aucun client pour le moment.';
      return lang === 'ar' ? `إليك بعض العملاء: ${names.join('، ')}.` : `Voici ${Math.min(8, clients.length)} clients : ${names.join(', ')}${clients.length > 8 ? ', et plus…' : ''}.`;
    }
    return lang === 'ar' ? `لديك ${fmt(clients.length)} عميل.` : `Vous avez ${fmt(clients.length)} client${clients.length > 1 ? 's' : ''} enregistré${clients.length > 1 ? 's' : ''}.`;
  }

  if (any(t, CAR_NOUNS)) {
    if (any(t, ['liste', 'montre', 'show', 'quelles', 'قائمة', 'لائحة', 'وريني'])) {
      const top = cars.slice(0, 8).map((c) => `${c.name || brandOf(c.brandId)} ${c.licensePlate || ''}`.trim());
      if (!top.length) return lang === 'ar' ? 'لا توجد سيارات حاليًا.' : 'Aucune voiture pour le moment.';
      return lang === 'ar' ? `إليك ${Math.min(8, cars.length)} سيارات: ${top.join('، ')}.` : `Voici ${Math.min(8, cars.length)} voitures : ${top.join(', ')}${cars.length > 8 ? ', et plus…' : ''}.`;
    }
    const avg = cars.length ? Math.round(cars.reduce((s, c) => s + (Number(c.pricePerDay) || 0), 0) / cars.length) : 0;
    return lang === 'ar'
      ? `لديك ${fmt(cars.length)} سيارة في الأسطول، بمتوسط ${fmt(avg)} درهم في اليوم.`
      : `Vous avez ${fmt(cars.length)} voiture${cars.length > 1 ? 's' : ''} dans le parc, à ${fmt(avg)} dirhams par jour en moyenne.`;
  }

  if (any(t, ['contrats', 'contrat', 'reservations', 'reservation', 'عقود', 'حجوزات', 'عقد', 'حجز'])) {
    const list = ctx.contratStore?.contrats || ctx.contratStore?.reservations || [];
    return lang === 'ar' ? `هناك ${fmt(list.length)} عقد أو حجز.` : `Il y a ${fmt(list.length)} contrat${list.length > 1 ? 's' : ''} / réservation${list.length > 1 ? 's' : ''} au total.`;
  }

  if (any(t, ['agences', 'agence', 'وكالات', 'وكالة'])) {
    const list = ctx.agencyStore?.agencies || [];
    return lang === 'ar' ? `لديك ${fmt(list.length)} وكالة.` : `Vous avez ${fmt(list.length)} agence${list.length > 1 ? 's' : ''}.`;
  }

  return null;
};

// --- Main --------------------------------------------------------------------
export const interpret = (raw = '', ctx = {}, draft = { type: null, fields: {} }) => {
  const lang = ctx.lang || detectLang(raw);
  const t = strip(raw);
  if (!t) return { reply: T.empty[lang], actions: [], draft, lang };

  const state = { type: draft.type || null, fields: { ...(draft.fields || {}) } };
  const keep = (next) => ({ type: next.type, fields: next.fields });
  const finish = (reply, actions = [], nextDraft = { type: null, fields: {} }) => ({ reply, actions, draft: nextDraft, lang });

  const wantsClient = any(t, CLIENT_NOUNS) && !any(t, ['liste des clients', 'les clients', 'قائمة العملاء', 'لائحة العملاء']);
  const wantsCar = any(t, CAR_NOUNS);
  const hasCreateVerb = any(t, CREATE_VERBS);

  // 1. Continuation: feeding fields to an active draft without a new intent.
  if (state.type && !hasCreateVerb && !any(t, NAV_MARKERS) && !any(t, QUERY_MARKERS) && !wantsClient && !wantsCar) {
    if (state.type === 'car') return resolveCar(extractCar(raw, ctx, state.fields), ctx, state, lang);
    if (state.type === 'client') return resolveClient(extractClient(raw, state.fields), state, lang);
  }

  // 2. Create client
  if (wantsClient && hasCreateVerb) {
    const base = state.type === 'client' ? state.fields : {};
    return resolveClient(extractClient(raw, base), state, lang);
  }

  // 3. Create car
  if (wantsCar && hasCreateVerb) {
    const base = state.type === 'car' ? state.fields : {};
    return resolveCar(extractCar(raw, ctx, base), ctx, state, lang);
  }

  // 4. Navigation — only when not creating and not querying.
  if (!hasCreateVerb && !any(t, QUERY_MARKERS)) {
    const route = ROUTES.find((r) => r.words.some((w) => t.includes(strip(w))));
    if (route) return finish(T.nav[lang](route.label[lang]), [{ type: 'navigate', path: route.path }]);
  }

  // 5. Data queries
  if (any(t, QUERY_MARKERS)) {
    const answer = runQuery(t, ctx, lang);
    if (answer) return finish(answer);
  }

  // 6. Greeting / help
  if (any(t, ['bonjour', 'salut', 'hello', 'hi ', 'bonsoir', 'سلام', 'مرحبا', 'أهلا', 'صباح الخير'])) {
    return finish(T.greeting[lang]);
  }
  if (any(t, ['aide', 'help', 'que peux tu', 'que peux-tu', 'quoi faire', 'مساعدة', 'ساعدني'])) {
    return finish(T.help[lang]);
  }

  // 7. Fallback
  return finish(`${lang === 'ar' ? 'لم أفهم جيدًا. ' : 'Je n’ai pas bien compris. '}${T.help[lang]}`, [], state.type ? keep(state) : { type: null, fields: {} });
};

function resolveCar(fields, ctx, state, lang) {
  const missing = CAR_REQUIRED.filter((r) => !fields[r.key]);
  if (missing.length) {
    return { reply: T.missing[lang](missing[0].ask[lang]), actions: [], draft: { type: 'car', fields }, lang };
  }
  if (!fields.name) {
    const b = ctx.brandStore?.brands?.find((x) => x.id === fields.brandId)?.name || 'Voiture';
    const m = ctx.modelStore?.models?.find((x) => x.id === fields.modelId)?.name || '';
    fields.name = `${b} ${m}`.trim();
  }
  return { reply: T.carReady[lang](fields.name, fields.licensePlate), actions: [{ type: 'create_car', payload: fields }], draft: { type: null, fields: {} }, lang };
}

function resolveClient(fields, state, lang) {
  const missing = CLIENT_REQUIRED.filter((r) => !fields[r.key]);
  if (missing.length) {
    return { reply: T.missing[lang](missing[0].ask[lang]), actions: [], draft: { type: 'client', fields }, lang };
  }
  return { reply: T.clientReady[lang](fields.firstName, fields.lastName), actions: [{ type: 'create_client', payload: fields }], draft: { type: null, fields: {} }, lang };
}

export default interpret;
