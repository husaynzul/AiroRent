import { ReactNode, type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import logoSrc from '@assets/file_0000000000148211841fa7f5697fcb2f_2_1788136018448.png';
import exploreReference from '@assets/Screenshot_20260830-080641_1788070712166.jpg';
import deckReference from '@assets/Screenshot_20260830-080650_1788070712237.jpg';
import mapReference from '@assets/Screenshot_20260830-081244_1788070712144.jpg';
import profileReference from '@assets/Screenshot_20260830-080806_1788070736616.jpg';
import datesReference from '@assets/Screenshot_20260830-080720_1788070712360.jpg';
import whatsappIconSrc from '@assets/WhatsApp-Logo.wine_1788298140645.png';
import priceFilterReference from '@assets/20260905_052346_1788568403174.jpg';
import coHostCardReference from '@assets/file_00000000781c8210aed083d0160eb4ab_1788330690546.png';
import listPlaceCardReference from '@assets/file_00000000017c8210b4432f4cc821b333_1788330699951.png';
import limestoneLoftImage from '@assets/generated_images/jakurzi-limestone-loft.jpg';
import seaviewTerraceImage from '@assets/generated_images/jakurzi-seaview-terrace.jpg';
import gozoFarmhouseImage from '@assets/generated_images/jakurzi-gozo-farmhouse.jpg';
import propertyHouse3d from '@assets/property-house-card.png';
import propertyApartment3d from '@assets/property-apartment-card.png';
import propertyVilla3d from '@assets/property-villa-card.png';
import propertyStudio3d from '@assets/property-studio-card.png';
import propertyTownhouse3d from '@assets/property-townhouse-card.png';
import propertyPenthouse3d from '@assets/property-penthouse-card.png';
import propertyGuesthouse3d from '@assets/property-guesthouse-card.png';
import propertyDuplex3d from '@assets/property-duplex-card.png';
import maisonetteCategoryImage from '@assets/file_00000000b1d88207a1ae334c223fdf35_2_1788584194073.png';
import bookingLogoSrc from '@assets/file_0000000050cc8208ac2c6503f1c199fb_1788659624229.png';
import exploreLogoSrc from '@assets/file_00000000636481f48c8b2afe1f88d533_5_1788659858241.png';
import {
  ArrowLeft, ArrowRight, Bath, Bell, BedDouble, Building2, CalendarDays, Check,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, DoorOpen,
  Filter, Heart, Home, HousePlus, KeyRound, Layers3, ListFilter, LockKeyhole,
  MapPin, Menu, MessageCircle, Minus, Navigation, Pencil, Phone,
  Plus, Search, Send, Settings, ShieldCheck, SlidersHorizontal, Sparkles,
  Star, Tag, UserRound, UsersRound, WalletCards, X, Accessibility, BellRing,
  Globe2, ReceiptText, BriefcaseBusiness,
} from 'lucide-react';

type Mode = 'Rent' | 'Buy' | 'Short Let';
type FilterPurpose = 'Rent' | 'Short Rent' | 'Buy' | 'Trip / Booking';
type FilterState = {
  purpose: FilterPurpose;
  minPrice: number;
  maxPrice: number;
  beds: string;
  baths: string;
  garages: string;
  propertyType: string;
  propertyTypes: string[];
  location: string;
  rentType: string;
  stayType: string;
  furnishing: string;
  availability: string;
  moveInDate: string;
  amenities: string[];
  listedBy: string;
  verifiedOnly: boolean;
  contactPreference: string;
  duration: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number;
  infants: number;
  pets: number;
  priceUnit: string;
  buyingPurpose: string;
  propertyStatus: string;
  propertySize: string;
  parking: string;
  outdoorFeatures: string[];
  views: string;
  investmentFilters: string[];
  seller: string;
  documents: string[];
  bookingOptions: string[];
  petPolicy: string;
  accessibility: string[];
  hostLanguage: string;
  hostType: string;
};

const defaultFilters: FilterState = {
  purpose: 'Rent',
  minPrice: 1989,
  maxPrice: 3235,
  beds: 'Any',
  baths: 'Any',
  garages: 'Any',
  propertyType: 'Any',
  propertyTypes: [],
  location: 'Any',
  rentType: 'Long Term',
  stayType: 'Long Term',
  furnishing: 'Any',
  availability: 'Any',
  moveInDate: '',
  amenities: [],
  listedBy: 'Any',
  verifiedOnly: false,
  contactPreference: 'Any',
  duration: 'Any',
  checkIn: '',
  checkOut: '',
  guests: 2,
  children: 0,
  infants: 0,
  pets: 0,
  priceUnit: 'Per Night',
  buyingPurpose: 'Buy to Live',
  propertyStatus: 'Any',
  propertySize: 'Any',
  parking: 'Any',
  outdoorFeatures: [],
  views: 'Any',
  investmentFilters: [],
  seller: 'Any',
  documents: [],
  bookingOptions: [],
  petPolicy: 'Any',
  accessibility: [],
  hostLanguage: 'Any Language',
  hostType: 'Any',
};

const filterPropertyTypes = [
  { label: 'House', icon: Home, image: propertyHouse3d },
  { label: 'Apartment', icon: Building2, image: propertyApartment3d },
  { label: 'Villa', icon: Sparkles, image: propertyVilla3d },
  { label: 'Townhouse', icon: Home, image: propertyTownhouse3d },
  { label: 'Penthouse', icon: Building2, image: propertyPenthouse3d },
  { label: 'Studio', icon: DoorOpen, image: propertyStudio3d },
  { label: 'Guesthouse', icon: Home, image: propertyGuesthouse3d },
  { label: 'Duplex', icon: Building2, image: propertyDuplex3d },
] as const;

const filterAmenities = [
  ['Wi-Fi', Navigation], ['Air Conditioning', Sparkles], ['Heating', Sparkles],
  ['Kitchen', Home], ['Washing Machine', CircleHelp], ['TV', CircleHelp],
  ['Refrigerator', CircleHelp], ['Dishwasher', CircleHelp], ['Elevator', Building2],
  ['Balcony', Home], ['Garden', Sparkles], ['Swimming Pool', Sparkles],
  ['Bathtub', CircleHelp], ['Shower', CircleHelp], ['Workspace', BriefcaseBusiness],
  ['Security', ShieldCheck], ['Private Entrance', KeyRound], ['Parking', Navigation],
] as const;

const filterBookingOptions = [
  ['Instant Book', Sparkles], ['Self Check-in', KeyRound], ['Free Cancellation', Check],
  ['Pets Allowed', UsersRound], ['Pay Online', WalletCards], ['Entire Place', Home],
  ['Private Room', DoorOpen], ['Shared Room', UsersRound],
] as const;

const filterAccessibilityOptions = [
  ['Step-free Entrance', Accessibility], ['Wide Entrance', DoorOpen],
  ['Elevator Access', Building2], ['Accessible Parking', Navigation],
  ['Accessible Bathroom', Accessibility], ['Grab Bars', ShieldCheck],
  ['Shower Chair', CircleHelp], ['Wide Bedroom Entrance', DoorOpen],
] as const;

type Listing = {
  id: string;
  title: string;
  location: string;
  type: string;
  mode: Mode;
  price: string;
  detail: string;
  image: string;
  rating: string;
  tag?: string;
  verified?: boolean;
  garages?: number;
};

type BookingRecord = {
  id: string;
  listingId: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  dates: string;
  guests: number;
  total: string;
};

const images = {
  deck: seaviewTerraceImage,
  limestone: limestoneLoftImage,
  seaview: seaviewTerraceImage,
  farmhouse: gozoFarmhouseImage,
  map: mapReference,
  profile: profileReference,
  explore: exploreReference,
  dates: datesReference,
};

const listings: Listing[] = [
  { id: 'harbour-loft', title: 'The Limestone Harbour Loft', location: 'Vittoriosa, South East', type: 'Apartment', mode: 'Short Let', price: '€145', detail: '2 beds · 1 bath · sleeps 4', image: images.limestone, rating: '4.92', tag: 'Guest favourite', verified: true, garages: 0 },
  { id: 'seaview-sliema', title: 'Seaview apartment with terrace', location: 'Sliema, Central', type: 'Apartment', mode: 'Rent', price: '€1,280 / mo', detail: '2 beds · 2 baths · 98 m²', image: images.seaview, rating: '4.8', tag: 'New this week', verified: true, garages: 1 },
  { id: 'garden-rabat', title: 'A quiet garden home near Rabat', location: 'Rabat, West', type: 'House', mode: 'Buy', price: '€685,000', detail: '3 beds · 2 baths · 164 m²', image: images.farmhouse, rating: '4.75', tag: 'Owner listed', garages: 2 },
  { id: 'gozo-stone', title: 'Sun-washed stone farmhouse', location: 'Xagħra, Gozo', type: 'House', mode: 'Short Let', price: '€210', detail: '4 beds · 3 baths · sleeps 8', image: images.farmhouse, rating: '4.97', tag: 'Guest favourite', verified: true, garages: 2 },
  { id: 'msida-studio', title: 'Bright studio by the marina', location: 'Msida, Central', type: 'Studio', mode: 'Rent', price: '€850 / mo', detail: '1 bed · 1 bath · 46 m²', image: images.limestone, rating: '4.61', garages: 0 },
  { id: 'marsaxlokk-villa', title: 'Pool villa, close to the sea', location: 'Marsaxlokk, South East', type: 'Villa', mode: 'Buy', price: '€1,180,000', detail: '4 beds · 3 baths · 240 m²', image: images.seaview, rating: '4.88', tag: 'Price reduced', verified: true, garages: 2 },
];

const hostPhone = '+35679001842';

function openWhatsApp(listing: Listing) {
  const message = encodeURIComponent(`Hi Maria, I’m interested in ${listing.title} in ${listing.location}. Is it still available?`);
  window.open(`https://wa.me/${hostPhone.replace(/\D/g, '')}?text=${message}`, '_blank', 'noopener,noreferrer');
}

function callHost() {
  window.location.href = `tel:${hostPhone}`;
}

const recentBookings: BookingRecord[] = [
  { id: 'booking-seaview', listingId: 'seaview-sliema', status: 'Upcoming', dates: 'May 12 – May 16, 2025', guests: 4, total: '€920' },
  { id: 'booking-gozo', listingId: 'gozo-stone', status: 'Upcoming', dates: 'Jun 2 – Jun 6, 2025', guests: 2, total: '€720' },
  { id: 'booking-studio', listingId: 'msida-studio', status: 'Upcoming', dates: 'Apr 28 – Apr 30, 2025', guests: 2, total: '€340' },
  { id: 'booking-villa', listingId: 'marsaxlokk-villa', status: 'Completed', dates: 'Mar 10 – Mar 12, 2025', guests: 5, total: '€680' },
];

const categories = [
  { label: 'Apartments', icon: Building2 },
  { label: 'Houses', icon: Home },
  { label: 'Studios', icon: DoorOpen },
  { label: 'Villas', icon: Sparkles },
  { label: 'Land', icon: Layers3 },
  { label: 'Commercial', icon: Tag },
];

function readSaved(): string[] {
  try { return JSON.parse(localStorage.getItem('jakurzi:wishlist') || '[]'); } catch { return []; }
}
function readRecent(): string[] {
  try { return JSON.parse(localStorage.getItem('jakurzi:recent') || '[]'); } catch { return []; }
}
function saveRecent(id: string) {
  const next = [id, ...readRecent().filter((item) => item !== id)].slice(0, 6);
  localStorage.setItem('jakurzi:recent', JSON.stringify(next));
}
function readUserName(): string {
  try { return localStorage.getItem('jakurzi:profile-name')?.trim() || 'Husnain'; } catch { return 'Husnain'; }
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
      <img src={logoSrc} alt="AiroRent brand mark" className={`size-9 rounded-full object-cover ring-1 ring-[hsl(var(--primary)/.22)] ${light ? 'bg-white' : ''}`} />
      <span className={`text-[1.28rem] font-bold tracking-[-.055em] ${light ? 'text-white' : 'text-[hsl(var(--foreground))]'}`}>AiroRent</span>
    </Link>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
  const [, setLocation] = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--border)/.7)] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1260px] items-center justify-between px-5 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-2 md:flex">
          <button onClick={() => setLocation('/?mode=Rent')} className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-[hsl(var(--muted))]" data-testid="button-rent">Rent</button>
          <button onClick={() => setLocation('/?mode=Buy')} className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-[hsl(var(--muted))]" data-testid="button-buy">Buy</button>
          <button onClick={() => setLocation('/?mode=Short Let')} className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-[hsl(var(--muted))]" data-testid="button-short-let">Short let</button>
          <Link href="/map" className="rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-[hsl(var(--muted))]" data-testid="link-map-header">Map</Link>
        </div>
        <div className="flex items-center gap-2">
           <Link href="/post" className="hidden rounded-full bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-bold text-white shadow-[0_7px_16px_hsl(var(--primary)/.2)] transition hover:-translate-y-0.5 md:inline-flex md:text-sm" data-testid="link-post-header">List a property</Link>
          <button onClick={onMenu} className="grid size-10 place-items-center rounded-full border border-black/10 bg-white transition hover:bg-[hsl(var(--muted))]" aria-label="Open menu" data-testid="button-menu">
            <Menu size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const [location] = useLocation();
  if (location.startsWith('/listing/')) return null;
  const items = [
    { href: '/', label: 'Explore', icon: Search, logo: exploreLogoSrc, cropLogo: true },
    { href: '/wishlist', label: 'Saved', icon: Heart },
    { href: '/trips', label: 'Bookings', icon: CalendarDays, logo: bookingLogoSrc },
    { href: '/messages', label: 'Inbox', icon: MessageCircle },
    { href: '/profile', label: 'Profile', icon: UserRound },
  ];
  return (
    <nav className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-24px)] max-w-md -translate-x-1/2 rounded-[24px] border border-[hsl(var(--border)/.8)] bg-[hsl(var(--card)/.96)] px-3 pb-[max(9px,env(safe-area-inset-bottom))] pt-2 shadow-lift backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md justify-between">
        {items.map(({ href, label, icon: Icon, logo, cropLogo }) => {
          const active = href === '/' ? location === '/' : location.startsWith(href);
          return <Link key={href} href={href} className={`flex min-w-[54px] flex-col items-center gap-1 text-[10px] font-semibold transition ${active ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`} data-testid={`link-bottom-${label.toLowerCase()}`}>
            <span className={`relative grid size-9 place-items-center rounded-full ${active ? 'bg-[hsl(var(--secondary))]' : ''}`}>{logo ? (cropLogo ? <span className="grid size-8 place-items-center overflow-hidden"><img src={logo} alt="" aria-hidden="true" className="size-8 origin-top scale-[1.2] object-contain" /></span> : <img src={logo} alt="" aria-hidden="true" className="size-8 object-contain" />) : <Icon size={22} strokeWidth={active ? 2.7 : 2.2} />}{href === '/messages' && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[hsl(var(--primary))] text-[9px] font-bold text-white">3</span>}</span>{label}
          </Link>;
        })}
      </div>
    </nav>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const immersiveRoute = location.startsWith('/listing/');
  const homeRoute = location === '/' || location.startsWith('/?');
  const profileRoute = location.startsWith('/profile');
  const messagesRoute = location.startsWith('/messages');
  const mobileHeaderlessRoute = immersiveRoute || profileRoute || messagesRoute || location.startsWith('/wishlist') || location.startsWith('/trips') || homeRoute;
  return <div className={`texture min-h-[100dvh] ${immersiveRoute ? '' : 'pb-20 md:pb-0'}`}><div className={mobileHeaderlessRoute ? 'hidden md:block' : ''}><Header onMenu={() => setMenuOpen(true)} /></div>{children}<BottomNav />{menuOpen && <MenuSheet onClose={() => setMenuOpen(false)} />}</div>;
}

function MenuSheet({ onClose }: { onClose: () => void }) {
  const [, setLocation] = useLocation();
  const links = [['Rent', '/?mode=Rent'], ['Buy', '/?mode=Buy'], ['Short Let', '/?mode=Short Let'], ['Map', '/map'], ['For owners', '/post'], ['For agents', '/post'], ['Services', '/profile']];
  return <div className="fixed inset-0 z-50 animate-fade bg-[hsl(var(--foreground)/.45)] p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="mx-auto mt-[62px] max-w-md animate-rise rounded-[26px] bg-white p-5 shadow-lift" onClick={(event) => event.stopPropagation()}>
      <div className="mb-3 flex items-center justify-between"><Logo /><button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-[#f3f3f3]" data-testid="button-close-menu"><X size={18} /></button></div>
      <div className="divide-y divide-black/[.08]">{links.map(([label, href]) => <Link key={href + label} href={href} onClick={onClose} className="flex items-center justify-between py-3.5 text-[1.03rem] font-medium" data-testid={`link-menu-${label.toLowerCase().replace(' ', '-')}`}>{label}<ChevronRight size={17} className="text-black/50" /></Link>)}</div>
      <div className="mt-3 border-t border-black/[.08] pt-3">
         <button onClick={() => { onClose(); setLocation('/post'); }} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--primary))] py-3.5 font-bold text-white" data-testid="button-menu-post"><HousePlus size={18} />Post a listing</button>
        <Link href="/profile" onClick={onClose} className="mt-1 flex items-center gap-3 rounded-xl py-3 text-[1.03rem] font-medium" data-testid="link-menu-profile"><UserRound size={18} />Sign in</Link>
      </div>
    </div>
  </div>;
}

