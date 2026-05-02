import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import FeatureBar from '../components/FeatureBar';
import ListingsSection from '../components/ListingsSection';
import StatsSection from '../components/StatsSection';
import Testimonials from '../components/Testimonials';
import { getListings } from '../services/api';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial listings on mount
  useEffect(() => {
    let cancelled = false;

    const fetchInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getListings();
        if (!cancelled) {
          setListings(res.data?.data || res.data || []);
        }
      } catch {
        if (!cancelled) {
          // Silently fall back to mock listings shown in ListingsSection
          setListings([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInitial();
    return () => { cancelled = true; };
  }, []);

  return (
    <main>
      <Hero
        setListings={setListings}
        setLoading={setLoading}
        setError={setError}
      />
      <FeatureBar />
      <ListingsSection listings={listings} loading={loading} error={error} />
      <StatsSection />
      <Testimonials />
    </main>
  );
}
