import { useChainId } from "wagmi";
import { base } from "wagmi/chains";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function NetworkStatus() {
  const chainId = useChainId();
  
  const isBaseNetwork = chainId === base.id;
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full",
        isBaseNetwork ? "border-green-500/50 text-green-500" : "border-red-500/50 text-red-500"
      )}
    >
      <span
        className={cn(
          "mr-1 h-2 w-2 rounded-full",
          isBaseNetwork ? "bg-green-500" : "bg-red-500"
        )}
      />
      {isBaseNetwork ? "Base Network" : "Wrong Network"}
    </Badge>
  );
}