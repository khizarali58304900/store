
import React, { useState } from "react";
import { Product } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (productData: Omit<Product, "id">, imageFile: File | null) => Promise<void>;
  isEditMode: boolean;
  initialProduct?: Product | null;
  adminCurrency: { code: string };
}

export function ProductForm({
  open,
  onOpenChange,
  onSubmit,
  isEditMode,
  initialProduct,
  adminCurrency,
}: ProductFormProps) {
  const [productName, setProductName] = useState(initialProduct?.name || "");
  const [productDescription, setProductDescription] = useState(initialProduct?.description || "");
  const [productPrice, setProductPrice] = useState(initialProduct?.price.toString() || "");
  const [productImage, setProductImage] = useState(initialProduct?.image || "");
  const [productStock, setProductStock] = useState(initialProduct?.stock.toString() || "");
  const [productShippingCost, setProductShippingCost] = useState(initialProduct?.shippingCost.toString() || "");
  const [isPublished, setIsPublished] = useState(initialProduct?.published || false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploadType, setImageUploadType] = useState<"file" | "url">(initialProduct?.image ? "url" : "file");

  // Reset form when initialProduct changes
  React.useEffect(() => {
    if (initialProduct) {
      setProductName(initialProduct.name);
      setProductDescription(initialProduct.description);
      setProductPrice(initialProduct.price.toString());
      setProductImage(initialProduct.image);
      setProductStock(initialProduct.stock.toString());
      setProductShippingCost(initialProduct.shippingCost.toString());
      setIsPublished(initialProduct.published);
      setImageUploadType(initialProduct.image ? "url" : "file");
    } else {
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductImage("");
      setProductStock("");
      setProductShippingCost("");
      setIsPublished(false);
      setImageUploadType("file");
    }
    setImageFile(null);
  }, [initialProduct, open]);

  // Handle image file selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
      // Show preview of selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProductImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
      toast.info("Image selected. Will be uploaded when you save the product.");
    }
  };

  // Handle product form submission
  const handleProductSubmit = async () => {
    try {
      // Basic validation
      if (!productName.trim()) {
        toast.error("Product name is required");
        return;
      }

      if (!productPrice || isNaN(parseFloat(productPrice))) {
        toast.error("Valid price is required");
        return;
      }

      if (!productStock || isNaN(parseInt(productStock))) {
        toast.error("Valid stock quantity is required");
        return;
      }

      // For URL type upload with no file, we need a valid URL
      if (imageUploadType === "url" && !imageFile && !productImage) {
        toast.error("Please enter a valid image URL");
        return;
      }

      const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        image: productImage,
        stock: parseInt(productStock),
        published: isPublished,
        shippingCost: parseFloat(productShippingCost) || 0,
      };

      await onSubmit(productData, imageFile);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Failed to save product. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price ({adminCurrency.code})
            </Label>
            <Input
              id="price"
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          {/* Image upload section with tabs */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2">
              Image
            </Label>
            <div className="col-span-3">
              <Tabs defaultValue={imageUploadType} onValueChange={(val) => setImageUploadType(val as "file" | "url")}>
                <TabsList className="mb-2">
                  <TabsTrigger value="file">Upload File</TabsTrigger>
                  <TabsTrigger value="url">Use URL</TabsTrigger>
                </TabsList>
                <TabsContent value="file">
                  <Input
                    type="file"
                    id="image-file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                </TabsContent>
                <TabsContent value="url">
                  <Input
                    id="image-url"
                    placeholder="https://example.com/image.jpg"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                  />
                </TabsContent>
              </Tabs>
              
              {/* Image preview */}
              {(productImage || imageFile) && (
                <div className="mt-2 border rounded-md p-2">
                  <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                  <img 
                    src={productImage} 
                    alt="Product preview" 
                    className="h-24 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=Invalid+Image";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input
              id="stock"
              type="number"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shippingCost" className="text-right">
              Shipping Cost ({adminCurrency.code})
            </Label>
            <Input
              id="shippingCost"
              type="number"
              value={productShippingCost}
              onChange={(e) => setProductShippingCost(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="published" className="text-right">
              Published
            </Label>
            <div className="col-span-3 flex items-center">
              <Switch
                id="published"
                checked={isPublished}
                onCheckedChange={() => setIsPublished(!isPublished)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleProductSubmit}>
            {isEditMode ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
