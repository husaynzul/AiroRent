import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import logoSrc from '@assets/file_0000000000148211841fa7f5697fcb2f_2_1788136018448.png';
import exploreReference from '@assets/Screenshot_20260830-080641_1788070712166.jpg';
import deckReference from '@assets/Screenshot_20260830-080650_1788070712237.jpg';
import mapReference from '@assets/Screenshot_20260830-081244_1788070712144.jpg';
import profileReference from '@assets/Screenshot_20260830-080806_1788070736616.jpg';
import datesReference from '@assets/Screenshot_20260830-080720_1788070712360.jpg';
import limestoneLoftImage from '@assets/generated_images/jakurzi-limestone-loft.jpg';
import seaviewTerraceImage from '@assets/generated_images/jakurzi-seaview-terrace.jpg';
import gozoFarmhouseImage from '@assets/generated_images/jakurzi-gozo-farmhouse.jpg';
import {
  ArrowLeft, ArrowRight, Bell, Building2, CalendarDays, Check,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, DoorOpen,
  Filter, Heart, Home, HousePlus, KeyRound, Layers3, ListFilter, LockKeyhole,
  MapPin, Menu, MessageCircle, Minus, Navigation, Pencil,
  Plus, Search, Send, Settings, ShieldCheck, SlidersHorizontal, Sparkles,
  Star, Tag, UserRound, UsersRound, WalletCards, X, Accessibility, BellRing,
  Globe2, ReceiptText, BriefcaseBusiness,
} from 'lucide-react';

type Mode = 'Rent' | 'Buy' | 'Short Let';
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
};
type SearchFilters = {
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
  garages: string;
  propertyType: string;
  location: string;
  verifiedOnly: boolean;
};

const defaultSearchFilters: SearchFilters = {
  minPrice: 'Any',
  maxPrice: 'Any',
  beds: 'Any',
  baths: 'Any',
  garages: 'Any',
  propertyType: 'Any',
  location: '',
  verifiedOnly: false,
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
  { id: 'harbour-loft', title: 'The Limestone Harbour Loft', location: 'Vittoriosa, South East', type: 'Apartment', mode: 'Short Let', price: '€145', detail: '2 beds · 1 bath · sleeps 4', image: images.limestone, rating: '4.92', tag: 'Guest favourite', verified: true },
  { id: 'seaview-sliema', title: 'Seaview apartment with terrace', location: 'Sliema, Central', type: 'Apartment', mode: 'Rent', price: '€1,280 / mo', detail: '2 beds · 2 baths · 98 m²', image: images.seaview, rating: '4.8', tag: 'New this week', verified: true },
  { id: 'garden-rabat', title: 'A quiet garden home near Rabat', location: 'Rabat, West', type: 'House', mode: 'Buy', price: '€685,000', detail: '3 beds · 2 baths · 164 m²', image: images.farmhouse, rating: '4.75', tag: 'Owner listed' },
  { id: 'gozo-stone', title: 'Sun-washed stone farmhouse', location: 'Xagħra, Gozo', type: 'House', mode: 'Short Let', price: '€210', detail: '4 beds · 3 baths · sleeps 8', image: images.farmhouse, rating: '4.97', tag: 'Guest favourite', verified: true },
  { id: 'msida-studio', title: 'Bright studio by the marina', location: 'Msida, Central', type: 'Studio', mode: 'Rent', price: '€850 / mo', detail: '1 bed · 1 bath · 46 m²', image: images.limestone, rating: '4.61' },
  { id: 'marsaxlokk-villa', title: 'Pool villa, close to the sea', location: 'Marsaxlokk, South East', type: 'Villa', mode: 'Buy', price: '€1,180,000', detail: '4 beds · 3 baths · 240 m²', image: images.seaview, rating: '4.88', tag: 'Price reduced', verified: true },
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
  const [location, setLocation] = useLocation();
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
  if (location.startsWith('/profile/settings')) return null;
  const items = [
    { href: '/', label: 'Explore', icon: Search },
    { href: '/wishlist', label: 'Wishlists', icon: Heart },
    { href: '/trips', label: 'Trips', icon: CalendarDays },
    { href: '/messages', label: 'Messages', icon: MessageCircle },
    { href: '/profile', label: 'Profile', icon: UserRound },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[hsl(var(--border))] bg-[hsl(var(--card)/.96)] px-3 pb-[max(9px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-md justify-between">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? location === '/' : location.startsWith(href);
          return <Link key={href} href={href} className={`flex min-w-[54px] flex-col items-center gap-1 text-[10px] font-semibold transition ${active ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} data-testid={`link-bottom-${label.toLowerCase()}`}>
            <span className={`grid size-8 place-items-center rounded-full ${active ? 'bg-[hsl(var(--primary)/.12)]' : ''}`}><Icon size={20} strokeWidth={active ? 2.5 : 1.8} /></span>{label}
          </Link>;
        })}
      </div>
    </nav>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="texture min-h-[100dvh] pb-20 md:pb-0"><Header onMenu={() => setMenuOpen(true)} />{children}<BottomNav />{menuOpen && <MenuSheet onClose={() => setMenuOpen(false)} />}</div>;
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
  return <article className={`group ${compact ? 'w-[220px] shrink-0' : ''}`} data-testid={`card-listing-${listing.id}`}>
    <div className="relative aspect-[1.12] overflow-hidden rounded-[22px] bg-[hsl(var(--muted))]">
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
  return <div className="bg-white md:hidden">
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

function MobileMarketplacePage({ mode, setMode, query, setQuery, category, setCategory, matches, saved, onSave, onOpenFilters, activeFilterCount }: { mode: Mode; setMode: (mode: Mode) => void; query: string; setQuery: (query: string) => void; category: string; setCategory: (category: string) => void; matches: Listing[]; saved: string[]; onSave: (id: string) => void; onOpenFilters: () => void; activeFilterCount: number }) {
  const [, setLocation] = useLocation();
  const propertyTabs = [
    ['All', Layers3],
    ['Apartments', Building2],
    ['Penthouses', Building2],
    ['Maisonettes', Home],
    ['Townhouses', Home],
    ['Villas', Sparkles],
    ['Studios', DoorOpen],
  ] as const;
  const userName = readUserName();
  const mobileListings = matches;
  const trendingListings = query ? matches.slice(0, 5) : listings.filter((item) => item.mode === mode).slice(0, 5);
  const popularRentals = listings.filter((item) => item.mode === 'Rent').slice(0, 5);
  const categoryCards = propertyTabs.filter(([label]) => label !== 'All');
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
  return <div className="bg-white md:hidden">
    <section className="px-5 pb-4 pt-4">
       <div className="mb-3">
         <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Good morning</p>
         <h1 className="mt-1 text-[24px] font-semibold tracking-[-.05em]">Hi, {userName}</h1>
       </div>
      <label className="flex h-12 w-full items-center gap-3 rounded-full border border-black/10 bg-[#fafafa] px-4 shadow-[0_5px_16px_rgba(0,0,0,.08)]">
        <Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search town, property or postcode" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/50" data-testid="input-mobile-market-search" /><button onClick={() => setLocation(`/?mode=${mode}&q=${encodeURIComponent(query)}`)} className="text-sm font-bold text-[hsl(var(--primary))]" data-testid="button-mobile-market-search">Search</button>
      </label>
      <div className="mt-4 flex gap-6 overflow-x-auto border-b border-black/[.08] pb-2">
        {(['Rent', 'Buy', 'Short Let'] as Mode[]).map((item) => <button key={item} onClick={() => setMode(item)} className={`shrink-0 pb-2 text-sm font-semibold ${mode === item ? 'border-b-2 border-black text-black' : 'text-black/50'}`} data-testid={`button-mobile-transaction-${item.toLowerCase().replace(' ', '-')}`}>{item}</button>)}
      </div>
    </section>
     <div className="flex items-center justify-between border-b border-black/[.08] px-5 py-3">
       <button onClick={onOpenFilters} className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold shadow-sm" data-testid="button-mobile-filters"><SlidersHorizontal size={15} />Filters</button>
       {activeFilterCount > 0 && <span className="text-[11px] font-semibold text-[hsl(var(--primary))]">{activeFilterCount} applied</span>}
     </div>
    <div className="space-y-7 px-5 pb-28 pt-5">
      <section aria-labelledby="mobile-top-categories">
        <div className="mb-3 flex items-center justify-between"><h2 id="mobile-top-categories" className="text-[20px] font-semibold tracking-[-.04em]">Top Categories</h2><span className="text-xs text-black/45">Browse all</span></div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {categoryCards.map(([label, Icon]) => <button key={label} onClick={() => setCategory(label)} className={`flex w-[116px] shrink-0 flex-col items-start rounded-2xl border p-3 text-left transition ${category === label ? 'border-[hsl(var(--primary))] bg-[hsl(var(--secondary))]' : 'border-black/[.08] bg-white'}`} data-testid={`card-mobile-top-category-${label.toLowerCase()}`}><span className="grid size-9 place-items-center rounded-xl bg-[hsl(var(--accent)/.65)] text-[hsl(var(--primary))]"><Icon size={19} /></span><span className="mt-3 text-xs font-semibold">{label}</span><span className="mt-1 text-[11px] text-black/45">{label === 'Villas' ? 'Sea views' : 'Popular homes'}</span></button>)}
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
          <div className="relative aspect-[1.34] overflow-hidden rounded-[24px] bg-[#f3f3f3]"><img src={item.image} alt={item.title} onClick={() => { saveRecent(item.id); setLocation(`/listing/${item.id}`); }} className="size-full cursor-pointer object-cover" /><span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold">{item.mode === 'Short Let' ? 'SHORT LET' : item.mode.toUpperCase()}</span><button onClick={() => onSave(item.id)} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full ${saved.includes(item.id) ? 'bg-[hsl(var(--primary))] text-white' : 'bg-white/95'}`} aria-label={saved.includes(item.id) ? 'Remove from wishlist' : 'Save listing'} data-testid={`button-mobile-market-save-${item.id}`}><Heart size={18} fill={saved.includes(item.id) ? 'currentColor' : 'none'} /></button></div>
          <button onClick={() => { saveRecent(item.id); setLocation(`/listing/${item.id}`); }} className="mt-3 block w-full text-left"><h3 className="line-clamp-1 text-[17px] font-semibold">{item.title}</h3><p className="mt-1 text-sm text-black/55">{item.type} · {item.location.split(',')[0]}</p><p className="mt-2 text-sm"><b>{item.price}</b>{item.mode === 'Short Let' ? ' / night' : ''} <span className="text-black/45"> · {item.detail}</span></p></button>
        </article>)}</div> : <EmptyState title="No properties found" body="Try another town, property type, or clear the filters." action="Clear search" onAction={() => { setQuery(''); setCategory('All'); }} />}
      </section>
    </div>
  </div>;
}

function numericAmount(value: string): number {
  return Number(value.replace(/[^\d]/g, '')) || 0;
}

function detailCount(detail: string, unit: 'beds' | 'baths' | 'garages'): number {
  const match = detail.match(new RegExp(`(\\d+)\\s+${unit.slice(0, -1)}s?`, 'i'));
  return match ? Number(match[1]) : 0;
}

function countActiveFilters(filters: SearchFilters): number {
  return Object.entries(filters).filter(([key, value]) => key === 'verifiedOnly' ? value === true : value !== 'Any' && value !== '').length;
}

function HomePage() {
  const [mode, setMode] = useState<Mode>('Rent');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>(readSaved);
  const [toast, setToast] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchFilters);
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
      .filter((item) => filters.minPrice === 'Any' || numericAmount(item.price) >= numericAmount(filters.minPrice))
      .filter((item) => filters.maxPrice === 'Any' || numericAmount(item.price) <= numericAmount(filters.maxPrice))
      .filter((item) => filters.beds === 'Any' || (filters.beds === '4+' ? detailCount(item.detail, 'beds') >= 4 : detailCount(item.detail, 'beds') === Number(filters.beds)))
      .filter((item) => filters.baths === 'Any' || (filters.baths === '3+' ? detailCount(item.detail, 'baths') >= 3 : detailCount(item.detail, 'baths') === Number(filters.baths)))
      .filter((item) => filters.garages === 'Any' || (filters.garages === '2+' ? detailCount(item.detail, 'garages') >= 2 : detailCount(item.detail, 'garages') === Number(filters.garages)))
      .filter((item) => filters.propertyType === 'Any' || item.type === filters.propertyType)
      .filter((item) => !filters.location || item.location.toLowerCase().includes(filters.location.toLowerCase()))
      .filter((item) => !filters.verifiedOnly || item.verified);
  }, [mode, query, category, filters]);
  const toggleSave = (id: string) => {
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    setSaved(next); localStorage.setItem('jakurzi:wishlist', JSON.stringify(next)); setToast(saved.includes(id) ? 'Removed from your wishlist' : 'Saved to your wishlist');
  };
  const recent = readRecent().map((id) => listings.find((item) => item.id === id)).filter(Boolean) as Listing[];
  return <main>
    <MobileMarketplacePage mode={mode} setMode={setMode} query={query} setQuery={setQuery} category={category} setCategory={setCategory} matches={matches} saved={saved} onSave={toggleSave} onOpenFilters={() => setFilterOpen(true)} activeFilterCount={countActiveFilters(filters)} />
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
        {matches.length ? <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{matches.map((item, index) => <div key={item.id} className="animate-rise" style={{ animationDelay: `${index * 55}ms` }}><ListingCard listing={item} saved={saved.includes(item.id)} onSave={toggleSave} /></div>)}</div> : <EmptyState title="No homes in this corner yet" body="Try another location or clear your category filter. Malta has a few more good corners." action="Clear filters" onAction={() => { setQuery(''); setCategory('All'); }} />}
      </section>
      <section className="mb-10 grid overflow-hidden rounded-[30px] bg-[hsl(var(--foreground))] text-[hsl(var(--background))] md:grid-cols-[1.15fr_.85fr]"><div className="p-7 md:p-12"><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--accent))]">The AiroRent promise</p><h2 className="mt-3 max-w-md font-display text-4xl leading-[1.02] tracking-[-.045em]">Good homes.<br />Clear moves.</h2><p className="mt-5 max-w-md text-sm leading-relaxed text-[hsl(var(--background)/.7)]">From your first message to the final payment, AiroRent Pay keeps the important moments protected. No guesswork, no awkward hand-offs.</p><Link href="/profile" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-white" data-testid="link-promise-profile">How it works <ArrowRight size={16} /></Link></div><div className="relative min-h-[220px] overflow-hidden bg-[hsl(var(--primary))]"><div className="absolute -right-10 -top-16 size-64 rounded-full border-[24px] border-[hsl(var(--accent)/.55)]" /><div className="absolute bottom-8 left-10 size-28 rounded-full border-[14px] border-[hsl(var(--background)/.16)]" /><div className="absolute bottom-10 right-12 rounded-2xl bg-[hsl(var(--card))] p-4 text-[hsl(var(--foreground))] shadow-lift"><ShieldCheck size={23} className="text-[hsl(var(--primary))]" /><p className="mt-2 text-sm font-bold">Money moments,<br />made safer.</p></div></div></section>
    </div>
    </div>
    {filterOpen && <FilterSheet mode={mode} filters={filters} onClose={() => setFilterOpen(false)} onApply={(next) => { setFilters(next); setFilterOpen(false); }} />}
    {toast && <Toast text={toast} onClose={() => setToast('')} />}
  </main>;
}

function FilterSheet({ mode, filters, onClose, onApply }: { mode: Mode; filters: SearchFilters; onClose: () => void; onApply: (filters: SearchFilters) => void }) {
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [beds, setBeds] = useState(filters.beds);
  const [baths, setBaths] = useState(filters.baths);
  const [garages, setGarages] = useState(filters.garages);
  const [propertyType, setPropertyType] = useState(filters.propertyType);
  const [location, setLocation] = useState(filters.location);
  const [verifiedOnly, setVerifiedOnly] = useState(filters.verifiedOnly);
  const choices = (items: string[], value: string, setter: (item: string) => void, prefix: string) => (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => <button key={item} onClick={() => setter(item)} className={`rounded-full border px-3.5 py-2 text-sm font-semibold ${value === item ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.1)] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))]'}`} data-testid={`button-${prefix}-${item.toLowerCase().replace('+', 'plus')}`}>{item}</button>)}
    </div>
  );
  const apply = () => onApply({ minPrice, maxPrice, beds, baths, garages, propertyType, location: location.trim(), verifiedOnly });
  const reset = () => {
    setMinPrice('Any'); setMaxPrice('Any'); setBeds('Any'); setBaths('Any'); setGarages('Any');
    setPropertyType('Any'); setLocation(''); setVerifiedOnly(false);
  };
  return <div className="fixed inset-0 z-50 flex items-end animate-fade bg-[hsl(var(--foreground)/.4)] p-4 backdrop-blur-sm md:items-start md:justify-center" onClick={onClose}>
    <div className="max-h-[calc(100dvh-32px)] w-full max-w-lg animate-rise overflow-y-auto rounded-[28px] bg-[hsl(var(--card))] p-6 shadow-lift md:mt-[12vh]" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.15em] text-[hsl(var(--primary))]">{mode}</p><h2 className="font-display text-3xl">Filters</h2></div>
        <button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-[hsl(var(--muted))]" aria-label="Close filters" data-testid="button-close-filters"><X size={18} /></button>
      </div>
      <div className="mt-6 space-y-5">
        <div><label className="text-sm font-bold">Price</label><div className="mt-2 grid grid-cols-2 gap-3">
          <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="rounded-xl border border-[hsl(var(--border))] bg-transparent px-3 py-3 text-sm" aria-label="Minimum price" data-testid="select-minimum-price"><option>Any</option><option>€500</option><option>€1,000</option><option>€2,000</option><option>€500,000</option></select>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="rounded-xl border border-[hsl(var(--border))] bg-transparent px-3 py-3 text-sm" aria-label="Maximum price" data-testid="select-maximum-price"><option>Any</option><option>€1,000</option><option>€2,000</option><option>€500,000</option><option>€2,000,000</option></select>
        </div></div>
        <div><label className="text-sm font-bold">Beds</label>{choices(['Any', '1', '2', '3', '4+'], beds, setBeds, 'beds')}</div>
        <div><label className="text-sm font-bold">Baths</label>{choices(['Any', '1', '2', '3+'], baths, setBaths, 'baths')}</div>
        <div><label className="text-sm font-bold">Garages</label>{choices(['Any', '1', '2+'], garages, setGarages, 'garages')}</div>
        <div><label className="text-sm font-bold" htmlFor="filter-property-type">Property type</label><select id="filter-property-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-transparent px-3 py-3 text-sm" data-testid="select-property-type"><option>Any</option><option>Apartment</option><option>House</option><option>Studio</option><option>Villa</option></select></div>
        <div><label className="text-sm font-bold" htmlFor="filter-location">Location</label><input id="filter-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Town or area" className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-transparent px-3 py-3 text-sm outline-none focus:border-[hsl(var(--primary))]" data-testid="input-filter-location" /></div>
        <button onClick={() => setVerifiedOnly((value) => !value)} className="flex w-full items-center justify-between rounded-2xl bg-[hsl(var(--secondary)/.55)] p-4 text-left" aria-pressed={verifiedOnly} data-testid="button-filter-verified">
          <div><p className="font-bold">Verified listings only</p><p className="text-xs text-[hsl(var(--muted-foreground))]">Owners and agents checked by AiroRent</p></div>
          <span className={`grid size-6 place-items-center rounded-full p-1 text-white ${verifiedOnly ? 'bg-[hsl(var(--primary))]' : 'border border-black/20 bg-white'}`}>{verifiedOnly && <Check size={16} />}</span>
        </button>
      </div>
      <div className="mt-7 flex items-center gap-3">
        <button onClick={reset} className="rounded-2xl border border-[hsl(var(--border))] px-4 py-3.5 text-sm font-bold" data-testid="button-reset-filters">Reset</button>
        <button onClick={apply} className="flex-1 rounded-2xl bg-[hsl(var(--primary))] py-3.5 font-bold text-white" data-testid="button-apply-filters">Apply Filters</button>
      </div>
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