function SearchBar({ mode, setMode, query, setQuery }: { mode: Mode; setMode: (m: Mode) => void; query: string; setQuery: (s: string) => void }) {
  const [dateOpen, setDateOpen] = useState(false);
  const [guests, setGuests] = useState(2);
  const [location, setLocation] = useLocation();
  return <div className="mx-auto max-w-[1040px]">
    <div className="mb-4 flex w-fit items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1 shadow-soft">
      {(['Rent', 'Buy', 'Short Let'] as Mode[]).map((item) => <button key={item} onClick={() => setMode(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${mode === item ? 'bg-[hsl(var(--primary))] text-white shadow-sm' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'}`} data-testid={`button-mode-${item.toLowerCase().replace(' ', '-')}`}>{item}</button>)}
    </div>
    <div className="grid overflow-visible rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lift md:grid-cols-[1.45fr_1fr_1fr_auto]">
      <label className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-5 py-4 md:border-b-0 md:border-r">
        <MapPin size={20} className="text-[hsl(var(--primary))]" /><span className="flex-1"><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Where</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Malta, Gozo..." className="mt-0.5 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[hsl(var(--muted-foreground))]" data-testid="input-search-location" /></span>
      </label>
      <button onClick={() => setDateOpen((v) => !v)} className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-5 py-4 text-left md:border-b-0 md:border-r" data-testid="button-search-dates">
        <CalendarDays size={20} className="text-[hsl(var(--primary))]" /><span><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">When</span><span className="text-sm font-semibold">{mode === 'Short Let' ? 'Add dates' : 'Any dates'}</span></span>
      </button>
      <div className="relative flex items-center gap-3 border-b border-[hsl(var(--border))] px-5 py-4 md:border-b-0">
        <UsersRound size={20} className="text-[hsl(var(--primary))]" /><span><span className="block text-[10px] font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">Guests</span><span className="text-sm font-semibold">{guests} guests</span></span>
        <div className="ml-auto flex items-center gap-1"><button onClick={() => setGuests(Math.max(1, guests - 1))} className="grid size-7 place-items-center rounded-full border border-[hsl(var(--border))]" data-testid="button-guests-minus"><Minus size={13} /></button><button onClick={() => setGuests(guests + 1)} className="grid size-7 place-items-center rounded-full border border-[hsl(var(--border))]" data-testid="button-guests-plus"><Plus size={13} /></button></div>
      </div>
       <button onClick={() => setLocation(`/?mode=${mode}&q=${encodeURIComponent(query)}`)} className="m-2 flex items-center justify-center gap-2 rounded-[18px] bg-[hsl(var(--primary))] px-5 py-3 font-bold text-white shadow-[0_8px_18px_hsl(var(--primary)/.22)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_hsl(var(--primary)/.3)]" data-testid="button-search"><Search size={18} />Search</button>
    </div>
    {dateOpen && <div className="relative z-10 mt-2 max-w-sm rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-lift animate-rise"><div className="flex items-center justify-between"><span className="font-display text-xl">Choose your dates</span><button onClick={() => setDateOpen(false)} data-testid="button-close-dates"><X size={17} /></button></div><div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs"><span className="text-[hsl(var(--muted-foreground))]">M</span><span className="text-[hsl(var(--muted-foreground))]">T</span><span className="text-[hsl(var(--muted-foreground))]">W</span><span className="text-[hsl(var(--muted-foreground))]">T</span><span className="text-[hsl(var(--muted-foreground))]">F</span><span className="text-[hsl(var(--muted-foreground))]">S</span><span className="text-[hsl(var(--muted-foreground))]">S</span>{Array.from({ length: 28 }, (_, i) => <button key={i} onClick={() => setDateOpen(false)} className={`grid aspect-square place-items-center rounded-full text-sm hover:bg-[hsl(var(--primary)/.12)] ${i === 14 ? 'bg-[hsl(var(--primary))] font-bold text-white' : ''}`} data-testid={`button-date-${i + 1}`}>{i + 1}</button>)}</div></div>}
  </div>;
}

function ListingCard({ listing, saved, onSave, compact = false }: { listing: Listing; saved: boolean; onSave: (id: string) => void; compact?: boolean }) {
  const [, setLocation] = useLocation();
  const open = () => { saveRecent(listing.id); setLocation(`/listing/${listing.id}`); };
  return <article className={`group ${compact ? 'w-[164px] shrink-0' : ''}`} data-testid={`card-listing-${listing.id}`}>
    <div className={`relative overflow-hidden rounded-[18px] bg-[hsl(var(--muted))] ${compact ? 'aspect-[1.2]' : 'aspect-[1.12]'}`}>
      <img src={listing.image} alt={listing.title} onClick={open} className="size-full cursor-pointer object-cover transition duration-500 group-hover:scale-[1.035]" />
      {listing.tag && <span className="absolute left-3 top-3 rounded-full bg-[hsl(var(--card)/.92)] px-3 py-1.5 text-[11px] font-bold shadow-sm">{listing.tag}</span>}
      <button onClick={() => onSave(listing.id)} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full backdrop-blur-sm transition ${saved ? 'bg-[hsl(var(--primary))] text-white' : 'bg-[hsl(var(--card)/.88)] hover:scale-105'}`} aria-label={saved ? 'Remove from wishlist' : 'Save listing'} data-testid={`button-save-${listing.id}`}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>
    </div>
    <button onClick={open} className="mt-3 block w-full text-left" data-testid={`button-open-${listing.id}`}>
      <div className="flex items-start justify-between gap-2"><h3 className="line-clamp-1 font-bold">{listing.title}</h3><span className="flex shrink-0 items-center gap-1 text-xs font-bold"><Star size={12} fill="currentColor" />{listing.rating}</span></div>
      <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{listing.location}</p>
      <p className="mt-2 text-sm"><span className="font-bold">{listing.price}</span>{listing.mode === 'Short Let' && <span className="text-[hsl(var(--muted-foreground))]"> night</span>}</p>
    </button>
  </article>;
}

function Toast({ text, onClose }: { text: string; onClose: () => void }) {
  useEffect(() => { const timer = window.setTimeout(onClose, 2800); return () => window.clearTimeout(timer); }, [onClose]);
  return <div className="fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full bg-[hsl(var(--foreground))] px-4 py-3 text-sm font-semibold text-[hsl(var(--background))] shadow-lift md:bottom-8"><Check size={16} className="text-[hsl(var(--accent))]" />{text}</div>;
}

function MobileHomePage({ mode, setMode, query, setQuery, recent, saved, onSave }: { mode: Mode; setMode: (mode: Mode) => void; query: string; setQuery: (query: string) => void; recent: Listing[]; saved: string[]; onSave: (id: string) => void }) {
  const [, setLocation] = useLocation();
  const [browseTab, setBrowseTab] = useState('All');
  const recentItems = recent.length ? recent : [listings[1], listings[3], listings[2]];
  const nearbyItems = browseTab === 'Experiences' ? listings.filter((item) => item.mode === 'Short Let') : browseTab === 'Rooms' ? listings.filter((item) => item.type === 'Studio') : listings.filter((item) => item.mode !== 'Short Let');
  return <div className="bg-[hsl(var(--background))] md:hidden">
    <div className="px-5 pb-5 pt-5">
      <label className="flex h-[58px] items-center gap-3 rounded-full border border-black/10 bg-white px-5 shadow-[0_6px_18px_rgba(0,0,0,.12)]">
        <Search size={19} strokeWidth={2.4} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Start your search" className="min-w-0 flex-1 bg-transparent text-[16px] font-semibold outline-none placeholder:text-black placeholder:opacity-90" data-testid="input-mobile-search" />
         <button onClick={() => setLocation(`/?mode=${mode}&q=${encodeURIComponent(query)}`)} className="grid size-8 place-items-center rounded-full bg-[hsl(var(--primary))] text-white" aria-label="Run search" data-testid="button-mobile-search"><ArrowRight size={16} /></button>
      </label>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {['All', 'Homes', 'Experiences', 'Rooms'].map((item) => <button key={item} onClick={() => { setBrowseTab(item); if (item === 'Experiences') setMode('Short Let'); else if (item === 'Homes') setMode('Rent'); }} className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium ${browseTab === item ? 'border-black/15 bg-[#f2f2f2] shadow-inner' : 'border-black/10 bg-white'}`} data-testid={`button-mobile-tab-${item.toLowerCase()}`}>{item}</button>)}
      </div>
      <button onClick={() => setLocation('/trips')} className="mt-6 flex w-full items-center gap-4 rounded-[26px] border border-black/[.07] bg-white p-4 text-left shadow-[0_8px_20px_rgba(0,0,0,.08)]" data-testid="button-mobile-reservation">
        <div className="min-w-0 flex-1"><p className="text-[16px] font-bold leading-tight">Complete your Malta<br />home reservation</p><p className="mt-2 text-sm text-black/60">Sep 4–6 · 1 guest <ChevronRight className="inline" size={14} /></p></div>
        <img src={images.limestone} alt="" className="size-[76px] shrink-0 rounded-2xl object-cover" />
      </button>
    </div>
    <section className="border-t border-black/[.06] px-5 pb-8 pt-7">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-[23px] font-bold tracking-[-.04em]">Recently viewed</h2><button onClick={() => setLocation('/wishlist')} className="grid size-9 place-items-center rounded-full bg-[#f2f2f2]" aria-label="View recently viewed" data-testid="button-mobile-recent"><ArrowRight size={18} /></button></div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {recentItems.map((item) => <article key={item.id} className="w-[148px] shrink-0" data-testid={`card-mobile-recent-${item.id}`}>
          <div className="relative aspect-[.92] overflow-hidden rounded-[22px]"><img src={item.image} alt={item.title} className="size-full object-cover" /><button onClick={() => onSave(item.id)} className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-white/90" aria-label={saved.includes(item.id) ? 'Remove from wishlist' : 'Save listing'}><Heart size={17} fill={saved.includes(item.id) ? 'currentColor' : 'none'} /></button></div>
          <h3 className="mt-2 line-clamp-1 text-[15px] font-semibold">{item.location.split(',')[0]}</h3><p className="mt-1 text-sm text-black/55">{item.detail.split(' · ')[0]} · <Star className="inline" size={11} fill="currentColor" /> {item.rating}</p>
        </article>)}
      </div>
    </section>
    <section className="px-5 pb-28">
      <div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-medium text-black/55">Curated for your next move</p><h2 className="mt-1 text-[23px] font-bold tracking-[-.04em]">{browseTab === 'Experiences' ? 'Make a weekend of it' : 'Stay near Sliema'}</h2></div><button onClick={() => setLocation('/map')} className="grid size-9 place-items-center rounded-full bg-[#f2f2f2]" aria-label="Browse nearby homes" data-testid="button-mobile-nearby"><ArrowRight size={18} /></button></div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {nearbyItems.map((item) => <article key={item.id} className="w-[188px] shrink-0" data-testid={`card-mobile-nearby-${item.id}`}>
          <div className="relative aspect-[.93] overflow-hidden rounded-[22px]"><img src={item.image} alt={item.title} className="size-full object-cover" />{item.tag && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold">{item.tag}</span>}<button onClick={() => onSave(item.id)} className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm" aria-label={saved.includes(item.id) ? 'Remove from wishlist' : 'Save listing'}><Heart size={17} fill={saved.includes(item.id) ? 'currentColor' : 'none'} /></button></div>
          <h3 className="mt-2 line-clamp-1 text-[15px] font-semibold">{item.title}</h3><p className="mt-1 line-clamp-1 text-sm text-black/55">{item.price} · <Star className="inline" size={11} fill="currentColor" /> {item.rating}</p>
        </article>)}
      </div>
    </section>
  </div>;
}

function MobileSearchExperience({ query, setQuery, onClose, onSearch, onOpenFilters }: { query: string; setQuery: (query: string) => void; onClose: () => void; onSearch: (nextQuery?: string) => void; onOpenFilters: () => void }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const [likedDestination, setLikedDestination] = useState('');
  const categories = [
    ['All', Globe2],
    ['Beach', Sparkles],
    ['Mountains', Layers3],
    ['City', Building2],
    ['Countryside', Home],
  ] as const;
  const destinations = [
    { city: 'Istanbul', country: 'Türkiye', price: 'From $45 / night', image: images.limestone },
    { city: 'Dubai', country: 'UAE', price: 'From $55 / night', image: images.seaview },
    { city: 'London', country: 'United Kingdom', price: 'From $65 / night', image: images.explore },
    { city: 'Valletta', country: 'Malta', price: 'From €80 / night', image: images.limestone },
    { city: 'Sliema', country: 'Malta', price: 'From €95 / night', image: images.seaview },
    { city: 'Gozo', country: 'Malta', price: 'From €70 / night', image: images.farmhouse },
    { city: 'Paris', country: 'France', price: 'From $75 / night', image: images.explore },
    { city: 'Rome', country: 'Italy', price: 'From $68 / night', image: images.limestone },
  ];
  const recentSearches = [
    { place: 'Islamabad, Pakistan', details: 'Sep 1 – 2  ·  2 Guests', icon: Building2 },
    { place: 'New York, United States', details: '2 Guests', icon: Building2 },
    { place: 'Lahore, Punjab', details: 'Aug 20 – 22  ·  3 Guests', icon: Sparkles },
  ];
  return <div className="fixed inset-0 z-50 h-[100dvh] overflow-y-auto bg-[hsl(var(--background))] pb-8 text-[#1d2329] md:hidden" data-testid="mobile-search-experience">
    <div className="mx-auto max-w-md px-7 pb-8 pt-5">
      <div className="sticky top-0 z-40 -mx-7 bg-[hsl(var(--background)/.96)] px-7 pb-3 pt-5 backdrop-blur-xl">
        <div className="flex h-[74px] items-center gap-3 rounded-[17px] border-[1.5px] border-[#6f7880] bg-white px-5 shadow-[0_4px_12px_rgba(22,28,35,.06)]">
          <Search size={22} className="shrink-0 text-[#4b535b]" />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search destinations, places, or homes" aria-label="Search destinations, places, or homes" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-black/45" data-testid="input-search-experience-destination" />
          <button onClick={onOpenFilters} className="grid size-11 shrink-0 place-items-center rounded-full bg-[#252b31] text-white shadow-[0_5px_12px_rgba(22,28,35,.15)]" aria-label="Adjust search filters" data-testid="button-search-experience-adjust"><SlidersHorizontal size={19} /></button>
        </div>
      </div>
      <div className="mt-5 flex gap-2.5 overflow-x-auto pb-1">
        {categories.map(([label, Icon]) => <button key={label} onClick={() => setActiveCategory(label)} className={`flex h-[91px] w-[73px] shrink-0 flex-col items-center justify-center gap-2 rounded-[13px] border text-[11px] font-medium ${activeCategory === label ? 'border-transparent bg-[#e2e5e8] text-[#252b31]' : 'border-black/[.05] bg-white text-black/70'}`} data-testid={`button-search-category-${label.toLowerCase()}`}><Icon size={28} strokeWidth={2} /><span>{label}</span>{activeCategory === label && <span className="h-1 w-5 rounded-full bg-[#252b31]" />}</button>)}
      </div>
      <section className="mt-7">
        <div className="flex items-center justify-between"><h2 className="text-[14px] font-bold">{showAllDestinations ? 'Cities & countries' : 'Popular destinations'}</h2><button onClick={() => setShowAllDestinations((value) => !value)} className="flex items-center gap-1 text-[11px] font-semibold text-black/60" data-testid="button-search-view-all">{showAllDestinations ? 'Back' : 'View all'} <ChevronRight size={14} className={showAllDestinations ? 'rotate-180' : ''} /></button></div>
        <div className={`mt-3 gap-2.5 pb-1 ${showAllDestinations ? 'grid grid-cols-2' : 'flex overflow-x-auto'}`}>
          {(showAllDestinations ? destinations : destinations.slice(0, 3)).map((destination) => <button key={destination.city} onClick={() => { setQuery(destination.city); onSearch(destination.city); }} className={`relative shrink-0 overflow-hidden rounded-[17px] bg-black text-left ${showAllDestinations ? 'h-[184px] w-full' : 'h-[224px] w-[143px]'}`} data-testid={`button-search-destination-${destination.city.toLowerCase()}`}>
            <img src={destination.image} alt={destination.city} className="size-full object-cover opacity-90" /><span className="absolute inset-0 bg-black/35" /><span onClick={(event) => { event.stopPropagation(); setLikedDestination(likedDestination === destination.city ? '' : destination.city); }} className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-white/90 text-black" role="button" aria-label={`Save ${destination.city}`} data-testid={`button-save-destination-${destination.city.toLowerCase()}`}><Heart size={15} fill={likedDestination === destination.city ? 'currentColor' : 'none'} /></span><span className="absolute inset-x-3 bottom-3 text-white"><b className="block text-[14px]">{destination.city}</b><span className="block text-[11px]">{destination.country}</span><span className="mt-2 inline-block rounded-full border border-white/50 bg-black/35 px-2 py-1 text-[9px]">{destination.price}</span></span>
          </button>)}
        </div>
      </section>
      <section className="mt-7">
        <div className="flex items-center justify-between"><h2 className="text-[14px] font-bold">Recent searches</h2><button onClick={() => setQuery('')} className="text-[11px] font-semibold text-black/60" data-testid="button-clear-recent-searches">Clear all</button></div>
        <div className="mt-3 space-y-2">
          {recentSearches.map(({ place, details, icon: Icon }) => <button key={place} onClick={() => { setQuery(place); onSearch(place); }} className="flex w-full items-center gap-3 rounded-[15px] border border-black/[.06] bg-white px-3 py-2.5 text-left shadow-[0_2px_7px_rgba(0,0,0,.02)]" data-testid={`button-recent-search-${place.toLowerCase().replaceAll(' ', '-')}`}><span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[#e7e9eb] text-[#4b535b]"><Icon size={19} strokeWidth={2} /></span><span className="min-w-0 flex-1"><b className="block truncate text-[12px] font-medium">{place}</b><span className="mt-1 block text-[11px] text-black/45">{details}</span></span><ChevronRight size={17} className="shrink-0 text-black/60" /></button>)}
        </div>
      </section>
      <section className="mt-7">
        <div className="flex items-center justify-between"><h2 className="text-[14px] font-bold">Nearby</h2><span className="text-[11px] text-black/50">Around you</span></div>
        <button onClick={() => { setQuery('Sliema, Malta'); onSearch('Sliema, Malta'); }} className="mt-3 flex w-full items-center gap-3 rounded-[15px] border border-black/[.06] bg-white px-3 py-3 text-left shadow-[0_2px_7px_rgba(0,0,0,.02)]" data-testid="button-search-nearby"><span className="grid size-10 place-items-center rounded-[12px] bg-[#e7e9eb] text-[#4b535b]"><Navigation size={19} /></span><span className="min-w-0 flex-1"><b className="block text-[12px] font-semibold">Stays near your current area</b><span className="mt-1 block text-[11px] text-black/50">Sliema, Malta · Homes within easy reach</span></span><ChevronRight size={17} className="text-black/60" /></button>
      </section>
      <section className="mt-7">
        <div className="flex items-center justify-between"><h2 className="text-[14px] font-bold">Recommended destinations</h2><span className="text-[11px] text-black/50">Picked for you</span></div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {listings.slice(0, 2).map((listing) => <button key={listing.id} onClick={() => { setQuery(listing.location.split(',')[0]); onSearch(listing.location.split(',')[0]); }} className="overflow-hidden rounded-[15px] border border-black/[.06] bg-white text-left shadow-[0_2px_7px_rgba(0,0,0,.02)]" data-testid={`button-search-recommended-${listing.id}`}><img src={listing.image} alt={listing.title} className="h-[92px] w-full object-cover" /><span className="block px-3 py-2.5"><b className="block truncate text-[12px]">{listing.location.split(',')[0]}</b><span className="mt-1 block truncate text-[11px] text-black/50">{listing.type} · {listing.price}</span></span></button>)}
        </div>
      </section>
    </div>
  </div>;
}

function MobileMarketplacePage({ mode, setMode, query, setQuery, category, setCategory, matches, saved, onSave, onOpenFilters, onClearFilters }: { mode: Mode; setMode: (mode: Mode) => void; query: string; setQuery: (query: string) => void; category: string; setCategory: (category: string) => void; matches: Listing[]; saved: string[]; onSave: (id: string) => void; onOpenFilters: () => void; onClearFilters: () => void }) {
  const [, setLocation] = useLocation();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const propertyTabs = [
    ['All', Layers3],
    ['Apartments', Building2],
    ['Penthouses', Building2],
    ['Maisonettes', Home],
    ['Townhouses', Home],
    ['Villas', Sparkles],
    ['Studios', DoorOpen],
  ] as const;
  const mobileListings = matches;
  const trendingListings = query ? matches.slice(0, 5) : listings.filter((item) => item.mode === mode).slice(0, 5);
  const popularRentals = listings.filter((item) => item.mode === 'Rent').slice(0, 5);
  const categoryCards = [
    { label: 'Apartments', image: propertyApartment3d },
    { label: 'Penthouses', image: propertyPenthouse3d },
    { label: 'Maisonettes', image: maisonetteCategoryImage },
    { label: 'Townhouses', image: propertyTownhouse3d },
    { label: 'Villas', image: propertyVilla3d },
    { label: 'Studios', image: propertyStudio3d },
  ];
  const renderListingRow = (items: Listing[], rowName: string) => items.length ? (
    <div className="flex snap-x gap-4 overflow-x-auto pb-2 pr-1">
      {items.map((item) => (
        <div key={`${rowName}-${item.id}`} className="snap-start">
          <ListingCard listing={item} saved={saved.includes(item.id)} onSave={onSave} compact />
        </div>
      ))}
    </div>
  ) : (
    <p className="rounded-2xl bg-[hsl(var(--muted))] px-4 py-5 text-sm text-[hsl(var(--muted-foreground))]">No properties match this search yet.</p>
  );
  return <div className="bg-[hsl(var(--background))] md:hidden">
    <section className="sticky top-0 z-40 border-b border-black/[.06] bg-[hsl(var(--background)/.96)] px-5 pb-3 pt-3 backdrop-blur-xl">
      <div className="relative">
        <div className={`flex h-12 w-full items-center gap-3 rounded-full border bg-[#fafafa] px-4 shadow-[0_5px_16px_rgba(0,0,0,.08)] transition ${searchExpanded ? 'border-[hsl(var(--primary))] ring-4 ring-[hsl(var(--primary)/.08)]' : 'border-black/10'}`} role="search" onClick={() => setSearchExpanded(true)}>
          <div className="relative min-w-0 flex-1 translate-x-1.5">
            <Search size={18} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-[72px] -translate-y-1/2 text-black/60" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => setSearchExpanded(true)} placeholder="Find anything" aria-label="Find anything" className="w-full bg-transparent text-center text-sm outline-none placeholder:text-black/50" data-testid="input-mobile-market-search" />
          </div>
        </div>
        {searchExpanded && <MobileSearchExperience query={query} setQuery={setQuery} onClose={() => setSearchExpanded(false)} onSearch={(nextQuery) => { const searchQuery = nextQuery ?? query; setLocation(`/?mode=${mode}&q=${encodeURIComponent(searchQuery)}`); setSearchExpanded(false); }} onOpenFilters={() => { setSearchExpanded(false); onOpenFilters(); }} />}
      </div>
    </section>
    <div className="space-y-7 px-5 pb-28 pt-5">
      <section aria-labelledby="mobile-top-categories">
        <div className="mb-3 flex items-center justify-between"><h2 id="mobile-top-categories" className="text-[20px] font-semibold tracking-[-.04em]">Top Categories</h2><span className="text-xs text-black/45">Browse all</span></div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {categoryCards.map(({ label, image }) => <button key={label} onClick={() => setCategory(label)} className={`group w-[145px] shrink-0 overflow-hidden rounded-2xl border bg-white text-left transition ${category === label ? 'border-[hsl(var(--primary))] shadow-[0_0_0_2px_hsl(var(--primary)/.16)]' : 'border-black/[.08] hover:border-[hsl(var(--primary)/.45)]'}`} data-testid={`card-mobile-top-category-${label.toLowerCase()}`} aria-label={`Browse ${label}`}><img src={image} alt={`${label} property`} className="aspect-[1.48] w-full object-cover transition duration-300 group-hover:scale-[1.03]" /></button>)}
        </div>
      </section>
      <section aria-labelledby="mobile-trending-now">
        <div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--primary))]">Most loved this week</p><h2 id="mobile-trending-now" className="mt-1 text-[20px] font-semibold tracking-[-.04em]">Trending Now</h2></div><button onClick={() => setLocation('/map')} className="text-xs font-semibold underline underline-offset-4" data-testid="link-mobile-trending-map">Map</button></div>
        {renderListingRow(trendingListings, 'trending')}
      </section>
      <section aria-labelledby="mobile-popular-rentals">
        <div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--primary))]">Made for your next move</p><h2 id="mobile-popular-rentals" className="mt-1 text-[20px] font-semibold tracking-[-.04em]">Popular Rentals</h2></div><button onClick={() => { setMode('Rent'); setCategory('All'); }} className="text-xs font-semibold text-[hsl(var(--primary))]" data-testid="button-mobile-popular-rentals">See all</button></div>
        {renderListingRow(popularRentals, 'popular-rentals')}
      </section>
      <section aria-labelledby="mobile-search-results">
        <div className="mb-3 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[hsl(var(--primary))]">Fresh on AiroRent</p><h2 id="mobile-search-results" className="mt-1 text-[20px] font-semibold tracking-[-.04em]">{query ? `Results for “${query}”` : `${mode} homes in Malta`}</h2></div><button onClick={() => setLocation('/map')} className="text-xs font-semibold underline underline-offset-4" data-testid="link-mobile-market-map">Map</button></div>
        {mobileListings.length ? <div className="space-y-7">{mobileListings.slice(0, 6).map((item) => <article key={item.id} data-testid={`card-mobile-market-${item.id}`}>
          <div className="relative aspect-[1.65] overflow-hidden rounded-[20px] bg-[#f3f3f3]"><img src={item.image} alt={item.title} onClick={() => { saveRecent(item.id); setLocation(`/listing/${item.id}`); }} className="size-full cursor-pointer object-cover" /><span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold">{item.mode === 'Short Let' ? 'SHORT LET' : item.mode.toUpperCase()}</span><button onClick={() => onSave(item.id)} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full ${saved.includes(item.id) ? 'bg-[hsl(var(--primary))] text-white' : 'bg-white/95'}`} aria-label={saved.includes(item.id) ? 'Remove from wishlist' : 'Save listing'} data-testid={`button-mobile-market-save-${item.id}`}><Heart size={20} strokeWidth={2.4} fill={saved.includes(item.id) ? 'currentColor' : 'none'} /></button></div>
          <button onClick={() => { saveRecent(item.id); setLocation(`/listing/${item.id}`); }} className="mt-3 block w-full text-left"><h3 className="line-clamp-1 text-[17px] font-semibold">{item.title}</h3><p className="mt-1 text-sm text-black/55">{item.type} · {item.location.split(',')[0]}</p><p className="mt-2 text-sm"><b>{item.price}</b>{item.mode === 'Short Let' ? ' / night' : ''} <span className="text-black/45"> · {item.detail}</span></p></button>
        </article>)}</div> : <EmptyState title="No properties found" body="Try another town, property type, or clear the filters." action="Clear search" onAction={() => { setQuery(''); setCategory('All'); onClearFilters(); }} />}
      </section>
    </div>
  </div>;
}

