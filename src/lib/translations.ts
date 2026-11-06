export type Language = 'da' | 'en' | 'de' | 'sv' | 'es' | 'fr';

export interface TranslationDict {
  badgeAntiSaas: string;
  auditTag: string;
  stepOf: (curr: number, total: number) => string;
  btnSelect: string;
  btnBack: string;
  formTitle: string;
  formSubtitle: string;
  fieldName: string;
  fieldEmail: string;
  fieldCompany: string;
  btnSubmit: string;
  analyzingText: string;
  docTitle: string;
  approvedBadge: string;
  calendarTitle: string;
  btnBook: (date: string, time: string) => string;
  bookedTitle: string;
  bookedSubtitle: (email: string) => string;
  btnReset: string;
  savingsTitle: string;
  savingsSubtitle: string;
  usersLabel: string;
  leadsLabel: string;
  scoreAppCost: string;
  calendlyCost: string;
  totalOldCost: string;
  qualicalCost: string;
  netSavings: string;
  scannerTitle: string;
  scannerSubtitle: string;
  scannerPlaceholder: string;
  btnScan: string;
  scanSuccess: (domain: string) => string;
  pricingTitle: string;
  pricingSubtitle: string;
  planSoloTitle: string;
  planSoloPrice: string;
  planSoloSub: string;
  planSoloFeatures: string[];
  planAgencyTitle: string;
  planAgencyPrice: string;
  planAgencySub: string;
  planAgencyFeatures: string[];
  planLifetimeTitle: string;
  planLifetimePrice: string;
  planLifetimeSub: string;
  planLifetimeFeatures: string[];
  btnBuyNow: string;
  guaranteeText: string;
  questions: {
    id: string;
    title: string;
    subtitle: string;
    options: { label: string; score: number; desc?: string }[];
  }[];
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  da: {
    badgeAntiSaas: "Anti-SaaS Protokol",
    auditTag: "Katalog Nr. 2026-Q · B2B Audit",
    stepOf: (curr, total) => `Spørgsmål ${curr} af ${total}`,
    btnSelect: "[VÆLG]",
    btnBack: "← Gå ét skridt tilbage",
    formTitle: "Hvem skal analysen stiles til?",
    formSubtitle: "Vores bagvedliggende model evaluerer forudsætningerne mod vores B2B standard inden for 1 sekund.",
    fieldName: "Fulde Navn",
    fieldEmail: "Arbejds-email",
    fieldCompany: "Virksomhed",
    btnSubmit: "Gennemfør Vurdering & Åbn Kalender",
    analyzingText: "GuudEngine™ analyserer dine svar...",
    docTitle: "DOKUMENT / KVALIFIKATION",
    approvedBadge: "GODKENDT",
    calendarTitle: "Vælg ønsket mødetidspunkt",
    btnBook: (d, t) => `Reserver Møde (${d} kl. ${t})`,
    bookedTitle: "Mødet er Noteret",
    bookedSubtitle: (email) => `En formel kalendernotits med link er sendt til ${email}.`,
    btnReset: "Gennemfør en ny audit",
    savingsTitle: "Hvad koster dine nuværende abonnementer?",
    savingsSubtitle: "Sammenlign ScoreApp + Calendly med GuudCals enkle model.",
    usersLabel: "Antal konsulenter i teamet:",
    leadsLabel: "Månedlige leads / bookinger:",
    scoreAppCost: "ScoreApp Licens:",
    calendlyCost: "Calendly Licenser:",
    totalOldCost: "Nuværende årlig SaaS-udgift:",
    qualicalCost: "GuudCal Årlig Cloud:",
    netSavings: "Din årlige besparelse:",
    scannerTitle: "Auto-Branding: Tilpas til din hjemmeside",
    scannerSubtitle: "Tast dit domæne – vi scanner din side og adapterer farver og logo automatisk.",
    scannerPlaceholder: "ditfirma.dk",
    btnScan: "Scan & Tilpas",
    scanSuccess: (domain) => `Farvetema udvundet fra ${domain}!`,
    pricingTitle: "Gennemskuelige Priser (Inkl. SMS & BYOK)",
    pricingSubtitle: "Ingen skjulte gebyrer. Vælg mellem fleksibel månedlig cloud eller evig BYOK licens.",
    planSoloTitle: "Cloud Solo",
    planSoloPrice: "199 kr.",
    planSoloSub: "pr. måned (eller 1.590 kr./år)",
    planSoloFeatures: [
      "1 aktivt website / domæne",
      "50 SMS påmindelser / mdr. inkluderet (0% no-shows)",
      "250 gratis GuudEngine AI-scoringer / mdr.",
      "Ubegrænsede mødebookinger",
      "Auto-Brand Website Scanner",
      "Google & Outlook 2-vejs synkronisering"
    ],
    planAgencyTitle: "Agency Pro (Mest Populære)",
    planAgencyPrice: "399 kr.",
    planAgencySub: "pr. måned (eller 3.190 kr./år)",
    planAgencyFeatures: [
      "Op til 10 klient-domæner",
      "250 SMS påmindelser / mdr. inkluderet",
      "100% White-Label (Fjern GuudCal-mærke)",
      "1.000 gratis GuudEngine AI-scoringer / mdr.",
      "Ubegrænsede team-medlemmer",
      "Direkte CRM- og Webhook-synkronisering"
    ],
    planLifetimeTitle: "👑 Lifetime Agency (BYOK)",
    planLifetimePrice: "7.999 kr.",
    planLifetimeSub: "Engangsbeløb for livet",
    planLifetimeFeatures: [
      "Bring Your Own Key (Brug egen LLM nøgle)",
      "0 kr. i AI-udgifter til os for evigt",
      "Op til 10 klient-domæner & White-Label",
      "Fuld datakontrol & Enterprise GDPR sikkerhed",
      "Brug frit egen OpenAI, Claude eller valgfri LLM API-nøgle",
      "Fuld adgang til kildekode & prioriteret support"
    ],
    btnBuyNow: "Vælg Plan →",
    guaranteeText: "🔒 14 dages fuld tilfredshedsgaranti eller pengene tilbage. Ingen binding på abonnementer.",
    questions: [
      {
        id: 'goal',
        title: 'Hvad er jeres primære strategiske fokus de næste 90 dage?',
        subtitle: 'Vælg den mulighed der vejer tungest i jeres ledelsesbeslutninger.',
        options: [
          { label: 'Skære ned på oppustede SaaS-abonnementer', score: 30, desc: 'Erstatte 5-10 dyre værktøjer med clean-room løsninger' },
          { label: 'Automatisere salgs- og lead-kvalificering', score: 25, desc: 'Filtre useriøse bookinger fra automatisk' },
          { label: 'Skalere B2B mødevolumen for salgsteamet', score: 20, desc: 'Få booket 20+ højværdikunder hver måned' },
          { label: 'Afprøve AI-drevne mikrosider og quizzer', score: 15, desc: 'Eksperimentere med nye konverteringsformater' },
        ],
      },
      {
        id: 'budget',
        title: 'Hvad er jeres nuværende månedlige tech- & softwarebudget?',
        subtitle: 'Hjælper os med at vurdere den optimale implementeringsmodel.',
        options: [
          { label: 'Over 50.000 kr. / måned', score: 30, desc: 'Enterprise / etableret organisation' },
          { label: '15.000 – 50.000 kr. / måned', score: 25, desc: 'Vækstvirksomhed med aktivt tech-stack' },
          { label: '5.000 – 15.000 kr. / måned', score: 15, desc: 'Mindre bureau eller konsulenthus' },
          { label: 'Under 5.000 kr. / måned', score: 5, desc: 'Startup eller solo-selvstændig' },
        ],
      },
      {
        id: 'meetings',
        title: 'Hvor mange salgsmøder afholder I typisk om måneden?',
        subtitle: 'Kvaliteten af din kalendertid er afgørende for ROI.',
        options: [
          { label: '25+ strategiske møder', score: 25, desc: 'Høj volumen – stor tidsbesparelse på screening' },
          { label: '10 – 25 møder', score: 20, desc: 'Moderat volumen med plads til kvalitetsløft' },
          { label: '3 – 10 møder', score: 15, desc: 'Selektivt fokus på få, store aftaler' },
          { label: 'Under 3 møder', score: 5, desc: 'Lige startet med aktiv outreach' },
        ],
      },
      {
        id: 'pain',
        title: 'Hvad er den største frustration i jeres nuværende setup?',
        subtitle: 'Vi bruger dette til at tilpasse mødeagendaen 100% til jeres situation.',
        options: [
          { label: 'Useriøse "tidsrøvere" der booker uden budget', score: 25, desc: 'Mangel på screening før kalenderen åbnes' },
          { label: 'Dobbeltbetaling for ScoreApp, Typeform OG Calendly', score: 20, desc: 'For mange fragmenterede abonnementer' },
          { label: 'Lav gennemførselsprocent og no-shows', score: 15, desc: 'Leads mangler motivation efter booking' },
          { label: 'Manuel copy-paste mellem quiz og CRM', score: 10, desc: 'Mangel på automatisk dataflow' },
        ],
      },
    ],
  },
  en: {
    badgeAntiSaas: "Anti-SaaS Protocol",
    auditTag: "Catalog No. 2026-Q · B2B Audit",
    stepOf: (curr, total) => `Question ${curr} of ${total}`,
    btnSelect: "[SELECT]",
    btnBack: "← Go one step back",
    formTitle: "Who should receive this assessment?",
    formSubtitle: "Our scoring model evaluates your inputs against industry benchmarks in under 1 second.",
    fieldName: "Full Name",
    fieldEmail: "Work Email",
    fieldCompany: "Company Name",
    btnSubmit: "Evaluate Match & Open Calendar",
    analyzingText: "GuudEngine™ is analyzing your inputs...",
    docTitle: "DOCUMENT / QUALIFICATION",
    approvedBadge: "APPROVED",
    calendarTitle: "Select your preferred meeting slot",
    btnBook: (d, t) => `Reserve Slot (${d} at ${t})`,
    bookedTitle: "Meeting Confirmed",
    bookedSubtitle: (email) => `A calendar invitation with meeting links has been delivered to ${email}.`,
    btnReset: "Perform another audit",
    savingsTitle: "How much are you spending on SaaS subscriptions?",
    savingsSubtitle: "Compare ScoreApp + Calendly against GuudCal's streamlined pricing.",
    usersLabel: "Consultants / team members:",
    leadsLabel: "Monthly leads / bookings:",
    scoreAppCost: "ScoreApp Subscription:",
    calendlyCost: "Calendly Subscriptions:",
    totalOldCost: "Current annual SaaS spend:",
    qualicalCost: "GuudCal Annual Cloud:",
    netSavings: "Your annual net savings:",
    scannerTitle: "Auto-Branding: Match your website's look",
    scannerSubtitle: "Enter your domain – we scan your website and extract your exact brand colors and theme.",
    scannerPlaceholder: "company.com",
    btnScan: "Scan & Apply",
    scanSuccess: (domain) => `Brand theme extracted from ${domain}!`,
    pricingTitle: "Transparent Pricing (Incl. SMS & BYOK)",
    pricingSubtitle: "No hidden extras. Choose between low monthly cloud or lifetime BYOK ownership.",
    planSoloTitle: "Cloud Solo",
    planSoloPrice: "$29",
    planSoloSub: "per month (or $249/yr)",
    planSoloFeatures: [
      "1 active website / domain",
      "50 SMS booking reminders included monthly (0% no-shows)",
      "250 free GuudEngine AI evaluations / mo",
      "Unlimited calendar appointments",
      "Auto-Brand Website Scanner",
      "Google & Outlook 2-way sync"
    ],
    planAgencyTitle: "Agency Pro (Most Popular)",
    planAgencyPrice: "$59",
    planAgencySub: "per month (or $499/yr)",
    planAgencyFeatures: [
      "Up to 10 client domains",
      "250 SMS booking reminders included monthly",
      "100% White-Label (Remove GuudCal branding)",
      "1,000 free GuudEngine AI evaluations / mo",
      "Unlimited team seats",
      "Direct CRM & Webhook synchronization"
    ],
    planLifetimeTitle: "👑 Lifetime Agency (BYOK)",
    planLifetimePrice: "$1,199",
    planLifetimeSub: "One-time payment for life",
    planLifetimeFeatures: [
      "Bring Your Own Key (Use your own LLM key)",
      "$0 recurring AI fees to us forever",
      "Up to 10 client domains & 100% White-Label",
      "Complete data sovereignty & GDPR privacy",
      "Freely use your own OpenAI, Claude or LLM API key",
      "Full source code access & priority support"
    ],
    btnBuyNow: "Select Plan →",
    guaranteeText: "🔒 14-day 100% money-back guarantee. Cancel subscriptions anytime.",
    questions: [
      {
        id: 'goal',
        title: 'What is your primary strategic focus over the next 90 days?',
        subtitle: 'Select the option that carries the most weight in your executive decisions.',
        options: [
          { label: 'Eliminating bloated recurring SaaS subscriptions', score: 30, desc: 'Replace 5-10 expensive apps with clean-room tools' },
          { label: 'Automating sales lead qualification', score: 25, desc: 'Filter unqualified calls before they hit your calendar' },
          { label: 'Scaling B2B meeting volume for the team', score: 20, desc: 'Consistently book 20+ high-value prospects monthly' },
          { label: 'Deploying AI-driven quiz microsites', score: 15, desc: 'Test modern, interactive conversion funnels' },
        ],
      },
      {
        id: 'budget',
        title: 'What is your current monthly software and tech budget?',
        subtitle: 'Helps us recommend the most capital-efficient implementation.',
        options: [
          { label: 'Over $7,500 / month', score: 30, desc: 'Established enterprise / mature organization' },
          { label: '$2,000 – $7,500 / month', score: 25, desc: 'High-growth company with active tech stack' },
          { label: '$500 – $2,000 / month', score: 15, desc: 'Boutique agency or consultancy' },
          { label: 'Under $500 / month', score: 5, desc: 'Early stage startup or boutique solo firm' },
        ],
      },
      {
        id: 'meetings',
        title: 'How many sales discovery calls do you hold monthly?',
        subtitle: 'Protecting your calendar time is essential for healthy unit economics.',
        options: [
          { label: '25+ strategic calls', score: 25, desc: 'High volume – massive screening savings' },
          { label: '10 – 25 calls', score: 20, desc: 'Moderate volume with room for quality tuning' },
          { label: '3 – 10 calls', score: 15, desc: 'Selective focus on a few high-ticket deals' },
          { label: 'Fewer than 3 calls', score: 5, desc: 'Just starting proactive outbound outreach' },
        ],
      },
      {
        id: 'pain',
        title: 'What is the biggest friction point in your current booking flow?',
        subtitle: 'We tailor the agenda 100% to address this bottleneck.',
        options: [
          { label: 'Unqualified tire-kickers booking without real budget', score: 25, desc: 'Zero screening prior to calendar access' },
          { label: 'Paying recurring fees for ScoreApp, Typeform AND Calendly', score: 20, desc: 'Fragmented SaaS stack eating profit margins' },
          { label: 'High drop-off between questionnaire and booking', score: 15, desc: 'Prospects lose momentum when redirected to email' },
          { label: 'Manual copy-pasting answers into CRM', score: 10, desc: 'Absence of unified direct pipeline data' },
        ],
      },
    ],
  },
  de: {
    badgeAntiSaas: "Anti-SaaS Protokoll",
    auditTag: "Katalog Nr. 2026-Q · B2B Audit",
    stepOf: (curr, total) => `Frage ${curr} von ${total}`,
    btnSelect: "[AUSWÄHLEN]",
    btnBack: "← Einen Schritt zurück",
    formTitle: "An wen soll die Auswertung adressiert werden?",
    formSubtitle: "Unser Modell evaluiert Ihre Angaben in unter 1 Sekunde gegen B2B-Benchmarks.",
    fieldName: "Vollständiger Name",
    fieldEmail: "Geschäftliche E-Mail",
    fieldCompany: "Unternehmen",
    btnSubmit: "Bewertung durchführen & Kalender öffnen",
    analyzingText: "GuudEngine™ analysiert Ihre Antworten...",
    docTitle: "DOKUMENT / QUALIFIZIERUNG",
    approvedBadge: "QUALIFIZIERT",
    calendarTitle: "Wählen Sie Ihren Wunschtermin",
    btnBook: (d, t) => `Termin reservieren (${d} um ${t})`,
    bookedTitle: "Termin Bestätigt",
    bookedSubtitle: (email) => `Eine offizielle Kalendereinladung wurde an ${email} versendet.`,
    btnReset: "Neue Prüfung starten",
    savingsTitle: "Wie viel zahlen Sie aktuell für SaaS-Abos?",
    savingsSubtitle: "Vergleichen Sie ScoreApp + Calendly mit GuudCal.",
    usersLabel: "Anzahl Berater im Team:",
    leadsLabel: "Monatliche Leads / Buchungen:",
    scoreAppCost: "ScoreApp Abonnement:",
    calendlyCost: "Calendly Abonnements:",
    totalOldCost: "Bisherige jährliche SaaS-Kosten:",
    qualicalCost: "GuudCal Jahresgebühr:",
    netSavings: "Ihre jährliche Ersparnis:",
    scannerTitle: "Auto-Branding: Website-Design anpassen",
    scannerSubtitle: "Geben Sie Ihre Domain ein – wir übernehmen Farben und Design automatisch.",
    scannerPlaceholder: "ihrefirma.de",
    btnScan: "Scannen & Anwenden",
    scanSuccess: (domain) => `Marken-Farbpalette von ${domain} geladen!`,
    pricingTitle: "Transparente Tarife (Inkl. SMS & BYOK)",
    pricingSubtitle: "Wählen Sie zwischen monatlichem Cloud-Service oder dauerhafter BYOK-Lizenz.",
    planSoloTitle: "Cloud Solo",
    planSoloPrice: "29 €",
    planSoloSub: "pro Monat (oder 249 €/Jahr)",
    planSoloFeatures: [
      "1 aktive Website / Domain",
      "50 SMS-Erinnerungen / Monat inklusive",
      "250 GuudEngine KI-Bewertungen / Monat",
      "Unbegrenzte Kalendertermine",
      "Auto-Brand Website-Scanner",
      "Google & Outlook 2-Wege-Sync"
    ],
    planAgencyTitle: "Agency Pro (Beliebteste)",
    planAgencyPrice: "59 €",
    planAgencySub: "pro Monat (oder 499 €/Jahr)",
    planAgencyFeatures: [
      "Bis zu 10 Kunden-Domains",
      "250 SMS-Erinnerungen / Monat inklusive",
      "100% White-Label (Eigenes Branding)",
      "1.000 GuudEngine KI-Bewertungen / Monat",
      "Unbegrenzte Teammitglieder",
      "Direkte CRM-Synchronisierung"
    ],
    planLifetimeTitle: "👑 Lifetime Agency (BYOK)",
    planLifetimePrice: "1.099 €",
    planLifetimeSub: "Einmalzahlung auf Lebenszeit",
    planLifetimeFeatures: [
      "Bring Your Own Key (Eigener KI-Schlüssel)",
      "0 € wiederkehrende KI-Kosten an uns",
      "Bis zu 10 Kunden-Domains & White-Label",
      "Volle Datenhoheit & DSGVO-Konformität",
      "Eigene API-Schlüssel (OpenAI, Claude, freie Modellwahl)",
      "Vollständiger Quellcode & Support"
    ],
    btnBuyNow: "Tarif wählen →",
    guaranteeText: "🔒 14 Tage Geld-zurück-Garantie. Jederzeit kündbar.",
    questions: [
      {
        id: 'goal',
        title: 'Was ist Ihr strategischer Hauptfokus der nächsten 90 Tage?',
        subtitle: 'Wählen Sie die Priorität, die Ihre Führungsentscheidungen leitet.',
        options: [
          { label: 'Reduzierung aufgeblähter monatlicher SaaS-Abos', score: 30, desc: 'Ersatz teurer Tools durch Clean-Room-Lösungen' },
          { label: 'Automatisierung der B2B-Lead-Qualifizierung', score: 25, desc: 'Unqualifizierte Anfragen vorab herausfiltern' },
          { label: 'Skalierung hochwertiger Strategietermine', score: 20, desc: '20+ qualifizierte Neukundentermine pro Monat' },
          { label: 'Einsatz KI-gestützter Quiz-Landingpages', score: 15, desc: 'Neue, interaktive Conversion-Formate testen' },
        ],
      },
      {
        id: 'budget',
        title: 'Wie hoch ist Ihr monatliches Software- und Tech-Budget?',
        subtitle: 'Hilft uns bei der Bestimmung des passenden Implementierungsmodells.',
        options: [
          { label: 'Über 7.000 € / Monat', score: 30, desc: 'Etabliertes Unternehmen / Konzernstruktur' },
          { label: '2.000 – 7.000 € / Monat', score: 25, desc: 'Wachstumsagentur mit aktivem Tech-Stack' },
          { label: '500 – 2.000 € / Monat', score: 15, desc: 'Boutique-Beratung oder kleineres Studio' },
          { label: 'Unter 500 € / Monat', score: 5, desc: 'Startup oder Solo-Dienstleister' },
        ],
      },
      {
        id: 'meetings',
        title: 'Wie viele Beratungs- und Verkaufsgespräche führen Sie monatlich?',
        subtitle: 'Der Schutz Ihrer Kalenderzeit ist entscheidend für die Rentabilität.',
        options: [
          { label: 'Über 25 Gespräche', score: 25, desc: 'Hohes Volumen – signifikante Entlastung durch Filter' },
          { label: '10 – 25 Gespräche', score: 20, desc: 'Solides Volumen mit Optimierungspotenzial' },
          { label: '3 – 10 Gespräche', score: 15, desc: 'Fokus auf wenige Großmandate' },
          { label: 'Unter 3 Gespräche', score: 5, desc: 'Gerade mit aktivem Outbound gestartet' },
        ],
      },
      {
        id: 'pain',
        title: 'Was ist die größte Frustration im aktuellen Prozess?',
        subtitle: 'Wir stimmen das Treffen exakt auf dieses Hindernis ab.',
        options: [
          { label: 'Unqualifizierte Interessenten ohne Budget blockieren Zeit', score: 25, desc: 'Fehlende Vorqualifizierung vor Kalenderfreigabe' },
          { label: 'Mehrfachkosten für ScoreApp, Typeform UND Calendly', score: 20, desc: 'Zu viele getrennte Abonnements schmälern die Marge' },
          { label: 'Hohe Abbruchquote zwischen Quiz und Buchung', score: 15, desc: 'Leads buchen nicht, wenn Link erst per E-Mail kommt' },
          { label: 'Manuelles Übertragen von Fragebogendaten ins CRM', score: 10, desc: 'Mangel an nahtloser Datenübernahme' },
        ],
      },
    ],
  },
  sv: {
    badgeAntiSaas: "Anti-SaaS Protokoll",
    auditTag: "Katalog Nr. 2026-Q · B2B Audit",
    stepOf: (curr, total) => `Fråga ${curr} av ${total}`,
    btnSelect: "[VÄLJ]",
    btnBack: "← Gå ett steg tillbaka",
    formTitle: "Vem ska analysen ställas till?",
    formSubtitle: "Vår modell utvärderar förutsättningarna mot branschstandard på under 1 sekund.",
    fieldName: "Fullständigt Namn",
    fieldEmail: "Arbets-e-post",
    fieldCompany: "Företagsnamn",
    btnSubmit: "Genomför Värdering & Öppna Kalender",
    analyzingText: "GuudEngine™ analyserar dina svar...",
    docTitle: "DOKUMENT / KVALIFICERING",
    approvedBadge: "GODKÄND",
    calendarTitle: "Välj önskad mötestid",
    btnBook: (d, t) => `Boka Möte (${d} kl. ${t})`,
    bookedTitle: "Mötet är Bekräftat",
    bookedSubtitle: (email) => `En formell kalenderinbjudan med länk har skickats till ${email}.`,
    btnReset: "Gör en ny utvärdering",
    savingsTitle: "Vad kostar era nuvarande SaaS-prenumerationer?",
    savingsSubtitle: "Jämför ScoreApp + Calendly med GuudCals modeller.",
    usersLabel: "Antal konsulter i teamet:",
    leadsLabel: "Månatliga leads / bokningar:",
    scoreAppCost: "ScoreApp Licens:",
    calendlyCost: "Calendly Licenser:",
    totalOldCost: "Nuvarande årlig SaaS-kostnad:",
    qualicalCost: "GuudCal Årsabonnemang:",
    netSavings: "Er årliga besparing:",
    scannerTitle: "Auto-Branding: Anpassa till er hemsida",
    scannerSubtitle: "Ange er domän – vi skannar sidan och anpassar färger och stil automatiskt.",
    scannerPlaceholder: "ertforetag.se",
    btnScan: "Skanna & Tillämpa",
    scanSuccess: (domain) => `Färgtema extraherat från ${domain}!`,
    pricingTitle: "Tydliga Priser (Inkl. SMS & BYOK)",
    pricingSubtitle: "Inga dolda avgifter. Välj månadsabonnemang eller livstidslicens.",
    planSoloTitle: "Cloud Solo",
    planSoloPrice: "299 SEK",
    planSoloSub: "per månad (eller 2.390 SEK/år)",
    planSoloFeatures: [
      "1 aktiv domän",
      "50 SMS-påminnelser / mån inkluderat",
      "250 GuudEngine AI-poängsättningar / mån",
      "Obegränsade mötesbokningar",
      "Auto-Brand webbplatsskanner",
      "Google & Outlook 2-vägssynk"
    ],
    planAgencyTitle: "Agency Pro (Mest Populär)",
    planAgencyPrice: "599 SEK",
    planAgencySub: "per månad (eller 4.790 SEK/år)",
    planAgencyFeatures: [
      "Upp till 10 klientdomäner",
      "250 SMS-påminnelser / mån inkluderat",
      "100% White-Label",
      "1.000 GuudEngine AI-poängsättningar / mån",
      "Obegränsade användare i teamet",
      "Direkt CRM-synk"
    ],
    planLifetimeTitle: "👑 Lifetime Agency (BYOK)",
    planLifetimePrice: "11.999 SEK",
    planLifetimeSub: "Engångsavgift för livet",
    planLifetimeFeatures: [
      "Bring Your Own Key (Egen AI-nyckel)",
      "0 SEK i löpande AI-kostnader till oss",
      "Upp till 10 klientdomäner & White-Label",
      "Fullständig datasuveränitet & GDPR",
      "Använd egen OpenAI, Claude eller valfri LLM API-nyckel",
      "Full källkod & prioriterad support"
    ],
    btnBuyNow: "Välj Plan →",
    guaranteeText: "🔒 14 dagars full nöjd-kund-garanti eller pengarna tillbaka.",
    questions: [
      {
        id: 'goal',
        title: 'Vad är ert primära strategiska fokus de kommande 90 dagarna?',
        subtitle: 'Välj det alternativ som väger tyngst i era ledningsbeslut.',
        options: [
          { label: 'Kapa uppblåsta månatliga SaaS-prenumerationer', score: 30, desc: 'Ersätt 5-10 dyra verktyg med clean-room-lösningar' },
          { label: 'Automatisera sälj- och lead-kvalificering', score: 25, desc: 'Filtrera bort oseriösa bokningar automatiskt' },
          { label: 'Skala B2B mötesvolym för säljteamet', score: 20, desc: 'Boka 20+ högkvalitativa möten varje månad' },
          { label: 'Testa AI-drivna mikrosajter och quizzer', score: 15, desc: 'Experimentera med moderna konverteringsformat' },
        ],
      },
      {
        id: 'budget',
        title: 'Vad är er nuvarande månatliga mjukvarubudget?',
        subtitle: 'Hjälper oss att rekommendera rätt implementeringsmodell.',
        options: [
          { label: 'Över 75 000 kr / månad', score: 30, desc: 'Etablerat företag / större organisation' },
          { label: '20 000 – 75 000 kr / månad', score: 25, desc: 'Tillväxtbolag med aktiv tech-stack' },
          { label: '5 000 – 20 000 kr / månad', score: 15, desc: 'Mindre byrå eller konsultverksamhet' },
          { label: 'Under 5 000 kr / månad', score: 5, desc: 'Startup eller solo-konsult' },
        ],
      },
      {
        id: 'meetings',
        title: 'Hur många säljmöten genomför ni per månad?',
        subtitle: 'Att skydda er kalendertid är avgörande för lönsamheten.',
        options: [
          { label: '25+ strategiska möten', score: 25, desc: 'Hög volym – stor tidsbesparing genom screening' },
          { label: '10 – 25 möten', score: 20, desc: 'Stabil volym med utrymme för kvalitetslyft' },
          { label: '3 – 10 möten', score: 15, desc: 'Selektivt fokus på få, stora affärer' },
          { label: 'Färre än 3 möten', score: 5, desc: 'Nyligen startat med aktiv outbound' },
        ],
      },
      {
        id: 'pain',
        title: 'Vad är den största frustrationen i ert nuvarande flöde?',
        subtitle: 'Vi anpassar mötesagendan 100% efter detta hinder.',
        options: [
          { label: 'Oseriösa bokare utan budget tar upp dyrbar tid', score: 25, desc: 'Avsaknad av screening innan kalendern öppnas' },
          { label: 'Dubbla avgifter för ScoreApp, Typeform OCH Calendly', score: 20, desc: 'För många fragmenterade prenumerationer' },
          { label: 'Stort bortfall mellan quiz och faktisk bokning', score: 15, desc: 'Leads tappar intresse när länken skickas på mejl' },
          { label: 'Manuellt kopierande av svar in i CRM', score: 10, desc: 'Avsaknad av automatiskt dataflöde' },
        ],
      },
    ],
  },
  es: {
    badgeAntiSaas: "Protocolo Anti-SaaS",
    auditTag: "Catálogo N.º 2026-Q · Auditoría B2B",
    stepOf: (curr, total) => `Pregunta ${curr} de ${total}`,
    btnSelect: "[SELECCIONAR]",
    btnBack: "← Volver al paso anterior",
    formTitle: "¿A quién debemos enviar la evaluación?",
    formSubtitle: "Nuestro motor evalúa las respuestas contra los estándares de la industria en menos de 1 segundo.",
    fieldName: "Nombre Completo",
    fieldEmail: "Correo Corporativo",
    fieldCompany: "Empresa",
    btnSubmit: "Evaluar Perfil y Abrir Calendario",
    analyzingText: "GuudEngine™ está analizando sus respuestas...",
    docTitle: "DOCUMENTO / CUALIFICACIÓN",
    approvedBadge: "APROBADO",
    calendarTitle: "Seleccione su horario de reunión preferido",
    btnBook: (d, t) => `Reservar Reunión (${d} a las ${t})`,
    bookedTitle: "Reunión Confirmada",
    bookedSubtitle: (email) => `Se ha enviado una invitación oficial con enlace a ${email}.`,
    btnReset: "Realizar otra auditoría",
    savingsTitle: "¿Cuánto gasta actualmente en suscripciones SaaS?",
    savingsSubtitle: "Compare ScoreApp + Calendly con GuudCal.",
    usersLabel: "Consultores en el equipo:",
    leadsLabel: "Leads / reservas mensuales:",
    scoreAppCost: "Licencia ScoreApp:",
    calendlyCost: "Licencias Calendly:",
    totalOldCost: "Gasto anual recurrente actual:",
    qualicalCost: "GuudCal Cloud Anual:",
    netSavings: "Su ahorro anual neto:",
    scannerTitle: "Auto-Branding: Adapte los colores de su web",
    scannerSubtitle: "Escriba su dominio: escaneamos su sitio y adaptamos los colores y el estilo automáticamente.",
    scannerPlaceholder: "suempresa.es",
    btnScan: "Escanear y Aplicar",
    scanSuccess: (domain) => `¡Paleta de marca extraída de ${domain}!`,
    pricingTitle: "Precios Transparentes (Incluye SMS y BYOK)",
    pricingSubtitle: "Elija entre la nube mensual o una licencia permanente BYOK.",
    planSoloTitle: "Cloud Solo",
    planSoloPrice: "29 €",
    planSoloSub: "al mes (o 249 €/año)",
    planSoloFeatures: [
      "1 sitio web / dominio activo",
      "50 recordatorios por SMS / mes incluidos (0% no-shows)",
      "250 evaluaciones con IA GuudEngine / mes",
      "Reservas de calendario ilimitadas",
      "Escáner Auto-Brand de colores",
      "Sincronización con Google y Outlook"
    ],
    planAgencyTitle: "Agency Pro (Más Popular)",
    planAgencyPrice: "59 €",
    planAgencySub: "al mes (o 499 €/año)",
    planAgencyFeatures: [
      "Hasta 10 dominios de clientes",
      "250 recordatorios por SMS / mes incluidos",
      "100% Marca Blanca (Sin logo de GuudCal)",
      "1.000 evaluaciones con IA GuudEngine / mes",
      "Usuarios de equipo ilimitados",
      "Sincronización directa con CRM"
    ],
    planLifetimeTitle: "👑 Lifetime Agency (BYOK)",
    planLifetimePrice: "1.099 €",
    planLifetimeSub: "Pago único de por vida",
    planLifetimeFeatures: [
      "Bring Your Own Key (Traiga su propia API key)",
      "0 € de costes recurrentes de IA hacia nosotros",
      "Hasta 10 dominios de clientes y Marca Blanca",
      "Soberanía total de datos y privacidad RGPD",
      "Use su propia clave API de OpenAI, Claude o LLM",
      "Código fuente completo y soporte prioritario"
    ],
    btnBuyNow: "Seleccionar Plan →",
    guaranteeText: "🔒 Garantía de reembolso del 100% durante 14 días.",
    questions: [
      {
        id: 'goal',
        title: '¿Cuál es su enfoque estratégico principal para los próximos 90 días?',
        subtitle: 'Seleccione la opción de mayor peso en sus decisiones directivas.',
        options: [
          { label: 'Eliminar costosas suscripciones mensuales SaaS', score: 30, desc: 'Sustituir 5-10 herramientas caras por soluciones directas' },
          { label: 'Automatizar la cualificación de clientes B2B', score: 25, desc: 'Filtrar reuniones no cualificadas antes de que entren a la agenda' },
          { label: 'Escalar el volumen de reuniones del equipo de ventas', score: 20, desc: 'Cerrar 20+ reuniones estratégicas al mes' },
          { label: 'Implementar cuestionarios interactivos con IA', score: 15, desc: 'Probar nuevos formatos de conversión interactiva' },
        ],
      },
      {
        id: 'budget',
        title: '¿Cuál es su presupuesto mensual actual en software y tecnología?',
        subtitle: 'Nos ayuda a recomendar el modelo de implementación más rentable.',
        options: [
          { label: 'Más de 7.000 € / mes', score: 30, desc: 'Empresa consolidada / corporación' },
          { label: '2.000 – 7.000 € / mes', score: 25, desc: 'Agencia en crecimiento con stack tecnológico activo' },
          { label: '500 – 2.000 € / mes', score: 15, desc: 'Consultoría boutique o estudio pequeño' },
          { label: 'Menos de 500 € / mes', score: 5, desc: 'Startup o consultor independiente' },
        ],
      },
      {
        id: 'meetings',
        title: '¿Cuántas reuniones de venta o consultoría realiza al mes?',
        subtitle: 'Proteger el tiempo de su calendario es clave para la rentabilidad.',
        options: [
          { label: 'Más de 25 reuniones', score: 25, desc: 'Alto volumen: gran ahorro mediante filtrado previo' },
          { label: '10 – 25 reuniones', score: 20, desc: 'Volumen moderado con margen para optimizar calidad' },
          { label: '3 – 10 reuniones', score: 15, desc: 'Enfoque selectivo en grandes cuentas' },
          { label: 'Menos de 3 reuniones', score: 5, desc: 'Iniciando captación proactiva' },
        ],
      },
      {
        id: 'pain',
        title: '¿Cuál es la mayor fricción en su proceso actual de captación?',
        subtitle: 'Adaptaremos la agenda de la reunión 100% a este desafío.',
        options: [
          { label: 'Personas sin presupuesto que bloquean tiempo en la agenda', score: 25, desc: 'Falta de cualificación previa antes del acceso al calendario' },
          { label: 'Pagar cuotas duplicadas por ScoreApp, Typeform Y Calendly', score: 20, desc: 'Demasiadas suscripciones fragmentadas que reducen el margen' },
          { label: 'Alto abandono entre el cuestionario y la reserva', score: 15, desc: 'Los leads pierden interés cuando el enlace llega por email' },
          { label: 'Copiar y pegar manualmente los datos en el CRM', score: 10, desc: 'Falta de transferencia automática de datos' },
        ],
      },
    ],
  },
  fr: {
    badgeAntiSaas: "Protocole Anti-SaaS",
    auditTag: "Catalogue N° 2026-Q · Audit B2B",
    stepOf: (curr, total) => `Question ${curr} sur ${total}`,
    btnSelect: "[SÉLECTIONNER]",
    btnBack: "← Étape précédente",
    formTitle: "À qui devons-nous adresser cette évaluation ?",
    formSubtitle: "Notre modèle évalue vos réponses selon les standards du marché en moins d'une seconde.",
    fieldName: "Nom Complet",
    fieldEmail: "E-mail Professionnel",
    fieldCompany: "Entreprise",
    btnSubmit: "Évaluer le Profil & Ouvrir le Calendrier",
    analyzingText: "GuudEngine™ analyse vos réponses...",
    docTitle: "DOCUMENT / QUALIFICATION",
    approvedBadge: "APPROUVÉ",
    calendarTitle: "Sélectionnez votre créneau de réunion",
    btnBook: (d, t) => `Réserver le Créneau (${d} à ${t})`,
    bookedTitle: "Rendez-vous Confirmé",
    bookedSubtitle: (email) => `Une invitation officielle avec lien de visioconférence a été envoyée à ${email}.`,
    btnReset: "Effectuer un nouvel audit",
    savingsTitle: "Combien dépensez-vous actuellement en abonnements SaaS ?",
    savingsSubtitle: "Comparez ScoreApp + Calendly avec le modèle GuudCal.",
    usersLabel: "Nombre de consultants dans l'équipe :",
    leadsLabel: "Prospects / réservations mensuelles :",
    scoreAppCost: "Licence ScoreApp :",
    calendlyCost: "Licences Calendly :",
    totalOldCost: "Dépense annuelle SaaS actuelle :",
    qualicalCost: "Abonnement Annuel GuudCal :",
    netSavings: "Votre économie annuelle nette :",
    scannerTitle: "Auto-Branding : Adaptez le design à votre site",
    scannerSubtitle: "Entrez votre domaine : nous analysons votre site et adaptons couleurs et typographies automatiquement.",
    scannerPlaceholder: "votreentreprise.fr",
    btnScan: "Analyser & Appliquer",
    scanSuccess: (domain) => `Palette de marque extraite de ${domain} !`,
    pricingTitle: "Tarifs Transparents (SMS & BYOK inclus)",
    pricingSubtitle: "Choisissez entre un abonnement mensuel avec SMS ou une licence à vie BYOK.",
    planSoloTitle: "Cloud Solo",
    planSoloPrice: "29 €",
    planSoloSub: "par mois (ou 249 €/an)",
    planSoloFeatures: [
      "1 site web / domaine actif",
      "50 rappels SMS / mois inclus (0% no-shows)",
      "250 évaluations IA GuudEngine / mois",
      "Rendez-vous illimités",
      "Scanner Auto-Brand de couleurs",
      "Synchronisation Google & Outlook"
    ],
    planAgencyTitle: "Agency Pro (Le Plus Populaire)",
    planAgencyPrice: "59 €",
    planAgencySub: "par mois (ou 499 €/an)",
    planAgencyFeatures: [
      "Jusqu'à 10 domaines clients",
      "250 rappels SMS / mois inclus",
      "100% Marque Blanche (Sans logo GuudCal)",
      "1.000 évaluations IA GuudEngine / mois",
      "Membres d'équipe illimités",
      "Synchronisation CRM & Webhooks"
    ],
    planLifetimeTitle: "👑 Lifetime Agency (BYOK)",
    planLifetimePrice: "1.099 €",
    planLifetimeSub: "Paiement unique à vie",
    planLifetimeFeatures: [
      "Bring Your Own Key (Votre propre clé API)",
      "0 € de frais récurrents d'IA vers nous",
      "Jusqu'à 10 domaines clients & Marque Blanche",
      "Souveraineté des données & conformité RGPD",
      "Utilisez votre propre clé API (OpenAI, Claude ou LLM)",
      "Code source complet & support prioritaire"
    ],
    btnBuyNow: "Choisir ce Plan →",
    guaranteeText: "🔒 Garantie 100% satisfait ou remboursé pendant 14 jours.",
    questions: [
      {
        id: 'goal',
        title: 'Quel est votre objectif stratégique prioritaire pour les 90 prochains jours ?',
        subtitle: 'Sélectionnez l\'option qui influence le plus vos décisions de direction.',
        options: [
          { label: 'Éliminer les abonnements mensuels SaaS superflus', score: 30, desc: 'Remplacer 5 à 10 outils coûteux par des solutions dédiées' },
          { label: 'Automatiser la qualification des prospects B2B', score: 25, desc: 'Filtrer les rendez-vous non qualifiés avant accès à l\'agenda' },
          { label: 'Développer le volume de rendez-vous de l\'équipe commerciale', score: 20, desc: 'Générer plus de 20 rendez-vous stratégiques par mois' },
          { label: 'Déployer des questionnaires interactifs propulsés par l\'IA', score: 15, desc: 'Tester de nouveaux formats de conversion interactifs' },
        ],
      },
      {
        id: 'budget',
        title: 'Quel est votre budget mensuel actuel en logiciels et technologies ?',
        subtitle: 'Nous permet de vous recommander le modèle d\'intégration le plus rentable.',
        options: [
          { label: 'Plus de 7 000 € / mois', score: 30, desc: 'Entreprise établie / grand groupe' },
          { label: '2 000 – 7 000 € / mois', score: 25, desc: 'Agence en croissance avec infrastructure active' },
          { label: '500 – 2 000 € / mois', score: 15, desc: 'Cabinet de conseil ou petite agence' },
          { label: 'Moins de 500 € / mois', score: 5, desc: 'Startup ou consultant indépendant' },
        ],
      },
      {
        id: 'meetings',
        title: 'Combien de rendez-vous de conseil ou vente réalisez-vous par mois ?',
        subtitle: 'Protéger votre temps d\'agenda est essentiel pour votre rentabilité.',
        options: [
          { label: 'Plus de 25 rendez-vous', score: 25, desc: 'Volume élevé : gain de temps majeur grâce au filtrage' },
          { label: '10 – 25 rendez-vous', score: 20, desc: 'Volume régulier avec potentiel d\'optimisation' },
          { label: '3 – 10 rendez-vous', score: 15, desc: 'Concentration sélective sur les grands comptes' },
          { label: 'Moins de 3 rendez-vous', score: 5, desc: 'Démarrage récent de la prospection active' },
        ],
      },
      {
        id: 'pain',
        title: 'Quelle est la principale source de friction dans votre processus actuel ?',
        subtitle: 'Nous adapterons l\'ordre du jour de la réunion à cette problématique.',
        options: [
          { label: 'Des prospects sans budget qui bloquent des créneaux', score: 25, desc: 'Absence de pré-qualification avant ouverture de l\'agenda' },
          { label: 'Cumul des abonnements pour ScoreApp, Typeform ET Calendly', score: 20, desc: 'Trop d\'abonnements fragmentés qui réduisent la marge' },
          { label: 'Taux d\'abandon élevé entre le questionnaire et la réservation', score: 15, desc: 'Les prospects perdent le fil quand le lien arrive par e-mail' },
          { label: 'Saisie manuelle des réponses dans votre CRM', score: 10, desc: 'Manque d\'automatisation directe des données' },
        ],
      },
    ],
  },
};


