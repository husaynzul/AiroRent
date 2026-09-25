import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Bell,
  CarFront,
  CalendarDays,
  Clock3,
  type LucideIcon,
  ChevronDown,
  Heart,
  Home,
  MapPin,
  Mountain,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  X,
} from 'lucide-react';
import apartmentImage from '@assets/property-apartment-card.png';
import penthouseImage from '@assets/property-penthouse-card.png';
import villaImage from '@assets/property-villa-card.png';
import loftImage from '@assets/property-duplex-card.png';

export type RentalScreenListing = {
  id: string;
  title: string;
  location: string;
  type: string;
  mode: 'Rent' | 'Buy' | 'Short Let';
  price: string;
  detail: string;
  image: string;
  rating: string;
  tag?: string;
  duration?: 'Hourly' | 'Daily' | 'Monthly' | 'Yearly';
};

type RentalFilters = {
  propertyType: string;
  duration: 'Hourly' | 'Daily' | 'Monthly' | 'Yearly' | 'Any';
  minPrice: number;
  maxPrice: number;
};

const defaultRentalFilters: RentalFilters = {
  propertyType: 'Apartment',
  duration: 'Daily',
  minPrice: 500,
  maxPrice: 3000,
};

const categoryOptions = [
  { label: 'Apartment', image: apartmentImage, count: '120+' },
  { label: 'Penthouse', image: penthouseImage, count: '48+' },
  { label: 'Villa', image: villaImage, count: '75+' },
  { label: 'Loft', image: loftImage, count: '36+' },
] as const;

export type MarketplaceCategory =
  | 'Homes'
  | 'Cars'
  | 'Services'
  | 'Adventures'
  | 'Events'
  | 'Experiences';

const marketplaceCategories: Array<{
  label: MarketplaceCategory;
  icon: LucideIcon;
}> = [
  { label: 'Homes', icon: Home },
  { label: 'Cars', icon: CarFront },
  { label: 'Services', icon: Sparkles },
  { label: 'Adventures', icon: Mountain },
  { label: 'Events', icon: CalendarDays },
  { label: 'Experiences', icon: Star },
];

const marketplaceSubcategories: Record<MarketplaceCategory, string[]> = {
  Homes: ['Apartment', 'Penthouse', 'Villa', 'House', 'Farmhouse', 'Room'],
  Cars: ['Economy', 'SUV', 'Luxury', 'Sports Cars', 'Electric', 'Bikes'],
  Services: ['Cleaning', 'Chef', 'Photography', 'Beauty', 'Fitness', 'Massage'],
  Adventures: ['Hiking', 'Camping', 'Safari', 'Water Sports', 'Paragliding'],
  Events: ['Concerts', 'Festivals', 'Sports', 'Parties', 'Weddings'],
  Experiences: ['Food Tours', 'City Tours', 'Workshops', 'Cultural', 'Cooking'],
};

const durationOptions = ['Hourly', 'Daily', 'Monthly', 'Yearly'] as const;

function priceAmount(listing: RentalScreenListing) {
  return Number(listing.price.replace(/[^\d]/g, '')) || 0;
}

function rentalDuration(listing: RentalScreenListing): RentalFilters['duration'] {
  return listing.duration ?? (listing.mode === 'Short Let' ? 'Daily' : 'Monthly');
}

function getFilteredRentals(
  listings: RentalScreenListing[],
  filters: RentalFilters,
  query = '',
) {
  const normalizedQuery = query.trim().toLowerCase();
  return listings.filter((listing) => {
    const searchableText = `${listing.title} ${listing.location} ${listing.type}`.toLowerCase();
    const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
    const matchesType = filters.propertyType === 'Any' || listing.type === filters.propertyType;
    const matchesDuration = filters.duration === 'Any' || rentalDuration(listing) === filters.duration;
    const amount = priceAmount(listing);
    const matchesPrice = amount >= filters.minPrice && amount <= filters.maxPrice;
    return matchesQuery && matchesType && matchesDuration && matchesPrice;
  });
}

