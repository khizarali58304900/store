
import React from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";

interface ProductRowProps {
  product: Product;
  formatAdminPrice: (price: number) => string;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onTogglePublished: (productId: string) => void;
}

export function ProductRow({
  product,
  formatAdminPrice,
  onEdit,
  onDelete,
  onTogglePublished,
}: ProductRowProps) {
  return (
    <TableRow key={product.id}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="h-10 w-10 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=No+Image";
              }}
            />
          )}
          {product.name}
        </div>
      </TableCell>
      <TableCell>{formatAdminPrice(product.price)}</TableCell>
      <TableCell>{product.stock}</TableCell>
      <TableCell>
        <Switch
          checked={product.published}
          onCheckedChange={() => onTogglePublished(product.id)}
        />
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(product)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(product.id)}
          className="ml-2"
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}
