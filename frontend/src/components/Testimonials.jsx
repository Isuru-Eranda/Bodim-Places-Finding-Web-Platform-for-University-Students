import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Kavindi Perera',
    university: 'University of Colombo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavindi&backgroundColor=FFEDD5',
    rating: 5,
    review:
      'Bodim Finder made it so easy to find a safe, affordable room near my university. The verified listings gave me peace of mind. Found my perfect place within 2 days!',
  },
  {
    id: 2,
    name: 'Tharanga Bandara',
    university: 'University of Peradeniya',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tharanga&backgroundColor=F3E8E2',
    rating: 5,
    review:
      'The AI recommendation feature is a game changer. It found exactly what I needed based on my budget and facilities. The 360° view saved me multiple trips!',
  },
  {
    id: 3,
    name: 'Nimesha Silva',
    university: 'University of Moratuwa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nimesha&backgroundColor=FFF7ED',
    rating: 4,
    review:
      "As a first-year student I was stressed about finding a place. Bodim Finder's chat assistant answered all my questions and I found a great boarding house close to campus.",
  },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? 'text-orange-500 fill-orange-500' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-brown-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full mb-4">
            <Star size={13} className="text-orange-500 fill-orange-500" />
            <span className="text-xs font-semibold text-orange-600">Student Reviews</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">What Students Say</h2>
          <p className="text-[#6B7280] text-sm mt-2 max-w-md mx-auto">
            Real experiences from real students who found their boarding place on Bodim Finder
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-5 right-5 w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <Quote size={14} className="text-orange-400" />
              </div>

              {/* Rating */}
              <StarRating count={t.rating} />

              {/* Review */}
              <p className="text-[#6B7280] text-sm leading-relaxed mt-4 mb-6">
                "{t.review}"
              </p>

              {/* Profile */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full bg-orange-100 border border-[#E5E7EB]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/40x40/F3E8E2/8B5E3C?text=${t.name[0]}`;
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">{t.name}</p>
                  <p className="text-xs text-[#6B7280]">{t.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
