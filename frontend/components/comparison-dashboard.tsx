'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ComparisonDashboardProps {
  data: any[];
  onClose: () => void;
}

export function ComparisonDashboard({ data, onClose }: ComparisonDashboardProps) {
  if (data.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4" 
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>
        
        <CardHeader>
          <CardTitle className="text-2xl">Market Comparison</CardTitle>
          <CardDescription>Side-by-side analysis of selected districts</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Population Density Comparison */}
            <div className="h-[300px]">
              <h4 className="text-sm font-bold mb-4 text-center">Population Density (per sq.km)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="density" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rent Comparison */}
            <div className="h-[300px]">
              <h4 className="text-sm font-bold mb-4 text-center">Avg. Commercial Rent (₹)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rent" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Workforce Comparison */}
            <div className="h-[300px]">
              <h4 className="text-sm font-bold mb-4 text-center">Retail Workforce Established</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="district" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="retail_workers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Table */}
            <div className="overflow-x-auto">
              <h4 className="text-sm font-bold mb-4">Metric Summary</h4>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left p-2">District</th>
                    <th className="text-right p-2">Population</th>
                    <th className="text-right p-2">Density</th>
                    <th className="text-right p-2">Avg Rent</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-2 font-medium">{d.district}</td>
                      <td className="p-2 text-right">{d.population?.toLocaleString()}</td>
                      <td className="p-2 text-right">{d.density}</td>
                      <td className="p-2 text-right">₹{d.rent?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
