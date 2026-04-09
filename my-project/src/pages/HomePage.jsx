import { useEffect, useState } from 'react'

const stats = [
  { label: 'Assets tracked', value: '$12.8M+' },
  { label: 'Active insights', value: '24/7' },
  { label: 'Goal scenarios', value: '150+' },
]

const process = [
  {
    step: '01',
    title: 'Create your account',
    text: 'Sign in and enter your financial details so the platform understands your real situation.',
  },
  {
    step: '02',
    title: 'Complete your profile',
    text: 'Add salary, expenses, savings, assets, liabilities, goals, and current investments.',
  },
  {
    step: '03',
    title: 'AI researches the market',
    text: 'The system studies relevant sectors, opportunities, risks, and signals based on your preferences.',
  },
  {
    step: '04',
    title: 'Get your personal strategy',
    text: 'Receive clear suggestions, simulations, portfolio insights, and transparent reasoning.',
  },
]

const features = [
  {
    title: 'Profile-based market research',
    desc: 'AI studies investment opportunities based on your income, risk appetite, goals, and portfolio.',
  },
  {
    title: 'Personalized financial news',
    desc: 'Users see relevant market updates based on sectors they care about and investments they already hold.',
  },
  {
    title: 'Buy and sell alerts',
    desc: 'Important news and market movement trigger useful alerts with simple explanations.',
  },
  {
    title: 'Goal planning',
    desc: 'Build plans for a house, education, travel, emergency funds, or long-term wealth growth.',
  },
  {
    title: 'Investment simulation',
    desc: 'Test how returns may change with different amounts, timelines, and risk levels.',
  },
  {
    title: 'Transparent recommendations',
    desc: 'Every recommendation includes reasoning and source-backed context to build trust.',
  },
]

const holdings = [
  { name: 'Tesla', allocation: '24%', change: '+8.4%' },
  { name: 'NVIDIA', allocation: '18%', change: '+13.1%' },
  { name: 'Energy ETF', allocation: '15%', change: '+4.2%' },
  { name: 'Real Estate Fund', allocation: '11%', change: '+6.8%' },
]

