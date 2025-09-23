'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/legacy/image";
import { useRouter } from 'next/navigation';
import { searchAirportsGrouped } from '@/lib/utils';

const popularDestinations = [
  { 
    city: 'London', 
    country: 'United Kingdom',
    flights: [
      { from: 'New York', to: 'London', savings: 950 },
      { from: 'Dubai', to: 'London', savings: 870 },
      { from: 'Los Angeles', to: 'London', savings: 920 },
    ]
  },
  { 
    city: 'Paris', 
    country: 'France',
    flights: [
      { from: 'New York', to: 'Paris', savings: 900 },
      { from: 'Dubai', to: 'Paris', savings: 850 },
      { from: 'Los Angeles', to: 'Paris', savings: 880 },
    ]
  },
  { 
    city: 'Rome', 
    country: 'Italy',
    flights: [
      { from: 'New York', to: 'Rome', savings: 870 },
      { from: 'London', to: 'Rome', savings: 650 },
      { from: 'Dubai', to: 'Rome', savings: 800 },
    ]
  },
  { 
    city: 'Tokyo', 
    country: 'Japan',
    flights: [
      { from: 'Los Angeles', to: 'Tokyo', savings: 1100 },
      { from: 'Singapore', to: 'Tokyo', savings: 950 },
      { from: 'London', to: 'Tokyo', savings: 1050 },
    ]
  },
  { 
    city: 'Seoul', 
    country: 'South Korea',
    flights: [
      { from: 'Los Angeles', to: 'Seoul', savings: 980 },
      { from: 'Singapore', to: 'Seoul', savings: 900 },
      { from: 'London', to: 'Seoul', savings: 970 },
    ]
  },
  { 
    city: 'Bangkok', 
    country: 'Thailand',
    flights: [
      { from: 'London', to: 'Bangkok', savings: 950 },
      { from: 'Dubai', to: 'Bangkok', savings: 900 },
      { from: 'Singapore', to: 'Bangkok', savings: 850 },
    ]
  },
  { 
    city: 'Nassau', 
    country: 'Bahamas',
    flights: [
      { from: 'New York', to: 'Nassau', savings: 600 },
      { from: 'Miami', to: 'Nassau', savings: 500 },
      { from: 'London', to: 'Nassau', savings: 700 },
    ]
  },
  { 
    city: 'Punta Cana', 
    country: 'Dominican Republic',
    flights: [
      { from: 'New York', to: 'Punta Cana', savings: 650 },
      { from: 'Miami', to: 'Punta Cana', savings: 550 },
      { from: 'London', to: 'Punta Cana', savings: 750 },
    ]
  },
  { 
    city: 'Dubai', 
    country: 'UAE',
    flights: [
      { from: 'London', to: 'Dubai', savings: 950 },
      { from: 'New York', to: 'Dubai', savings: 1100 },
      { from: 'Singapore', to: 'Dubai', savings: 1050 },
    ]
  },
  { 
    city: 'Cancún', 
    country: 'Mexico',
    flights: [
      { from: 'New York', to: 'Cancún', savings: 700 },
      { from: 'Miami', to: 'Cancún', savings: 600 },
      { from: 'London', to: 'Cancún', savings: 800 },
    ]
  },
  { 
    city: 'Sydney', 
    country: 'Australia',
    flights: [
      { from: 'Los Angeles', to: 'Sydney', savings: 1200 },
      { from: 'London', to: 'Sydney', savings: 1300 },
      { from: 'Singapore', to: 'Sydney', savings: 1100 },
    ]
  },
  { 
    city: 'Auckland', 
    country: 'New Zealand',
    flights: [
      { from: 'Los Angeles', to: 'Auckland', savings: 1150 },
      { from: 'London', to: 'Auckland', savings: 1250 },
      { from: 'Singapore', to: 'Auckland', savings: 1050 },
    ]
  },
];

const topAirlines = [
  { name: 'Singapore Airlines', href: '/airlines/singapore-airlines' },
  { name: 'Lufthansa Airlines', href: '/airlines/lufthansa-airlines' },
  { name: 'American Airlines', href: '/airlines/american-airlines' },
  { name: 'Emirates Airlines', href: '/airlines/emirates-airlines' },
  { name: 'Nippon Airlines', href: '/airlines/nippon-airlines' },
  { name: 'Qantas Airlines', href: '/airlines/qantas-airlines' },
  { name: 'Turkish Airlines', href: '/airlines/turkish-airlines' },
  { name: 'British Airlines', href: '/airlines/british-airlines' },
  { name: 'United Airlines', href: '/airlines/united-airlines' },
  { name: 'Etihad Airlines', href: '/airlines/etihad-airlines' },
  { name: 'Qatar Airlines', href: '/airlines/qatar-airlines' },
  { name: 'Iberia Airlines', href: '/airlines/iberia-airlines' },
  { name: 'Swiss Airlines', href: '/airlines/swiss-airlines' }
];

