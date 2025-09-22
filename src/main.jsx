import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.jsx';

import useRewardStore from './store/rewardStore';
if (import.meta?.env?.DEV) {
    window.__USE_REWARD_STORE = useRewardStore;
}

const client = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,
            gcTime: 300_000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={client}>
            <App />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    </StrictMode>
);