function HomePage() {
  const [mode, setMode] = useState<Mode>('Rent');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>(readSaved);
  const [toast, setToast] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [location] = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const requestedMode = params.get('mode');
    const requestedQuery = params.get('q');
    if (requestedMode === 'Rent' || requestedMode === 'Buy' || requestedMode === 'Short Let') setMode(requestedMode);
    if (requestedQuery !== null) setQuery(requestedQuery);
  }, [location]);
  const matches = useMemo(() => {
    const categoryMap: Record<string, string | undefined> = { Penthouses: 'Apartment', Maisonettes: 'Apartment', Townhouses: 'House' };
    const selectedType = categoryMap[category] || category.slice(0, -1);
    return listings
      .filter((item) => item.mode === mode)
      .filter((item) => !query || `${item.title} ${item.location}`.toLowerCase().includes(query.toLowerCase()))
      .filter((item) => category === 'All' || item.type === selectedType)
      .filter((item) => filters.propertyTypes.length === 0 ? filters.propertyType === 'Any' || item.type === filters.propertyType : filters.propertyTypes.includes(item.type))
      .filter((item) => filters.location === 'Any' || item.location.toLowerCase().includes(filters.location.toLowerCase()))
      .filter((item) => {
        const beds = Number(item.detail.match(/^\d+/)?.[0] || 0);
        const minimum = Number(filters.beds.replace('+', ''));
        return filters.beds === 'Any' || beds >= minimum;
      })
      .filter((item) => {
        const baths = Number(item.detail.match(/·\s*(\d+)\s+bath/)?.[1] || 0);
        const minimum = Number(filters.baths.replace('+', ''));
        return filters.baths === 'Any' || baths >= minimum;
      })
      .filter((item) => {
        const minimum = Number(filters.garages.replace('+', ''));
        return filters.garages === 'Any' || (item.garages || 0) >= minimum;
      })
      .filter((item) => !filters.verifiedOnly || item.verified);
  }, [mode, query, category, filters]);
  const toggleSave = (id: string) => {
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    setSaved(next); localStorage.setItem('jakurzi:wishlist', JSON.stringify(next)); setToast(saved.includes(id) ? 'Removed from your wishlist' : 'Saved to your wishlist');
  };
  const recent = readRecent().map((id) => listings.find((item) => item.id === id)).filter(Boolean) as Listing[];
  const applyFilters = (nextFilters: FilterState, nextMode: Mode) => {
    setFilters(nextFilters);
    setMode(nextMode);
  };
  return <main>
    <MobileMarketplacePage mode={mode} setMode={setMode} query={query} setQuery={setQuery} category={category} setCategory={setCategory} matches={matches} saved={saved} onSave={toggleSave} onOpenFilters={() => setFilterOpen(true)} onClearFilters={() => setFilters(defaultFilters)} />
    <div className="hidden md:block">
     <section className="airo-hero relative overflow-hidden border-b border-[hsl(var(--border))]">
       <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-[hsl(var(--primary)/.18)] blur-3xl" />
      <div className="mx-auto max-w-[1260px] px-5 pb-10 pt-12 lg:px-8 lg:pb-14 lg:pt-20">
        <div className="relative mx-auto max-w-[1040px] animate-rise">
           <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[hsl(var(--primary))]"><Sparkles size={14} />Property, without the runaround</p>
           <h1 className="max-w-2xl font-display text-[clamp(2.65rem,6vw,5.6rem)] leading-[.98] tracking-[-.065em]">Find your place<br /><span className="text-[hsl(var(--primary))]">in Malta.</span></h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[hsl(var(--muted-foreground))]">Real homes, real people, and a safer way to move into what comes next.</p>
          <div className="mt-8"><SearchBar mode={mode} setMode={setMode} query={query} setQuery={setQuery} /></div>
        </div>
      </div>
    </section>
    <div className="mx-auto max-w-[1260px] px-5 lg:px-8">
      <section className="py-8 md:py-11">
        <div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Browse your way</p><h2 className="mt-1 font-display text-3xl tracking-[-.04em]">What are you looking for?</h2></div><button onClick={() => setFilterOpen(true)} className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2 text-sm font-bold" data-testid="button-open-filters"><SlidersHorizontal size={16} />Filters</button></div>
         <div className="flex gap-3 overflow-x-auto pb-2">{[{ label: 'All', icon: Layers3 }, ...categories].map(({ label, icon: Icon }) => <button key={label} onClick={() => setCategory(label)} className={`flex min-w-fit items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${category === label ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-white shadow-sm' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/.5)] hover:text-[hsl(var(--primary))]'}`} data-testid={`button-category-${label.toLowerCase()}`}><Icon size={16} />{label}</button>)}</div>
      </section>
      {recent.length > 0 && <section className="pb-10"><div className="mb-4 flex items-center justify-between"><h2 className="font-display text-2xl">Pick up where you left off</h2><Link href="/wishlist" className="text-sm font-bold text-[hsl(var(--primary))]" data-testid="link-see-wishlist">See saved</Link></div><div className="flex gap-4 overflow-x-auto pb-2">{recent.slice(0, 4).map((item) => <ListingCard key={item.id} listing={item} saved={saved.includes(item.id)} onSave={toggleSave} compact />)}</div></section>}
      <section className="pb-14"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">{mode === 'Short Let' ? 'Make a weekend of it' : 'Places that feel right'}</p><h2 className="mt-1 font-display text-3xl tracking-[-.04em]">{query ? `Homes near “${query}”` : `${mode} homes in Malta`}</h2></div><Link href="/map" className="hidden items-center gap-1 text-sm font-bold text-[hsl(var(--primary))] sm:flex" data-testid="link-browse-map">Browse map <ArrowRight size={16} /></Link></div>
         {matches.length ? <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{matches.map((item, index) => <div key={item.id} className="animate-rise" style={{ animationDelay: `${index * 55}ms` }}><ListingCard listing={item} saved={saved.includes(item.id)} onSave={toggleSave} /></div>)}</div> : <EmptyState title="No homes in this corner yet" body="Try another location or clear your category filter. Malta has a few more good corners." action="Clear filters" onAction={() => { setQuery(''); setCategory('All'); setFilters(defaultFilters); }} />}
      </section>
      <section className="mb-10 grid overflow-hidden rounded-[30px] bg-[hsl(var(--foreground))] text-[hsl(var(--background))] md:grid-cols-[1.15fr_.85fr]"><div className="p-7 md:p-12"><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--accent))]">The AiroRent promise</p><h2 className="mt-3 max-w-md font-display text-4xl leading-[1.02] tracking-[-.045em]">Good homes.<br />Clear moves.</h2><p className="mt-5 max-w-md text-sm leading-relaxed text-[hsl(var(--background)/.7)]">From your first message to the final payment, AiroRent Pay keeps the important moments protected. No guesswork, no awkward hand-offs.</p><Link href="/profile" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-white" data-testid="link-promise-profile">How it works <ArrowRight size={16} /></Link></div><div className="relative min-h-[220px] overflow-hidden bg-[hsl(var(--primary))]"><div className="absolute -right-10 -top-16 size-64 rounded-full border-[24px] border-[hsl(var(--accent)/.55)]" /><div className="absolute bottom-8 left-10 size-28 rounded-full border-[14px] border-[hsl(var(--background)/.16)]" /><div className="absolute bottom-10 right-12 rounded-2xl bg-[hsl(var(--card))] p-4 text-[hsl(var(--foreground))] shadow-lift"><ShieldCheck size={23} className="text-[hsl(var(--primary))]" /><p className="mt-2 text-sm font-bold">Money moments,<br />made safer.</p></div></div></section>
    </div>
    </div>
     {filterOpen && <FilterSheet mode={mode} filters={filters} onApply={applyFilters} onClose={() => setFilterOpen(false)} />}
    {toast && <Toast text={toast} onClose={() => setToast('')} />}
  </main>;
}

function FilterSection({ step, title, subtitle, children, darkStep = false }: { step: string; title: string; subtitle: string; children: ReactNode; darkStep?: boolean }) {
  return <section className="border-t border-[hsl(var(--border))] pt-6 first:border-t-0 first:pt-0">
    <div className="flex items-start gap-3">
      <span className={`grid shrink-0 place-items-center font-extrabold text-white ${darkStep ? 'size-12 rounded-full bg-[hsl(var(--foreground))] text-lg' : 'size-9 rounded-xl bg-[hsl(var(--primary))] text-sm'}`}>{step}</span>
      <div><h3 className="font-display text-2xl tracking-[-.035em]">{title}</h3><p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">{subtitle}</p></div>
    </div>
    <div className="mt-5">{children}</div>
  </section>;
}

function FilterChoice({ label, selected, onClick, icon: Icon, image, description, largeImage = false }: { label: string; selected: boolean; onClick: () => void; icon?: typeof Settings; image?: string; description?: string; largeImage?: boolean }) {
  return <button type="button" onClick={onClick} className={`group relative flex ${largeImage ? 'aspect-[1.5] min-h-0 overflow-hidden rounded-[20px] border-0 p-0' : 'min-h-[76px] rounded-2xl border p-2'} flex-col items-center justify-center gap-1.5 text-center transition ${largeImage ? 'hover:scale-[1.01]' : ''} ${selected ? (largeImage ? 'ring-2 ring-[hsl(var(--primary))] ring-offset-2' : 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.07)] text-[hsl(var(--primary))] shadow-[0_0_0_1px_hsl(var(--primary)/.12)]') : (largeImage ? '' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/.45)]')}`} aria-label={label} aria-pressed={selected}>
    {image ? <img src={image} alt="" className={`${largeImage ? 'size-full object-cover' : 'h-12 w-full rounded-xl object-contain'}`} /> : Icon && <Icon size={24} strokeWidth={selected ? 2.5 : 1.9} />}
    {!largeImage && <span className="text-[11px] font-bold leading-tight">{label}</span>}
    {description && <span className="text-[9px] leading-tight text-[hsl(var(--muted-foreground))]">{description}</span>}
    {selected && <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-[hsl(var(--primary))] text-white"><Check size={10} /></span>}
  </button>;
}

function FilterToggle({ label, selected, onClick, icon: Icon }: { label: string; selected: boolean; onClick: () => void; icon?: typeof Settings }) {
  return <button type="button" onClick={onClick} className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left transition ${selected ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.07)] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]'}`} aria-pressed={selected}>
    {Icon && <Icon size={18} />}<span className="flex-1 text-xs font-bold">{label}</span><span className={`h-5 w-9 rounded-full p-0.5 transition ${selected ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'}`}><span className={`block size-4 rounded-full bg-white shadow-sm transition ${selected ? 'translate-x-4' : ''}`} /></span>
  </button>;
}