function HomePage() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'light'
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111111] transition-colors duration-300 dark:bg-[#0a0a0b] dark:text-white">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f7f5]/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0b]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black text-sm font-semibold text-white dark:bg-white dark:text-black">
              GF
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">Greyola Finance</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                AI-powered investment intelligence
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm text-zinc-600 transition hover:text-black dark:text-zinc-300 dark:hover:text-white">
              How it works
            </a>
            <a href="#features" className="text-sm text-zinc-600 transition hover:text-black dark:text-zinc-300 dark:hover:text-white">
              Features
            </a>
            <a href="#trust" className="text-sm text-zinc-600 transition hover:text-black dark:text-zinc-300 dark:hover:text-white">
              Trust
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:scale-[1.02] dark:border-white/10 dark:bg-[#121214] dark:text-white"
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>

            <button className="hidden rounded-full border border-black/10 px-4 py-2 text-sm font-medium md:inline-block dark:border-white/10">
              Sign In
            </button>

            <button className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-black">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute left-[10%] top-16 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10" />
            <div className="absolute right-[8%] top-20 h-80 w-80 rounded-full bg-zinc-300/40 blur-3xl dark:bg-zinc-700/20" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm dark:border-white/10 dark:bg-[#111214] dark:text-zinc-300">
                Built for personalized investing, not generic tips
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
                Invest with more clarity, stronger reasoning, and a dashboard that actually makes sense.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                A premium AI-powered finance platform that understands your profile, researches the market,
                tracks your portfolio, and explains every suggestion in a simple, trustworthy way.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] dark:bg-white dark:text-black">
                  Get Started
                </button>
                <button className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] dark:border-white/10 dark:bg-[#111214] dark:text-white">
                  Explore Features
                </button>
              </div>

              <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-black/5 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <p className="text-2xl font-semibold">{item.value}</p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[34px] border border-black/5 bg-white/80 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Dashboard Overview</p>
                    <h3 className="text-2xl font-semibold">Welcome back, Greyola</h3>
                  </div>
                  <div className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black">
                    Live Insights
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#f3f4ef] p-5 dark:bg-[#111214]">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Portfolio Value</p>
                    <h4 className="mt-2 text-3xl font-semibold">$9,567.45</h4>
                    <p className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">+12.4% this quarter</p>
                    <div className="mt-5 flex h-24 items-end gap-2">
                      {[20, 28, 24, 35, 42, 39, 52, 57, 61, 70].map((bar, i) => (
                        <div
                          key={i}
                          className={`w-full rounded-t-xl ${i > 6 ? 'bg-emerald-400' : 'bg-black/15 dark:bg-white/15'}`}
                          style={{ height: `${bar}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-[#f3f4ef] p-5 dark:bg-[#111214]">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">AI Signals</p>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-white/5">
                        EV sector momentum improving
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-white/5">
                        Rebalance suggested in energy allocation
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm dark:bg-white/5">
                        New goal plan available
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl bg-[#f3f4ef] p-5 dark:bg-[#111214]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Holdings</p>
                      <h4 className="text-lg font-semibold">Detailed allocation</h4>
                    </div>
                    <button className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold dark:border-white/10">
                      Open Navigator
                    </button>
                  </div>

                  <div className="space-y-3">
                    {holdings.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-white/5"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Allocation {item.allocation}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          {item.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 hidden rounded-3xl border border-black/5 bg-white px-5 py-4 shadow-xl dark:border-white/10 dark:bg-[#121214] md:block">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Recommendation Confidence</p>
                <p className="text-2xl font-semibold">92%</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-14 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              How it works
            </p>
            <h2 className="text-4xl font-semibold tracking-tight">
              The full flow after sign in is clear, structured, and easy to trust
            </h2>
            <p className="mt-4 text-base leading-8 text-zinc-600 dark:text-zinc-400">
              Users answer a financial profiling questionnaire first. Then the platform researches,
              guides, tracks, and explains each important decision through the dashboard.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {process.map((item) => (
              <div
                key={item.step}
                className="rounded-[28px] border border-black/5 bg-white/80 p-7 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-sm font-semibold text-zinc-400">{item.step}</p>
                <h3 className="mt-3 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                Features
              </p>
              <h2 className="text-4xl font-semibold tracking-tight">
                Designed for smart, transparent, and goal-driven investing
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-zinc-600 dark:text-zinc-400">
              The platform combines research, alerts, simulations, portfolio tracking, planning,
              and explainable recommendations in one premium experience.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[28px] border border-black/5 bg-white/80 p-7 shadow-sm transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-5 h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 lg:grid-cols-2 lg:px-8">
          <div className="rounded-[32px] bg-black p-8 text-white dark:bg-white dark:text-black">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/60 dark:text-black/60">
              Personalized news and alerts
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Relevant updates, not generic noise
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/75 dark:text-black/70">
              If a user is focused on oil, electric vehicles, real estate, or other sectors,
              they see tailored updates, important market shifts, and timely alerts with context.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Sector-specific market news',
                'Morning, evening, and night WhatsApp updates',
                'Alerts tied to important events and possible stock movement',
                'Reasoning included with every major signal',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 px-4 py-4 text-sm dark:bg-black/10">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-black/5 bg-white/80 p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Simulation and goal planning
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Turn long-term goals into real investment paths
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Simulate future returns, test risk levels, and build practical plans for buying a house,
              funding education, or growing wealth over time.
            </p>

            <div className="mt-8 rounded-3xl bg-[#f3f4ef] p-6 dark:bg-[#111214]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Goal Example</p>
                  <h3 className="text-xl font-semibold">House Worth ₹50 Lakhs</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  On Track
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Timeline</span>
                  <span className="font-medium">5 years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Monthly plan</span>
                  <span className="font-medium">₹42,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Risk profile</span>
                  <span className="font-medium">Moderate</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div className="h-full w-[62%] rounded-full bg-emerald-400" />
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Projected progress: 62%</p>
              </div>
            </div>
          </div>
        </section>

        <section id="trust" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-[32px] border border-black/5 bg-white/80 p-8 shadow-sm dark:border-white/10 dark:bg-white/5 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Trust and transparency
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight">
              Users should always understand why the platform is suggesting something
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400">
              In finance, trust matters more than flashy visuals. Recommendations should be explained
              in simple language, supported with reasoning, and connected to relevant market context.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                'Simple explanations for every major recommendation',
                'Source-backed context to improve credibility',
                'Clearer user decisions with less confusion',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl bg-[#f3f4ef] p-6 dark:bg-[#111214]"
                >
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-6 lg:px-8">
          <div className="rounded-[32px] bg-black px-8 py-12 text-center text-white dark:bg-white dark:text-black">
            <h2 className="text-4xl font-semibold tracking-tight">
              Start with your profile. Let AI handle the deep research.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/75 dark:text-black/70">
              Build a personalized investment strategy, track your progress cleanly, and make decisions
              with stronger visibility and better reasoning.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black dark:bg-black dark:text-white">
                Create Account
              </button>
              <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold dark:border-black/20">
                Sign In
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage