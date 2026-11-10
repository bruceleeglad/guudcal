'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TRANSLATIONS, Language, HERO_TRANSLATIONS, GUUD_SHOWCASE_DATA, FAQ_DATA } from '@/lib/translations';

const TIME_SLOTS = [
  '09:00 - 09:30',
  '10:30 - 11:00',
  '13:00 - 13:30',
  '14:30 - 15:00',
  '16:00 - 16:30',
];

interface AiResultData {
  score?: number;
  tier?: string;
  summary?: string;
  fitColor?: string;
  recommendedMeetingType?: string;
  keyPainPoint?: string;
  readyToBook?: boolean;
  name?: string;
  company?: string;
  email?: string;
}

export default function GuudCalPage() {
  const [variant, setVariant] = useState<'a' | 'b'>('a');
  const [lang, setLang] = useState<Language>('da');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, { label: string; score: number }>>({});
  const [prospect, setProspect] = useState({ name: '', email: '', company: '' });
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState<AiResultData | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('I morgen, 4. nov');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30 - 11:00');
  const [isBooked, setIsBooked] = useState(false);

  // Savings Calculator State
  const [teamSize, setTeamSize] = useState<number>(4);
  const [monthlyLeads, setMonthlyLeads] = useState<number>(80);

  // Auto-Brand Scanner State
  const [brandUrl, setBrandUrl] = useState<string>('');
  const [isScanningBrand, setIsScanningBrand] = useState<boolean>(false);
  const [scannedBrand, setScannedBrand] = useState<{ name: string; primaryColor: string; domain: string } | null>(null);

  const t = TRANSLATIONS[lang];
  const hero = HERO_TRANSLATIONS[lang];
  const guudAi = GUUD_SHOWCASE_DATA[lang];
  const faqs = FAQ_DATA[lang];
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pricingTab, setPricingTab] = useState<'suite' | 'cal' | 'crm'>('suite');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleCheckout = async (tier: 'solo' | 'agency' | 'lifetime') => {
    try {
      setCheckoutLoading(tier);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: pricingTab, tier })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Kunne ikke starte betaling');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Ukendt fejl';
      alert('Fejl under checkout: ' + msg);
    } finally {
      setCheckoutLoading(null);
    }
  };
  const questions = t.questions;
  const totalQuestions = questions.length;
  const isQuizDone = currentStep >= totalQuestions;

  // Savings Math (in DKK)
  const scoreAppMonthly = 895; // ~$129
  const calendlyPerUserMonthly = 110; // ~$16
  const oldMonthlySpend = scoreAppMonthly + (calendlyPerUserMonthly * teamSize);
  const oldAnnualSpend = oldMonthlySpend * 12;
  const qualicalAnnualTokenCost = Math.round((monthlyLeads * 0.0018) * 12);
  const annualSavings = oldAnnualSpend - qualicalAnnualTokenCost;

  // Check URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('v');
      const l = params.get('lang') as Language;
      if (v === 'b' || v === 'a') {
        requestAnimationFrame(() => setVariant(v));
      }
      if (['da', 'en', 'de', 'sv', 'es', 'fr'].includes(l)) {
        requestAnimationFrame(() => setLang(l));
      }
    }
  }, []);

  const handleScanBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandUrl.trim()) return;
    setIsScanningBrand(true);
    try {
      const res = await fetch('/api/scan-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: brandUrl }),
      });
      const data = await res.json();
      if (data.success && data.brand) {
        setScannedBrand(data.brand);
      }
    } catch (err) {
      console.error('Scan failed', err);
    } finally {
      setIsScanningBrand(false);
    }
  };

  const handleSelectOption = (qId: string, option: { label: string; score: number }) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
    if (currentStep < totalQuestions) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospect.email || !prospect.name) return;

    setIsLoadingAi(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([key, val]) => {
        const q = questions.find(item => item.id === key);
        return {
          question: q?.title || key,
          answer: val.label,
        };
      });

      const res = await fetch('/api/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prospect.name,
          email: prospect.email,
          company: prospect.company,
          answers: formattedAnswers,
        }),
      });

      const data = await res.json();
      if (data.success && data.lead) {
        setAiResult(data.lead);
      }
    } catch (err) {
      console.error('AI qualify failed', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setProspect({ name: '', email: '', company: '' });
    setAiResult(null);
    setIsBooked(false);
  };

  const customAccent = scannedBrand ? scannedBrand.primaryColor : (variant === 'a' ? '#1A1918' : '#FF5500');

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* ============================================================== */}
      {/* TOP CONTROL BAR: Language Selector + A/B Switcher              */}
      {/* ============================================================== */}
      <div className="bg-neutral-900 border-b border-neutral-800 text-neutral-300 py-2.5 px-4 sticky top-0 z-50 text-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-tech uppercase tracking-wider text-[11px] text-neutral-300">
              GuudCal &middot; 2-in-1 Engine
            </span>
            {scannedBrand && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] bg-neutral-800 border border-neutral-700 text-neutral-200">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scannedBrand.primaryColor }} />
                Brand: {scannedBrand.domain}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              {(['da', 'en', 'de', 'sv', 'es', 'fr'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition-all ${
                    lang === l
                      ? 'bg-neutral-700 text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {l === 'da' ? '🇩🇰 DA' : l === 'en' ? '🇬🇧 EN' : l === 'de' ? '🇩🇪 DE' : l === 'sv' ? '🇸🇪 SV' : l === 'es' ? '🇪🇸 ES' : '🇫🇷 FR'}
                </button>
              ))}
            </div>

            {/* A/B Switcher */}
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              <button
                onClick={() => setVariant('a')}
                className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                  variant === 'a'
                    ? 'bg-neutral-200 text-neutral-900 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Variant A: Editorial
              </button>
              <button
                onClick={() => setVariant('b')}
                className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                  variant === 'b'
                    ? 'bg-orange-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Variant B: Utility
              </button>
            </div>

            <Link
              href="/crm"
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
            >
              <span>👑</span>
              <span>GuudCRM Pipeline</span>
            </Link>

            <button
              onClick={handleReset}
              className="text-[11px] font-tech text-neutral-400 hover:text-white underline underline-offset-4 hidden sm:block"
            >
              [Nulstil]
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* LIVE DOMAIN BRAND SCANNER DRAWER                               */}
      {/* ============================================================== */}
      <section className="bg-neutral-950 border-b border-neutral-800 py-3 px-4 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-tech text-emerald-400 font-bold">⚡ AUTO-BRAND ADAPTER:</span>
            <span className="text-neutral-400 text-[11px]">{t.scannerSubtitle}</span>
          </div>
          <form onSubmit={handleScanBrand} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={brandUrl}
              onChange={e => setBrandUrl(e.target.value)}
              placeholder={t.scannerPlaceholder}
              className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-tech w-full sm:w-48"
            />
            <button
              type="submit"
              disabled={isScanningBrand}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-lg text-xs whitespace-nowrap border border-neutral-700 transition-colors disabled:opacity-50"
            >
              {isScanningBrand ? 'Scanner...' : t.btnScan}
            </button>
          </form>
        </div>
      </section>

      {/* ============================================================== */}
      {/* VARIANT A: NORDIC EDITORIAL / PAPER & INK                       */}
      {/* ============================================================== */}
      {variant === 'a' && (
        <div className="flex-1 bg-[#F9F8F5] text-[#1A1918] selection:bg-[#EAE6DD] flex flex-col">
          {/* Header */}
          <header className="border-b border-[#E6E3DA] py-6 px-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <span className="text-[11px] tracking-widest uppercase font-tech text-neutral-500 block mb-1">
                  {t.auditTag}
                </span>
                <h1 className="text-2xl sm:text-3xl font-editorial tracking-tight font-normal text-neutral-900 italic">
                  {scannedBrand ? scannedBrand.name : 'GuudCal'}{' '}
                  <span className="not-italic text-sm text-neutral-500 font-sans ml-2">/ {t.badgeAntiSaas}</span>
                </h1>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-xs font-serif italic text-neutral-700">ScoreApp + Calendly i én flade</span>
              </div>
            </div>
          </header>

          {/* Hero Statement & Value Proposition */}
          <section className="max-w-4xl mx-auto w-full px-4 pt-12 pb-8 text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#F0EEE6] border border-[#E2DFD2] rounded-full text-[11px] font-tech text-neutral-800 mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-bold tracking-wider">{hero.badge}</span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-3xl sm:text-5xl font-editorial font-normal leading-tight text-neutral-900 mb-4 max-w-3xl mx-auto">
              {hero.h1}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-serif italic text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8">
              {hero.sub}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              <a
                href="#interactive-demo"
                className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-[#F9F8F5] text-xs font-sans font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2"
              >
                <span>{hero.btnDemo}</span>
              </a>
              <Link
                href="/crm"
                className="px-6 py-3 bg-[#FFFFFF] hover:bg-[#F2EFE8] text-neutral-900 text-xs font-sans font-bold tracking-wider uppercase border border-[#D8D4C7] transition-all flex items-center gap-2"
              >
                <span>{hero.btnCrm}</span>
              </Link>
              <a
                href="#savings-calc"
                className="px-4 py-3 text-neutral-600 hover:text-neutral-900 text-xs font-serif italic transition-all underline underline-offset-4"
              >
                {hero.btnRoi} &rarr;
              </a>
            </div>

            {/* 4 Value Proposition Blocks (Editorial 2x2 Bento) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left mb-10">
              {hero.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-[#FFFFFF] border border-[#E6E3DA] shadow-sm flex items-start gap-4 transition-all hover:border-neutral-900"
                >
                  <div className="w-10 h-10 rounded-none bg-[#F4F1EA] border border-[#E6E3DA] text-neutral-800 flex items-center justify-center text-xl shrink-0">
                    {feat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-editorial font-bold text-neutral-900">
                        {feat.title}
                      </h3>
                      <span className="text-[10px] font-tech px-2 py-0.5 bg-[#F4F1EA] text-neutral-600 border border-[#E6E3DA] shrink-0">
                        {feat.killer}
                      </span>
                    </div>
                    <p className="text-xs font-serif text-neutral-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Editorial Stats Ledger */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-[#E6E3DA] py-3 text-xs">
              {hero.stats.map((st, i) => (
                <div key={i} className="text-center py-1">
                  <span className="text-[10px] font-tech uppercase text-neutral-500 block">{st.label}</span>
                  <span className="font-editorial text-neutral-900 font-bold text-base">{st.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Main Card */}
          <main id="interactive-demo" className="max-w-2xl mx-auto w-full px-4 pt-6 pb-12 flex-1 flex flex-col justify-center">
            <div className="bg-[#FFFFFF] border border-[#E6E3DA] rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-8 sm:p-10 relative">
              {/* Paper Bookmark Tag */}
              <div
                className="absolute -top-3 left-8 px-3 py-0.5 text-[#F9F8F5] text-[10px] font-tech tracking-widest uppercase"
                style={{ backgroundColor: customAccent }}
              >
                {!isQuizDone ? `§ 0${currentStep + 1} / AUDIT` : !aiResult ? '§ 05 / MODTAGER' : !isBooked ? '§ 06 / TIDSPUNKT' : '§ 07 / BEKRÆFTET'}
              </div>

              {!isQuizDone ? (
                <div>
                  <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[#F0EEE6]">
                    <span className="text-xs font-serif italic text-neutral-500">
                      {t.stepOf(currentStep + 1, totalQuestions)}
                    </span>
                    <span className="text-xs font-tech text-neutral-400">
                      ID: {questions[currentStep].id.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-editorial font-normal text-neutral-900 mb-2 leading-snug">
                    {questions[currentStep].title}
                  </h3>
                  <p className="text-xs font-sans text-neutral-500 mb-8 leading-relaxed">
                    {questions[currentStep].subtitle}
                  </p>

                  <div className="space-y-2.5">
                    {questions[currentStep].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(questions[currentStep].id, option)}
                        className="w-full text-left p-4 border border-[#E6E3DA] hover:border-[#1A1918] bg-[#FDFDFB] hover:bg-[#F9F8F5] transition-all group flex items-baseline justify-between"
                      >
                        <div className="pr-4">
                          <span className="text-xs font-tech text-neutral-400 mr-3">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span className="text-sm font-sans font-medium text-neutral-900 group-hover:text-black">
                            {option.label}
                          </span>
                          {option.desc && (
                            <p className="text-xs font-serif italic text-neutral-500 mt-1 pl-6">
                              {option.desc}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-tech text-neutral-400 group-hover:text-neutral-900">
                          {t.btnSelect}
                        </span>
                      </button>
                    ))}
                  </div>

                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="mt-6 text-xs font-serif italic text-neutral-500 hover:text-black"
                    >
                      {t.btnBack}
                    </button>
                  )}
                </div>
              ) : !aiResult ? (
                <div>
                  <h3 className="text-2xl font-editorial font-normal text-neutral-900 mb-2">
                    {t.formTitle}
                  </h3>
                  <p className="text-xs font-sans text-neutral-500 mb-6 leading-relaxed">
                    {t.formSubtitle}
                  </p>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-tech text-neutral-600 uppercase mb-1">{t.fieldName}</label>
                      <input
                        type="text"
                        required
                        value={prospect.name}
                        onChange={e => setProspect(p => ({ ...p, name: e.target.value }))}
                        placeholder="f.eks. Christian Møller"
                        className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#E6E3DA] text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 rounded-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-tech text-neutral-600 uppercase mb-1">{t.fieldEmail}</label>
                      <input
                        type="email"
                        required
                        value={prospect.email}
                        onChange={e => setProspect(p => ({ ...p, email: e.target.value }))}
                        placeholder="christian@bureau.dk"
                        className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#E6E3DA] text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 rounded-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-tech text-neutral-600 uppercase mb-1">{t.fieldCompany}</label>
                      <input
                        type="text"
                        value={prospect.company}
                        onChange={e => setProspect(p => ({ ...p, company: e.target.value }))}
                        placeholder="Møller & Partnere"
                        className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-[#E6E3DA] text-neutral-900 text-sm focus:outline-none focus:border-neutral-900 rounded-none font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoadingAi}
                      className="w-full py-3.5 text-white text-xs font-tech uppercase tracking-wider transition-colors disabled:opacity-50 mt-4"
                      style={{ backgroundColor: customAccent }}
                    >
                      {isLoadingAi ? t.analyzingText : t.btnSubmit}
                    </button>
                  </form>
                </div>
              ) : !isBooked ? (
                <div>
                  {/* Ledger Result Card */}
                  <div className="border border-[#1A1918] p-5 mb-8 bg-[#FAF9F6]">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E6E3DA]">
                      <div>
                        <span className="text-[10px] font-tech text-neutral-500 uppercase tracking-widest block">{t.docTitle}</span>
                        <h4 className="text-lg font-editorial italic font-normal text-neutral-900">{aiResult.name}</h4>
                      </div>
                      <div className="border-2 border-[#1A1918] px-3 py-1 text-center">
                        <span className="text-xs font-tech font-bold block">{aiResult.score} / 100</span>
                        <span className="text-[9px] font-tech uppercase tracking-widest text-neutral-500">{t.approvedBadge}</span>
                      </div>
                    </div>

                    <div className="pt-3 text-xs font-sans text-neutral-700 leading-relaxed">
                      <p className="font-serif italic text-neutral-900 mb-1">{aiResult.summary}</p>
                      <p className="text-[11px] font-tech text-neutral-500 mt-2">
                        AGENDA: {aiResult.recommendedMeetingType}
                      </p>
                    </div>
                  </div>

                  {/* Calendar Choice */}
                  <h4 className="text-base font-editorial italic text-neutral-900 mb-3">{t.calendarTitle}</h4>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {['I morgen, 4. nov', 'Fredag, 5. nov', 'Mandag, 8. nov'].map((day, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        className={`p-2 border text-xs font-tech transition-colors ${
                          selectedDate === day
                            ? 'bg-[#1A1918] text-white border-[#1A1918]'
                            : 'bg-white border-[#E6E3DA] text-neutral-600 hover:border-neutral-900'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                    {TIME_SLOTS.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 border text-xs font-tech transition-colors ${
                          selectedSlot === slot
                            ? 'border-[#1A1918] bg-[#F0EEE6] font-bold text-neutral-900'
                            : 'border-[#E6E3DA] bg-white text-neutral-600 hover:border-neutral-400'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsBooked(true)}
                    className="w-full py-3.5 text-white text-xs font-tech uppercase tracking-wider transition-colors"
                    style={{ backgroundColor: customAccent }}
                  >
                    {t.btnBook(selectedDate, selectedSlot)}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-3 font-serif">✓</div>
                  <h3 className="text-2xl font-editorial font-normal text-neutral-900 mb-2">{t.bookedTitle}</h3>
                  <p className="text-xs font-serif italic text-neutral-600 max-w-sm mx-auto mb-6">
                    {t.bookedSubtitle(prospect.email)}
                  </p>
                  <div className="p-4 bg-[#FAF9F6] border border-[#E6E3DA] max-w-sm mx-auto text-xs font-tech text-left space-y-1 mb-6 text-neutral-700">
                    <div>TID: {selectedDate} ({selectedSlot})</div>
                    <div>STATUS: {aiResult.tier} ({aiResult.score} PTS)</div>
                    <div>FORMAT: {aiResult.recommendedMeetingType}</div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs font-tech uppercase tracking-wider underline text-neutral-600 hover:text-black"
                  >
                    {t.btnReset}
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* ============================================================== */}
      {/* VARIANT B: INDUSTRIAL UTILITY / TEENAGE ENGINEERING            */}
      {/* ============================================================== */}
      {variant === 'b' && (
        <div className="flex-1 bg-[#121316] text-[#E4E4E7] font-tech selection:bg-orange-500 selection:text-black flex flex-col">
          {/* Hardware Header */}
          <header className="border-b border-[#24262E] py-4 px-4 bg-[#17181D]">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-none shadow-[0_0_8px_rgba(255,85,0,0.5)]" style={{ backgroundColor: customAccent }} />
                <span className="text-xs font-bold tracking-widest uppercase text-white">
                  {scannedBrand ? `${scannedBrand.domain.toUpperCase()} // QC-2026` : 'QC-2026 // INDUSTRIAL ENGINE'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  GUUDENGINE_NEURAL: READY
                </span>
                <span className="border border-[#2E313B] px-2 py-0.5 rounded text-[10px] text-neutral-300">
                  LATENCY: ~1.2S
                </span>
              </div>
            </div>
          </header>

          {/* ============================================================== */}
          {/* HIGH-TECH HERO INFO HEADER (What we sell & What we do)         */}
          {/* ============================================================== */}
          <section className="max-w-4xl mx-auto w-full px-4 pt-12 pb-8 text-center">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#1A1C23] border border-[#2B2E38] rounded-full text-xs text-neutral-300 font-mono mb-5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-orange-400 font-bold tracking-wider">{hero.badge}</span>
            </div>

            {/* Main H1 */}
            <h1 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-white mb-4 leading-tight max-w-3xl mx-auto">
              {hero.h1}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base font-sans text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
              {hero.sub}
            </p>

            {/* Hero Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <a
                href="#interactive-demo"
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold text-xs font-sans uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
              >
                <span>{hero.btnDemo}</span>
              </a>
              <Link
                href="/crm"
                className="px-6 py-3 rounded-xl bg-[#1C1E26] hover:bg-[#252834] text-white font-bold text-xs font-sans uppercase tracking-wider border border-[#343846] transition-all flex items-center gap-2"
              >
                <span>{hero.btnCrm}</span>
                <span className="text-xs text-emerald-400 font-mono">LIVE</span>
              </Link>
              <a
                href="#savings-calc"
                className="px-4 py-3 rounded-xl bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white font-mono text-xs transition-all border border-transparent hover:border-neutral-700"
              >
                {hero.btnRoi} &rarr;
              </a>
            </div>

            {/* 4 Superpower Feature Cards (Sleek 2x2 Bento Architecture) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-3xl mx-auto text-left mb-8">
              {hero.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-gradient-to-br from-[#181A22] to-[#121319] border border-[#272B38] hover:border-orange-500/50 transition-all flex items-start gap-3.5 group shadow-md"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#1F222D] border border-[#2F3445] text-orange-400 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-xs font-bold text-white font-sans truncate group-hover:text-orange-400 transition-colors">
                        {feat.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F222C] text-orange-400 border border-[#2F3342] shrink-0 font-medium">
                        {feat.killer}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 4 HUD Telemetry Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border border-[#24262E] bg-[#14151A] p-3 text-xs font-mono rounded-xl">
              {hero.stats.map((st, i) => (
                <div key={i} className="text-center py-1">
                  <span className="text-[10px] text-neutral-500 uppercase block">{st.label}</span>
                  <span className="text-emerald-400 font-bold text-sm">{st.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Machine Header */}
          <section className="max-w-3xl mx-auto w-full px-4 pt-4 pb-4">
            <div className="border border-[#262832] bg-[#16171D] p-4 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded-xl">
              <div>
                <span className="font-bold block mb-0.5" style={{ color: customAccent }}>[SYSTEM: ACTIVE PIPELINE]</span>
                <span className="text-neutral-300 text-sm font-sans font-medium">B2B Qualification & Telemetry Scheduler</span>
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                OVERHEAD: $0.00018 / LEAD &middot; 0% BLOAT
              </div>
            </div>
          </section>

          {/* Main Module */}
          <main id="interactive-demo" className="max-w-2xl mx-auto w-full px-4 pt-2 pb-12 flex-1 flex flex-col justify-center">
            <div className="border-2 border-[#2B2E38] bg-[#181A20] p-6 sm:p-8 shadow-2xl relative">
              {!isQuizDone ? (
                <div>
                  <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#24262E] text-xs text-neutral-400">
                    <span className="font-bold" style={{ color: customAccent }}>
                      STAGE [{currentStep + 1} / {totalQuestions}]
                    </span>
                    <span>CHANNEL: {questions[currentStep].id.toUpperCase()}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-sans font-bold text-white mb-1.5">
                    {questions[currentStep].title}
                  </h3>
                  <p className="text-xs text-neutral-400 mb-6 font-sans">
                    {questions[currentStep].subtitle}
                  </p>

                  <div className="space-y-2">
                    {questions[currentStep].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(questions[currentStep].id, option)}
                        className="w-full text-left p-3.5 bg-[#1F222A] hover:bg-[#282C36] border border-[#2B2E38] hover:border-orange-500 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-neutral-200 group-hover:text-orange-400 font-sans">
                            {option.label}
                          </div>
                          {option.desc && (
                            <div className="text-[11px] text-neutral-400 mt-0.5 font-sans">
                              {option.desc}
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-neutral-500 group-hover:text-white px-2 py-0.5 bg-[#17181D] border border-[#2B2E38]">
                          SEL &gt;
                        </span>
                      </button>
                    ))}
                  </div>

                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="mt-6 text-[11px] text-neutral-500 hover:text-neutral-300"
                    >
                      &lt; PREV_STAGE
                    </button>
                  )}
                </div>
              ) : !aiResult ? (
                <div>
                  <div className="text-xs font-bold mb-2" style={{ color: customAccent }}>[DISPATCH_BUFFER: FULL]</div>
                  <h3 className="text-xl font-sans font-bold text-white mb-2">{t.formTitle}</h3>
                  <p className="text-xs text-neutral-400 mb-6 font-sans">{t.formSubtitle}</p>

                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 uppercase mb-1">{t.fieldName}</label>
                      <input
                        type="text"
                        required
                        value={prospect.name}
                        onChange={e => setProspect(p => ({ ...p, name: e.target.value }))}
                        placeholder="Henrik Holm"
                        className="w-full px-3 py-2.5 bg-[#131418] border border-[#2E313B] text-white text-xs font-tech focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 uppercase mb-1">{t.fieldEmail}</label>
                      <input
                        type="email"
                        required
                        value={prospect.email}
                        onChange={e => setProspect(p => ({ ...p, email: e.target.value }))}
                        placeholder="henrik@firma.dk"
                        className="w-full px-3 py-2.5 bg-[#131418] border border-[#2E313B] text-white text-xs font-tech focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 uppercase mb-1">{t.fieldCompany}</label>
                      <input
                        type="text"
                        value={prospect.company}
                        onChange={e => setProspect(p => ({ ...p, company: e.target.value }))}
                        placeholder="Holm Logistics"
                        className="w-full px-3 py-2.5 bg-[#131418] border border-[#2E313B] text-white text-xs font-tech focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoadingAi}
                      className="w-full py-3.5 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 mt-4 shadow-lg"
                      style={{ backgroundColor: customAccent }}
                    >
                      {isLoadingAi ? t.analyzingText : t.btnSubmit}
                    </button>
                  </form>
                </div>
              ) : !isBooked ? (
                <div>
                  {/* Machine HUD Score */}
                  <div className="border border-[#343844] bg-[#14151A] p-4 mb-6">
                    <div className="flex items-center justify-between pb-3 border-b border-[#24262E]">
                      <div>
                        <span className="text-[10px] block font-bold" style={{ color: customAccent }}>MATCH_VERIFICATION</span>
                        <h4 className="text-base font-bold text-white font-sans">{aiResult.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black" style={{ color: customAccent }}>{aiResult.score}</span>
                        <span className="text-xs text-neutral-500"> / 100</span>
                      </div>
                    </div>

                    <div className="pt-3 text-xs text-neutral-300 font-sans leading-relaxed">
                      <p className="text-neutral-200">{aiResult.summary}</p>
                      <div className="mt-2 text-[11px] font-tech" style={{ color: customAccent }}>
                        ROUTED_TO: {aiResult.recommendedMeetingType}
                      </div>
                    </div>
                  </div>

                  {/* Calendar Matrix */}
                  <div className="text-xs text-neutral-400 uppercase tracking-wider mb-2">{t.calendarTitle}</div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {['I morgen, 4. nov', 'Fredag, 5. nov', 'Mandag, 8. nov'].map((day, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        className={`p-2 border text-xs text-center transition-colors ${
                          selectedDate === day
                            ? 'bg-orange-500 text-neutral-950 border-orange-500 font-bold'
                            : 'bg-[#1C1F27] border-[#2A2E38] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                    {TIME_SLOTS.map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 border text-xs transition-colors ${
                          selectedSlot === slot
                            ? 'border-orange-500 bg-[#242732] text-orange-400 font-bold'
                            : 'border-[#2A2E38] bg-[#14151A] text-neutral-400 hover:border-neutral-500'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsBooked(true)}
                    className="w-full py-3.5 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all"
                    style={{ backgroundColor: customAccent }}
                  >
                    {t.btnBook(selectedDate, selectedSlot)}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-orange-500/10 border border-orange-500 text-orange-500 flex items-center justify-center text-xl mx-auto mb-3 font-bold">
                    OK
                  </div>
                  <h3 className="text-xl font-sans font-bold text-white mb-2">{t.bookedTitle}</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4 font-sans">
                    {t.bookedSubtitle(prospect.email)}
                  </p>
                  <div className="p-3 bg-[#131418] border border-[#2B2E38] max-w-sm mx-auto text-xs text-left space-y-1 mb-6 text-neutral-300">
                    <div>TIME: {selectedDate} ({selectedSlot})</div>
                    <div>CONFIDENCE: {aiResult.score} PTS // {aiResult.tier}</div>
                    <div>ROUTING: {aiResult.recommendedMeetingType}</div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs uppercase tracking-wider text-orange-400 hover:underline"
                  >
                    {t.btnReset}
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* ============================================================== */}
      {/* GUUD AI AUTONOMOUS AGENT INTELLIGENCE SHOWCASE                 */}
      {/* ============================================================== */}
      <section className="bg-neutral-950 border-t border-neutral-800 py-16 px-4 text-neutral-100 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1C23] border border-[#2B2E38] rounded-full text-xs font-mono text-neutral-300 mb-3 shadow-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-400 font-bold">{guudAi.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
              {guudAi.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              {guudAi.subtitle}
            </p>
          </div>

          {/* 4 Step Pipeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {guudAi.steps.map((st, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/40">
                      FASE {st.step}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase">
                      {st.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Live Autonomous Battlecard Preview */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-neutral-800 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-neutral-950 font-black text-lg">
                  📎
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>GuudCRM Executive Battlecard</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Auto-Genereret til Sælger
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">Modtager: Thomas Bruce (Sales Lead) &middot; Lead: Nordic Scale Media</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400 block">Kvalifikations-Score: 94/100</span>
                <span className="text-[10px] font-mono text-neutral-500">BANT Status: VIP High-Priority</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase block mb-1">Affaldet Tech-Stack:</span>
                <div className="text-neutral-300 font-sans space-y-0.5">
                  <div>&bull; ScoreApp Pro ($129/mdr)</div>
                  <div>&bull; Calendly 4 seats ($64/mdr)</div>
                  <div>&bull; HubSpot Sales Hub ($500/mdr)</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase block mb-1">Økonomisk Besparelse:</span>
                <div className="text-emerald-400 font-bold text-base font-sans mt-0.5">
                  52.400 kr. / år
                </div>
                <div className="text-[10px] text-neutral-500 mt-1 font-sans">
                  Ved skift til GuudCal Agency Pro
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase block mb-1">Anbefalet Pitch & Åbner:</span>
                <div className="text-neutral-300 font-sans text-[11px] leading-relaxed">
                  »Spørg Lars ind til sælgernes tidsforbrug på manuelle noter i HubSpot og præsenter CloudTalk webhooken.«
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* COMPARISON MATRIX (Old SaaS vs. GuudCal & GuudCRM)             */}
      {/* ============================================================== */}
      <section className="bg-neutral-900 border-t border-neutral-800 py-16 px-4 text-neutral-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-medium text-orange-400 uppercase tracking-widest block mb-2">
              [DIREKTE SAMMENLIGNING]
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Den Gamle SaaS-Stak vs. GuudCal & GuudCRM
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
              Hvorfor betale 4-cifrede beløb til amerikanske SaaS-giganter for værktøjer, der ikke taler sammen?
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-800 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 font-mono text-[11px] text-neutral-400">
                  <th className="py-3.5 px-4 bg-neutral-950">Funktion & Egenskab</th>
                  <th className="py-3.5 px-4 text-red-400 bg-red-950/20">Gammel SaaS Model (ScoreApp + Calendly + HubSpot)</th>
                  <th className="py-3.5 px-4 text-emerald-400 bg-emerald-950/30">GuudCal & GuudCRM Matrix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 font-sans">
                <tr>
                  <td className="py-3 px-4 font-bold text-white bg-neutral-950/60">Månedlig Softwareudgift</td>
                  <td className="py-3 px-4 text-neutral-400 bg-red-950/10">4.500 – 6.000 kr. / mdr. (stiger pr. bruger)</td>
                  <td className="py-3 px-4 text-emerald-300 font-bold bg-emerald-950/20">399 kr. / mdr. (eller 0 kr. for evigt med BYOK)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white bg-neutral-950/60">Lead-Kvalificering & Kalender</td>
                  <td className="py-3 px-4 text-neutral-400 bg-red-950/10">Adskilte apps; kunden videresendes til Calendly link</td>
                  <td className="py-3 px-4 text-emerald-300 font-bold bg-emerald-950/20">2-i-1 integreret flade (0% drop-off rate)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white bg-neutral-950/60">Autonom Forberedelse</td>
                  <td className="py-3 px-4 text-neutral-400 bg-red-950/10">Ingen (sælgeren googler kunden manuelt i 20 min)</td>
                  <td className="py-3 px-4 text-emerald-300 font-bold bg-emerald-950/20">GuudEngine scanner automatisk tech-stack & CVR</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white bg-neutral-950/60">Opkaldsnotater efter samtalen</td>
                  <td className="py-3 px-4 text-neutral-400 bg-red-950/10">Manuel notetagning i HubSpot af sælgeren</td>
                  <td className="py-3 px-4 text-emerald-300 font-bold bg-emerald-950/20">Zero-Click AI resumé & færdig opfølgningsmail</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white bg-neutral-950/60">SMS-Påmindelser (No-Show Værn)</td>
                  <td className="py-3 px-4 text-neutral-400 bg-red-950/10">Kræver dyre Zapier + Twilio integrationer</td>
                  <td className="py-3 px-4 text-emerald-300 font-bold bg-emerald-950/20">Direkte indbygget (op til 250 SMS/mdr. inkluderet)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-white bg-neutral-950/60">Branding & Domæne</td>
                  <td className="py-3 px-4 text-neutral-400 bg-red-950/10">ScoreApp & Calendly logoer overalt</td>
                  <td className="py-3 px-4 text-emerald-300 font-bold bg-emerald-950/20">100% White-Label på eget domæne</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE SAVINGS CALCULATOR (Side-by-side with ScoreApp)    */}
      {/* ============================================================== */}
      <section id="savings-calc" className="bg-neutral-900 border-t border-neutral-800 py-12 px-4 text-neutral-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-widest block mb-2">
              ROI & Besparelses-Beregner
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              {t.savingsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
              {t.savingsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-2xl">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-neutral-400">{t.usersLabel}</span>
                  <span className="text-emerald-400 font-bold">{teamSize} konsulenter</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={teamSize}
                  onChange={e => setTeamSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-neutral-400">{t.leadsLabel}</span>
                  <span className="text-emerald-400 font-bold">{monthlyLeads} leads/mdr.</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={monthlyLeads}
                  onChange={e => setMonthlyLeads(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-500 font-mono space-y-1">
                <div>&bull; ScoreApp: 895 kr./mdr. ($129) fast licens</div>
                <div>&bull; Calendly Teams: 110 kr./mdr. ($16) pr. konsulent</div>
                <div>&bull; GuudCal: 0 kr./mdr. + under 0,002 kr. pr. GuudEngine evaluering</div>
              </div>
            </div>

            {/* The Printed Invoice / Savings Box */}
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl relative overflow-hidden">
              <div className="text-xs uppercase tracking-wider font-mono text-neutral-400 pb-3 mb-4 border-b border-neutral-800 flex justify-between">
                <span>ÅRLIGT REGNESTYKKE</span>
                <span className="text-red-400">GAMMEL SAAS-MODEL</span>
              </div>

              <div className="space-y-2 text-xs font-mono mb-6">
                <div className="flex justify-between text-neutral-400">
                  <span>ScoreApp (12 mdr):</span>
                  <span>10.740 kr.</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Calendly ({teamSize} pers &times; 12 mdr):</span>
                  <span>{(calendlyPerUserMonthly * teamSize * 12).toLocaleString('da-DK')} kr.</span>
                </div>
                <div className="flex justify-between font-bold text-red-400 pt-2 border-t border-neutral-800">
                  <span>{t.totalOldCost}</span>
                  <span>{oldAnnualSpend.toLocaleString('da-DK')} kr. / år</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center">
                <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
                  {t.netSavings}
                </div>
                <div className="text-3xl font-black text-emerald-300 tracking-tight">
                  {annualSavings.toLocaleString('da-DK')} kr.
                </div>
                <div className="text-[11px] text-emerald-500/80 mt-1 font-mono">
                  Direkte overskud på bundlinjen hvert evig eneste år
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* TRANSPARENT PRICING SECTION (Interactive Module Selector)      */}
      {/* ============================================================== */}
      <section id="pricing" className="bg-neutral-950 border-t border-neutral-800 py-16 px-4 text-neutral-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-widest block mb-2">
              [TRANSPARENT ANTI-SAAS PRISMODEL]
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3">
              Vælg Modul eller Spar 43% med GuudSuite
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Kør kalendersystemet og CRM-modulet individuelt, eller saml det hele for en brøkdel af prisen hos HubSpot og ScoreApp.
            </p>
          </div>

          {/* Interactive Pricing Tab Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 p-1.5 bg-neutral-900/80 border border-neutral-800 rounded-2xl max-w-2xl mx-auto">
            <button
              onClick={() => setPricingTab('suite')}
              className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                pricingTab === 'suite'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 shadow-lg shadow-emerald-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>👑</span>
              <span>GuudSuite (Samlerabat)</span>
            </button>
            <button
              onClick={() => setPricingTab('cal')}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                pricingTab === 'cal'
                  ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>📅</span>
              <span>Kun GuudCal</span>
            </button>
            <button
              onClick={() => setPricingTab('crm')}
              className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold font-sans uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                pricingTab === 'crm'
                  ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>📞</span>
              <span>Kun GuudCRM</span>
            </button>
          </div>

          {/* Value Notification Banner */}
          <div className="mb-10 p-3.5 rounded-xl border text-center text-xs font-mono max-w-2xl mx-auto transition-all bg-neutral-900/60 border-neutral-800">
            {pricingTab === 'suite' && (
              <span className="text-emerald-300">
                ⚡ <strong>Samlerabat Aktiv:</strong> Få BÅDE GuudCal og GuudCRM for kun 399 kr./mdr. (Normalpris 698 kr. ved separat køb) &middot; <strong className="text-white">Spar 43% hver måned!</strong>
              </span>
            )}
            {pricingTab === 'cal' && (
              <span className="text-cyan-300">
                💡 <strong>Ekstra værdi:</strong> Få også B2B CRM og CloudTalk AI-opkaldsnotater med for kun 50 kr. ekstra ved at vælge <strong>GuudSuite</strong>!
              </span>
            )}
            {pricingTab === 'crm' && (
              <span className="text-orange-300">
                💡 <strong>Ekstra værdi:</strong> Få også 2-i-1 AI Lead Scorecard og Kalenderbooking med for kun 50 kr. ekstra ved at vælge <strong>GuudSuite</strong>!
              </span>
            )}
          </div>

          {/* 3 Dynamic Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Cloud Solo */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                  {pricingTab === 'suite' ? '1 DOMÆNE · BEGGE SYSTEMER' : pricingTab === 'cal' ? '1 DOMÆNE · KUN KALENDER' : '1-3 SÆLGERE · KUN CRM'}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  {pricingTab === 'suite' ? 'GuudSuite Solo' : pricingTab === 'cal' ? 'GuudCal Solo' : 'GuudCRM Solo'}
                </h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl font-black text-white tracking-tight">
                    {pricingTab === 'suite' ? '299 kr.' : '199 kr.'}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">pr. måned</span>
                </div>
                <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                  <span>📱 {pricingTab === 'crm' ? '250 AI Opkaldsnotater/mdr.' : 'Inkluderer 50 SMS/mdr.'}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-300 font-sans mb-6">
                  {pricingTab === 'suite' && (
                    <>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Både GuudCal & GuudCRM samlet</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>1 aktivt website / klient-domæne</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>50 SMS påmindelser / mdr. (0% no-shows)</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>B2B Kanban Pipeline & CloudTalk Bridge</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Auto-Brand Website Scanner</span></li>
                    </>
                  )}
                  {pricingTab === 'cal' && (
                    <>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>1 aktivt website / domæne</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>2-i-1 AI Lead Scorecard & Kalender</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>50 SMS påmindelser / mdr.</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Auto-Brand Website Scanner</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Google & Outlook 2-vejs synk</span></li>
                    </>
                  )}
                  {pricingTab === 'crm' && (
                    <>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>1-3 sælgere i teamet</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>B2B Sales Pipeline & Kanban</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>CloudTalk & Aircall Webhook Bridge</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Automatiske AI-opkaldsnotater</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Klar opfølgningsmail på 1.5 sek.</span></li>
                    </>
                  )}
                </ul>
              </div>

              <button
                onClick={() => handleCheckout('solo')}
                disabled={checkoutLoading === 'solo'}
                className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all border border-neutral-700 text-center flex items-center justify-center gap-2"
              >
                {checkoutLoading === 'solo' ? (
                  <span>Opretter betaling...</span>
                ) : (
                  <span>Vælg Solo Plan &rarr;</span>
                )}
              </button>
            </div>

            {/* Card 2: Agency Pro (Highlighted with Bundle Savings) */}
            <div className={`p-6 rounded-2xl flex flex-col justify-between relative shadow-xl transition-all ${
              pricingTab === 'suite'
                ? 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-2 border-emerald-500 shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                : 'bg-neutral-900/80 border border-neutral-700 hover:border-neutral-600'
            }`}>
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-neutral-950 font-bold text-[9px] uppercase tracking-wider font-mono">
                {pricingTab === 'suite' ? 'MEST POPULÆRE · SPAR 43%' : 'PRO MODEL'}
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                  {pricingTab === 'suite' ? '10 DOMÆNER & FULD SUITE' : pricingTab === 'cal' ? '10 DOMÆNER & WHITE-LABEL' : 'UBEGRÆNSEDE SÆLGERE'}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  {pricingTab === 'suite' ? 'GuudSuite Agency Pro' : pricingTab === 'cal' ? 'GuudCal Agency Pro' : 'GuudCRM Pro'}
                </h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl font-black text-emerald-400 tracking-tight">
                    {pricingTab === 'suite' ? '399 kr.' : '349 kr.'}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">pr. måned</span>
                </div>
                <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                  <span>📱 {pricingTab === 'suite' ? 'Inkluderer 250 SMS/mdr. + CRM' : pricingTab === 'cal' ? 'Inkluderer 150 SMS/mdr.' : 'Ubegrænsede Sælgere & Noter'}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-300 font-sans mb-6">
                  {pricingTab === 'suite' && (
                    <>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span><strong>Fuld GuudCal + Fuld GuudCRM</strong></span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Op til <strong>10 klient-domæner</strong></span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span><strong>250 SMS påmindelser / mdr.</strong></span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span><strong>Ubegrænsede sælgere</strong> i teamet</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>100% White-Label på eget domæne</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>CloudTalk & Aircall AI opkaldsnotater</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Guud AI Salgsdossier før hvert møde</span></li>
                    </>
                  )}
                  {pricingTab === 'cal' && (
                    <>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Op til 10 klient-domæner</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>150 SMS påmindelser / mdr.</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>100% White-Label (Fjern vandmærke)</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Ubegrænsede quiz-evalueringer</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Embed-script til WordPress & Shopify</span></li>
                    </>
                  )}
                  {pricingTab === 'crm' && (
                    <>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Ubegrænsede sælgere i virksomheden</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Ubegrænsede AI-opkaldsanalyser</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>CloudTalk, Aircall & Zoom telefoni</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>BANT Lead-Scoring & Salgsdrejebog</span></li>
                      <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold mt-0.5">✓</span><span>Prioriteret VIP support</span></li>
                    </>
                  )}
                </ul>
              </div>

              <button
                onClick={() => handleCheckout('agency')}
                disabled={checkoutLoading === 'agency'}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all hover:brightness-110 disabled:opacity-50 shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center gap-2"
              >
                {checkoutLoading === 'agency' ? (
                  <span>Opretter betaling...</span>
                ) : (
                  <span>Vælg Pro Plan &rarr;</span>
                )}
              </button>
            </div>

            {/* Card 3: Lifetime Agency BYOK */}
            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-amber-500/40 flex flex-col justify-between hover:border-amber-500/70 transition-colors relative shadow-lg">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[9px] uppercase tracking-wider">
                BYOK MODEL
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  BRING YOUR OWN KEY
                </span>
                <h3 className="text-lg font-bold text-white mb-2">
                  {pricingTab === 'suite' ? '👑 Lifetime GuudSuite' : pricingTab === 'cal' ? '👑 Lifetime GuudCal' : '👑 Lifetime GuudCRM'}
                </h3>
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl font-black text-amber-300 tracking-tight">
                    {pricingTab === 'suite' ? '7.999 kr.' : '4.999 kr.'}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">/ éngangsbetaling</span>
                </div>
                <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono">
                  <span>⚡ 0 kr. i månedlige gebyrer for altid</span>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-300 font-sans mb-6">
                  {pricingTab === 'suite' && (
                    <>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span><strong>Evig adgang til BÅDE GuudCal & GuudCRM</strong></span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>Op til 10 klient-domæner & White-Label</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>Ubegrænsede sælgere i teamet for altid</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>Brug egen API-nøgle (0 kr. løbende AI-udgift)</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>Fuld GDPR datasuverænitet i eget hus</span></li>
                    </>
                  )}
                  {pricingTab === 'cal' && (
                    <>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>Evig adgang til GuudCal (Scorecard & Booking)</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>Op til 10 klient-domæner</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>100% White-Label på eget domæne</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>0 kr. i månedlige softwaregebyrer</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>Alle fremtidige opdateringer inkluderet</span></li>
                    </>
                  )}
                  {pricingTab === 'crm' && (
                    <>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>Evig adgang til GuudCRM</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>Ubegrænsede sælgere for evigt</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>CloudTalk & Aircall telefoni webhook</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>0 kr. i månedlige abonnementer</span></li>
                      <li className="flex items-start gap-2"><span className="text-amber-400 font-bold mt-0.5">✓</span><span>Komplet lokal datasikkerhed</span></li>
                    </>
                  )}
                </ul>
              </div>

              <button
                onClick={() => handleCheckout('lifetime')}
                disabled={checkoutLoading === 'lifetime'}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all text-center shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {checkoutLoading === 'lifetime' ? (
                  <span>Opretter betaling...</span>
                ) : (
                  <span>Vælg Lifetime Plan &rarr;</span>
                )}
              </button>
            </div>
          </div>

          {/* HubSpot & Anti-SaaS Guarantee Callout */}
          <div className="mt-10 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-center space-y-2 max-w-3xl mx-auto">
            <div className="text-xs font-mono text-neutral-300">
              💡 <strong>Sammenlign med alternativerne:</strong> HubSpot Sales Hub koster <strong className="text-red-400">4.000 kr./mdr.</strong> for 5 sælgere + <strong className="text-red-400">10.500 kr. i tvungent opstartsgebyr</strong>. Med GuudSuite sparer du over <strong>70.000 kr. det første år</strong>!
            </div>
            <div className="text-[11px] text-neutral-500 font-mono">
              🔒 14 dages fuld tilfredshedsgaranti &middot; 0 kr. oprettelse &middot; Ingen binding
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* VERIFIED CUSTOMER CASE STUDIES & SOCIAL PROOF                  */}
      {/* ============================================================== */}
      <section className="bg-neutral-900 border-t border-neutral-800 py-16 px-4 text-neutral-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-widest block mb-2">
              [BEKRÆFTEDE RESULTATER]
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Hvad B2B Ledere Oplever Efter Skiftet
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
              Fra fragmenterede software-udgifter til ét samlet, lynhurtigt salgshjul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                ★★★★★
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed italic">
                »Vi brugte før over 4.500 kr. om måneden på ScoreApp og Calendly til vores fire konsulenter. Med GuudCal har vi skåret omkostningen ned til 399 kr., og vores sælgere møder op med færdige salgs-briefs på hver eneste kunde. Det har sparet os for 50 timer om måneden.«
              </p>
              <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Lars Lind</div>
                  <div className="text-[11px] text-neutral-500 font-mono">Managing Director, Nordic Scale Media</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  Sparer 49.000 kr./år
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                ★★★★★
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed italic">
                »Vores største frustration førhen var, at 30% af vores bookede møder aldrig dukkede op, eller ikke havde budget. Med GuudCals AI-screening sorteres de useriøse fra, og de automatiske SMS påmindelser har hævet vores fremmøde til 98%.«
              </p>
              <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Sofie Møller</div>
                  <div className="text-[11px] text-neutral-500 font-mono">Head of Growth, København Web Bureau</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  98% Fremmøderate
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE SEO FAQ ACCORDION                                  */}
      {/* ============================================================== */}
      <section className="bg-neutral-950 border-t border-neutral-800 py-16 px-4 text-neutral-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-widest block mb-2">
              [OFTE STILLEDE SPØRGSMÅL]
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Alt du behøver at vide om GuudCal
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
              Gennemskuelige svar om migration, white-labeling, GuudEngine AI og besparelser.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-neutral-900/60 border border-neutral-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-900/90 transition-colors"
                >
                  <span className="font-bold text-xs sm:text-sm text-white">
                    {faq.q}
                  </span>
                  <span className="text-neutral-500 font-mono text-sm">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-neutral-400 leading-relaxed font-sans border-t border-neutral-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FINAL HIGH-CONVERTING CLOSING HERO BANNER                      */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-black border-t border-neutral-800 py-20 px-4 text-center text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-mono text-emerald-400">
            <span>⚡ Få dit eget 2-i-1 system live i dag</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Klar til at eliminere dyre SaaS-abonnementer og fordoble dine salgsmøder?
          </h2>

          <p className="text-xs sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Slut dig til 120+ virksomheder der har udskiftet ScoreApp og Calendly. Vælg fleksibel månedlig cloud eller lås en evig Lifetime BYOK licens i dag.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#interactive-demo"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:brightness-110 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/20"
            >
              Start Interaktiv Test &rarr;
            </a>
            <Link
              href="/crm"
              className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider border border-neutral-700 transition-all"
            >
              Se GuudCRM & Opkaldsmodul
            </Link>
          </div>

          <div className="text-[11px] text-neutral-500 font-mono pt-4">
            🔒 14 dages fuld tilfredshedsgaranti &middot; 0 kr. oprettelse &middot; Ingen binding
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 px-4 bg-black text-neutral-400 text-xs font-sans">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-white tracking-tight text-sm">GuudCal</span>
            <span className="text-neutral-600">&middot;</span>
            <span className="text-neutral-400">
              En del af{' '}
              <a
                href="https://guud.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-emerald-400 font-bold transition-colors underline underline-offset-4"
              >
                guud.pro
              </a>{' '}
              økosystemet
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-neutral-500 font-mono">
            <Link href="/crm" className="hover:text-neutral-300 transition-colors">
              GuudCRM
            </Link>
            <a
              href="https://projekter.guud.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              Projekter
            </a>
            <span className="text-neutral-700">&middot;</span>
            <span>&copy; 2026 Bruce Ventures</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