function Counter({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div className="flex items-center justify-between rounded-xl border border-[hsl(var(--border))] px-3 py-2.5"><span className="text-xs font-bold">{label}</span><span className="flex items-center gap-2"><button type="button" onClick={() => onChange(Math.max(0, value - 1))} className="grid size-7 place-items-center rounded-full border border-[hsl(var(--border))]" aria-label={`Decrease ${label}`}><Minus size={13} /></button><b className="w-4 text-center text-sm">{value}</b><button type="button" onClick={() => onChange(value + 1)} className="grid size-7 place-items-center rounded-full border border-[hsl(var(--border))]" aria-label={`Increase ${label}`}><Plus size={13} /></button></span></div>;
}

function modeToFilterPurpose(mode: Mode): FilterPurpose {
  return mode === 'Buy' ? 'Buy' : mode === 'Short Let' ? 'Short Rent' : 'Rent';
}

function purposeToMode(purpose: FilterPurpose): Mode {
  return purpose === 'Buy' ? 'Buy' : purpose === 'Rent' ? 'Rent' : 'Short Let';
}

function PriceFilterGraphic() {
  const [minimum, setMinimum] = useState(1989);
  const [maximum, setMaximum] = useState(3235);
  const [minimumInput, setMinimumInput] = useState('1989');
  const [maximumInput, setMaximumInput] = useState('3235');
  const [activeHandle, setActiveHandle] = useState<'minimum' | 'maximum' | null>(null);
  const sliderMin = 1500;
  const sliderMax = 3765;
  const minimumFraction = (minimum - sliderMin) / (sliderMax - sliderMin);
  const maximumFraction = (maximum - sliderMin) / (sliderMax - sliderMin);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layersRef = useRef<{ gray: HTMLCanvasElement; pink: HTMLCanvasElement } | null>(null);
  const minimumRef = useRef(minimum);
  const maximumRef = useRef(maximum);
  const pendingPointerRef = useRef<{ handle: 'minimum' | 'maximum'; value: number } | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  minimumRef.current = minimum;
  maximumRef.current = maximum;

  const setMinimumValue = (value: number) => {
    const next = Math.max(sliderMin, Math.min(value || sliderMin, maximumRef.current - 1));
    minimumRef.current = next;
    setMinimum(next);
    setMinimumInput(String(next));
  };
  const setMaximumValue = (value: number) => {
    const next = Math.min(sliderMax, Math.max(value || sliderMax, minimumRef.current + 1));
    maximumRef.current = next;
    setMaximum(next);
    setMaximumInput(String(next));
  };
  const editMinimum = (rawValue: string) => {
    setMinimumInput(rawValue);
    const value = Number(rawValue);
    if (rawValue.trim() && Number.isFinite(value) && value >= sliderMin && value < maximumRef.current) {
      minimumRef.current = value;
      setMinimum(value);
    }
  };
  const editMaximum = (rawValue: string) => {
    setMaximumInput(rawValue);
    const value = Number(rawValue);
    if (rawValue.trim() && Number.isFinite(value) && value <= sliderMax && value > minimumRef.current) {
      maximumRef.current = value;
      setMaximum(value);
    }
  };
  const valueFromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    return Math.round(sliderMin + fraction * (sliderMax - sliderMin));
  };
  const flushPointerUpdate = () => {
    animationFrameRef.current = null;
    const pending = pendingPointerRef.current;
    pendingPointerRef.current = null;
    if (!pending) return;
    if (pending.handle === 'minimum') setMinimumValue(pending.value);
    else setMaximumValue(pending.value);
  };
  const updateFromPointer = (event: ReactPointerEvent<HTMLDivElement>, handle: 'minimum' | 'maximum') => {
    pendingPointerRef.current = { handle, value: valueFromPointer(event) };
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(flushPointerUpdate);
    }
  };

  const renderGraphic = () => {
    const canvas = canvasRef.current;
    const layers = layersRef.current;
    if (!canvas || !layers) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const currentMinimumX = 700 + minimumFraction * (2595 - 700);
    const currentMaximumX = 700 + maximumFraction * (2595 - 700);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(layers.gray, 0, 0);
    context.save();
    context.beginPath();
    context.rect(currentMinimumX, 0, currentMaximumX - currentMinimumX, canvas.height);
    context.clip();
    context.drawImage(layers.pink, 0, 0);
    context.restore();

    const handleRadius = 106;
    const paintTrack = () => {
      context.save();
      context.lineCap = 'round';
      context.lineWidth = 48;
      context.strokeStyle = '#a4a4a4';
      context.beginPath();
      context.moveTo(700, 1240);
      context.lineTo(2595, 1240);
      context.stroke();
      context.strokeStyle = '#fa025a';
      context.beginPath();
      context.moveTo(currentMinimumX, 1240);
      context.lineTo(currentMaximumX, 1240);
      context.stroke();
      context.restore();
    };
    const clearHandle = (x: number) => {
      context.save();
      context.beginPath();
      context.arc(x, 1240, 122, 0, Math.PI * 2);
      context.fillStyle = '#fdfdfd';
      context.fill();
      context.restore();
    };
    const drawHandle = (x: number) => {
      context.save();
      context.beginPath();
      context.arc(x, 1240, handleRadius, 0, Math.PI * 2);
      context.fillStyle = '#fdfdfd';
      context.shadowColor = 'rgba(0,0,0,.14)';
      context.shadowBlur = 28;
      context.shadowOffsetY = 5;
      context.fill();
      context.restore();
    };

    paintTrack();
    clearHandle(1106);
    clearHandle(2151);
    paintTrack();
    drawHandle(currentMinimumX);
    drawHandle(currentMaximumX);
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const sourceContext = document.createElement('canvas').getContext('2d');
      if (!sourceContext) return;
      sourceContext.canvas.width = image.naturalWidth;
      sourceContext.canvas.height = image.naturalHeight;
      sourceContext.drawImage(image, 0, 0);

      const pixels = sourceContext.getImageData(0, 0, canvas.width, canvas.height);
      const grayPixels = new Uint8ClampedArray(pixels.data.length);
      const pinkPixels = new Uint8ClampedArray(pixels.data.length);
      const { data } = pixels;
      const graphicRows = (y: number) => (y >= 450 && y <= 1120) || (y >= 1170 && y <= 1310);
      for (let y = 450; y <= 1310; y += 1) {
        if (!graphicRows(y)) continue;
        for (let x = 650; x <= 2700; x += 1) {
          const index = (y * canvas.width + x) * 4;
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const isGraphicPixel = Math.min(red, green, blue) < 225;
          const isPinkOrGray = (red > green + 25 && red > blue + 15) || Math.abs(red - green) < 18 && Math.abs(green - blue) < 18;
          if (!isGraphicPixel || !isPinkOrGray) continue;
          grayPixels[index] = 164;
          grayPixels[index + 1] = 164;
          grayPixels[index + 2] = 164;
          grayPixels[index + 3] = 255;
          pinkPixels[index] = 250;
          pinkPixels[index + 1] = 2;
          pinkPixels[index + 2] = 90;
          pinkPixels[index + 3] = 255;
        }
      }

      const gray = document.createElement('canvas');
      gray.width = canvas.width;
      gray.height = canvas.height;
      gray.getContext('2d')?.putImageData(new ImageData(grayPixels, canvas.width, canvas.height), 0, 0);
      const pink = document.createElement('canvas');
      pink.width = canvas.width;
      pink.height = canvas.height;
      pink.getContext('2d')?.putImageData(new ImageData(pinkPixels, canvas.width, canvas.height), 0, 0);
      layersRef.current = { gray, pink };
      renderGraphic();
    };
    image.src = priceFilterReference;
    return () => {
      image.onload = null;
    };
  }, []);

  useEffect(() => {
    renderGraphic();
  }, [minimumFraction, maximumFraction]);

  useEffect(() => () => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  return <section aria-labelledby="price-filter-title">
    <h3 id="price-filter-title" className="text-[25px] font-semibold tracking-[-.045em] text-[#111] sm:text-[30px]">Price Filter</h3>
    <p className="mt-1 text-[17px] tracking-[-.025em] text-[#858585] sm:text-[20px]">All-inclusive Pricing</p>
    <div className="relative mx-auto mt-2 h-[275px] w-full max-w-[760px] overflow-hidden sm:h-[420px]">
      <div className="absolute left-1/2 top-[-45px] z-10 aspect-[3264/1836] w-[163%] max-w-none -translate-x-1/2 sm:top-[-85px]">
        <canvas ref={canvasRef} className="absolute inset-0 size-full" role="img" aria-label="Interactive price range histogram" />
        <div className="absolute left-[21.5%] right-[20.4%] top-[61%] z-30 h-[13%] touch-none" onPointerDown={(event) => { const value = valueFromPointer(event); const handle = Math.abs(value - minimum) <= Math.abs(value - maximum) ? 'minimum' : 'maximum'; setActiveHandle(handle); event.currentTarget.setPointerCapture(event.pointerId); updateFromPointer(event, handle); }} onPointerMove={(event) => { if (activeHandle && event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event, activeHandle); }} onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setActiveHandle(null); }} onPointerCancel={() => setActiveHandle(null)} role="group" aria-label="Price range slider" />
      </div>
      <div className="absolute bottom-0 left-0 flex h-[54px] w-[104px] flex-col items-center justify-center rounded-[13px] border border-[#e7e7e7] bg-white px-1.5 text-center shadow-[0_2px_8px_rgba(0,0,0,.08)] sm:h-[72px] sm:w-[142px] sm:rounded-[17px]"><label className="block text-[11px] leading-tight text-[#777] sm:text-[13px]" htmlFor="minimum-price">Minimum</label><div className="mt-0.5 flex items-center justify-center text-[18px] leading-none font-semibold text-[#111] sm:text-[24px]"><span>$</span><input id="minimum-price" type="number" value={minimumInput} min={sliderMin} max={maximum - 1} onChange={(event) => editMinimum(event.target.value)} onBlur={() => setMinimumValue(Number(minimumInput))} className="w-[55px] appearance-none bg-transparent text-center outline-none sm:w-[78px]" aria-label="Minimum price" /></div></div>
      <div className="absolute bottom-0 right-0 flex h-[54px] w-[104px] flex-col items-center justify-center rounded-[13px] border border-[#e7e7e7] bg-white px-1.5 text-center shadow-[0_2px_8px_rgba(0,0,0,.08)] sm:h-[72px] sm:w-[142px] sm:rounded-[17px]"><label className="block text-[11px] leading-tight text-[#777] sm:text-[13px]" htmlFor="maximum-price">Maximum</label><div className="mt-0.5 flex items-center justify-center text-[18px] leading-none font-semibold text-[#111] sm:text-[24px]"><span>$</span><input id="maximum-price" type="number" value={maximumInput} min={minimum + 1} max={sliderMax} onChange={(event) => editMaximum(event.target.value)} onBlur={() => setMaximumValue(Number(maximumInput))} className="w-[55px] appearance-none bg-transparent text-center outline-none sm:w-[78px]" aria-label="Maximum price" /></div></div>
    </div>
  </section>;
}

