
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useStore } from "@/contexts/StoreContext";
import { Product } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductForm } from "@/components/admin/ProductForm";

export default function Products() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductPublished, 
    formatAdminPrice, 
    adminCurrency, 
    setAdminCurrency 
  } = useStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Open dialog in add mode
  const handleAddProduct = () => {
    setIsEditMode(false);
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  // Open dialog in edit mode
  const handleEditProduct = (product: Product) => {
    setIsEditMode(true);
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  // Handle product form submission
  const handleProductSubmit = async (productData: Omit<Product, "id">, imageFile: File | null) => {
    if (isEditMode && selectedProduct) {
      // Update product
      await updateProduct({ id: selectedProduct.id, ...productData }, imageFile);
    } else {
      // Add product
      await addProduct(productData, imageFile);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
  };

  // Handle toggle published status
  const handleTogglePublished = async (productId: string) => {
    await toggleProductPublished(productId);
  };

  return (
    <AdminLayout>
      <div className="animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Products</h2>
          <Button onClick={handleAddProduct}>Add Product</Button>
        </div>

        <ProductTable 
          products={products}
          formatAdminPrice={formatAdminPrice}
          adminCurrency={adminCurrency}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onTogglePublished={handleTogglePublished}
        />

        <ProductForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleProductSubmit}
          isEditMode={isEditMode}
          initialProduct={selectedProduct}
          adminCurrency={adminCurrency}
        />
      </div>
    </AdminLayout>
  );
}
