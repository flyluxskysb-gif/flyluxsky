// Admin helper for managing country page content

export interface CountryContent {
  slug: string // e.g. 'united-kingdom'
  title: string
  subtitle: string
  description: string
  heroImage: string // public path to image
  heroVideo?: string // public path to video
  introTitle?: string // e.g. 'Enjoy Your United Kingdom Trip With Fly Lux Sky'
  introText?: string // e.g. 'Explore United Kingdom's rich history and modern charm...'
  ctaTitle?: string
  ctaText?: string
  updated_at?: string
}

export const DEFAULT_COUNTRY_CONTENT: Record<string, CountryContent> = {
  'united-kingdom': {
    slug: 'united-kingdom',
    title: 'United Kingdom',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to the United Kingdom',
    heroImage: '/images/uk.jpg',
    heroVideo: '/video/london.mp4',
    introTitle: 'Enjoy Your United Kingdom Trip With Fly Lux Sky',
    introText: 'Explore the United Kingdom\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your United Kingdom Business Class Flight Today.',
    ctaText: 'Let Fly Lux Sky elevate your journey to the United Kingdom with unmatched luxury and convenience. Contact our expert travel advisors to secure your exclusive fare and experience the UK like never before.'
  },
  'portugal': {
    slug: 'portugal',
    title: 'Portugal',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Portugal',
    heroImage: '/images/portugal.jpg',
    heroVideo: '/video/lisbon.mp4',
    introTitle: 'Enjoy Your Portugal Trip With Fly Lux Sky',
    introText: 'Explore Portugal\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Portugal Business Class Flight Today.',
    ctaText: 'Experience premium travel to Portugal.'
  },
  'greece': {
    slug: 'greece',
    title: 'Greece',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Greece',
    heroImage: '/images/greece.jpg',
    heroVideo: '/video/athenes.mp4',
    introTitle: 'Enjoy Your Greece Trip With Fly Lux Sky',
    introText: 'Explore Greece\'s ancient history and stunning islands. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Greece Business Class Flight Today.',
    ctaText: 'Experience premium travel to Greece.'
  },
  'france': {
    slug: 'france',
    title: 'France',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to France',
    heroImage: '/images/france.jpg',
    heroVideo: '/video/paris.mp4',
    introTitle: 'Enjoy Your France Trip With Fly Lux Sky',
    introText: 'Explore France\'s rich culture and elegant charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your France Business Class Flight Today.',
    ctaText: 'Experience premium travel to France.'
  },
  'spain': {
    slug: 'spain',
    title: 'Spain',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Spain',
    heroImage: '/images/spain.jpg',
    heroVideo: '/video/barcelona.mp4',
    introTitle: 'Enjoy Your Spain Trip With Fly Lux Sky',
    introText: 'Explore Spain\'s vibrant culture and beautiful landscapes. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Spain Business Class Flight Today.',
    ctaText: 'Experience premium travel to Spain.'
  },
  'italy': {
    slug: 'italy',
    title: 'Italy',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Italy',
    heroImage: '/images/italy.jpg',
    heroVideo: '/video/rome.mp4',
    introTitle: 'Enjoy Your Italy Trip With Fly Lux Sky',
    introText: 'Explore Italy\'s rich history and artistic heritage. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service. Travel relaxed and ar...',
    ctaTitle: 'Book Your Italy Business Class Flight Today.',
    ctaText: 'Experience premium travel to Italy.'
  },
  'united-arab-emirates': {
    slug: 'united-arab-emirates',
    title: 'United Arab Emirates',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to the United Arab Emirates',
    heroImage: '/images/uae.jpg',
    heroVideo: '/video/dubai.mp4',
    introTitle: 'Enjoy Your United Arab Emirates Trip With Fly Lux Sky',
    introText: 'Explore the United Arab Emirates\' modern luxury and rich culture. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service.',
    ctaTitle: 'Book Your United Arab Emirates Business Class Flight Today.',
    ctaText: 'Experience premium travel to the United Arab Emirates.'
  },
  'netherlands': {
    slug: 'netherlands',
    title: 'Netherlands',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to the Netherlands',
    heroImage: '/images/netherlands.jpg',
    heroVideo: '/video/amsterdam.mp4',
    introTitle: 'Enjoy Your Netherlands Trip With Fly Lux Sky',
    introText: 'Explore the Netherlands\' charming canals and vibrant culture. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service.',
    ctaTitle: 'Book Your Netherlands Business Class Flight Today.',
    ctaText: 'Experience premium travel to the Netherlands.'
  },
  'singapore': {
    slug: 'singapore',
    title: 'Singapore',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Singapore',
    heroImage: '/images/singapore.jpg',
    heroVideo: '/video/singapore.mp4',
    introTitle: 'Enjoy Your Singapore Trip With Fly Lux Sky',
    introText: 'Explore Singapore\'s modern skyline and multicultural heritage. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service.',
    ctaTitle: 'Book Your Singapore Business Class Flight Today.',
    ctaText: 'Experience premium travel to Singapore.'
  },
  'germany': {
    slug: 'germany',
    title: 'Germany',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Germany',
    heroImage: '/images/germany.jpg',
    heroVideo: '/video/frankfurt.mp4',
    introTitle: 'Enjoy Your Germany Trip With Fly Lux Sky',
    introText: 'Explore Germany\'s rich history and modern innovation. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service.',
    ctaTitle: 'Book Your Germany Business Class Flight Today.',
    ctaText: 'Experience premium travel to Germany.'
  },
  'australia': {
    slug: 'australia',
    title: 'Australia',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Australia',
    heroImage: '/images/australia.jpg',
    heroVideo: '/video/sidney.mp4',
    introTitle: 'Enjoy Your Australia Trip With Fly Lux Sky',
    introText: 'Explore Australia\'s stunning landscapes and vibrant cities. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service.',
    ctaTitle: 'Book Your Australia Business Class Flight Today.',
    ctaText: 'Experience premium travel to Australia.'
  },
  'turkey': {
    slug: 'turkey',
    title: 'Turkey',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Turkey',
    heroImage: '/images/turkey.jpg',
    heroVideo: '/video/istanbul.mp4',
    introTitle: 'Enjoy Your Turkey Trip With Fly Lux Sky',
    introText: 'Explore Turkey\'s unique blend of European and Asian cultures. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service.',
    ctaTitle: 'Book Your Turkey Business Class Flight Today.',
    ctaText: 'Experience premium travel to Turkey.'
  },
  'japan': {
    slug: 'japan',
    title: 'Japan',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Japan',
    heroImage: '/images/japan.jpg',
    heroVideo: '/video/tokyo.mp4',
    introTitle: 'Enjoy Your Japan Trip With Fly Lux Sky',
    introText: 'Explore Japan\'s ancient traditions and cutting-edge technology. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service.',
    ctaTitle: 'Book Your Japan Business Class Flight Today.',
    ctaText: 'Experience premium travel to Japan.'
  },
  'qatar': {
    slug: 'qatar',
    title: 'Qatar',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Qatar',
    heroImage: '/images/qatar.jpg',
    heroVideo: '/video/doha.mp4',
    introTitle: 'Enjoy Your Qatar Trip With Fly Lux Sky',
    introText: 'Explore Qatar\'s modern architecture and rich heritage. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or leisure travel, expect spacious seating, priority boarding, and excellent service.',
    ctaTitle: 'Book Your Qatar Business Class Flight Today.',
    ctaText: 'Experience premium travel to Qatar.'
  },
  'united-states': {
    slug: 'united-states',
    title: 'United States',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to the United States',
    heroImage: '/images/countries/united-states.jpg',
    heroVideo: '/video/newyork_1.mp4',
    introTitle: 'Enjoy Your United States Trip With Fly Lux Sky',
    introText: 'Experience the land of opportunity with Fly Lux Sky. From the bustling streets of New York to the innovation hubs of Silicon Valley, the United States offers endless possibilities. Our premium flight options ensure you arrive refreshed and ready to explore America\'s diverse landscapes and vibrant cities.',
    ctaTitle: 'Book Your United States Business Class Flight Today.',
    ctaText: 'Let Fly Lux Sky elevate your journey to the United States with unmatched luxury and convenience.'
  },
  'canada': {
    slug: 'canada',
    title: 'Canada',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Canada',
    heroImage: '/images/countries/canada.jpg',
    heroVideo: '/video/canada_1.mp4',
    introTitle: 'Enjoy Your Canada Trip With Fly Lux Sky',
    introText: 'Discover the Great White North with Fly Lux Sky. From the cosmopolitan cities of Toronto and Vancouver to the pristine wilderness of the Rockies, Canada offers breathtaking natural beauty and warm hospitality. Experience the perfect blend of urban sophistication and outdoor adventure.',
    ctaTitle: 'Book Your Canada Business Class Flight Today.',
    ctaText: 'Experience premium travel to Canada with Fly Lux Sky and discover the legendary Canadian warmth.'
  },
  'switzerland': {
    slug: 'switzerland',
    title: 'Switzerland',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Switzerland',
    heroImage: '/images/countries/switzerland.jpg',
    heroVideo: '/video/switzerland_1.mp4',
    introTitle: 'Enjoy Your Switzerland Trip With Fly Lux Sky',
    introText: 'Experience the heart of Europe with Fly Lux Sky. Switzerland combines Alpine majesty with world-class banking, precision engineering, and chocolate perfection. From the financial hub of Zurich to the diplomatic center of Geneva, discover Swiss excellence at every turn.',
    ctaTitle: 'Book Your Switzerland Business Class Flight Today.',
    ctaText: 'Let Fly Lux Sky provide the Swiss precision and luxury you deserve for your journey to Switzerland.'
  }
}

const COUNTRY_CONTENT_KEY = 'flyluxsky_countries_content'

export const loadCountriesContent = async (): Promise<Record<string, CountryContent>> => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(COUNTRY_CONTENT_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with defaults to ensure all countries exist
        return { ...DEFAULT_COUNTRY_CONTENT, ...parsed }
      }
    }
  } catch {
    // Failed to load countries content from localStorage
  }
  return DEFAULT_COUNTRY_CONTENT
}

export const saveCountriesContent = (content: Record<string, CountryContent>) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COUNTRY_CONTENT_KEY, JSON.stringify(content))
    }
  } catch {
    // Failed to save countries content to localStorage
  }
}

export const exportCountriesContent = (content: Record<string, CountryContent>) => JSON.stringify(content, null, 2)

export const importCountriesContent = (json: string): Record<string, CountryContent> => {
  return JSON.parse(json)
}