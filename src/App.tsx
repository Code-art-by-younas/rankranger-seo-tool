import { useState, useEffect, useRef } from "react";

interface SEOMetrics {
  url: string;
  seoScore: number;
  metaTitle: string;
  metaDescription: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  missingAltTags: Array<{ src: string; location: string }>;
  issues: Array<{
    type: "critical" | "warning" | "info";
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low";
  }>;
  mobileFriendly: {
    score: number;
    issues: string[];
  };
  pageSpeed: {
    score: number;
    metrics: Array<{ label: string; value: string; status: "good" | "needs-improvement" | "poor" }>;
  };
  keywords: Array<{ keyword: string; density: number; recommendations: string }>;
  backlinks: number;
  domainAuthority: number;
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
}

const generateMockReport = (url: string): SEOMetrics => {
  const domain = url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const isEcommerce = domain.includes("shop") || domain.includes("store") || Math.random() > 0.5;
  const isBlog = domain.includes("blog") || domain.includes("medium") || Math.random() > 0.6;
  
  const baseScore = 65 + Math.floor(Math.random() * 25);
  const scoreVariation = isEcommerce ? -5 : isBlog ? 3 : 0;
  
  return {
    url,
    seoScore: Math.min(95, Math.max(42, baseScore + scoreVariation)),
    metaTitle: isEcommerce 
      ? `${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)} — Premium Products Online | Free Shipping`
      : isBlog
      ? `Insights & Strategies from ${domain.split('.')[0]} | Marketing Blog`
      : `Welcome to ${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)} | Leading Industry Solutions`,
    metaDescription: isEcommerce
      ? `Shop the latest collection at ${domain}. Over 10,000 products with free shipping & 30-day returns. Trusted by 50,000+ customers worldwide.`
      : isBlog
      ? `Expert marketing insights, SEO strategies, and growth tactics from industry professionals. Join 25,000+ readers building better businesses.`
      : `We help businesses grow with data-driven digital solutions. ${domain} delivers measurable results in SEO, PPC, and content marketing since 2018.`,
    headings: {
      h1: isEcommerce 
        ? ["New Season Collection", "Best Sellers This Week"] 
        : isBlog
        ? ["10 SEO Mistakes That Are Killing Your Traffic (2025)"]
        : ["Transform Your Digital Presence With AI-Powered SEO"],
      h2: isEcommerce
        ? ["Featured Categories", "Customer Favorites", "Sustainable Fashion", "Shop by Purpose"]
        : isBlog
        ? ["Why Most SEO Audits Fail", "The Traffic Recovery Framework", "Tools We Actually Use", "Case Study Results"]
        : ["Proven Results", "Our Methodology", "Services", "Client Success Stories"],
      h3: isEcommerce
        ? ["Women's Wear", "Men's Essentials", "Accessories", "New Arrivals", "Sale Items", "Lookbooks"]
        : isBlog
        ? ["Technical Foundation", "Content Strategy", "Link Building Remastered", "Measurement That Matters"]
        : ["Technical SEO", "Content Strategy", "Digital PR", "Conversion Optimization"],
    },
    missingAltTags: [
      { src: "/images/hero-banner.jpg", location: "Above the fold, main header" },
      { src: "/images/team-photo.webp", location: "About section" },
      ...(Math.random() > 0.5 ? [{ src: "/images/product-carousel-3.png", location: "Featured products grid" }] : []),
      ...(Math.random() > 0.7 ? [{ src: "/assets/blog-thumbnail.jpg", location: "Related articles" }] : []),
    ],
    issues: [
      {
        type: "critical",
        title: "Meta description too long",
        description: "164 characters (recommended 150-160). May get truncated in SERPs.",
        impact: "High",
      },
      {
        type: "warning",
        title: "Missing schema markup",
        description: "No structured data detected for products/organization. Missing rich snippet opportunities.",
        impact: "Medium",
      },
      {
        type: "warning",
        title: "Render-blocking resources",
        description: "3 CSS files blocking first paint. Consider inlining critical CSS.",
        impact: "Medium",
      },
      {
        type: "info",
        title: "Image compression opportunities",
        description: "4 images could save 340KB with modern formats (AVIF/WebP).",
        impact: "Low",
      },
      {
        type: "critical",
        title: "H1 tag hierarchy",
        description: isEcommerce ? "Multiple H1 tags detected (2). Should have only one main heading." : "No H1 tag found on homepage. Add descriptive primary heading.",
        impact: "High",
      },
    ],
    mobileFriendly: {
      score: 72 + Math.floor(Math.random() * 20),
      issues: [
        "Tap targets too close (8 elements)",
        "Content wider than viewport on 3 sections",
        "Font size below 16px on body text",
      ],
    },
    pageSpeed: {
      score: 58 + Math.floor(Math.random() * 30),
      metrics: [
        { label: "Largest Contentful Paint", value: "3.2s", status: "needs-improvement" },
        { label: "First Input Delay", value: "45ms", status: "good" },
        { label: "Cumulative Layout Shift", value: "0.14", status: "needs-improvement" },
        { label: "Time to Interactive", value: "4.8s", status: "poor" },
        { label: "Total Blocking Time", value: "680ms", status: "needs-improvement" },
      ],
    },
    keywords: [
      { 
        keyword: isEcommerce ? "sustainable fashion" : isBlog ? "seo audit" : "digital marketing agency", 
        density: 2.4, 
        recommendations: "Perfect density. Add to 2-3 more subheadings for topical authority." 
      },
      { 
        keyword: isEcommerce ? "organic cotton" : isBlog ? "technical seo" : "growth marketing", 
        density: 1.1, 
        recommendations: "Under-utilized. Include in meta description and first 100 words." 
      },
      { 
        keyword: isEcommerce ? "ethical clothing" : isBlog ? "content strategy" : "conversion rate optimization", 
        density: 0.7, 
        recommendations: "Create dedicated pillar content targeting this keyword cluster." 
      },
    ],
    backlinks: 1240 + Math.floor(Math.random() * 800),
    domainAuthority: 42 + Math.floor(Math.random() * 28),
    wordCount: isBlog ? 2847 : isEcommerce ? 945 : 1632,
    internalLinks: 47 + Math.floor(Math.random() * 35),
    externalLinks: 12 + Math.floor(Math.random() * 18),
  };
};

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [report, setReport] = useState<SEOMetrics | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showFullReport, setShowFullReport] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = "https://" + normalizedUrl;
    }
    setUrl(normalizedUrl);

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setReport(null);
    setShowFullReport(false);

    // Simulate realistic analysis progress
    const steps = [
      { progress: 15, message: "Fetching page content..." },
      { progress: 28, message: "Analyzing HTML structure..." },
      { progress: 42, message: "Checking metadata & headings..." },
      { progress: 58, message: "Auditing images & assets..." },
      { progress: 73, message: "Evaluating performance metrics..." },
      { progress: 86, message: "Generating recommendations..." },
      { progress: 100, message: "Finalizing report..." },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 450 + Math.random() * 300));
      setAnalysisProgress(step.progress);
    }

    await new Promise(resolve => setTimeout(resolve, 400));
    const mockReport = generateMockReport(normalizedUrl);
    setReport(mockReport);
    setIsAnalyzing(false);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const exportAsPDF = () => {
    window.print();
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  const getStatusChip = (status: string) => {
    const base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium";
    if (status === "good") return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800`;
    if (status === "needs-improvement") return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800`;
    return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-800`;
  };

  return (
    <div className="min-h-screen bg-[#FCFCFF] text-zinc-900 antialiased dark:bg-[#09090B] dark:text-zinc-100 [font-family:'Outfit',system-ui,-apple-system,sans-serif]">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        * { font-variant-ligatures: common-ligatures; }
        h1, h2, h3, .display { font-family: 'Space Grotesk', 'Outfit', system-ui, sans-serif; letter-spacing: -0.02em; }
      `}</style>

      {/* NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-[14px] bg-emerald-500/20 blur-xl" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/25">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M3 13L9 7L13 11L21 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 17V21H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="display text-[22px] font-semibold leading-none tracking-tight">RankRanger</h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">SEO Audit Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1.5 text-[11px] font-medium text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800 md:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              LIVE ANALYTICS
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-[12px] border border-zinc-200 bg-white text-zinc-700 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_1px_2px_-1px_rgba(0,0,0,0.06)] transition-all hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 pb-24 pt-8 md:px-8 md:pt-12">
        {/* HERO / INPUT SECTION */}
        <section className="mb-12 md:mb-16">
          <div className="relative overflow-hidden rounded-[28px] border border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50/50 p-[1px] shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_20px_60px_-12px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:from-zinc-900/90 dark:to-zinc-950/90">
            <div className="relative rounded-[27px] bg-white p-7 md:p-10 dark:bg-zinc-950">
              {/* Decorative grid */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:36px_36px] opacity-[0.08] dark:bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)]" />
                <div className="absolute right-0 top-0 h-[240px] w-[420px] rounded-bl-[100px] bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-[280px] w-[280px] rounded-full bg-emerald-500/10 blur-[120px]" />
              </div>

              <div className="relative">
                <div className="mb-7 flex flex-wrap items-start justify-between gap-4 md:mb-9">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Free SEO Audit • No Card Required
                    </div>
                    <h2 className="display max-w-[640px] text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[44px]">
                      Uncover ranking opportunities in
                      <span className="text-[#0FA561] dark:text-emerald-400"> 60 seconds.</span>
                    </h2>
                  </div>
                  <div className="hidden items-center gap-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-2.5 text-[12px] font-medium text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 md:flex">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                      <path d="M12 2L13.5 8.5H20L14.75 12.5L16.25 19L12 14.5L7.75 19L9.25 12.5L4 8.5H10.5L12 2Z" fill="currentColor"/>
                    </svg>
                    Trusted by 12,400+ marketers
                  </div>
                </div>

                <form onSubmit={handleAnalyze} className="relative">
                  <div className="group relative flex flex-col gap-3.5 rounded-[22px] border border-zinc-200 bg-zinc-50/60 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] transition-all focus-within:border-emerald-500/50 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] dark:border-zinc-800 dark:bg-zinc-900/70 dark:focus-within:bg-zinc-900 md:flex-row md:items-center md:gap-0 md:p-[10px]">
                    <div className="relative flex-1">
                      <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-zinc-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="yourdomain.com or paste any URL"
                        className="h-[56px] w-full rounded-[16px] border-0 bg-transparent pl-12 pr-4 text-[17px] font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-0 dark:placeholder:text-zinc-500"
                        required
                        spellCheck={false}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isAnalyzing || !url.trim()}
                      className="cursor-pointer group/btn relative isolate flex h-[56px] items-center justify-center gap-2.5 overflow-hidden rounded-[16px] bg-[#0FA561] px-8 text-[16px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(15,165,97,0.45),inset_0_1px_0_0_rgba(255,255,255,0.25)] transition-all hover:bg-[#0C8E56] disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:px-9"
                    >
                      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/20 to-transparent opacity-0 transition-opacity group-hover/btn:opacity-100" />
                      {isAnalyzing ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-[2.5px] border-white/30 border-t-white" />
                          Auditing...
                        </>
                      ) : (
                        <>
                          Run Audit
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover/btn:translate-x-0.5">
                            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[12.5px] text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span className="text-zinc-900 dark:text-zinc-100">Try:</span>
                      <button type="button" onClick={() => setUrl("shopify.com")} className="cursor-pointer rounded-full border border-zinc-200 bg-white px-2.5 py-1 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">shopify.com</button>
                      <button type="button" onClick={() => setUrl("ahrefs.com")} className="cursor-pointer rounded-full border border-zinc-200 bg-white px-2.5 py-1 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">ahrefs.com</button>
                      <button type="button" onClick={() => setUrl("notion.so")} className="cursor-pointer rounded-full border border-zinc-200 bg-white px-2.5 py-1 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">notion.so</button>
                    </span>
                    <span className="hidden h-[14px] w-px bg-zinc-300 dark:bg-zinc-700 md:block" />
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      100% private • No data stored
                    </span>
                  </div>
                </form>

                {/* ANALYSIS PROGRESS */}
                {isAnalyzing && (
                  <div className="mt-8 rounded-[20px] border border-emerald-200/60 bg-emerald-50/80 p-5 backdrop-blur dark:border-emerald-900/50 dark:bg-emerald-950/30">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9">
                          <div className="absolute inset-0 rounded-full border-[3px] border-emerald-200 dark:border-emerald-900" />
                          <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500 border-t-transparent animate-spin" />
                          <div className="absolute inset-[6px] rounded-full bg-emerald-500/15" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-emerald-900 dark:text-emerald-100">Analyzing {url.replace(/^https?:\/\//, "").split("/")[0]}</p>
                          <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">Crawling pages • Extracting markup • Evaluating signals</p>
                        </div>
                      </div>
                      <span className="font-mono text-[12px] font-semibold tabular-nums text-emerald-700 dark:text-emerald-300">{analysisProgress}%</span>
                    </div>
                    <div className="h-[8px] overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${analysisProgress}%`, backgroundSize: '200% 100%' }}
                      />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-medium text-emerald-800/80 dark:text-emerald-200/80 md:grid-cols-4">
                      <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-600" />Meta tags</span>
                      <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-600" />Headings</span>
                      <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-600" />Core Web Vitals</span>
                      <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-600" />Backlinks</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS DASHBOARD */}
        {report && (
          <section ref={resultsRef} className="space-y-7">
            {/* SUMMARY CARDS */}
            <div className="grid gap-[18px] md:grid-cols-12">
              {/* SEO SCORE */}
              <div className="md:col-span-4">
                <div className="relative h-full overflow-hidden rounded-[24px] border border-zinc-200 bg-white p-6 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_20px_40px_-16px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="absolute right-0 top-0 h-[160px] w-[160px] rounded-bl-full bg-gradient-to-bl from-emerald-500/[0.08] to-transparent blur-2xl" />
                  <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">Overall SEO Health</p>
                  
                  <div className="flex items-start justify-between gap-6">
                    <div className="relative">
                      <svg width="124" height="124" viewBox="0 0 124 124" className="rotate-[-90deg]">
                        <circle cx="62" cy="62" r="54" fill="none" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeWidth="14"/>
                        <circle
                          cx="62" cy="62" r="54"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray={339.292}
                          strokeDashoffset={339.292 - (339.292 * report.seoScore) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#0FA561" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="text-center">
                          <p className={`text-[42px] font-bold leading-none tracking-tight ${scoreColor(report.seoScore)}`}>{report.seoScore}</p>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">/ 100</p>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          report.seoScore >= 80 
                            ? "bg-emerald-500 text-white" 
                            : report.seoScore >= 60 
                            ? "bg-amber-500 text-white" 
                            : "bg-rose-500 text-white"
                        }`}>
                          {report.seoScore >= 80 ? "Excellent" : report.seoScore >= 60 ? "Good" : "Needs Work"}
                        </span>
                      </div>
                      <h3 className="mb-2.5 text-[19px] font-semibold leading-tight tracking-tight">Solid foundation with key optimizations needed</h3>
                      <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {report.issues.filter(i => i.type === "critical").length} critical issues affecting rankings. 
                        Fixing these could improve visibility by ~24%.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    {[
                      { label: "Critical", value: report.issues.filter(i => i.type === "critical").length, color: "text-rose-600" },
                      { label: "Warnings", value: report.issues.filter(i => i.type === "warning").length, color: "text-amber-600" },
                      { label: "Suggestions", value: report.issues.filter(i => i.type === "info").length, color: "text-zinc-600" },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <p className={`text-[18px] font-bold leading-none ${item.color} dark:opacity-90`}>{item.value}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KEY METRICS */}
              <div className="grid gap-[18px] md:col-span-8 md:grid-cols-2">
                {[
                  { 
                    label: "Domain Authority", 
                    value: report.domainAuthority, 
                    sub: "Moz scale 1-100",
                    trend: "+3 this month",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M3 17L9 11l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )
                  },
                  { 
                    label: "Backlinks", 
                    value: report.backlinks.toLocaleString(), 
                    sub: "Referring domains",
                    trend: "+127 last 90d",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )
                  },
                  { 
                    label: "Indexed Pages", 
                    value: "1,847", 
                    sub: "Google search console",
                    trend: "↑ 12% this week",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 3v18" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )
                  },
                  { 
                    label: "Organic Traffic", 
                    value: "48.2k", 
                    sub: "Est. monthly visits",
                    trend: "+8.4% MoM",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )
                  },
                ].map((metric) => (
                  <div key={metric.label} className="relative overflow-hidden rounded-[22px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-50 blur-xl dark:from-zinc-800 dark:to-zinc-900" />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{metric.label}</p>
                        <p className="mt-1.5 text-[26px] font-semibold leading-none tracking-tight">{metric.value}</p>
                        <p className="mt-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{metric.sub}</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-zinc-950 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-950">
                        {metric.icon}
                      </div>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900/50">
                      <span className="h-1 w-1 rounded-full bg-emerald-600" />
                      {metric.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid gap-[18px] lg:grid-cols-3">
              {/* LEFT COLUMN */}
              <div className="space-y-[18px] lg:col-span-2">
                {/* META TAGS */}
                <div className="rounded-[24px] border border-zinc-200 bg-white p-[22px] dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="mb-[18px] flex items-center justify-between">
                    <h3 className="text-[17px] font-semibold tracking-tight">Page Metadata</h3>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/50">Needs optimization</span>
                  </div>

                  <div className="space-y-4">
                    <div className="group rounded-[18px] border border-zinc-200 bg-zinc-50/70 p-[18px] transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-zinc-700">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Title Tag</p>
                        <button 
                          onClick={() => copyToClipboard(report.metaTitle, "title")}
                          className="cursor-pointer rounded-[10px] p-1.5 text-zinc-400 transition hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                        >
                          {copied === "title" ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                          )}
                        </button>
                      </div>
                      <h4 className="text-[15px] font-medium leading-snug text-[#1A0DAB] dark:text-[#8AB4F8]">{report.metaTitle}</h4>
                      <div className="mt-2.5 flex items-center gap-3 text-[12px]">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{report.url.replace(/^https?:\/\//, "")}</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span className="text-zinc-500">Dec 14, 2024</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2.5 text-[11px]">
                        <span className={`font-medium ${report.metaTitle.length > 60 ? "text-amber-600" : "text-emerald-600"}`}>
                          {report.metaTitle.length} characters
                        </span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-500">Recommended: 50-60</span>
                      </div>
                    </div>

                    <div className="group rounded-[18px] border border-zinc-200 bg-zinc-50/70 p-[18px] transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-zinc-700">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Meta Description</p>
                        <button 
                          onClick={() => copyToClipboard(report.metaDescription, "desc")}
                          className="cursor-pointer rounded-[10px] p-1.5 text-zinc-400 transition hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                        >
                          {copied === "desc" ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="text-[14px] leading-relaxed text-zinc-700 dark:text-zinc-300">{report.metaDescription}</p>
                      <div className="mt-3 flex items-center gap-2.5 text-[11px]">
                        <span className={`font-medium ${report.metaDescription.length > 160 ? "text-rose-600" : "text-emerald-600"}`}>
                          {report.metaDescription.length} characters
                        </span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-500">Recommended: 150-160</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HEADINGS STRUCTURE */}
                <div className="rounded-[24px] border border-zinc-200 bg-white p-[22px] dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="mb-[18px] text-[17px] font-semibold tracking-tight">Heading Hierarchy</h3>
                  
                  <div className="space-y-[14px]">
                    {/* H1 */}
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-[10px] bg-zinc-950 px-1.5 text-[11px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-950">H1</span>
                        <span className="text-[11px] font-medium text-zinc-500">{report.headings.h1.length} found</span>
                      </div>
                      <div className="space-y-2">
                        {report.headings.h1.map((h, i) => (
                          <div key={i} className="rounded-[14px] border border-zinc-200 bg-zinc-50 px-4 py-3 text-[14px] font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                            {h}
                          </div>
                        ))}
                      </div>
                      {report.headings.h1.length > 1 && (
                        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-amber-600 dark:text-amber-400">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Multiple H1s detected — should be only one per page
                        </p>
                      )}
                    </div>

                    {/* H2 */}
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-[10px] bg-zinc-200 px-1.5 text-[11px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">H2</span>
                        <span className="text-[11px] font-medium text-zinc-500">{report.headings.h2.length} sections</span>
                      </div>
                      <div className="space-y-1.5 pl-4">
                        {report.headings.h2.slice(0, showFullReport ? undefined : 3).map((h, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-[13px] text-zinc-700 dark:text-zinc-300">
                            <span className="mt-[7px] h-[5px] w-[5px] rounded-full bg-zinc-400" />
                            <span className="flex-1">{h}</span>
                          </div>
                        ))}
                        {!showFullReport && report.headings.h2.length > 3 && (
                          <button 
                            onClick={() => setShowFullReport(true)}
                            className="cursor-pointer pl-5 text-[12px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                          >
                            + {report.headings.h2.length - 3} more headings
                          </button>
                        )}
                      </div>
                    </div>

                    {/* H3 */}
                    <div className="pt-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex h-6 min-w-[28px] items-center justify-center rounded-[10px] bg-zinc-100 px-1.5 text-[11px] font-bold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">H3</span>
                        <span className="text-[11px] font-medium text-zinc-500">{report.headings.h3.length} subsections</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-4">
                        {report.headings.h3.slice(0, 6).map((h, i) => (
                          <span key={i} className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CRITICAL ISSUES */}
                <div className="rounded-[24px] border border-zinc-200 bg-white p-[22px] dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="mb-[18px] flex items-center justify-between">
                    <h3 className="text-[17px] font-semibold tracking-tight">Optimization Opportunities</h3>
                    <span className="text-[11px] font-medium text-zinc-500">Priority order</span>
                  </div>

                  <div className="space-y-3">
                    {report.issues.slice(0, showFullReport ? undefined : 4).map((issue, i) => (
                      <div key={i} className="group relative overflow-hidden rounded-[18px] border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-950/50">
                        <div className="flex items-start gap-3.5">
                          <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-[12px] ring-1 ring-inset ${
                            issue.type === "critical" 
                              ? "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900/50" 
                              : issue.type === "warning"
                              ? "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900/50"
                              : "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
                          }`}>
                            {issue.type === "critical" ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/>
                              </svg>
                            ) : issue.type === "warning" ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-medium leading-snug text-zinc-900 dark:text-zinc-100">{issue.title}</h4>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                issue.impact === "High" 
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300" 
                                  : issue.impact === "Medium"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                              }`}>
                                {issue.impact} impact
                              </span>
                            </div>
                            <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">{issue.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowFullReport(!showFullReport)}
                    className="cursor-pointer mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-zinc-200 bg-zinc-50 py-2.5 text-[13px] font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {showFullReport ? "Show fewer issues" : `View all ${report.issues.length} recommendations`}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${showFullReport ? "rotate-180" : ""}`}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-[18px]">
                {/* PAGE SPEED */}
                <div className="rounded-[24px] border border-zinc-200 bg-white p-[22px] dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[17px] font-semibold tracking-tight">Core Web Vitals</h3>
                      <p className="text-[12px] text-zinc-500 dark:text-zinc-400">Real user metrics</p>
                    </div>
                    <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      report.pageSpeed.score >= 80 ? "bg-emerald-500 text-white" :
                      report.pageSpeed.score >= 50 ? "bg-amber-500 text-white" :
                      "bg-rose-500 text-white"
                    }`}>
                      {report.pageSpeed.score}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {report.pageSpeed.metrics.map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between gap-3 rounded-[14px] border border-zinc-100 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium leading-tight text-zinc-900 dark:text-zinc-100">{metric.label}</p>
                          <p className="font-mono text-[11px] font-medium tabular-nums text-zinc-500 dark:text-zinc-400">{metric.value}</p>
                        </div>
                        <span className={getStatusChip(metric.status)}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {metric.status === "good" ? "Good" : metric.status === "needs-improvement" ? "Improve" : "Poor"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[16px] bg-amber-50 p-3.5 text-[12px] leading-relaxed text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-100 dark:ring-amber-900/50">
                    <strong>Quick win:</strong> Defer non-critical JS and compress hero image to reach 80+ score.
                  </div>
                </div>

                {/* MOBILE */}
                <div className="rounded-[24px] border border-zinc-200 bg-white p-[22px] dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="mb-4 text-[17px] font-semibold tracking-tight">Mobile-Friendly Test</h3>
                  
                  <div className="mb-4 flex items-center gap-4">
                    <div className="relative">
                      <div className="h-16 w-[84px] overflow-hidden rounded-[14px] border-[3px] border-zinc-900 bg-zinc-50 p-1.5 dark:border-zinc-100 dark:bg-zinc-950">
                        <div className="h-full w-full rounded-[8px] bg-gradient-to-b from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
                          <div className="h-1.5 w-10 rounded-full bg-zinc-300 mx-auto mt-1.5 dark:bg-zinc-700" />
                          <div className="mx-auto mt-2.5 h-6 w-[54px] rounded-[6px] bg-emerald-500/20" />
                          <div className="mt-1.5 space-y-1 px-1.5">
                            <div className="h-1 w-full rounded-full bg-zinc-300 dark:bg-zinc-700" />
                            <div className="h-1 w-4/5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          </div>
                        </div>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                        report.mobileFriendly.score >= 80 ? "bg-emerald-600" : "bg-amber-600"
                      }`}>
                        {report.mobileFriendly.score}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium leading-snug text-zinc-900 dark:text-zinc-100">Passes Google's mobile-friendly test</p>
                      <p className="mt-1 text-[11px] leading-snug text-zinc-600 dark:text-zinc-400">{report.mobileFriendly.issues.length} usability issues found</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {report.mobileFriendly.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2.5 rounded-[12px] bg-zinc-50 px-3 py-2.5 text-[12px] dark:bg-zinc-950">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 text-amber-600">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        <span className="text-zinc-700 dark:text-zinc-300">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ALT TAGS */}
                <div className="rounded-[24px] border border-zinc-200 bg-white p-[22px] dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[17px] font-semibold tracking-tight">Image Accessibility</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900/50">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      {report.missingAltTags.length} missing
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {report.missingAltTags.map((img, i) => (
                      <div key={i} className="group flex items-center gap-3 rounded-[14px] border border-rose-200/70 bg-rose-50/50 p-3 transition dark:border-rose-900/50 dark:bg-rose-950/30">
                        <div className="relative h-11 w-11 overflow-hidden rounded-[10px] bg-zinc-200 dark:bg-zinc-800">
                          <div className="absolute inset-0 grid place-items-center text-zinc-400">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-mono text-[11px] text-zinc-900 dark:text-zinc-100">{img.src}</p>
                          <p className="truncate text-[11px] text-zinc-600 dark:text-zinc-400">{img.location}</p>
                        </div>
                        <button className="cursor-pointer rounded-[10px] bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 ring-1 ring-zinc-200 transition hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800">
                          Fix
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3.5 rounded-[14px] border border-dashed border-zinc-300 p-3 text-center text-[12px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                    Add descriptive alt text to improve accessibility and image SEO
                  </div>
                </div>

                {/* KEYWORDS */}
                <div className="rounded-[24px] border border-zinc-200 bg-white p-[22px] dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="mb-4 text-[17px] font-semibold tracking-tight">Keyword Opportunities</h3>
                  
                  <div className="space-y-3">
                    {report.keywords.map((kw, i) => (
                      <div key={i} className="rounded-[16px] border border-zinc-200 p-3.5 dark:border-zinc-800">
                        <div className="mb-2.5 flex items-baseline justify-between gap-2">
                          <h4 className="font-mono text-[13px] font-medium text-zinc-900 dark:text-zinc-100">"{kw.keyword}"</h4>
                          <span className="font-mono text-[11px] font-semibold tabular-nums text-zinc-500">{kw.density}% density</span>
                        </div>
                        <div className="mb-2.5 h-[6px] overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                            style={{ width: `${Math.min(100, kw.density * 22)}%` }}
                          />
                        </div>
                        <p className="text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-400">{kw.recommendations}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXPORT CARD */}
                <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-[#0FA561] p-[22px] text-white shadow-[0_10px_40px_-12px_rgba(15,165,97,0.45)] dark:border-emerald-800">
                  <div className="relative">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-teal-400/20 blur-[60px]" />
                    
                    <h3 className="relative mb-2.5 text-[18px] font-semibold tracking-tight">Share audit with your team</h3>
                    <p className="relative mb-5 text-[13px] leading-relaxed text-emerald-50">Export a branded PDF report or copy the share link with all recommendations.</p>
                    
                    <div className="relative flex gap-2.5">
                      <button 
                        onClick={exportAsPDF}
                        className="cursor-pointer flex-1 rounded-[14px] bg-white py-2.5 text-[13px] font-semibold text-emerald-700 shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition hover:bg-emerald-50"
                      >
                        Export PDF
                      </button>
                      <button 
                        onClick={() => copyToClipboard(`https://rankranger.app/report/${btoa(report.url)}`, "share")}
                        className="cursor-pointer flex items-center justify-center gap-1.5 rounded-[14px] bg-emerald-950/70 px-3.5 py-2.5 text-[13px] font-medium backdrop-blur transition hover:bg-emerald-950"
                      >
                        {copied === "share" ? "Copied!" : "Share"}
                        {copied === "share" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5"/></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L12 5"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07L12 19"/></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER STATS */}
            <div className="grid gap-3.5 border-t border-zinc-200 pt-7 dark:border-zinc-800 md:grid-cols-3 md:gap-5">
              {[
                { label: "Word count", value: report.wordCount.toLocaleString(), detail: "Optimal for SEO" },
                { label: "Internal links", value: report.internalLinks, detail: "Good distribution" },
                { label: "Crawl depth", value: "2.4 clicks", detail: "From homepage" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between rounded-[16px] border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                    <p className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">{stat.value}</p>
                  </div>
                  <p className="text-right text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{stat.detail}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {!report && !isAnalyzing && (
          <section className="mx-auto max-w-[960px] text-center">
            <div className="relative overflow-hidden rounded-[32px] border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-12 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_40px_80px_-24px_rgba(0,0,0,0.12)] dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-950">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/[0.03] via-transparent to-transparent" />
              
              <div className="relative mx-auto mb-6 grid h-16 w-16 place-items-center rounded-[22px] bg-zinc-950 text-white shadow-[0_12px_24px_-6px_rgba(0,0,0,0.3)] dark:bg-zinc-100 dark:text-zinc-950">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
              </div>

              <h3 className="display mb-3 text-[28px] font-semibold leading-tight tracking-[-0.02em]">Audit any website instantly</h3>
              <p className="mx-auto mb-8 max-w-[520px] text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                Enter a URL above to generate a comprehensive SEO audit with actionable recommendations. 
                No signup required — get insights in under a minute.
              </p>

              <div className="mx-auto grid max-w-[720px] gap-4 md:grid-cols-3">
                {[
                  { title: "120+ checks", desc: "Technical SEO, content, and UX signals" },
                  { title: "SERP preview", desc: "See how your page appears in search" },
                  { title: "Action plan", desc: "Prioritized fixes with impact estimates" },
                ].map((feature) => (
                  <div key={feature.title} className="rounded-[20px] border border-zinc-200 bg-white p-5 text-left dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">{feature.title}</p>
                    <p className="mt-1 text-[13px] leading-snug text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-10 flex max-w-[720px] flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                No data collection
              </span>
              <span>•</span>
              <span>Privacy-focused</span>
              <span>•</span>
              <span>Works for any public website</span>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white/50 py-10 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 px-5 text-center md:flex-row md:px-8 md:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
                <path d="M3 13L9 7L13 11L21 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-semibold leading-none">RankRanger</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">SEO audit studio for modern teams</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-[13px] font-medium text-zinc-600 dark:text-zinc-400">
            <a href="#" className="cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100">Changelog</a>
            <a href="#" className="cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100">API</a>
            <a href="#" className="cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
