import { Link } from 'react-router-dom';
import SearchBox from './SearchBox';

export default function Hero({ setListings, setLoading, setError }) {
  return (
    <section className="bg-[#FFFDFB] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brown-50 border border-brown-50 rounded-full">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="text-sm font-medium text-brown-600">Smart. Verified. Trusted.</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl lg:text-5xl xl:text-[52px] font-bold text-[#1F2937] leading-tight">
              Find the Perfect{' '}
              <span className="text-orange-500">Boarding Place</span>{' '}
              for Your Studies
            </h1>

            {/* Description */}
            <p className="text-[#6B7280] text-lg leading-relaxed max-w-lg">
              Discover safe, affordable, and verified boarding places near your university.
              AI-powered search helps you find the perfect match in minutes.
            </p>

            {/* Feature Bullets */}
            <ul className="space-y-3">
              {[
                'Hundreds of verified listings near top universities',
                'AI-powered recommendations tailored to your needs',
                'Secure booking with transparent pricing',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#6B7280] text-sm">
                  <span className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/browse"
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
              >
                Find a Place
              </Link>
              <Link
                to="/list-property"
                className="px-6 py-3 text-[#1F2937] font-semibold rounded-xl border border-[#E5E7EB] hover:border-orange-500 hover:text-orange-500 transition-colors"
              >
                List Your Property
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-2">
              <div className="text-center">
                <p className="text-xl font-bold text-[#1F2937]">1,250+</p>
                <p className="text-xs text-[#6B7280]">Verified Places</p>
              </div>
              <div className="w-px h-10 bg-[#E5E7EB]"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#1F2937]">8,500+</p>
                <p className="text-xs text-[#6B7280]">Happy Students</p>
              </div>
              <div className="w-px h-10 bg-[#E5E7EB]"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#1F2937]">25+</p>
                <p className="text-xs text-[#6B7280]">University Areas</p>
              </div>
            </div>
          </div>

          {/* Right: Search Box */}
          <div className="lg:pl-8">
            <SearchBox
              setListings={setListings}
              setLoading={setLoading}
              setError={setError}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
