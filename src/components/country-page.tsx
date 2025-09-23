'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import FlightSearchForm from '@/components/flight-search-form';
import FlightSearchFormMobile from '@/components/flight-search-form-mobile';
import StickySearchInput from '@/components/sticky-search-input';
import SearchModal from '@/components/search-modal';
import { loadCountriesContent, type CountryContent, DEFAULT_COUNTRY_CONTENT } from '../lib/countriesAdmin';
import { getNearbyAirports, Airport } from '@/lib/utils';
import { type Coordinates } from '@/app/page';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { motion, AnimatePresence } from 'framer-motion';

interface CountryPageProps {
  slug: string;
}

const IMAGE_FALLBACKS: Record<string, string> = {
  'united-arab-emirates': '/images/london-big.jpg',
  'united-kingdom': '/images/london-big.jpg',
  'netherlands': '/images/london-big.jpg',
  'singapore': '/images/london-big.jpg',
  'germany': '/images/london-big.jpg',
  'australia': '/images/london-big.jpg',
  'portugal': '/images/london-big.jpg',
  'turkey': '/images/london-big.jpg',
  'japan': '/images/london-big.jpg',
  'qatar': '/images/london-big.jpg',
  'united-states': '/images/countries/united-states.jpg',
  'canada': '/images/countries/canada.jpg',
  'switzerland': '/images/countries/switzerland.jpg',
};

