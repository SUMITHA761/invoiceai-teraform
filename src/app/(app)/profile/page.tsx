'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, MessageSquare } from 'lucide-react';

export default function ProfilePage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const invoiceTemplates = Array.from({ length: 15 }, (_, i) => `Template ${i + 1}`);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Company Profile</CardTitle>
          <CardDescription>
            Update your company details. This information will appear on your invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="InvoiceAI Inc." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gst-number">GST Number</Label>
                <Input id="gst-number" defaultValue="22AAAAA0000A1Z5" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue="123 Innovation Drive, Tech City, 12345" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="contact-number">Contact Number</Label>
                <Input id="contact-number" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="support-number">Customer Support Number</Label>
                <Input id="support-number" type="tel" defaultValue="+1 (555) 765-4321" />
              </div>
            </div>

             <div className="grid gap-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                   <div className="relative h-20 w-20 rounded-md border flex items-center justify-center bg-muted">
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Logo Preview" layout="fill" objectFit="contain" className="rounded-md" />
                    ) : (
                       <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                   </div>
                  <Input id="logo" type="file" className="max-w-xs" onChange={handleLogoChange} accept="image/*" />
                </div>
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="invoice-template">Invoice Template</Label>
                    <Select defaultValue="Template 1">
                        <SelectTrigger id="invoice-template">
                        <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                        {invoiceTemplates.map(template => (
                            <SelectItem key={template} value={template}>
                            {template}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="template-instructions" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Conversational Template Instructions
              </Label>
              <Textarea
                id="template-instructions"
                placeholder="e.g., 'Add our company tagline at the bottom.' or 'Make the due date bold.'"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end">
              <Button className="bg-accent hover:bg-accent/90">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