function CategoryIllustration({ image, label }: { image: string; label: string }) {
  return (
    <div className="flex h-[77px] items-start justify-center overflow-hidden">
      <img
        src={image}
        alt=""
        className="h-[112px] w-full object-cover object-top"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

function HomeRentalCard({
  listing,
  saved,
  onSave,
}: {
  listing: RentalScreenListing;
  saved: boolean;
  onSave: (id: string) => void;
}) {
  const [, setLocation] = useLocation();
  return (
    <article className="overflow-hidden rounded-[11px] border border-[#dedfe1] bg-white shadow-[0_3px_9px_rgba(0,0,0,.12)]">
      <div className="relative aspect-[3.55] overflow-hidden bg-[#dce3e8]">
        <button
          type="button"
          className="absolute inset-0 size-full"
          onClick={() => setLocation(`/listing/${listing.id}`)}
          aria-label={`View ${listing.title}`}
        >
          <img src={listing.image} alt={listing.title} className="size-full object-cover" />
        </button>
        <span className="absolute left-2.5 top-2.5 rounded-[5px] bg-[#d6f0db] px-2 py-1 text-[10px] font-medium text-[#1c3823]">
          {listing.tag || 'New this week'}
        </span>
        <button
          type="button"
          onClick={() => onSave(listing.id)}
          className="absolute right-2.5 top-2 grid size-8 place-items-center rounded-full bg-white text-[#1c2025] shadow-sm"
          aria-label={saved ? 'Remove from wishlist' : 'Save listing'}
        >
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="px-2.5 pb-2.5 pt-2">
        <button
          type="button"
          className="block max-w-full truncate text-left text-[14px] font-semibold"
          onClick={() => setLocation(`/listing/${listing.id}`)}
        >
          {listing.title}
        </button>
        <p className="mt-1 truncate text-[10px] text-[#51565d]">
          <MapPin className="mr-0.5 inline size-3 align-[-2px]" />
          {listing.location} · {listing.detail.replaceAll(' · ', ' · ')}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="text-[15px] font-bold">{listing.price}{listing.mode === 'Short Let' ? ' / night' : ''}</p>
          <button
            type="button"
            onClick={() => setLocation(`/listing/${listing.id}`)}
            className="flex h-7 shrink-0 items-center gap-1 rounded-[5px] bg-[#171a20] px-2.5 text-[11px] font-medium text-white"
          >
            Rent now <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

function MarketplaceCategoryShortcut({
  category,
  active,
  onSelect,
}: {
  category: { label: MarketplaceCategory; icon: LucideIcon };
  active?: boolean;
  onSelect: (category: MarketplaceCategory) => void;
}) {
  const Icon = category.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(category.label)}
      className={`flex w-[62px] shrink-0 flex-col items-center gap-1.5 text-center text-[10px] font-medium ${
        active ? 'text-[#171a20]' : 'text-[#51565d]'
      }`}
      aria-pressed={active}
      data-testid={`button-marketplace-category-${category.label.toLowerCase()}`}
    >
      <span className={`grid size-[40px] place-items-center rounded-[11px] border ${
        active
          ? 'border-[#171a20] bg-[#171a20] text-white shadow-[0_3px_8px_rgba(0,0,0,.15)]'
          : 'border-[#dedfe1] bg-white text-[#3e444b] shadow-[0_2px_7px_rgba(0,0,0,.08)]'
      }`}>
        <Icon size={20} strokeWidth={active ? 2.1 : 1.8} />
      </span>
      <span className="truncate">{category.label}</span>
    </button>
  );
}

export function ReferenceHomeScreen({
  rentals,
  query,
  setQuery,
  saved,
  onSave,
  onOpenExistingFilters,
  onSelectCategory,
}: {
  rentals: RentalScreenListing[];
  query: string;
  setQuery: (query: string) => void;
  saved: string[];
  onSave: (id: string) => void;
  onOpenExistingFilters: () => void;
  onSelectCategory?: (category: MarketplaceCategory) => void;
}) {
  const [, setLocation] = useLocation();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const featuredRentals = rentals.filter((listing) => listing.mode === 'Rent').slice(0, 2);
  const homeCategories = [
    { label: 'Apartment', image: apartmentImage, count: '120+' },
    { label: 'Penthouse', image: penthouseImage, count: '48+' },
    { label: 'Villa', image: villaImage, count: '75+' },
    { label: 'House', image: villaImage, count: '95+' },
    { label: 'Farmhouse', image: loftImage, count: '25+' },
    { label: 'Room', image: apartmentImage, count: '60+' },
  ];
  const visibleCategories = showAllCategories ? homeCategories : homeCategories.slice(0, 3);

  const goToRentals = () => {
    const suffix = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
    setLocation(`/popular-rentals${suffix}`);
  };
  const selectCategory = (category: MarketplaceCategory) => {
    if (onSelectCategory) {
      onSelectCategory(category);
      return;
    }
    setLocation(`/popular-rentals?category=${encodeURIComponent(category)}`);
  };

  return (
    <main className="mx-auto min-h-[100dvh] max-w-[520px] bg-[#f6f6f7] pb-28 text-[#161a20] md:hidden">
      <header className="sticky top-0 z-30 bg-[#f6f6f7]/95 px-5 pb-3 pt-[max(7px,env(safe-area-inset-top))] backdrop-blur-lg">
        <div className="flex h-9 items-center justify-between">
          <button type="button" className="flex min-w-0 items-center gap-2 text-left" aria-label="Current location">
            <MapPin className="size-[19px] shrink-0" strokeWidth={1.8} />
            <span className="truncate text-[16px] font-medium">Islamabad, Pakistan</span>
            <ChevronDown className="size-4 shrink-0 text-[#5b6067]" />
          </button>
          <button type="button" className="relative grid size-9 shrink-0 place-items-center rounded-[10px] bg-[#eceef0]" aria-label="Notifications">
            <Bell size={20} strokeWidth={1.8} />
            <span className="absolute right-[7px] top-[6px] size-1.5 rounded-full bg-[#ee6478]" />
          </button>
        </div>
        <form
          className="mt-3 flex h-[43px] items-center gap-2.5 rounded-[12px] border border-[#dcdee1] bg-[#f0f1f2] px-3"
          onSubmit={(event) => {
            event.preventDefault();
            goToRentals();
          }}
        >
          <Search size={19} className="shrink-0 text-[#4d535a]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for rentals..."
            aria-label="Search for rentals"
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#747980]"
          />
          <button
            type="button"
            onClick={onOpenExistingFilters}
            className="grid size-[30px] shrink-0 place-items-center rounded-[7px] bg-[#171a20] text-white"
            aria-label="Open property filters"
            data-testid="button-home-original-filters"
          >
            <SlidersHorizontal size={18} />
          </button>
        </form>
      </header>

      <div className="space-y-6 px-5 pb-2 pt-5">
        <section aria-label="Marketplace categories" className="-mx-1 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto px-1 pb-1">
            {marketplaceCategories.map((category) => (
              <MarketplaceCategoryShortcut
                key={category.label}
                category={category}
                active={category.label === 'Homes'}
                onSelect={selectCategory}
              />
            ))}
          </div>
        </section>

        <section aria-labelledby="reference-categories">
          <div className="mb-2 flex items-center justify-between">
            <h2 id="reference-categories" className="text-[15px] font-medium">Top Categories</h2>
            <button
              type="button"
              className="flex items-center gap-1 text-[12px] font-medium"
              onClick={() => setShowAllCategories((current) => !current)}
              aria-expanded={showAllCategories}
              data-testid="button-home-see-all-categories"
            >
              {showAllCategories ? 'Show less' : 'See all'} <ArrowRight size={13} />
            </button>
          </div>
          <div className={`grid ${showAllCategories ? 'grid-cols-3' : 'grid-cols-3'} gap-2`}>
            {visibleCategories.map((category) => (
              <button
                key={category.label}
                type="button"
                onClick={() => setLocation(`/popular-rentals?type=${encodeURIComponent(category.label)}`)}
                className="min-w-0 overflow-hidden rounded-[11px] border border-[#dedfe1] bg-white pb-2 text-center shadow-[0_2px_7px_rgba(0,0,0,.08)]"
                data-testid={`button-home-category-${category.label.toLowerCase()}`}
              >
                <CategoryIllustration image={category.image} label={category.label} />
                <span className="block truncate px-1 text-[12px] font-medium">{category.label}</span>
                <span className="mt-0.5 block text-[10px] text-[#51565d]">{category.count} listings</span>
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="reference-trending">
          <div className="mb-2 flex items-center justify-between">
            <h2 id="reference-trending" className="text-[15px] font-medium">Trending Now</h2>
            <button
              type="button"
              onClick={goToRentals}
              className="flex items-center gap-1 text-[12px] font-medium"
              data-testid="button-home-see-all-trending"
            >
              See all <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-4">
            {featuredRentals.map((listing) => (
              <HomeRentalCard
                key={listing.id}
                listing={listing}
                saved={saved.includes(listing.id)}
                onSave={onSave}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultsCard({
  listing,
  saved,
  onSave,
}: {
  listing: RentalScreenListing;
  saved: boolean;
  onSave: (id: string) => void;
}) {
  const [, setLocation] = useLocation();
  const [beds, baths] = listing.detail.match(/\d+\s*beds?|\d+\s*baths?/gi) ?? [];
  const shortPrice = listing.mode === 'Short Let' ? `${listing.price} / night` : listing.price;
  return (
    <article className="min-w-0 overflow-hidden rounded-[12px] border border-[#e0e1e3] bg-white shadow-[0_3px_12px_rgba(0,0,0,.1)]">
      <div className="relative aspect-[1.72] overflow-hidden bg-[#dfe5e9]">
        <button
          type="button"
          className="absolute inset-0 size-full"
          onClick={() => setLocation(`/listing/${listing.id}`)}
          aria-label={`View ${listing.title}`}
        >
          <img src={listing.image} alt={listing.title} className="size-full object-cover" />
        </button>
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-[5px] bg-[#edf3eb] px-1.5 py-1 text-[9px] leading-none text-[#33433a]">
          <Sparkles size={10} /> New this week
        </span>
        <button
          type="button"
          onClick={() => onSave(listing.id)}
          className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-white/95 text-[#161a20]"
          aria-label={saved ? 'Remove from wishlist' : 'Save listing'}
          data-testid={`button-popular-save-${listing.id}`}
        >
          <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="px-2.5 pb-2.5 pt-2">
        <p className="text-[14px] font-semibold leading-tight">{shortPrice}</p>
        <button
          type="button"
          className="mt-1 block w-full truncate text-left text-[14px] font-medium leading-tight"
          onClick={() => setLocation(`/listing/${listing.id}`)}
        >
          {listing.title}
        </button>
        <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-[#555b62]">
          <MapPin size={12} className="shrink-0" /> {listing.location}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#32373d]">
          <span className="flex items-center gap-1"><Star size={12} /> {listing.rating}</span>
          {beds && <span className="flex items-center gap-1"><BedDouble size={12} /> {beds}</span>}
          {baths && <span className="flex items-center gap-1"><Bath size={12} /> {baths}</span>}
        </div>
      </div>
    </article>
  );
}

function PriceSlider({
  minimum,
  maximum,
  onChange,
}: {
  minimum: number;
  maximum: number;
  onChange: (minimum: number, maximum: number) => void;
}) {
  const scaleMaximum = 4000;
  const left = (minimum / scaleMaximum) * 100;
  const width = ((maximum - minimum) / scaleMaximum) * 100;
  return (
    <div className="relative mt-3 h-6">
      <div className="absolute left-0 right-0 top-[10px] h-[5px] rounded-full bg-[#d4d5d7]" />
      <div
        className="absolute top-[10px] h-[5px] rounded-full bg-[#171a20]"
        style={{ left: `${left}%`, width: `${width}%` }}
      />
      <input
        aria-label="Minimum price"
        type="range"
        min={0}
        max={scaleMaximum}
        step={50}
        value={minimum}
        onChange={(event) => onChange(Math.min(Number(event.target.value), maximum - 50), maximum)}
        className="rental-price-thumb absolute inset-0 z-[2] h-6 w-full"
      />
      <input
        aria-label="Maximum price"
        type="range"
        min={0}
        max={scaleMaximum}
        step={50}
        value={maximum}
        onChange={(event) => onChange(minimum, Math.max(Number(event.target.value), minimum + 50))}
        className="rental-price-thumb absolute inset-0 z-[3] h-6 w-full"
      />
    </div>
  );
}

function PopularRentalsFilterSheet({
  listings,
  query,
  initialFilters,
  onClose,
  onApply,
}: {
  listings: RentalScreenListing[];
  query: string;
  initialFilters: RentalFilters;
  onClose: () => void;
  onApply: (filters: RentalFilters) => void;
}) {
  const [draft, setDraft] = useState<RentalFilters>(initialFilters);
  const previewCount = getFilteredRentals(listings, draft, query).length;
  const setPriceRange = (minPrice: number, maxPrice: number) => {
    setDraft((current) => ({ ...current, minPrice, maxPrice }));
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#09101d]/50 backdrop-blur-[1px]"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="flex max-h-[47dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[25px] bg-white px-5 pb-[max(9px,env(safe-area-inset-bottom))] pt-2 text-[#17191e] shadow-[0_-8px_28px_rgba(0,0,0,.2)] animate-rise"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popular-filter-title"
      >
        <div className="mx-auto mb-2 h-[5px] w-10 rounded-full bg-[#d6d7d8]" />
        <header className="relative flex h-8 items-center justify-center">
          <h2 id="popular-filter-title" className="text-[20px] font-semibold">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="absolute right-0 grid size-8 place-items-center rounded-full bg-[#f2f3f4]"
            data-testid="button-close-popular-filters"
          >
            <X size={17} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto pb-1 pt-0">
          <section>
            <h3 className="text-[17px] font-semibold">Property Type</h3>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {categoryOptions.map(({ label, image }) => {
                const selected = draft.propertyType === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, propertyType: selected ? 'Any' : label }))}
                    className={`min-w-0 text-center ${selected ? 'text-[#17191e]' : 'text-[#353941]'}`}
                    aria-pressed={selected}
                    data-testid={`button-popular-type-${label.toLowerCase()}`}
                  >
                <span className={`block overflow-hidden rounded-[12px] bg-[#f1f2f3] transition ${selected ? 'border-2 border-[#161a20]' : 'border border-transparent'}`}>
                      <span className="block h-[52px] overflow-hidden">
                        <img src={image} alt="" className="h-[100px] w-full object-cover object-top" />
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-[11px]">{label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-2">
            <h3 className="text-[17px] font-semibold">Rental Duration</h3>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {durationOptions.map((duration) => {
                const selected = draft.duration === duration;
                return (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, duration }))}
                    className="min-w-0 text-center"
                    aria-pressed={selected}
                    data-testid={`button-popular-duration-${duration.toLowerCase()}`}
                  >
                    <span className={`grid h-[52px] place-items-center rounded-[12px] border text-[25px] shadow-[0_2px_8px_rgba(0,0,0,.08)] ${selected ? 'border-[#191c22] bg-[#191c22] text-white' : 'border-[#ededee] bg-[#f3f4f4] text-[#c7b6aa]'}`}>
                      {duration === 'Hourly' && <Clock3 size={31} strokeWidth={1.4} />}
                      {duration !== 'Hourly' && <CalendarDays size={31} strokeWidth={1.4} />}
                    </span>
                    <span className="mt-1 block text-[11px]">{duration}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-2">
            <h3 className="text-[18px] font-semibold">Price Range</h3>
            <div className="mt-0.5 flex items-center justify-between gap-2 text-[15px] font-medium">
              <span>€{draft.minPrice.toLocaleString()} — €{draft.maxPrice.toLocaleString()}</span>
              <span className="text-[13px] font-normal text-[#767b81]">Per month</span>
            </div>
            <PriceSlider minimum={draft.minPrice} maximum={draft.maxPrice} onChange={setPriceRange} />
          </section>
        </div>

        <footer className="grid grid-cols-2 gap-3 border-t border-[#ececee] pt-2">
          <button
            type="button"
            onClick={() => setDraft({ propertyType: 'Any', duration: 'Any', minPrice: 0, maxPrice: 4000 })}
            className="h-[40px] rounded-full border border-[#c9cbd0] bg-white text-[14px] font-semibold"
            data-testid="button-clear-popular-filters"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => onApply(draft)}
            className="h-[40px] rounded-full bg-[#171a20] text-[14px] font-semibold text-white"
            data-testid="button-apply-popular-filters"
          >
            Show {previewCount} Results
          </button>
        </footer>
      </section>
    </div>
  );
}

function readSavedRentals() {
  try {
    return JSON.parse(localStorage.getItem('jakurzi:wishlist') || '[]') as string[];
  } catch {
    return [];
  }
}

export function PopularRentalsPage({ listings }: { listings: RentalScreenListing[] }) {
  const [location, setLocation] = useLocation();
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const [saved, setSaved] = useState(readSavedRentals);
  const [filters, setFilters] = useState<RentalFilters | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setQuery(new URLSearchParams(location.split('?')[1] || '').get('q') || '');
  }, [location]);

  const allRentals = useMemo(
    () => listings.filter((listing) => listing.mode === 'Rent' || listing.mode === 'Short Let'),
    [listings],
  );
  const activeFilters = filters ?? {
    propertyType: 'Any',
    duration: 'Any' as const,
    minPrice: 0,
    maxPrice: 4000,
  };
  const filteredListings = useMemo(
    () => getFilteredRentals(allRentals, activeFilters, query),
    [allRentals, activeFilters, query],
  );

  useEffect(() => {
    const selectedType = new URLSearchParams(location.split('?')[1] || '').get('type');
    if (selectedType) {
      setFilters({
        propertyType: selectedType,
        duration: 'Any',
        minPrice: 0,
        maxPrice: 4000,
      });
    }
  }, [location]);

  const toggleSave = (id: string) => {
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id];
      localStorage.setItem('jakurzi:wishlist', JSON.stringify(next));
      return next;
    });
  };
  const applySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocation(`/popular-rentals${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  return (
    <main className="mx-auto min-h-[100dvh] max-w-[900px] bg-white px-4 pb-28 text-[#171a20] md:px-6">
      <div className="pt-[max(10px,env(safe-area-inset-top))]">
        <div className="relative flex h-10 items-center justify-center">
          <button
            type="button"
            onClick={() => setLocation('/')}
            className="absolute left-0 grid size-9 place-items-center"
            aria-label="Back to home"
            data-testid="button-popular-back"
          >
            <ArrowLeft size={23} strokeWidth={1.8} />
          </button>
          <h1 className="max-w-[78%] truncate text-[21px] font-semibold tracking-[-.035em]">
            Popular Rentals ({allRentals.length})
          </h1>
        </div>
        <form
          className="mt-3 flex h-[49px] items-center gap-2.5 rounded-[12px] border border-[#dedfe2] bg-[#f0f1f2] px-3.5"
          onSubmit={applySearch}
        >
          <Search size={20} className="shrink-0" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search in Popular Rentals"
            aria-label="Search in Popular Rentals"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#7a7e83]"
          />
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="grid size-8 shrink-0 place-items-center"
            aria-label="Filter popular rentals"
            data-testid="button-popular-search-filters"
          >
            <SlidersHorizontal size={21} />
          </button>
        </form>
      </div>

      <div className="mb-3 mt-[60px] flex h-7 items-center justify-between">
        <p className="text-[14px] text-[#3d4248]">
          {filteredListings.length} Results
          {filters && <button type="button" onClick={() => setFilters(null)} className="ml-2 text-[11px] underline">Clear filters</button>}
        </p>
        <div className="flex items-center gap-4">
          <Link href="/map" className="flex items-center gap-1.5 text-[14px]" data-testid="link-popular-map">
            <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden="true">
              <path d="M2.5 4.2 7 2.5l6 2 4.5-1.7v13L13 17.5l-6-2-4.5 1.7v-13Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 2.8v12.5m6-10.7v12.3" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Map View
          </Link>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="grid size-8 place-items-center"
            aria-label="Open popular rental filters"
            data-testid="button-open-popular-filters"
          >
            <SlidersHorizontal size={21} />
          </button>
        </div>
      </div>

      {filteredListings.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {filteredListings.map((listing) => (
            <ResultsCard
              key={listing.id}
              listing={listing}
              saved={saved.includes(listing.id)}
              onSave={toggleSave}
            />
          ))}
        </div>
      ) : (
        <section className="flex min-h-[240px] flex-col items-center justify-center px-7 text-center">
          <div className="grid size-12 place-items-center rounded-full bg-[#f2f3f4]"><Search size={21} /></div>
          <h2 className="mt-4 text-[17px] font-semibold">No rentals found</h2>
          <p className="mt-1 text-[13px] text-[#656a70]">Try changing your search or filters.</p>
          <button
            type="button"
            className="mt-4 rounded-full bg-[#171a20] px-5 py-2.5 text-sm font-semibold text-white"
            onClick={() => {
              setFilters(null);
              setQuery('');
              setLocation('/popular-rentals');
            }}
          >
            Reset search
          </button>
        </section>
      )}

      {filtersOpen && (
        <PopularRentalsFilterSheet
          key={filtersOpen ? 'open' : 'closed'}
          listings={allRentals}
          query={query}
          initialFilters={filters ?? defaultRentalFilters}
          onClose={() => setFiltersOpen(false)}
          onApply={(nextFilters) => {
            setFilters(nextFilters);
            setFiltersOpen(false);
          }}
        />
      )}
    </main>
  );
}

function BrowseListingCard({
  listing,
  saved,
  onSave,
  onSelect,
}: {
  listing: RentalScreenListing;
  saved: boolean;
  onSave: (id: string) => void;
  onSelect: (listing: RentalScreenListing) => void;
}) {
  return (
    <article
      className="min-w-0 overflow-hidden rounded-[12px] border border-[#e0e1e3] bg-white shadow-[0_3px_12px_rgba(0,0,0,.1)]"
      data-testid={`card-category-listing-${listing.id}`}
    >
      <div className="relative aspect-[1.72] overflow-hidden bg-[#dfe5e9]">
        <button
          type="button"
          className="absolute inset-0 size-full"
          onClick={() => onSelect(listing)}
          aria-label={`View ${listing.title}`}
          data-testid={`button-category-listing-${listing.id}`}
        >
          <img src={listing.image} alt={listing.title} className="size-full object-cover" />
        </button>
        {listing.tag && (
          <span className="absolute left-2 top-2 rounded-[5px] bg-[#edf3eb] px-1.5 py-1 text-[9px] leading-none text-[#33433a]">
            {listing.tag}
          </span>
        )}
        <button
          type="button"
          onClick={() => onSave(listing.id)}
          className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-white/95 text-[#161a20]"
          aria-label={saved ? 'Remove from wishlist' : 'Save listing'}
          data-testid={`button-category-save-${listing.id}`}
        >
          <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <button
        type="button"
        className="block w-full px-2.5 pb-2.5 pt-2 text-left"
        onClick={() => onSelect(listing)}
        data-testid={`button-category-open-${listing.id}`}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[13px] font-semibold">{listing.title}</h3>
          <span className="flex shrink-0 items-center gap-1 text-[10px]">
            <Star size={11} fill="currentColor" /> {listing.rating}
          </span>
        </div>
        <p className="mt-1 truncate text-[10px] text-[#555b62]">
          <MapPin className="mr-0.5 inline size-3 align-[-2px]" />
          {listing.location}
        </p>
        <p className="mt-1.5 text-[13px] font-bold">
          {listing.price}
          {listing.mode === 'Short Let' && <span className="font-normal text-[#555b62]"> / night</span>}
        </p>
      </button>
    </article>
  );
}

export function CategoryBrowseScreen({
  category,
  subcategory,
  items,
  saved = [],
  onSave,
  onBack,
  onSelectCategory,
  onSelectSubcategory,
  onSelectListing,
}: {
  category: MarketplaceCategory;
  subcategory?: string;
  items: RentalScreenListing[];
  saved?: string[];
  onSave?: (id: string) => void;
  onBack?: () => void;
  onSelectCategory?: (category: MarketplaceCategory) => void;
  onSelectSubcategory?: (subcategory: string) => void;
  onSelectListing?: (listing: RentalScreenListing) => void;
}) {
  const [, setLocation] = useLocation();
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory);
  const subcategories = marketplaceSubcategories[category];

  useEffect(() => {
    setSelectedSubcategory(subcategory);
  }, [category, subcategory]);

  const categoryImage = (label: string, index: number) => {
    const matchingItem = items.find((item) => item.type.toLowerCase() === label.toLowerCase());
    if (matchingItem) return matchingItem.image;
    const fallbackImages = [apartmentImage, penthouseImage, villaImage, loftImage];
    return fallbackImages[index % fallbackImages.length];
  };

  const visibleItems = useMemo(() => {
    if (!selectedSubcategory) return items;
    const normalized = selectedSubcategory.toLowerCase();
    return items.filter((item) =>
      item.type.toLowerCase() === normalized
      || item.title.toLowerCase().includes(normalized),
    );
  }, [items, selectedSubcategory]);

  const chooseCategory = (nextCategory: MarketplaceCategory) => {
    if (onSelectCategory) {
      onSelectCategory(nextCategory);
      return;
    }
    setLocation(`/popular-rentals?category=${encodeURIComponent(nextCategory)}`);
  };

  const chooseSubcategory = (nextSubcategory: string) => {
    setSelectedSubcategory(nextSubcategory);
    onSelectSubcategory?.(nextSubcategory);
  };

  const selectListing = (listing: RentalScreenListing) => {
    if (onSelectListing) {
      onSelectListing(listing);
      return;
    }
    setLocation(`/listing/${listing.id}`);
  };

  return (
    <main className="mx-auto min-h-[100dvh] max-w-[520px] bg-[#f6f6f7] pb-28 text-[#161a20] md:hidden">
      <header className="sticky top-0 z-30 bg-[#f6f6f7]/95 px-5 pb-3 pt-[max(10px,env(safe-area-inset-top))] backdrop-blur-lg">
        <div className="relative flex h-10 items-center justify-center">
          <button
            type="button"
            onClick={() => (onBack ? onBack() : setLocation('/'))}
            className="absolute left-[-7px] grid size-9 place-items-center"
            aria-label="Back to home"
            data-testid="button-category-back"
          >
            <ArrowLeft size={22} strokeWidth={1.9} />
          </button>
          <h1 className="text-[20px] font-semibold tracking-[-.035em]">{category}</h1>
          <button
            type="button"
            onClick={() => setLocation(`/popular-rentals?category=${encodeURIComponent(category)}`)}
            className="absolute right-[-7px] grid size-9 place-items-center"
            aria-label={`Search ${category}`}
            data-testid="button-category-search"
          >
            <Search size={20} strokeWidth={1.9} />
          </button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {marketplaceCategories.map((item) => (
            <MarketplaceCategoryShortcut
              key={item.label}
              category={item}
              active={item.label === category}
              onSelect={chooseCategory}
            />
          ))}
        </div>
      </header>

      <div className="space-y-5 px-5 pt-3">
        <section aria-labelledby="browse-subcategories">
          <div className="mb-2 flex items-center justify-between">
            <h2 id="browse-subcategories" className="text-[15px] font-medium">Top Categories</h2>
            {selectedSubcategory && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSubcategory(undefined);
                  onSelectSubcategory?.('');
                }}
                className="text-[12px] font-medium"
                data-testid="button-category-clear-subcategory"
              >
                See all
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {subcategories.map((label, index) => {
              const selected = selectedSubcategory === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => chooseSubcategory(label)}
                  className={`min-w-0 overflow-hidden rounded-[11px] border bg-white pb-2 text-center shadow-[0_2px_7px_rgba(0,0,0,.08)] ${
                    selected ? 'border-[#171a20] ring-1 ring-[#171a20]' : 'border-[#dedfe1]'
                  }`}
                  aria-pressed={selected}
                  data-testid={`button-subcategory-${label.toLowerCase().replaceAll(' ', '-')}`}
                >
                  <div className="h-[77px] overflow-hidden bg-[#e7ebed]">
                    <img src={categoryImage(label, index)} alt="" className="size-full object-cover" aria-hidden="true" />
                  </div>
                  <span className="mt-1 block truncate px-1 text-[11px] font-medium">{label}</span>
                  <span className="mt-0.5 block text-[9px] text-[#51565d]">
                    {items.filter((item) => item.type.toLowerCase() === label.toLowerCase()).length || 0} listings
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="browse-listings">
          <div className="mb-2 flex items-center justify-between">
            <h2 id="browse-listings" className="text-[15px] font-medium">
              {selectedSubcategory ? selectedSubcategory : `Trending ${category}`}
            </h2>
            <span className="text-[11px] text-[#5b6067]">{visibleItems.length} listings</span>
          </div>
          {visibleItems.length ? (
            <div className="grid grid-cols-2 gap-3">
              {visibleItems.map((listing) => (
                <BrowseListingCard
                  key={listing.id}
                  listing={listing}
                  saved={saved.includes(listing.id)}
                  onSave={onSave ?? (() => undefined)}
                  onSelect={selectListing}
                />
              ))}
            </div>
          ) : (
            <section className="flex min-h-[180px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#d3d5d7] bg-white px-6 text-center">
              <div className="grid size-11 place-items-center rounded-full bg-[#f1f2f3]">
                <Search size={19} />
              </div>
              <h3 className="mt-3 text-[15px] font-semibold">No listings yet</h3>
              <p className="mt-1 text-[12px] text-[#656a70]">Try another category or check back soon.</p>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}

export function ReferenceBottomNav() {
  const [location] = useLocation();
  const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/popular-rentals', label: 'Search', icon: Search },
    { href: '/trips', label: 'Travel', icon: CalendarDays },
    { href: '/messages', label: 'Inbox', icon: Bell },
    { href: '/profile', label: 'Profile', icon: UserRound },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[520px] -translate-x-1/2 border-t border-[#d4d5d7] bg-white/95 px-3 pb-[max(7px,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-lg md:hidden">
      <div className="grid h-[54px] grid-cols-5 items-center">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === '/'
            ? location === '/'
            : href === '/popular-rentals'
              ? location.startsWith('/popular-rentals')
              : location.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`relative flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
                active ? 'text-[#E1004C]' : 'text-[#676c72]'
              }`}
              aria-current={active ? 'page' : undefined}
              data-testid={`link-reference-bottom-${label.toLowerCase()}`}
            >
              <Icon size={21} strokeWidth={active ? 2.4 : 1.8} />
              <span>{label}</span>
              {active && <span className="absolute bottom-0.5 size-1 rounded-full bg-[#E1004C]" aria-hidden="true" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}