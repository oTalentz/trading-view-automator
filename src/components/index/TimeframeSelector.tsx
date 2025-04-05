
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the timeframes data with the new 1m and 5m options
const timeframes = [
  { value: "1", label: "1 Minuto" },
  { value: "5", label: "5 Minutos" },
  { value: "15", label: "15 Minutos" },
  { value: "30", label: "30 Minutos" },
  { value: "60", label: "1 Hora" },
  { value: "240", label: "4 Horas" },
  { value: "D", label: "1 Dia" },
  { value: "W", label: "1 Semana" },
];

interface TimeframeSelectorProps {
  interval: string;
  setInterval: (value: string) => void;
}

export function TimeframeSelector({ interval, setInterval }: TimeframeSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full sm:w-[180px]">
      <Select value={interval} onValueChange={setInterval}>
        <SelectTrigger>
          <SelectValue placeholder={t("selectTimeframe")} />
        </SelectTrigger>
        <SelectContent>
          {timeframes.map((tf) => (
            <SelectItem key={tf.value} value={tf.value}>
              {tf.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
