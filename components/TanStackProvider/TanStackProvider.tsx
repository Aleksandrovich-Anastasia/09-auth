'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, hydrate } from '@tanstack/react-query';

interface TanStackProviderProps {
  children: ReactNode;
  dehydratedState?: unknown; 
}

const TanStackProvider = ({ children, dehydratedState }: TanStackProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  if (dehydratedState) {
    hydrate(queryClient, dehydratedState);
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default TanStackProvider;
