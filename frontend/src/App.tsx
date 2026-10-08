import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { EvaluationPage } from './pages/EvaluationPage';
import { ExampleReadingPage } from './pages/ExampleReadingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LandingPage } from './pages/LandingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PaymentReturnPage } from './pages/PaymentReturnPage';
import { ResultPage } from './pages/ResultPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/evaluacion', element: <EvaluationPage /> },
      { path: '/payment/return', element: <PaymentReturnPage /> },
      { path: '/resultado', element: <ResultPage /> },
      { path: '/como-funciona', element: <HowItWorksPage /> },
      { path: '/lectura-ejemplo', element: <ExampleReadingPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
