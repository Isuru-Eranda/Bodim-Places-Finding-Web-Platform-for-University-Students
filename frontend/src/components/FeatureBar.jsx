import { ShieldCheck, Sparkles, View, MapPin, MessageCircle } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    desc: 'Every property is manually verified by our team.',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    desc: 'Smart matching based on your preferences.',
  },
  {
    icon: View,
    title: '360° Room Views',
    desc: 'Explore rooms virtually before visiting.',
  },
  {
    icon: MapPin,
    title: 'Nearby Search',
    desc: 'Find boarding within walking distance.',
  },
  {
    icon: MessageCircle,
    title: 'AI Chat Assistant',
    desc: 'Get instant answers to your questions.',
  },
];

export default function FeatureBar() {
  return (
    <section className="bg-brown-50 border-y border-[#E5E7EB] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl border border-[#E5E7EB] flex items-center justify-center shadow-sm">
                <Icon size={22} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1F2937]">{title}</p>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
