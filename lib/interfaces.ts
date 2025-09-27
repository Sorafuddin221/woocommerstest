export interface SocialLink {
  _id?: string;
  platform: string;
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  brand?: string;
  image: string;
  rating: number;
  originalPrice?: number | null;
  isSale: boolean;
  createdAt?: string;
  updatedAt?: string;
  url: string;
  shopDepartment?: string;
  reviewCount?: number;
  gallery?: string[];
  shortDescription?: string;
}

export interface BlogPost {
  _id: string;
  slug: string;
  category: string;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  author?: string;
  content?: string;
  affiliateLink?: string;
}

export interface Review {
  _id: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  page: string;
  children?: MenuItem[];
}

export interface Category {
  name: string;
  imageUrl: string | null;
}

export interface Settings {
  metaTitle: string;
  metaDescription: string;
  metaLogoUrl?: string;
  faviconUrl?: string;
  headerLogoUrl?: string;
  headerLogoText?: string;
  showHeaderLogoImage?: boolean;
  showHeaderLogoText?: boolean;
  showMegaDiscounts?: boolean;
  heroSlides?: HeroSlide[];
  clientLogos?: ClientLogo[];
  socialLinks?: SocialLink[];
  productsPageHero?: HeroSectionSettings;
  blogPageHero?: HeroSectionSettings;
  contactPageHero?: HeroSectionSettings;
}

export interface HeroSectionSettings {
  heading: string;
  imageUrl?: string;
  subheading?: string;
  buttonUrl?: string;
}

export interface ContactSettings {
  address: string;
  email: string;
  phone: string;
  formTitle: string;
  openingHours?: string;
}

export interface MegaDiscountFormData {
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

export interface ProductFormData {
  title: string;
  category: string;
  brand: string;
  shopDepartment: string;
  price: string;
  stock: string;
  description: string;
  shortDescription: string;
  metaKeywords: string;
  metaDescription: string;
  image: string; // Added for the image data URL
  gallery: string[]; // Added for gallery images
  url: string;
}

export interface Transaction {
  name: string;
  status: 'pending' | 'done' | 'cancelled';
  date: string;
  amount: string;
}

export interface UserFormData {
  username: string;
  email: string;
  password?: string;
  phone: string;
  isAdmin: boolean;
  isActive: boolean;
  address: string;
}

export interface User {
  _id: string;
  username: string;
  role: string;
}

export interface SearchResults {
  products: Product[];
  blogPosts: BlogPost[];
}

export interface ShopDepartment {
  _id: string;
  name: string;
}

export interface FooterSettings {
  gallery: string[];
  newsletterText: string;
  copyrightText: string;
  clientLogos: string[];
}

export interface HeroSlide {
  _id?: string;
  image: string;
  title: string;
  subtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

export interface ClientLogo {
  _id?: string;
  imageUrl: string;
  link?: string;
}

export interface ThemeSettings {
  metaTitle: string;
  metaDescription: string;
  metaLogoUrl?: string;
  faviconUrl?: string;
  headerLogoUrl?: string;
  headerLogoText?: string;
  showHeaderLogoImage?: boolean;
  showHeaderLogoText?: boolean;
  showMegaDiscounts?: boolean;
  heroSlides?: HeroSlide[];
  clientLogos?: ClientLogo[];
  socialLinks?: SocialLink[];
}

export interface Icon {
  _id?: string;
  icon: string;
  title: string;
  description: string;
}
