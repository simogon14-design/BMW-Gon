export type SupportedLanguage = 'en' | 'ar' | 'fr' | 'es';

export interface TranslationDictionary {
  // Navigation
  navArenas: string;
  navVipEmpire: string;
  navAffiliates: string;
  navProvablyFair: string;
  
  // Header & Wallet
  deposit: string;
  withdraw: string;
  wallet: string;
  balance: string;
  securityProtocol: string;
  provablyFairStatus: string;
  systemPing: string;
  vipTier: string;
  dailyBonusReady: string;
  dailyBonusClaimed: string;
  
  // Hero & Jackpot
  megaJackpot: string;
  realtimeAccumulator: string;
  seededPerWager: string;
  qualifyNow: string;
  highestMultiplier: string;
  playNow: string;
  launchRoyalCrash: string;
  provableEdge: string;
  instantSettlement: string;

  // VIP Progress
  vipProgress: string;
  nextTier: string;
  fastTrackVip: string;
  wagerNeeded: string;
  levelUpReward: string;

  // Social Proof Toasts
  liveWins: string;
  recentWinner: string;
  cashedOut: string;
  instantDispatched: string;
  verifiedOnChain: string;
  playGame: string;

  // Viral Referral & Affiliate Engine
  referralEngineTitle: string;
  partnerRevShare: string;
  copyReferralLink: string;
  linkCopied: string;
  shareWhatsApp: string;
  shareTelegram: string;
  shareFacebook: string;
  shareNative: string;
  scanQrCode: string;
  unclaimedCommission: string;
  instantWithdrawTrigger: string;
  conversionRate: string;
  totalClicks: string;
  activeRecruits: string;

  // Theme & Device Adaptation
  themeOled: string;
  themeObsidian: string;
  themeAuto: string;
  autoDetectedLanguage: string;

  // Psychological Luxury Financial Terminology
  instantDepositBoost: string;
  encryptedTreasuryVault: string;
  confirmDepositAction: string;
  instantWithdrawal: string;
  liveActivityLedger: string;
  provablyFairBadge: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    instantDepositBoost: 'Instant Deposit Boost +30%',
    encryptedTreasuryVault: 'Encrypted Treasury Vault',
    confirmDepositAction: 'Confirm & Instant Deposit',
    instantWithdrawal: 'Instant Withdrawal',
    liveActivityLedger: 'Live Activity Ledger',
    provablyFairBadge: 'Provably Fair Security Badge',
    navArenas: 'Live Arenas',
    navVipEmpire: 'VIP Empire',
    navAffiliates: 'Affiliate 30%',
    navProvablyFair: 'Provably Fair',

    deposit: 'Deposit',
    withdraw: 'Withdraw',
    wallet: 'Cold Vault',
    balance: 'Balance',
    securityProtocol: 'SECURITY: INSTITUTIONAL COLD VAULT',
    provablyFairStatus: 'PROVABLY FAIR SHA-256 PRE-COMMITTED',
    systemPing: 'SYSTEM PING: 18ms',
    vipTier: 'VIP TIER',
    dailyBonusReady: 'Daily VIP Bonus: +$250 Ready',
    dailyBonusClaimed: 'VIP Bonus Claimed',

    megaJackpot: 'Empire Grand Mega-Jackpot',
    realtimeAccumulator: 'REAL-TIME BLOCKCHAIN ACCUMULATOR',
    seededPerWager: '+0.12% Seeded with every wager',
    qualifyNow: 'QUALIFY NOW (MIN $1)',
    highestMultiplier: 'Highest Multiplier',
    playNow: 'Play Now',
    launchRoyalCrash: 'Launch Royal Crash',
    provableEdge: '99.4% Player RTP',
    instantSettlement: '< 150ms Instant',

    vipProgress: 'VIP Progress to',
    nextTier: 'Next Tier',
    fastTrackVip: 'Fast-Track VIP Status',
    wagerNeeded: 'Wager to Level Up',
    levelUpReward: 'Level-Up Bonus',

    liveWins: 'Live Platform Wins',
    recentWinner: 'Verified High Win',
    cashedOut: 'Cashed out',
    instantDispatched: 'Instant Payout Dispatched',
    verifiedOnChain: 'Verified SHA-256 Ledger',
    playGame: 'Play Game',