export interface HeroContent {
  badge: string;
  h1: string;
  sub: string;
  btnDemo: string;
  btnCrm: string;
  btnRoi: string;
  features: {
    title: string;
    killer: string;
    desc: string;
    icon: string;
  }[];
  stats: {
    label: string;
    value: string;
  }[];
}

export const HERO_TRANSLATIONS: Record<Language, HeroContent> = {
  da: {
    badge: "🔥 DET KOMPLETTE ANTI-SAAS SALGSSYSTEM",
    h1: "Luk flere B2B kunder på autopilot. Slut med dyre SaaS-abonnementer.",
    sub: "GuudCal samler interaktiv AI-leadkvalificering, friktionsfri kalenderbooking og automatisk opkaldsnotat i ét samlet B2B CRM. Test den live demo nedenfor og spar 15.000–50.000 kr. hvert eneste år.",
    btnDemo: "👇 Test Interaktiv Lead-Scorecard",
    btnCrm: "👑 Se B2B CRM & Opkaldsdemo",
    btnRoi: "💰 Beregn Din Årlige Besparelse",
    features: [
      {
        icon: "🎯",
        title: "0 Spildte Møder",
        killer: "Erstatter ScoreApp ($129/mdr)",
        desc: "Vores AI vurderer automatisk kundens budget, behov og beslutningsret, så dine sælgere kun taler med varme leads.",
      },
      {
        icon: "📅",
        title: "1-Kliks Booking",
        killer: "Erstatter Calendly ($64/mdr)",
        desc: "Kunden vælger tidspunkt i kalenderen direkte efter quizzen – uden omdirigering til eksterne sider.",
      },
      {
        icon: "📞",
        title: "Zero-Click Opkaldsnotater",
        killer: "Erstatter HubSpot Sales",
        desc: "Forbindes til CloudTalk og Aircall. AI lytter til optagelsen og skriver noter og opfølgningsmails på under 2 sekunder.",
      },
      {
        icon: "💰",
        title: "70-90% Årlig Besparelse",
        killer: "Ingen per-seat afgifter",
        desc: "Kør ubegrænsede sælgere og op til 10 klient-domæner for kun 399 kr./mdr. eller med én éngangslicens.",
      },
    ],
    stats: [
      { label: "AI Responstid", value: "1.2 sek." },
      { label: "Fremmøderate", value: "98% (SMS)" },
      { label: "Årlig Besparelse", value: "15-50k kr." },
      { label: "Domænekontrol", value: "100% White-Label" },
    ],
  },
  en: {
    badge: "🔥 THE ALL-IN-ONE ANTI-SAAS SALES ENGINE",
    h1: "Close More B2B Clients on Autopilot. Stop Overpaying for SaaS.",
    sub: "GuudCal unites interactive AI qualification, seamless calendar booking, and automatic call notes into one unified B2B CRM. Try the interactive demo below and save $2,000–$7,000 every single year.",
    btnDemo: "👇 Try Interactive Scorecard Demo",
    btnCrm: "👑 Open B2B CRM & Call Intelligence",
    btnRoi: "💰 Calculate Your Annual Savings",
    features: [
      {
        icon: "🎯",
        title: "Zero Wasted Calls",
        killer: "Replaces ScoreApp ($129/mo)",
        desc: "AI automatically evaluates budget, timing, and authority so reps only spend time with qualified buyers.",
      },
      {
        icon: "📅",
        title: "Instant Booking",
        killer: "Replaces Calendly ($64/mo)",
        desc: "Prospects choose slots directly in the workflow without leaving your site or getting lost in redirects.",
      },
      {
        icon: "📞",
        title: "Zero-Click Call Notes",
        killer: "Replaces HubSpot Sales Hub",
        desc: "Integrates with CloudTalk & Aircall. AI transcribes and summarizes calls into actionable follow-up emails in <2s.",
      },
      {
        icon: "💰",
        title: "70-90% Cost Reduction",
        killer: "Zero per-seat extortion",
        desc: "Support unlimited sales reps and up to 10 client domains for just 399 kr./mo ($58/mo) or a one-time lifetime license.",
      },
    ],
    stats: [
      { label: "AI Latency", value: "1.2s" },
      { label: "Show-up Rate", value: "98% (SMS)" },
      { label: "Annual Savings", value: "$2,000-$7,000" },
      { label: "White-Label", value: "100% Own Domain" },
    ],
  },
  de: {
    badge: "🔥 DAS ULTIMATIVE ANTI-SAAS VERTRIEBSSYSTEM",
    h1: "Mehr B2B-Kunden auf Autopilot abschließen. Schluss mit teuren SaaS-Abos.",
    sub: "GuudCal vereint KI-Leadqualifizierung, nahtlose Terminbuchung und automatische Anrufnotizen in einem B2B-CRM. Testen Sie die Live-Demo unten und sparen Sie 2.000–7.000 € pro Jahr.",
    btnDemo: "👇 Interaktive Scorecard Testen",
    btnCrm: "👑 B2B CRM & Anruf-Demo",
    btnRoi: "💰 Jährliche Ersparnis Berechnen",
    features: [
      {
        icon: "🎯",
        title: "Keine Verschwendeten Calls",
        killer: "Ersetzt ScoreApp (129 $/Monat)",
        desc: "Unsere KI prüft Budget und Entscheidungsbefugnis sofort, sodass Ihr Vertrieb nur mit echten Interessenten spricht.",
      },
      {
        icon: "📅",
        title: "Direkte Terminbuchung",
        killer: "Ersetzt Calendly (64 $/Monat)",
        desc: "Kunden buchen direkt im Anschluss an die Fragen – ohne Weiterleitung auf externe Kalenderseiten.",
      },
      {
        icon: "📞",
        title: "Zero-Click Anrufnotizen",
        killer: "Ersetzt HubSpot Sales",
        desc: "CloudTalk & Aircall Anbindung. KI fasst Gespräche zusammen und schreibt Folge-E-Mails in unter 2 Sekunden.",
      },
      {
        icon: "💰",
        title: "70-90% Ersparnis",
        killer: "Keine Kosten pro Mitarbeiter",
        desc: "Unbegrenzte Vertriebler und bis zu 10 Mandanten-Domains für nur 54 €/Monat oder einmalige Lifetime-Lizenz.",
      },
    ],
    stats: [
      { label: "KI-Latenz", value: "1.2 Sek." },
      { label: "Erscheinquote", value: "98% (SMS)" },
      { label: "Ersparnis/Jahr", value: "2.000-7.000 €" },
      { label: "Branding", value: "100% Eigene Domain" },
    ],
  },
  sv: {
    badge: "🔥 DET KOMPLETTA ANTI-SAAS SÄLJSYSTEMET",
    h1: "Stäng fler B2B-kunder på autopilot. Sluta betala överpriser för SaaS.",
    sub: "GuudCal förenar AI-leadkvalificering, smidig kalenderbokning och automatiserade samtalsanteckningar i ett B2B CRM. Testa demon nedan och spara 20 000–70 000 SEK varje år.",
    btnDemo: "👇 Testa Interaktivt Scorecard",
    btnCrm: "👑 Se B2B CRM & Samtalsdemo",
    btnRoi: "💰 Beräkna Årlig Besparing",
    features: [
      {
        icon: "🎯",
        title: "Noll Spilld Mötestid",
        killer: "Ersätter ScoreApp (129 $/mån)",
        desc: "AI utvärderar automatiskt budget, tidslinje och beslutskraft innan mötet öppnas.",
      },
      {
        icon: "📅",
        title: "1-Klicks Bokning",
        killer: "Ersätter Calendly (64 $/mån)",
        desc: "Kunder väljer tid direkt i flödet utan omdirigeringar till externa tredjepartssidor.",
      },
      {
        icon: "📞",
        title: "Zero-Click Samtalsnotat",
        killer: "Ersätter HubSpot Sales",
        desc: "Kopplas till CloudTalk och Aircall. AI lyssnar och genererar uppföljningsmail på under 2 sekunder.",
      },
      {
        icon: "💰",
        title: "70-90% Besparing",
        killer: "Inga licensavgifter per säljare",
        desc: "Obegränsat med säljare och upp till 10 domäner för endast 399 DKK/mån eller engångslicens.",
      },
    ],
    stats: [
      { label: "AI Svarstid", value: "1.2 sek." },
      { label: "Närvarograd", value: "98% (SMS)" },
      { label: "Årlig Besparing", value: "20-70k SEK" },
      { label: "Varumärke", value: "100% Egen Domän" },
    ],
  },
  es: {
    badge: "🔥 EL MOTOR DE VENTAS ANTI-SAAS DEFINITIVO",
    h1: "Cierre más clientes B2B en piloto automático. Sin costes abusivos de SaaS.",
    sub: "GuudCal combina cualificación interactiva con IA, reserva ágil en calendario y resúmenes de llamadas automáticos en un CRM B2B. Pruebe la demo interactiva y ahorre 2.000€–7.000€ cada año.",
    btnDemo: "👇 Probar Demo de Cualificación",
    btnCrm: "👑 Abrir CRM B2B y Llamadas",
    btnRoi: "💰 Calcular Ahorro Anual",
    features: [
      {
        icon: "🎯",
        title: "Cero Llamadas Perdidas",
        killer: "Reemplaza ScoreApp ($129/mes)",
        desc: "Nuestra IA evalúa presupuesto y autoridad en 1 segundo para que solo hable con clientes cualificados.",
      },
      {
        icon: "📅",
        title: "Reserva en 1 Clic",
        killer: "Reemplaza Calendly ($64/mes)",
        desc: "El cliente elige horario directamente tras el cuestionario, sin redirecciones molestas.",
      },
      {
        icon: "📞",
        title: "Notas de Llamada Automáticas",
        killer: "Reemplaza HubSpot Sales",
        desc: "Integrado con CloudTalk y Aircall. La IA transcribe y redacta el correo de seguimiento en menos de 2s.",
      },
      {
        icon: "💰",
        title: "70-90% de Ahorro",
        killer: "Sin tarifas por usuario",
        desc: "Comerciales ilimitados y hasta 10 dominios por solo 54 €/mes o licencia perpetua BYOK.",
      },
    ],
    stats: [
      { label: "Latencia IA", value: "1.2s" },
      { label: "Tasa Asistencia", value: "98% (SMS)" },
      { label: "Ahorro Anual", value: "2.000-7.000 €" },
      { label: "Marca Propia", value: "100% Dominio Propio" },
    ],
  },
  fr: {
    badge: "🔥 LE MOTEUR COMMERCIAL ANTI-SAAS ULTIME",
    h1: "Signez plus de clients B2B sur pilote automatique. Sans abonnements SaaS excessifs.",
    sub: "GuudCal réunit la pré-qualification par IA, la réservation d'agenda directe et les comptes-rendus d'appels dans un CRM B2B unifié. Testez la démo ci-dessous et économisez 2 000 € à 7 000 € par an.",
    btnDemo: "👇 Tester le Questionnaire IA",
    btnCrm: "👑 Voir le CRM B2B & Appels",
    btnRoi: "💰 Calculer Vos Économies",
    features: [
      {
        icon: "🎯",
        title: "Zéro Rendez-vous Perdu",
        killer: "Remplace ScoreApp (129 $/mois)",
        desc: "L'IA analyse le budget et le pouvoir décisionnel afin que vos commerciaux n'échangent qu'avec des prospects qualifiés.",
      },
      {
        icon: "📅",
        title: "Réservation en 1 Clic",
        killer: "Remplace Calendly (64 $/mois)",
        desc: "Le prospect choisit son créneau immédiatement après le questionnaire sans redirection.",
      },
      {
        icon: "📞",
        title: "Comptes-rendus Zéro Clic",
        killer: "Remplace HubSpot Sales",
        desc: "Connecté à CloudTalk et Aircall. L'IA écoute et rédige l'email de suivi en moins de 2 secondes.",
      },
      {
        icon: "💰",
        title: "70-90% d'Économies",
        killer: "Aucun frais par utilisateur",
        desc: "Commerciaux illimités et jusqu'à 10 domaines pour seulement 54 €/mois ou licence à vie.",
      },
    ],
    stats: [
      { label: "Latence IA", value: "1.2s" },
      { label: "Taux Présence", value: "98% (SMS)" },
      { label: "Économies/An", value: "2 000-7 000 €" },
      { label: "White-Label", value: "100% Propre Domaine" },
    ],
  },
};