function DetailPage({ id }: { id: string }) {
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

function ContactSheet({ listing, onClose, onSent }: { listing: Listing; onClose: () => void; onSent: () => void }) {
  const [message, setMessage] = useState(`Hi, I’m interested in ${listing.title}. Is it still available?`);
  return <div className="fixed inset-0 z-50 flex items-end animate-fade bg-[hsl(var(--foreground)/.4)] p-3 backdrop-blur-sm md:items-center md:justify-center" onClick={onClose}><div className="w-full max-w-md animate-rise rounded-[28px] bg-[hsl(var(--card))] p-6 shadow-lift" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[hsl(var(--primary))]">Direct to owner</p><h2 className="font-display text-3xl">Start a conversation</h2></div><button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-[hsl(var(--muted))]" data-testid="button-close-contact"><X size={18} /></button></div><div className="mt-5 rounded-2xl bg-[hsl(var(--secondary)/.55)] p-3 text-sm font-semibold">{listing.title}<p className="mt-1 text-xs font-normal text-[hsl(var(--muted-foreground))]">{listing.location}</p></div><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="mt-4 w-full resize-none rounded-2xl border border-[hsl(var(--border))] bg-transparent p-4 text-sm outline-none focus:border-[hsl(var(--primary))]" data-testid="textarea-contact-message" /><button onClick={onSent} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[hsl(var(--primary))] py-3.5 font-bold text-white" data-testid="button-send-message"><Send size={17} />Send message</button><p className="mt-3 text-center text-xs text-[hsl(var(--muted-foreground))]">Keep conversations and payments on Jakurzi for your peace of mind.</p></div></div>;
}

function WishlistPage() {
  const [saved, setSaved] = useState(readSaved);
  const [tab, setTab] = useState<'saved' | 'recent'>('saved');
  const [, setLocation] = useLocation();
  const items = (tab === 'saved' ? saved : readRecent()).map((id) => listings.find((item) => item.id === id)).filter(Boolean) as Listing[];
  const remove = (id: string) => { const next = saved.filter((x) => x !== id); setSaved(next); localStorage.setItem('jakurzi:wishlist', JSON.stringify(next)); };
  return <main className="mx-auto max-w-[1260px] px-5 py-9 lg:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Your shortlist</p><h1 className="mt-1 font-display text-5xl tracking-[-.05em]">Wishlist</h1><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Keep the places worth coming back to.</p></div><div className="flex rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-1"><button onClick={() => setTab('saved')} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'saved' ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : ''}`} data-testid="button-wishlist-saved">Saved ({saved.length})</button><button onClick={() => setTab('recent')} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === 'recent' ? 'bg-[hsl(var(--foreground))] text-[hsl(var(--background))]' : ''}`} data-testid="button-wishlist-recent">Recently viewed</button></div></div><div className="mt-9">{items.length ? <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <div key={item.id} className="relative"><ListingCard listing={item} saved={saved.includes(item.id)} onSave={remove} /></div>)}</div> : <EmptyState title={tab === 'saved' ? 'Your next favourite is out there' : 'Your trail starts here'} body={tab === 'saved' ? 'Tap the heart on any home that makes you pause. We will keep it close.' : 'Open a listing and we will remember it here while you compare.'} action="Explore homes" onAction={() => setLocation('/')} />}</div></main>;
}

function TripsPage() {
  const [tab, setTab] = useState('Bookings');
  const [, setLocation] = useLocation();
  return <main className="mx-auto max-w-[920px] px-5 py-9 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Your plans</p><h1 className="mt-1 font-display text-5xl tracking-[-.05em]">Trips</h1><div className="mt-7 flex gap-2 border-b border-[hsl(var(--border))]">{['Bookings', 'Offers', 'Deals'].map((item) => <button key={item} onClick={() => setTab(item)} className={`border-b-2 px-3 py-3 text-sm font-bold ${tab === item ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : 'border-transparent text-[hsl(var(--muted-foreground))]'}`} data-testid={`button-trips-${item.toLowerCase()}`}>{item}</button>)}</div>{tab === 'Bookings' ? <div className="mt-8 grid gap-5 md:grid-cols-[1fr_.8fr]"><div className="overflow-hidden rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]"><img src={images.deck} alt="Upcoming stay" className="aspect-[2.2] w-full object-cover" /><div className="p-5"><span className="rounded-full bg-[hsl(var(--accent)/.45)] px-3 py-1 text-xs font-bold">Upcoming · Aug 12–16</span><h2 className="mt-4 font-display text-3xl">Your Malta stay</h2><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">The Limestone Harbour Loft · Vittoriosa</p><div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--border))] pt-4 text-sm"><span className="flex items-center gap-2 font-bold"><ShieldCheck size={16} className="text-[hsl(var(--primary))]" />Jakurzi Pay protected</span><button onClick={() => setLocation('/listing/harbour-loft')} className="font-bold underline" data-testid="button-trip-details">Details</button></div></div></div><div className="rounded-[26px] bg-[hsl(var(--secondary)/.55)] p-6"><WalletCards className="text-[hsl(var(--primary))]" /><h3 className="mt-6 font-display text-2xl">A clear trip, start to finish.</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Bookings, messages, payment milestones and check-in notes live together here.</p><Link href="/messages" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))]" data-testid="link-trip-messages">Open messages <ArrowRight size={15} /></Link></div></div> : <div className="mt-8"><EmptyState title={`No ${tab.toLowerCase()} yet`} body={tab === 'Offers' ? 'When you make an offer on a home, the full paper trail will be here.' : 'Good deals come to people who keep looking. Start with a search.'} action="Explore homes" onAction={() => setLocation('/')} /></div>}</main>;
}