// topCountries and topCities moved inside Footer component to avoid hydration mismatch

const socialLinks = [
  { name: 'instagram', icon: '/social/instagram.svg', href: 'https://www.instagram.com/luxeskies_com/' },
  { name: 'facebook', icon: '/social/facebook.svg', href: 'https://www.facebook.com/luxeskies' },
  { name: 'youtube', icon: '/social/youtube.svg', href: 'https://www.youtube.com/@LuxeSkies' },
  { name: 'linkedin', icon: '/social/linkedin.svg', href: 'https://www.linkedin.com/company/luxeskiesinc/' },
  { name: 'tiktok', icon: '/social/tiktok.svg', href: 'https://www.tiktok.com/@luxeskies' },
  { name: 'trustpilot', icon: '/social/trustpilot.svg', href: 'https://www.trustpilot.com/review/luxeskies.com' },
];

const paymentMethods = [
  { name: 'trustpilot', logo: '/logos/payment/trustpilot.svg' },
  { name: 'discover', logo: '/logos/payment/discover.svg' },
  { name: 'generic-card', logo: '/logos/payment/generic-card.svg' },
  { name: 'amex', logo: '/logos/payment/amex.svg' },
  { name: 'visa', logo: '/logos/payment/visa.svg' },
  { name: 'florida', logo: '/icons/florida.png' },
  { name: 'iatan', logo: '/icons/iatan.png' },
];

