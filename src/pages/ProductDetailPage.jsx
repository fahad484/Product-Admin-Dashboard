import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct, deleteProduct } from '@/lib/api/products';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [mainImage, setMainImage] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);
      try {
        const res = await getProduct(id);
        if (res && res.id) {
          setProduct(res);
          setMainImage(res.thumbnail || (res.images && res.images[0]) || '');
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load product details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      addToast('Product deleted (demo mode — not persisted)', 'success');
      setDeleteModalOpen(false);
      navigate('/products');
    } catch (err) {
      addToast('Failed to delete product', 'error');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-slate-700/50 max-w-2xl mx-auto mt-12">
        <div className="text-5xl mb-4 opacity-50">🔍</div>
        <h2 className="text-2xl font-bold text-slate-200 mb-2">Product Not Found</h2>
        <p className="text-slate-400 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products">
          <Button variant="primary">Back to Products</Button>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-red-900/20 border border-red-900/50 rounded-xl max-w-2xl mx-auto mt-12">
        <p className="text-red-400 mb-4">⚠ {error}</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link to="/products" className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2 transition-colors text-sm">
        ← Back to Products
      </Link>

      {/* Main content */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        {/* Images */}
        <div className="lg:w-1/2 flex flex-col gap-4">
          <div className="aspect-square rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
            {mainImage ? (
              <img src={mainImage} alt={product.title} className="object-contain w-full h-full" />
            ) : (
              <div className="text-slate-500">No Image</div>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    mainImage === img ? 'border-indigo-500' : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium capitalize">
              {product.category}
            </span>
            {product.discountPercentage > 0 && (
              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{product.title}</h1>

          <div className="text-3xl font-bold text-green-400 mb-4">
            ${product.price?.toFixed(2)}
          </div>

          <p className="text-slate-400 mb-6 leading-relaxed text-sm">{product.description}</p>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Brand</div>
              <div className="text-sm font-medium text-slate-200">{product.brand || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">SKU</div>
              <div className="text-sm font-medium text-slate-200">{product.sku || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Stock</div>
              <div className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Rating</div>
              <div className="text-sm font-medium text-amber-400">{product.rating} ⭐</div>
            </div>
            {product.availabilityStatus && (
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Availability</div>
                <div className="text-sm font-medium text-slate-200">{product.availabilityStatus}</div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-auto flex gap-3 pt-4 border-t border-slate-700/50">
            <Link to={`/products/${id}/edit`} className="flex-1">
              <Button variant="secondary" fullWidth>Edit</Button>
            </Link>
            <Button variant="danger" className="flex-1" onClick={() => setDeleteModalOpen(true)}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Reviews ({product.reviews.length})</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="bg-slate-800/30 border border-slate-700/50 p-5 rounded-xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-slate-200 text-sm">{review.reviewerName}</div>
                    <div className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-0.5 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? 'opacity-100' : 'opacity-20'}>⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 text-sm italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
