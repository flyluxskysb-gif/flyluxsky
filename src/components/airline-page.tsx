'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import FlightSearchForm from '@/components/flight-search-form';
import FlightSearchFormMobile from '@/components/flight-search-form-mobile';
import StickySearchInput from '@/components/sticky-search-input';
import SearchModal from '@/components/search-modal';
import { getNearbyAirports, Airport } from '@/lib/utils';
import { type Coordinates } from '@/app/page';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { loadAirlinesContent, saveAirlinesContent, type AirlineContent } from '@/lib/airlinesAdmin';
import AirlineDealsSection from '@/components/airline-deals-section';

interface AirlinePageProps {
  slug: string;
}

// Default fallback content
const DEFAULT_FALLBACK_CONTENT: AirlineContent = {
  slug: 'emirates-airlines',
  title: 'Emirates Airlines',
  subtitle: 'The Art of Flying',
  description: 'Emirates offers first and business class flights with private space, attentive service, and modern cabins that make international journeys effortless.',
  heroImage: '/images/airlines/Emirates-Airlines-min.jpg',
  introTitle: 'The Emirates Experience',
  introText: 'Emirates has set benchmarks in luxury travel. Every flight blends comfort with scale, turning the idea of long-haul flying into a refined experience.',
  ctaTitle: 'Book Your Emirates Flight Today',
  ctaText: 'Join millions of satisfied passengers who choose Emirates for their business and first-class travel. Experience the difference that true luxury makes.',
  features: [
    {
      title: 'Iconic A380 Fleet',
      description: 'Experience the world\'s largest passenger aircraft with onboard lounges, showers, and spacious cabins.'
    },
    {
      title: 'Dubai Hub Connectivity',
      description: 'Connect to over 150 destinations worldwide through our state-of-the-art Dubai International hub.'
    },
    {
      title: 'Award-Winning Service',
      description: 'Our cabin crew delivers personalized service that has earned Emirates numerous international awards.'
    }
  ],
  routes: [
    { from: 'London', to: 'Dubai', duration: '7h 10m', aircraft: 'A380' },
    { from: 'New York', to: 'Dubai', duration: '12h 30m', aircraft: 'B777' },
    { from: 'Dubai', to: 'Tokyo', duration: '8h 35m', aircraft: 'A380' },
    { from: 'Dubai', to: 'Sydney', duration: '14h 25m', aircraft: 'A380' }
  ],
  classes: [
    {
      name: 'First Class',
      description: 'Private suites with shower spa, fine dining, and chauffeur service',
      features: ['Private suite with sliding doors', 'Onboard shower spa', 'Chauffeur drive service', 'Gourmet dining']
    },
    {
      name: 'Business Class',
      description: 'Lie-flat seats, premium dining, and priority boarding',
      features: ['Lie-flat seats', 'Premium dining', 'Priority boarding', 'Lounge access']
    }
  ]
};



const IMAGE_FALLBACKS: Record<string, string> = {
  'emirates-airlines': '/images/london-big.jpg',
  'singapore-airlines': '/images/paris.jpg',
  'lufthansa-airlines': '/images/rome.jpg',
  'american-airlines': '/images/madrid.jpg',
  'nippon-airlines': '/images/athens.jpg',
  'qantas-airlines': '/images/lisbon.jpg',
  'turkish-airlines': '/images/london.jpg',
  'etihad-airlines': '/images/dubai.jpg',
  'british-airlines': '/images/london.jpg',
  'united-airlines': '/images/chicago.jpg',
  'qatar-airlines': '/images/doha.jpg'
};

