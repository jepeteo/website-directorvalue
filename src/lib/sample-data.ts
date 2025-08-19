// Sample data for development - Phase 1 MVP
// This will be replaced with real data later

type PlanType = "FREE_TRIAL" | "BASIC" | "PRO" | "VIP";

interface SampleBusiness {
  id: string;
  name: string;
  slug: string;
  description: string;
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  images?: string[];
  services?: string[];
  tags?: string[];
  workingHours?: Record<string, { open?: string; close?: string; closed?: boolean }>;
  planType: PlanType;
  status: string;
  categoryId?: string;
  averageRating?: number;
  reviewCount?: number;
}

export const SAMPLE_CATEGORIES = [
  {
    id: "cat-1",
    name: "Restaurants & Food",
    slug: "restaurants-food",
    description: "Restaurants, cafes, bakeries, and food services",
    icon: "🍽️",
    parentId: null,
    sortOrder: 1,
  },
  {
    id: "cat-2", 
    name: "Health & Medical",
    slug: "health-medical",
    description: "Doctors, dentists, clinics, and healthcare services",
    icon: "🏥",
    parentId: null,
    sortOrder: 2,
  },
  {
    id: "cat-3",
    name: "Professional Services",
    slug: "professional-services", 
    description: "Lawyers, accountants, consultants, and business services",
    icon: "💼",
    parentId: null,
    sortOrder: 3,
  },
  {
    id: "cat-4",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Contractors, landscaping, cleaning, and home services",
    icon: "🏠",
    parentId: null,
    sortOrder: 4,
  },
  {
    id: "cat-5",
    name: "Beauty & Wellness",
    slug: "beauty-wellness",
    description: "Salons, spas, gyms, and wellness centers",
    icon: "💅",
    parentId: null,
    sortOrder: 5,
  },
  {
    id: "cat-6",
    name: "Automotive",
    slug: "automotive",
    description: "Car repair, dealerships, and automotive services",
    icon: "🚗",
    parentId: null,
    sortOrder: 6,
  },
  {
    id: "cat-7",
    name: "Technology",
    slug: "technology",
    description: "IT services, software development, and tech support",
    icon: "💻",
    parentId: null,
    sortOrder: 7,
  },
  {
    id: "cat-8",
    name: "Education",
    slug: "education",
    description: "Schools, tutoring, training, and educational services",
    icon: "📚",
    parentId: null,
    sortOrder: 8,
  },
];

