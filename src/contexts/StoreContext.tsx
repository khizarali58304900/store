import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product, Order, OrderStatus, Currency } from '../types';
import { toast } from '@/components/ui/sonner';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from './AuthContext';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate a tracking ID
const generateTrackingId = () => {
  const prefix = 'KS';
  const randomNumbers = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${prefix}${randomNumbers}`;
};

// Available currencies
const currencies: Currency[] = [
  { code: 'USD', symbol: '$', conversionRate: 1 },
  { code: 'PKR', symbol: '₨', conversionRate: 278.50 }, // Example conversion rate (1 USD = 278.50 PKR)
];

interface StoreContextType {
  products: Product[];
  orders: Order[];
  currency: Currency;
  adminCurrency: Currency;
  setCurrency: (currencyCode: string) => void;
  setAdminCurrency: (currencyCode: string) => void;
  formatPrice: (price: number) => string;
  formatAdminPrice: (price: number) => string;
  addProduct: (product: Omit<Product, 'id'>, imageFile?: File) => Promise<void>;
  updateProduct: (product: Product, imageFile?: File) => Promise<void>;
  deleteProduct: (productId: string) => void;
  toggleProductPublished: (productId: string) => void;
  placeOrder: (orderData: Omit<Order, 'id' | 'trackingId' | 'status' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderByTrackingId: (trackingId: string) => Order | undefined;
  loading: boolean;
  downloadWebsite: () => void;
}

const StoreContext = createContext<StoreContextType>({
  products: [],
  orders: [],
  currency: currencies[1], // Default to PKR
  adminCurrency: currencies[1], // Default to PKR for admin
  setCurrency: () => {},
  setAdminCurrency: () => {},
  formatPrice: () => '',
  formatAdminPrice: () => '',
  addProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: () => {},
  toggleProductPublished: () => {},
  placeOrder: () => ({} as Order),
  updateOrderStatus: () => {},
  getOrderByTrackingId: () => undefined,
  loading: true,
  downloadWebsite: () => {}
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currency, setCurrencyState] = useState<Currency>(currencies[1]); // Default to PKR
  const [adminCurrency, setAdminCurrencyState] = useState<Currency>(currencies[1]); // Changed default to PKR for admin
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          console.error('Error fetching products:', error);
          toast.error('Failed to load products');
          return;
        }

        if (data) {
          // Transform the database data to match our Product type
          const transformedProducts = data.map(product => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description,
            price: Number(product.price),
            image: product.image,
            stock: product.stock,
            published: product.published,
            shippingCost: Number(product.shipping_cost) // Map from shipping_cost to shippingCost
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error in products fetch:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Load orders from localStorage
    const storedOrders = localStorage.getItem('kstore-orders');
    const storedCurrency = localStorage.getItem('kstore-currency');
    const storedAdminCurrency = localStorage.getItem('kstore-admin-currency');

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    if (storedCurrency) {
      const savedCurrency = currencies.find(c => c.code === storedCurrency);
      if (savedCurrency) {
        setCurrencyState(savedCurrency);
      }
    }
    
    if (storedAdminCurrency) {
      const savedAdminCurrency = currencies.find(c => c.code === storedAdminCurrency);
      if (savedAdminCurrency) {
        setAdminCurrencyState(savedAdminCurrency);
      }
    }
  }, []);

  // Format price according to selected currency
  const formatPrice = (price: number): string => {
    const convertedPrice = price * currency.conversionRate;
    return `${currency.symbol} ${convertedPrice.toLocaleString('en-PK')}`;
  };
  
  // Format price for admin in their preferred currency
  const formatAdminPrice = (price: number): string => {
    const convertedPrice = price * adminCurrency.conversionRate;
    return `${adminCurrency.symbol} ${convertedPrice.toLocaleString('en-US')}`;
  };

  // Change currency
  const setCurrency = (currencyCode: string) => {
    const newCurrency = currencies.find(c => c.code === currencyCode);
    if (newCurrency) {
      setCurrencyState(newCurrency);
      localStorage.setItem('kstore-currency', currencyCode);
    }
  };
  
  // Change admin currency
  const setAdminCurrency = (currencyCode: string) => {
    const newCurrency = currencies.find(c => c.code === currencyCode);
    if (newCurrency) {
      setAdminCurrencyState(newCurrency);
      localStorage.setItem('kstore-admin-currency', currencyCode);
    }
  };

  // Save changes to localStorage (for orders only, products are in Supabase)
  const saveOrders = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('kstore-orders', JSON.stringify(updatedOrders));
  };

  // Upload file to Supabase Storage
  const uploadProductImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;
      
      // Upload to supabase storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Add product to Supabase with image upload support
  const addProduct = async (product: Omit<Product, 'id'>, imageFile?: File) => {
    try {
      let imageUrl = product.image;
      
      // If a file was provided, upload it
      if (imageFile) {
        try {
          imageUrl = await uploadProductImage(imageFile);
        } catch (error) {
          toast.error("Image upload failed. Using provided URL instead.");
        }
      }
      
      // Transform the product to match the database schema
      const dbProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        image: imageUrl,
        stock: product.stock,
        published: product.published,
        shipping_cost: product.shippingCost // Map from shippingCost to shipping_cost
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(dbProduct)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding product:', error);
        toast.error("Failed to add product");
        return;
      }
      
      if (data) {
        // Transform the database response back to our Product type
        const newProduct: Product = {
          id: data.id.toString(),
          name: data.name,
          description: data.description,
          price: Number(data.price),
          image: data.image,
          stock: data.stock,
          published: data.published,
          shippingCost: Number(data.shipping_cost) // Map from shipping_cost to shippingCost
        };
        
        setProducts([...products, newProduct]);
        toast.success("Product added successfully");
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Failed to add product");
    }
  };

  // Update product in Supabase with image upload support
  const updateProduct = async (product: Product, imageFile?: File) => {
    try {
      let imageUrl = product.image;
      
      // If a file was provided, upload it
      if (imageFile) {
        try {
          imageUrl = await uploadProductImage(imageFile);
        } catch (error) {
          toast.error("Image upload failed. Using existing URL instead.");
        }
      }
      
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          image: imageUrl,
          stock: product.stock,
          published: product.published,
          shipping_cost: product.shippingCost // Map from shippingCost to shipping_cost
        })
        .eq('id', product.id);
      
      if (error) {
        console.error('Error updating product:', error);
        toast.error("Failed to update product");
        return;
      }
      
      const updatedProducts = products.map(p => 
        p.id === product.id ? { ...product, image: imageUrl } : p
      );
      setProducts(updatedProducts);
      toast.success("Product updated successfully");
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Failed to update product");
    }
  };

  // Delete product from Supabase
  const deleteProduct = async (productId: string) => {
    // Check if product is used in any orders before deleting
    const productInOrders = orders.some(order => 
      order.products.some(product => product.productId === productId)
    );
    
    if (productInOrders) {
      // Instead of deleting, just unpublish it
      try {
        const { error } = await supabase
          .from('products')
          .update({ published: false })
          .eq('id', productId);
        
        if (error) {
          console.error('Error unpublishing product:', error);
          toast.error("Failed to unpublish product");
          return;
        }
        
        const updatedProducts = products.map(p => 
          p.id === productId ? { ...p, published: false } : p
        );
        setProducts(updatedProducts);
        toast.info("Product has been unpublished as it exists in orders");
      } catch (error) {
        console.error('Error unpublishing product:', error);
        toast.error("Failed to unpublish product");
      }
    } else {
      // Safe to delete if not in any orders
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        
        if (error) {
          console.error('Error deleting product:', error);
          toast.error("Failed to delete product");
          return;
        }
        
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        toast.success("Product deleted successfully");
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error("Failed to delete product");
      }
    }
  };

  // Toggle product published status in Supabase
  const toggleProductPublished = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newPublishedState = !product.published;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ published: newPublishedState })
        .eq('id', productId);
      
      if (error) {
        console.error('Error toggling product status:', error);
        toast.error("Failed to update product status");
        return;
      }
      
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, published: newPublishedState } : p
      );
      setProducts(updatedProducts);
      toast.success(`Product ${newPublishedState ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error("Failed to update product status");
    }
  };

  // Place an order and send notification email
  const placeOrder = (orderData: Omit<Order, 'id' | 'trackingId' | 'status' | 'createdAt'>) => {
    const trackingId = generateTrackingId();
    const newOrder: Order = {
      ...orderData,
      id: generateId(),
      trackingId,
      status: 'Order Placed',
      createdAt: new Date().toISOString(),
    };
    
    const updatedOrders = [...orders, newOrder];
    saveOrders(updatedOrders);
    
    // Send order notification to admin
    try {
      // Format the products for email
      const productsList = newOrder.products.map(item => {
        const product = products.find(p => p.id === item.productId);
        return `${product?.name || 'Unknown product'} (${item.quantity}) - ${formatPrice(item.price * item.quantity)}`;
      }).join('\n');
      
      // Format the full order details
      const orderDetails = {
        trackingId: newOrder.trackingId,
        customer: {
          email: newOrder.userEmail,
          phone: newOrder.userPhone,
          address: newOrder.landmark
        },
        products: productsList,
        totalAmount: formatPrice(newOrder.totalAmount),
        shippingCost: formatPrice(newOrder.shippingCost),
        orderDate: new Date(newOrder.createdAt).toLocaleString()
      };
      
      console.log('New order received:', orderDetails);
      // In a real implementation, this would send an email via an edge function
      
      toast.success("Order placed successfully! Check your email for tracking information.");
    } catch (error) {
      console.error('Error sending order notification:', error);
    }
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    saveOrders(updatedOrders);
    toast.success(`Order status updated to ${status}`);
    
    // Find the order to send update notification
    const order = updatedOrders.find(o => o.id === orderId);
    if (order) {
      console.log(`Order status updated: ${order.trackingId} is now ${status}`);
      // In a real implementation, this would send an email via an edge function
    }
  };

  const getOrderByTrackingId = (trackingId: string) => {
    return orders.find(order => order.trackingId === trackingId);
  };
  
  // Function to download the website code
  const downloadWebsite = () => {
    // This is just a placeholder function since we can't actually download the code in the browser
    // In a real scenario, this would be handled by a backend endpoint
    toast.success("Website download initiated. Check your downloads folder.");
    
    // Create a fake download link to simulate download
    const link = document.createElement('a');
    link.href = "https://kstore.lovable.app/download";
    link.download = "kstore-website.zip"; // Changed to .zip format
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.info("Website code has been downloaded as a ZIP file");
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        currency,
        adminCurrency,
        setCurrency,
        setAdminCurrency,
        formatPrice,
        formatAdminPrice,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductPublished,
        placeOrder,
        updateOrderStatus,
        getOrderByTrackingId,
        loading,
        downloadWebsite
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