function FilterSheet({ mode, filters, onApply, onClose }: { mode: Mode; filters: FilterState; onApply: (filters: FilterState, mode: Mode) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<FilterState>(() => ({ ...filters, purpose: modeToFilterPurpose(mode) }));
  const purpose = draft.purpose;
  const isBuy = purpose === 'Buy';
  const isShortStay = purpose === 'Short Rent' || purpose === 'Trip / Booking';
  const selectClass = 'mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-3 text-sm outline-none focus:border-[hsl(var(--primary))]';
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const toggleArray = (key: 'propertyTypes' | 'amenities' | 'outdoorFeatures' | 'investmentFilters' | 'documents' | 'bookingOptions' | 'accessibility', value: string) => {
    setDraft((current) => {
      const values = current[key];
      return { ...current, [key]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value] };
    });
  };
  const choosePurpose = (nextPurpose: FilterPurpose) => update('purpose', nextPurpose);
  const selectedTypes = draft.propertyTypes.length ? draft.propertyTypes : draft.propertyType === 'Any' ? [] : [draft.propertyType];
  const apply = () => {
    const nextFilters = { ...draft, propertyType: selectedTypes[0] || 'Any' };
    onApply(nextFilters, purposeToMode(purpose));
    onClose();
  };
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);
  return <div className="fixed inset-0 z-50 flex animate-fade items-end bg-[hsl(var(--foreground)/.45)] p-0 backdrop-blur-sm md:items-center md:justify-center md:p-3" onClick={onClose} role="presentation">
     <div className="flex max-h-[100dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-[hsl(var(--card))] shadow-lift md:max-h-[92dvh] md:rounded-[28px]" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="filter-sheet-title">
      <header className="flex items-center justify-between border-b border-[hsl(var(--border))] px-5 py-4 md:px-7">
        <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">AiroRent filters</p><h2 id="filter-sheet-title" className="mt-1 font-display text-2xl tracking-[-.035em]">Find your perfect stay</h2></div>
        <div className="flex items-center gap-2"><button type="button" onClick={() => setDraft({ ...defaultFilters, purpose: modeToFilterPurpose(mode) })} className="rounded-full px-3 py-2 text-xs font-bold text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" data-testid="button-reset-filters">Reset</button><button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full bg-[hsl(var(--muted))]" aria-label="Close filters" data-testid="button-close-filters"><X size={18} /></button></div>
      </header>
      <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-6 md:px-7">
        <FilterSection step="01" title="Main Filters" subtitle="All in one filter overview">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">I'm looking for</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {([['Rent', Home], ['Short Rent', CalendarDays], ['Buy', Building2], ['Trip / Booking', Sparkles]] as const).map(([label, Icon]) => <FilterChoice key={label} label={label} icon={Icon} selected={purpose === label} onClick={() => choosePurpose(label)} />)}
          </div>
           <div className="mt-6">
             <PriceFilterGraphic />
           </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <label className="text-xs font-bold">Beds<select value={draft.beds} onChange={(event) => update('beds', event.target.value)} className={selectClass} data-testid="select-beds">{['Any', 'Studio', '1+', '2+', '3+', '4+', '5+'].map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="text-xs font-bold">Baths<select value={draft.baths} onChange={(event) => update('baths', event.target.value)} className={selectClass} data-testid="select-baths">{['Any', '1+', '2+', '3+', '4+', '5+'].map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="text-xs font-bold">Property type<select value={draft.propertyType} onChange={(event) => update('propertyType', event.target.value)} className={selectClass} data-testid="select-property-type">{['Any', ...filterPropertyTypes.map(({ label }) => label)].map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="text-xs font-bold">Location<select value={draft.location} onChange={(event) => update('location', event.target.value)} className={selectClass} data-testid="select-location">{['Any', 'Valletta', 'Sliema', 'Rabat', 'Msida', 'Gozo'].map((option) => <option key={option}>{option}</option>)}</select></label>
          </div>
        </FilterSection>

        <FilterSection step="02" darkStep title={isBuy ? 'Property Type & Purchase' : 'Property Type & Stay'} subtitle={isBuy ? 'Choose what you want to buy' : 'Choose type and stay preferences'}>
          <p className="mb-3 text-xs font-bold">Property Type <span className="font-normal text-[hsl(var(--muted-foreground))]">Select one or more</span></p>
          <div className="grid grid-cols-2 gap-3">
            {filterPropertyTypes.map(({ label, icon: Icon, image }) => <FilterChoice key={label} label={label} icon={Icon} image={image} largeImage selected={selectedTypes.includes(label)} onClick={() => toggleArray('propertyTypes', label)} />)}
          </div>
          {isBuy ? <div className="mt-6 space-y-5">
            <label className="block text-xs font-bold">Buying Purpose<select value={draft.buyingPurpose} onChange={(event) => update('buyingPurpose', event.target.value)} className={selectClass}>{['Buy to Live', 'Investment', 'Holiday Home', 'Rental Investment', 'Commercial Investment'].map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="block text-xs font-bold">Property Status<select value={draft.propertyStatus} onChange={(event) => update('propertyStatus', event.target.value)} className={selectClass}>{['Any', 'Ready to Move', 'Under Construction', 'Off Plan', 'New Build', 'Resale'].map((option) => <option key={option}>{option}</option>)}</select></label>
            <div><p className="text-xs font-bold">Property Size</p><div className="mt-2 grid grid-cols-3 gap-2">{['Any', '50–150 m²', '150–300 m²', '300+ m²'].map((option) => <FilterChoice key={option} label={option} selected={draft.propertySize === option} onClick={() => update('propertySize', option)} />)}</div></div>
          </div> : <div className="mt-6 space-y-5">
            {purpose === 'Rent' && <div><p className="text-xs font-bold">Rent Type</p><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{['Long Term', 'Monthly', 'Yearly', 'Student Rental'].map((option) => <FilterChoice key={option} label={option} selected={draft.rentType === option} onClick={() => update('rentType', option)} />)}</div></div>}
            {isShortStay && <div><p className="text-xs font-bold">Duration</p><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">{['Any', '1–3 Days', '4–7 Days', '1–2 Weeks', '2–4 Weeks', '1–3 Months'].map((option) => <FilterChoice key={option} label={option} selected={draft.duration === option} onClick={() => update('duration', option)} />)}</div></div>}
            {purpose === 'Rent' && <div><p className="text-xs font-bold">Furnishing</p><div className="mt-2 grid grid-cols-3 gap-2">{['Any', 'Fully Furnished', 'Semi Furnished', 'Unfurnished'].map((option) => <FilterChoice key={option} label={option} selected={draft.furnishing === option} onClick={() => update('furnishing', option)} />)}</div></div>}
            {isShortStay ? <div className="grid grid-cols-2 gap-3"><label className="text-xs font-bold">Check-in<input type="date" value={draft.checkIn} onChange={(event) => update('checkIn', event.target.value)} className={selectClass} /></label><label className="text-xs font-bold">Check-out<input type="date" value={draft.checkOut} onChange={(event) => update('checkOut', event.target.value)} className={selectClass} /></label></div> : <label className="block text-xs font-bold">Availability<select value={draft.availability} onChange={(event) => update('availability', event.target.value)} className={selectClass}>{['Any', 'Available Now', 'Available This Month', 'Available Next Month'].map((option) => <option key={option}>{option}</option>)}</select></label>}
          </div>}
          {isShortStay && <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"><Counter label="Guests" value={draft.guests} onChange={(value) => update('guests', value)} /><Counter label="Children" value={draft.children} onChange={(value) => update('children', value)} /><Counter label="Infants" value={draft.infants} onChange={(value) => update('infants', value)} /><Counter label="Pets" value={draft.pets} onChange={(value) => update('pets', value)} /></div>}
        </FilterSection>

        <FilterSection step="03" title="Amenities & Features" subtitle="Select amenities and accessibility">
          <p className="mb-3 text-xs font-bold">Amenities <span className="font-normal text-[hsl(var(--muted-foreground))]">Choose as many as you need</span></p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{filterAmenities.map(([label, Icon]) => <FilterChoice key={label} label={label} icon={Icon} selected={draft.amenities.includes(label)} onClick={() => toggleArray('amenities', label)} />)}</div>
          <div className="mt-6 border-t border-[hsl(var(--border))] pt-5"><p className="mb-3 text-xs font-bold">Accessibility Features</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{filterAccessibilityOptions.map(([label, Icon]) => <FilterChoice key={label} label={label} icon={Icon} selected={draft.accessibility.includes(label)} onClick={() => toggleArray('accessibility', label)} />)}</div></div>
          <div className="mt-6"><p className="mb-3 text-xs font-bold">Parking / Garage</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{['Any', 'No Parking', 'Parking Space', 'Garage', '1 Garage', '2+ Garages'].map((option) => <FilterChoice key={option} label={option} icon={Navigation} selected={draft.parking === option} onClick={() => update('parking', option)} />)}</div></div>
        </FilterSection>

        <FilterSection step="04" title="More Options" subtitle="More filters and preferences">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold">Host Language<select value={draft.hostLanguage} onChange={(event) => update('hostLanguage', event.target.value)} className={selectClass}>{['Any Language', 'English', 'Arabic', 'French', 'Italian', 'German', 'Spanish', 'Portuguese'].map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="text-xs font-bold">Host Type<select value={draft.hostType} onChange={(event) => update('hostType', event.target.value)} className={selectClass}>{['Any', 'Property Owner', 'Verified Host', 'Professional Host', 'Property Manager'].map((option) => <option key={option}>{option}</option>)}</select></label>
          </div>
          <div className="mt-6"><p className="mb-3 text-xs font-bold">Booking Options</p><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{filterBookingOptions.map(([label, Icon]) => <FilterToggle key={label} label={label} icon={Icon} selected={draft.bookingOptions.includes(label)} onClick={() => toggleArray('bookingOptions', label)} />)}</div></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div><p className="mb-3 text-xs font-bold">Verification</p><FilterToggle label="Verified listings only" icon={ShieldCheck} selected={draft.verifiedOnly} onClick={() => update('verifiedOnly', !draft.verifiedOnly)} /></div>
            <label className="text-xs font-bold">Pet Policy<select value={draft.petPolicy} onChange={(event) => update('petPolicy', event.target.value)} className={selectClass}>{['Any', 'Pets Allowed', 'Small Pets', 'Large Pets', 'No Pets'].map((option) => <option key={option}>{option}</option>)}</select></label>
          </div>
          {isBuy && <div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">View<select value={draft.views} onChange={(event) => update('views', event.target.value)} className={selectClass}>{['Any', 'Sea View', 'City View', 'Garden View', 'Pool View'].map((option) => <option key={option}>{option}</option>)}</select></label><div><p className="mb-3 text-xs font-bold">Outdoor Features</p><div className="flex flex-wrap gap-2">{['Balcony', 'Terrace', 'Garden', 'Roof Terrace', 'Private Pool'].map((option) => <button type="button" key={option} onClick={() => toggleArray('outdoorFeatures', option)} className={`rounded-full border px-3 py-2 text-xs font-bold ${draft.outdoorFeatures.includes(option) ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))]'}`}>{option}</button>)}</div></div></div>}
        </FilterSection>
      </div>
      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5 py-4 md:px-7">
        <button type="button" onClick={apply} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--primary))] py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_hsl(var(--primary)/.22)] transition hover:-translate-y-0.5" data-testid="button-apply-filters">Apply Filters <ArrowRight size={17} /></button>
      </footer>
    </div>
  </div>;
}

function EmptyState({ title, body, action, onAction }: { title: string; body: string; action?: string; onAction?: () => void }) {
  return <div className="rounded-[26px] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--secondary)/.35)] px-6 py-14 text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[hsl(var(--accent)/.5)]"><Home size={24} /></div><h3 className="mt-5 font-display text-2xl">{title}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{body}</p>{action && onAction && <button onClick={onAction} className="mt-5 rounded-full bg-[hsl(var(--foreground))] px-5 py-2.5 text-sm font-bold text-[hsl(var(--background))]" data-testid="button-empty-action">{action}</button>}</div>;
}

function MapPage() {
  const [selected, setSelected] = useState(listings[1]);
  const [mode, setMode] = useState<'All' | Mode>('All');
  const [saved, setSaved] = useState(readSaved);
  const [zoom, setZoom] = useState(1);
  const toggleSave = (id: string) => { const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id]; setSaved(next); localStorage.setItem('jakurzi:wishlist', JSON.stringify(next)); };
  const visible = mode === 'All' ? listings : listings.filter((x) => x.mode === mode);
  return <main className="mx-auto max-w-[1260px] px-5 py-7 lg:px-8"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">See the shape of Malta</p><h1 className="mt-1 font-display text-4xl tracking-[-.045em]">Property map</h1><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{visible.length} listings with a pinned location · <Link href="/" className="font-bold underline" data-testid="link-map-browse-all">browse all</Link></p></div><div className="flex gap-2 overflow-x-auto">{(['All', 'Rent', 'Buy', 'Short Let'] as const).map((item) => <button key={item} onClick={() => setMode(item)} className={`rounded-full border px-4 py-2 text-sm font-bold ${mode === item ? 'border-[hsl(var(--foreground))] bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : 'bg-[hsl(var(--card))]'}`} data-testid={`button-map-${item.toLowerCase().replace(' ', '-')}`}>{item}</button>)}</div></div><div className="mt-7 grid gap-5 lg:grid-cols-[1.55fr_.8fr]"><div className="relative min-h-[620px] overflow-hidden rounded-[28px] border border-[hsl(var(--border))] bg-[#e9ece8] shadow-soft" style={{ backgroundImage: `linear-gradient(rgba(231,235,230,.72), rgba(231,235,230,.88)), url(${images.map})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(36deg, transparent 48%, #9eaaa1 49%, transparent 50%), linear-gradient(112deg, transparent 48%, #b0bab2 49%, transparent 50%)', backgroundSize: '170px 150px' }} /><div className="absolute left-5 top-5 flex gap-2"><button onClick={() => setZoom(zoom)} className="grid size-10 place-items-center rounded-full bg-[hsl(var(--card)/.92)] shadow-soft" data-testid="button-map-layers"><Layers3 size={18} /></button><button onClick={() => setMode('All')} className="grid size-10 place-items-center rounded-full bg-[hsl(var(--card)/.92)] shadow-soft" data-testid="button-map-filter"><Filter size={18} /></button></div><div className="absolute right-5 top-5 flex flex-col overflow-hidden rounded-xl bg-[hsl(var(--card)/.94)] shadow-soft"><button onClick={() => setZoom(Math.min(3, zoom + .25))} className="grid size-10 place-items-center" data-testid="button-map-zoom-in"><Plus size={18} /></button><button onClick={() => setZoom(Math.max(.75, zoom - .25))} className="grid size-10 place-items-center border-t border-[hsl(var(--border))]" data-testid="button-map-zoom-out"><Minus size={18} /></button></div><div className="absolute inset-0 transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>{visible.map((item, index) => <button key={item.id} onClick={() => setSelected(item)} className={`absolute rounded-full border-2 px-3 py-2 text-xs font-bold shadow-soft transition hover:-translate-y-1 ${selected.id === item.id ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-white' : 'border-[hsl(var(--card))] bg-[hsl(var(--card))]'}`} style={{ left: `${15 + (index * 17) % 70}%`, top: `${17 + (index * 13) % 67}%` }} data-testid={`button-map-pin-${item.id}`}>{item.mode === 'Buy' ? item.price : item.price.replace(' / mo', '')}</button>)}</div></div><aside className="rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-soft"><div className="mb-3 flex items-center justify-between px-1"><h2 className="font-display text-2xl">Selected home</h2><button onClick={() => setSelected(listings[(listings.indexOf(selected) + 1) % listings.length])} className="grid size-9 place-items-center rounded-full bg-[hsl(var(--muted))]" data-testid="button-next-map-listing"><ArrowRight size={17} /></button></div><div className="overflow-hidden rounded-2xl"><img src={selected.image} alt={selected.title} className="aspect-[1.3] w-full object-cover" /></div><div className="p-1 pt-4"><div className="flex items-start justify-between gap-2"><h3 className="text-lg font-bold">{selected.title}</h3><button onClick={() => toggleSave(selected.id)} className={`grid size-9 shrink-0 place-items-center rounded-full border ${saved.includes(selected.id) ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : ''}`} data-testid="button-map-save"><Heart size={17} fill={saved.includes(selected.id) ? 'currentColor' : 'none'} /></button></div><p className="mt-1 flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]"><MapPin size={14} />{selected.location}</p><p className="mt-4 text-sm"><b>{selected.price}</b>{selected.mode === 'Short Let' ? ' night' : ''} · {selected.detail}</p><Link href={`/listing/${selected.id}`} className="mt-5 flex items-center justify-center rounded-2xl bg-[hsl(var(--foreground))] py-3.5 text-sm font-bold text-[hsl(var(--background))]" data-testid="link-map-open-listing">View property</Link></div></aside></div></main>;
}

function LegacyDetailPage({ id }: { id: string }) {
  const listing = listings.find((x) => x.id === id) || listings[0];
  const [, setLocation] = useLocation();
  const [saved, setSaved] = useState(readSaved().includes(listing.id));
  const [contactOpen, setContactOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toggleSave = () => { const current = readSaved(); const next = current.includes(listing.id) ? current.filter((x) => x !== listing.id) : [...current, listing.id]; localStorage.setItem('jakurzi:wishlist', JSON.stringify(next)); setSaved(!saved); setToast(saved ? 'Removed from your wishlist' : 'Saved to your wishlist'); };
  useEffect(() => saveRecent(listing.id), [listing.id]);
  return <main className="mx-auto max-w-[1260px] px-5 pb-28 pt-5 lg:px-8"><div className="mb-4 flex items-center justify-between"><button onClick={() => setLocation('/')} className="flex items-center gap-2 text-sm font-bold" data-testid="button-detail-back"><ArrowLeft size={18} />Back to search</button><div className="flex gap-2"><button onClick={toggleSave} className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold ${saved ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : ''}`} data-testid="button-detail-save"><Heart size={16} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save'}</button><button onClick={() => setToast('Link copied — share it with someone you trust')} className="grid size-9 place-items-center rounded-full border" data-testid="button-detail-share"><Send size={16} /></button></div></div><div className="grid gap-2 overflow-hidden rounded-[26px] md:grid-cols-2 md:grid-rows-2 md:gap-3"><div className="relative row-span-2 min-h-[320px] md:min-h-[500px]"><img src={listing.image} alt={listing.title} className="size-full object-cover" /><span className="absolute bottom-4 right-4 rounded-full bg-[hsl(var(--foreground)/.75)] px-3 py-1.5 text-xs font-bold text-[hsl(var(--background))]">1 / 5</span></div>{[images.seaview, images.farmhouse, images.limestone, images.seaview].map((image, index) => <div key={image + index} className={`${index > 1 ? 'hidden md:block' : ''} min-h-[150px]`}><img src={image} alt={`${listing.title} view ${index + 2}`} className="size-full object-cover" /></div>)}</div><div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]"><div><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold text-[hsl(var(--primary))]">{listing.mode} · {listing.type}</p><h1 className="mt-1 max-w-2xl font-display text-4xl leading-tight tracking-[-.045em] md:text-5xl">{listing.title}</h1><p className="mt-2 flex items-center gap-1 text-[hsl(var(--muted-foreground))]"><MapPin size={15} />{listing.location}, Malta</p></div><div className="flex items-center gap-1 rounded-full bg-[hsl(var(--accent)/.35)] px-3 py-2 text-sm font-bold"><Star size={15} fill="currentColor" />{listing.rating} <span className="font-normal text-[hsl(var(--muted-foreground))]">(18)</span></div></div><p className="mt-7 text-[1.05rem] leading-relaxed text-[hsl(var(--muted-foreground))]">A considered place to land, with warm light, good proportions and the best of the island close by. Listed by someone who knows the home and answers directly.</p><div className="mt-8 flex flex-wrap gap-2">{['Owner responds quickly', 'Jakurzi verified', 'Great location'].map((item) => <span key={item} className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-3.5 py-2 text-xs font-bold"><Check size={14} className="text-[hsl(var(--primary))]" />{item}</span>)}</div><div className="my-9 border-y border-[hsl(var(--border))] py-7"><div className="flex items-center gap-4"><div className="grid size-12 place-items-center rounded-full bg-[hsl(var(--secondary))] text-lg font-bold">M</div><div><p className="font-bold">Hosted by Maria Camilleri</p><p className="text-sm text-[hsl(var(--muted-foreground))]">Verified owner · 6 years on Jakurzi</p></div><ShieldCheck className="ml-auto text-[hsl(var(--primary))]" /></div></div><section><h2 className="font-display text-3xl">What this place offers</h2><div className="mt-5 grid grid-cols-2 gap-y-4 sm:grid-cols-3">{[['Wifi', Navigation], ['Kitchen', Home], ['Air conditioning', Sparkles], ['Washer', CircleHelp], ['Workspace', Pencil], ['Free parking', KeyRound]].map(([label, Icon]) => <div key={String(label)} className="flex items-center gap-3 text-sm"><span className="grid size-9 place-items-center rounded-xl bg-[hsl(var(--secondary))]"><Icon size={17} /></span>{String(label)}</div>)}</div></section><section className="mt-10"><h2 className="font-display text-3xl">A safer way to book</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{[['01', 'Message directly', 'Ask questions before you commit.'], ['02', 'Pay through Jakurzi', 'Your money stays protected until the details are right.'], ['03', 'Arrive with confidence', 'Support is here if plans change.']].map(([number, title, body]) => <div key={number} className="rounded-2xl bg-[hsl(var(--secondary)/.55)] p-4"><span className="text-xs font-bold text-[hsl(var(--primary))]">{number}</span><h3 className="mt-5 font-bold">{title}</h3><p className="mt-1 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{body}</p></div>)}</div></section><button onClick={() => setToast('Thanks — we will review this listing')} className="mt-10 flex items-center gap-2 text-sm font-bold text-[hsl(var(--muted-foreground))] underline" data-testid="button-report-listing"><CircleHelp size={16} />Report this listing</button></div><aside className="h-fit lg:sticky lg:top-24"><div className="rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-lift"><div className="flex items-end justify-between"><div><span className="text-2xl font-bold">{listing.price}</span>{listing.mode === 'Short Let' && <span className="text-sm text-[hsl(var(--muted-foreground))]"> / night</span>}</div><span className="text-xs text-[hsl(var(--muted-foreground))]">Updated 2 days ago</span></div><div className="mt-5 grid grid-cols-2 gap-2"><button onClick={() => setDateOpen(true)} className="rounded-xl border p-3 text-left" data-testid="button-detail-dates"><span className="block text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Dates</span><span className="mt-1 block text-sm font-bold">{dateOpen ? '12–16 Aug' : 'Add dates'}</span></button><div className="rounded-xl border p-3"><span className="block text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">For</span><span className="mt-1 block text-sm font-bold">2 guests</span></div></div><button onClick={() => setContactOpen(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--primary))] py-3.5 font-bold text-white transition hover:-translate-y-0.5" data-testid="button-contact-owner"><MessageCircle size={18} />Contact owner</button><button onClick={() => setToast(listing.mode === 'Buy' ? 'Offer draft started — check Trips to continue' : 'Availability request started')} className="mt-2 w-full rounded-2xl border border-[hsl(var(--foreground))] py-3.5 text-sm font-bold" data-testid="button-book-offer">{listing.mode === 'Buy' ? 'Make an offer' : 'Check availability'}</button><p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-[hsl(var(--muted-foreground))]"><LockKeyhole size={13} />Protected by Jakurzi Pay</p></div></aside></div><div className="fixed inset-x-3 bottom-[70px] z-30 flex items-center gap-2 rounded-[22px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.96)] p-2 shadow-lift backdrop-blur-xl lg:hidden"><div className="min-w-0 flex-1 px-2"><p className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Asking</p><p className="truncate text-sm font-bold">{listing.price}<span className="font-normal text-[hsl(var(--muted-foreground))]">{listing.mode === 'Short Let' ? ' / night' : ''}</span></p></div><button onClick={() => setToast('Opening Maria’s phone number')} className="grid size-10 place-items-center rounded-full border" aria-label="Call owner" data-testid="button-detail-call"><Navigation size={17} /></button><button onClick={() => setToast('Opening WhatsApp with a protected listing link')} className="grid size-10 place-items-center rounded-full border" aria-label="WhatsApp owner" data-testid="button-detail-whatsapp"><MessageCircle size={17} /></button><button onClick={() => setContactOpen(true)} className="rounded-xl bg-[hsl(var(--primary))] px-3.5 py-3 text-xs font-bold text-white" data-testid="button-detail-mobile-book">{listing.mode === 'Buy' ? 'Make offer' : 'Book'}</button></div>{contactOpen && <ContactSheet listing={listing} onClose={() => setContactOpen(false)} onSent={() => { setContactOpen(false); setToast('Message sent to Maria'); }} />}{toast && <Toast text={toast} onClose={() => setToast('')} />}</main>;
}

function DetailPage({ id }: { id: string }) {
  const listing = listings.find((item) => item.id === id) || listings[0];
  const [location, setLocation] = useLocation();
  const [saved, setSaved] = useState(readSaved().includes(listing.id));
  const [bookingOpen, setBookingOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const beds = listing.detail.match(/^\d+/)?.[0] || '2';
  const baths = listing.detail.match(/·\s*(\d+)\s+bath/)?.[1] || '1';
  const guests = listing.detail.match(/sleeps\s+(\d+)/)?.[1] || '2';
  const gallery = [...new Set([listing.image, images.farmhouse, images.limestone, images.seaview])];
  const selectImage = (index: number) => setSelectedImageIndex((index + gallery.length) % gallery.length);
  const changeViewerImage = (direction: number) => setSelectedImageIndex((current) => (current + direction + gallery.length) % gallery.length);
  const openViewer = (index = selectedImageIndex) => {
    selectImage(index);
    setViewerOpen(true);
  };
  const handleTouchEnd = (clientX: number) => {
    if (touchStartX === null) return;
    const delta = touchStartX - clientX;
    if (Math.abs(delta) > 40) changeViewerImage(delta > 0 ? 1 : -1);
    setTouchStartX(null);
  };
  const toggleSave = () => {
    const current = readSaved();
    const next = current.includes(listing.id) ? current.filter((item) => item !== listing.id) : [...current, listing.id];
    localStorage.setItem('jakurzi:wishlist', JSON.stringify(next));
    setSaved(!saved);
    setToast(saved ? 'Removed from your watchlist' : 'Saved to your watchlist');
  };
  const openBooking = () => setBookingOpen(true);
  useEffect(() => saveRecent(listing.id), [listing.id]);
  useEffect(() => {
    if (!viewerOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setViewerOpen(false);
      if (event.key === 'ArrowRight') changeViewerImage(1);
      if (event.key === 'ArrowLeft') changeViewerImage(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewerOpen]);
  return <main className="mx-auto max-w-[1260px] px-5 pb-32 pt-5 md:pb-36 lg:px-8">
    <div className="md:hidden">
      <section className="-mx-5 -mt-5 relative h-[410px] overflow-hidden" onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)} onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)} data-testid="mobile-detail-gallery">
         <img src={gallery[selectedImageIndex]} alt={`${listing.title} selected view`} className="size-full cursor-zoom-in object-cover transition-opacity duration-200" onClick={() => openViewer()} />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5">
          <button onClick={() => setLocation('/')} className="grid size-12 place-items-center rounded-full bg-white/95 shadow-soft" aria-label="Back to search" data-testid="button-detail-back-mobile"><ArrowLeft size={23} /></button>
          <div className="flex gap-2"><button onClick={toggleSave} className="grid size-12 place-items-center rounded-full bg-white/95 shadow-soft" aria-label={saved ? 'Remove from watchlist' : 'Save listing'} data-testid="button-detail-save-mobile"><Heart size={22} fill={saved ? 'currentColor' : 'none'} className={saved ? 'text-[hsl(var(--primary))]' : ''} /></button><button onClick={() => setToast('Link copied — share it with someone you trust')} className="grid size-12 place-items-center rounded-full bg-white/95 shadow-soft" aria-label="Share listing" data-testid="button-detail-share-mobile"><Send size={20} /></button></div>
        </div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2.5 py-2">{gallery.map((image, index) => <button key={image + index} onClick={() => selectImage(index)} className={`size-2 rounded-full ${index === selectedImageIndex ? 'bg-[hsl(var(--primary))]' : 'bg-white/75'}`} aria-label={`Show photo ${index + 1}`} data-testid={`button-detail-dot-${index}`} />)}</div>
      </section>
      <section className="relative -mx-5 -mt-7 rounded-t-[30px] bg-white px-6 pb-28 pt-7">
         <h1 className="mx-auto max-w-[350px] text-center text-[30px] font-semibold leading-[1.18] tracking-[-.055em]">{listing.title}</h1>
         <div className="mx-auto mt-3 flex max-w-[350px] flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-black/60"><MapPin size={15} />{listing.location}<span className="text-black/25">·</span><Star size={16} fill="currentColor" className="text-[hsl(var(--primary))]" /><b className="text-black">{listing.rating}</b><span>(18 reviews)</span></div>
        <div className="mt-7 grid grid-cols-5 gap-2 border-b border-black/[.1] pb-6 text-center">
          {[[UsersRound, `${guests} Guests`], [BedDouble, `${beds} Bedrooms`], [BedDouble, `${beds} Beds`], [Bath, `${baths} Baths`], [Navigation, 'Wifi']].map(([Icon, label]) => <div key={String(label)} className="flex min-w-0 flex-col items-center gap-2 text-[10px] font-medium"><Icon size={23} strokeWidth={1.7} /><span>{String(label)}</span></div>)}
        </div>
        <section className="pt-6"><h2 className="text-[21px] font-bold">About this place</h2><p className={`mt-3 text-[15px] leading-relaxed text-black/65 ${expanded ? '' : 'line-clamp-2'}`}>Wake up to the island breeze in this beautiful {listing.type.toLowerCase()}. Perfect for relaxing getaways, remote work, and making the most of {listing.location.split(',')[0]}.</p><button onClick={() => setExpanded(!expanded)} className="mt-3 flex items-center gap-1 text-sm font-bold text-[hsl(var(--primary))]" data-testid="button-detail-read-more">{expanded ? 'Show less' : 'Read more'} <ChevronDown size={16} className={expanded ? 'rotate-180' : ''} /></button></section>
         <div className="mt-5 grid grid-cols-3 gap-2.5" data-testid="detail-gallery-thumbnails">{gallery.slice(0, 3).map((image, index) => <button key={image + index} onClick={() => openViewer(index)} className={`group relative aspect-[1.25] overflow-hidden rounded-2xl bg-[hsl(var(--secondary))] ${index === selectedImageIndex ? 'ring-2 ring-[hsl(var(--primary))] ring-offset-2' : ''}`} aria-label={`Open photo ${index + 1} of ${gallery.length}`} data-testid={`button-detail-gallery-${index}`}><img src={image} alt={`${listing.title} view ${index + 1}`} className="size-full object-cover transition duration-300 group-hover:scale-105" /><span className="absolute bottom-1.5 right-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white">{index + 1}</span></button>)}</div>
        <section className="mt-8 border-t border-black/[.1] pt-7" data-testid="section-property-details"><h2 className="text-[21px] font-bold">Property details</h2><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-[hsl(var(--secondary)/.5)] p-3"><Home size={18} className="text-[hsl(var(--primary))]" /><p className="mt-2 font-semibold">{listing.type}</p><p className="text-xs text-black/55">Property type</p></div><div className="rounded-2xl bg-[hsl(var(--secondary)/.5)] p-3"><BedDouble size={18} className="text-[hsl(var(--primary))]" /><p className="mt-2 font-semibold">{beds} bedrooms</p><p className="text-xs text-black/55">Sleeping arrangements</p></div><div className="rounded-2xl bg-[hsl(var(--secondary)/.5)] p-3"><Bath size={18} className="text-[hsl(var(--primary))]" /><p className="mt-2 font-semibold">{baths} bathroom{baths === '1' ? '' : 's'}</p><p className="text-xs text-black/55">Private bathroom</p></div><div className="rounded-2xl bg-[hsl(var(--secondary)/.5)] p-3"><KeyRound size={18} className="text-[hsl(var(--primary))]" /><p className="mt-2 font-semibold">{listing.garages || 0} parking</p><p className="text-xs text-black/55">Parking spaces</p></div></div></section>
         <section className="mt-8 border-t border-black/[.1] pt-7" data-testid="section-amenities"><h2 className="text-[21px] font-bold">What this place offers</h2><div className="mt-4 grid grid-cols-2 gap-y-4 text-sm">{[['Wifi', Navigation], ['Kitchen', Home], ['Air conditioning', Sparkles], ['Washer', CircleHelp], ['Workspace', Pencil], ['Free parking', KeyRound]].map(([label, Icon]) => <div key={String(label)} className="flex items-center gap-3"><Icon size={21} strokeWidth={2.2} />{String(label)}</div>)}</div><button onClick={() => setToast('Showing all amenities')} className="mt-5 rounded-xl border border-black/15 px-4 py-2.5 text-sm font-bold" data-testid="button-show-amenities">Show all amenities</button></section>
         <section className="mt-8 border-t border-black/[.1] pt-7" data-testid="section-reviews"><div className="flex items-start justify-between gap-4"><div><h2 className="text-[21px] font-bold">Reviews</h2><p className="mt-2 flex items-center gap-2 text-sm font-semibold"><Star size={18} fill="currentColor" />{listing.rating} · 18 reviews</p></div><button onClick={() => setToast('Showing all reviews')} className="text-sm font-bold underline" data-testid="button-show-reviews">See all</button></div><blockquote className="mt-5 rounded-2xl bg-[hsl(var(--secondary)/.55)] p-4 text-sm leading-relaxed">“Beautifully kept, quiet, and exactly as described. Maria made the whole stay feel easy.”<footer className="mt-3 text-xs font-semibold text-black/55">— Elena · Stayed 2 weeks</footer></blockquote></section>
        <section className="mt-8 border-t border-black/[.1] pt-7" data-testid="section-house-rules"><h2 className="text-[21px] font-bold">House rules</h2><div className="mt-4 divide-y divide-black/[.08] text-sm"><div className="flex items-center gap-3 py-3"><CircleHelp size={19} /><span className="flex-1">No smoking</span><span className="text-xs text-black/50">Not allowed</span></div><div className="flex items-center gap-3 py-3"><DoorOpen size={19} /><span className="flex-1">No parties or events</span><span className="text-xs text-black/50">Quiet stay</span></div><div className="flex items-center gap-3 py-3"><Clock3 size={19} /><span className="flex-1">Quiet hours</span><span className="text-xs text-black/50">10pm – 8am</span></div><div className="flex items-center gap-3 py-3"><KeyRound size={19} /><span className="flex-1">Check-in after 3:00 PM</span><span className="text-xs text-black/50">Checkout by 11:00 AM</span></div><div className="flex items-center gap-3 py-3"><Heart size={19} /><span className="flex-1">Pets</span><span className="text-xs text-black/50">By request</span></div></div></section>
         <section className="mt-8 border-t border-black/[.1] pt-7" data-testid="section-host-details"><h2 className="text-[21px] font-bold">Meet your hosts</h2><div className="mt-4 space-y-4"><div className="flex items-center gap-3"><div className="grid size-12 place-items-center rounded-full bg-[hsl(var(--accent))] text-lg font-bold text-[hsl(var(--primary))]">M</div><div><p className="font-bold">Maria Camilleri</p><p className="text-xs text-black/55">Host · Verified owner · 6 years hosting</p></div><ShieldCheck className="ml-auto text-[hsl(var(--primary))]" size={20} /></div><div className="flex items-center gap-3"><div className="grid size-12 place-items-center rounded-full bg-[hsl(var(--secondary))] text-lg font-bold text-[hsl(var(--primary))]">S</div><div><p className="font-bold">Sofia Attard</p><p className="text-xs text-black/55">Co-host · Helps with check-in and support</p></div><UsersRound className="ml-auto text-[hsl(var(--primary))]" size={20} /></div></div></section>
      </section>
    </div>
    <div className="hidden md:block">
      <div className="mb-4 flex items-center justify-between"><button onClick={() => setLocation('/')} className="flex items-center gap-2 text-sm font-bold" data-testid="button-detail-back"><ArrowLeft size={18} />Back to search</button><div className="flex gap-2"><button onClick={toggleSave} className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold ${saved ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : ''}`} data-testid="button-detail-save"><Heart size={16} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save'}</button><button onClick={() => setToast('Link copied — share it with someone you trust')} className="grid size-9 place-items-center rounded-full border" data-testid="button-detail-share"><Send size={16} /></button></div></div>
      <div className="grid gap-2 overflow-hidden rounded-[26px] md:grid-cols-2 md:grid-rows-2 md:gap-3"><div className="relative row-span-2 min-h-[320px] md:min-h-[500px]"><img src={listing.image} alt={listing.title} className="size-full object-cover" /><span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white">1 / 5</span></div>{gallery.slice(1).map((image, index) => <div key={image + index} className={`${index > 1 ? 'hidden md:block' : ''} min-h-[150px]`}><img src={image} alt={`${listing.title} view ${index + 2}`} className="size-full object-cover" /></div>)}</div>
       <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]"><div><p className="text-sm font-bold text-[hsl(var(--primary))]">{listing.mode} · {listing.type}</p><h1 className="mt-1 max-w-2xl font-display text-5xl leading-tight tracking-[-.045em]">{listing.title}</h1><p className="mt-2 flex items-center gap-1 text-[hsl(var(--muted-foreground))]"><MapPin size={15} />{listing.location}, Malta</p><div className="mt-7 flex flex-wrap gap-2">{[`${beds} bedrooms`, `${baths} baths`, `${guests} guests`, 'Wifi'].map((item) => <span key={item} className="rounded-full border border-[hsl(var(--border))] px-3.5 py-2 text-xs font-bold">{item}</span>)}</div><p className="mt-7 text-[1.05rem] leading-relaxed text-[hsl(var(--muted-foreground))]">A considered place to land, with warm light, good proportions and the best of the island close by. Listed by someone who knows the home and answers directly.</p><section className="mt-9"><h2 className="font-display text-3xl">What this place offers</h2><div className="mt-5 grid grid-cols-2 gap-y-4 sm:grid-cols-3">{[['Wifi', Navigation], ['Kitchen', Home], ['Air conditioning', Sparkles], ['Washer', CircleHelp], ['Workspace', Pencil], ['Free parking', KeyRound]].map(([label, Icon]) => <div key={String(label)} className="flex items-center gap-3 text-sm"><span className="grid size-9 place-items-center rounded-xl bg-[hsl(var(--secondary))]"><Icon size={17} /></span>{String(label)}</div>)}</div></section><section className="mt-10 grid gap-8 border-t border-[hsl(var(--border))] pt-8 sm:grid-cols-2" data-testid="section-desktop-booking-details"><div><h2 className="font-display text-3xl">House rules</h2><ul className="mt-4 space-y-3 text-sm text-[hsl(var(--muted-foreground))]"><li className="flex items-center gap-2"><CircleHelp size={17} />No smoking</li><li className="flex items-center gap-2"><DoorOpen size={17} />No parties or events</li><li className="flex items-center gap-2"><Clock3 size={17} />Quiet hours: 10pm – 8am</li><li className="flex items-center gap-2"><Heart size={17} />Pets by request</li><li className="flex items-center gap-2"><KeyRound size={17} />Check-in after 3pm · checkout by 11am</li></ul></div><div><h2 className="font-display text-3xl">Meet your hosts</h2><div className="mt-4 space-y-4"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-full bg-[hsl(var(--accent))] font-bold text-[hsl(var(--primary))]">M</div><div><p className="font-bold">Maria Camilleri</p><p className="text-xs text-[hsl(var(--muted-foreground))]">Host · Verified owner</p></div><ShieldCheck className="ml-auto text-[hsl(var(--primary))]" size={19} /></div><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-full bg-[hsl(var(--secondary))] font-bold text-[hsl(var(--primary))]">S</div><div><p className="font-bold">Sofia Attard</p><p className="text-xs text-[hsl(var(--muted-foreground))]">Co-host · Check-in support</p></div></div></div></div></section><section className="mt-10 border-t border-[hsl(var(--border))] pt-8"><h2 className="font-display text-3xl">Cancellation and booking</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Review all details before requesting to book. Payment stays protected until the host confirms, with free cancellation before confirmation.</p></section><button onClick={() => setToast('Thanks — we will review this listing')} className="mt-10 flex items-center gap-2 text-sm font-bold text-[hsl(var(--muted-foreground))] underline" data-testid="button-report-listing"><CircleHelp size={16} />Report this listing</button></div><aside className="h-fit lg:sticky lg:top-24"><div className="rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-lift"><div className="flex items-end justify-between"><div><span className="text-2xl font-bold">{listing.price}</span>{listing.mode === 'Short Let' && <span className="text-sm text-[hsl(var(--muted-foreground))]"> / night</span>}</div><span className="text-xs text-[hsl(var(--muted-foreground))]">Protected booking</span></div><button onClick={openBooking} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--primary))] py-3.5 font-bold text-white" data-testid="button-book-offer"><CalendarDays size={18} />{listing.mode === 'Buy' ? 'Make an offer' : 'Start booking'}</button><button onClick={() => setContactOpen(true)} className="mt-2 w-full rounded-2xl border border-[hsl(var(--foreground))] py-3.5 text-sm font-bold" data-testid="button-contact-owner"><MessageCircle size={18} className="mr-2 inline" />Contact owner</button><p className="mt-4 flex items-center justify-center gap-1 text-center text-xs text-[hsl(var(--muted-foreground))]"><LockKeyhole size={13} />Protected by AiroRent Pay</p></div></aside></div>
     </div>
     <section className="mx-auto mt-10 hidden max-w-[820px] border-t border-[hsl(var(--border))] pt-8 md:block" data-testid="section-desktop-reviews"><div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-3xl">Reviews</h2><p className="mt-2 flex items-center gap-2 text-sm font-semibold"><Star size={19} fill="currentColor" />{listing.rating} · 18 reviews</p></div><button onClick={() => setToast('Showing all reviews')} className="text-sm font-bold underline" data-testid="button-desktop-show-reviews">See all</button></div><blockquote className="mt-5 rounded-2xl bg-[hsl(var(--secondary)/.55)] p-5 text-sm leading-relaxed">“Beautifully kept, quiet, and exactly as described. Maria made the whole stay feel easy.”<footer className="mt-3 text-xs font-semibold text-[hsl(var(--muted-foreground))]">— Elena · Stayed 2 weeks</footer></blockquote></section>
      {viewerOpen && <PhotoViewer listing={listing} gallery={gallery} selectedImageIndex={selectedImageIndex} onClose={() => setViewerOpen(false)} onPrevious={() => changeViewerImage(-1)} onNext={() => changeViewerImage(1)} />}
       <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-32px)] max-w-[1260px] -translate-x-1/2 rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/.98)] px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_12px_30px_rgba(22,28,35,.14)] backdrop-blur-xl sm:px-5 sm:py-3" data-testid="property-action-bar"><div className="mx-auto flex max-w-[1260px] flex-col gap-2.5 md:flex-row md:items-center md:gap-5"><div className="flex items-center justify-between gap-3 md:flex-1"><div className="flex min-w-0 items-center gap-2.5 sm:gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-full bg-[hsl(var(--accent)/.55)] text-base font-bold text-[hsl(var(--primary))] sm:size-11 sm:text-lg">M</div><div className="min-w-0"><p className="truncate text-sm font-bold sm:text-base">Maria Camilleri</p><p className="hidden truncate text-[11px] text-[hsl(var(--muted-foreground))] sm:block">Verified owner · 6 years on AiroRent</p></div></div><div className="flex shrink-0 items-center gap-2"><button onClick={() => openWhatsApp(listing)} className="grid size-11 place-items-center rounded-full bg-[#25D366]/10 transition hover:bg-[#25D366]/18 sm:size-12" aria-label="WhatsApp Maria" data-testid="button-property-whatsapp"><img src={whatsappIconSrc} alt="" className="size-8 object-contain" /></button><button onClick={callHost} className="grid size-11 place-items-center rounded-full bg-[#FA3B80]/10 text-[#FA3B80] transition hover:bg-[#FA3B80]/18 sm:size-12" aria-label="Call Maria" data-testid="button-property-call"><Phone size={21} strokeWidth={2.8} /></button></div></div><div className="flex min-w-0 items-center gap-3 md:flex-1 md:justify-end"><div className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Total price</span><div className="mt-0.5 flex items-baseline gap-1.5"><span className="text-xl font-extrabold leading-none text-[#FA3B80] sm:text-2xl">{listing.price.replace(' / mo', '')}</span><span className="text-[11px] font-semibold text-[hsl(var(--muted-foreground))] sm:text-sm">{listing.mode === 'Short Let' ? '/ night' : listing.mode === 'Buy' ? 'total' : '/ month'}</span></div></div><button onClick={openBooking} className="min-h-12 min-w-[132px] flex-[1.2] rounded-full bg-[#FA3B80] px-5 text-[15px] font-extrabold text-white shadow-[0_8px_20px_rgba(250,59,128,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(250,59,128,.36)] sm:min-h-13 sm:min-w-[164px] sm:px-7 sm:text-lg" data-testid="button-property-book"><span>{listing.mode === 'Buy' ? 'Make offer' : 'Check In'}</span></button></div></div></div>
     {contactOpen && <ContactSheet listing={listing} onClose={() => setContactOpen(false)} onSent={() => { setContactOpen(false); setToast('Message sent to Maria'); }} />}
    {bookingOpen && <BookingSheet listing={listing} onClose={() => setBookingOpen(false)} onBooked={() => { setBookingOpen(false); setToast('Availability request sent — check Trips for updates'); }} />}
    {toast && <Toast text={toast} onClose={() => setToast('')} />}
  </main>;
}

