import React, { startTransition } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routeController } from './routes/route';

export default function App() : React.ReactNode {

  const [csrfToken, setScrfToken] = React.useState<string | null>(null);
  React.useEffect(() => {
    const csrfTokens = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    startTransition(() => {
      if (csrfTokens) {
        setScrfToken(csrfTokens);
      }
    })
  }, [csrfToken])

  return (
    <React.Fragment>
      <React.Suspense fallback={<><h1>Loading Component</h1></>}>
        <RouterProvider
          router={createBrowserRouter(routeController)} />
      </React.Suspense>
    </React.Fragment>
  )
}