    referralEngineTitle: 'AUTOMATED VIRAL REFERRAL & 30% PARTNER ENGINE',
    partnerRevShare: '30% Lifetime Partner Share',
    copyReferralLink: 'Copy Referral Link',
    linkCopied: 'Link Copied to Clipboard!',
    shareWhatsApp: 'Share on WhatsApp',
    shareTelegram: 'Share on Telegram',
    shareFacebook: 'Share on Facebook',
    shareNative: '1-Tap Native Share',
    scanQrCode: 'Scan QR Code',
    unclaimedCommission: 'Unclaimed 30% Partner Share',
    instantWithdrawTrigger: 'INSTANT PAYOUT TRIGGER',
    conversionRate: 'Conversion Rate',
    totalClicks: 'Total Link Clicks',
    activeRecruits: 'Active Recruits',

    themeOled: 'OLED Pure Black',
    themeObsidian: 'Deep Obsidian',
    themeAuto: 'Auto-Matched to Device',
    autoDetectedLanguage: 'Auto-Detected Locale',
  },

  ar: {
    navArenas: 'صالات الألعاب',
    navVipEmpire: 'إمبراطورية VIP',
    navAffiliates: 'الشركاء 30%',
    navProvablyFair: 'النزاهة المشفرة',

    deposit: 'إيداع فوري',
    withdraw: 'سحب الأرباح',
    wallet: 'الخزينة الباردة',
    balance: 'الرصيد الملكي',
    securityProtocol: 'بروتوكول الأمان: خزينة مؤسسية باردة',
    provablyFairStatus: 'نزاهة مثبتة SHA-256 مسجلة مسبقاً',
    systemPing: 'استجابة السيرفر: 18ms',
    vipTier: 'الرتبة الملكية',
    dailyBonusReady: 'مكافأة VIP اليومية: +$250 جاهزة',
    dailyBonusClaimed: 'تم استلام المكافأة اليومية',

    megaJackpot: 'الجائزة الكبرى الملكية التراكمية',
    realtimeAccumulator: 'تراكم البلوكشين المباشر في الوقت الحقيقي',
    seededPerWager: '+0.12% تغذية فورية مع كل رهان',
    qualifyNow: 'تأهل للجائزة الكبرى الآن',
    highestMultiplier: 'أعلى مضاعف مسجل',
    playNow: 'العب الآن',
    launchRoyalCrash: 'تشغيل لعبة كراش الملكية',
    provableEdge: '99.4% نسبة العائد للاعب (RTP)',
    instantSettlement: 'تسوية فورية < 150 ملي ثانية',

    vipProgress: 'التقدم نحو رتبة',
    nextTier: 'الرتبة القادمة',
    fastTrackVip: 'تسريع الترقية الملكية VIP',
    wagerNeeded: 'رهان متبقٍ للترقية',
    levelUpReward: 'مكافأة الصعود',

    liveWins: 'سجل الانتصارات الحية',
    recentWinner: 'فوز موثق بالأدلة المشفرة',
    cashedOut: 'سحب أرباحه بمبلغ',
    instantDispatched: 'تم إرسال السحب الفوري للبلوكشين',
    verifiedOnChain: 'مسجل في دفتر الحسابات المشفر',
    playGame: 'العب اللعبة',

    referralEngineTitle: 'محرك الإحالة الفيروسي وعوائد الشركاء 30%',
    partnerRevShare: 'حصة الشريك الملكي 30% مدى الحياة',
    copyReferralLink: 'نسخ رابط الإحالة الفوري',
    linkCopied: 'تم نسخ الرابط بنجاح!',
    shareWhatsApp: 'مشاركة عبر واتساب',
    shareTelegram: 'مشاركة عبر تليغرام',
    shareFacebook: 'مشاركة عبر فيسبوك',
    shareNative: 'مشاركة سريعة بنقرة واحدة',
    scanQrCode: 'مسح رمز QR',
    unclaimedCommission: 'عوائد الشركاء غير المسحوبة (30%)',
    instantWithdrawTrigger: 'صرف الأرباح الفوري إلى المحفظة',
    conversionRate: 'معدل التحويل النشط',
    totalClicks: 'إجمالي النقرات',
    activeRecruits: 'اللاعبون النشطون',

    themeOled: 'شاشة أوليد (سواد نقي)',
    themeObsidian: 'أوبسيديان ملكي فاخر',
    themeAuto: 'متوافق تلقائياً مع شاشة الهاتف',
    autoDetectedLanguage: 'تم التعرف على لغة جهازك تلقائياً',

    instantDepositBoost: 'مكافأة السيولة السريعة +30%',
    encryptedTreasuryVault: 'الخزينة الملوكية المشفرة',
    confirmDepositAction: 'تأكيد الإيداع والشحن الفوري',
    instantWithdrawal: 'سحب الأرباح الفوري',
    liveActivityLedger: 'شريط الرهانات المباشرة عالية السيولة',
    provablyFairBadge: 'نظام الضمان الرقمي المعتمد',
  },

  fr: {
    instantDepositBoost: 'Boost de Liquidité Immédiat +30%',
    encryptedTreasuryVault: 'Coffre Trésorerie Chiffré',
    confirmDepositAction: 'Confirmer et Dépôt Instantané',
    instantWithdrawal: 'Retrait Immédiat',
    liveActivityLedger: "Journal d'Activité en Direct",
    provablyFairBadge: 'Garantie Numérique Certifiée',

    navArenas: 'Arènes en Direct',
    navVipEmpire: 'Empire VIP',
    navAffiliates: 'Affiliation 30%',
    navProvablyFair: 'Équité Prouvée',

    deposit: 'Dépôt',
    withdraw: 'Retrait',
    wallet: 'Coffre Froid',
    balance: 'Solde',
    securityProtocol: 'SÉCURITÉ: COFFRE-FORT INSTITUTIONNEL',
    provablyFairStatus: 'PROVABLY FAIR SHA-256 PRÉ-ENGAGÉ',
    systemPing: 'PING SYSTÈME: 18ms',
    vipTier: 'RANG VIP',
    dailyBonusReady: 'Bonus Quotidien VIP: +$250 Prêt',
    dailyBonusClaimed: 'Bonus VIP Réclamé',

    megaJackpot: 'Grand Méga-Jackpot Impérial',
    realtimeAccumulator: 'ACCUMULATEUR BLOCKCHAIN EN TEMPS RÉEL',
    seededPerWager: '+0.12% Alimenté à chaque mise',
    qualifyNow: 'SE QUALIFIER (MIN 1$)',
    highestMultiplier: 'Multiplicateur Record',
    playNow: 'Jouer Maintenant',
    launchRoyalCrash: 'Lancer Royal Crash',
    provableEdge: '99.4% RTP Joueur',
    instantSettlement: '< 150ms Instantané',

    vipProgress: 'Progression VIP vers',
    nextTier: 'Prochain Palier',
    fastTrackVip: 'Accélérer le Statut VIP',
    wagerNeeded: 'Mise requise pour monter',
    levelUpReward: 'Prime de Niveau',

    liveWins: 'Gains en Direct de la Plateforme',
    recentWinner: 'Gagnant Certifié',
    cashedOut: 'A encaissé',
    instantDispatched: 'Paiement Instantané Envoyé',
    verifiedOnChain: 'Registre SHA-256 Vérifié',
    playGame: 'Rejoindre la Partie',

    referralEngineTitle: 'MOTEUR DE PARRAINAGE VIRAL & 30% PARTENAIRE',
    partnerRevShare: '30% Part Partenaire à Vie',
    copyReferralLink: "Copier le Lien d'Affiliation",
    linkCopied: 'Lien copié dans le presse-papier !',
    shareWhatsApp: 'Partager sur WhatsApp',
    shareTelegram: 'Partager sur Telegram',
    shareFacebook: 'Partager sur Facebook',
    shareNative: 'Partage Natif 1-Clic',
    scanQrCode: 'Scanner le QR Code',
    unclaimedCommission: 'Commissions 30% en Attente',
    instantWithdrawTrigger: 'DÉCLENCHER LE RETRAIT IMMÉDIAT',
    conversionRate: 'Taux de Conversion',
    totalClicks: 'Clics sur le Lien',
    activeRecruits: 'Recrues Actives',

    themeOled: 'OLED Noir Pur',
    themeObsidian: 'Obsidienne Royale',
    themeAuto: 'Adapté Automatiquement au Mobile',
    autoDetectedLanguage: 'Langue Détectée Automatiquement',
  },

  es: {
    navArenas: 'Salas en Vivo',
    navVipEmpire: 'Imperio VIP',
    navAffiliates: 'Afiliados 30%',
    navProvablyFair: 'Juego Justo Provable',

    deposit: 'Depositar',
    withdraw: 'Retirar',
    wallet: 'Bóveda Fría',
    balance: 'Saldo',
    securityProtocol: 'SEGURIDAD: BÓVEDA FRÍA INSTITUCIONAL',
    provablyFairStatus: 'PROVABLY FAIR SHA-256 PRE-COMPROMETIDO',
    systemPing: 'PING DEL SISTEMA: 18ms',
    vipTier: 'NIVEL VIP',
    dailyBonusReady: 'Bono Diario VIP: +$250 Listo',
    dailyBonusClaimed: 'Bono VIP Reclamado',

    megaJackpot: 'Gran Mega-Bote Progresivo',
    realtimeAccumulator: 'ACUMULADOR BLOCKCHAIN EN TIEMPO REAL',
    seededPerWager: '+0.12% Añadido con cada apuesta',
    qualifyNow: 'CALIFICAR AHORA (MIN $1)',
    highestMultiplier: 'Multiplicador Más Alto',
    playNow: 'Jugar Ahora',
    launchRoyalCrash: 'Lanzar Royal Crash',
    provableEdge: '99.4% RTP Jugador',
    instantSettlement: '< 150ms Instantáneo',

    vipProgress: 'Progreso VIP hacia',
    nextTier: 'Siguiente Nivel',
    fastTrackVip: 'Acelerar Nivel VIP',
    wagerNeeded: 'Apuesta para Subir',
    levelUpReward: 'Bono por Subir de Nivel',

    liveWins: 'Ganancias en Vivo de la Plataforma',
    recentWinner: 'Ganador Verificado',
    cashedOut: 'Cobró',
    instantDispatched: 'Pago Instantáneo Enviado',
    verifiedOnChain: 'Libro Contable SHA-256 Verificado',
    playGame: 'Jugar Partida',

    referralEngineTitle: 'MOTOR DE AFILIACIÓN VIRAL Y 30% SOCIO',
    partnerRevShare: '30% Participación Vitalicia de Socio',
    copyReferralLink: 'Copiar Enlace de Afiliado',
    linkCopied: '¡Enlace copiado al portapapeles!',
    shareWhatsApp: 'Compartir en WhatsApp',
    shareTelegram: 'Compartir en Telegram',
    shareFacebook: 'Compartir en Facebook',
    shareNative: 'Compartir Nativo 1-Toque',
    scanQrCode: 'Escanear Código QR',
    unclaimedCommission: 'Comisiones del 30% por Reclamar',
    instantWithdrawTrigger: 'DISPARAR RETIRO INMEDIATO',
    conversionRate: 'Tasa de Conversión',
    totalClicks: 'Clics en el Enlace',
    activeRecruits: 'Reclutas Activos',

    themeOled: 'OLED Negro Puro',
    themeObsidian: 'Obsidiana Profunda',
    themeAuto: 'Adaptado Automáticamente al Dispositivo',
    autoDetectedLanguage: 'Idioma Detectado Automáticamente',

    instantDepositBoost: 'Bono de Liquidez Rápida +30%',
    encryptedTreasuryVault: 'Bóveda del Tesoro Encriptada',
    confirmDepositAction: 'Confirmar y Depósito Inmediato',
    instantWithdrawal: 'Retiro Instantáneo',
    liveActivityLedger: 'Registro de Actividad en Vivo',
    provablyFairBadge: 'Garantía Digital Certificada',
  },
};