function PhotoViewer({ listing, gallery, selectedImageIndex, onClose, onPrevious, onNext }: { listing: Listing; gallery: string[]; selectedImageIndex: number; onClose: () => void; onPrevious: () => void; onNext: () => void }) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const handleTouchEnd = (clientX: number) => {
    if (touchStartX === null) return;
    const delta = touchStartX - clientX;
    if (Math.abs(delta) > 40) (delta > 0 ? onNext : onPrevious)();
    setTouchStartX(null);
  };
  return <div className="fixed inset-0 z-[60] bg-white p-4 text-[hsl(var(--foreground))] sm:p-6" onClick={onClose} data-testid="photo-viewer">
    <div className="mx-auto flex h-full max-w-4xl flex-col" onClick={(event) => event.stopPropagation()}>
      <div className="relative flex items-start justify-center pb-2">
        <div className="text-center"><p className="text-base font-bold">{listing.title}</p><p className="mt-0.5 text-sm text-black/55">{selectedImageIndex + 1} of {gallery.length}</p></div>
        <button onClick={onClose} className="absolute right-0 top-0 grid size-10 place-items-center rounded-full transition hover:bg-black/[.06]" aria-label="Close photo tour" data-testid="button-photo-viewer-close"><X size={23} /></button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center py-4 sm:py-8" onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)} onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}>
        <button onClick={onPrevious} className="absolute left-0 z-10 grid size-10 place-items-center rounded-full border border-black/10 bg-white transition hover:bg-black/[.04] sm:left-2" aria-label="Previous photo" data-testid="button-photo-viewer-previous"><ChevronLeft size={22} /></button>
        <img src={gallery[selectedImageIndex]} alt={`${listing.title} full-screen view ${selectedImageIndex + 1}`} className="max-h-[76dvh] max-w-[calc(100%-5rem)] rounded-[28px] object-contain shadow-[0_10px_30px_rgba(22,28,35,.12)] sm:max-h-[78dvh]" />
        <button onClick={onNext} className="absolute right-0 z-10 grid size-10 place-items-center rounded-full border border-black/10 bg-white transition hover:bg-black/[.04] sm:right-2" aria-label="Next photo" data-testid="button-photo-viewer-next"><ChevronRight size={22} /></button>
      </div>
      <div className="flex items-center justify-center gap-1.5 pb-2" aria-label={`Photo ${selectedImageIndex + 1} of ${gallery.length}`}>{gallery.map((image, index) => <span key={image + index} className={`size-2 rounded-full ${index === selectedImageIndex ? 'bg-[hsl(var(--primary))]' : 'bg-black/15'}`} />)}</div>
    </div>
  </div>;
}

function BookingSheet({ listing, onClose, onBooked }: { listing: Listing; onClose: () => void; onBooked: () => void }) {
  const [checkIn, setCheckIn] = useState('2025-05-12');
  const [checkOut, setCheckOut] = useState('2025-05-16');
  const [guests, setGuests] = useState('2 guests');
  const inputClass = 'mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-white px-3 py-3 text-sm outline-none focus:border-[hsl(var(--primary))]';
  return <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-3 backdrop-blur-sm md:items-center md:justify-center" onClick={onClose}>
    <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-lift" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[hsl(var(--primary))]">Book your stay</p><h2 className="font-display text-3xl">Check availability</h2></div><button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-[hsl(var(--muted))]" data-testid="button-close-booking"><X size={18} /></button></div>
      <div className="mt-5 flex gap-3 rounded-2xl bg-[hsl(var(--secondary)/.55)] p-3"><img src={listing.image} alt="" className="size-16 rounded-xl object-cover" /><div className="min-w-0"><p className="truncate text-sm font-bold">{listing.title}</p><p className="mt-1 text-xs text-black/55">{listing.location}</p></div></div>
      <div className="mt-5 grid grid-cols-2 gap-3"><label className="text-sm font-bold">Check-in<input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className={inputClass} data-testid="input-check-in" /></label><label className="text-sm font-bold">Check-out<input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className={inputClass} data-testid="input-check-out" /></label></div>
      <label className="mt-4 block text-sm font-bold">Guests<select value={guests} onChange={(event) => setGuests(event.target.value)} className={inputClass} data-testid="select-booking-guests">{['1 guest', '2 guests', '3 guests', '4 guests', '5 guests'].map((option) => <option key={option}>{option}</option>)}</select></label>
      <div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4"><span className="text-sm text-black/55">Estimated total</span><b className="text-xl">{listing.mode === 'Short Let' ? '€920' : listing.price}</b></div>
      <button onClick={onBooked} className="mt-4 w-full rounded-2xl bg-[hsl(var(--primary))] py-3.5 font-bold text-white" data-testid="button-submit-booking">Request to book</button>
      <p className="mt-3 text-center text-xs text-black/50">You will only be charged after the owner confirms.</p>
    </div>
  </div>;
}

function ContactSheet({ listing, onClose, onSent }: { listing: Listing; onClose: () => void; onSent: () => void }) {
  const [message, setMessage] = useState(`Hi, I’m interested in ${listing.title}. Is it still available?`);
  return (
    <div className="fixed inset-0 z-50 flex items-end animate-fade bg-[hsl(var(--foreground)/.4)] p-3 backdrop-blur-sm md:items-center md:justify-center" onClick={onClose}>
      <div className="w-full max-w-md animate-rise rounded-[28px] bg-[hsl(var(--card))] p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[hsl(var(--primary))]">Direct to owner</p><h2 className="font-display text-3xl">Start a conversation</h2></div><button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-[hsl(var(--muted))]" data-testid="button-close-contact"><X size={18} /></button></div>
        <div className="mt-5 rounded-2xl bg-[hsl(var(--secondary)/.55)] p-3 text-sm font-semibold">{listing.title}<p className="mt-1 text-xs font-normal text-[hsl(var(--muted-foreground))]">{listing.location}</p></div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => openWhatsApp(listing)} className="flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-3 text-sm font-bold hover:bg-[hsl(var(--secondary))]" data-testid="button-contact-whatsapp"><span className="grid size-7 place-items-center overflow-hidden rounded-full"><img src={whatsappIconSrc} alt="" className="size-7 object-cover" /></span>WhatsApp</button>
          <button onClick={callHost} className="flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-3 text-sm font-bold hover:bg-[hsl(var(--secondary))]" data-testid="button-contact-call"><Phone size={20} strokeWidth={2.5} />Call</button>
        </div>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="mt-4 w-full resize-none rounded-2xl border border-[hsl(var(--border))] bg-transparent p-4 text-sm outline-none focus:border-[hsl(var(--primary))]" data-testid="textarea-contact-message" />
        <button onClick={onSent} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FA3B80] py-3.5 font-bold text-white shadow-[0_8px_20px_rgba(250,59,128,.22)]" data-testid="button-send-message"><Send size={19} strokeWidth={2.5} />Send message</button>
        <p className="mt-3 text-center text-xs text-[hsl(var(--muted-foreground))]">Keep conversations and payments on AiroRent for your peace of mind.</p>
      </div>
    </div>
  );
}

