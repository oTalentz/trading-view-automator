
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OTCAsset {
  value: string;
  label: string;
}

interface OTCAssetListProps {
  assets: OTCAsset[];
  selectedAsset: string;
  onAssetChange: (asset: string) => void;
}

export const OTCAssetList: React.FC<OTCAssetListProps> = ({
  assets,
  selectedAsset,
  onAssetChange
}) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      {assets.map((asset) => (
        <Button
          key={asset.value}
          variant="outline"
          className={cn(
            "justify-start h-9 px-3 w-full",
            selectedAsset === asset.value && "border-primary bg-primary/10"
          )}
          onClick={() => onAssetChange(asset.value)}
        >
          {asset.label}
        </Button>
      ))}
    </div>
  );
};