/**
 * Automatically detects device language from navigator.language
 * Defaults to 'ar' (Arabic First RTL) for the Sovereign Platform
 */
export function detectDeviceLanguage(): SupportedLanguage {
  if (typeof window === 'undefined' || !navigator) return 'ar';

  const userLangs = [
    navigator.language,
    ...(navigator.languages || []),
  ].filter(Boolean);

  for (const lang of userLangs) {
    const l = lang.toLowerCase();
    if (l.startsWith('ar')) return 'ar';
    if (l.startsWith('fr')) return 'fr';
    if (l.startsWith('es')) return 'es';
    if (l.startsWith('en')) return 'en';
  }

  // Native Arabic First Sovereign Platform Default
  return 'ar';
}

/**
 * Detects whether the user device prefers OLED true black or high contrast
 */
export function detectDeviceDisplayMode(): 'oled_black' | 'deep_obsidian' {
  if (typeof window === 'undefined') return 'deep_obsidian';

  // Check if device has an OLED or dark mode with high contrast preference
  const prefersMoreContrast = window.matchMedia?.('(prefers-contrast: more)')?.matches;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  
  // High-contrast dark or AMOLED screen defaults to ultra-crisp OLED black
  if (prefersMoreContrast && prefersDark) {
    return 'oled_black';
  }

  return 'deep_obsidian';
}
