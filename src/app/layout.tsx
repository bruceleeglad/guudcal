import type { Metadata } from "next";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cal.guud.pro"),
  title: {
    default: "GuudCal | 2-in-1 AI Lead Scorecard & Kalenderbooking (ScoreApp & Calendly Alternativ)",
    template: "%s | GuudCal Anti-SaaS",
  },
  description: "Det ultimative danske alternativ til ScoreApp og Calendly. Automatisk AI lead-kvalificering drevet af GuudEngine™ AI, 1-kliks mødebooking og Zero-Click CRM opkaldsnotater. Spar 15.000–50.000 kr. om året.",
  keywords: [
    "ScoreApp alternativ",
    "Calendly alternativ",
    "AI lead scoring",
    "B2B quiz funnel",
    "mødebooking software",
    "GuudEngine AI integration",
    "HubSpot alternativ opkaldsnotater",
    "Anti-SaaS salgssystem",
    "white-label kalenderbooking",
    "CloudTalk AI webhook",
    "GuudCal",
    "Bruce Ventures"
  ],
  authors: [{ name: "Bruce Ventures", url: "https://guud.pro" }],
  creator: "Bruce Ventures",
  publisher: "Bruce Ventures Imperiet",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "da_DK",
    alternateLocale: ["en_US", "de_DE", "sv_SE"],
    url: "https://cal.guud.pro",
    title: "GuudCal – Luk flere B2B kunder uden dyre SaaS abonnementer",
    description: "Kombiner AI Scorecard, friktionsfri kalender og B2B CRM. Erstatter ScoreApp ($129/mdr) og Calendly ($64/mdr). 100% White-Label på eget domæne.",
    siteName: "GuudCal Anti-SaaS",
  },
  twitter: {
    card: "summary_large_image",
    title: "GuudCal | Slut med ScoreApp & Calendly",
    description: "Kombineret AI Lead Scoring og Kalenderbooking for ambitiøse B2B virksomheder. Spar op til 50.000 kr. årligt.",
    creator: "@bruceventures",
  },
  alternates: {
    canonical: "https://cal.guud.pro",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "GuudCal",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All (Web-based)",
      "offers": [
        {
          "@type": "Offer",
          "name": "Cloud Solo",
          "price": "199",
          "priceCurrency": "DKK",
          "billingDuration": "P1M",
          "description": "1 aktivt website, 50 SMS påmindelser, ubegrænset mødebooking."
        },
        {
          "@type": "Offer",
          "name": "Agency Pro",
          "price": "399",
          "priceCurrency": "DKK",
          "billingDuration": "P1M",
          "description": "Op til 10 klient-domæner, 250 SMS, 100% White-Label, fuld GuudCRM & kalendersynk."
        },
        {
          "@type": "Offer",
          "name": "Lifetime Agency BYOK",
          "price": "7999",
          "priceCurrency": "DKK",
          "description": "Evig licens. Bring your own key for $0 i løbende AI omkostninger."
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "128",
        "bestRating": "5"
      },
      "description": "2-in-1 B2B AI Lead Qualification Scorecard and Instant Calendar Scheduler with GuudEngine Neural telemetry."
    },
    {
      "@type": "Organization",
      "name": "Bruce Ventures",
      "url": "https://guud.pro",
      "sameAs": [
        "https://projekter.guud.pro",
        "https://cal.guud.pro"
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="da"
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
