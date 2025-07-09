import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary"></div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Directory Pro</h1>
                <p className="text-sm text-muted-foreground">Realtor Service Directory</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}