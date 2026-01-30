'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationMap } from '@/components/location-map';
import { Search, MapPin, Download, Loader2, Users } from 'lucide-react';
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
  
  const [mapData, setMapData] = useState<{ shops: any; blindspots: any } | null>(null);
  const [populationData, setPopulationData] = useState<any[] | null>(null); // NEW: Population State
  const [loading, setLoading] = useState(false);
  
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
    // 1. Fetch Map/Business Data
      const coordUrl = `http://127.0.0.1:8000/api/v1/coord/${currentDistrict.name.toLowerCase()}/${selectedCategory.type}/${selectedCategory.value}`;
      const coordRes = await fetch(coordUrl);
      const coordData = await coordRes.json();
      setMapData(coordData);

      // 2. Fetch Population Data using the District Code
      const popUrl = `http://127.0.0.1:8000/api/v1/population/${currentDistrict.code}`;
      const popRes = await fetch(popUrl);
      const popData = await popRes.json();
      setPopulationData(popData);

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

     
      yPosition += 15;
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Market Metrics', margin, yPosition);

      yPosition += 10;
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(10);

      

      
      yPosition += 10;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);

      yPosition += 10;
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(9);
      const footerText = 'This report was generated by Zonely - Location Analysis Platform';
      pdf.text(footerText, margin, pageHeight - 10);

    } catch (error) {
      console.error('[v0] PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
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

        <Button onClick={triggerAnalysis} disabled={loading} className="w-full bg-primary mt-4">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
          {loading ? "Analyzing..." : "Analyze Market"}
        </Button>

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
        {/* Map Area - Grows to fill space */}
        <div className="flex-1 relative border-b border-border">
          <LocationMap data={mapData || { shops: {}, blindspots: {} }} />
        </div>

        {/* Insight Panel - Fixed Height with Internal Scroll */}
        {(mapData || populationData) && (
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
              <Button variant="ghost" size="sm" onClick={() => {setMapData(null); setPopulationData(null)}}>Clear Data</Button>
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Top Row: Business Metrics */}
              {mapData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Existing Competition</p>
                    <p className="text-2xl font-bold text-foreground">{Object.keys(mapData.shops).length} <span className="text-sm font-normal text-muted-foreground">Outlets</span></p>
                  </div>
                  <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                    <p className="text-xs font-semibold text-green-700 uppercase mb-1">Expansion Gaps</p>
                    <p className="text-2xl font-bold text-green-600">{Object.keys(mapData.blindspots).length} <span className="text-sm font-normal">Blindspots</span></p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-xs font-semibold text-primary uppercase mb-1">Market Saturation</p>
                    <p className="text-xl font-bold text-primary">Moderate</p>
                  </div>
                </div>
              )}

              {/* Bottom Row: Population Data Table */}
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
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
