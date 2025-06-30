import { FileText } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <FileText className="h-7 w-7 text-accent" />
      <h1 className="text-2xl font-bold font-headline text-primary-foreground">
        Invoice<span className="text-accent">AI</span>
      </h1>
    </div>
  );
}

export function LogoHorizontal() {
  return (
    <div className="flex items-center gap-2">
      <FileText className="h-7 w-7 text-primary" />
      <h1 className="text-2xl font-bold font-headline text-primary">
        Invoice<span className="text-accent">AI</span>
      </h1>
    </div>
  );
}
