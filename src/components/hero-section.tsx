"use client"

import React, { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import FlightSearchForm from "@/components/flight-search-form"
import FlightSearchFormMobile from "@/components/flight-search-form-mobile"
import StickySearchInput from "@/components/sticky-search-input"
import SearchModal from "@/components/search-modal"
import { motion, AnimatePresence } from "framer-motion"
import { type Coordinates } from "@/app/page";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { Airport } from "@/lib/utils";

interface HeroSectionProps {
  coords: Coordinates | null;
  initialFromAirport: Airport | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({coords, initialFromAirport}) => {
  const searchState = useFlightSearch(initialFromAirport);
  const [isSticky, setSticky] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSticky(!entry.isIntersecting);
      },
      {
        rootMargin: '0px',
        threshold: 0,
      }
    );

    observer.observe(formRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="relative w-full flex flex-col items-center justify-start bg-gradient-to-b from-[#0ABAB5] via-[#84DDDA] to-[#F0FBFA] min-h-[682px] px-2 md:px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0ABAB5] via-[#84DDDA] to-white w-full h-full" />

      <Navbar isDarkBackground={true} />
      <div className="w-full max-w-[1280px] mx-auto flex flex-col items-center relative">
        {/* Title */}
        <div className="flex flex-col items-center w-full mt-10 mb-5 text-center">
          <h1 className="font-poppins font-bold text-[40px] md:text-[72px] leading-[1em] text-white">
          Unique Business & First Class Savings
          </h1>

          
        <p className="font-poppins font-light text-[20px] mt-6 md:text-[32px] leading-[1.4em] text-[#F0FBFA]">
            Fly in Luxury, above the Sky
          </p>
        </div>
        
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
              <div className="max-w-[1280px] mx-auto py-2 px-2 md:px-4">
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
        <div ref={formRef} className={`w-full transition-opacity duration-300ticky ? 'opacity-0' : 'opacity-100'}`}>
          {/* Desktop form - скрыта на мобильных */}
          <div className="hidden md:block w-full">
            <FlightSearchForm 
              isSticky={isSticky}
              {...searchState}
            />
          </div>
          
          {/* Mobile form - показана только на мобильных */}
          <div className="block md:hidden w-full">
            <FlightSearchFormMobile 
              {...searchState}
              coords={coords}
            />
          </div>
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
    </section>
  );
};

export default HeroSection;