const DestinationAccordion = ({ dest, isOpen, onToggle }: { dest: typeof popularDestinations[0], isOpen: boolean, onToggle: () => void }) => {
  const hasFlights = dest.flights.length > 0;
  const router = useRouter();

  const handleFlightClick = (flight: { from: string; to: string; savings: number }) => {
    // Find airports for from and to cities
    const fromResults = searchAirportsGrouped(flight.from, 5);
    const toResults = searchAirportsGrouped(flight.to, 5);
    
    let fromCode = '';
    let toCode = '';
    
    // Get the first airport code from search results
    if (fromResults.length > 0) {
      if (fromResults[0].type === 'city' && fromResults[0].airports && fromResults[0].airports.length > 0) {
        fromCode = fromResults[0].airports[0].code;
      } else if (fromResults[0].code) {
        fromCode = fromResults[0].code;
      }
    }
    
    if (toResults.length > 0) {
      if (toResults[0].type === 'city' && toResults[0].airports && toResults[0].airports.length > 0) {
        toCode = toResults[0].airports[0].code;
      } else if (toResults[0].code) {
        toCode = toResults[0].code;
      }
    }
    
    // Create search URL with parameters
    if (fromCode && toCode) {
      const searchParams = new URLSearchParams({
        from: fromCode,
        to: toCode,
        tripType: 'One-way',
        passengers: '1',
        class: 'Business',
        departureDate: new Date().toISOString().split('T')[0] // current date
      });
      
      router.push(`/searching?${searchParams.toString()}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
      <button 
        onClick={hasFlights ? onToggle : undefined}
        className={`w-full p-4 flex justify-between items-center ${hasFlights ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}`}
      >
        <div className="flex items-center gap-2">
          <p className="font-poppins font-normal text-sm text-[#0D2B29]">{dest.city}</p>
          <p className="font-poppins text-sm text-[#1C5E59]">{dest.country}</p>
        </div>
        {hasFlights && (
          <Image 
            src="/icons/footer/chevron-down.svg" 
            alt="chevron" 
            width={12} 
            height={7} 
            className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen && hasFlights ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {dest.flights.map((flight, index) => (
              <button 
                key={index} 
                onClick={() => handleFlightClick(flight)}
                className="w-full flex justify-between items-center text-xs hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition-colors"
              >
                <span className="text-[#0D2B29]">{flight.from} – {flight.to}</span>
                <span className="text-[#1C5E59]">save up to ${flight.savings}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


const Footer = () => {
  const [openDestination, setOpenDestination] = useState<string | null>(null);
  const [topCountries, setTopCountries] = useState<{ name: string; href: string }[]>([]);
  const [topCities, setTopCities] = useState<{ name: string; href: string }[]>([]);

  useEffect(() => {
    // Initialize data only on client to avoid hydration mismatch
    setTopCountries([
      { name: 'United Kingdom Business Class Flights', href: '/countries/united-kingdom' },
      { name: 'Portugal Business Class Flights', href: '/countries/portugal' },
      { name: 'Greece Business Class Flights', href: '/countries/greece' },
      { name: 'France Business Class Flights', href: '/countries/france' },
      { name: 'Spain Business Class Flights', href: '/countries/spain' },
      { name: 'Italy Business Class Flights', href: '/countries/italy' },
      { name: 'United Arab Emirates Business Class Flights', href: '/countries/united-arab-emirates' },
      { name: 'Netherlands Business Class Flights', href: '/countries/netherlands' },
      { name: 'Singapore Business Class Flights', href: '/countries/singapore' },
      { name: 'Germany Business Class Flights', href: '/countries/germany' },
      { name: 'Australia Business Class Flights', href: '/countries/australia' },
      { name: 'Turkey Business Class Flights', href: '/countries/turkey' },
      { name: 'Japan Business Class Flights', href: '/countries/japan' }
    ]);

    setTopCities([
      { name: 'London Business Class Flights', href: '/cities/london' },
      { name: 'Madrid Business Class Flights', href: '/cities/madrid' },
      { name: 'Athens Business Class Flights', href: '/cities/athens' },
      { name: 'Rome Business Class Flights', href: '/cities/rome' },
      { name: 'Paris Business Class Flights', href: '/cities/paris' },
      { name: 'Lisbon Business Class Flights', href: '/cities/lisbon' },
      { name: 'Amsterdam Business Class Flights', href: '/cities/amsterdam' },
      { name: 'Singapore Business Class Flights', href: '/cities/singapore' },
      { name: 'Barcelona Business Class Flights', href: '/cities/barcelona' },
      { name: 'Frankfurt Business Class Flights', href: '/cities/frankfurt' },
      { name: 'Istanbul Business Class Flights', href: '/cities/istanbul' },
      { name: 'Sydney Business Class Flights', href: '/cities/sydney' },
      { name: 'Dubai Business Class Flights', href: '/cities/dubai' },
      { name: 'Tokyo Business Class Flights', href: '/cities/tokyo' }
    ]);
  }, []);

  return (
    <footer className="relative bg-white text-[#0D2B29] pt-12 overflow-hidden font-poppins">
      <Image
        src="/images/footer-bg.png"
        alt="Footer background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 opacity-20 z-0 object-top"
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Popular Destinations */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold uppercase text-[#033836] mb-6 tracking-wide">popular destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {popularDestinations.map(dest => (
              <DestinationAccordion 
                key={dest.city} 
                dest={dest}
                isOpen={openDestination === dest.city}
                onToggle={() => setOpenDestination(prev => prev === dest.city ? null : dest.city)}
              />
            ))}
          </div>
        </section>

        {/* Contact Info & Links */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-6">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-8 lg:flex lg:flex-col lg:items-start lg:space-y-8 lg:gap-0">
              <ContactMethod icon="/icons/footer/whatsapp.svg" title="WhatsApp" description="Start a Conversation" href="#" iconBgColor="bg-green-100" />
              <ContactMethod icon="/icons/footer/phone.svg" title="Call us 24/7" description="+1 (888) 830-7444" href="tel:+18888307444" />
              <ContactMethod icon="/icons/footer/mail.svg" title="E-mail" description="support@luxeskies.com" href="mailto:support@luxeskies.com" />
              <ContactMethod icon="/icons/footer/map-pin.svg" title="Address" description="Saint Petersburg, Florida" />
            </div>
          </div>

          {/* Link Lists - Hidden on mobile */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:col-span-3 gap-8">
            <LinkList title="top airlines" links={topAirlines} />
            <LinkList title="top countries" links={topCountries} />
            <LinkList title="top cities" links={topCities} />
          </div>
        </section>

        <hr className="border-black/10 my-8" />

        {/* Main Footer */}
        <section className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 py-6">
            <div className='flex flex-col items-center md:items-start gap-6 max-w-xs'>
                <h3 className="text-2xl font-bold text-[#0ABAB5] font-ubuntu lowercase">flyLUXsky</h3>
                <div className="grid grid-cols-3 gap-3">
                    {socialLinks.map(social => (
                        <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="bg-[#F8F8F8] hover:bg-gray-200 p-2 rounded-lg transition-colors flex items-center justify-center">
                            <Image src={social.icon} alt={social.name} width={20} height={20} />
                        </a>
                    ))}
                </div>
            </div>

            <div className="text-center text-xs text-[#0D2B29]/90 max-w-3xl flex-1">
                <p className="mb-3 font-semibold">
                    LuxeSkies set the standard. Flyluxsky carries it forward. Born from the same vision and values, both brands are united by one mission: to make business and first-class travel effortless, exclusive, and unforgettable.
                </p>
                <p>
                    All prices are in USD, including taxes, fees, and surcharges, based on seat availability in the cheapest booking inventory. Availability is limited, not guaranteed, and subject to restrictions like advance booking, stay durations, weekday travel, seasonal variations, and blackout dates. More flexible fares are available at higher prices—contact our travel managers for details. Fares are nonrefundable, nonexchangeable, nontransferable, and rules may change without notice. Prices for Europe, Africa, Middle East, and India are from US east coast hubs (e.g., New York, Washington, Boston); for Asia and Oceania, from west coast hubs (e.g., Seattle, San Francisco, Los Angeles). Savings up to 70% off are from full unrestricted airline fares and vary by fare rules, departure, destination, dates, duration, and season.
                </p>
            </div>

            <div className="space-y-2 text-center md:text-left">
                <a href="/reviews" className="block bg-white py-2 px-4 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors border border-gray-200/80 text-center text-[#0D2B29]">Reviews</a>
                <a href="/contact" className="block bg-white py-2 px-4 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors border border-gray-200/80 text-center text-[#0D2B29]">Contacts</a>
            </div>
        </section>

        {/* Bottom Bar */}
        <section className="flex flex-col md:flex-row md:justify-between items-center gap-4 py-6 mt-8 border-t border-black/10">
            <div className="text-sm text-black/75 order-2 md:order-1 text-center md:text-left">© 2025 FlyLuxSky . All rights reserved.</div>
            
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 order-1 md:order-2">
                {paymentMethods.map(method => (
                    <div key={method.name} className={`relative h-8 flex items-center justify-center ${
                        method.name === 'trustpilot' ? 'w-16 md:w-20' : 'w-10 md:w-12'
                    }`}>
                        <Image src={method.logo} alt={method.name} layout="fill" objectFit="contain" />
                    </div>
                ))}
            </div>

            <div className="flex gap-4 text-sm uppercase text-black font-medium order-3">
                <a href="/privacy" className="hover:text-black/70 transition-colors">Privacy policy</a>
                <a href="/terms" className="hover:text-black/70 transition-colors">Terms of Use</a>
            </div>
        </section>
      </div>
    </footer>
  );
};

const ContactMethod = ({ icon, title, description, href, iconBgColor = 'bg-transparent' }: { icon: string, title: string, description: string, href?: string, iconBgColor?: string }) => {
    const descriptionClasses = "text-sm text-[#1C5E59]";
    const descriptionContent = href ? (
        <a href={href} className={`${descriptionClasses} underline hover:text-[#033836]`}>{description}</a>
    ) : (
        <p className={descriptionClasses}>{description}</p>
    );

    return (
        <div className="flex flex-col items-center text-center gap-2 lg:flex-row lg:text-left lg:items-start lg:gap-3">
            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${iconBgColor}`}>
                <Image src={icon} alt={title} width={24} height={24} />
            </div>
            <div>
                <h4 className="text-base text-[#0D2B29]">{title}</h4>
                {descriptionContent}
            </div>
        </div>
    );
};

const LinkList = ({ title, links }: { title: string, links: string[] | { name: string; href: string }[] }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold uppercase text-[#033836] tracking-wide">{title}</h3>
        <ul className="space-y-2">
            {links && links.length > 0 && links.map(link => {
                const isStringArray = typeof link === 'string';
                const linkText = isStringArray ? link : link.name;
                const linkHref = isStringArray ? '#' : link.href;
                return (
                    <li key={linkText}>
                        <a href={linkHref} className="text-sm text-[#0D2B29]/75 hover:text-[#0D2B29] transition-colors leading-tight block">
                            {linkText}
                        </a>
                    </li>
                );
            })}
        </ul>
    </div>
);


export default Footer;