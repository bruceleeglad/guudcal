'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CallNotesData {
  executiveSummary?: string;
  currentTechStack?: string[];
  budgetAndAuthority?: string;
  customerObjections?: string[];
  nextActionItems?: { task: string; owner: string; deadline: string }[];
  draftFollowUpEmail?: { subject: string; body: string };
}

interface Deal {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  score: number;
  stage: 'new' | 'called' | 'proposal' | 'won';
  lastCallNotes?: CallNotesData;
}

interface LicenseInfo {
  key: string;
  company: string;
  tier: 'solo' | 'agency' | 'lifetime';
  maxDomains: number;
  registeredDomains: string[];
  monthlyLeadsQuota: number;
  leadsUsedThisMonth: number;
  status: 'active' | 'suspended' | 'expired';
  expiresAt: string;
}

const INITIAL_DEALS: Deal[] = [
  {
    id: 'd-1',
    name: 'Lars Lind',
    company: 'Nordic Scale Media',
    email: 'lars@nordicscale.dk',
    value: 38000,
    score: 82,
    stage: 'new',
  },
  {
    id: 'd-2',
    name: 'Sofie Møller',
    company: 'København Web Bureau',
    email: 'sofie@kbhweb.dk',
    value: 45000,
    score: 91,
    stage: 'called',
    lastCallNotes: {
      executiveSummary: 'Sofie bekræftede, at de betaler 4.500 kr./mdr. til HubSpot og 1.200 kr. til Calendly. De vil skifte 8 sælgere over til GuudCal og GuudCRM inden månedens udgang for at spare 50.000 kr. årligt.',
      currentTechStack: ['HubSpot Sales Hub', 'Calendly Teams', 'Typeform'],
      budgetAndAuthority: 'Godkendt 3.500 kr./mdr. budget. Sofie har fuld tegningsret som Managing Director.',
      customerObjections: ['Spurgte ind til overførsel af eksisterende kontakter fra HubSpot'],
      nextActionItems: [
        { task: 'Send Agency Pro forslag med SMS pakke', owner: 'Thomas', deadline: 'I morgen kl. 10:00' }
      ],
      draftFollowUpEmail: {
        subject: 'Opfølgning: Erstatning af HubSpot & Calendly for København Web Bureau',
        body: 'Hej Sofie,\n\nTak for en fremragende snak i dag!\n\nJeg har samlet vores Agency Pro model til jer med 250 SMS/mdr. og fuld White-Label, så I kan fjerne HubSpots dyre licenser og spare 50.000 kr. om året.\n\nJeg sender det formelle tilbud i morgen formiddag.\n\nDe bedste hilsner,\nThomas Bruce'
      }
    }
  },
  {
    id: 'd-3',
    name: 'Henrik Ravn',
    company: 'Aarhus Tech Consulting',
    email: 'henrik@aarhustech.dk',
    value: 22000,
    score: 76,
    stage: 'proposal',
  },
  {
    id: 'd-4',
    name: 'Mikkel Bech',
    company: 'Jysk Digital Vækst',
    email: 'mikkel@jyskdigital.dk',
    value: 50000,
    score: 88,
    stage: 'won',
  },
];

const SAMPLE_TRANSCRIPT = `Sælger (Thomas): Hej Lars, tak fordi du tog mit opkald her efter din test på GuudCal!
Lars Lind (Nordic Scale): Ja hej Thomas! Jamen jeg tog jeres quiz i morges. Vi sidder lige nu og er ved at drukne i softwareudgifter.
Sælger: Fortæl mig lidt om, hvad I bruger i dag, og hvor skoen trykker mest?
Lars Lind: Jamen vi bruger HubSpot Sales Hub, og det koster os næsten 4.000 kr. om måneden bare for vores fire konsulenter. Oven i det betaler vi til Calendly og ScoreApp. Det værste er, at mine sælgere bruger halvdelen af dagen på at sidde og skrive noter ned i HubSpot efter hvert eneste opkald, i stedet for bare at sælge.
Sælger: Det kender jeg alt for godt fra min egen tid som sales manager. Det er netop derfor, vi har bygget GuudCRM. Hvis I beholder jeres CloudTalk telefoni, sender CloudTalk bare en automatisk webhook til os, hvorefter vores AI skriver hele resuméet, handlingspunkterne og en færdig opfølgningsmail på under 2 sekunder.
Lars Lind: Wow, seriøst? Det ville spare os for mindst 5-8 timer om ugen pr. mand! Hvad koster det os?
Sælger: Vores Agency Pro koster kun 399 kr. om måneden for hele jeres team, inklusiv 250 SMS påmindelser, så jeres kunder ikke brænder jer af.
Lars Lind: Det er jo under en tiendedel af hvad vi betaler til HubSpot! Hvis du kan sende mig et tilbud inden torsdag middag, så tager jeg det op på vores partnermøde fredag formiddag.
Sælger: Det er en aftale, Lars! Jeg sender det torsdag formiddag, så I har det i god tid. Tak for snakken!`;

