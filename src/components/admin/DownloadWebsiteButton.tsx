
import { Button } from "@/components/ui/button";
import { FileArchive } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export function DownloadWebsiteButton() {
  const { downloadWebsite } = useStore();
  
  return (
    <Button 
      onClick={downloadWebsite}
      className="bg-kstore-purple hover:bg-kstore-dark-purple"
    >
      <FileArchive className="mr-2 h-4 w-4" />
      Download Website Code
    </Button>
  );
}
