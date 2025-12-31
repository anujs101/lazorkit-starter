'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [copied, setCopied] = useState<string | null>(null);
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'introduction',
        'project-structure',
        'starter-templates',
        'checkout',
        'subscriptions',
        'wallet-integration',
        'gasless-transactions',
        'environment-variables',
        'deployment',
        'common-pitfalls',
      ];

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const getAnimationClass = (id: string) => {
    return visibleSections.has(id)
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-8';
  };

  const navItems = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'project-structure', label: 'Project Structure' },
    { id: 'starter-templates', label: 'Starter Templates' },
    { id: 'checkout', label: 'Checkout' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'wallet-integration', label: 'Wallet Integration' },
    { id: 'gasless-transactions', label: 'Gasless Transactions' },
    { id: 'environment-variables', label: 'Environment Variables' },
    { id: 'deployment', label: 'Deployment' },
    { id: 'common-pitfalls', label: 'Common Pitfalls' },
  ];

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shadow-lg relative group my-6">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
        <span className="text-xs font-mono text-zinc-500">bash</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#4C6FFF] transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[16px]">
            {copied === id ? 'check' : 'content_copy'}
          </span>
          <span>{copied === id ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-6 text-left font-mono text-[13px] leading-7 text-zinc-300 overflow-x-auto">
        {code.split('\n').map((line, i) => (
          <div key={i} className="flex gap-3">
            {line.startsWith('$') ? (
              <>
                <span className="text-zinc-600 select-none">$</span>
                <span className="text-zinc-400">{line.slice(2)}</span>
              </>
            ) : (
              <span className="text-zinc-500">{line}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 text-[#4C6FFF] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">bolt</span>
            </div>
            <h2 className="text-zinc-50 text-lg font-semibold tracking-tight">LazorKit</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              className="text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-all duration-200"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-all duration-200"
              href="/#starters"
            >
              Starters
            </Link>
            <Link
              className="text-sm font-medium transition-all duration-200 relative py-2 text-zinc-50"
              href="/docs"
            >
              Docs
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4C6FFF] rounded-full" />
            </Link>
            <Link
              className="text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-all duration-200 flex items-center gap-1"
              href="#"
            >
              GitHub
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#4C6FFF] hover:bg-[#3E5FCC] text-white text-sm font-medium transition-all duration-200">
              <span className="mr-2 material-symbols-outlined text-[18px]">account_balance_wallet</span>
              <span>Connect</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 border-r border-zinc-800 bg-zinc-950 overflow-y-auto">
          <nav className="p-6 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${activeSection === item.id
                  ? 'bg-zinc-900 text-[#4C6FFF]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex-1 lg:ml-64">
          <div className="max-w-[800px] mx-auto px-6 py-16">
            <section className="mb-20" data-animate="header">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('header')}`}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
                  Documentation
                </h1>
                <p className="text-lg text-zinc-400 leading-relaxed">
                  Everything you need to understand, extend, and integrate LazorKit starter templates.
                </p>
              </div>
            </section>

            <section id="introduction" className="mb-20" data-animate="introduction">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('introduction')}`}
              >
                <h2 className="text-2xl font-bold text-zinc-50 mb-4">Introduction</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    LazorKit is a collection of production-ready starter templates for building gasless payment flows on Solana. These templates are designed for developers who want to accept USDC payments without requiring users to manage SOL or seed phrases.
                  </p>
                  <p>
                    This repository is for developers building real applications. The starters are meant to be extended and customized, not copied blindly. Each template includes working implementations of complex flows like checkout, subscriptions, and wallet integration.
                  </p>
                  <p>
                    All templates use passkey-based authentication for a Web2-like user experience while maintaining blockchain security. Users authenticate with biometrics and pay with USDC directly—no wallet setup, no gas tokens, no friction.
                  </p>
                </div>
              </div>
            </section>

            <section id="project-structure" className="mb-20" data-animate="project-structure">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('project-structure')}`}
              >
                <h2 className="text-2xl font-bold text-zinc-50 mb-4">Project Structure</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    The repository is organized as a monorepo with independent Next.js applications and shared packages.
                  </p>
                  <CodeBlock
                    id="structure"
                    code={`apps/
  starter-checkout/       # USDC checkout flow with QR codes
  starter-subscription/   # Recurring payments with scheduled transactions
packages/
  ui/                     # Shared UI components (optional)`}
                  />
                  <div className="space-y-3">
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">apps/starter-checkout/</p>
                      <p className="text-sm">
                        Complete checkout implementation with transaction tracking, QR code generation, and receipt handling. Copy this entire app to start building a payment flow.
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">apps/starter-subscription/</p>
                      <p className="text-sm">
                        Subscription billing without cron jobs. Uses scheduled transactions from authorized smart wallets. Copy this for recurring payment features.
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">packages/ui/</p>
                      <p className="text-sm">
                        Optional shared components. You can ignore this if you're only using one starter.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 border-l-2 border-zinc-800 pl-4 py-2">
                    Each starter is a standalone Next.js app. You can copy just one app and deploy it independently. The monorepo structure is for organizational purposes only.
                  </p>
                </div>
              </div>
            </section>

            <section id="starter-templates" className="mb-20" data-animate="starter-templates">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('starter-templates')}`}
              >
                <h2 className="text-2xl font-bold text-zinc-50 mb-4">Starter Templates</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    Each starter template solves a specific payment use case. They share the same wallet integration and paymaster setup but differ in their transaction flows and UI patterns.
                  </p>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-3">
                    <h3 className="text-zinc-50 font-semibold">What's Included in Every Starter</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#4C6FFF] text-[18px] mt-0.5">
                          check_circle
                        </span>
                        <span>Passkey-based wallet creation and connection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#4C6FFF] text-[18px] mt-0.5">
                          check_circle
                        </span>
                        <span>Gasless transactions via integrated paymaster</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-oriented text-[#4C6FFF] text-[18px] mt-0.5">
                          check_circle
                        </span>
                        <span>USDC payment flows on Devnet</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#4C6FFF] text-[18px] mt-0.5">
                          check_circle
                        </span>
                        <span>Transaction status monitoring and error handling</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm text-zinc-500">
                    All starters assume Devnet and USDC. You'll need to customize network configuration and token addresses for mainnet deployment.
                  </p>
                </div>
              </div>
            </section>

            <section id="checkout" className="mb-20" data-animate="checkout">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('checkout')}`}
              >
                <h2 className="text-2xl font-bold text-zinc-50 mb-4">Checkout</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    The checkout starter implements a complete one-time payment flow. Users can pay via connected wallet or by scanning a QR code. Transaction status is tracked in real-time with proper error handling.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">What Problem It Solves</p>
                      <p className="text-sm">
                        Accepting crypto payments without forcing users to manage gas tokens or deal with wallet setup friction. The flow feels like PayPal or Stripe, not a blockchain transaction.
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">Key Features</p>
                      <ul className="space-y-1.5 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-[#4C6FFF]">•</span>
                          <span>QR code generation for mobile payments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#4C6FFF]">•</span>
                          <span>Real-time transaction confirmation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#4C6FFF]">•</span>
                          <span>Digital receipt generation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#4C6FFF]">•</span>
                          <span>ATA creation handled automatically</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">What to Customize</p>
                      <p className="text-sm">
                        You'll need to customize the payment amount logic, merchant address, receipt design, and post-payment flow (order confirmation, fulfillment triggers, etc.).
                      </p>
                    </div>
                  </div>
                  <CodeBlock
                    id="checkout-install"
                    code={`$ cd apps/starter-checkout
$ npm install
$ npm run dev`}
                  />
                </div>
              </div>
            </section>

            <section id="subscriptions" className="mb-20" data-animate="subscriptions">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('subscriptions')}`}
              >
                <h2 className="text-2xl font-bold text-zinc-50 mb-4">Subscriptions</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    The subscription starter enables recurring payments without server-side cron jobs. Users authorize a subscription by delegating spending permissions to a program, which can then execute scheduled transactions from their smart wallet.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">What Problem It Solves</p>
                      <p className="text-sm">
                        Traditional crypto subscriptions require users to manually approve every payment or deposit funds into escrow. This uses scheduled transactions with permission delegation, creating a true "set it and forget it" subscription experience.
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">How It Works</p>
                      <ol className="space-y-1.5 text-sm list-decimal list-inside">
                        <li>User connects wallet and selects subscription plan</li>
                        <li>User authorizes spending delegation to subscription program</li>
                        <li>Program schedules recurring transactions at specified intervals</li>
                        <li>Paymaster covers gas fees for scheduled executions</li>
                      </ol>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">What to Customize</p>
                      <p className="text-sm">
                        Subscription pricing, billing intervals, cancellation logic, grace periods, and what happens when a payment fails (retry logic, service suspension, etc.).
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 border-l-2 border-zinc-800 pl-4 py-2">
                    Note: This requires smart wallet support for delegation. Regular wallets cannot use scheduled transactions.
                  </p>
                  <CodeBlock
                    id="subscriptions-install"
                    code={`$ cd apps/starter-subscription
