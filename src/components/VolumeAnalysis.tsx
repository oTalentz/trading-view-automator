
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/context/LanguageContext';
import { BarChart3, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface VolumeData {
  time: string;
  volume: number;
  abnormal: boolean;
}

interface VolumeAnalysisProps {
  symbol: string;
}

export function VolumeAnalysis({ symbol }: VolumeAnalysisProps) {
  const { t } = useLanguage();
  const [volumeData, setVolumeData] = React.useState<VolumeData[]>([]);
  
  React.useEffect(() => {
    // Simular dados de volume para demonstração
    const generateVolumeData = () => {
      const baseVolume = Math.random() * 1000 + 500;
      const data: VolumeData[] = [];
      
      for (let i = 0; i < 24; i++) {
        const hour = String(i).padStart(2, '0') + ':00';
        let volume = baseVolume + (Math.random() - 0.5) * baseVolume;
        
        // Criar alguns picos de volume anormais para demonstração
        const abnormal = Math.random() > 0.85;
        if (abnormal) {
          volume = baseVolume * (1.5 + Math.random() * 1.5);
        }
        
        data.push({
          time: hour,
          volume: Math.round(volume),
          abnormal
        });
      }
      
      setVolumeData(data);
    };
    
    generateVolumeData();
    const interval = setInterval(generateVolumeData, 60000); // Atualizar a cada minuto
    
    return () => clearInterval(interval);
  }, [symbol]);
  
  // Encontrar anomalias de volume
  const anomalies = volumeData.filter(d => d.abnormal);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border p-2 rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">{t("volume")}: {data.volume.toLocaleString()}</p>
          {data.abnormal && (
            <p className="text-xs flex items-center text-amber-500">
              <Zap className="h-3 w-3 mr-1" /> {t("abnormalVolume")}
            </p>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> {t("volumeAnalysis")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={volumeData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="volume" 
                fill="currentColor"
                className="fill-primary/80" 
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {anomalies.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-medium mb-2">{t("volumeAnomalies")}</h4>
            <div className="space-y-1">
              {anomalies.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 text-amber-500 mr-1" />
                    <span>{item.time}</span>
                  </div>
                  <span className="font-medium">{item.volume.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
