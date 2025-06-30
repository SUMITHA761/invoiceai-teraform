import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CustomerChat } from '@/components/customer-chat';

export default function InvoicesPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Create New Invoice</CardTitle>
          <CardDescription>
            Answer the questions below to gather customer details for the new invoice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerChat />
        </CardContent>
      </Card>
    </div>
  );
}
