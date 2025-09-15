'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar';

const countries = [
  {
    name: 'United Kingdom',
    slug: 'united-kingdom',
    image: '/images/cities/london.jpg',
    video: '/video/london.mp4',
    description: 'Experience British elegance and history with business class flights to London, Manchester, and Edinburgh.',
    cities: ['London', 'Manchester', 'Edinburgh', 'Birmingham'],
    airlines: ['British Airways', 'Virgin Atlantic', 'Emirates'],
    continent: 'Europe'
  },
  {
    name: 'Portugal',
    slug: 'portugal',
    image: '/images/countries/portugal.jpg',
    video: '/video/lisbon.mp4',
    description: 'Discover Portuguese charm with business class flights to Lisbon and Porto.',
    cities: ['Lisbon', 'Porto', 'Faro'],
    airlines: ['TAP Air Portugal', 'Emirates', 'Lufthansa'],
    continent: 'Europe'
  },
  {
    name: 'Greece',
    slug: 'greece',
    image: '/images/countries/greece.jpg',
    video: '/video/athenes.mp4',
    description: 'Experience ancient history and stunning islands with luxury flights to Athens and Thessaloniki.',
    cities: ['Athens', 'Thessaloniki', 'Mykonos', 'Santorini'],
    airlines: ['Aegean Airlines', 'Emirates', 'Qatar Airways'],
    continent: 'Europe'
  },
  {
    name: 'France',
    slug: 'france',
    image: '/images/cities/paris.jpg',
    video: '/video/paris.mp4',
    description: 'Discover French sophistication with luxury flights to Paris, Nice, and Lyon.',
    cities: ['Paris', 'Nice', 'Lyon', 'Marseille'],
    airlines: ['Air France', 'Emirates', 'Qatar Airways'],
    continent: 'Europe'
  },
  {
    name: 'Spain',
    slug: 'spain',
    image: '/images/cities/madrid.jpg',
    video: '/video/madrid.mp4',
    description: 'Discover Spanish passion with business class flights to Madrid, Barcelona, and Seville.',
    cities: ['Madrid', 'Barcelona', 'Seville', 'Valencia'],
    airlines: ['Iberia', 'Emirates', 'British Airways'],
    continent: 'Europe'
  },
  {
    name: 'Italy',
    slug: 'italy',
    image: '/images/countries/italy.jpg',
    video: '/video/rome.mp4',
    description: 'Experience Italian charm with luxury flights to Rome, Milan, and Venice.',
    cities: ['Rome', 'Milan', 'Venice', 'Florence'],
    airlines: ['Alitalia', 'Emirates', 'Lufthansa'],
    continent: 'Europe'
  },
  {
    name: 'United Arab Emirates',
    slug: 'united-arab-emirates',
    image: '/images/cities/dubai.jpg',
    video: '/video/dubai.mp4',
    description: 'Discover luxury in the desert with business class flights to Dubai and Abu Dhabi.',
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    airlines: ['Emirates', 'Etihad Airways', 'Qatar Airways'],
    continent: 'Asia'
  },
  {
    name: 'Netherlands',
    slug: 'netherlands',
    image: '/images/cities/amsterdam.jpg',
    video: '/video/amsterdam.mp4',
    description: 'Explore Dutch culture and canals with premium flights to Amsterdam and Rotterdam.',
    cities: ['Amsterdam', 'Rotterdam', 'The Hague'],
    airlines: ['KLM', 'Emirates', 'Singapore Airlines'],
    continent: 'Europe'
  },
  {
    name: 'Singapore',
    slug: 'singapore',
    image: '/images/cities/singapore.jpg',
    video: '/video/singapore.mp4',
    description: 'Experience the gateway to Asia with premium flights to Singapore.',
    cities: ['Singapore'],
    airlines: ['Singapore Airlines', 'Emirates', 'Qatar Airways'],
    continent: 'Asia'
  },
  {
    name: 'Germany',
    slug: 'germany',
    image: '/images/cities/frankfurt.jpg',
    video: '/video/frankfurt.mp4',
    description: 'Experience German efficiency and culture with business class flights to Frankfurt, Munich, and Berlin.',
    cities: ['Frankfurt', 'Munich', 'Berlin', 'Hamburg'],
    airlines: ['Lufthansa', 'Emirates', 'Singapore Airlines'],
    continent: 'Europe'
  },
  {
    name: 'Australia',
    slug: 'australia',
    image: '/images/cities/sidney.jpg',
    video: '/video/sidney.mp4',
    description: 'Explore the land down under with luxury flights to Sydney, Melbourne, and Brisbane.',
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
    airlines: ['Qantas', 'Emirates', 'Singapore Airlines'],
    continent: 'Oceania'
  },
  {
    name: 'Turkey',
    slug: 'turkey',
    image: '/images/cities/istanbul.jpg',
    video: '/video/istanbul.mp4',
    description: 'Experience the bridge between Europe and Asia with business class flights to Istanbul and Ankara.',
    cities: ['Istanbul', 'Ankara', 'Antalya', 'Izmir'],
    airlines: ['Turkish Airlines', 'Emirates', 'Qatar Airways'],
    continent: 'Europe'
  },
  {
    name: 'Japan',
    slug: 'japan',
    image: '/images/cities/tokyo.jpg',
    video: '/video/tokyo.mp4',
    description: 'Experience Japanese hospitality with premium flights to Tokyo, Osaka, and Kyoto.',
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Nagoya'],
    airlines: ['Japan Airlines', 'ANA', 'Singapore Airlines'],
    continent: 'Asia'
  },
  {
    name: 'United States',
    slug: 'united-states',
    image: '/images/cities/new-york.jpg',
    video: '/video/newyork_1.mp4',
    description: 'Land of opportunity - experience American innovation and diversity from coast to coast with premium flights to major business hubs.',
    cities: ['New York', 'Los Angeles', 'San Francisco', 'Boston'],
    airlines: ['American Airlines', 'Delta', 'United Airlines'],
    continent: 'North America'
  },
  {
    name: 'Canada',
    slug: 'canada',
    image: '/images/countries/canada.jpg',
    video: '/video/canada_1.mp4',
    description: 'The Great White North - discover pristine wilderness, multicultural cities, and legendary Canadian warmth from coast to coast.',
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
    airlines: ['Air Canada', 'Emirates', 'British Airways'],
    continent: 'North America'
  },
  {
    name: 'Switzerland',
    slug: 'switzerland',
    image: '/images/countries/switzerland.jpg',
    video: '/video/switzerland_1.mp4',
    description: 'Heart of Europe - experience Swiss excellence where Alpine majesty meets world-class banking and chocolate perfection.',
    cities: ['Zurich', 'Geneva', 'Bern'],
    airlines: ['Swiss International', 'Lufthansa', 'Emirates'],
    continent: 'Europe'
  }
];

