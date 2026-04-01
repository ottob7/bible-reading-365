import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, CheckCircle, Calendar, BarChart3,
  ClipboardList, UserPlus, BookMarked, ChevronDown,
  Sparkles, ArrowRight
} from 'lucide-react'

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({})
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    function calc() {
      const now = Date.now()
      const diff = target - now
      if (diff <= 0) {
        setStarted(true)
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return { timeLeft, started }
}

function useInView(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(el)
      }
    }, { threshold: 0.15, ...options })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, isVisible]
}

function FadeIn({ children, delay = 0, className = '' }) {
  const [ref, isVisible] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* Decorative corner ornament — SVG filigree */
function Ornament({ className = '', flip = false }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 110 Q10 60 40 40 Q60 25 90 15 Q70 35 60 55 Q50 75 55 100 Q40 85 30 95 Q20 105 10 110Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M10 110 Q10 60 40 40 Q60 25 90 15"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M15 105 Q20 70 45 50 Q55 40 75 30"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
        fill="none"
      />
      <circle cx="90" cy="15" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="75" cy="30" r="1.5" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

/* Thin gold rule with central diamond */
function GoldRule({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-gold-400/50" />
      <div className="w-2 h-2 rotate-45 border border-gold-400/60 bg-gold-400/20" />
      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-gold-400/50" />
    </div>
  )
}

const stats = [
  { value: '66', label: 'Books' },
  { value: '1,189', label: 'Chapters' },
  { value: '313', label: 'Reading Days' },
  { value: '3–4', label: 'Chapters / Day' },
]

const steps = [
  {
    icon: UserPlus,
    title: 'Sign Up',
    desc: 'Create your account and join the community of readers committed to the Word.',
  },
  {
    icon: BookMarked,
    title: 'Read Daily',
    desc: 'Follow the plan Monday through Saturday — 3 to 4 chapters each day. Sundays rest.',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    desc: 'Mark readings complete, build streaks, and watch your progress grow all year.',
  },
]

const features = [
  {
    icon: CheckCircle,
    title: 'Daily Toggle',
    desc: 'One tap to mark your reading done. Instant, satisfying, keeps you accountable.',
  },
  {
    icon: Calendar,
    title: 'Calendar View',
    desc: 'See the full year at a glance. Green means done. Know exactly where you stand.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    desc: 'Percentage complete, current streak, personal stats — all in your dashboard.',
  },
  {
    icon: ClipboardList,
    title: 'Bi-Weekly Quizzes',
    desc: 'Short quizzes every two weeks to reinforce what you\'ve read and deepen retention.',
  },
]

export default function LandingPage() {
  const { timeLeft, started } = useCountdown('2026-04-01T00:00:00')

  return (
    <div className="overflow-hidden">
      {/* ═══════════ HERO ═══════════ */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-24"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(27,42,74,0.97) 0%, rgba(14,21,37,1) 100%)
          `,
        }}
      >
        {/* Subtle grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gold corner ornaments */}
        <Ornament className="absolute top-6 left-6 w-20 h-20 md:w-28 md:h-28 text-gold-400" />
        <Ornament className="absolute top-6 right-6 w-20 h-20 md:w-28 md:h-28 text-gold-400" flip />
        <Ornament className="absolute bottom-6 left-6 w-20 h-20 md:w-28 md:h-28 text-gold-400 rotate-180" flip />
        <Ornament className="absolute bottom-6 right-6 w-20 h-20 md:w-28 md:h-28 text-gold-400 rotate-180" />

        {/* Faint radial gold glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(197,165,90,0.07) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Eyebrow */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/25 bg-gold-400/5 mb-8">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              <span className="text-gold-300 text-xs tracking-[0.2em] uppercase font-medium">
                IOGC Bible Reading 365
              </span>
            </div>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={0.1}>
            <h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-6"
              style={{ textShadow: '0 2px 40px rgba(197,165,90,0.15)' }}
            >
              Reading the Word.
              <br />
              <span className="text-gold-400">Together.</span>
            </h1>
          </FadeIn>

          {/* Subtext */}
          <FadeIn delay={0.2}>
            <p className="text-navy-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
              Join us in reading the entire King James Bible — Genesis to
              Revelation — Together. You will learn something. Guaranteed.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-gold-400 text-navy-900 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gold-300 hover:shadow-[0_8px_32px_rgba(197,165,90,0.35)] hover:-translate-y-0.5"
              >
                Join the Challenge
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/plan/print"
                className="inline-flex items-center gap-2 px-8 py-4 border border-navy-500 text-navy-200 rounded-xl font-medium text-lg transition-all duration-300 hover:border-gold-400/40 hover:text-gold-300 hover:bg-gold-400/5"
              >
                <BookOpen className="h-5 w-5" />
                View Reading Plan
              </Link>
            </div>
          </FadeIn>

          {/* Countdown / In Progress */}
          <FadeIn delay={0.45}>
            <div className="mt-14">
              {started ? (
                <div className="inline-flex items-center gap-2 text-gold-400/80 text-sm tracking-wide">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                  </span>
                  The reading plan is in progress — jump in today
                </div>
              ) : (
                <div>
                  <p className="text-navy-400 text-xs tracking-[0.15em] uppercase mb-3">
                    The journey begins in
                  </p>
                  <div className="flex items-center justify-center gap-3 sm:gap-5">
                    {[
                      { v: timeLeft.days, l: 'Days' },
                      { v: timeLeft.hours, l: 'Hrs' },
                      { v: timeLeft.minutes, l: 'Min' },
                      { v: timeLeft.seconds, l: 'Sec' },
                    ].map(({ v, l }) => (
                      <div key={l} className="flex flex-col items-center">
                        <span className="font-serif text-3xl sm:text-4xl text-white tabular-nums">
                          {String(v ?? 0).padStart(2, '0')}
                        </span>
                        <span className="text-navy-400 text-[10px] tracking-widest uppercase mt-1">{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-navy-500">
          <ChevronDown className="h-5 w-5" />
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="relative bg-navy-800 border-y border-gold-400/15">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(197,165,90,0.03) 50%, transparent 100%)',
          }}
        />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div className="font-serif text-3xl md:text-4xl text-gold-400 mb-1">{value}</div>
                  <div className="text-navy-300 text-sm tracking-wide uppercase">{label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="bg-navy-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <GoldRule className="mb-6" />
              <h2 className="font-serif text-3xl md:text-4xl text-navy-800 mb-3">
                How It Works
              </h2>
              <p className="text-navy-500 max-w-lg mx-auto">
                Three simple steps. One life-changing commitment.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-gold-200 via-gold-400/40 to-gold-200" />

            {steps.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.12}>
                <div className="relative flex flex-col items-center text-center">
                  {/* Step number circle */}
                  <div className="relative mb-5">
                    <div className="w-14 h-14 rounded-full bg-navy-800 flex items-center justify-center shadow-lg shadow-navy-800/20 ring-4 ring-navy-50">
                      <Icon className="h-6 w-6 text-gold-400" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gold-400 text-navy-900 text-xs font-bold flex items-center justify-center shadow">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-navy-800 mb-2">{title}</h3>
                  <p className="text-navy-500 text-sm leading-relaxed max-w-xs">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section
        className="py-24 px-6"
        style={{
          background: 'linear-gradient(180deg, #f0f3f8 0%, #ffffff 50%, #f0f3f8 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <GoldRule className="mb-6" />
              <h2 className="font-serif text-3xl md:text-4xl text-navy-800 mb-3">
                Your Companion for the Journey
              </h2>
              <p className="text-navy-500 max-w-lg mx-auto">
                Tools designed to keep you faithful, motivated, and growing.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <div className="group relative bg-white rounded-2xl p-7 border border-navy-100 transition-all duration-300 hover:shadow-lg hover:shadow-navy-800/5 hover:border-gold-300/50 hover:-translate-y-0.5">
                  {/* Subtle gold corner accent on hover */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute -top-8 -right-8 w-16 h-16 rotate-45 bg-gradient-to-br from-gold-400/10 to-transparent" />
                  </div>

                  <div className="flex gap-5">
                    <div className="w-11 h-11 rounded-xl bg-navy-800 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:bg-navy-700 transition-colors duration-300">
                      <Icon className="h-5 w-5 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-navy-800 mb-1.5">{title}</h3>
                      <p className="text-navy-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ SCRIPTURE QUOTE ═══════════ */}
      <section
        className="relative py-28 px-6"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 50% 50%, rgba(27,42,74,0.96) 0%, rgba(14,21,37,1) 100%)
          `,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative gold lines */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-16 bg-gradient-to-b from-transparent to-gold-400/30" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-px h-16 bg-gradient-to-t from-transparent to-gold-400/30" />

        <FadeIn>
          <div className="relative max-w-3xl mx-auto text-center">
            {/* Large decorative quote mark */}
            <div
              className="font-serif text-[120px] md:text-[180px] leading-none text-gold-400/10 absolute -top-10 left-1/2 -translate-x-1/2 select-none pointer-events-none"
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <blockquote className="relative">
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-white/95 leading-snug italic mb-8">
                Thy word is a lamp unto my feet,
                <br className="hidden sm:block" />
                and a light unto my path.
              </p>
              <GoldRule className="mb-6" />
              <cite className="not-italic text-gold-400/80 tracking-[0.15em] uppercase text-sm">
                Psalm 119 : 105
              </cite>
            </blockquote>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="bg-navy-50 py-24 px-6">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <GoldRule className="mb-8" />
            <h2 className="font-serif text-3xl md:text-4xl text-navy-800 mb-4">
              Ready to Begin?
            </h2>
            <p className="text-navy-500 mb-10 max-w-md mx-auto leading-relaxed">
              Commit to reading the Word every day. Join a community of believers growing
              in knowledge and faith — one chapter at a time.
            </p>
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 px-10 py-4 bg-navy-800 text-gold-400 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-navy-700 hover:shadow-[0_8px_32px_rgba(27,42,74,0.3)] hover:-translate-y-0.5"
            >
              Start Your Journey
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-navy-900 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-gold-400/70" />
          <span className="text-navy-300 text-sm font-medium">
            IOGC Bible Reading <span className="text-gold-400/70">365</span>
          </span>
        </div>
        <p className="text-navy-500 text-xs">
          April 2026 – March 2027 &middot; King James Version
        </p>
      </footer>
    </div>
  )
}
