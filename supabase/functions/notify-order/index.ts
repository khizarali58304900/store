
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for allowing cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface for order notification request
interface OrderNotification {
  trackingId: string;
  userEmail: string;
  userPhone: string;
  landmark: string;
  status: string;
  totalAmount: number;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trackingId, userEmail, userPhone, landmark, status, totalAmount, products } = await req.json() as OrderNotification;
    
    // Log the order notification (in a real app, this would send an email)
    console.log('Order notification:', {
      trackingId,
      userEmail,
      userPhone,
      landmark,
      status,
      totalAmount,
      products
    });
    
    // In a production environment, you would connect to an email service
    // like Resend, SendGrid, etc., to send actual emails
    
    return new Response(
      JSON.stringify({ message: "Order notification processed successfully" }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
    
  } catch (error) {
    console.error('Error processing order notification:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      }
    );
  }
});