function MessagesPage() {
  const [sent, setSent] = useState(false);
  return <main className="mx-auto max-w-[1060px] px-5 py-9 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Keep it on Jakurzi</p><h1 className="mt-1 font-display text-5xl tracking-[-.05em]">Messages</h1><div className="mt-8 grid min-h-[520px] overflow-hidden rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] md:grid-cols-[280px_1fr]"><aside className="border-b border-[hsl(var(--border))] p-4 md:border-b-0 md:border-r"><div className="flex items-center justify-between px-2"><h2 className="font-bold">Inbox</h2><button className="grid size-8 place-items-center rounded-full bg-[hsl(var(--muted))]" data-testid="button-message-filter"><ListFilter size={15} /></button></div><button onClick={() => setSent(false)} className={`mt-4 flex w-full gap-3 rounded-2xl p-3 text-left ${!sent ? 'bg-[hsl(var(--secondary))]' : ''}`} data-testid="button-inquiry-thread"><div className="grid size-10 shrink-0 place-items-center rounded-full bg-[hsl(var(--accent))] font-bold">M</div><div className="min-w-0"><p className="text-sm font-bold">Maria Camilleri</p><p className="truncate text-xs text-[hsl(var(--muted-foreground))]">The Limestone Harbour Loft</p></div><span className="ml-auto text-[10px] text-[hsl(var(--muted-foreground))]">Tue</span></button></aside><section className="flex flex-col"><div className="flex items-center gap-3 border-b border-[hsl(var(--border))] p-4"><div className="grid size-9 place-items-center rounded-full bg-[hsl(var(--accent))] font-bold">M</div><div><p className="text-sm font-bold">Maria Camilleri</p><p className="text-xs text-[hsl(var(--muted-foreground))]">Usually replies within an hour</p></div><ShieldCheck size={17} className="ml-auto text-[hsl(var(--primary))]" /></div><div className="flex flex-1 flex-col justify-end gap-3 p-5"><div className="mx-auto max-w-sm rounded-2xl bg-[hsl(var(--secondary)/.55)] p-4 text-center text-sm leading-relaxed text-[hsl(var(--muted-foreground))]"><LockKeyhole size={18} className="mx-auto mb-2 text-[hsl(var(--primary))]" />Keep your conversation here. Jakurzi Pay only protects payments made on-platform.</div><div className="max-w-[75%] self-start rounded-2xl rounded-bl-sm bg-[hsl(var(--muted))] p-3 text-sm">Hi there — thanks for your interest. What dates were you thinking?</div>{sent && <div className="max-w-[75%] self-end rounded-2xl rounded-br-sm bg-[hsl(var(--primary))] p-3 text-sm text-white">Hi Maria, I’m looking at August 12–16. Is the loft still available?</div>}</div><div className="flex gap-2 border-t border-[hsl(var(--border))] p-4"><input placeholder="Write a message..." className="min-w-0 flex-1 rounded-full bg-[hsl(var(--muted))] px-4 text-sm outline-none" data-testid="input-message" /><button onClick={() => setSent(true)} className="grid size-11 shrink-0 place-items-center rounded-full bg-[hsl(var(--primary))] text-white" data-testid="button-send-inquiry"><Send size={17} /></button></div></section></div></main>;
}

