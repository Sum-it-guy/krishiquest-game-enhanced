import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, BarChart3, ShoppingCart, Star, Plus, Filter, Grid, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface MarketPrice {
  crop: string;
  currentPrice: number;
  change: number;
  demand: 'High' | 'Medium' | 'Low';
  season: string;
  unit: string;
  category: string;
}

interface CropListing {
  id: string;
  name: string;
  seller: string;
  price: number;
  unit: string;
  quantity: number;
  quality: 'Premium' | 'Standard' | 'Economy';
  rating: number;
  reviews: number;
  image: string;
  location: string;
  demand: 'High' | 'Medium' | 'Low';
  category: string;
}

const mockMarketData: MarketPrice[] = [
  { crop: 'Wheat', currentPrice: 2250, change: 1.2, demand: 'High', season: 'Rabi', unit: 'quintal', category: 'Grains' },
  { crop: 'Rice', currentPrice: 1800, change: -2.3, demand: 'Medium', season: 'Kharif', unit: 'quintal', category: 'Grains' },
  { crop: 'Tomato', currentPrice: 45, change: 15.8, demand: 'High', season: 'Year round', unit: 'kg', category: 'Vegetables' },
  { crop: 'Onion', currentPrice: 25, change: -8.1, demand: 'Medium', season: 'Rabi', unit: 'kg', category: 'Vegetables' },
  { crop: 'Sugarcane', currentPrice: 280, change: 4.5, demand: 'Low', season: 'Year round', unit: 'quintal', category: 'Cash Crops' },
  { crop: 'Potato', currentPrice: 18, change: 3.5, demand: 'High', season: 'Rabi', unit: 'kg', category: 'Vegetables' },
  { crop: 'Mustard', currentPrice: 5200, change: 2.1, demand: 'Medium', season: 'Rabi', unit: 'quintal', category: 'Oilseeds' },
  { crop: 'Cotton', currentPrice: 6800, change: -1.8, demand: 'Low', season: 'Kharif', unit: 'quintal', category: 'Cash Crops' },
];

const mockCropListings: CropListing[] = [
  {
    id: '1',
    name: 'Premium Basmati Rice',
    seller: 'Singh Farms',
    price: 85,
    unit: 'kg',
    quantity: 1000,
    quality: 'Premium',
    rating: 4.8,
    reviews: 156,
    image: '🌾',
    location: 'Punjab',
    demand: 'High',
    category: 'Grains'
  },
  {
    id: '2',
    name: 'Organic Tomatoes',
    seller: 'Green Valley Farm',
    price: 60,
    unit: 'kg',
    quantity: 500,
    quality: 'Premium',
    rating: 4.6,
    reviews: 89,
    image: '🍅',
    location: 'Maharashtra',
    demand: 'High',
    category: 'Vegetables'
  },
  {
    id: '3',
    name: 'Fresh Red Onions',
    seller: 'Patel Agriculture',
    price: 28,
    unit: 'kg',
    quantity: 2000,
    quality: 'Standard',
    rating: 4.3,
    reviews: 234,
    image: '🧅',
    location: 'Gujarat',
    demand: 'Medium',
    category: 'Vegetables'
  },
  {
    id: '4',
    name: 'Wheat Grain',
    seller: 'Sharma Agro',
    price: 2300,
    unit: 'quintal',
    quantity: 50,
    quality: 'Standard',
    rating: 4.5,
    reviews: 78,
    image: '🌾',
    location: 'Haryana',
    demand: 'High',
    category: 'Grains'
  }
];

const marketTrends = [
  { category: 'Vegetables', trend: 'up', percentage: 12.5 },
  { category: 'Grains', trend: 'down', percentage: 3.2 },
  { category: 'Pulses', trend: 'up', percentage: 8.7 },
  { category: 'Oilseeds', trend: 'down', percentage: 5.1 },
];

