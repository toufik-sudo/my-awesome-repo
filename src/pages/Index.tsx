import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Home, 
  Building2, 
  Hotel, 
  Castle,
  Mountain,
  Palmtree,
  Star,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-coastal.jpg';
import logoImage from '@/assets/byootdz-logo.png';
import { TrustBadge } from '@/modules/shared/components/TrustBadge';

const PROPERTY_CATEGORIES = [
  { id: 'houses', icon: Home, translationKey: 'byootdz.categories.houses' },
  { id: 'apartments', icon: Building2, translationKey: 'byootdz.categories.apartments' },
  { id: 'hotels', icon: Hotel, translationKey: 'byootdz.categories.hotels' },
  { id: 'villas', icon: Castle, translationKey: 'byootdz.categories.villas' },
  { id: 'chalets', icon: Mountain, translationKey: 'byootdz.categories.chalets' },
  { id: 'riads', icon: Palmtree, translationKey: 'byootdz.categories.riads' },
];

const FEATURED_LISTINGS = [
  {
    id: 1, title: 'Villa Vue Mer', location: 'Tipaza', price: 15000, rating: 4.9, reviews: 127,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
    badge: 'byootdz.badges.superhost', trustStars: 5, isVerified: true, weeklyDiscount: 15, monthlyDiscount: 25,
  },
  {
    id: 2, title: 'Appartement Moderne', location: 'Alger Centre', price: 8000, rating: 4.7, reviews: 89,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
    badge: 'byootdz.badges.popular', trustStars: 3, isVerified: true, weeklyDiscount: 10, monthlyDiscount: 0,
  },
  {
    id: 3, title: 'Maison Traditionnelle', location: 'Constantine', price: 12000, rating: 4.8, reviews: 64,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
    badge: null, trustStars: 5, isVerified: true, weeklyDiscount: 0, monthlyDiscount: 20,
  },
  {
    id: 4, title: 'Chalet Montagne', location: 'Tikjda', price: 10000, rating: 4.6, reviews: 42,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop',
    badge: 'byootdz.badges.new', trustStars: 1, isVerified: true, weeklyDiscount: 0, monthlyDiscount: 0,
  },
];

const POPULAR_DESTINATIONS = [
  { name: 'Alger', properties: 1250, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&auto=format&fit=crop' },
  { name: 'Oran', properties: 890, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&auto=format&fit=crop' },
  { name: 'Constantine', properties: 456, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop' },
  { name: 'Béjaïa', properties: 324, image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&auto=format&fit=crop' },
  { name: 'Tipaza', properties: 278, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop' },
  { name: 'Annaba', properties: 198, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&auto=format&fit=crop' },
];

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="ByootDZ" className="h-8 w-auto" />
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('byootdz.nav.explore')}
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('byootdz.nav.howItWorks')}
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('byootdz.nav.listProperty')}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              {t('auth.login')}
            </Button>
            <Button size="sm" onClick={() => navigate('/login')}>
              {t('auth.signup')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-[85vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-secondary text-secondary-foreground border-0 px-4 py-1.5">
              🇩🇿 {t('byootdz.hero.badge')}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">
              {t('byootdz.hero.title')}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-lg">
              {t('byootdz.hero.subtitle')}
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl mt-8">
            <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {t('byootdz.search.where')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('byootdz.search.wherePlaceholder')}
                      className="pl-10 border-0 bg-muted/50 focus:bg-muted"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {t('byootdz.search.when')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('byootdz.search.addDates')}
                      className="pl-10 border-0 bg-muted/50 focus:bg-muted"
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full h-11 gap-2" onClick={() => navigate(`/properties${searchQuery ? `?location=${encodeURIComponent(searchQuery)}` : ''}`)}>
                    <Search className="h-4 w-4" />
                    {t('byootdz.search.search')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-6">
              <div>
                <p className="text-3xl font-bold text-white">5,000+</p>
                <p className="text-white/70 text-sm">{t('byootdz.stats.properties')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">48</p>
                <p className="text-white/70 text-sm">{t('byootdz.stats.wilayas')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">15K+</p>
                <p className="text-white/70 text-sm">{t('byootdz.stats.happyGuests')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('byootdz.categories.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('byootdz.categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PROPERTY_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary/50"
                  onClick={() => navigate(`/properties?type=${category.id === 'houses' ? 'house' : category.id === 'apartments' ? 'apartment' : category.id === 'hotels' ? 'hotel' : category.id === 'villas' ? 'villa' : category.id === 'chalets' ? 'chalet' : 'riad'}`)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {t(category.translationKey)}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                {t('byootdz.featured.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('byootdz.featured.subtitle')}
              </p>
            </div>
            <Button variant="ghost" className="hidden md:flex items-center gap-2" onClick={() => navigate('/properties')}>
              {t('byootdz.featured.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_LISTINGS.map((listing) => (
              <Card 
                key={listing.id}
                className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => navigate(`/property/${listing.id}`)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {listing.badge && (
                      <Badge className="bg-accent text-accent-foreground border-0">
                        {t(listing.badge)}
                      </Badge>
                    )}
                    <TrustBadge
                      trustStars={listing.trustStars}
                      isVerified={listing.isVerified}
                      size="sm"
                      showLabel={false}
                      className="shadow-custom bg-card/95 backdrop-blur-sm"
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {listing.location}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {listing.title}
                  </h3>
                  {/* Discount Badges */}
                  {(listing.weeklyDiscount > 0 || listing.monthlyDiscount > 0) && (
                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      {listing.weeklyDiscount > 0 && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
                          -{listing.weeklyDiscount}% week
                        </Badge>
                      )}
                      {listing.monthlyDiscount > 0 && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0">
                          -{listing.monthlyDiscount}% month
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium">{listing.rating}</span>
                      <span className="text-muted-foreground text-sm">({listing.reviews})</span>
                    </div>
                    <div>
                      <span className="font-bold text-primary">{listing.price.toLocaleString()} DA</span>
                      <span className="text-muted-foreground text-sm">/{t('byootdz.perNight')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" className="gap-2">
              {t('byootdz.featured.viewAll')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {t('byootdz.destinations.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('byootdz.destinations.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_DESTINATIONS.map((destination, idx) => (
              <div 
                key={destination.name}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                  idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`aspect-[4/3] ${idx === 0 ? 'md:aspect-auto md:h-full' : ''}`}>
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className={`font-bold text-white ${idx === 0 ? 'text-3xl' : 'text-xl'}`}>
                    {destination.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {destination.properties.toLocaleString()} {t('byootdz.destinations.properties')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            {t('byootdz.cta.title')}
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            {t('byootdz.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 gap-2"
            >
              {t('byootdz.cta.listProperty')}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              {t('byootdz.cta.learnMore')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <img src={logoImage} alt="ByootDZ" className="h-8 w-auto mb-4 brightness-0 invert" />
              <p className="text-white/70 text-sm">
                {t('byootdz.footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('byootdz.footer.company')}</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{t('byootdz.footer.about')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('byootdz.footer.careers')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('byootdz.footer.press')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('byootdz.footer.support')}</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{t('byootdz.footer.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('byootdz.footer.safety')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('byootdz.footer.cancellation')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('byootdz.footer.legal')}</h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{t('byootdz.footer.terms')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('byootdz.footer.privacy')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('byootdz.footer.cookies')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © 2024 ByootDZ. {t('byootdz.footer.rights')}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm">🇩🇿 {t('byootdz.footer.madeIn')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