function ProfilePage() {
  const [role, setRole] = useState<'Guest' | 'Owner'>('Guest');
  const [, setLocation] = useLocation();
  return <main className="mx-auto max-w-[940px] px-5 py-9 lg:px-8"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[hsl(var(--primary))]">Your space</p><h1 className="mt-1 font-display text-5xl tracking-[-.05em]">Profile</h1></div><button className="grid size-11 place-items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]" data-testid="button-profile-notifications"><Bell size={19} /></button></div><div className="mt-8 rounded-[28px] bg-[hsl(var(--foreground))] p-7 text-[hsl(var(--background))] shadow-soft md:p-9"><div className="flex flex-col items-center text-center md:flex-row md:items-center md:gap-6 md:text-left"><div className="grid size-24 place-items-center rounded-full bg-[hsl(var(--accent))] font-display text-4xl text-[hsl(var(--foreground))]">H</div><div className="mt-4 md:mt-0"><h2 className="font-display text-4xl">Husnain</h2><p className="mt-1 text-sm text-[hsl(var(--background)/.65)]">{role} on Jakurzi · Malta</p></div><button onClick={() => setRole(role === 'Guest' ? 'Owner' : 'Guest')} className="mt-5 flex items-center gap-2 rounded-full border border-[hsl(var(--background)/.25)] px-4 py-2 text-xs font-bold md:ml-auto md:mt-0" data-testid="button-switch-role"><ArrowRight size={14} />Switch to {role === 'Guest' ? 'owner' : 'guest'}</button></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><button onClick={() => setLocation('/trips')} className="group rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-soft" data-testid="button-profile-trips"><CalendarDays className="text-[hsl(var(--primary))]" /><h3 className="mt-8 font-display text-2xl">Past trips</h3><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Your stays and memories</p><ArrowRight size={17} className="mt-4 transition group-hover:translate-x-1" /></button><button onClick={() => setLocation('/messages')} className="group rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-soft" data-testid="button-profile-connections"><UsersRound className="text-[hsl(var(--primary))]" /><h3 className="mt-8 font-display text-2xl">Connections</h3><p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Owners and people you trust</p><ArrowRight size={17} className="mt-4 transition group-hover:translate-x-1" /></button></div><button onClick={() => setLocation('/post')} className="mt-5 flex w-full items-center gap-4 rounded-[24px] border border-[hsl(var(--primary)/.25)] bg-[hsl(var(--secondary)/.6)] p-5 text-left transition hover:border-[hsl(var(--primary))]" data-testid="button-become-owner"><span className="grid size-12 place-items-center rounded-2xl bg-[hsl(var(--primary))] text-white"><HousePlus size={23} /></span><span className="flex-1"><b className="block text-lg">Become an owner</b><span className="text-sm text-[hsl(var(--muted-foreground))]">Share your place and make the next move easier.</span></span><ChevronRight size={19} /></button><div className="mt-8 divide-y divide-[hsl(var(--border))] rounded-[24px] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-5"><button className="flex w-full items-center gap-4 py-5 text-left" data-testid="button-account-settings"><Settings size={20} /><span className="flex-1 font-bold">Account settings</span><ChevronRight size={18} className="text-[hsl(var(--muted-foreground))]" /></button><button className="flex w-full items-center gap-4 py-5 text-left" data-testid="button-payment-settings"><WalletCards size={20} /><span className="flex-1 font-bold">Jakurzi Pay & payment</span><ChevronRight size={18} className="text-[hsl(var(--muted-foreground))]" /></button><button className="flex w-full items-center gap-4 py-5 text-left" data-testid="button-help"><CircleHelp size={20} /><span className="flex-1 font-bold">Help centre</span><ChevronRight size={18} className="text-[hsl(var(--muted-foreground))]" /></button></div></main>;
}

function ProfileExperiencePage() {
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