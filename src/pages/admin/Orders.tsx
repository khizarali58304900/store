
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStore } from "@/contexts/StoreContext";
import { Order, OrderStatus } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Orders() {
  const { orders, products, updateOrderStatus, formatPrice } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Get product details for an order
  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Handle status update
  const handleStatusChange = (status: OrderStatus) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, status);
      setSelectedOrder({
        ...selectedOrder,
        status,
      });
    }
  };

  // Handle order cancellation
  const handleCancelOrder = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, "Order Cancelled");
      setSelectedOrder({
        ...selectedOrder,
        status: "Order Cancelled",
      });
      toast.success("Order has been cancelled");
    }
  };

  return (
    <AdminLayout>
      <div className="animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Orders</h2>
        </div>
        
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.trackingId}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.userEmail}</TableCell>
                  <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell>
                    <div className={`
                      px-2 py-1 rounded-full text-xs text-white inline-block
                      ${order.status === 'Order Delivered' ? 'bg-green-500' : 
                        order.status === 'Order Cancelled' ? 'bg-red-500' : 'bg-blue-500'}
                    `}>
                      {order.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Tracking ID</p>
                    <p>{selectedOrder.trackingId}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Order Date</p>
                    <p>{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Customer Email</p>
                    <p>{selectedOrder.userEmail}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Customer Phone</p>
                    <p>{selectedOrder.userPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold">Shipping Address</p>
                    <p>{selectedOrder.landmark}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Products</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.products.map((item) => {
                        const product = getProductDetails(item.productId);
                        return (
                          <TableRow key={item.productId}>
                            <TableCell>{product?.name || "Unknown Product"}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell colSpan={2} className="font-semibold">Shipping</TableCell>
                        <TableCell className="text-right">{formatPrice(selectedOrder.shippingCost)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2} className="font-semibold">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatPrice(selectedOrder.totalAmount)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Order Status</h3>
                  <div className="flex items-center space-x-4">
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => handleStatusChange(value as OrderStatus)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Order Placed">Order Placed</SelectItem>
                        <SelectItem value="Order Packed">Order Packed</SelectItem>
                        <SelectItem value="Order Shipped">Order Shipped</SelectItem>
                        <SelectItem value="Order Delivered">Order Delivered</SelectItem>
                        <SelectItem value="Order Cancelled">Order Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="destructive"
                      onClick={handleCancelOrder}
                      disabled={selectedOrder.status === "Order Cancelled"}
                    >
                      Cancel Order
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