const CountryCard = ({ country }: { country: typeof countries[0] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Video play failed, ignore
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link href={`/countries/${country.slug}`} className="group">
      <div 
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-[#0ABAB5]/20 h-full flex flex-col"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Country Image/Video */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          
          {/* Static Image */}
          <Image
            src={country.image}
            alt={`${country.name} destination`}
            fill
            className={`object-cover transition-all duration-300 ${
              isHovered ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
            }`}
          />
          
          {/* Video */}
          {country.video && (
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={country.video} type="video/mp4" />
            </video>
          )}

          {/* Continent Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-white/90 text-[#0D2B29] text-xs font-medium px-2 py-1 rounded-full">
              {country.continent}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          {/* Country Name */}
          <h3 className="text-xl font-semibold text-[#0D2B29] mb-3 group-hover:text-[#0ABAB5] transition-colors">
            {country.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {country.description}
          </p>
          
          {/* Cities */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Popular cities:</p>
            <div className="flex flex-wrap gap-1">
              {country.cities.slice(0, 3).map((city) => (
                <span key={city} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {city}
                </span>
              ))}
              {country.cities.length > 3 && (
                <span className="text-xs text-gray-500">+{country.cities.length - 3} more</span>
              )}
            </div>
          </div>
          
          {/* Airlines */}
          <div className="mt-auto">
            <p className="text-xs text-gray-500 mb-2">Top airlines:</p>
            <div className="flex flex-wrap gap-1">
              {country.airlines.slice(0, 2).map((airline) => (
                <span key={airline} className="text-xs bg-[#0ABAB5]/10 text-[#0ABAB5] px-2 py-1 rounded-full">
                  {airline}
                </span>
              ))}
              {country.airlines.length > 2 && (
                <span className="text-xs text-gray-500">+{country.airlines.length - 2} more</span>
              )}
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gray-50 px-6 py-4 group-hover:bg-[#0ABAB5]/5 transition-colors">
          <div className="text-center">
            <span className="text-sm font-medium text-[#0ABAB5] group-hover:text-[#0D2B29] transition-colors">
              Explore Destinations →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function TopCountriesPage() {
  const continents = ['All', 'Europe', 'Asia', 'Oceania'];
  const [selectedContinent, setSelectedContinent] = React.useState('All');
  
  const filteredCountries = selectedContinent === 'All' 
    ? countries 
    : countries.filter(country => country.continent === selectedContinent);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
       <div className="bg-[#0ABAB5] px-4 sm:px-6 lg:px-8 py-4">
         <Navbar isDarkBackground={true} />
       </div>
      
      {/* Hero Section */}
      <section className="bg-[#0ABAB5] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Top Countries
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Discover premium business class destinations around the world. 
            Experience luxury travel to the most sought-after countries.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedContinent === continent
                    ? 'bg-[#0ABAB5] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0D2B29] mb-4">
              Choose Your Dream Destination
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our selection of top countries offering exceptional business class 
              travel experiences. Each destination provides unique culture and luxury.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCountries.map((country) => (
              <CountryCard key={country.slug} country={country} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0D2B29] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Explore the World?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let our travel experts help you plan your next luxury business class journey 
            to any of these amazing destinations.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-[#0ABAB5] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#0ABAB5]/90 transition-colors"
          >
            Plan Your Trip
          </Link>
        </div>
      </section>
    </div>
  );
}