const getHeroImage = (slug: string, airlineContent: AirlineContent): string => {
  // Always use heroImage from airline content if available
  if (airlineContent.heroImage) {
    return airlineContent.heroImage;
  }
  // Fallback to airline-specific images from /images/airlines/
  const airlineImages: Record<string, string> = {
    'emirates-airlines': '/images/airlines/Emirates-Airlines-min.jpg',
    'singapore-airlines': '/images/airlines/Singapore-Airlines-min.jpg',
    'lufthansa-airlines': '/images/airlines/Lufthansa-Airlines-min.jpg',
    'american-airlines': '/images/airlines/American-Airlines-min.jpg',
    'nippon-airlines': '/images/airlines/Nippon-Airways-min.jpg',
    'qantas-airlines': '/images/airlines/Qantas-Airways-min.jpg',
    'turkish-airlines': '/images/airlines/Turkish-Airlines-min.jpg',
    'etihad-airlines': '/images/airlines/Etihad-Airlines-min.jpg',
    'british-airlines': '/images/airlines/British-Airways-min.jpg',
    'united-airlines': '/images/airlines/United-Airlines-min.jpg',
    'qatar-airlines': '/images/airlines/Qatar-Airways-min.jpg'
  };
  return airlineImages[slug] || '/images/london-big.jpg';
};