export const SAMPLE_BUSINESSES: SampleBusiness[] = [
  {
    id: "biz-1",
    name: "Bella Vista Restaurant",
    slug: "bella-vista-restaurant",
    description: "Authentic Italian cuisine with a modern twist. Family-owned restaurant serving fresh pasta, wood-fired pizzas, and traditional Italian dishes.",
    email: "info@bellavista.com",
    phone: "+1 (555) 123-4567",
    website: "https://bellavista.com",
    addressLine1: "123 Main Street",
    city: "New York",
    state: "NY", 
    postalCode: "10001",
    country: "United States",
    latitude: 40.7589,
    longitude: -73.9851,
    logo: "/api/placeholder/100/100",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    services: ["Dine-in", "Takeout", "Delivery", "Catering"],
    tags: ["Italian", "Pizza", "Pasta", "Wine", "Family-friendly"],
    workingHours: {
      monday: { open: "11:00", close: "22:00", closed: false },
      tuesday: { open: "11:00", close: "22:00", closed: false },
      wednesday: { open: "11:00", close: "22:00", closed: false },
      thursday: { open: "11:00", close: "23:00", closed: false },
      friday: { open: "11:00", close: "23:00", closed: false },
      saturday: { open: "12:00", close: "23:00", closed: false },
      sunday: { open: "12:00", close: "21:00", closed: false },
    },
    planType: "VIP",
    status: "ACTIVE",
    categoryId: "cat-1",
    averageRating: 4.8,
    reviewCount: 127,
  },
  {
    id: "biz-2",
    name: "Dr. Sarah Johnson MD",
    slug: "dr-sarah-johnson-md",
    description: "Board-certified family physician providing comprehensive primary care for patients of all ages. Preventive care, chronic disease management, and wellness programs.",
    email: "appointments@drjohnson.com",
    phone: "+1 (555) 234-5678",
    website: "https://drjohnson.com",
    addressLine1: "456 Health Boulevard",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90210", 
    country: "United States",
    latitude: 34.0522,
    longitude: -118.2437,
    logo: "/api/placeholder/100/100",
    images: ["/api/placeholder/400/300"],
    services: ["Primary Care", "Preventive Medicine", "Health Screenings", "Vaccinations"],
    tags: ["Family Medicine", "Primary Care", "Wellness", "Preventive Care"],
    workingHours: {
      monday: { open: "08:00", close: "17:00", closed: false },
      tuesday: { open: "08:00", close: "17:00", closed: false },
      wednesday: { open: "08:00", close: "17:00", closed: false },
      thursday: { open: "08:00", close: "17:00", closed: false },
      friday: { open: "08:00", close: "16:00", closed: false },
      saturday: { open: "09:00", close: "12:00", closed: false },
      sunday: { open: "", close: "", closed: true },
    },
    planType: "PRO",
    status: "ACTIVE",
    categoryId: "cat-2",
    averageRating: 4.9,
    reviewCount: 89,
  },
  {
    id: "biz-3",
    name: "TechSolutions Pro",
    slug: "techsolutions-pro", 
    description: "Full-service IT consulting and support for small to medium businesses. Network setup, cybersecurity, cloud migration, and 24/7 technical support.",
    email: "contact@techsolutionspro.com",
    phone: "+1 (555) 345-6789",
    website: "https://techsolutionspro.com",
    addressLine1: "789 Innovation Drive",
    city: "Austin", 
    state: "TX",
    postalCode: "78701",
    country: "United States",
    latitude: 30.2672,
    longitude: -97.7431,
    logo: "/api/placeholder/100/100",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    services: ["IT Consulting", "Network Setup", "Cybersecurity", "Cloud Services", "24/7 Support"],
    tags: ["IT Support", "Cybersecurity", "Cloud", "Business Technology"],
    workingHours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "17:00", closed: false },
      saturday: { open: "", close: "", closed: true },
      sunday: { open: "", close: "", closed: true },
    },
    planType: "BASIC",
    status: "ACTIVE",
    categoryId: "cat-7",
    averageRating: 4.6,
    reviewCount: 45,
  },
  {
    id: "biz-4",
    name: "Green Thumb Landscaping",
    slug: "green-thumb-landscaping",
    description: "Professional landscaping and garden design services. Lawn maintenance, tree care, irrigation systems, and seasonal cleanup services.",
    email: "info@greenthumb.com",
    phone: "+1 (555) 456-7890",
    website: "https://greenthumb.com",
    addressLine1: "321 Garden Lane",
    city: "Denver",
    state: "CO",
    postalCode: "80202",
    country: "United States", 
    latitude: 39.7392,
    longitude: -104.9903,
    logo: "/api/placeholder/100/100",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
    services: ["Landscape Design", "Lawn Care", "Tree Service", "Irrigation", "Seasonal Cleanup"],
    tags: ["Landscaping", "Garden Design", "Lawn Care", "Outdoor Living"],
    workingHours: {
      monday: { open: "07:00", close: "17:00", closed: false },
      tuesday: { open: "07:00", close: "17:00", closed: false },
      wednesday: { open: "07:00", close: "17:00", closed: false },
      thursday: { open: "07:00", close: "17:00", closed: false },
      friday: { open: "07:00", close: "17:00", closed: false },
      saturday: { open: "08:00", close: "16:00", closed: false },
      sunday: { open: "", close: "", closed: true },
    },
    planType: "BASIC",
    status: "ACTIVE",
    categoryId: "cat-4",
    averageRating: 4.7,
    reviewCount: 63,
  },
  {
    id: "biz-5",
    name: "Serenity Spa & Wellness",
    slug: "serenity-spa-wellness",
    description: "Luxury spa offering massages, facials, body treatments, and wellness therapies. Relax and rejuvenate in our peaceful, zen-inspired environment.",
    email: "book@serenityspa.com",
    phone: "+1 (555) 567-8901",
    website: "https://serenityspa.com",
    addressLine1: "654 Wellness Way",
    city: "Miami",
    state: "FL",
    postalCode: "33101",
    country: "United States",
    latitude: 25.7617,
    longitude: -80.1918,
    logo: "/api/placeholder/100/100",
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    services: ["Massage Therapy", "Facials", "Body Treatments", "Aromatherapy", "Wellness Coaching"],
    tags: ["Spa", "Massage", "Wellness", "Relaxation", "Beauty"],
    workingHours: {
      monday: { open: "09:00", close: "19:00", closed: false },
      tuesday: { open: "09:00", close: "19:00", closed: false },
      wednesday: { open: "09:00", close: "19:00", closed: false },
      thursday: { open: "09:00", close: "20:00", closed: false },
      friday: { open: "09:00", close: "20:00", closed: false },
      saturday: { open: "08:00", close: "20:00", closed: false },
      sunday: { open: "10:00", close: "18:00", closed: false },
    },
    planType: "VIP",
    status: "ACTIVE",
    categoryId: "cat-5",
    averageRating: 4.9,
    reviewCount: 156,
  },
];

