
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/StoreContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Index() {
  const { products, formatPrice, loading } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter published products and apply search query
  const publishedProducts = products.filter(p => p.published);
  const filteredProducts = searchQuery
    ? publishedProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : publishedProducts;
  
  const handleBuyNow = (product: Product) => {
    // Store selected product in localStorage
    localStorage.setItem('kstore-selected-product', JSON.stringify(product));
    navigate('/checkout');
  };

  return (
    <Layout>
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-4xl font-bold text-kstore-dark-purple mb-4">
          Welcome to KStore
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our curated collection of premium products with fast shipping and 
          exceptional customer service.
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-kstore-purple animate-spin" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`product-card animate-entry staggered-item`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="h-full flex flex-col">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </div>
                
                <CardContent className="flex-1 p-4">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                  <p className="font-bold text-kstore-purple mt-4">{formatPrice(product.price)}</p>
                </CardContent>
                
                <CardFooter className="border-t p-4">
                  <Button 
                    className="bg-kstore-orange hover:bg-orange-600 w-full" 
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-600">
            {searchQuery ? "No matching products found" : "No products available"}
          </h2>
          <p className="text-gray-500 mt-2">
            {searchQuery ? 'Try a different search term' : 'Check back soon for new items!'}
          </p>
          <div className="mt-8">
            <img 
              src="https://images.unsplash.com/photo-1633412802994-5c058f151b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Empty store" 
              className="mx-auto rounded-lg shadow-md max-w-md opacity-70"
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