$ npm install
$ npm run dev`}
                  />
                </div>
              </div>
            </section>

            <section id="wallet-integration" className="mb-20" data-animate="wallet-integration">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('wallet-integration')}`}
              >
                <h2 className="text-2xl font-bold text-zinc-50 mb-4">Wallet Integration</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    LazorKit uses passkey-based smart wallets instead of traditional keypair wallets. Users authenticate with biometrics (Touch ID, Face ID, Windows Hello) rather than managing seed phrases.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">Why No Seed Phrases</p>
                      <p className="text-sm">
                        Seed phrases are a terrible UX for consumer applications. Users lose them, write them down insecurely, or screenshot them. Passkeys use secure hardware-backed authentication that can't be phished or lost.
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">How It Works</p>
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                          <span className="text-[#4C6FFF] font-mono text-xs mt-1">1</span>
                          <div>
                            <p className="text-zinc-50">Wallet Creation</p>
                            <p className="text-zinc-500">User clicks "Connect Wallet" and authenticates with biometrics. A smart wallet contract is deployed on Solana with the passkey public key as the authority.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-[#4C6FFF] font-mono text-xs mt-1">2</span>
                          <div>
                            <p className="text-zinc-50">Transaction Signing</p>
                            <p className="text-zinc-500">When signing a transaction, the user authenticates with biometrics. The passkey generates a signature that proves ownership of the smart wallet.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-[#4C6FFF] font-mono text-xs mt-1">3</span>
                          <div>
                            <p className="text-zinc-50">Cross-Device Sync</p>
                            <p className="text-zinc-500">Passkeys sync across devices via iCloud Keychain or Google Password Manager. Same wallet, every device, no manual export.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">Key Methods</p>
                      <ul className="space-y-1.5 text-sm font-mono">
                        <li className="flex items-start gap-2">
                          <span className="text-[#4C6FFF]">→</span>
                          <span>connect() - Creates or restores wallet</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#4C6FFF]">→</span>
                          <span>signTransaction() - Signs without sending</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#4C6FFF]">→</span>
                          <span>signAndSendTransaction() - Signs and submits to RPC</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 border-l-2 border-zinc-800 pl-4 py-2">
                    Important: Passkeys are bound to the domain. Localhost and production will have different wallets. Use the same domain for testing and deployment to maintain wallet continuity.
                  </p>
                </div>
              </div>
            </section>

            <section id="gasless-transactions" className="mb-20" data-animate="gasless-transactions">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('gasless-transactions')}`}
              >
                <h2 className="text-2xl font-bold text-zinc-50 mb-4">Gasless Transactions</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    "Gasless" means users don't need SOL to pay transaction fees. Instead, a paymaster service covers the fees on behalf of the user. Users only need USDC in their wallet.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">Role of the Paymaster</p>
                      <p className="text-sm">
                        The paymaster is a service that accepts unsigned transactions, adds a fee payer instruction (using its own SOL), and submits the transaction to the network. The user's transaction succeeds without them holding any SOL.
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">Transaction Flow</p>
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                          <span className="text-zinc-500">→</span>
                          <p>User signs transaction with their smart wallet (passkey)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-zinc-500">→</span>
                          <p>Transaction is sent to paymaster service</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-zinc-500">→</span>
                          <p>Paymaster validates transaction and adds fee payer</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-zinc-500">→</span>
                          <p>Paymaster submits to Solana RPC</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="text-zinc-500">→</span>
                          <p>User's USDC payment succeeds, paymaster's SOL covers fees</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">Why Simulation is Enabled</p>
                      <p className="text-sm">
                        Before submitting to the paymaster, transactions are simulated locally to catch errors early. This prevents invalid transactions from wasting paymaster resources and provides better error messages to users.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 border-l-2 border-zinc-800 pl-4 py-2">
                    The paymaster service is configured via environment variables. In production, you'll either run your own paymaster or use a third-party service with rate limiting and abuse prevention.
                  </p>
                </div>
              </div>
            </section>

            <section id="environment-variables" className="mb-20" data-animate="environment-variables">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('environment-variables')}`}
              >
                <h2 className="text-2xl font-bold text-zinc-50 mb-4">Environment Variables</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    Each starter requires environment variables for network configuration and service endpoints. Create a <span className="font-mono text-zinc-300">.env.local</span> file in the app root.
                  </p>
                  <CodeBlock
                    id="env-example"
                    code={`NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PAYMASTER_URL=https://paymaster.yourdomain.com
NEXT_PUBLIC_PORTAL_URL=https://portal.yourdomain.com
NEXT_PUBLIC_NETWORK=devnet`}
                  />
                  <div className="space-y-3">
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">NEXT_PUBLIC_RPC_URL</p>
                      <p className="text-sm">
                        Solana RPC endpoint. Use a private RPC provider for production (Helius, Alchemy, QuickNode). Public RPCs are rate-limited and unreliable.
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">NEXT_PUBLIC_PAYMASTER_URL</p>
                      <p className="text-sm">
                        URL of your paymaster service. This service must accept unsigned transactions and add fee payer instructions.
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">NEXT_PUBLIC_PORTAL_URL</p>
                      <p className="text-sm">
                        URL for wallet management portal. Optional for basic flows, required for subscription management and wallet settings.
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">NEXT_PUBLIC_NETWORK</p>
                      <p className="text-sm">
                        Network identifier (devnet, testnet, mainnet-beta). This affects which USDC mint address is used and which RPC endpoints are valid.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 border-l-2 border-zinc-800 pl-4 py-2">
                    Never commit .env.local to version control. Use Vercel environment variables for production deployments.
                  </p>
                </div>
              </div>
            </section>

            <section id="deployment" className="mb-20" data-animate="deployment">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('deployment')}`}
              >
                <h2 className="text-2xl font-bold text-zinc-50 mb-4">Deployment</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    Each starter is a standalone Next.js application that can be deployed independently to Vercel or any platform that supports Next.js.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">Deploying to Vercel</p>
                      <ol className="space-y-1.5 text-sm list-decimal list-inside">
                        <li>Push your code to GitHub</li>
                        <li>Connect the repository to Vercel</li>
                        <li>Set root directory to <span className="font-mono text-zinc-300">apps/starter-checkout</span> or <span className="font-mono text-zinc-300">apps/starter-subscription</span></li>
                        <li>Add environment variables in Vercel dashboard</li>
                        <li>Deploy</li>
                      </ol>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">Deploying Multiple Starters</p>
                      <p className="text-sm">
                        To deploy both starters as separate sites, create two Vercel projects from the same repository. Set different root directories for each project.
                      </p>
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2 text-sm mt-3">
                        <div>
                          <p className="text-zinc-50 font-mono text-xs mb-1">Project 1 - Checkout</p>
                          <p className="text-zinc-500">Root Directory: <span className="text-zinc-300">apps/starter-checkout</span></p>
                        </div>
                        <div>
                          <p className="text-zinc-50 font-mono text-xs mb-1">Project 2 - Subscriptions</p>
                          <p className="text-zinc-500">Root Directory: <span className="text-zinc-300">apps/starter-subscription</span></p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-zinc-50 font-medium mb-1">Important for Passkey Wallets</p>
                      <p className="text-sm">
                        Passkeys are domain-bound. Your localhost wallet will be different from your production wallet. If you need to test with the same wallet across environments, use the same domain (e.g., staging.yourdomain.com and yourdomain.com will have different wallets).
                      </p>
                    </div>
                  </div>
                  <CodeBlock
                    id="vercel-install"
                    code={`$ cd apps/starter-checkout
