'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationMap } from '@/components/location-map';
import { Search, MapPin, Users, DollarSign, TrendingUp, Building2, Download, Globe, Zap, ShoppingCart } from 'lucide-react';
import gsap from 'gsap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface LocationInfo {
  name: string;
  lat: number;
  lng: number;
  population: string;
  income: string;
  density: string;
  traffic: string;
  competition: string;
  growthRate: string;
  retailPotential: string;
  walkability: string;
}

const sampleLocations: Record<string, LocationInfo> = {
  'times square': {
    name: 'Times Square, New York, USA',
    lat: 40.758,
    lng: -73.9855,
    population: '305,624',
    income: '$85,000',
    density: 'Very High',
    traffic: 'Very High',
    competition: 'Intense',
    growthRate: '2.3%',
    retailPotential: 'Excellent',
    walkability: '99/100',
  },
  'shibuya': {
    name: 'Shibuya, Tokyo, Japan',
    lat: 35.6595,
    lng: 139.7004,
    population: '2,100,000',
    income: '¥5,500,000',
    density: 'Very High',
    traffic: 'Very High',
    competition: 'Intense',
    growthRate: '1.8%',
    retailPotential: 'Excellent',
    walkability: '98/100',
  },
  'oxford street': {
    name: 'Oxford Street, London, UK',
    lat: 51.5154,
    lng: -0.1408,
    population: '1,896,000',
    income: '£52,000',
    density: 'Very High',
    traffic: 'Very High',
    competition: 'Intense',
    growthRate: '1.5%',
    retailPotential: 'Excellent',
    walkability: '96/100',
  },
  'champs elysees': {
    name: 'Champs-Élysées, Paris, France',
    lat: 48.8698,
    lng: 2.3076,
    population: '2,161,000',
    income: '€48,000',
    density: 'High',
    traffic: 'Very High',
    competition: 'Intense',
    growthRate: '1.2%',
    retailPotential: 'Excellent',
    walkability: '97/100',
  },
  'marina bay': {
    name: 'Marina Bay, Singapore',
    lat: 1.2854,
    lng: 103.8565,
    population: '5,638,700',
    income: 'SGD 5,832',
    density: 'Very High',
    traffic: 'Very High',
    competition: 'High',
    growthRate: '2.1%',
    retailPotential: 'Excellent',
    walkability: '95/100',
  },
  'leme': {
    name: 'Leme Beach, Rio de Janeiro, Brazil',
    lat: -22.9711,
    lng: -43.1761,
    population: '1,000,000',
    income: 'R$3,200',
    density: 'High',
    traffic: 'High',
    competition: 'Moderate',
    growthRate: '2.8%',
    retailPotential: 'Very Good',
    walkability: '92/100',
  },
  'dubai mall': {
    name: 'Downtown Dubai, UAE',
    lat: 25.1972,
    lng: 55.2744,
    population: '3,100,000',
    income: 'AED 128,000',
    density: 'Very High',
    traffic: 'Very High',
    competition: 'High',
    growthRate: '3.5%',
    retailPotential: 'Excellent',
    walkability: '94/100',
  },
  'gangnam': {
    name: 'Gangnam, Seoul, South Korea',
    lat: 37.4979,
    lng: 127.0276,
    population: '520,000',
    income: '₩45,000,000',
    density: 'Very High',
    traffic: 'High',
    competition: 'Intense',
    growthRate: '2.2%',
    retailPotential: 'Excellent',
    walkability: '93/100',
  },
};

const businessCategories = [
  'Retail',
  'Restaurant',
  'Coffee Shop',
  'Fitness',
  'Healthcare',
  'Office Space',
];

export default function AppPage() {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(sampleLocations['times square']);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const infoRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const handleLocationChange = (value: string) => {
    setLocation(value);
    if (value.trim()) {
      const filtered = Object.keys(sampleLocations).filter((key) =>
        key.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (locationKey?: string) => {
    const key = locationKey || Object.keys(sampleLocations)[0];
    const foundLocation = sampleLocations[key];
    if (foundLocation) {
      setCurrentLocation(foundLocation);
      setLocation('');
      setSuggestions([]);

      if (infoRef.current) {
        gsap.fromTo(
          infoRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      }
    }
  };

  const downloadPDF = () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('Location Analysis Report', margin, yPosition);

      yPosition += 15;
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);

      yPosition += 15;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);

      yPosition += 10;
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text(currentLocation.name, margin, yPosition);

      yPosition += 12;
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Coordinates: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`, margin, yPosition);

      yPosition += 15;
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Market Metrics', margin, yPosition);

      yPosition += 10;
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(10);

      const metrics = [
        ['Population', currentLocation.population],
        ['Average Income', currentLocation.income],
        ['Population Density', currentLocation.density],
        ['Traffic Level', currentLocation.traffic],
        ['Competition Level', currentLocation.competition],
        ['Growth Rate', currentLocation.growthRate],
        ['Retail Potential', currentLocation.retailPotential],
        ['Walkability', currentLocation.walkability],
      ];

      metrics.forEach(([label, value]) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(`${label}:`, margin, yPosition);
        pdf.text(String(value), pageWidth - margin - 40, yPosition);
        yPosition += 8;
      });

      yPosition += 10;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);

      yPosition += 10;
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(9);
      const footerText = 'This report was generated by Zonely - Location Analysis Platform';
      pdf.text(footerText, margin, pageHeight - 10);

      pdf.save(`${currentLocation.name.replace(/,/g, '')}_report.pdf`);
    } catch (error) {
      console.error('[v0] PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="w-full h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-border z-50 px-4 h-16">
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto w-full">
          <Link href="/" className="text-xl font-bold text-primary">
            Zonely
          </Link>
          <div className="flex items-center gap-2">
            <Button onClick={downloadPDF} variant="outline" size="sm" className="bg-white">
              <Download className="w-4 h-4 mr-1" />
              Download Report
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white">
                Back
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-1 pt-16 gap-0 overflow-hidden">
        <div className="w-80 border-r border-border bg-card p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-foreground mb-6">Find Your Location</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <div className="relative">
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search worldwide..."
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>

                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSearch(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-muted/50 border-b border-border/50 last:border-b-0 transition-colors text-sm"
                      >
                        {sampleLocations[suggestion].name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Category
              </label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select a category</option>
                {businessCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={() => handleSearch()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-8"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Location
          </Button>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground mb-3">Worldwide Locations</h3>
            {Object.entries(sampleLocations).map(([key, loc]) => (
              <button
                key={key}
                onClick={() => handleSearch(key)}
                className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
              >
                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {loc.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <LocationMap location={currentLocation} />
          </div>

          <div
            ref={infoRef}
            className="border-t border-border bg-white h-48 overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Location Analysis: {currentLocation.name}
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Population</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentLocation.population}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avg Income</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentLocation.income}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Population Density</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentLocation.density}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Competition Level</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentLocation.competition}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Traffic Level</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentLocation.traffic}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Growth Rate</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentLocation.growthRate}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Retail Potential</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentLocation.retailPotential}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Walkability</p>
                    <p className="text-sm font-semibold text-foreground">
                      {currentLocation.walkability}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
