'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar';

const cities = [
  {
    name: 'London',
    slug: 'london',
    country: 'United Kingdom',
    countryCode: 'GB',
    image: '/images/cities/london.jpg',
    video: '/video/london.mp4',
    description: 'Experience the capital of England with its rich history, iconic landmarks, and world-class business opportunities.',
    airports: ['LHR', 'LGW', 'STN'],
    airlines: ['British Airways', 'Virgin Atlantic', 'Emirates'],
    attractions: ['Big Ben', 'Tower Bridge', 'Buckingham Palace'],
    continent: 'Europe'
  },
  {
    name: 'Madrid',
    slug: 'madrid',
    country: 'Spain',
    countryCode: 'ES',
    image: '/images/cities/madrid.jpg',
    video: '/video/madrid.mp4',
    description: 'Spain\'s vibrant capital offers rich culture, world-class museums, and exceptional cuisine.',
    airports: ['MAD'],
    airlines: ['Iberia', 'Emirates', 'Qatar Airways'],
    attractions: ['Prado Museum', 'Royal Palace', 'Retiro Park'],
    continent: 'Europe'
  },
  {
    name: 'Athens',
    slug: 'athens',
    country: 'Greece',
    countryCode: 'GR',
    image: '/images/cities/athens.jpg',
    video: '/video/athenes.mp4',
    description: 'The cradle of democracy offers ancient history, stunning architecture, and Mediterranean charm.',
    airports: ['ATH'],
    airlines: ['Aegean Airlines', 'Emirates', 'Qatar Airways'],
    attractions: ['Acropolis', 'Parthenon', 'Ancient Agora'],
    continent: 'Europe'
  },
  {
    name: 'Rome',
    slug: 'rome',
    country: 'Italy',
    countryCode: 'IT',
    image: '/images/cities/rome.jpg',
    video: '/video/rome.mp4',
    description: 'The Eternal City combines ancient history with modern Italian style and world-renowned cuisine.',
    airports: ['FCO', 'CIA'],
    airlines: ['Alitalia', 'Emirates', 'Qatar Airways'],
    attractions: ['Colosseum', 'Vatican City', 'Trevi Fountain'],
    continent: 'Europe'
  },
  {
    name: 'Paris',
    slug: 'paris',
    country: 'France',
    countryCode: 'FR',
    image: '/images/cities/paris.jpg',
    video: '/video/paris.mp4',
    description: 'The City of Light offers romance, culture, fashion, and exceptional cuisine in the heart of Europe.',
    airports: ['CDG', 'ORY'],
    airlines: ['Air France', 'Emirates', 'Qatar Airways'],
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Champs-Élysées'],
    continent: 'Europe'
  },
  {
    name: 'Lisbon',
    slug: 'lisbon',
    country: 'Portugal',
    countryCode: 'PT',
    image: '/images/cities/lisbon.jpg',
    video: '/video/lisbon.mp4',
    description: 'Portugal\'s coastal capital offers historic charm, stunning architecture, and vibrant cultural scene.',
    airports: ['LIS'],
    airlines: ['TAP Air Portugal', 'Emirates', 'Qatar Airways'],
    attractions: ['Belém Tower', 'Jerónimos Monastery', 'Alfama District'],
    continent: 'Europe'
  },
  {
    name: 'Amsterdam',
    slug: 'amsterdam',
    country: 'Netherlands',
    countryCode: 'NL',
    image: '/images/cities/amsterdam.jpg',
    video: '/video/amsterdam.mp4',
    description: 'The Venice of the North with its famous canals, rich history, and vibrant cultural scene.',
    airports: ['AMS'],
    airlines: ['KLM', 'Emirates', 'British Airways'],
    attractions: ['Anne Frank House', 'Van Gogh Museum', 'Jordaan District'],
    continent: 'Europe'
  },
  {
    name: 'Singapore',
    slug: 'singapore',
    country: 'Singapore',
    countryCode: 'SG',
    image: '/images/cities/singapore.jpg',
    video: '/video/singapore.mp4',
    description: 'The gateway to Asia, combining modern efficiency with rich cultural heritage and culinary excellence.',
    airports: ['SIN'],
    airlines: ['Singapore Airlines', 'Emirates', 'Qatar Airways'],
    attractions: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island'],
    continent: 'Asia'
  },
  {
    name: 'Barcelona',
    slug: 'barcelona',
    country: 'Spain',
    countryCode: 'ES',
    image: '/images/cities/barcelona.jpg',
    video: '/video/barcelona.mp4',
    description: 'Catalonia\'s capital combines stunning architecture, beautiful beaches, and vibrant nightlife.',
    airports: ['BCN'],
    airlines: ['Vueling', 'Emirates', 'Qatar Airways'],
    attractions: ['Sagrada Familia', 'Park Güell', 'Las Ramblas'],
    continent: 'Europe'
  },
  {
    name: 'Frankfurt',
    slug: 'frankfurt',
    country: 'Germany',
    countryCode: 'DE',
    image: '/images/cities/frankfurt.jpg',
    video: '/video/frankfurt.mp4',
    description: 'Europe\'s financial capital with impressive skyline, rich culture, and excellent business infrastructure.',
    airports: ['FRA'],
    airlines: ['Lufthansa', 'Emirates', 'Singapore Airlines'],
    attractions: ['Römerberg', 'Main Tower', 'Städel Museum'],
    continent: 'Europe'
  },
  {
    name: 'Istanbul',
    slug: 'istanbul',
    country: 'Turkey',
    countryCode: 'TR',
    image: '/images/cities/istanbul.jpg',
    video: '/video/istanbul.mp4',
    description: 'Where Europe meets Asia, offering rich history, stunning architecture, and vibrant cultural heritage.',
    airports: ['IST', 'SAW'],
    airlines: ['Turkish Airlines', 'Emirates', 'Qatar Airways'],
    attractions: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar'],
    continent: 'Europe'
  },
  {
    name: 'Sydney',
    slug: 'sydney',
    country: 'Australia',
    countryCode: 'AU',
    image: '/images/cities/sidney.jpg',
    video: '/video/sidney.mp4',
    description: 'Australia\'s largest city offers stunning harbor views, beautiful beaches, and vibrant cultural scene.',
    airports: ['SYD'],
    airlines: ['Qantas', 'Emirates', 'Singapore Airlines'],
    attractions: ['Opera House', 'Harbour Bridge', 'Bondi Beach'],
    continent: 'Oceania'
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    image: '/images/cities/dubai.jpg',
    video: '/video/dubai.mp4',
    description: 'A modern metropolis in the desert, offering luxury shopping, stunning architecture, and business excellence.',
    airports: ['DXB', 'DWC'],
    airlines: ['Emirates', 'Etihad Airways', 'Qatar Airways'],
    attractions: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall'],
    continent: 'Asia'
  },
  {
    name: 'Tokyo',
    slug: 'tokyo',
    country: 'Japan',
    countryCode: 'JP',
    image: '/images/cities/tokyo.jpg',
    video: '/video/tokyo.mp4',
    description: 'A fascinating blend of traditional culture and cutting-edge technology in Japan\'s bustling capital.',
    airports: ['NRT', 'HND'],
    airlines: ['Japan Airlines', 'ANA', 'Singapore Airlines'],
    attractions: ['Tokyo Tower', 'Senso-ji Temple', 'Shibuya Crossing'],
    continent: 'Asia'
  },
  {
    name: 'New York',
    slug: 'new-york',
    country: 'United States',
    countryCode: 'US',
    image: '/images/cities/new-york.jpg',
    video: '/video/newyork_1.mp4',
    description: 'The Big Apple - America\'s financial and cultural capital offering Broadway shows, world-class museums, and unparalleled business opportunities.',
    airports: ['JFK', 'LGA', 'EWR'],
    airlines: ['American Airlines', 'Delta', 'Emirates'],
    attractions: ['Empire State Building', 'Brooklyn Bridge', 'Wall Street'],
    continent: 'North America'
  },
  {
    name: 'Hong Kong',
    slug: 'hong-kong',
    country: 'Hong Kong',
    countryCode: 'HK',
    image: '/images/cities/hong-kong.jpg',
    video: '/video/honkong_1.mp4',
    description: 'Pearl of the Orient - where East meets West in a dynamic metropolis of towering skyscrapers, dim sum, and bustling harbors.',
    airports: ['HKG'],
    airlines: ['Cathay Pacific', 'Emirates', 'Singapore Airlines'],
    attractions: ['Symphony of Lights', 'Tsim Sha Tsui Promenade', 'Wong Tai Sin Temple'],
    continent: 'Asia'
  }
];