export interface FaqItem {
  q: string;
  a: string;
}

export interface GuudShowcase {
  badge: string;
  title: string;
  subtitle: string;
  steps: {
    step: string;
    title: string;
    desc: string;
    tag: string;
  }[];
}

export const GUUD_SHOWCASE_DATA: Record<Language, GuudShowcase> = {
  da: {
    badge: "GUUD AUTONOMOUS AGENT MATRIX",
    title: "Mød Guud AI: Din Autonome Forberedelses-Agent Før Hvert Møde",
    subtitle: "Dine sælgere skal aldrig mere bruge 20 minutter på at google en kunde før et opkald. I samme sekund en lead booker via GuudCal, aktiveres Guud AI i skyen.",
    steps: [
      {
        step: "01",
        title: "Realtids CVR & Tech-Stack Scanning",
        desc: "Vores intelligente agent crawler virksomhedens website, identificerer deres nuværende software (HubSpot, WordPress, Shopify) og estimerer årlig omsætning og medarbejderantal.",
        tag: "AUTONOM INTELLIGENCE",
      },
      {
        step: "02",
        title: "BANT Scoring & Beslutningsprofil",
        desc: "Kombinerer quiz-svarene med firmaprofilen og udregner Budget, Authority, Need og Timeline for at markere, om kunden er et VIP High-Priority lead.",
        tag: "GUUDENGINE NEURAL",
      },
      {
        step: "03",
        title: "Executive Dossier i GuudCRM & Kalender",
        desc: "Sælgeren modtager et færdigt 1-sides resumé direkte i deres kalenderinvitation med 3 skarpe åbningsspørgsmål og anbefalet pitch.",
        tag: "ZERO PREP TIME",
      },
      {
        step: "04",
        title: "SMS-Påmindelse & 0% No-Shows",
        desc: "En høflig, personlig SMS sendes automatisk til kunden 24 timer og 1 time før mødet, så jeres fremmøderate stiger til over 98%.",
        tag: "SMS GATEWAY",
      },
    ],
  },
  en: {
    badge: "GUUD AUTONOMOUS AGENT MATRIX",
    title: "Meet Guud AI: Your Autonomous Pre-Call Intelligence Agent",
    subtitle: "Your sales team never has to waste 20 minutes researching prospects before a call again. The moment a lead books on GuudCal, Guud AI kicks into gear.",
    steps: [
      {
        step: "01",
        title: "Real-time Tech & Domain Recon",
        desc: "Guud AI inspects the client's live website, uncovers their current software stack, and identifies key decision makers and company velocity.",
        tag: "AUTONOMOUS AGENTS",
      },
      {
        step: "02",
        title: "BANT Qualification Matrix",
        desc: "Synthesizes quiz answers with company signals to compute Budget, Authority, Need, and Timeline with verified viability scores.",
        tag: "GUUDENGINE NEURAL",
      },
      {
        step: "03",
        title: "Executive Dossier in CRM & Calendar",
        desc: "The sales rep receives a concise battlecard inside their calendar invite with 3 custom discovery questions tailored to the prospect's tech stack.",
        tag: "ZERO PREPARATION TIME",
      },
      {
        step: "04",
        title: "Automated SMS & Zero No-Shows",
        desc: "Branded SMS alerts are sent 24 hours and 1 hour before the meeting, skyrocketing show-up rates to over 98%.",
        tag: "SMS TELEMETRY",
      },
    ],
  },
  de: {
    badge: "GUUD AUTONOMOUS AGENT MATRIX",
    title: "Lernen Sie Guud AI kennen: Autonome Vorbereitung für jeden Vertriebler",
    subtitle: "Keine zeitraubende Recherche mehr vor Terminen. Sobald ein Lead bucht, analysiert Guud AI den Interessenten in Sekunden.",
    steps: [
      {
        step: "01",
        title: "Echtzeit-Domain & Tech-Scan",
        desc: "Guud AI durchsucht die Website, erkennt verwendete Tools und prüft Unternehmensgröße.",
        tag: "AUTONOME INTELLIGENZ",
      },
      {
        step: "02",
        title: "BANT-Qualifizierung & Budgetprüfung",
        desc: "Kombiniert Antworten mit Firmendaten zur präzisen Einstufung des Kaufpotenzials.",
        tag: "GUUDENGINE NEURAL",
      },
      {
        step: "03",
        title: "Executive Dossier im Kalender",
        desc: "Vertriebler erhalten eine 1-seitige Vorbereitung direkt im Kalendereintrag.",
        tag: "0 MINUTEN VORBEREITUNG",
      },
      {
        step: "04",
        title: "SMS-Erinnerungen gegen Terminausfälle",
        desc: "Automatische Erinnerungen per SMS 24 Std. und 1 Std. vor dem Termin für 98% Erscheinquote.",
        tag: "SMS GATEWAY",
      },
    ],
  },
  sv: {
    badge: "GUUD AUTONOMOUS AGENT MATRIX",
    title: "Möt Guud AI: Din Autonoma Förberedelse-Agent Inför Varje Möte",
    subtitle: "Dina säljare behöver aldrig mer lägga 20 minuter på att googla en kund innan ett samtal. I samma sekund en lead bokar via GuudCal sätts Guud AI i arbete.",
    steps: [
      {
        step: "01",
        title: "Realtids- och Teknikanalys",
        desc: "Vår agent scannar företagets hemsida, kartlägger deras tech-stack och estimerar omsättning.",
        tag: "AUTONOM INTELLIGENS",
      },
      {
        step: "02",
        title: "BANT-Scoring & Köpstyrka",
        desc: "Kombinerar quiz-svaren med företagsdata för att avgöra budget och beslutanderätt.",
        tag: "GUUDENGINE NEURAL",
      },
      {
        step: "03",
        title: "Executive Dossier i GuudCRM",
        desc: "Säljaren får en färdig 1-sidig sammanfattning med 3 vassa öppningsfrågor direkt i kalendern.",
        tag: "NOLL FÖRBEREDELSETID",
      },
      {
        step: "04",
        title: "SMS-Påminnelse för 0% No-Shows",
        desc: "Automatiska SMS skickas 24 timmar och 1 timme före mötet så närvaron når 98%.",
        tag: "SMS GATEWAY",
      },
    ],
  },
  es: {
    badge: "GUUD AUTONOMOUS AGENT MATRIX",
    title: "Conozca Guud AI: Su Agente Autónomo de Inteligencia Previa a la Reunión",
    subtitle: "Su equipo no volverá a perder 20 minutos investigando clientes antes de una llamada. En el instante en que un lead reserva, Guud AI genera el dossier.",
    steps: [
      {
        step: "01",
        title: "Escaneo de Dominio y Tech-Stack",
        desc: "Guud AI rastrea la web del cliente y detecta su software actual y volumen empresarial.",
        tag: "INTELIGENCIA AUTÓNOMA",
      },
      {
        step: "02",
        title: "Cualificación BANT Inmediata",
        desc: "Evalúa presupuesto, autoridad, necesidad y plazo para detectar clientes prioritarios.",
        tag: "GUUDENGINE NEURAL",
      },
      {
        step: "03",
        title: "Dossier Ejecutivo en su Calendario",
        desc: "El comercial recibe un resumen de una página con 3 preguntas estratégicas de apertura.",
        tag: "CERO TIEMPO DE PREPARACIÓN",
      },
      {
        step: "04",
        title: "Recordatorios SMS sin No-Shows",
        desc: "Envío automático de SMS 24h y 1h antes del encuentro para alcanzar el 98% de asistencia.",
        tag: "SMS GATEWAY",
      },
    ],
  },
  fr: {
    badge: "GUUD AUTONOMOUS AGENT MATRIX",
    title: "Découvrez Guud AI : Votre Agent Autonome de Préparation Avant Réunion",
    subtitle: "Vos commerciaux ne perdront plus jamais 20 minutes à chercher des infos avant un appel. Dès qu'un prospect réserve, Guud AI prépare son dossier.",
    steps: [
      {
        step: "01",
        title: "Audit Technique et Entreprise en Direct",
        desc: "Guud AI analyse le site web du prospect et cartographie ses outils logiciels.",
        tag: "INTELLIGENCE AUTONOME",
      },
      {
        step: "02",
        title: "Qualification BANT Immédiate",
        desc: "Synthétise les réponses au questionnaire pour évaluer le budget et le pouvoir décisionnel.",
        tag: "GUUDENGINE NEURAL",
      },
      {
        step: "03",
        title: "Dossier Exécutif dans le Calendrier",
        desc: "Le commercial reçoit une fiche mémo avec 3 questions d'ouverture directement dans l'invitation.",
        tag: "ZÉRO TEMPS DE PRÉPARATION",
      },
      {
        step: "04",
        title: "Rappels SMS et Zéro Rendez-vous Oubliés",
        desc: "Envoi de SMS 24h et 1h avant la réunion pour un taux de présence supérieur à 98%.",
        tag: "GATEWAY SMS",
      },
    ],
  },
};

