import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Users,
  MapPin,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "1,250+", label: "Verified Listings" },
  { value: "8,500+", label: "Students Helped" },
  { value: "25+", label: "University Zones" },
  { value: "4.8★", label: "Average Rating" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    desc: "Every listing is hand-verified by our team before going live. Students can browse with complete peace of mind.",
  },
  {
    icon: Users,
    title: "Student-First",
    desc: "Built exclusively for university students in Sri Lanka. Every feature is designed around your needs and budget.",
  },
  {
    icon: Zap,
    title: "Smart Technology",
    desc: "Our AI-powered recommendation engine matches you with the perfect room based on your preferences in seconds.",
  },
  {
    icon: Heart,
    title: "Community",
    desc: "We connect students with verified, caring property owners to build long-lasting and comfortable relationships.",
  },
];

const timeline = [
  {
    year: "2023",
    title: "The Idea",
    desc: "Three university students struggle to find safe, affordable boarding. Bodim Finder is born on a whiteboard.",
  },
  {
    year: "2024",
    title: "First Launch",
    desc: "MVP launched covering Colombo and Peradeniya university zones with 150+ verified listings.",
  },
  {
    year: "2025",
    title: "AI Integration",
    desc: "Smart recommendation engine and 360° virtual tours added, reaching 5,000+ active users.",
  },
  {
    year: "2026",
    title: "National Scale",
    desc: "Expanded to 25+ university zones island-wide with 1,250+ listings and 8,500+ students helped.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function About() {
  return (
    <div className="min-h-screen bg-[#FFFDFB]">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#1F2937] to-[#374151] py-20 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-full mb-5">
          <Star size={13} className="text-orange-400 fill-orange-400" />
          <span className="text-xs font-semibold text-orange-300">
            Our Story
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
          About <span className="text-orange-400">Bodim Finder</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          We're on a mission to make finding safe, affordable university
          boarding in Sri Lanka simple, transparent, and stress-free for every
          student.
        </p>
      </div>

      {/* ── Stats bar ── */}
      <div className="bg-orange-500">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-white">{value}</p>
              <p className="text-orange-100 text-sm font-medium mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mission & Vision ── */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-[#F9FAFB] rounded-2xl p-8 border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
            <Target className="w-6 h-6 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-3">
            Our Mission
          </h2>
          <p className="text-[#6B7280] leading-relaxed">
            To empower every Sri Lankan university student with access to
            verified, affordable, and comfortable boarding places — eliminating
            the anxiety and uncertainty that comes with leaving home for the
            first time.
          </p>
        </div>
        <div className="bg-[#1F2937] rounded-2xl p-8">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-5">
            <Eye className="w-6 h-6 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Our Vision</h2>
          <p className="text-gray-300 leading-relaxed">
            A Sri Lanka where no university student has to worry about finding a
            place to stay. We envision a trusted, nationwide platform that
            connects students and owners through technology, transparency, and
            community.
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-[#F9FAFB] border-y border-gray-100 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full mb-4">
              <Heart size={13} className="text-orange-500" />
              <span className="text-xs font-semibold text-orange-600">
                What We Stand For
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#1F2937]">
              Our Core Values
            </h2>
            <p className="text-[#6B7280] text-sm mt-2 max-w-md mx-auto">
              The principles that guide every decision we make at Bodim Finder.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-[#1F2937] font-semibold mb-2">{title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story / Timeline ── */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full mb-4">
            <MapPin size={13} className="text-orange-500" />
            <span className="text-xs font-semibold text-orange-600">
              Our Journey
            </span>
          </div>
          <h2 className="text-3xl font-bold text-[#1F2937]">How We Got Here</h2>
          <p className="text-[#6B7280] text-sm mt-2 max-w-md mx-auto">
            From a whiteboard sketch to helping thousands of students across Sri
            Lanka.
          </p>
        </div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-orange-200 md:left-1/2" />

          <div className="space-y-10">
            {timeline.map(({ year, title, desc }, idx) => {
              const isRight = idx % 2 === 0;
              return (
                <div
                  key={year}
                  className={`relative flex flex-col md:flex-row ${isRight ? "md:flex-row" : "md:flex-row-reverse"} items-start md:items-center gap-6`}
                >
                  {/* dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow -translate-x-1/2 z-10 top-1" />

                  {/* card */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[45%] ${isRight ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"}`}
                  >
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                        {year}
                      </span>
                      <h3 className="text-[#1F2937] font-bold text-lg mb-1">
                        {title}
                      </h3>
                      <p className="text-[#6B7280] text-sm leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Developer ── */}
      <section className="bg-[#1F2937] py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-full mb-4">
              <Users size={13} className="text-orange-400" />
              <span className="text-xs font-semibold text-orange-300">
                The Developer
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              Behind the Project
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
              Bodim Finder is a final year undergraduate project — designed,
              built, and deployed entirely by one developer.
            </p>
          </div>

          {/* Solo developer card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Isuru&backgroundColor=FFEDD5"
              alt="Isuru Eranda"
              className="w-28 h-28 rounded-full bg-orange-100 shrink-0"
            />
            <div className="text-center sm:text-left">
              <h3 className="text-white font-bold text-2xl">Isuru Eranda</h3>
              <p className="text-orange-400 text-sm font-semibold mt-1 mb-4">
                Full-Stack Developer &mdash; Final Year Project
              </p>
              <p className="text-gray-300 leading-relaxed mb-5">
                This platform was conceived, designed, and developed solely by
                me as my final year project. I handled every layer of the
                application — UI/UX design, React frontend, Node.js/Express
                backend, MongoDB database, REST API, AI integration, and
                deployment — with the goal of solving a real problem faced by
                university students in Sri Lanka.
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {[
                  "React",
                  "Node.js",
                  "Express",
                  "MongoDB",
                  "Tailwind CSS",
                  "REST API",
                  "AI / OpenAI",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="bg-orange-500/20 text-orange-300 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-4">
            Ready to find your perfect boarding place?
          </h2>
          <p className="text-[#6B7280] mb-8">
            Join thousands of students who found their home away from home with
            Bodim Finder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Browse Listings
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 hover:border-orange-400 hover:text-orange-500 text-[#1F2937] font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
