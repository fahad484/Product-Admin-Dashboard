import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useEffect } from 'react';
// export default function NotFoundPage() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//       <h1 className="text-8xl font-bold text-indigo-500/30 mb-4 tracking-tighter">404</h1>
//       <h2 className="text-2xl font-semibold text-slate-200 mb-2">Page Not Found</h2>
//       <p className="text-slate-400 mb-8 max-w-md mx-auto">
//         The page you are looking for does not exist or has been moved.
//       </p>
      
//       <Link to="/products">
//         <Button variant="primary" size="lg">
//           Go to Products
//         </Button>
//       </Link>
//     </div>
//   );
// }
export default function NotFoundPage() {
  useEffect(() => {
    window.location.href =
      '/Product-Admin-Dashboard/#/login';
  }, []);

  return null;
}