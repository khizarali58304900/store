
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";

export default function Checkout() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+92 ");
  const [landmark, setLandmark] = useState("");
  const { placeOrder, formatPrice } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const storedProduct = localStorage.getItem("kstore-selected-product");
    if (storedProduct) {
      setSelectedProduct(JSON.parse(storedProduct));
    } else {
      navigate("/");
      toast.error("Please select a product first");
    }
  }, [navigate]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast.error("No product selected");
      return;
    }
    
    if (!email || !phone || !landmark) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Place order
    const order = placeOrder({
      userId: "guest", // In a real app, this would be the user ID if logged in
      userEmail: email,
      userPhone: phone,
      products: [
        {
          productId: selectedProduct.id,
          quantity: 1,
          price: selectedProduct.price
        }
      ],
      totalAmount: selectedProduct.price + selectedProduct.shippingCost,
      shippingCost: selectedProduct.shippingCost,
      landmark: landmark
    });
    
    // Clear selected product
    localStorage.removeItem("kstore-selected-product");
    
    // Navigate to success page with tracking ID
    navigate(`/order-success?trackingId=${order.trackingId}`);
  };

  if (!selectedProduct) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-20 h-20 object-cover rounded" 
                  />
                  <div>
                    <h3 className="font-medium">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-500">{formatPrice(selectedProduct.price)}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedProduct.price)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>{formatPrice(selectedProduct.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-4 pt-4 border-t">
                    <span>Total</span>
                    <span>{formatPrice(selectedProduct.price + selectedProduct.shippingCost)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Checkout Form */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email Address*
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="youremail@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Phone Number*
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 3420785372"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="landmark" className="block text-sm font-medium">
                      Address/Landmark*
                    </label>
                    <Textarea
                      id="landmark"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Enter your complete address with landmark"
                      required
                    />
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      We offer Cash on Delivery. You'll pay when you receive your order.
                    </p>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-kstore-orange hover:bg-orange-600"
                    >
                      Place Order
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