export default function MarketPlace() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [demandFilter, setDemandFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredData = mockMarketData.filter(item =>
    item.crop.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    (demandFilter === 'All' || item.demand === demandFilter)
  );

  const filteredListings = mockCropListings.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    (demandFilter === 'All' || item.demand === demandFilter)
  );

  const categories = ['All', ...Array.from(new Set(mockMarketData.map(item => item.category)))];
  const demandLevels = ['All', 'High', 'Medium', 'Low'];

  const getDemandStats = () => {
    const high = mockMarketData.filter(item => item.demand === 'High').length;
    const medium = mockMarketData.filter(item => item.demand === 'Medium').length;
    const low = mockMarketData.filter(item => item.demand === 'Low').length;
    return { high, medium, low, total: mockMarketData.length };
  };

  const demandStats = getDemandStats();

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">{t('marketplace')}</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={demandFilter} onValueChange={setDemandFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Demand" />
            </SelectTrigger>
            <SelectContent>
              {demandLevels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Demand Overview */}
      <Card className="farming-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Demand Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{demandStats.high}</div>
              <div className="text-sm text-green-800">High Demand</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{demandStats.medium}</div>
              <div className="text-sm text-yellow-800">Medium Demand</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{demandStats.low}</div>
              <div className="text-sm text-red-800">Low Demand</div>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{demandStats.total}</div>
              <div className="text-sm text-primary">Total Crops</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="prices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prices">Market Prices</TabsTrigger>
          <TabsTrigger value="marketplace">Buy/Sell Crops</TabsTrigger>
        </TabsList>

        <TabsContent value="prices" className="space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Prices Table */}
          <div className="lg:col-span-2">
            <Card className="farming-card">
              <CardHeader>
                <CardTitle>Market Prices</CardTitle>
                <p className="text-sm text-muted-foreground">Real time market prices and crop recommendations</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 font-semibold">Crop</th>
                        <th className="text-left py-3 font-semibold">Category</th>
                        <th className="text-right py-3 font-semibold">Current Price</th>
                        <th className="text-right py-3 font-semibold">Change</th>
                        <th className="text-center py-3 font-semibold">Demand</th>
                        <th className="text-center py-3 font-semibold">Season</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (
                        <tr key={item.crop} className="border-b border-border hover:bg-secondary/50">
                          <td className="py-4 font-medium">{item.crop}</td>
                          <td className="py-4 text-sm text-muted-foreground">{item.category}</td>
                          <td className="text-right py-4">
                            <div>
                              <span className="font-semibold">₹{item.currentPrice}</span>
                              <span className="text-sm text-muted-foreground">/{item.unit}</span>
                            </div>
                          </td>
                          <td className="text-right py-4">
                            <div className={`flex items-center justify-end ${
                              item.change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.change > 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              <span className="font-medium">{Math.abs(item.change)}%</span>
                            </div>
                          </td>
                          <td className="text-center py-4">
                            <Badge className={getDemandColor(item.demand)}>
                              {item.demand}
                            </Badge>
                          </td>
                          <td className="text-center py-4 text-sm text-muted-foreground">
                            {item.season}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Trends */}
          <div className="space-y-6">
            <Card className="farming-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketTrends.map((trend) => (
                  <div key={trend.category} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <span className="font-medium">{trend.category}</span>
                    <div className={`flex items-center ${
                      trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trend.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-semibold">{trend.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="farming-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Price History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Set Price Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Sell Your Crops
            </Button>
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredListings.map((listing) => (
              <Card key={listing.id} className={`farming-card hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}>
                <div className={viewMode === 'list' ? 'w-32 h-32' : 'h-48'}>
                  <div className={`w-full h-full bg-gradient-to-br from-primary/10 to-secondary/30 rounded-t-lg flex items-center justify-center text-4xl ${
                    viewMode === 'list' ? 'rounded-l-lg rounded-t-none' : ''
                  }`}>
                    {listing.image}
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{listing.name}</h3>
                    <Badge className={getDemandColor(listing.demand)} variant="secondary">
                      {listing.demand}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">by {listing.seller}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(listing.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      {listing.rating} ({listing.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-primary">₹{listing.price}</span>
                      <span className="text-sm text-muted-foreground">/{listing.unit}</span>
                    </div>
                    <Badge variant="outline">{listing.quality}</Badge>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">
                      {listing.quantity} {listing.unit} available
                    </span>
                    <span className="text-sm text-muted-foreground">{listing.location}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}