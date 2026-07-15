import React, { useState } from "react";
import { 
  ShieldAlert, 
  PhoneCall, 
  Eye, 
  Compass, 
  Smartphone, 
  Compass as TrainIcon, 
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink
} from "lucide-react";

export const SafetyTipsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const helplines = [
    { name: "Emergency Police/SOS Dispatch", number: "911", desc: "For extreme life threat or immediate emergency dispatch." },
    { name: "Women's Safety National Helpline", number: "1-800-799-7233", desc: "Domestic safety, crisis support, and direct community resources." },
    { name: "National Sexual Assault Hotline", number: "1-800-656-4673", desc: "Confidential healthcare advice, legal aid, and counseling." },
    { name: "Mental Health Emergency Line", number: "988", desc: "Crisis distress support, immediate counselor support." }
  ];

  const safetyCategories = [
    {
      id: "night",
      title: "Night Travel & Walk Safety",
      icon: Compass,
      color: "border-l-indigo-400 text-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10",
      tips: [
        "Stick to well-lit, busy routes even if it adds 5-10 minutes to your journey.",
        "Keep at least one ear open—avoid wearing both headphones so you remain fully alert.",
        "Have your keys or SOS launcher ready in your hand before reaching your vehicle or house door.",
        "Share your live transit journey with trusted contacts (use SafeHer Active Journey tracker!)."
      ]
    },
    {
      id: "defense",
      title: "Tactical Self-Defense Tips",
      icon: ShieldCheck,
      color: "border-l-red-400 text-red-500 bg-red-50/20 dark:bg-red-950/10",
      tips: [
        "Aim for vulnerability points: Eyes, throat, groin, or shins if grabbed.",
        "Establish space and make excessive noise immediately: yell 'FIRE!' or 'STAY BACK!' to grab attention.",
        "Carry non-lethal protection tools (pepperspray, loud audible alarm keychains) in an easy-access outer pocket.",
        "Your first objective is always to escape—never stay to fight if a pathway opens up."
      ]
    },
    {
      id: "transit",
      title: "Public Transport Guidelines",
      icon: ShieldAlert,
      color: "border-l-blue-400 text-blue-500 bg-blue-50/20 dark:bg-blue-950/10",
      tips: [
        "Wait for trains/buses in highly visible designated safety zones, close to security cameras.",
        "On near-empty trains, sit near the operator cabin or transit guards.",
        "If someone makes you uncomfortable, move seats immediately or change cabins at the next stop.",
        "Keep your personal luggage secure and held in your lap rather than on the floor."
      ]
    },
    {
      id: "online",
      title: "Online & Cyber Security",
      icon: Smartphone,
      color: "border-l-emerald-400 text-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10",
      tips: [
        "Avoid posting real-time location check-ins on social media—wait until you have left the venue.",
        "Enable multi-factor authentication (MFA) on your safety accounts and password managers.",
        "Review your mobile app permissions—revoke background location access for non-essential apps.",
        "Be cautious of sharing personal phone numbers or family details on public community bios."
      ]
    }
  ];

  const filteredCategories = safetyCategories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tips.some((tip) => tip.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="safety-tips-page" className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
          Safety Center & Helplines
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Professional safety guidelines, self-defense strategies, and verified distress hotlines.
          </p>
      </div>

      {/* Helplines Bento list */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4 text-accent" /> National Emergency Helplines
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {helplines.map((line, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-card-dark rounded-3xl border border-pink-100/30 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3 group hover:border-accent/35 transition-all"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{line.name}</h4>
                <p className="text-2xl font-display font-extrabold text-accent dark:text-pink-400 mt-1 font-mono tracking-tight">
                  {line.number}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal pt-1">{line.desc}</p>
              </div>

              <a
                href={`tel:${line.number.replace(/[^0-9]/g, "")}`}
                className="mt-2 py-2 bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/30 dark:hover:bg-pink-900/30 text-accent dark:text-pink-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Hotline Now
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Guideline modules list */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-accent" /> Safe Living Guideline Library
          </h2>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search safety topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-card-dark border border-pink-100/30 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className={`p-6 bg-white dark:bg-card-dark rounded-3xl border-l-4 border-y border-r border-pink-50 dark:border-slate-800 shadow-sm space-y-4 ${cat.color}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                  <cat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-extrabold text-slate-900 dark:text-white text-base">
                  {cat.title}
                </h3>
              </div>

              <ul className="space-y-3 pt-2">
                {cat.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-normal">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-100/50 dark:bg-slate-900 text-xs font-bold text-accent">
                      {idx + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