function WatchlistCard({ listing, label, saved, onSave }: { listing: Listing; label: string; saved: boolean; onSave: (id: string) => void }) {
  const [, setLocation] = useLocation();
  const open = () => { saveRecent(listing.id); setLocation(`/listing/${listing.id}`); };
  const beds = listing.detail.match(/^\d+\s+\w+/)?.[0] || '—';
  const baths = listing.detail.match(/·\s*\d+\s+bath/)?.[0]?.replace('· ', '') || '—';
  return <article className="flex gap-3 rounded-[22px] border border-black/[.06] bg-white p-3 shadow-[0_6px_20px_rgba(0,0,0,.06)]" data-testid={`card-watchlist-${listing.id}`}>
    <div className="relative w-[42%] shrink-0">
      <button onClick={open} className="block size-full overflow-hidden rounded-[17px] text-left" aria-label={`Open ${listing.title}`}>
        <img src={listing.image} alt={listing.title} className="aspect-[.92] size-full object-cover" />
        <span className="absolute inset-x-2 bottom-2 rounded-lg bg-black/55 px-2 py-1.5 text-center text-[10px] font-bold text-white">{listing.price}</span>
      </button>
      <button onClick={() => onSave(listing.id)} className={`absolute right-2 top-2 grid size-8 place-items-center rounded-full ${saved ? 'bg-[hsl(var(--primary))] text-white' : 'bg-white/95'}`} aria-label={saved ? `Remove ${listing.title} from watchlist` : `Save ${listing.title}`} data-testid={`button-watchlist-save-${listing.id}`}><Heart size={15} fill={saved ? 'currentColor' : 'none'} /></button>
    </div>
    <button onClick={open} className="min-w-0 flex-1 text-left" data-testid={`button-watchlist-open-${listing.id}`}>
      <span className="inline-flex rounded-full bg-[hsl(var(--primary)/.1)] px-2.5 py-1 text-[10px] font-bold text-[hsl(var(--primary))]">{label}</span>
      <h2 className="mt-2 line-clamp-2 text-[16px] font-bold leading-tight">{listing.title}</h2>
      <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-black/55"><MapPin size={12} />{listing.location.split(',')[0]}</p>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-black/60"><span className="flex items-center gap-1"><BedDouble size={13} />{beds}</span><span className="flex items-center gap-1"><Bath size={13} />{baths}</span><span className="flex items-center gap-1"><UsersRound size={13} />{listing.detail.match(/sleeps\s+\d+/)?.[0] || '2 guests'}</span></div>
      <div className="mt-3 flex items-center justify-between border-t border-black/[.08] pt-2 text-xs"><span className="text-black/55">From</span><b>{listing.price}</b></div>
    </button>
  </article>;
}

function WishlistPage() {
  const [saved, setSaved] = useState(readSaved);
  const [tab, setTab] = useState<'saved' | 'recent'>('saved');
  const [, setLocation] = useLocation();
  const items = (tab === 'saved' ? saved : readRecent()).map((id) => listings.find((item) => item.id === id)).filter(Boolean) as Listing[];
  const remove = (id: string) => { const next = saved.filter((x) => x !== id); setSaved(next); localStorage.setItem('jakurzi:wishlist', JSON.stringify(next)); };
  return <main className="min-h-[calc(100dvh-68px)] bg-[#f7f8f9] px-5 pb-28 pt-8 lg:mx-auto lg:min-h-0 lg:max-w-[720px] lg:bg-transparent lg:px-8 lg:py-10">
    <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Your shortlist</p><h1 className="mt-1 text-[36px] font-semibold tracking-[-.06em] md:font-display md:text-5xl">Watchlist</h1><p className="mt-1 text-sm text-black/55">Saved homes and places you want to revisit.</p></div><button onClick={() => setTab('recent')} className="grid size-10 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]" aria-label="View recently viewed" data-testid="button-watchlist-filter"><SlidersHorizontal size={18} /></button></div>
    <div className="mt-7 flex border-b border-black/[.08]"><button onClick={() => setTab('saved')} className={`flex-1 border-b-2 py-3 text-sm font-bold ${tab === 'saved' ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : 'border-transparent text-black/50'}`} data-testid="button-wishlist-saved">Saved ({saved.length})</button><button onClick={() => setTab('recent')} className={`flex-1 border-b-2 py-3 text-sm font-bold ${tab === 'recent' ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : 'border-transparent text-black/50'}`} data-testid="button-wishlist-recent">Recently viewed</button></div>
    <div className="mt-5">{items.length ? <div className="space-y-4">{items.map((item) => <WatchlistCard key={item.id} listing={item} label={tab === 'saved' ? 'Saved' : 'Recently viewed'} saved={saved.includes(item.id)} onSave={remove} />)}</div> : <EmptyState title={tab === 'saved' ? 'Your next favourite is out there' : 'Your trail starts here'} body={tab === 'saved' ? 'Tap the heart on any home that makes you pause. We will keep it close.' : 'Open a listing and we will remember it here while you compare.'} action="Explore homes" onAction={() => setLocation('/')} />}</div>
  </main>;
}

function RecentBookingCard({ booking }: { booking: BookingRecord }) {
  const [, setLocation] = useLocation();
  const listing = listings.find((item) => item.id === booking.listingId) || listings[0];
  const beds = listing.detail.match(/^\d+/)?.[0] || '2';
  const baths = listing.detail.match(/·\s*(\d+)\s+bath/)?.[1] || '1';
  const open = () => { saveRecent(listing.id); setLocation(`/listing/${listing.id}`); };
  return <article className="flex gap-3 rounded-[22px] border border-black/[.05] bg-white p-3 shadow-[0_6px_22px_rgba(0,0,0,.06)]" data-testid={`card-booking-${booking.id}`}>
    <button onClick={open} className="relative w-[43%] shrink-0 overflow-hidden rounded-[17px] text-left" aria-label={`Open ${listing.title}`}>
      <img src={listing.image} alt={listing.title} className="aspect-[.92] size-full object-cover" />
      <span className="absolute inset-x-2 bottom-2 rounded-lg bg-black/60 px-2 py-1.5 text-center text-[10px] font-bold text-white"><CalendarDays size={12} className="mr-1 inline" />{booking.dates}</span>
    </button>
    <button onClick={open} className="min-w-0 flex-1 text-left" data-testid={`button-booking-open-${booking.id}`}>
      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${booking.status === 'Completed' ? 'bg-[#e8eaec] text-[#4b535b]' : booking.status === 'Cancelled' ? 'bg-[#f3f3f3] text-black/50' : 'bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]'}`}>{booking.status}</span>
      <h2 className="mt-2 line-clamp-2 text-[16px] font-bold leading-tight">{listing.title}</h2>
      <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-black/55"><MapPin size={12} />{listing.location.split(',')[0]}</p>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-black/60"><span className="flex items-center gap-1"><BedDouble size={13} />{beds} Beds</span><span className="flex items-center gap-1"><Bath size={13} />{baths} Baths</span><span className="flex items-center gap-1"><UsersRound size={13} />{booking.guests} Guests</span></div>
      <div className="mt-3 flex items-center justify-between border-t border-black/[.08] pt-2 text-xs"><span className="text-black/55">Total</span><b className="text-sm">{booking.total}</b></div>
    </button>
  </article>;
}

function TripsPage() {
  const [tab, setTab] = useState<BookingRecord['status']>('Upcoming');
  const [, setLocation] = useLocation();
  const bookings = recentBookings.filter((booking) => booking.status === tab);
  return <main className="min-h-[calc(100dvh-68px)] bg-[#f7f8f9] px-5 pb-28 pt-8 lg:mx-auto lg:min-h-0 lg:max-w-[720px] lg:bg-transparent lg:px-8 lg:py-10">
    <div className="flex items-start justify-between"><div><h1 className="text-[32px] font-semibold tracking-[-.06em] md:font-display md:text-5xl">Recent Bookings</h1><p className="mt-1 text-sm text-black/55">Your recent stays and reservations</p></div><button onClick={() => setTab('Upcoming')} className="grid size-10 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]" aria-label="Filter bookings" data-testid="button-bookings-filter"><SlidersHorizontal size={18} /></button></div>
    <div className="mt-7 flex border-b border-black/[.08]">{(['Upcoming', 'Completed', 'Cancelled'] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`flex-1 border-b-2 py-3 text-sm font-semibold ${tab === item ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : 'border-transparent text-black/55'}`} data-testid={`button-bookings-${item.toLowerCase()}`}>{item}</button>)}</div>
    <div className="mt-5 space-y-4">{bookings.length ? bookings.map((booking) => <RecentBookingCard key={booking.id} booking={booking} />) : <EmptyState title={`No ${tab.toLowerCase()} bookings`} body="Your completed stays and new reservations will appear here." action="Explore homes" onAction={() => setLocation('/')} />}</div>
  </main>;
}

function MessagesPage() {
  const [tab, setTab] = useState<'messages' | 'notifications'>('messages');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const messages = [
    { id: 'oceanview', name: 'Oceanview Villa Host', first: 'Hi Husnain, thank you for your interest!', second: 'The villa is available for your selected dates...', date: '10:30 AM', unread: 2, image: images.seaview, online: true },
    { id: 'mountain-cabin', name: 'Mountain Cabin Host', first: 'Sure! I can send you more details and', second: 'photos of the cabin.', date: 'Yesterday', unread: 1, image: images.farmhouse, online: true },
    { id: 'city-apartment', name: 'City Apartment Host', first: 'Check-in instructions sent.', second: 'Let me know if you need anything!', date: 'May 10', unread: 0, image: images.limestone, online: false },
    { id: 'support', name: 'AiroRent Support', first: 'Your booking was confirmed.', second: 'We’re here to help if you need anything.', date: 'May 8', unread: 0, image: images.profile, online: false },
    { id: 'offers', name: 'AiroRent Offers', first: 'Special discounts for your next trip!', second: 'Explore new stays with great deals.', date: 'May 5', unread: 0, image: images.explore, online: false },
    { id: 'seaside', name: 'Seaside Villa Host', first: 'Thank you for staying with us!', second: 'We hope to host you again.', date: 'Apr 28', unread: 0, image: images.seaview, online: false },
    { id: 'skyline', name: 'Skyline Penthouse Host', first: 'Hope you had a great stay.', second: 'Would love to host you again!', date: 'Apr 20', unread: 0, image: images.deck, online: false },
  ];
  const notifications = [
    { id: 'booking-confirmed', name: 'Booking confirmed', first: 'Your stay at The Limestone Harbour Loft', second: 'is confirmed for May 12–16.', date: 'Today', unread: 1, image: images.limestone, online: false },
    { id: 'price-drop', name: 'Price drop nearby', first: 'A home in Sliema you viewed is now', second: '€120 less per month.', date: 'Yesterday', unread: 0, image: images.seaview, online: false },
    { id: 'welcome', name: 'Welcome to AiroRent', first: 'Your profile is ready. Find a place', second: 'that feels right for your next move.', date: 'May 8', unread: 0, image: images.profile, online: false },
  ];
  const source = tab === 'messages' ? messages : notifications;
  const visible = source.filter((item) => `${item.name} ${item.first} ${item.second}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="min-h-[100dvh] bg-[#f7f8f9] px-5 pb-28 pt-5 md:mx-auto md:min-h-0 md:max-w-[1060px] md:bg-transparent md:px-8 md:py-10">
    <section className="flex items-start justify-between">
      <div><h1 className="text-[29px] font-semibold tracking-[-.055em] md:font-display md:text-5xl">Inbox</h1><p className="mt-1 text-[13px] text-black/55 md:text-sm">Your messages and notifications</p></div>
      <div className="flex gap-2"><button onClick={() => setToast('Inbox filters are ready.')} className="grid size-11 place-items-center rounded-full bg-white shadow-[0_5px_16px_rgba(0,0,0,.07)]" aria-label="Filter inbox" data-testid="button-message-filter"><SlidersHorizontal size={18} /></button><button onClick={() => setToast('New message is ready to start.')} className="grid size-11 place-items-center rounded-full bg-white text-[hsl(var(--primary))] shadow-[0_5px_16px_rgba(0,0,0,.07)]" aria-label="Compose message" data-testid="button-compose-message"><Pencil size={18} /></button></div>
    </section>
    <section className="mt-6 rounded-[16px] bg-white p-1.5 shadow-[0_5px_16px_rgba(0,0,0,.05)]" aria-label="Inbox sections">
      <div className="grid grid-cols-2 gap-1">
        <button onClick={() => setTab('messages')} className={`flex items-center justify-center gap-2 rounded-[11px] py-2.5 text-[13px] font-semibold transition ${tab === 'messages' ? 'bg-[#e8eaec] text-[hsl(var(--primary))]' : 'text-black/55'}`} data-testid="button-inbox-messages"><MessageCircle size={16} />Messages</button>
        <button onClick={() => setTab('notifications')} className={`flex items-center justify-center gap-2 rounded-[11px] py-2.5 text-[13px] font-semibold transition ${tab === 'notifications' ? 'bg-[#e8eaec] text-[hsl(var(--primary))]' : 'text-black/55'}`} data-testid="button-inbox-notifications"><Bell size={16} />Notifications</button>
      </div>
    </section>
    <div className="mt-5 flex h-11 items-center gap-3 rounded-full bg-[#f5f4f5] px-4">
      <Search size={18} className="shrink-0 text-black/55" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tab === 'messages' ? 'Search messages' : 'Search notifications'} aria-label={tab === 'messages' ? 'Search messages' : 'Search notifications'} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/45" data-testid="input-inbox-search" />{query && <button onClick={() => setQuery('')} aria-label="Clear inbox search" data-testid="button-clear-inbox-search"><X size={16} className="text-black/45" /></button>}
    </div>
    <section className="mt-4 overflow-hidden rounded-[22px] bg-white shadow-[0_5px_18px_rgba(0,0,0,.04)] md:border md:border-[hsl(var(--border))]" data-testid="section-inbox-list">
      {visible.length ? visible.map((item) => <button key={item.id} onClick={() => { setSelected(item.id); setToast(`${item.name} opened`); }} className={`flex w-full items-center gap-3 border-b border-black/[.07] px-1 py-4 text-left transition last:border-b-0 hover:bg-[#f2f3f4] ${selected === item.id ? 'bg-[#f2f3f4]' : ''}`} data-testid={`button-inbox-thread-${item.id}`}>
        <div className="relative ml-2 shrink-0"><img src={item.image} alt="" className="size-[54px] rounded-full object-cover" /><span className={`absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-white ${item.online ? 'bg-[#636a72]' : 'bg-transparent'}`} /></div>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="min-w-0 flex-1 truncate text-[14px] font-bold">{item.name}</h2><span className={`shrink-0 text-[11px] ${item.unread ? 'font-bold text-[hsl(var(--primary))]' : 'text-black/50'}`}>{item.date}</span></div><p className="mt-1 truncate text-[12px] text-black/65">{item.first}</p><p className="truncate text-[12px] text-black/65">{item.second}</p></div>
        {item.unread ? <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[hsl(var(--primary))] text-[11px] font-bold text-white">{item.unread}</span> : <Star size={19} className="mr-2 shrink-0 text-black/30" />}
      </button>) : <div className="px-5 py-14 text-center"><Search size={25} className="mx-auto text-black/30" /><h2 className="mt-4 font-semibold">Nothing found</h2><p className="mt-1 text-sm text-black/50">Try a different search term.</p></div>}
    </section>
    {toast && <Toast text={toast} onClose={() => setToast('')} />}
  </main>;
}

function ProfilePage() {
  const [role, setRole] = useState<'Guest' | 'Owner'>('Guest');
  const [, setLocation] = useLocation();
  return <main className="mx-auto max-w-[940px] px-5 py-9 lg:px-8"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Your space</p><h1 className="mt-1 font-display text-5xl tracking-[-.05em]">Profile</h1></div><button className="grid size-11 place-items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]" data-testid="button-profile-notifications"><Bell size={19} /></button></div><div className="mt-8 rounded-[28px] bg-[hsl(var(--foreground))] p-7 text-[hsl(var(--background))] shadow-soft md:p-9"><div className="flex flex-col items-center text-center md:flex-row md:items-center md:gap-6 md:text-left"><div className="grid size-24 place-items-center rounded-full bg-[hsl(var(--accent))] font-display text-4xl text-[hsl(var(--foreground))]">H</div><div className="mt-4 md:mt-0"><h2 className="font-display text-4xl">Husnain</h2><p className="mt-1 text-sm text-[hsl(var(--background)/.65)]">{role} on Jakurzi · Malta</p></div><button onClick={() => setRole(role === 'Guest' ? 'Owner' : 'Guest')} className="mt-5 flex items-center gap-2 rounded-full border border-[hsl(var(--background)/.25)] px-4 py-2 text-xs font-bold md:ml-auto md:mt-0" data-testid="button-switch-role"><ArrowRight size={14} />Switch to {role === 'Guest' ? 'owner' : 'guest'}</button></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><button onClick={() => setLocation('/trips')} className="group rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-soft" data-testid="button-profile-trips"><CalendarDays className="text-[hsl(var(--primary))]" /><h3 className="mt-8 font-display text-2xl">Past trips</h3><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Your stays and memories</p><ArrowRight size={17} className="mt-4 transition group-hover:translate-x-1" /></button><button onClick={() => setLocation('/messages')} className="group rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-soft" data-testid="button-profile-connections"><UsersRound className="text-[hsl(var(--primary))]" /><h3 className="mt-8 font-display text-2xl">Connections</h3><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Owners and people you trust</p><ArrowRight size={17} className="mt-4 transition group-hover:translate-x-1" /></button></div><button onClick={() => setLocation('/post')} className="mt-5 flex w-full items-center gap-4 rounded-[24px] border border-[hsl(var(--primary)/.25)] bg-[hsl(var(--secondary)/.6)] p-5 text-left transition hover:border-[hsl(var(--primary))]" data-testid="button-become-owner"><span className="grid size-12 place-items-center rounded-2xl bg-[hsl(var(--primary))] text-white"><HousePlus size={23} /></span><span className="flex-1"><b className="block text-lg">Become an owner</b><span className="text-sm text-[hsl(var(--muted-foreground))]">Share your place and make the next move easier.</span></span><ChevronRight size={19} /></button><div className="mt-8 divide-y divide-[hsl(var(--border))] rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5"><button className="flex w-full items-center gap-4 py-5 text-left" data-testid="button-account-settings"><Settings size={20} /><span className="flex-1 font-bold">Account settings</span><ChevronRight size={18} className="text-[hsl(var(--muted-foreground))]" /></button><button className="flex w-full items-center gap-4 py-5 text-left" data-testid="button-payment-settings"><WalletCards size={20} /><span className="flex-1 font-bold">Jakurzi Pay & payment</span><ChevronRight size={18} className="text-[hsl(var(--muted-foreground))]" /></button><button className="flex w-full items-center gap-4 py-5 text-left" data-testid="button-help"><CircleHelp size={20} /><span className="flex-1 font-bold">Help centre</span><ChevronRight size={18} className="text-[hsl(var(--muted-foreground))]" /></button></div></main>;
}

