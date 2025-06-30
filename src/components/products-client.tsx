'use client';

import { useState, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, MoreHorizontal, Sparkles, Loader2, Trash2, Pencil } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getAIDescription } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Product name is required'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  inventory: z.coerce.number().int('Inventory must be a whole number'),
  description: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const initialProducts: Product[] = [
  { id: '1', name: 'Web Design Services', description: 'Comprehensive website design package.', price: 1500, inventory: 10 },
  { id: '2', name: 'Logo Design', description: 'Custom logo creation.', price: 500, inventory: 25 },
  { id: '3', name: 'Monthly SEO Retainer', description: 'Ongoing search engine optimization.', price: 750, inventory: 5 },
];

export function ProductsClient() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);

  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleAIDescription = async () => {
    const shortDescription = getValues("name");
    if (!shortDescription) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a product name first.",
      });
      return;
    }
    const formData = new FormData();
    formData.append('shortDescription', shortDescription);
    startTransition(async () => {
      const result = await getAIDescription(formData);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "AI Generation Failed",
          description: result.error,
        });
      } else if (result.description) {
        setValue('description', result.description);
        toast({
          title: "AI Description Generated",
          description: "The product description has been updated.",
        });
      }
    });
  };

  const handleFormSubmit: SubmitHandler<ProductFormData> = (data) => {
    if (editingProduct) {
      // Edit logic
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...data, id: p.id } : p));
      toast({ title: "Product Updated", description: `${data.name} has been successfully updated.` });
    } else {
      // Add logic
      const newProduct = { ...data, id: (products.length + 1).toString() };
      setProducts([...products, newProduct]);
      toast({ title: "Product Added", description: `${data.name} has been successfully added.` });
    }
    setDialogOpen(false);
  };
  
  const openDialog = (product: ProductFormData | null = null) => {
    setEditingProduct(product);
    reset(product || { name: '', price: 0, inventory: 0, description: '' });
    setDialogOpen(true);
  }

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({ title: "Product Deleted", description: "The product has been removed." });
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openDialog()} className="bg-accent hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.inventory}</TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openDialog(product)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the details of your product.' : 'Fill in the details for your new product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} />
                 {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="inventory">Inventory</Label>
                <Input id="inventory" type="number" {...register('inventory')} />
                {errors.inventory && <p className="text-sm text-destructive">{errors.inventory.message}</p>}
              </div>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <div className="relative">
                <Textarea id="description" {...register('description')} className="pr-10" />
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7 text-accent"
                    onClick={handleAIDescription}
                    disabled={isPending}
                    aria-label="Generate AI description"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                </Button>
              </div>
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-accent hover:bg-accent/90">{editingProduct ? 'Save Changes' : 'Add Product'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
