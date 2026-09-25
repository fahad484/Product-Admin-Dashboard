import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct, addProduct, updateProduct } from '@/lib/api/products';
import { useToast } from '@/context/ToastContext';
import ProductForm from '@/components/products/ProductForm';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const res = await getProduct(id);
          setProduct(res);
        } catch (err) {
          setError('Failed to load product for editing');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateProduct(id, formData);
        addToast('Product updated (demo mode — not persisted by API)', 'success');
        navigate(`/products/${id}`);
      } else {
        await addProduct(formData);
        addToast('Product added (demo mode — not persisted by API)', 'success');
        navigate('/products');
      }
    } catch (err) {
      addToast('Failed to save product', 'error');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-900/20 border border-red-900/50 rounded-xl max-w-2xl mx-auto mt-12">
        <p className="text-red-400 mb-4">⚠ {error}</p>
        <Link to="/products">
          <Button variant="secondary">Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to={isEditMode ? `/products/${id}` : '/products'}
        className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2 transition-colors text-sm"
      >
        ← {isEditMode ? 'Back to Product' : 'Back to Products'}
      </Link>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>

        <ProductForm
          initialData={isEditMode ? product : null}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
