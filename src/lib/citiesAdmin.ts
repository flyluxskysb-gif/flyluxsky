// Admin helper for managing city page content

export interface CityContent {
  slug: string // e.g. 'london'
  title: string
  subtitle: string
  description: string
  heroImage: string // public path to image
  heroVideo?: string // public path to video (optional)
  introTitle?: string // e.g. 'Enjoy Your Barcelona Trip With Fly Lux Sky'
  introText?: string // e.g. 'Explore Barcelona's rich history and modern charm...'
  ctaTitle?: string
  ctaText?: string
  updated_at?: string
}

export const DEFAULT_CITY_CONTENT: Record<string, CityContent> = {
  london: {
    slug: 'london',
    title: 'London',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to the United Kingdom',
    heroImage: '/images/london-big.jpg',
    heroVideo: '/video/london.mp4',
    introTitle: 'Enjoy Your London Trip With Fly Lux Sky',
    introText: 'Explore London\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your London Business Class Flight Today.',
    ctaText: 'Let Fly Lux Sky elevate your journey to London with unmatched luxury and convenience. Contact our expert travel advisors to secure your exclusive fare and experience the UK like never before.'
  },
  madrid: {
    slug: 'madrid',
    title: 'Madrid',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Spain',
    heroImage: '/images/madrid.jpg',
    heroVideo: '/video/madrid.mp4',
    introTitle: 'Enjoy Your Madrid Trip With Fly Lux Sky',
    introText: 'Explore Madrid\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Madrid Business Class Flight Today.',
    ctaText: 'Experience premium travel to Madrid.'
  },
  athens: {
    slug: 'athens',
    title: 'Athens',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Greece',
    heroImage: '/images/athens.jpg',
    heroVideo: '/video/athenes.mp4',
    introTitle: 'Enjoy Your Athens Trip With Fly Lux Sky',
    introText: 'Explore Athens\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Athens Business Class Flight Today.',
    ctaText: 'Experience premium travel to Athens.'
  },
  rome: {
    slug: 'rome',
    title: 'Rome',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Italy',
    heroImage: '/images/rome.jpg',
    heroVideo: '/video/rome.mp4',
    introTitle: 'Enjoy Your Rome Trip With Fly Lux Sky',
    introText: 'Explore Rome\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Rome Business Class Flight Today.',
    ctaText: 'Experience premium travel to Rome.'
  },
  paris: {
    slug: 'paris',
    title: 'Paris',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to France',
    heroImage: '/images/paris.jpg',
    heroVideo: '/video/paris.mp4',
    introTitle: 'Enjoy Your Paris Trip With Fly Lux Sky',
    introText: 'Explore Paris\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Paris Business Class Flight Today.',
    ctaText: 'Experience premium travel to Paris.'
  },
  lisbon: {
    slug: 'lisbon',
    title: 'Lisbon',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Portugal',
    heroImage: '/images/lisbon.jpg',
    heroVideo: '/video/lisbon.mp4',
    introTitle: 'Enjoy Your Lisbon Trip With Fly Lux Sky',
    introText: 'Explore Lisbon\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Lisbon Business Class Flight Today.',
    ctaText: 'Experience premium travel to Lisbon.'
  },
  amsterdam: {
    slug: 'amsterdam',
    title: 'Amsterdam',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to the Netherlands',
    heroImage: '/images/london-big.jpg',
    heroVideo: '/video/amsterdam.mp4',
    introTitle: 'Enjoy Your Amsterdam Trip With Fly Lux Sky',
    introText: 'Explore Amsterdam\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Amsterdam Business Class Flight Today.',
    ctaText: 'Experience premium travel to Amsterdam.'
  },
  singapore: {
    slug: 'singapore',
    title: 'Singapore',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Singapore',
    heroImage: '/images/london-big.jpg',
    heroVideo: '/video/singapore.mp4',
    introTitle: 'Enjoy Your Singapore Trip With Fly Lux Sky',
    introText: 'Explore Singapore\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Singapore Business Class Flight Today.',
    ctaText: 'Experience premium travel to Singapore.'
  },
  barcelona: {
    slug: 'barcelona',
    title: 'Barcelona',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Spain',
    heroImage: '/images/london-big.jpg',
    heroVideo: '/video/barcelona.mp4',
    introTitle: 'Enjoy Your Barcelona Trip With Fly Lux Sky',
    introText: 'Explore Barcelona\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Barcelona Business Class Flight Today.',
    ctaText: 'Experience premium travel to Barcelona.'
  },
  frankfurt: {
    slug: 'frankfurt',
    title: 'Frankfurt',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Germany',
    heroImage: '/images/london-big.jpg',
    heroVideo: '/video/frankfurt.mp4',
    introTitle: 'Enjoy Your Frankfurt Trip With Fly Lux Sky',
    introText: 'Explore Frankfurt\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Frankfurt Business Class Flight Today.',
    ctaText: 'Experience premium travel to Frankfurt.'
  },
  istanbul: {
    slug: 'istanbul',
    title: 'Istanbul',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Turkey',
    heroImage: '/images/london-big.jpg',
    heroVideo: '/video/istanbul.mp4',
    introTitle: 'Enjoy Your Istanbul Trip With Fly Lux Sky',
    introText: 'Explore Istanbul\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Istanbul Business Class Flight Today.',
    ctaText: 'Experience premium travel to Istanbul.'
  },
  sydney: {
    slug: 'sydney',
    title: 'Sydney',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Australia',
    heroImage: '/images/london-big.jpg',
    heroVideo: '/video/sidney.mp4',
    introTitle: 'Enjoy Your Sydney Trip With Fly Lux Sky',
    introText: 'Explore Sydney\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Sydney Business Class Flight Today.',
    ctaText: 'Experience premium travel to Sydney.'
  },
  dubai: {
    slug: 'dubai',
    title: 'Dubai',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to the UAE',
    heroImage: '/images/london-big.jpg',
    heroVideo: '/video/dubai.mp4',
    introTitle: 'Enjoy Your Dubai Trip With Fly Lux Sky',
    introText: 'Explore Dubai\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Dubai Business Class Flight Today.',
    ctaText: 'Experience premium travel to Dubai.'
  },
  tokyo: {
    slug: 'tokyo',
    title: 'Tokyo',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Japan',
    heroImage: '/images/london-big.jpg',
    heroVideo: '/video/tokyo.mp4',
    introTitle: 'Enjoy Your Tokyo Trip With Fly Lux Sky',
    introText: 'Explore Tokyo\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Tokyo Business Class Flight Today.',
    ctaText: 'Experience premium travel to Tokyo.'
  },
  doha: {
    slug: 'doha',
    title: 'Doha',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Qatar',
    heroImage: '/images/london-big.jpg',
    introTitle: 'Enjoy Your Doha Trip With Fly Lux Sky',
    introText: 'Explore Doha\'s rich history and modern charm. Fly Lux Sky offers flight options and pricing designed to fit your itinerary and preferences. Whether for business meetings or sightseeing, expect spacious seating, priority boarding, and excellent service. Travel relaxed and arrive ready.',
    ctaTitle: 'Book Your Doha Business Class Flight Today.',
    ctaText: 'Experience premium travel to Doha.'
  },
  'new-york': {
    slug: 'new-york',
    title: 'New York',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to the United States',
    heroImage: '/images/cities/new-york.jpg',
    heroVideo: '/video/newyork_1.mp4',
    introTitle: 'Enjoy Your New York Trip With Fly Lux Sky',
    introText: 'Experience the energy of the Big Apple with Fly Lux Sky. From Broadway shows to Wall Street, New York offers endless opportunities. Our premium flight options ensure you arrive refreshed and ready to explore America\'s most dynamic city.',
    ctaTitle: 'Book Your New York Business Class Flight Today.',
    ctaText: 'Let Fly Lux Sky elevate your journey to New York with unmatched luxury and convenience. Contact our expert travel advisors to secure your exclusive fare.'
  },
  'hong-kong': {
    slug: 'hong-kong',
    title: 'Hong Kong',
    subtitle: 'First & Business Class Flights',
    description: 'Discover the Best First & Business Class Travel Deals to Hong Kong',
    heroImage: '/images/cities/hong-kong.jpg',
    heroVideo: '/video/honkong_1.mp4',
    introTitle: 'Enjoy Your Hong Kong Trip With Fly Lux Sky',
    introText: 'Discover where East meets West in Hong Kong. This vibrant metropolis combines traditional Chinese culture with modern international business. Fly Lux Sky ensures your journey to this Pearl of the Orient is as spectacular as the destination itself.',
    ctaTitle: 'Book Your Hong Kong Business Class Flight Today.',
    ctaText: 'Experience premium travel to Hong Kong with Fly Lux Sky. Our luxury service matches the sophistication of this world-class destination.'
  }
}

const CITY_CONTENT_KEY = 'flyluxsky_cities_content'

export const loadCitiesContent = async (): Promise<Record<string, CityContent>> => {
  try {
    const stored = localStorage.getItem(CITY_CONTENT_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}

  try {
    const res = await fetch('/api/cities/content', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      const payload: Record<string, CityContent> = data.content || {}
      return Object.keys(DEFAULT_CITY_CONTENT).reduce((acc, key) => {
        acc[key] = { ...DEFAULT_CITY_CONTENT[key], ...(payload[key] || {}) }
        return acc
      }, {} as Record<string, CityContent>)
    }
  } catch {}

  return DEFAULT_CITY_CONTENT
}

export const saveCitiesContent = (content: Record<string, CityContent>) => {
  const withTs = Object.fromEntries(
    Object.entries(content).map(([k, v]) => [k, { ...v, updated_at: new Date().toISOString() }])
  )
  localStorage.setItem(CITY_CONTENT_KEY, JSON.stringify(withTs))
}

export const exportCitiesContent = (content: Record<string, CityContent>) => JSON.stringify(content, null, 2)

export const importCitiesContent = (json: string): Record<string, CityContent> => {
  const data = JSON.parse(json)
  return data as Record<string, CityContent>
}