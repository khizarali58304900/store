
import React from "react";
import { Product } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ProductRow } from "./ProductRow";

interface ProductTableProps {
  products: Product[];
  formatAdminPrice: (price: number) => string;
  adminCurrency: { code: string };
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onTogglePublished: (productId: string) => void;
}

export function ProductTable({
  products,
  formatAdminPrice,
  adminCurrency,
  onEdit,
  onDelete,
  onTogglePublished,
}: ProductTableProps) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price ({adminCurrency.code})</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              formatAdminPrice={formatAdminPrice}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePublished={onTogglePublished}
            />
          ))}

          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