const CityCard = ({ city }: { city: typeof cities[0] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (videoRef.current && city.video) {
      try {
        videoRef.current.currentTime = 0;
        await videoRef.current.play();
      } catch (error) {
        console.log('Video play failed:', error);
      }
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
    <Link href={`/cities/${city.slug}`} className="group">
      <div 
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-[#0ABAB5]/20 h-full flex flex-col"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* City Image/Video */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
          
          {/* Static Image */}
          <Image
            src={city.image}
            alt={`${city.name} destination`}
            fill
            className={`object-cover transition-all duration-300 ${
              isHovered ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
            }`}
          />
          
          {/* Video */}
          {city.video && (
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
              <source src={city.video} type="video/mp4" />
            </video>
          )}
          {/* Country Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-white/90 text-[#0D2B29] text-xs font-medium px-2 py-1 rounded-full">
              {city.country}
            </span>
          </div>
          {/* Continent Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className="bg-[#0ABAB5]/90 text-white text-xs font-medium px-2 py-1 rounded-full">
              {city.continent}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          {/* City Name */}
          <h3 className="text-xl font-semibold text-[#0D2B29] mb-3 group-hover:text-[#0ABAB5] transition-colors">
            {city.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {city.description}
          </p>
          
          {/* Airports */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Airports:</p>
            <div className="flex flex-wrap gap-1">
              {city.airports.map((airport) => (
                <span key={airport} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-mono">
                  {airport}
                </span>
              ))}
            </div>
          </div>
          
          {/* Airlines */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Top airlines:</p>
            <div className="flex flex-wrap gap-1">
              {city.airlines.slice(0, 2).map((airline) => (
                <span key={airline} className="text-xs bg-[#0ABAB5]/10 text-[#0ABAB5] px-2 py-1 rounded-full">
                  {airline}
                </span>
              ))}
              {city.airlines.length > 2 && (
                <span className="text-xs text-gray-500">+{city.airlines.length - 2} more</span>
              )}
            </div>
          </div>
          
          {/* Attractions */}
          <div className="mt-auto">
            <p className="text-xs text-gray-500 mb-2">Must-see attractions:</p>
            <div className="flex flex-wrap gap-1">
              {city.attractions.slice(0, 2).map((attraction) => (
                <span key={attraction} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {attraction}
                </span>
              ))}
              {city.attractions.length > 2 && (
                <span className="text-xs text-gray-500">+{city.attractions.length - 2} more</span>
              )}
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gray-50 px-6 py-4 group-hover:bg-[#0ABAB5]/5 transition-colors">
          <div className="text-center">
            <span className="text-sm font-medium text-[#0ABAB5] group-hover:text-[#0D2B29] transition-colors">
              Explore City →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function TopCitiesPage() {
  const continents = ['All', 'Europe', 'Asia', 'Oceania'];
  const [selectedContinent, setSelectedContinent] = React.useState('All');
  
  const filteredCities = selectedContinent === 'All' 
    ? cities 
    : cities.filter(city => city.continent === selectedContinent);

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
            Top Cities
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Discover premium business class flights to the world's most exciting cities. 
            Experience luxury travel to iconic destinations worldwide.
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

      {/* Cities Grid */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0D2B29] mb-4">
              Choose Your Next Adventure
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our selection of top cities offering exceptional business class 
              travel experiences. Each city provides unique culture, attractions, and luxury.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0D2B29] text-white py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Visit These Amazing Cities?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let our travel experts help you plan your next luxury business class journey 
            to any of these incredible urban destinations.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-[#0ABAB5] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#0ABAB5]/90 transition-colors"
          >
            Start Planning
          </Link>
        </div>
      </section>
    </div>
  );
}