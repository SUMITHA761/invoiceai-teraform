import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProductsClient } from '@/components/products-client';

export default function ProductsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Product Management</CardTitle>
          <CardDescription>
            Add, edit, and manage your products and services here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductsClient />
        </CardContent>
      </Card>
    </div>
  );
}
