'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
const CHECKOUT_URL = 'https://lazorkit-checkout.vercel.app/';
const SUBSCRIPTION_URL = 'https://lazorkit-subscription.vercel.app/';
const GITHUB_REPO = 'https://github.com/anujs101/lazorkit-starter';
export default function Home() {
  const [activeNav, setActiveNav] = useState('home');
  const [copied, setCopied] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sections = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate') || '';
            setVisibleSections((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const copyToClipboard = () => {
    const code = `git clone https://github.com/anujs101/lazorkit-starter.git
cd apps/starter-checkout
npm install
npm run dev`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => {
      setCopied(false);
      setShowToast(false);
    }, 2500);
  };

  const getAnimationClass = (id: string) => {
    return visibleSections.has(id)
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-8';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 text-[#4C6FFF] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">bolt</span>
            </div>
            <h2 className="text-zinc-50 text-lg font-semibold tracking-tight">LazorKit</h2>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              className={`text-sm font-medium transition-all duration-200 relative py-2 group ${activeNav === 'home' ? 'text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              href="#"
              onClick={() => setActiveNav('home')}
            >
              Home
              {activeNav === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4C6FFF] rounded-full" />
              )}
            </Link>
            <Link
              className={`text-sm font-medium transition-all duration-200 relative py-2 group ${activeNav === 'starters' ? 'text-zinc-50' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              href="#starters"
              onClick={() => setActiveNav('starters')}
            >
              Starters
              {activeNav === 'starters' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4C6FFF] rounded-full" />
              )}
            </Link>
            <Link
              className="text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-all duration-200"
              href="/docs"
            >
              Docs
            </Link>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-200 text-sm font-medium flex items-center gap-1"
            >
              GitHub
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#4C6FFF] hover:bg-[#3E5FCC] text-white text-sm font-medium transition-all duration-200">
              <span className="mr-2 material-symbols-outlined text-[18px]">account_balance_wallet</span>
              <span>Connect</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-16 px-6">
        <div className="max-w-[1000px] mx-auto flex flex-col">
          <section
            className="flex flex-col items-center text-center pt-16 pb-32"
            data-animate="hero"
          >
            <div
              className={`transition-all duration-300 ease-out ${getAnimationClass('hero')}`}
              style={{ transitionDelay: '0ms' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4C6FFF] opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4C6FFF]"></span>
                </span>
                v1.0.0 Available
              </div>
            </div>
            <h1
              className={`text-zinc-50 text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight max-w-[800px] mb-6 transition-all duration-300 ease-out ${getAnimationClass(
                'hero'
              )}`}
              style={{ transitionDelay: '100ms' }}
            >
              Gasless Solana starter templates
            </h1>
            <p
              className={`text-zinc-400 text-lg leading-relaxed max-w-[580px] mb-12 transition-all duration-300 ease-out ${getAnimationClass(
                'hero'
              )}`}
              style={{ transitionDelay: '200ms' }}
            >
              Production-ready templates for checkout flows and recurring billing. Passkey auth. No seed phrases. Users pay with USDC.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-16 transition-all duration-300 ease-out ${getAnimationClass(
                'hero'
              )}`}
              style={{ transitionDelay: '300ms' }}
            >
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-lg h-11 px-6 bg-[#4C6FFF] text-white text-sm font-semibold hover:bg-[#3E5FCC] transition-all duration-200 w-full sm:w-auto"
              >
                View Checkout
              </a>

              <a
                href={SUBSCRIPTION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-lg h-11 px-6 bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-semibold hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200 w-full sm:w-auto"
              >
                Subscriptions
              </a>
              <a
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-lg h-11 px-6 bg-transparent text-zinc-400 text-sm font-semibold hover:text-zinc-200 transition-all duration-200 w-full sm:w-auto" >
                Docs
              </a>
            </div>
            <div
              className={`w-full max-w-[720px] mx-auto transition-all duration-400 ease-out ${getAnimationClass(
                'hero'
              )}`}
              style={{ transitionDelay: '400ms' }}
            >
              <div
                className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl relative group"
                onMouseEnter={() => setShowCopyButton(true)}
                onMouseLeave={() => setShowCopyButton(false)}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
                  <span className="text-xs font-mono text-zinc-500">bash</span>
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#4C6FFF] transition-all duration-200 ${showCopyButton || copied ? 'opacity-100' : 'opacity-0'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-6 text-left font-mono text-[13px] leading-7 text-zinc-300 overflow-x-auto">
                  <div className="flex gap-3">
                    <span className="text-zinc-600 select-none">$</span>
                    <span className="text-zinc-400">git clone https://github.com/anujs101/lazorkit-starter.git</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-zinc-600 select-none">$</span>
                    <span className="text-zinc-400">cd apps/starter-checkout</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-zinc-600 select-none">$</span>
                    <span className="text-zinc-400">npm install</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-zinc-600 select-none">$</span>
                    <span className="text-zinc-400">npm run dev</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                Self-contained Next.js apps. Extend and deploy as needed.
              </p>
            </div>
          </section>

          <section className="py-24 bg-zinc-950/50 -mx-6 px-6" id="starters" data-animate="starters">
            <div className="max-w-[1000px] mx-auto">
              <div
                className={`mb-12 transition-all duration-300 ease-out ${getAnimationClass('starters')}`}
              >
                <h2 className="text-3xl font-bold text-zinc-50 mb-2">Starter Templates</h2>
                <p className="text-zinc-500">Production-ready. Built to extend.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div
                  className={`group relative bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col h-full hover:border-zinc-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 ${getAnimationClass(
                    'starters'
                  )}`}
                  style={{ transitionDelay: '100ms' }}
                >
                  <div className="absolute top-6 right-6">
                    <span className="inline-block px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium">
                      Stable
                    </span>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-zinc-800 text-[#4C6FFF] flex items-center justify-center mb-4 group-hover:bg-[#4C6FFF]/10 transition-colors duration-300">
                    <span className="material-symbols-outlined text-[28px]">shopping_cart</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-50 mb-2">Checkout</h3>
                  <p className="text-zinc-400 text-sm mb-6 flex-grow leading-relaxed">
                    Complete USDC payment flow. QR codes, transaction tracking, and receipts.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="bg-zinc-950 rounded border border-zinc-800 px-3 py-2 text-xs font-mono text-zinc-500">
                      apps/starter-checkout
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={CHECKOUT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 h-9 rounded bg-[#4C6FFF] text-white text-xs font-semibold hover:bg-[#3E5FCC] transition-all duration-200 flex items-center justify-center"
                      >
                        Demo
                      </a>
                      <a
                        href={`${GITHUB_REPO}/tree/main/apps/starter-checkout`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-3 rounded border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                        Source
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className={`group relative bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col h-full hover:border-zinc-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10 ${getAnimationClass(
                    'starters'
                  )}`}
                  style={{ transitionDelay: '200ms' }}
                >
                  <div className="absolute top-6 right-6">
                    <span className="inline-block px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium">
                      Stable
                    </span>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-zinc-800 text-[#4C6FFF] flex items-center justify-center mb-4 group-hover:bg-[#4C6FFF]/10 transition-colors duration-300">
                    <span className="material-symbols-outlined text-[28px]">autorenew</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-50 mb-2">Subscriptions</h3>
                  <p className="text-zinc-400 text-sm mb-6 flex-grow leading-relaxed">
                    Recurring payments without cron jobs. Scheduled transactions from authorized wallets.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="bg-zinc-950 rounded border border-zinc-800 px-3 py-2 text-xs font-mono text-zinc-500">
                      apps/starter-subscription
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={SUBSCRIPTION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 h-9 rounded bg-[#4C6FFF] text-white text-xs font-semibold hover:bg-[#3E5FCC] transition-all duration-200 flex items-center justify-center"
                      >
                        Demo
                      </a>
                      <a
                        href={`${GITHUB_REPO}/tree/main/apps/subscriptions`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-9 px-3 rounded border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                        Source
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className={`relative bg-zinc-950 border border-zinc-800 border-dashed rounded-lg p-6 flex flex-col h-full opacity-50 transition-all duration-300 ease-out ${getAnimationClass(
                    'starters'
                  )}`}
                  style={{ transitionDelay: '300ms' }}
                >
                  <div className="absolute top-6 right-6">
                    <span className="px-2 py-1 rounded bg-zinc-900 text-xs font-medium text-zinc-600 border border-zinc-800">
                      Coming
                    </span>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-zinc-900 text-zinc-600 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[28px]">token</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-500 mb-2">SPL Token Interaction</h3>
                  <p className="text-zinc-600 text-sm">
                    Mint, burn, and transfer tokens with permission controls.
                  </p>
                </div>

                <div
                  className={`relative bg-zinc-950 border border-zinc-800 border-dashed rounded-lg p-6 flex flex-col h-full opacity-50 transition-all duration-300 ease-out ${getAnimationClass(
                    'starters'
                  )}`}
                  style={{ transitionDelay: '400ms' }}
                >
                  <div className="absolute top-6 right-6">
                    <span className="px-2 py-1 rounded bg-zinc-900 text-xs font-medium text-zinc-600 border border-zinc-800">
                      Coming
                    </span>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-zinc-900 text-zinc-600 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[28px]">terminal</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-500 mb-2">Program Interaction</h3>
                  <p className="text-zinc-600 text-sm">
                    IDL parsing and custom Anchor program interaction.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-24" data-animate="why">
            <div
              className={`mb-12 transition-all duration-300 ease-out ${getAnimationClass('why')}`}
            >
              <h2 className="text-3xl font-bold text-zinc-50 mb-2">Why LazorKit?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {[
                { icon: 'fingerprint', title: 'Passkey auth', desc: 'Web2 UX with blockchain security. Authenticate with biometrics.', delay: '0ms' },
                { icon: 'key_off', title: 'No credentials', desc: 'No passwords or seed phrases to manage or lose.', delay: '100ms' },
                { icon: 'toll', title: 'Gasless for users', desc: 'Users pay with USDC directly. No SOL required.', delay: '200ms' },
                { icon: 'devices', title: 'Cross-platform', desc: 'Desktop, mobile, web. Same account everywhere.', delay: '100ms' },
                { icon: 'code', title: 'Built to extend', desc: 'Minimal dependencies. Full control over flows and UI.', delay: '200ms' },
                { icon: 'verified', title: 'Production-ready', desc: 'Audited contracts. Battle-tested payment flows.', delay: '300ms' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 transition-all duration-300 ease-out ${getAnimationClass('why')}`}
                  style={{ transitionDelay: item.delay }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <span className="material-symbols-outlined text-[#4C6FFF] text-[22px]">{item.icon}</span>
                    <h3 className="text-base font-semibold text-zinc-50">{item.title}</h3>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-24 bg-zinc-950/50 -mx-6 px-6" data-animate="getting-started">
            <div className="max-w-[1000px] mx-auto">
              <div
                className={`mb-12 transition-all duration-300 ease-out ${getAnimationClass('getting-started')}`}
              >
                <h2 className="text-3xl font-bold text-zinc-50 mb-2">Getting Started</h2>
                <p className="text-zinc-500">Minimal and unopinionated. Extend freely.</p>
              </div>
              <div className="space-y-6 max-w-2xl">
                {[
                  { num: '1', title: 'Clone repository', desc: 'Pull the latest source from GitHub.' },
                  { num: '2', title: 'Pick a template', desc: 'Navigate to checkout or subscriptions starter.' },
                  { num: '3', title: 'Customize', desc: 'Modify payment flows, UI, and business logic.' },
                  { num: '4', title: 'Deploy', desc: 'Ship to production and accept real payments.' },
                ].map((step, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 transition-all duration-300 ease-out ${getAnimationClass('getting-started')}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-[#4C6FFF] text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {step.num}
                      </div>
                      {i < 3 && <div className="w-px h-10 bg-zinc-800 mt-3"></div>}
                    </div>
                    <div className="pb-2 pt-1">
                      <h3 className="text-base font-semibold text-zinc-50 mb-1">{step.title}</h3>
                      <p className="text-zinc-500 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20" data-animate="devnet">
            <div
              className={`bg-zinc-900 border border-zinc-800 rounded-lg p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 ease-out ${getAnimationClass(
                'devnet'
              )}`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#4C6FFF]/10 text-[#4C6FFF] hidden sm:flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">science</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-50 mb-1">Test with Devnet USDC</h3>
                  <p className="text-zinc-400 text-sm max-w-lg">
                    All templates default to Devnet. Get test USDC from Circle's faucet.
                  </p>
                </div>
              </div>
              <a
                className="whitespace-nowrap flex items-center justify-center rounded-lg h-10 px-5 bg-[#4C6FFF] hover:bg-[#3E5FCC] text-white text-sm font-semibold transition-all duration-200 shrink-0"
                href="https://faucet.circle.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Get USDC
                <span className="material-symbols-outlined text-[16px] ml-2">arrow_forward</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 pb-8 border-b border-zinc-800">
            <div>
              <h3 className="text-zinc-50 font-semibold mb-1">LazorKit</h3>
              <p className="text-zinc-500 text-sm">Smart Wallets. Powered by Passkeys.</p>
            </div>
            <nav className="flex items-center gap-6">
              <Link className="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 text-sm font-medium" href="/docs">
                Docs
              </Link>
              <a
                className="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 text-sm font-medium"
                href={GITHUB_REPO}
                target="_blank"
              >
                GitHub
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
              <Link className="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 text-sm font-medium" href="https://x.com/anujs101">
                Twitter
              </Link>
            </nav>
          </div>
          <div className="text-zinc-600 text-xs">
            © 2026 LazorKit. MIT License.
          </div>
        </div>
      </footer>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 shadow-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4C6FFF] text-[20px]">check_circle</span>
            <span className="text-sm font-medium text-zinc-200">Copied to clipboard</span>
          </div>
        </div>
      )}
    </>
  );
}
