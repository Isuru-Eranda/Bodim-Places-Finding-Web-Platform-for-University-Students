import { ShieldCheck, Users, MapPin, Lock } from 'lucide-react';

const stats = [
  {
    icon: ShieldCheck,
    value: '1,250+',
    label: 'Verified Places',
    desc: 'Hand-checked and approved by our team',
  },
  {
    icon: Users,
    value: '8,500+',
    label: 'Happy Students',
    desc: 'University students placed successfully',
  },
  {
    icon: MapPin,
    value: '25+',
    label: 'University Areas',
    desc: 'Covering all major university zones',
  },
  {
    icon: Lock,
    value: '100%',
    label: 'Secure & Trusted',
    desc: 'Safe transactions and verified owners',
  },
];

export default function StatsSection() {
  return (
    <section className="bg-[#1F2937] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-white">
            Trusted by Students Across Sri Lanka
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Numbers that reflect our commitment to quality
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label, desc }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              <p className="text-orange-400 font-semibold text-sm mb-2">{label}</p>
              <p className="text-gray-400 text-xs leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