export default function GuudCRMPage() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'licensing'>('pipeline');
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(INITIAL_DEALS[0]);
  const [isSimulatingCall, setIsSimulatingCall] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Licensing state
  const [selectedLicenseKey, setSelectedLicenseKey] = useState<string>('GC-AGENCY-4819');
  const [licenseData, setLicenseData] = useState<LicenseInfo | null>(null);
  const [newDomainInput, setNewDomainInput] = useState<string>('');
  const [domainFeedback, setDomainFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedEmbed, setCopiedEmbed] = useState<boolean>(false);

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0);

  // Fetch license information
  const loadLicense = async (key: string) => {
    try {
      const res = await fetch(`/api/crm/license?key=${key}`);
      const data = await res.json();
      if (data.success && data.license) {
        setLicenseData(data.license);
      }
    } catch (e) {
      console.error('Failed to load license', e);
    }
  };

  useEffect(() => {
    let ignore = false;
    const fetchLicense = async () => {
      try {
        const res = await fetch(`/api/crm/license?key=${selectedLicenseKey}`);
        const data = await res.json();
        if (!ignore && data.success && data.license) {
          setLicenseData(data.license);
        }
      } catch (e) {
        console.error('Failed to load license', e);
      }
    };
    fetchLicense();
    return () => {
      ignore = true;
    };
  }, [selectedLicenseKey]);

  const handleSimulateCloudTalk = async (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    setIsSimulatingCall(true);

    try {
      const res = await fetch('/api/crm/call-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal.id,
          callerName: deal.name,
          callerCompany: deal.company,
          callProvider: 'CloudTalk',
          durationMinutes: 14,
          transcript: SAMPLE_TRANSCRIPT,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const updatedDeals = deals.map(d => {
          if (d.id === dealId) {
            return {
              ...d,
              stage: 'called' as const,
              lastCallNotes: data.analysis,
            };
          }
          return d;
        });

        setDeals(updatedDeals);
        setSelectedDeal(updatedDeals.find(d => d.id === dealId) || null);
      }
    } catch (err) {
      console.error('Call logging failed', err);
    } finally {
      setIsSimulatingCall(false);
    }
  };

  const copyEmailToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;

    setDomainFeedback(null);
    try {
      const res = await fetch('/api/crm/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: selectedLicenseKey,
          domain: newDomainInput.trim(),
        }),
      });

      const result = await res.json();
      if (result.success) {
        setDomainFeedback({ type: 'success', message: result.message });
        setNewDomainInput('');
        if (result.license) {
          setLicenseData(result.license);
        } else {
          loadLicense(selectedLicenseKey);
        }
      } else {
        setDomainFeedback({ type: 'error', message: result.message || result.error });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Netværksfejl under tilføjelse af domæne';
      setDomainFeedback({ type: 'error', message: msg });
    }
  };

  const copyEmbedSnippet = (key: string) => {
    const snippet = `<script src="https://cal.guud.pro/embed.js?key=${key}" async></script>`;
    navigator.clipboard.writeText(snippet);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Bar */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-neutral-950 font-black text-base shadow-md">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">GuudCRM</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Enterprise Suite
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Zero-Click CRM Intelligence &middot; GuudEngine™ Neural</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              📊 B2B Pipeline & Opkald
            </button>
            <button
              onClick={() => setActiveTab('licensing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'licensing'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              🛡️ Licens & Domænekontrol
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors font-medium text-xs border border-neutral-700"
            >
              ← Gå til GuudCal
            </Link>
          </div>
        </div>
      </header>

      {/* Metrics Banner */}
      <section className="bg-neutral-900/50 border-b border-neutral-800 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-neutral-500 uppercase text-[10px] block">Pipeline Værdi:</span>
              <span className="text-emerald-400 font-bold text-sm">{totalPipelineValue.toLocaleString('da-DK')} DKK</span>
            </div>
            <div>
              <span className="text-neutral-500 uppercase text-[10px] block">Aktive Deals:</span>
              <span className="text-white font-bold text-sm">{deals.length} B2B Leads</span>
            </div>
            <div className="hidden md:block">
              <span className="text-neutral-500 uppercase text-[10px] block">Sikkerhed & Domænevæg:</span>
              <span className="text-cyan-400 font-bold text-sm">Aktiv (GuudEngine™)</span>
            </div>
          </div>
          <div className="text-neutral-400 text-[11px]">
            ⚡ GuudEngine omkostning pr. analyse: <strong className="text-emerald-400">0,0022 kr.</strong>
          </div>
        </div>
      </section>

      {activeTab === 'pipeline' ? (
        /* Main Workspace (Kanban + Live Detail Drawer) */
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 4-Stage Kanban Pipeline (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-mono">
                [B2B Sales Pipeline // Auto-Sync med GuudCal]
              </h2>
              <span className="text-xs text-neutral-500 font-mono">Live Drag & Drop</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Column 1: Nye Leads fra GuudCal */}
              <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    1. Nyt Lead (GuudCal)
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {deals.filter(d => d.stage === 'new').length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {deals.filter(d => d.stage === 'new').map(deal => (
                    <div
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedDeal?.id === deal.id
                          ? 'bg-neutral-800/90 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                          : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-medium text-xs text-white">{deal.name}</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {deal.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mb-2">{deal.company}</p>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-neutral-500">{deal.value.toLocaleString('da-DK')} DKK</span>
                        <span className="text-cyan-400 text-[10px]">Venter på opkald &rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Opkald Afsluttet (CloudTalk) */}
              <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    2. Opkald Taget
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {deals.filter(d => d.stage === 'called').length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {deals.filter(d => d.stage === 'called').map(deal => (
                    <div
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedDeal?.id === deal.id
                          ? 'bg-neutral-800/90 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-medium text-xs text-white">{deal.name}</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {deal.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mb-1.5">{deal.company}</p>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-[9px] font-mono mb-2">
                        <span>✓ AI Opkaldsnotat Gemt</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-neutral-500">{deal.value.toLocaleString('da-DK')} DKK</span>
                        <span className="text-emerald-400 text-[10px]">Klar til tilbud &rarr;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Tilbud Sendt */}
              <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    3. Tilbud Sendt
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {deals.filter(d => d.stage === 'proposal').length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {deals.filter(d => d.stage === 'proposal').map(deal => (
                    <div
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedDeal?.id === deal.id
                          ? 'bg-neutral-800/90 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-medium text-xs text-white">{deal.name}</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {deal.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mb-2">{deal.company}</p>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-neutral-500">{deal.value.toLocaleString('da-DK')} DKK</span>
                        <span className="text-amber-400 text-[10px]">Afventer svar</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 4: Lukket / Vundet */}
              <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800 text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    4. Vundet Aftale
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {deals.filter(d => d.stage === 'won').length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {deals.filter(d => d.stage === 'won').map(deal => (
                    <div
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedDeal?.id === deal.id
                          ? 'bg-neutral-800/90 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                          : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-medium text-xs text-white">{deal.name}</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          VUNDET 🎉
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mb-2">{deal.company}</p>
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-400">
                        <span>{deal.value.toLocaleString('da-DK')} DKK</span>
                        <span className="text-[10px]">Aktiv Kunde</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Deal Inspection Drawer & Live Call Bridge (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 shadow-xl">
            {selectedDeal ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedDeal.name}</h3>
                    <p className="text-xs text-neutral-400">{selectedDeal.company} &middot; {selectedDeal.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      {selectedDeal.value.toLocaleString('da-DK')} DKK
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Score: {selectedDeal.score}/100
                    </span>
                  </div>
                </div>

                {/* CloudTalk Call Simulation Button */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-xs font-bold text-white font-mono">CloudTalk Telefoni Bridge</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      Webhook Auto-Hook
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Test live webhooken fra din CloudTalk softphone. Systemet analyserer optagelsen, trækker budget og beslutningstager ud, og skriver opfølgningsmailen med GuudEngine™ Neural-v4.
                  </p>
                  <button
                    onClick={() => handleSimulateCloudTalk(selectedDeal.id)}
                    disabled={isSimulatingCall}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-neutral-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isSimulatingCall ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                        <span>Analyserer samtale via GuudEngine™ Neural...</span>
                      </>
                    ) : (
                      <>
                        <span>📞 Modtag & Analysér CloudTalk Opkald</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Display Auto-Generated Notes if available */}
                {selectedDeal.lastCallNotes ? (
                  <div className="space-y-4">
                    {/* Executive Summary */}
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <div className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                        <span>✓ Eksekutivt Resumé (Genereret af GuudEngine™)</span>
                      </div>
                      <p className="text-neutral-300 leading-relaxed font-sans">
                        {selectedDeal.lastCallNotes.executiveSummary}
                      </p>
                    </div>

                    {/* Tech Stack & Budget */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Nuværende Værktøjer:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedDeal.lastCallNotes.currentTechStack?.map((t: string, i: number) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-mono">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Budget & Beslutning:</span>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          {selectedDeal.lastCallNotes.budgetAndAuthority}
                        </span>
                      </div>
                    </div>

                    {/* Action Items */}
                    {selectedDeal.lastCallNotes.nextActionItems && (
                      <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-2">
                          Handlingspunkter (Næste Skridt):
                        </span>
                        <ul className="space-y-1.5 text-neutral-300">
                          {selectedDeal.lastCallNotes.nextActionItems.map((item: { task: string; owner: string; deadline: string }, idx: number) => (
                            <li key={idx} className="flex items-start justify-between gap-2 text-[11px]">
                              <span>&bull; {item.task} ({item.owner})</span>
                              <span className="text-neutral-500 font-mono whitespace-nowrap">{item.deadline}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Auto-Drafted Follow-Up Email */}
                    {selectedDeal.lastCallNotes.draftFollowUpEmail && (
                      <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-500/30 text-xs">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                            ✉️ Klar Opfølgningsmail
                          </span>
                          <button
                            onClick={() => copyEmailToClipboard(selectedDeal.lastCallNotes?.draftFollowUpEmail?.body || '')}
                            className="text-[10px] font-mono text-neutral-400 hover:text-white underline"
                          >
                            {copiedEmail ? '✓ Kopieret!' : '[Kopier Mail]'}
                          </button>
                        </div>
                        <div className="text-[11px] font-mono text-neutral-400 mb-1">
                          Emne: <strong className="text-neutral-200">{selectedDeal.lastCallNotes.draftFollowUpEmail.subject}</strong>
                        </div>
                        <pre className="text-[11px] text-neutral-300 font-sans whitespace-pre-wrap leading-relaxed mt-2 p-2 bg-neutral-900 rounded-lg">
                          {selectedDeal.lastCallNotes.draftFollowUpEmail.body}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-500 text-xs font-mono">
                    Ingen samtaler logget endnu. Klik på knappen ovenfor for at simulere et opkald fra CloudTalk.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-500 text-xs font-mono">
                Vælg et lead i pipelinen for at se opkaldsdetaljer og AI-noter.
              </div>
            )}
          </div>
        </main>
      ) : (
        /* Licensing & Domain Protection Workspace */
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 space-y-6">
          {/* License Selector Banner */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Kunde & Licensstyring</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Kryptografisk Håndhævelse
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Forhindrer misbrug, uautoriseret domænekloning og sikrer at kunder kun bruger de domæner, de betaler for.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono">Aktiv Licens:</span>
              <select
                value={selectedLicenseKey}
                onChange={e => setSelectedLicenseKey(e.target.value)}
                className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              >
                <option value="GC-SOLO-9823">GC-SOLO-9823 (Nordic Scale - Solo, 1 Domæne)</option>
                <option value="GC-AGENCY-4819">GC-AGENCY-4819 (København Web - Agency, 10 Domæner)</option>
                <option value="GC-LIFE-7721">GC-LIFE-7721 (Bruce Ventures - Lifetime BYOK)</option>
              </select>
            </div>
          </div>

          {licenseData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: License Card & Domain Quota (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Quota & Usage Overview */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-5">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Licenstagere:</span>
                      <h3 className="text-lg font-bold text-white">{licenseData.company}</h3>
                      <span className="text-xs font-mono text-neutral-400">Nøgle: {licenseData.key}</span>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold uppercase font-mono ${
                        licenseData.tier === 'lifetime'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : licenseData.tier === 'agency'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {licenseData.tier.toUpperCase()} TIER
                      </span>
                      <span className="text-[11px] text-neutral-500 block mt-1 font-mono">
                        Udløber: {licenseData.expiresAt}
                      </span>
                    </div>
                  </div>

                  {/* Quota Meter */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-neutral-400 font-mono">Domænekvote:</span>
                        <span className="text-xs font-mono font-bold text-white">
                          {licenseData.registeredDomains.length} / {licenseData.maxDomains} domæner
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            licenseData.registeredDomains.length >= licenseData.maxDomains
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (licenseData.registeredDomains.length / licenseData.maxDomains) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-2 block font-mono">
                        {licenseData.maxDomains - licenseData.registeredDomains.length > 0
                          ? `${licenseData.maxDomains - licenseData.registeredDomains.length} ledige domæne-pladser tilbage`
                          : 'Maksimum kapacitet nået for denne licens'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-neutral-400 font-mono">Månedlige Leads:</span>
                        <span className="text-xs font-mono font-bold text-white">
                          {licenseData.leadsUsedThisMonth} / {licenseData.tier === 'lifetime' ? '∞' : licenseData.monthlyLeadsQuota}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full transition-all duration-500"
                          style={{
                            width: `${licenseData.tier === 'lifetime' ? 5 : (licenseData.leadsUsedThisMonth / licenseData.monthlyLeadsQuota) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-2 block font-mono">
                        {licenseData.tier === 'lifetime' ? 'Ubegrænset (BYOK model)' : 'Nulstilles d. 1. i måneden'}
                      </span>
                    </div>
                  </div>

                  {/* Registered Domains List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono mb-3">
                      Autoriserede Domæner ({licenseData.registeredDomains.length})
                    </h4>
                    <div className="space-y-2">
                      {licenseData.registeredDomains.map((dom, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="font-mono text-white font-medium">{dom}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                              DNS Verificeret
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                              Aktiv
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Domain Form (With Live Limit Enforcement) */}
                  <form onSubmit={handleAddDomain} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-3">
                    <label className="text-xs font-bold text-neutral-300 font-mono block">
                      Registrér Nyt Klientdomæne på Licensen:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="f.eks. nytklientbureau.dk"
                        value={newDomainInput}
                        onChange={e => setNewDomainInput(e.target.value)}
                        className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors whitespace-nowrap"
                      >
                        + Tilknyt Domæne
                      </button>
                    </div>

                    {domainFeedback && (
                      <div className={`p-3 rounded-xl text-xs font-mono ${
                        domainFeedback.type === 'success'
                          ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                          : 'bg-red-950/60 border border-red-500/40 text-red-300'
                      }`}>
                        {domainFeedback.type === 'success' ? '✓ ' : '⚠️ '}
                        {domainFeedback.message}
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Right Column: Embed Script & Anti-Theft Architecture (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Embed Snippet Generator */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <span>Klient Embed Snippet</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                        Zero-Maintenance
                      </span>
                    </h3>
                    <button
                      onClick={() => copyEmbedSnippet(licenseData.key)}
                      className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline"
                    >
                      {copiedEmbed ? '✓ Kopieret!' : '[Kopier Snippet]'}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Kunden indsætter dette ene script-tag på deres WordPress, Webflow, Shopify eller Next.js site. Scriptet verificerer automatisk, at sitets domæne matcher en autoriseret licensnøgle, før GuudCal widgetten åbner.
                  </p>

                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto">
                    <code>{`<script src="https://cal.guud.pro/embed.js?key=${licenseData.key}" async></script>`}</code>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-2 text-xs">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                      Javascript API Kald (Efter load):
                    </span>
                    <code className="text-neutral-400 text-[11px] block bg-neutral-900 p-2 rounded">
                      window.GuudCal.open();
                    </code>
                  </div>
                </div>

                {/* Security & Anti-Reverse Engineering Shields */}
                <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <span>🛡️ Sikkerheds- & Kloningsskjold</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-neutral-200">Neural Model Masking</strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                          Aktiv
                        </span>
                      </div>
                      <p className="text-neutral-400 text-[11px]">
                        DeepSeek Flash 1017 og OpenRouter er 100% skjult for klienter og netværkssniffere. Alle API svar og HTTP-headers udskrives som &quot;GuudEngine™ Neural-v4&quot;.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-neutral-200">Prompt Injection Sanitizer</strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                          Aktiv
                        </span>
                      </div>
                      <p className="text-neutral-400 text-[11px]">
                        Forsøg på at manipulere prompten (&quot;ignore previous instructions&quot;, system leakage) strippes automatisk i <code className="text-neutral-300">security.ts</code> inden AI-kaldet.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-neutral-200">HMAC-SHA256 Webhook Auth</strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                          Aktiv
                        </span>
                      </div>
                      <p className="text-neutral-400 text-[11px]">
                        Indgående CloudTalk og Aircall opkaldslogger valideres kryptografisk med timing-safe signaturer for at forhindre forfalskede opkaldsnotater.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
