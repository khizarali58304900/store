
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const trackingId = searchParams.get("trackingId");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!trackingId) {
      navigate("/");
    }
  }, [trackingId, navigate]);

  if (!trackingId) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto py-12 animate-fadeIn">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Order Placed Successfully!</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              Thank you for your order. We've sent a confirmation email with all the details.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500 mb-2">Your Tracking ID</p>
              <p className="text-xl font-mono font-bold">{trackingId}</p>
              <p className="text-sm text-gray-500 mt-2">
                Save this ID to track your order status
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={() => navigate("/track")}
                className="bg-kstore-purple hover:bg-kstore-dark-purple"
              >
                Track Your Order
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