export default function AirlinePage({ slug }: AirlinePageProps) {
  const [airlineContent, setAirlineContent] = useState<AirlineContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load content from admin panel if available
  useEffect(() => {
    const loadAdminContent = async () => {
      const adminContent = await loadAirlinesContent();
      if (adminContent[slug]) {
        const content = adminContent[slug];
        // Convert admin content to component format
       const convertedContent: AirlineContent = {
         slug: content.slug,
         title: content.title,
         subtitle: content.subtitle,
         description: content.description,
         heroImage: content.heroImage,
         introTitle: content.introTitle || '',
         introText: content.introText || '',
         ctaTitle: content.ctaTitle || '',
         ctaText: content.ctaText || '',
         features: content.features || [],
         routes: content.routes || content.popularRoutes?.map(route => ({
            from: route.from,
            to: route.to,
            duration: '8h 30m', // Default duration since popularRoutes doesn't have this field
            aircraft: 'A380' // Default aircraft since popularRoutes doesn't have this field
          })) || [],
         classes: content.classes || content.travelClasses?.map(travelClass => ({
           name: travelClass.name,
           description: travelClass.description,
           features: travelClass.features
         })) || []
       };
        setAirlineContent(convertedContent);
      } else {
        // If no content found for this slug, use fallback
        setAirlineContent(DEFAULT_FALLBACK_CONTENT);
      }
      setIsLoading(false);
    };
    
    loadAdminContent();
    
    // Listen for localStorage changes to sync in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'flyluxsky_airlines_content' && e.newValue) {
        try {
          const updatedContent = JSON.parse(e.newValue);
          if (updatedContent[slug]) {
            const content = updatedContent[slug];
            const convertedContent: AirlineContent = {
              slug: content.slug,
              title: content.title,
              subtitle: content.subtitle,
              description: content.description,
              heroImage: content.heroImage,
              introTitle: content.introTitle || '',
              introText: content.introText || '',
              ctaTitle: content.ctaTitle || '',
              ctaText: content.ctaText || '',
              features: content.features || [],
              routes: content.routes || content.popularRoutes?.map((route: any) => ({
                 from: route.from,
                 to: route.to,
                 duration: '8h 30m',
                 aircraft: 'A380'
               })) || [],
               classes: content.classes || content.travelClasses?.map((travelClass: any) => ({
                 name: travelClass.name,
                 description: travelClass.description,
                 features: travelClass.features
               })) || []
            };
            setAirlineContent(convertedContent);
          }
        } catch (error) {
          console.error('Failed to parse updated content:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [slug]);

  // Function to update content and sync back to admin
  const updateAirlineContent = async (updatedContent: Partial<AirlineContent>) => {
    if (!airlineContent) return;
    const newContent = { ...airlineContent, ...updatedContent };
    setAirlineContent(newContent);
    
    // Save back to admin panel
    try {
      const adminContent = await loadAirlinesContent();
      const updatedAdminContent = {
        ...adminContent,
        [slug]: {
          ...adminContent[slug],
          ...updatedContent,
          // Convert back to admin format if needed
          routes: newContent.routes,
          classes: newContent.classes,
          popularRoutes: newContent.routes?.map(route => ({
            from: route.from,
            to: route.to,
            price: 'From $2,199' // Default price
          })),
          travelClasses: newContent.classes
        }
      };
      saveAirlinesContent(updatedAdminContent);
    } catch (error) {
      console.error('Failed to sync content back to admin:', error);
    }
  };
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [nearestAirport, setNearestAirport] = useState<Airport | null>(null);
  const [isSticky, setSticky] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const searchState = useFlightSearch(nearestAirport);

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
      } catch (error) {
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

  // Show loading state while content is being loaded
  if (isLoading || !airlineContent) {
    return (
      <main className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0ABAB5] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading airline content...</p>
        </div>
      </main>
    );
  }

  const heroSrc = getHeroImage(slug, airlineContent);

  return (
    <main className="min-h-screen w-full bg-white">
      {/* Hero */}
      <section className="relative w-full min-h-[700px] pb-8 md:pb-12">
        <div className="absolute inset-0">
          <Image
            src={heroSrc}
            alt={`${airlineContent.title} aircraft`}
            fill
            priority
            className="object-cover object-center"
          />
          {/* Enhanced overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0FBAB5]/30 via-[#0FBAB5]/75 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col min-h-[700px]">
          <Navbar isDarkBackground={true} />
          <div className="flex-1 w-full max-w-[1280px] mx-auto px-2 flex flex-col items-center justify-start pt-16">
            <div className="text-white text-center w-full">
              <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight drop-shadow-lg">{airlineContent.title}</h1>
              <p className="mt-2 text-2xl sm:text-3xl font-semibold drop-shadow-md">{airlineContent.subtitle}</p>
              <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-white/95 drop-shadow-md">
                {airlineContent.description}
              </p>
            </div>
            <div className="mt-8 w-full text-left">
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

              <div ref={formRef} className={`w-full transition-opacity duration-300 ${isSticky ? 'opacity-0' : 'opacity-100'}`}>
                <div className="hidden md:block w-full">
                  <FlightSearchForm 
                    isSticky={isSticky}
                    {...searchState}
                  />
                </div>
                
                <div className="block md:hidden w-full">
                  <FlightSearchFormMobile 
                    {...searchState}
                    coords={coords}
                  />
                </div>
              </div>

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
          {airlineContent.introTitle}
        </h2>
        <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {airlineContent.introText}
        </p>
      </section>

      {/* Features */}
      <section className="max-w-[1280px] mx-auto px-2 pb-4 sm:pb-10">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Why Choose {airlineContent.title}?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {airlineContent.features?.map((feature, index) => (
            <div key={index} className="rounded-2xl bg-[#0ABAB5] p-6 text-white text-center">
              <h4 className="text-lg font-semibold">{feature.title}</h4>
              <p className="mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Airline Deals */}
      <AirlineDealsSection airlineSlug={slug} airlineName={airlineContent.title} />

      {/* Classes */}
      <section className="max-w-[1280px] mx-auto px-2 pb-10 sm:pb-14">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Travel Classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {airlineContent.classes?.map((travelClass, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{travelClass.name}</h4>
              <p className="text-gray-600 mb-4">{travelClass.description}</p>
              <ul className="space-y-2">
                {travelClass.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-[#0ABAB5] rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1280px] mx-auto px-2 py-10 sm:py-14 text-center">
        <h3 className="sr-only">Book your flight</h3>
        <p className="text-gray-900 text-lg sm:text-xl font-semibold max-w-4xl mx-auto">
          {airlineContent.ctaTitle}
        </p>
        <p className="mt-3 text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
          {airlineContent.ctaText}
        </p>
      </section>
    </main>
  );
}