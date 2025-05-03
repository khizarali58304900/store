
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  minimumLoadingTime?: number;
}

export default function LoadingScreen({ minimumLoadingTime = 2000 }: LoadingScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, minimumLoadingTime);

    return () => clearTimeout(timer);
  }, [minimumLoadingTime]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <img 
            src="/lovable-uploads/0e29d908-86b1-4b9b-80ac-f9f6d1eac5c7.png" 
            alt="Kstore Logo" 
            className="w-24 h-24 mx-auto animate-pulse"
          />
        </div>
        <h1 className="text-4xl font-bold text-white animate-fadeIn">Kstore</h1>
      </div>
    </div>
  );
}