export default function CountryPage({ slug }: CountryPageProps) {
  const [countryContent, setCountryContent] = useState<CountryContent>(DEFAULT_COUNTRY_CONTENT[slug] || DEFAULT_COUNTRY_CONTENT['united-kingdom']);
  const [isLoading, setIsLoading] = useState(true);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [nearestAirport, setNearestAirport] = useState<Airport | null>(null);
  const [isSticky, setSticky] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const searchState = useFlightSearch(nearestAirport);

  useEffect(() => {
    let cancelled = false;
    const loadContent = async () => {
      try {
        const content = await loadCountriesContent();
        if (!cancelled) {
          setCountryContent(content[slug] || DEFAULT_COUNTRY_CONTENT[slug] || DEFAULT_COUNTRY_CONTENT['united-kingdom']);
        }
      } catch {
        // Failed to load country content
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    loadContent();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    const fetchLocationAndAirport = async () => {
      try {
        const response = await fetch('/api/geolocation');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const currentCoords = {
            latitude: data.latitude,
            longitude: data.longitude,
          };
          setCoords(currentCoords);
          const nearby = getNearbyAirports(currentCoords.latitude, currentCoords.longitude, 1);
          if (nearby.length > 0) {
            setNearestAirport(nearby[0]);
          }
        } else {
          // Failed to get location from IP API
        }
      } catch {
        // Error fetching IP geolocation
      }
    };

    fetchLocationAndAirport();
  }, []);

  useEffect(() => {
    if (!formRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSticky(!entry.isIntersecting),
      { rootMargin: '0px', threshold: 0 }
    );

    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current && countryContent.heroVideo) {
      videoRef.current.play().catch(() => {
        // Silently handle video play errors
      });
    }
  }, [countryContent.heroVideo]);

  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ABAB5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  const heroSrc = countryContent.heroImage || IMAGE_FALLBACKS[slug] || '/images/london-big.jpg';

  return (
    <main className="min-h-screen w-full bg-white">
      {/* Hero */}
      <section className="relative w-full min-h-[700px] pb-8 md:pb-12">
        <div className="absolute inset-0">
          {/* Static Image */}
          <Image
            src={heroSrc}
            alt={`${countryContent.title} landscape`}
            fill
            priority
            className={`object-cover object-center transition-opacity duration-1000 ${
              countryContent.heroVideo && !videoError ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {/* Video Background */}
          {countryContent.heroVideo && !videoError && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-1000"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={() => setVideoError(true)}
            >
              <source src={countryContent.heroVideo} type="video/mp4" />
            </video>
          )}
          
          {/* Brand color gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0ABAB5]/45 via-[#0ABAB5]/25 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col min-h-[700px]">
          <Navbar isDarkBackground={true} />
          <div className="flex-1 w-full max-w-[1280px] mx-auto px-2 flex flex-col items-center justify-start pt-16">
            <div className="text-white text-center w-full">
              <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight drop-shadow-lg">{countryContent.title}</h1>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold drop-shadow-md">{countryContent.subtitle}</p>
              <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-white/95 drop-shadow-md">
                {countryContent.description}
              </p>
            </div>
            {/* Form under hero text - separate container to avoid inheriting text-center/text-white */}
            <div className="mt-8 w-full text-left">
              {/* Sticky Header with Animation */}
              <AnimatePresence>
                {isSticky && (
                <motion.div
                    className="fixed top-0 left-0 right-0 z-40 shadow-lg"
                    style={{ backgroundColor: '#0ABAB5' }}
                    initial={{ y: -120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -120, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <div className="max-w-[1280px] mx-auto py-2 px-2">
                        <div className="hidden md:block w-full">
                            <FlightSearchForm 
                              isSticky={isSticky}
                              {...searchState}
                            />
                        </div>
                        <div className="block md:hidden w-full">
                            <StickySearchInput 
                              fromSelection={searchState.fromSelection}
                              toSelection={searchState.toSelection}
                              onClick={() => setIsModalOpen(true)}
                            />
                        </div>
                    </div>
                </motion.div>
                )}
              </AnimatePresence>

              {/* Flight search forms - responsive */}
              <div ref={formRef} className={`w-full transition-opacity duration-300 ${isSticky ? 'opacity-0' : 'opacity-100'}`}>
                {/* Desktop form */}
                <div className="hidden md:block w-full">
                  <FlightSearchForm 
                    isSticky={isSticky}
                    {...searchState}
                  />
                </div>
                
                {/* Mobile form */}
                <div className="block md:hidden w-full">
                  <FlightSearchFormMobile 
                    {...searchState}
                    coords={coords}
                  />
                </div>
              </div>

              {/* Search Modal */}
              <SearchModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              >
                <FlightSearchFormMobile 
                  {...searchState}
                  coords={coords}
                />
              </SearchModal>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-[1280px] mx-auto px-2 py-10 sm:py-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {countryContent.introTitle || `Enjoy Your ${countryContent.title} Trip With Fly Lux Sky`}
        </h2>
        <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {countryContent.introText || `Explore ${countryContent.title}'s rich culture and stunning destinations. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.`}
        </p>
      </section>

      {/* Why Choose */}
      <section className="max-w-[1280px] mx-auto px-2 pb-4 sm:pb-10 text-center">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Choose Fly Lux Sky for {countryContent.title}?</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-2xl bg-[#0ABAB5] p-6 text-white text-center">
            <h4 className="text-lg font-semibold">Exclusive Fare Access</h4>
            <p className="mt-2">
              Find competitive prices on business & first class flights to {countryContent.title} that aren't available elsewhere.
            </p>
          </div>
          <div className="rounded-2xl bg-[#0ABAB5] p-6 text-white text-center">
            <h4 className="text-lg font-semibold">Flexible Travel Plans</h4>
            <p className="mt-2">
              Our travel advisors adjust ticketing and schedules to fit your needs.
            </p>
          </div>
          <div className="rounded-2xl bg-[#0ABAB5] p-6 text-white text-center">
            <h4 className="text-lg font-semibold">Expert Booking Support</h4>
            <p className="mt-2">
              Get help from advisors who know how to secure the best options and handle your booking smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA text */}
      <section className="max-w-[1280px] mx-auto px-2 py-10 sm:py-14 text-center">
        <h3 className="sr-only">Book your flight</h3>
        <p className="text-gray-900 text-lg sm:text-xl font-semibold max-w-4xl mx-auto">
          {countryContent.ctaTitle || `Book Your ${countryContent.title} Business Class Flight Today.`}
        </p>
        <p className="mt-3 text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
          {countryContent.ctaText || `Let Fly Lux Sky elevate your journey to ${countryContent.title} with unmatched luxury and convenience. Contact our expert travel advisors to secure your exclusive fare and experience like never before.`}
        </p>
      </section>
    </main>
  );
}