$ vercel
# Follow prompts and set environment variables when prompted`}
                  />
                </div>
              </div>
            </section>

            <section id="common-pitfalls" className="mb-20" data-animate="common-pitfalls">
              <div
                className={`transition-all duration-300 ease-out ${getAnimationClass('common-pitfalls')}`}
              >
                <h2 className="text-2xl font-bold text-zinc-50 mb-4">Common Pitfalls</h2>
                <div className="space-y-4 text-zinc-400 leading-relaxed">
                  <p>
                    Here are real issues you'll encounter when building with these starters and how to fix them.
                  </p>
                  <div className="space-y-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                      <h3 className="text-zinc-50 font-semibold mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4C6FFF] text-[20px]">
                          error
                        </span>
                        Wallet Not Connected on Page Load
                      </h3>
                      <p className="text-sm mb-2">
                        Passkey authentication requires user interaction. You can't auto-connect on page load. Users must click "Connect Wallet" explicitly.
                      </p>
                      <p className="text-xs text-zinc-500">
                        Solution: Show a connection prompt and store connection state in localStorage. Check for existing session on mount but don't auto-trigger passkey prompt.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                      <h3 className="text-zinc-50 font-semibold mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4C6FFF] text-[20px]">
                          error
                        </span>
                        ATA Creation Increases Transaction Size
                      </h3>
                      <p className="text-sm mb-2">
                        If the recipient doesn't have an Associated Token Account (ATA) for USDC, you need to create it first. This adds instructions to your transaction and can cause size/compute limit issues.
                      </p>
                      <p className="text-xs text-zinc-500">
                        Solution: Check if ATA exists before building transaction. If not, create it in a separate transaction before the payment. Handle this gracefully in the UI.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                      <h3 className="text-zinc-50 font-semibold mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4C6FFF] text-[20px]">
                          error
                        </span>
                        Insufficient Devnet USDC
                      </h3>
                      <p className="text-sm mb-2">
                        Users need Devnet USDC to test payments. There's no faucet integrated in the starters.
                      </p>
                      <p className="text-xs text-zinc-500">
                        Solution: Link users to Circle's Devnet USDC faucet or integrate faucet API calls in your test environment. Make this obvious in the UI.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                      <h3 className="text-zinc-50 font-semibold mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4C6FFF] text-[20px]">
                          error
                        </span>
                        Simulation Failures with Stale Blockhash
                      </h3>
                      <p className="text-sm mb-2">
                        Transactions can fail simulation if the recent blockhash is stale. This happens when there's a delay between building and signing.
                      </p>
                      <p className="text-xs text-zinc-500">
                        Solution: Fetch a fresh blockhash right before signing. Don't reuse blockhashes across multiple transaction attempts. Implement retry logic with new blockhashes.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                      <h3 className="text-zinc-50 font-semibold mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4C6FFF] text-[20px]">
                          error
                        </span>
                        Paymaster Rate Limiting
                      </h3>
                      <p className="text-sm mb-2">
                        If you're using a shared paymaster service, rapid-fire transactions from testing can trigger rate limits.
                      </p>
                      <p className="text-xs text-zinc-500">
                        Solution: Implement exponential backoff for retries. In production, run your own paymaster or use a service with appropriate rate limits for your traffic.
                      </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                      <h3 className="text-zinc-50 font-semibold mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4C6FFF] text-[20px]">
                          error
                        </span>
                        Transaction Confirmation Timeouts
                      </h3>
                      <p className="text-sm mb-2">
                        Devnet can be slow. Transactions might take 30+ seconds to confirm during periods of high load.
                      </p>
                      <p className="text-xs text-zinc-500">
                        Solution: Set generous timeout values (60s minimum). Show loading states with progress indicators. Allow users to check transaction status separately if timeout occurs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="border-t border-zinc-800 pt-12 mt-20">
              <div className="text-center space-y-4">
                <p className="text-zinc-500 text-sm">
                  Need more help? Check the GitHub repository for examples or open an issue.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-[#4C6FFF] hover:text-[#3E5FCC] text-sm font-medium transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 pb-8 border-b border-zinc-800">
            <div>
              <h3 className="text-zinc-50 font-semibold mb-1">LazorKit</h3>
              <p className="text-zinc-500 text-sm">Gasless payments on Solana.</p>
            </div>
            <nav className="flex items-center gap-6">
              <Link className="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 text-sm font-medium" href="/">
                Home
              </Link>
              <Link className="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 text-sm font-medium" href="/docs">
                Docs
              </Link>
              <Link className="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 text-sm font-medium" href="#">
                GitHub
              </Link>
              <Link className="text-zinc-500 hover:text-zinc-300 transition-colors duration-200 text-sm font-medium" href="#">
                Twitter
              </Link>
            </nav>
          </div>
          <div className="text-zinc-600 text-xs">
            © 2024 LazorKit. MIT License.
          </div>
        </div>
      </footer>
    </>
  );
}
