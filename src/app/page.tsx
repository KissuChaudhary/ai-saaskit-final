'use client'

import Image from 'next/image'
import Link from 'next/link'
import FaqItem from './components/FaqItem'
import PricingSection from './components/PricingCard'




const faqs = [
  {
    question: 'What is included in the starter package?',
    answer: 'The starter package includes all essential features to get your project up and running, including basic analytics, community support, and API access.',
  },
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Yes, you can upgrade your plan at any time. Your new features will be available immediately after upgrading.',
  },
  {
    question: 'Do you offer custom development?',
    answer: 'Yes, our enterprise plan includes custom development options to meet your specific needs.',
  },
]

const testimonials = [
  {
    content: "This toolkit saved us months of development time. We launched our MVP in just 2 weeks!",
    author: {
      name: "Sarah Chen",
      avatar: "/avatars/placeholder.svg",
      title: "CTO at TechStart"
    },
    stats: [
      { label: "Time Saved", value: "3 months" },
      { label: "ROI", value: "300%" }
    ]
  },
  {
    content: "The code quality is exceptional. It's like having a senior developer on the team.",
    author: {
      name: "Mike Johnson",
      avatar: "/avatars/placeholder.svg",
      title: "Lead Developer"
    }
  },
  {
    content: "Best investment we made for our startup. The support is amazing too!",
    author: {
      name: "Lisa Park",
      avatar: "/avatars/placeholder.svg",
      title: "Founder at AppLabs"
    }
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">


      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-6">
                <span className="mr-2">⚡</span> Ship faster with our SaaS Kit
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Ship your startup<br />in days, not weeks
              </h1>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                The fastest way to build and deploy your startup with production-ready code
              </p>
              <div className="flex items-center space-x-4 mb-8">
                <div className="flex items-center bg-white/5 px-3 py-1 rounded-full">
                  <div className="flex">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i} className="text-[#FFBE1A]">
                        {star}
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-[#FFBE1A] font-medium">4.9/5</span>
                  <span className="mx-2 text-white/30">•</span>
                  <span className="text-white/70">from 1000+ reviews</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth?view=sign-up"
                  className="inline-flex justify-center items-center px-6 py-3 rounded-lg bg-[#FFBE1A] text-black font-medium hover:bg-[#FFBE1A]/90 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="https://github.com/zainulabedeen123/best-saas-kit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center px-6 py-3 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                  </svg>
                  Github Repo
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/Saas-Header.png"
                alt="SaaS Platform Preview"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-16">
            {/* Launch Time */}
            <div className="text-[#4ADE80] text-sm font-mono">
              const launch_time = "01:19 AM";
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white/90 to-white/60 bg-clip-text text-transparent">
                Supercharge your app instantly,<br />
                launch faster, make $
              </h2>
              <p className="text-lg text-white/60 max-w-3xl">
                Login users, process payments and send emails at lightspeed. Spend your time building 
                your startup, not integrating APIs. ShipFast provides you with the boilerplate code you 
                need to launch, FAST.
              </p>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-2xl">@</span>
                </div>
                <span className="text-white/60 text-sm">Emails</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <span className="text-white/60 text-sm">Payments</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <span className="text-white/60 text-sm">Login</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-2xl">🗄️</span>
                </div>
                <span className="text-white/60 text-sm">Database</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <span className="text-white/60 text-sm">SEO</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <span className="text-white/60 text-sm">Style</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-2xl">⋯</span>
                </div>
                <span className="text-[#FFBE1A] text-sm">More</span>
              </div>
            </div>

            {/* Feature List */}
            <div className="space-y-4 text-lg">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">Tips to write copy that sells</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">Discord community to stay accountable</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">
                  <span className="text-[#FFBE1A]">Crisp</span> customer support (auto show/hide, variables...)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">Collect emails for a waitlist if your product isn't ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">Prompts to generate terms & privacy policy with ChatGPT</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">Copy paste code templates</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-[#4ADE80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-white/80">Dead simple tutorials</span>
              </div>
            </div>

            {/* Time Saved */}
            <div className="text-[#4ADE80] text-lg">
              Time saved: ∞ hours
            </div>
          </div>
        </div>
      </section>

      {/* Time Breakdown Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1A1311] rounded-3xl p-10 text-center">
            <div className="space-y-3">
              <div className="text-[#FF6B6B] font-medium">4 hrs <span className="text-white/60">to set up emails</span></div>
              <div><span className="text-[#FF6B6B] font-medium">+ 6 hrs</span> <span className="text-white/60">designing a landing page</span></div>
              <div><span className="text-[#FF6B6B] font-medium">+ 4 hrs</span> <span className="text-white/60">to handle Stripe webhooks</span></div>
              <div><span className="text-[#FF6B6B] font-medium">+ 2 hrs</span> <span className="text-white/60">for SEO tags</span></div>
              <div><span className="text-[#FF6B6B] font-medium">+ 1 hr</span> <span className="text-white/60">applying for Google Oauth</span></div>
              <div><span className="text-[#FF6B6B] font-medium">+ 3 hrs</span> <span className="text-white/60">for DNS records</span></div>
              <div><span className="text-[#FF6B6B] font-medium">+ 2 hrs</span> <span className="text-white/60">for protected API routes</span></div>
              <div><span className="text-[#FF6B6B] font-medium">+ ∞ hrs</span> <span className="text-white/60">overthinking...</span></div>
              <div className="pt-3 flex items-center justify-center gap-2">
                <span className="text-[#FF6B6B] font-medium">= 22+ hours</span>
                <span className="text-white/60">of headaches</span>
                <span className="text-2xl">🌧️</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="inline-flex items-center text-white/60 gap-2">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              There's an easier way
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />
     

      {/* Contact Form Section */}
 

   

      {/* Testimonials Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              5000+ makers built AI tools,<br />
              SaaS, and more
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-[#111111] rounded-xl p-6 border border-white/5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                  SC
                </div>
                <div>
                  <h3 className="text-white font-medium">Sarah Chen</h3>
                  <p className="text-sm text-white/60">CTO at TechStart</p>
                </div>
              </div>
              <p className="text-white/80 mb-6">
                This toolkit saved us months of development time. We launched our MVP in just 2 weeks!
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">3 months</div>
                  <div className="text-sm text-white/60">Time Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#4ADE80]">300%</div>
                  <div className="text-sm text-white/60">ROI</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#111111] rounded-xl p-6 border border-white/5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                  MJ
                </div>
                <div>
                  <h3 className="text-white font-medium">Mike Johnson</h3>
                  <p className="text-sm text-white/60">Lead Developer</p>
                </div>
              </div>
              <p className="text-white/80 mb-6">
                The code quality is exceptional. It's like having a senior developer on the team.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-sm text-white/60">Components</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#4ADE80]">100%</div>
                  <div className="text-sm text-white/60">TypeScript</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#111111] rounded-xl p-6 border border-white/5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-medium">
                  LP
                </div>
                <div>
                  <h3 className="text-white font-medium">Lisa Park</h3>
                  <p className="text-sm text-white/60">Founder at AppLabs</p>
                </div>
              </div>
              <p className="text-white/80 mb-6">
                Best investment we made for our startup. The support is amazing too!
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-white/60">Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#4ADE80]">95%</div>
                  <div className="text-sm text-white/60">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center bg-white/5 px-4 py-2 rounded-full">
              <div className="flex -space-x-2 mr-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#111111] bg-gradient-to-br from-purple-500 to-pink-500"
                    style={{ transform: `translateX(${i * -4}px)` }}
                  />
                ))}
              </div>
              <div className="text-white/60 text-sm">
                Join <span className="text-white font-medium">5,000+</span> makers
              </div>
            </div>
          </div>
        </div>
      </section>

   {/* FAQ Section */}
   <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem key={index} {...faq} />
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
