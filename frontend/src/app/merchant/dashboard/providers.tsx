'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ProductProvider } from './context/productContext';
import { AuthProvider } from '../context/authContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <AuthProvider>
        <ProductProvider>{children}</ProductProvider>
      </AuthProvider>
    </TooltipProvider>
  );
}
