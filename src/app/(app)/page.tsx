import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Welcome to InvoiceAI</CardTitle>
          <CardDescription>
            Everything you need to manage your invoices in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Get started by adding your products or creating your first invoice.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/invoices" passHref>
              <Button className="w-full justify-start gap-2">
                <PlusCircle /> Create New Invoice
              </Button>
            </Link>
            <Link href="/products" passHref>
              <Button variant="secondary" className="w-full justify-start gap-2">
                <PlusCircle /> Add New Product
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Recent Activity</CardTitle>
            <CardDescription>You haven&apos;t created any invoices yet.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-center text-muted-foreground py-8">
                <p>No recent activity</p>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">Account Setup</CardTitle>
            <CardDescription>Complete your profile to get started.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p>Make sure your company details are up-to-date to ensure your invoices are professional and compliant.</p>
             <Link href="/profile" passHref>
                <Button variant="outline" className="w-full">
                  Go to Profile
                </Button>
             </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