function LegacyProfileExperiencePage() {
  const [role, setRole] = useState<'Guest' | 'Owner'>('Guest');
  const [toast, setToast] = useState('');
  const [, setLocation] = useLocation();
  const userName = readUserName();
  const row = (label: string, Icon: typeof Settings, action: () => void, testId: string) => <button onClick={action} key={label} className="flex w-full items-center gap-4 py-[17px] text-left" data-testid={testId}><Icon size={25} strokeWidth={1.7} /><span className="flex-1 text-[17px]">{label}</span><ChevronRight size={21} className="text-black/50" /></button>;
  const notify = () => setToast('You are all caught up.');
  return <main className="min-h-[calc(100dvh-70px)] bg-white px-5 pb-28 pt-4 md:mx-auto md:min-h-0 md:max-w-[940px] md:bg-transparent md:px-8 md:py-10">
    <div className="flex items-center justify-between border-b border-black/[.08] pb-4 md:border-0 md:pb-0"><div><p className="hidden text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))] md:block">Your space</p><h1 className="text-[29px] font-semibold tracking-[-.045em] md:mt-1 md:font-display md:text-5xl">Profile</h1></div><button onClick={notify} className="grid size-11 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]" aria-label="Notifications" data-testid="button-profile-notifications-new"><Bell size={21} strokeWidth={1.8} /></button></div>
    <div className="mx-auto mt-4 max-w-[660px] md:mt-8">
      <section className="rounded-[26px] border border-black/[.07] bg-white px-5 py-7 text-center shadow-[0_7px_22px_rgba(0,0,0,.07)] md:flex md:items-center md:gap-6 md:px-8 md:text-left">
         <div className="mx-auto grid size-[104px] place-items-center rounded-full bg-[hsl(var(--accent))] text-[47px] font-bold text-[hsl(var(--primary))] md:mx-0">{userName[0]}</div>
         <div className="mt-4 md:mt-0"><h2 className="text-[34px] font-bold tracking-[-.06em]">{userName}</h2><p className="mt-1 text-[16px] text-black/55">{role}</p></div>
        <button onClick={() => setRole(role === 'Guest' ? 'Owner' : 'Guest')} className="mx-auto mt-4 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold md:ml-auto md:mt-0" data-testid="button-switch-role-reference">Switch to {role === 'Guest' ? 'owner' : 'guest'}</button>
      </section>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <button onClick={() => setLocation('/trips')} className="relative rounded-[22px] border border-black/[.07] bg-white px-4 pb-5 pt-4 text-left shadow-[0_7px_20px_rgba(0,0,0,.07)]" data-testid="button-profile-trips-reference"><span className="absolute right-3 top-3 rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-[10px] font-bold text-[hsl(var(--primary))]">NEW</span><div className="grid size-16 place-items-center rounded-2xl bg-[hsl(var(--accent)/.55)] text-[hsl(var(--primary))]"><CalendarDays size={34} strokeWidth={1.5} /></div><h3 className="mt-5 text-[18px] font-bold">Past trips</h3></button>
        <button onClick={() => setLocation('/messages')} className="relative rounded-[22px] border border-black/[.07] bg-white px-4 pb-5 pt-4 text-left shadow-[0_7px_20px_rgba(0,0,0,.07)]" data-testid="button-profile-connections-reference"><span className="absolute right-3 top-3 rounded-full bg-[hsl(var(--secondary))] px-2 py-1 text-[10px] font-bold text-[hsl(var(--primary))]">NEW</span><div className="grid size-16 place-items-center rounded-2xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><UsersRound size={34} strokeWidth={1.5} /></div><h3 className="mt-5 text-[18px] font-bold">Connections</h3></button>
      </div>
      <button onClick={() => setLocation('/post')} className="mt-5 flex w-full items-center gap-4 rounded-[24px] border border-black/[.07] bg-white p-5 text-left shadow-[0_7px_20px_rgba(0,0,0,.07)]" data-testid="button-become-owner-reference"><div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[hsl(var(--accent)/.55)] text-[hsl(var(--primary))]"><HousePlus size={28} strokeWidth={1.7} /></div><span className="flex-1"><b className="block text-[19px]">Become a host</b><span className="mt-1 block text-[15px] leading-snug text-black/55">It's easy to start hosting and<br className="sm:hidden" /> earn extra income.</span></span><ChevronRight className="text-black/50" /></button>
       <section className="mt-6 divide-y divide-black/[.08]">
         {row('Account', Settings, () => setLocation('/profile/settings'), 'button-profile-account')}
         {row('Personal information', UserRound, () => setToast('Personal information is ready to customize.'), 'button-profile-personal-information')}
         {row('My listings', HousePlus, () => setLocation('/post'), 'button-profile-my-listings')}
         {row('Bookings', CalendarDays, () => setLocation('/trips'), 'button-profile-bookings')}
         {row('Settings', Settings, () => setLocation('/profile/settings'), 'button-profile-settings')}
         {row('Notifications', Bell, notify, 'button-profile-notifications-settings')}
         {row('Help & support', CircleHelp, () => setLocation('/messages'), 'button-profile-help-support')}
         {row('Log out', DoorOpen, notify, 'button-profile-log-out')}
       </section>
       <div className="my-2 border-t border-black/[.08]" />
       <section className="divide-y divide-black/[.08]">
         {row('Refer a host', UsersRound, notify, 'button-refer-host')}
         {row('Find a co-host', HousePlus, notify, 'button-find-cohost')}
         {row('Legal', ReceiptText, notify, 'button-legal')}
       </section>
    </div>
    {toast && <Toast text={toast} onClose={() => setToast('')} />}
  </main>;
}

function ProfileExperiencePage() {
  const [toast, setToast] = useState('');
  const [, setLocation] = useLocation();
  const userName = readUserName();
  const notify = () => setToast('You are all caught up.');
  const row = (label: string, Icon: typeof Settings, action: () => void, testId: string) => <button onClick={action} key={label} className="flex w-full items-center gap-3 border-b border-black/[.08] py-3 text-left last:border-b-0" data-testid={testId}><span className="grid size-8 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><Icon size={17} strokeWidth={1.8} /></span><span className="flex-1 text-[14px] font-medium">{label}</span><ChevronRight size={18} className="text-black/45" /></button>;
  const profileRows = [
    ['Personal information', UserRound, () => setToast('Personal information is ready to customize.'), 'button-profile-overview-information'],
    ['Security', ShieldCheck, () => setLocation('/profile/settings'), 'button-profile-overview-security'],
    ['Preferences', Settings, () => setLocation('/profile/settings'), 'button-profile-overview-preferences'],
    ['Help & support', CircleHelp, () => setLocation('/messages'), 'button-profile-overview-help'],
  ] as const;
  const shortcuts = [
    ['Bookings', CalendarDays, '/trips'],
    ['Saved places', Heart, '/wishlist'],
    ['Inbox', MessageCircle, '/messages'],
    ['Payments', WalletCards, '/profile/settings'],
  ] as const;
  return <main className="min-h-[100dvh] bg-[hsl(var(--background))] px-5 pb-28 pt-5 md:mx-auto md:min-h-0 md:max-w-[940px] md:bg-transparent md:px-8 md:py-10">
    <section className="flex items-start justify-between" data-testid="section-profile-header">
      <div><h1 className="text-[28px] font-semibold tracking-[-.055em] md:font-display md:text-5xl">Profile</h1><p className="mt-1 text-[13px] text-black/55 md:text-sm">Manage your account</p></div>
      <button onClick={notify} className="relative grid size-11 place-items-center rounded-full bg-white shadow-[0_5px_16px_rgba(0,0,0,.08)]" aria-label="Notifications" data-testid="button-profile-overview-notifications"><Bell size={19} /><span className="absolute right-2.5 top-2 size-2 rounded-full bg-[hsl(var(--primary))]" /></button>
    </section>
    <section className="mt-5 rounded-[24px] border border-black/[.04] bg-white p-4 shadow-[0_5px_18px_rgba(22,28,35,.06)] md:p-7" data-testid="section-profile-card">
      <div className="flex items-center gap-4">
        <div className="relative grid size-[70px] shrink-0 place-items-center rounded-full border-4 border-white bg-[#d9dde1] text-[32px] font-bold text-[hsl(var(--primary))] shadow-sm md:size-24 md:text-4xl">{userName[0]}<button onClick={() => setToast('Profile photo editing is ready.')} className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-white text-[hsl(var(--primary))] shadow-sm" aria-label="Edit profile photo" data-testid="button-profile-edit-photo"><Pencil size={13} /></button></div>
        <div className="min-w-0 flex-1"><h2 className="truncate text-[23px] font-bold tracking-[-.04em] md:text-3xl">{userName}</h2><span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold text-[hsl(var(--primary))]"><Sparkles size={12} />Explorer</span><p className="mt-2 truncate text-[12px] text-black/55">{userName.toLowerCase().replaceAll(' ', '.')}@example.com</p></div>
        <button onClick={() => setLocation('/profile/settings')} className="grid size-10 shrink-0 place-items-center rounded-full bg-white/90 shadow-sm transition hover:-translate-y-0.5" aria-label="Open account settings" data-testid="button-profile-overview-settings"><ChevronRight size={20} /></button>
      </div>
    </section>
    <div className="mt-5 grid gap-4" data-testid="section-profile-host-promos">
      <button onClick={() => setLocation('/post')} className="group relative block aspect-[2.2] w-full overflow-hidden rounded-[24px] bg-white shadow-[0_5px_18px_rgba(22,28,35,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(22,28,35,.1)]" aria-label="Become a co-host" data-testid="button-profile-cohost">
        <img src={coHostCardReference} alt="Become Co-Host. It's easy to start hosting and earn extra income." className="size-full scale-[1.08] object-cover transition duration-300 group-hover:scale-[1.1]" />
        <span className="pointer-events-none absolute left-[43%] right-[4%] top-[63%] bottom-[12%] rounded-[14px] bg-white" aria-hidden="true" />
      </button>
      <button onClick={() => setLocation('/post')} className="group relative block aspect-[2.2] w-full overflow-hidden rounded-[24px] bg-white shadow-[0_5px_18px_rgba(22,28,35,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(22,28,35,.1)]" aria-label="List your place" data-testid="button-profile-list-place">
        <img src={listPlaceCardReference} alt="List your place. Share your space and start earning with AiroRent." className="size-full scale-[1.08] object-cover transition duration-300 group-hover:scale-[1.1]" />
        <span className="pointer-events-none absolute left-[43%] right-[4%] top-[63%] bottom-[12%] rounded-[14px] bg-white" aria-hidden="true" />
      </button>
    </div>
    <section className="mt-5" data-testid="section-profile-account">
      <p className="mb-2 px-1 text-[13px] text-black/55">Account</p>
      <div className="rounded-[24px] border border-black/[.04] bg-white px-3 shadow-[0_4px_16px_rgba(22,28,35,.05)]">{profileRows.map(([label, Icon, action, testId]) => row(label, Icon, action, testId))}</div>
    </section>
    <button onClick={() => setToast('Log out is ready to confirm.')} className="mt-4 flex w-full items-center gap-3 rounded-[24px] border border-black/[.04] bg-white px-3 py-3 text-left shadow-[0_4px_16px_rgba(22,28,35,.05)]" data-testid="button-profile-overview-logout"><span className="grid size-9 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><DoorOpen size={18} /></span><span className="flex-1 text-[15px] font-medium">Log Out</span><ChevronRight size={19} className="text-black/45" /></button>
    {toast && <Toast text={toast} onClose={() => setToast('')} />}
  </main>;
}

function AccountSettingsPage() {
  const [, setLocation] = useLocation();
  const [toast, setToast] = useState('');
  const settings = [
    ['Personal information', UserRound],
    ['Login & security', ShieldCheck],
    ['Privacy', Accessibility],
    ['Notifications', BellRing],
    ['Payments', WalletCards],
    ['Taxes', ReceiptText],
    ['Translation', Globe2],
    ['Booking permissions', KeyRound],
    ['Travel for work', BriefcaseBusiness],
    ['Accessibility', Accessibility],
  ] as const;
  return <main className="min-h-[100dvh] bg-white px-5 pb-10 pt-4 md:mx-auto md:min-h-0 md:max-w-[720px] md:bg-transparent md:px-8 md:py-12">
    <button onClick={() => setLocation('/profile')} className="grid size-12 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]" aria-label="Back to profile" data-testid="button-settings-back"><ArrowLeft size={23} /></button>
    <h1 className="mt-5 text-[39px] font-semibold tracking-[-.055em] md:font-display md:text-5xl">Account settings</h1>
    <section className="mt-8 divide-y divide-black/[.08]">
      {settings.map(([label, Icon]) => <button key={label} onClick={() => setToast(`${label} is ready to customize`)} className="flex w-full items-center gap-5 py-[17px] text-left" data-testid={`button-settings-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={27} strokeWidth={1.55} /><span className="flex-1 text-[17px]">{label}</span>{label === 'Booking permissions' && <span className="rounded-full bg-[hsl(var(--secondary))] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--primary))]">New</span>}<ChevronRight size={22} className="text-black/50" /></button>)}
    </section>
  <p className="mt-8 border-t border-black/[.08] pt-8 text-sm text-black/55">Version 1.0.0 · AiroRent</p>
    {toast && <Toast text={toast} onClose={() => setToast('')} />}
  </main>;
}

function PostPage() {
  const [step, setStep] = useState(1);
  const [transaction, setTransaction] = useState<Mode>('Rent');
  const [category, setCategory] = useState('Apartment');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [photoCount, setPhotoCount] = useState(2);
  const [features, setFeatures] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const next = () => setStep(Math.min(5, step + 1));
  const back = () => setStep(Math.max(1, step - 1));
  if (submitted) {
    localStorage.setItem('jakurzi:posted', JSON.stringify({ title, location, price, transaction, category }));
    return <main className="mx-auto flex max-w-[700px] flex-col items-center px-5 py-20 text-center"><div className="grid size-20 place-items-center rounded-[26px] bg-[hsl(var(--primary))] text-white shadow-soft"><Check size={35} /></div><p className="mt-7 text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Submitted for review</p><h1 className="mt-2 font-display text-5xl tracking-[-.05em]">A good start.</h1><p className="mt-4 max-w-md leading-relaxed text-[hsl(var(--muted-foreground))]">We’ll check the details and let you know when {title || 'your property'} is ready to meet its next person.</p><Link href="/" className="mt-8 rounded-full bg-[hsl(var(--foreground))] px-6 py-3 font-bold text-[hsl(var(--background))]" data-testid="link-submitted-home">Back to explore</Link></main>;
  }
  const titles = ['Start with the basics', 'Where is it?', 'Set your price', 'Make it feel real', 'Review and publish'];
  return <main className="mx-auto max-w-[1000px] px-5 py-8 lg:px-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">For owners & agents</p><h1 className="mt-1 font-display text-4xl tracking-[-.045em]">List a property</h1></div><Link href="/" className="grid size-10 place-items-center rounded-full border" data-testid="link-post-close"><X size={18} /></Link></div><div className="mt-8 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--muted))]"><div className="h-full rounded-full bg-[hsl(var(--primary))] transition-all" style={{ width: `${step * 20}%` }} /></div><div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]"><section><p className="text-sm font-bold text-[hsl(var(--primary))]">Step {step} of 5</p><h2 className="mt-1 font-display text-4xl">{titles[step - 1]}</h2>{step === 1 && <div className="mt-8 space-y-8"><div><label className="text-sm font-bold">What would you like to do?</label><div className="mt-3 grid gap-3 sm:grid-cols-3">{(['Rent', 'Buy', 'Short Let'] as Mode[]).map((item) => <button key={item} onClick={() => setTransaction(item)} className={`rounded-2xl border p-4 text-left font-bold ${transaction === item ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)]' : ''}`} data-testid={`button-post-${item.toLowerCase().replace(' ', '-')}`}><span className="mb-7 block text-[hsl(var(--primary))]">{item === 'Buy' ? <KeyRound /> : item === 'Rent' ? <Home /> : <Sparkles />}</span>{item}</button>)}</div></div><div><label className="text-sm font-bold">Property type</label><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{['Apartment', 'House', 'Studio', 'Villa'].map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-2xl border px-3 py-4 text-sm font-bold ${category === item ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)]' : ''}`} data-testid={`button-post-category-${item.toLowerCase()}`}>{item}</button>)}</div></div></div>}{step === 2 && <div className="mt-8 space-y-4"><label className="block text-sm font-bold">Property address<input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Street, town or village" className="mt-2 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 outline-none focus:border-[hsl(var(--primary))]" data-testid="input-post-location" /></label><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-[hsl(var(--secondary)/.55)] p-4"><MapPin className="text-[hsl(var(--primary))]" /><p className="mt-4 text-sm font-bold">Malta & Gozo only</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Your exact address stays private until a booking is confirmed.</p></div><div className="rounded-2xl border border-dashed border-[hsl(var(--border))] p-4"><Navigation className="text-[hsl(var(--primary))]" /><p className="mt-4 text-sm font-bold">Pin your location</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Help people understand the neighbourhood.</p></div></div></div>}{step === 3 && <div className="mt-8 space-y-5"><label className="block text-sm font-bold">Listing title<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A title people will remember" className="mt-2 w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 outline-none focus:border-[hsl(var(--primary))]" data-testid="input-post-title" /></label><label className="block text-sm font-bold">Price <span className="font-normal text-[hsl(var(--muted-foreground))]">({transaction === 'Buy' ? 'total' : 'per month'})</span><div className="mt-2 flex items-center rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4"><span className="font-bold">€</span><input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1,200" className="w-full bg-transparent p-4 outline-none" data-testid="input-post-price" /></div></label><div className="flex items-start gap-3 rounded-2xl bg-[hsl(var(--accent)/.28)] p-4 text-sm"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" /><p><b>Jakurzi Pay protection</b><br /><span className="text-xs text-[hsl(var(--muted-foreground))]">We will show this clearly to people viewing your listing.</span></p></div></div>}{step === 4 && <div className="mt-8"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><button onClick={() => setPhotoCount(photoCount + 1)} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.06)] text-sm font-bold" data-testid="button-post-add-photo"><Plus size={25} />Add photos <span className="text-xs font-normal">{photoCount} selected</span></button>{[images.deck, images.explore].slice(0, photoCount > 0 ? 2 : 0).map((image, index) => <div key={image} className="relative aspect-square overflow-hidden rounded-2xl"><img src={image} alt={`Property upload ${index + 1}`} className="size-full object-cover" /><button onClick={() => setPhotoCount(Math.max(0, photoCount - 1))} className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-[hsl(var(--card)/.9)]" data-testid={`button-post-remove-photo-${index}`}><X size={14} /></button></div>)}</div><h3 className="mt-8 font-bold">Features</h3><div className="mt-3 flex flex-wrap gap-2">{['Wifi', 'Balcony', 'Parking', 'Pool', 'Air conditioning', 'Pet friendly'].map((item) => <button key={item} onClick={() => setFeatures(features.includes(item) ? features.filter((feature) => feature !== item) : [...features, item])} className={`rounded-full border px-3.5 py-2 text-sm font-semibold hover:border-[hsl(var(--primary))] ${features.includes(item) ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]' : ''}`} data-testid={`button-feature-${item.toLowerCase().replace(' ', '-')}`}>{item}</button>)}</div></div>}{step === 5 && <div className="mt-8 overflow-hidden rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]"><img src={images.deck} alt="Listing preview" className="aspect-[2.2] w-full object-cover" /><div className="p-5"><p className="text-xs font-bold uppercase tracking-[.13em] text-[hsl(var(--primary))]">Preview</p><h3 className="mt-2 font-display text-3xl">{title || 'Your property title'}</h3><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{location || 'Malta'} · {category} · {transaction}</p><p className="mt-5 text-lg font-bold">{price ? `€${price}` : '€ —'} <span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">{transaction === 'Buy' ? 'total' : '/ month'}</span></p></div></div>}<div className="mt-10 flex justify-between border-t border-[hsl(var(--border))] pt-5"><button onClick={back} disabled={step === 1} className="rounded-full px-5 py-3 text-sm font-bold disabled:opacity-30" data-testid="button-post-back"><ChevronLeft size={17} className="mr-1 inline" />Back</button><button onClick={() => step === 5 ? setSubmitted(true) : next()} className="rounded-full bg-[hsl(var(--primary))] px-6 py-3 text-sm font-bold text-white" data-testid="button-post-next">{step === 5 ? 'Submit for review' : 'Continue'}<ChevronRight size={17} className="ml-1 inline" /></button></div></section><aside className="hidden rounded-[26px] bg-[hsl(var(--secondary)/.55)] p-5 lg:block"><ShieldCheck className="text-[hsl(var(--primary))]" /><h3 className="mt-6 font-display text-2xl">You’re in good hands.</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Listings are reviewed before they go live. We never ask you to pay to submit.</p><div className="mt-6 space-y-3 border-t border-[hsl(var(--border))] pt-5 text-xs font-bold"><p className="flex items-center gap-2"><Check size={15} className="text-[hsl(var(--primary))]" />Direct enquiries</p><p className="flex items-center gap-2"><Check size={15} className="text-[hsl(var(--primary))]" />Protected payments</p><p className="flex items-center gap-2"><Check size={15} className="text-[hsl(var(--primary))]" />Local support</p></div></aside></div></main>;
}

function AppRouter() {
  return <Shell><Switch><Route path="/" component={HomePage} /><Route path="/map" component={MapPage} /><Route path="/wishlist" component={WishlistPage} /><Route path="/trips" component={TripsPage} /><Route path="/messages" component={MessagesPage} /><Route path="/profile/settings" component={AccountSettingsPage} /><Route path="/profile" component={ProfileExperiencePage} /><Route path="/post" component={PostPage} /><Route path="/listing/:id">{(params) => <DetailPage id={params.id} />}</Route><Route><NotFound /></Route></Switch></Shell>;
}

function NotFound() {
  const [, setLocation] = useLocation();
  return <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center"><div className="grid size-16 place-items-center rounded-2xl bg-[hsl(var(--accent))]"><Home /></div><h1 className="mt-6 font-display text-4xl">That place is still being mapped.</h1><p className="mt-2 text-[hsl(var(--muted-foreground))]">Let’s get you back to the good stuff.</p><button onClick={() => setLocation('/')} className="mt-6 rounded-full bg-[hsl(var(--primary))] px-5 py-3 font-bold text-white" data-testid="button-not-found-home">Explore homes</button></main>;
}

export default AppRouter;