export const FAQ_DATA: Record<Language, FaqItem[]> = {
  da: [
    {
      q: "Hvordan kan GuudCal erstatte både ScoreApp og Calendly på én gang?",
      a: "ScoreApp opkræver $129/mdr. for blot at stille quiz-spørgsmål, og Calendly koster yderligere $16-$64/mdr. pr. konsulent for at vælge et tidspunkt. GuudCal forener begge dele i én samlet oplevelse: Kunden tager en interaktiv 4-trins kvalificering, vores AI evaluerer deres budget og behov på 1.2 sekunder, og kalenderen åbner direkte i samme vindue uden irriterende videresendelser. Du sparer både penge og forhindrer kunde-frafald.",
    },
    {
      q: "Hvad gør den indbyggede AI-agent i baggrunden?",
      a: "Når en lead booker et møde via GuudCal, crawler vores baggrunds-agent automatisk automatisk kundens domæne, aflæser deres tech-stack (f.eks. om de bruger HubSpot, WordPress eller Shopify), beregner deres BANT-score og indsætter en 'Executive Battlecard' direkte i sælgerens kalenderinvitation. Sælgeren møder 100% forberedt op uden at have brugt et eneste minut på manuel research.",
    },
    {
      q: "Kan jeg bruge GuudCal som 100% White-Label på mit eget domæne?",
      a: "Ja! Med vores Agency Pro og Lifetime BYOK licenser fjerner du alt GuudCal-branding. Du kan køre det på dit eget subdomæne (f.eks. booking.ditbureau.dk) eller integrere det direkte på din WordPress, Webflow eller Shopify side med vores ultrahurtige embed-script.",
    },
    {
      q: "Hvordan fungerer opkaldsnotater med CloudTalk eller Aircall?",
      a: "Når dit salgsteam ringer op igennem CloudTalk eller Aircall, sendes en webhook med optagelsen direkte til GuudCRM. Vores AI lytter til samtalen, trækker budget og beslutningstagere ud, noterer næste handlingspunkter og skriver en færdig opfølgningsmail på under 2 sekunder. Dine sælgere slipper for at bruge halvdelen af dagen på at skrive noter i HubSpot.",
    },
    {
      q: "Hvorfor koster Lifetime BYOK kun 7.999 kr. som et éngangsbeløb?",
      a: "I stedet for at vi skal agere mellemmand og lægge 500% avance på dine AI-kald, lader vi dig indtaste din egen egen LLM API-nøgle (BYOK). Det betyder, at du betaler den rå engrospris ($0.035 pr. million tokens = ca. 0,0018 kr. pr. lead), mens vi modtager et rent engangsbeløb. Det giver dig 100% datasuverænitet og fjerner alle faste månedlige software-gebyrer for altid.",
    },
  ],
  en: [
    {
      q: "How does GuudCal replace both ScoreApp and Calendly?",
      a: "ScoreApp charges $129/mo just to run a quiz, and Calendly charges $16-$64/mo per rep to pick a time. GuudCal merges both into one frictionless flow: the prospect takes a fast 4-question qualification, AI scores their budget and fit in 1.2s, and the booking calendar opens immediately in the same view. You eliminate drop-offs and slash your monthly software overhead.",
    },
    {
      q: "What does the autonomous AI agent do in the background?",
      a: "As soon as a lead books a slot on GuudCal, our autonomous agent the prospect's website, identifies their tech stack and company signals, and compiles a comprehensive 1-page executive battlecard directly inside your rep's calendar invite. Reps walk into meetings completely prepared with zero manual research.",
    },
    {
      q: "Can I use GuudCal 100% white-labeled on my own custom domain?",
      a: "Yes. With Agency Pro and Lifetime BYOK, all GuudCal branding is removed. You can run it on your own subdomain (e.g., booking.youragency.com) or embed it on WordPress, Webflow, or Shopify with a single line of code.",
    },
    {
      q: "How does the zero-click call logging work with CloudTalk?",
      a: "When your team places calls via CloudTalk or Aircall, a webhook is fired to GuudCRM. GuudEngine analyzes the recording, extracts budget and decision authority, defines next steps, and drafts a ready-to-send follow-up email in under 2 seconds.",
    },
    {
      q: "Why is Lifetime BYOK only a one-time 7.999 DKK fee?",
      a: "Instead of charging bloated SaaS markups, you bring your own own LLM API key. You pay wholesale prices ($0.035 / 1M tokens), while we deliver lifetime software updates. You get full GDPR data ownership and zero recurring subscriptions.",
    },
  ],
  de: [
    {
      q: "Wie ersetzt GuudCal ScoreApp und Calendly gleichzeitig?",
      a: "ScoreApp verlangt 129 $/Monat nur für Fragen, und Calendly bis zu 64 $/Monat je Mitarbeiter. GuudCal vereint beides: Qualifizierung durch KI in 1.2s und direkte Terminwahl ohne Seitenwechsel. Sparen Sie Tausende Euro jährlich.",
    },
    {
      q: "Was macht der autonome KI-Agent im Hintergrund?",
      a: "Guud AI analysiert die Website des Kunden vollautomatisch, erkennt deren Software-Stack und erstellt ein Briefing direkt im Kalendertermin Ihres Vertrieblers.",
    },
    {
      q: "Kann ich mein eigenes Branding und meine eigene Domain nutzen?",
      a: "Ja, mit Agency Pro und Lifetime BYOK erhalten Sie vollständiges White-Labeling auf Ihrer eigenen Wunschdomain.",
    },
    {
      q: "Wie funktioniert die Anrufprotokollierung mit CloudTalk?",
      a: "Nach dem Telefonat analysiert die KI die Aufnahme in unter 2 Sekunden und generiert Gesprächsnotizen sowie eine fertige Folge-E-Mail.",
    },
    {
      q: "Was bedeutet das Lifetime BYOK-Modell?",
      a: "Sie hinterlegen Ihren eigenen KI-Schlüssel und zahlen nur die reinen Einkaufspreise pro Anfrage ohne monatliche Softwaregebühren.",
    },
  ],
  sv: [
    {
      q: "Hur kan GuudCal ersätta både ScoreApp och Calendly?",
      a: "GuudCal kombinerar interaktiv leadkvalificering med direkt kalenderbokning i ett enda sömlöst flöde, vilket eliminerar dyra abonnemang och minskar avhopp.",
    },
    {
      q: "Vad gör den autonoma AI-agenten i bakgrunden?",
      a: "Guud AI scannar automatiskt kundens företag, kartlägger deras tech-stack och skapar en säljbrief direkt i säljarens kalenderinbjudan.",
    },
    {
      q: "Kan jag använda min egen domän och logotyp?",
      a: "Ja, med Agency Pro och Lifetime BYOK är plattformen 100% white-label på din egen domän.",
    },
    {
      q: "Hur fungerar samtalsanteckningar med CloudTalk?",
      a: "Samtalet analyseras automatiskt av AI på under 2 sekunder, vilket skapar sammanfattning och färdigt uppföljningsmail utan manuellt arbete.",
    },
    {
      q: "Varför är Lifetime BYOK så prisvärt?",
      a: "Du betalar endast en engångsavgift och tar med din egen API-nyckel, vilket eliminerar månatliga SaaS-avgifter helt.",
    },
  ],
  es: [
    {
      q: "¿Cómo sustituye GuudCal a ScoreApp y Calendly?",
      a: "Combina la cualificación interactiva con IA y la reserva instantánea en una sola interfaz sin redirecciones ni tarifas mensuales infladas.",
    },
    {
      q: "¿Qué hace el agente de IA en segundo plano?",
      a: "Rastrea la web del cliente, detecta sus herramientas y genera un informe estratégico en la invitación de calendario del comercial.",
    },
    {
      q: "¿Puedo usar mi propio dominio y marca?",
      a: "Sí, con los planes Agency Pro y Lifetime BYOK tiene marca blanca total en su propio subdominio.",
    },
    {
      q: "¿Cómo funciona el registro de llamadas con CloudTalk?",
      a: "La IA analiza la llamada en 1.5s, redacta las notas y prepara el correo de seguimiento listo para enviar.",
    },
    {
      q: "¿Por qué el plan Lifetime BYOK es de pago único?",
      a: "Usted aporta su propia clave API pagando precio de coste por los tokens, sin cuotas mensuales recurrentes.",
    },
  ],
  fr: [
    {
      q: "Comment GuudCal remplace-t-il ScoreApp et Calendly ?",
      a: "Il réunit la pré-qualification par questionnaire intelligent et la prise de rendez-vous directe en une seule expérience fluide.",
    },
    {
      q: "Quel est le rôle de l'agent d'IA autonome ?",
      a: "Il audite automatiquement le site du prospect dès la réservation et ajoute un mémo stratégique dans l'agenda du commercial.",
    },
    {
      q: "Puis-je l'utiliser en marque blanche sur mon propre domaine ?",
      a: "Oui, les formules Agency Pro et Lifetime BYOK permettent une intégration 100% en marque blanche sur votre domaine.",
    },
    {
      q: "Comment fonctionne la transcription d'appel avec CloudTalk ?",
      a: "L'IA analyse l'enregistrement en moins de 2 secondes, extrait les points clés et rédige le mail de relance.",
    },
    {
      q: "Pourquoi le tarif Lifetime BYOK est-il un paiement unique ?",
      a: "Vous utilisez votre propre clé d'API au tarif de gros sans aucun abonnement logiciel mensuel récurrent.",
    },
  ],
};