export const SAMPLE_REVIEWS = [
  {
    id: "rev-1",
    rating: 5,
    title: "Outstanding Italian cuisine!",
    content: "Bella Vista exceeded all expectations. The pasta was perfectly al dente, the pizza crust was crispy and flavorful. Service was attentive without being intrusive. Highly recommend the tiramisu for dessert!",
    businessId: "biz-1",
    userId: "user-1",
    userName: "Michael R.",
    createdAt: "2024-08-15T19:30:00Z",
    isHidden: false,
  },
  {
    id: "rev-2", 
    rating: 5,
    title: "Excellent family doctor",
    content: "Dr. Johnson is thorough, caring, and takes time to listen to concerns. The office staff is friendly and scheduling is convenient. She really cares about preventive health and wellness.",
    businessId: "biz-2",
    userId: "user-2", 
    userName: "Jennifer S.",
    createdAt: "2024-08-10T14:15:00Z",
    isHidden: false,
  },
  {
    id: "rev-3",
    rating: 4,
    title: "Reliable IT support",
    content: "TechSolutions Pro helped us migrate to the cloud and set up our new security systems. Response time is good and they explain technical issues in terms we can understand.",
    businessId: "biz-3",
    userId: "user-3",
    userName: "David M.", 
    createdAt: "2024-08-08T10:45:00Z",
    isHidden: false,
  },
  {
    id: "rev-4",
    rating: 5,
    title: "Beautiful landscape transformation",
    content: "Green Thumb completely transformed our backyard. Professional, reliable, and attention to detail is amazing. Our neighbors keep asking who did our landscaping!",
    businessId: "biz-4",
    userId: "user-4",
    userName: "Lisa P.",
    createdAt: "2024-08-05T16:20:00Z", 
    isHidden: false,
  },
  {
    id: "rev-5",
    rating: 5,
    title: "Pure relaxation",
    content: "Serenity Spa is my go-to place for stress relief. The massage therapists are skilled and the atmosphere is so peaceful. Worth every penny for the self-care experience.",
    businessId: "biz-5",
    userId: "user-5",
    userName: "Amanda K.",
    createdAt: "2024-08-03T12:00:00Z",
    isHidden: false,
  },
];

// Helper functions for working with sample data
export function getSampleBusinesses() {
  return SAMPLE_BUSINESSES;
}

export function getSampleBusinessById(id: string) {
  return SAMPLE_BUSINESSES.find(business => business.id === id);
}

export function getSampleBusinessBySlug(slug: string) {
  return SAMPLE_BUSINESSES.find(business => business.slug === slug);
}

export function getSampleBusinessesByCategory(categoryId: string) {
  return SAMPLE_BUSINESSES.filter(business => business.categoryId === categoryId);
}

export function getSampleCategories() {
  return SAMPLE_CATEGORIES;
}

export function getSampleCategoryById(id: string) {
  return SAMPLE_CATEGORIES.find(category => category.id === id);
}

export function getSampleCategoryBySlug(slug: string) {
  return SAMPLE_CATEGORIES.find(category => category.slug === slug);
}

export function getSampleReviewsByBusinessId(businessId: string) {
  return SAMPLE_REVIEWS.filter(review => review.businessId === businessId);
}

export function searchSampleBusinesses(query: string, category?: string, location?: string) {
  let filteredBusinesses = SAMPLE_BUSINESSES;

  // Filter by category
  if (category && category !== 'all') {
    const categoryData = getSampleCategoryBySlug(category);
    if (categoryData) {
      filteredBusinesses = filteredBusinesses.filter(business => business.categoryId === categoryData.id);
    }
  }

  // Filter by location
  if (location) {
    filteredBusinesses = filteredBusinesses.filter(business => 
      (business.city && business.city.toLowerCase().includes(location.toLowerCase())) ||
      (business.state && business.state.toLowerCase().includes(location.toLowerCase()))
    );
  }

  // Filter by search query
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredBusinesses = filteredBusinesses.filter(business =>
      business.name.toLowerCase().includes(searchTerm) ||
      business.description.toLowerCase().includes(searchTerm) ||
      (business.tags && business.tags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
      (business.services && business.services.some(service => service.toLowerCase().includes(searchTerm)))
    );
  }

  return filteredBusinesses;
}
