
import { toast } from 'sonner';
import { DrawSupportResistanceParams, SupportResistance } from './types';

export function drawSupportResistanceLines({ 
  chart, 
  supportResistance, 
  language 
}: DrawSupportResistanceParams): void {
  try {
    // Support line
    chart.createShape(
      { price: supportResistance.support },
      { 
        shape: "horizontal_line", 
        lock: true,
        disableSelection: true,
        overrides: { 
          linecolor: "#22c55e",
          linestyle: 2, // dashed line
          linewidth: 1,
          showPriceLabel: true,
          text: language === 'pt-br' ? "Suporte" : "Support"
        }
      }
    );
    
    // Resistance line
    chart.createShape(
      { price: supportResistance.resistance },
      { 
        shape: "horizontal_line", 
        lock: true,
        disableSelection: true,
        overrides: { 
          linecolor: "#ef4444",
          linestyle: 2, // dashed line
          linewidth: 1,
          showPriceLabel: true,
          text: language === 'pt-br' ? "Resistência" : "Resistance"
        }
      }
    );
    
    console.log("Added support and resistance lines");
  } catch (e) {
    console.error("Error creating support/resistance lines:", e);
  }
}
