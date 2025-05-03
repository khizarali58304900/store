
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";

// Status steps with icons
const statusSteps = [
  { key: "Order Placed", label: "Order Placed" },
  { key: "Order Packed", label: "Order Packed" },
  { key: "Order Shipped", label: "Order Shipped" },
  { key: "Order Delivered", label: "Order Delivered" }
];

export default function TrackOrder() {
  const [trackingId, setTrackingId] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const { getOrderByTrackingId } = useStore();
  const [order, setOrder] = useState<ReturnType<typeof getOrderByTrackingId>>(undefined);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      toast.error("Please enter a tracking ID");
      return;
    }
    
    setIsTracking(true);
    
    const foundOrder = getOrderByTrackingId(trackingId);
    
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      toast.error("No order found with this tracking ID");
      setOrder(undefined);
    }
    
    setIsTracking(false);
  };

  // Get current status index for progress display
  const getCurrentStatusIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex(step => step.key === order.status);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Enter Your Tracking ID</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g., KS123456"
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isTracking}
                  className="bg-kstore-purple hover:bg-kstore-dark-purple"
                >
                  {isTracking ? "Tracking..." : "Track"}
                </Button>
              </div>
            </form>
            
            {order && (
              <div className="mt-8 space-y-6 animate-slideUp">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <p className="text-sm"><span className="font-medium">Tracking ID:</span> {order.trackingId}</p>
                  <p className="text-sm"><span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm"><span className="font-medium">Total Amount:</span> ${order.totalAmount.toFixed(2)}</p>
                </div>
                
                <div className="relative">
                  <h3 className="font-medium mb-4">Order Status</h3>
                  
                  {/* Status Timeline */}
                  <div className="space-y-8">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getCurrentStatusIndex();
                      const isActive = index <= currentIndex;
                      
                      return (
                        <div key={step.key} className="flex items-center">
                          <div 
                            className={`rounded-full h-8 w-8 flex items-center justify-center ${
                              isActive ? 'bg-kstore-purple text-white' : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="ml-4">
                            <p className={`font-medium ${isActive ? 'text-kstore-purple' : 'text-gray-500'}`}>
                              {step.label}
                            </p>
                            {index === currentIndex && (
                              <p className="text-sm text-gray-500">Current status</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Vertical line connecting circles */}
                    <div className="absolute h-full top-0 left-4 transform -translate-x-1/2 -z-10">
                      <div className="h-full w-0.5 bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
