'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationMap } from '@/components/location-map';
import { ComparisonDashboard } from '@/components/comparison-dashboard';
import { Search, MapPin, Download, Loader2, Users, IndianRupee, Briefcase, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import gsap from 'gsap';
import jsPDF from 'jspdf';

const tamilNaduDistricts: Record<string, { name: string, code: string }> = {
  'ariyalur': { name: 'Ariyalur', code: '616' },
  'chennai': { name: 'Chennai', code: '603' },
  'coimbatore': { name: 'Coimbatore', code: '632' },
  'cuddalore': { name: 'Cuddalore', code: '617' },
  'dharmapuri': { name: 'Dharmapuri', code: '630' },
  'dindigul': { name: 'Dindigul', code: '612' },
  'erode': { name: 'Erode', code: '610' },
  'kancheepuram': { name: 'Kancheepuram', code: '604' },
  'karur': { name: 'Karur', code: '613' },
  'krishnagiri': { name: 'Krishnagiri', code: '631' },
  'madurai': { name: 'Madurai', code: '623' },
  'nagapattinam': { name: 'Nagapattinam', code: '618' },
  'namakkal': { name: 'Namakkal', code: '609' },
  'nilgiris': { name: 'Nilgiris', code: '611' },
  'perambalur': { name: 'Perambalur', code: '615' },
  'pudukkottai': { name: 'Pudukkottai', code: '621' },
  'ramanathapuram': { name: 'Ramanathapuram', code: '626' },
  'salem': { name: 'Salem', code: '608' },
  'sivaganga': { name: 'Sivaganga', code: '622' },
  'thanjavur': { name: 'Thanjavur', code: '620' },
  'theni': { name: 'Theni', code: '624' },
  'thoothukudi': { name: 'Thoothukudi', code: '627' },
  'trichy': { name: 'trichy', code: '614' },
  'tirunelveli': { name: 'Tirunelveli', code: '628' },
  'Thiruvallur': { name: 'Thiruvallur', code: '602' },
  'tiruvannamalai': { name: 'Tiruvannamalai', code: '606' },
  'Thiruvarur': { name: 'Thiruvarur', code: '619' },
  'vellore': { name: 'Vellore', code: '605' },
  'viluppuram': { name: 'Viluppuram', code: '607' },
  'virudhunagar': { name: 'Virudhunagar', code: '625' },
};

const businessCategories = [
  // --- FOOD & DRINK ---
  { label: 'Bakery', type: 'shop', value: 'bakery' },
  { label: 'Restaurant', type: 'amenity', value: 'restaurant' },
  { label: 'Cafe', type: 'amenity', value: 'cafe' },
  { label: 'Fast Food', type: 'amenity', value: 'fast_food' },
  { label: 'Ice Cream', type: 'amenity', value: 'ice_cream' },
  { label: 'Pub/Bar', type: 'amenity', value: 'pub' },

  // --- RETAIL & SHOPPING ---
  { label: 'Supermarket', type: 'shop', value: 'supermarket' },
  { label: 'Pharmacy/Medical', type: 'amenity', value: 'pharmacy' },
  { label: 'Convenience Store', type: 'shop', value: 'convenience' },
  { label: 'Clothing Store', type: 'shop', value: 'clothes' },
  { label: 'Electronics Store', type: 'shop', value: 'electronics' },
  { label: 'Jewelry Store', type: 'shop', value: 'jewelry' },
  { label: 'Department Store', type: 'shop', value: 'department_store' },
  { label: 'Furniture Store', type: 'shop', value: 'furniture' },
  { label: 'Hardware Store', type: 'shop', value: 'hardware' },

  // --- HEALTH & WELLNESS ---
  { label: 'Hospital', type: 'amenity', value: 'hospital' },
  { label: 'Clinic/Doctor', type: 'amenity', value: 'doctors' },
  { label: 'Beauty Salon', type: 'shop', value: 'beauty' },
  { label: 'Hairdresser', type: 'shop', value: 'hairdresser' },

  // --- AUTOMOTIVE ---
  { label: 'Fuel Station', type: 'amenity', value: 'fuel' },
  { label: 'Car Repair', type: 'shop', value: 'car_repair' },
  { label: 'Car Showroom', type: 'shop', value: 'car' },

  // --- FINANCE & SERVICES ---
  { label: 'Bank', type: 'amenity', value: 'bank' },
  { label: 'ATM', type: 'amenity', value: 'atm' },
  { label: 'Post Office', type: 'amenity', value: 'post_office' },
  { label: 'Cinema', type: 'amenity', value: 'cinema' },
];

export default function AppPage() {
const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({ type: '', value: '' });
  const [currentDistrict, setCurrentDistrict] = useState(tamilNaduDistricts['chennai']);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [labourData, setLabourData] = useState<any[] | null>(null);
  const [mapData, setMapData] = useState<{ shops: any; blindspots: any[] } | null>(null);
  const [populationData, setPopulationData] = useState<any[] | null>(null);
  const [avgRent, setAvgRent] = useState<number | null>(null);
  const [opportunityScore, setOpportunityScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isComparing, setIsComparisonMode] = useState(false);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [focusedSpot, setFocusedSpot] = useState<{ lat: number; lng: number } | null>(null);
  
  const infoRef = useRef<HTMLDivElement>(null);
const handleLocationChange = (value: string) => {
    setLocation(value);
    if (value.trim()) {
      const filtered = Object.keys(tamilNaduDistricts).filter((key) =>
        key.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

const handleSearchKey = (key: string) => {
    const found = tamilNaduDistricts[key];
    if (found) {
      setCurrentDistrict(found);
      setLocation(found.name);
      setSuggestions([]);
    }
  };

  // FETCH CALL: Connects to your Python Backend
  const triggerAnalysis = async () => {
    if (!selectedCategory.value) {
      alert("Please select a business category first.");
      return;
    }

   setLoading(true);
    try {
      const url = `http://127.0.0.1:8000/api/v1/full_analysis/${currentDistrict.code}/${currentDistrict.name.toLowerCase()}/${selectedCategory.type}/${selectedCategory.value}`;
      const res = await fetch(url);
      const data = await res.json();
      
      setMapData(data.map);
      setPopulationData(data.population);
      setAvgRent(data.rent);
      setLabourData(data.labour);
      setOpportunityScore(data.opportunity_score);

      // Animation for the info panel
      if (infoRef.current) {
        gsap.fromTo(infoRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Error connecting to Python backend. Ensure it is running at 127.0.0.1:8000");
    } finally {
      setLoading(false);
    }
  };

  const addToComparison = async () => {
    const url = `http://127.0.0.1:8000/api/v1/compare?district_codes=${currentDistrict.code}&city_names=${currentDistrict.name.toLowerCase()}`;
    const res = await fetch(url);
    const data = await res.json();
    // Only add if not already in comparison
    if (!comparisonData.find(item => item.district.toLowerCase() === currentDistrict.name.toLowerCase())) {
      setComparisonData(prev => [...prev, ...data]);
    }
    setIsComparisonMode(true);
  };

  const downloadPDF = () => {
    if (!mapData || !populationData) {
      alert("Please run an analysis first to generate a report.");
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let y = 20;

      // Header
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(44, 62, 80);
      pdf.text('Market Analysis Report', margin, y);
      
      y += 10;
      pdf.setFontSize(14);
      pdf.setTextColor(52, 152, 219);
      pdf.text(`${currentDistrict.name} District - ${selectedCategory.label}`, margin, y);

      y += 15;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, y, pageWidth - margin, y);

      // Summary Section
      y += 15;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Market Summary', margin, y);

      y += 10;
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(10);
      const totalPop = populationData.find(d => d.Type === "Total")?.["Persons"] || populationData[0]?.["Persons"];
      pdf.text(`Total Population: ${totalPop.toLocaleString()}`, margin, y);
      y += 7;
      pdf.text(`Market Opportunity Score: ${opportunityScore}%`, margin, y);
      y += 7;
      pdf.text(`Average Commercial Rent: INR ${avgRent?.toLocaleString() || 'N/A'}/sq.ft`, margin, y);
      y += 7;
      pdf.text(`Existing Competitors: ${Object.keys(mapData.shops).length}`, margin, y);

      // Recommendations
      y += 15;
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Top Recommended Zones', margin, y);

      y += 10;
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(9);
      mapData.blindspots.slice(0, 5).forEach((spot, i) => {
        pdf.text(`${i + 1}. Zone at ${spot.lat.toFixed(4)}, ${spot.lng.toFixed(4)} - Score: ${(spot.score * 1000).toFixed(0)}`, margin + 5, y);
        y += 6;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated by Zonely on ${new Date().toLocaleDateString()}`, margin, 280);

      pdf.save(`Zonely_Report_${currentDistrict.name}_${selectedCategory.value}.pdf`);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF.');
    }
  };

return (
  <div className="w-full h-screen bg-background flex flex-col">
    {/* Header */}
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-border z-50 px-4 h-16">
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto w-full">
        <Link href="/" className="text-xl font-bold text-primary">Zonely</Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={downloadPDF} className="bg-white">
            <Download className="w-4 h-4 mr-1" />Report
          </Button>
          <Link href="/"><Button variant="outline" size="sm" className="bg-white">Back</Button></Link>
        </div>
      </div>
    </div>

    <div className="flex flex-1 pt-16 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card p-6 overflow-y-auto shrink-0 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Market Analysis</h2>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">District</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search district..." 
                value={location} 
                onChange={(e) => handleLocationChange(e.target.value)} 
                className="pl-10"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-40 overflow-auto">
                  {suggestions.map((key) => (
                    <button key={key} onClick={() => handleSearchKey(key)} className="w-full text-left px-4 py-2 hover:bg-muted text-sm border-b last:border-0">
                      {tamilNaduDistricts[key].name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select 
              className="w-full px-3 py-2 bg-background border rounded-md text-sm"
              onChange={(e) => {
                const cat = businessCategories.find(c => c.value === e.target.value);
                if (cat) setSelectedCategory({ type: cat.type, value: cat.value });
              }}
            >
              <option value="">Select a category</option>
              {businessCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={triggerAnalysis} disabled={loading} className="w-full bg-primary mt-4 text-white">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
          {loading ? "Analyzing..." : "Analyze Market"}
        </Button>

        <Button 
          variant="outline" 
          onClick={addToComparison} 
          className="w-full mt-2 border-primary text-primary hover:bg-primary/5"
        >
          <BarChart3 className="w-4 h-4 mr-2" /> Add to Compare ({comparisonData.length})
        </Button>

        {/* Opportunity Score Quick View */}
        {opportunityScore && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Opportunity Score
              </h4>
              <span className="text-xl font-black text-primary">{opportunityScore}%</span>
            </div>
            <Progress value={opportunityScore} className="h-2" />
            <p className="text-[10px] text-muted-foreground mt-2 leading-tight">
              Based on population density, established retail workforce, and competitive rent rates.
            </p>
          </div>
        )}

        {/* Population Quick View Card */}
        {populationData && (
          <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" /> Census Summary
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Persons:</span>
                <span className="font-medium">
                  {populationData.find(d => d.Type === "Total")?.["Persons"].toLocaleString() || populationData[0]?.["Persons"].toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Households:</span>
                <span className="font-medium">{populationData[0]?.["Number of households"].toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main View Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative border-b border-border">
          <LocationMap 
            data={mapData || { shops: {}, blindspots: [] }} 
            focusedLocation={focusedSpot}
          />
        </div>

        {/* Insight Panel */}
        {(mapData || populationData || avgRent) && (
          <div 
            ref={infoRef} 
            className="h-1/3 min-h-[250px] bg-white flex flex-col shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-10"
          >
            {/* Panel Header */}
            <div className="px-6 py-3 border-b border-border flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-foreground">{currentDistrict.name} Market Insight</h3>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Live Analysis</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => {setMapData(null); setPopulationData(null); setAvgRent(null); setOpportunityScore(null); setLabourData(null);}}>Clear Data</Button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Top Row: Business Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {mapData && (
                  <>
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Competition</p>
                      <p className="text-2xl font-bold text-foreground">{Object.keys(mapData.shops).length} <span className="text-sm font-normal text-muted-foreground">Outlets</span></p>
                    </div>
                    <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                      <p className="text-xs font-semibold text-green-700 uppercase mb-1">Expansion Gaps</p>
                      <p className="text-2xl font-bold text-green-600">{mapData.blindspots.length} <span className="text-sm font-normal">Blindspots</span></p>
                    </div>
                  </>
                )}

                {/* --- RENT DATA CARD --- */}
                {avgRent && (
                  <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <p className="text-xs font-semibold text-orange-700 uppercase mb-1">Avg. Monthly Rent</p>
                    <p className="text-2xl font-bold text-orange-600 flex items-baseline">
                      <span className="text-lg mr-0.5">₹</span>
                      {Number(avgRent).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      <span className="text-xs font-normal text-orange-400 ml-1">/sq.ft avg</span>
                    </p>
                  </div>
                )}

                {opportunityScore && (
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-xs font-semibold text-primary uppercase mb-1">Market Opportunity</p>
                    <p className="text-xl font-bold text-primary">{opportunityScore > 70 ? 'Excellent' : opportunityScore > 40 ? 'Moderate' : 'Developing'}</p>
                  </div>
                )}
              </div>

              {/* --- NEW: TOP RECOMMENDED ZONES --- */}
              {mapData && mapData.blindspots.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /> Top Recommended Zones
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mapData.blindspots.slice(0, 6).map((spot, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setFocusedSpot({ lat: spot.lat, lng: spot.lng })}
                        className="p-3 border rounded-lg bg-card hover:border-primary transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="text-[10px]">Zone #{idx + 1}</Badge>
                          <span className="text-xs font-bold text-green-600">{(spot.score * 1000).toFixed(0)} pts</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">Lat: {spot.lat.toFixed(4)}, Lng: {spot.lng.toFixed(4)}</p>
                        <div className="mt-2 text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> View on Map
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Population Data Table */}
              {populationData && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" /> Demographic Breakdown
                  </h4>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
                        <tr>
                          <th className="p-3 font-bold">Region Type</th>
                          <th className="p-3 font-bold">Total Persons</th>
                          <th className="p-3 font-bold">Density (sq.km)</th>
                          <th className="p-3 font-bold">Households</th>
                          <th className="p-3 font-bold">Inhabited Villages</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border bg-white">
                        {populationData.map((item, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3 font-medium text-primary capitalize">{item.Type}</td>
                            <td className="p-3">{item.Persons?.toLocaleString()}</td>
                            <td className="p-3 font-mono">{item["Population per sq. km."]}</td>
                            <td className="p-3">{item["Number of households"]?.toLocaleString()}</td>
                            <td className="p-3 text-muted-foreground">{item["Number of villages Inhabited"]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- NEW: LABOUR & WORKFORCE ANALYSIS SECTION --- */}
  {labourData && labourData.length > 0 && (
    <div className="space-y-4 pb-8">
      <h4 className="text-sm font-bold flex items-center gap-2">
        <Briefcase className="w-4 h-4 text-muted-foreground" /> Workforce Distribution
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workforce Overview Cards */}
        <div className="space-y-3">
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
            <p className="text-[10px] uppercase font-bold text-blue-600 mb-1">Total Main Workers</p>
            <p className="text-xl font-bold">{labourData[0]?.["Main workers"]?.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-lg">
            <p className="text-[10px] uppercase font-bold text-purple-600 mb-1">Retail & Wholesale Sector</p>
            <p className="text-xl font-bold">{labourData[0]?.["Wholesale and retail"]?.toLocaleString()}</p>
          </div>
        </div>

        {/* Detailed Industry Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/50 border-b border-border uppercase text-muted-foreground">
              <tr>
                <th className="p-2 font-bold">Industry Sector</th>
                <th className="p-2 font-bold text-right">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {[
                { label: "Manufacturing", key: "Manufacturing" },
                { label: "Construction", key: "construction" },
                { label: "Accommodation & Food", key: "Accomodation and food" },
                { label: "Finance & Technical", key: "Finance, Real Estate, and Technical" },
                { label: "Education & Social", key: "Education and social services" }
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/20">
                  <td className="p-2 text-muted-foreground">{item.label}</td>
                  <td className="p-2 text-right font-medium">
                    {labourData[0]?.[item.key]?.toLocaleString() || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}
            </div>
          </div>
        )}
      </div>
    </div>
    {isComparing && (
      <ComparisonDashboard 
        data={comparisonData} 
        onClose={() => setIsComparisonMode(false)} 
      />
    )}
  </div>
);
}
