
import AdminLayout from "@/components/layout/AdminLayout";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { products, orders } = useStore();
  
  const publishedProducts = products.filter(p => p.published).length;
  const totalProducts = products.length;
  
  const pendingOrders = orders.filter(o => 
    o.status !== "Order Delivered"
  ).length;
  
  const totalOrders = orders.length;
  
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount, 
    0
  );

  return (
    <AdminLayout>
      <div className="animate-fadeIn">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{totalProducts}</p>
                  <p className="text-sm text-gray-500">{publishedProducts} published</p>
                </div>
                <Package className="h-10 w-10 text-kstore-purple opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                  <p className="text-sm text-gray-500">{pendingOrders} pending</p>
                </div>
                <ShoppingCart className="h-10 w-10 text-kstore-purple opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Total sales</p>
                </div>
                <Truck className="h-10 w-10 text-kstore-purple opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders
                    .slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((order) => (
                      <div 
                        key={order.id} 
                        className="border-b pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{order.trackingId}</p>
                            <p className="text-sm text-gray-500">
                              {order.userEmail}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                            <div className={`
                              text-xs px-2 py-1 rounded-full text-white inline-block
                              ${order.status === 'Order Delivered' ? 'bg-green-500' : 'bg-blue-500'}
                            `}>
                              {order.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  
                  <div className="pt-2">
                    <Link 
                      to="/admin/orders"
                      className="text-kstore-purple hover:underline text-sm"
                    >
                      View all orders →
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No orders yet</p>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/admin/products">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium">Manage Products</h3>
                    <p className="text-sm text-gray-500">Add, edit, or remove products</p>
                  </div>
                </Link>
                
                <Link to="/admin/orders">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium">Process Orders</h3>
                    <p className="text-sm text-gray-500">Update status and manage orders</p>
                  </div>
                </Link>
                
                <Link to="/">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium">View Store</h3>
                    <p className="text-sm text-gray-500">See your store as customers do</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
