import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  getProducts,
  searchProducts,
  getProductsByCategory,
  deleteProduct
} from '@/lib/api/products';
import { getCategories } from '@/lib/api/categories';
import useDebounce from '@/hooks/useDebounce';
import { useToast } from '@/context/ToastContext';

// Components
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import SearchBar from '@/components/products/SearchBar';
import FilterBar from '@/components/products/FilterBar';
import ProductGrid from '@/components/products/ProductGrid';
import Pagination from '@/components/products/Pagination';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  // --- URL State (with validation) ---
  const rawPage = parseInt(searchParams.get('page'), 10);
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

  const rawLimit = parseInt(searchParams.get('limit'), 10);
  const limit = [10, 20, 50].includes(rawLimit) ? rawLimit : 10;

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || 'asc';

  const updateParams = useCallback((newParams) => {
    setSearchParams((prev) => {
      const current = Object.fromEntries([...prev]);
      // Remove empty values to keep URL clean
      const merged = { ...current, ...newParams };
      Object.keys(merged).forEach((k) => {
        if (merged[k] === '' || merged[k] === undefined || merged[k] === null) {
          delete merged[k];
        }
      });
      return merged;
    });
  }, [setSearchParams]);

  // --- Local State ---
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const abortControllerRef = useRef(null);

  // --- Fetch Categories on mount ---
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // --- Fetch Products ---
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const skip = (page - 1) * limit;

      try {
        let res;
        if (debouncedSearch && category) {
          // API can't search + filter together — search then filter client-side
          res = await searchProducts({ q: debouncedSearch, limit: 100, skip: 0, signal });
          if (res && res.products) {
            let filtered = res.products.filter((p) => p.category === category);
            if (sortBy) {
              filtered.sort((a, b) => {
                const valA = a[sortBy];
                const valB = b[sortBy];
                if (valA < valB) return order === 'asc' ? -1 : 1;
                if (valA > valB) return order === 'asc' ? 1 : -1;
                return 0;
              });
            }
            setTotal(filtered.length);
            setProducts(filtered.slice(skip, skip + limit));
          } else {
            setProducts([]);
            setTotal(0);
          }
        } else if (debouncedSearch) {
          res = await searchProducts({ q: debouncedSearch, limit, skip, signal });
          setProducts(res.products || []);
          setTotal(res.total || 0);
        } else if (category) {
          res = await getProductsByCategory({ category, limit, skip, sortBy, order, signal });
          setProducts(res.products || []);
          setTotal(res.total || 0);
        } else {
          res = await getProducts({ limit, skip, sortBy, order, signal });
          setProducts(res.products || []);
          setTotal(res.total || 0);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch, category, sortBy, order, page, limit]);

  // --- Clamp page if beyond total ---
  useEffect(() => {
    if (!loading && total > 0) {
      const totalPages = Math.ceil(total / limit);
      if (page > totalPages) {
        updateParams({ page: String(totalPages) });
      }
    }
  }, [total, limit, page, loading, updateParams]);

  // --- Handlers ---
  const handleSearchChange = (val) => {
    updateParams({ search: val, page: '1' });
  };

  const handleCategoryChange = (val) => {
    updateParams({ category: val, page: '1' });
  };

  const handleSortByChange = (val) => {
    updateParams({ sortBy: val });
  };

  const handleSortOrderChange = (val) => {
    updateParams({ order: val });
  };

  const handlePageSizeChange = (newSize) => {
    updateParams({ limit: String(newSize), page: '1' });
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setDeletedIds((prev) => [...prev, productToDelete.id]);
      addToast(`"${productToDelete.title}" deleted (demo mode — not persisted)`, 'success');
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      addToast('Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter out locally deleted items
  const displayProducts = products.filter((p) => !deletedIds.includes(p.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <Link to="/products/new">
          <Button variant="primary">+ Add Product</Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
        <SearchBar value={search} onChange={handleSearchChange} />
        <FilterBar
          category={category}
          sortBy={sortBy}
          sortOrder={order}
          categories={categories}
          onCategoryChange={handleCategoryChange}
          onSortByChange={handleSortByChange}
          onSortOrderChange={handleSortOrderChange}
        />
      </div>

      {/* Info banner for combined search+filter */}
      {debouncedSearch && category && (
        <div className="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg text-indigo-300 text-sm">
          ℹ Results filtered locally by category (API limitation).
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="py-16 text-center space-y-4">
          <p className="text-red-400">⚠ {error}</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="py-16 text-center text-slate-400 bg-slate-800/20 rounded-xl border border-slate-700/50 border-dashed">
          <div className="text-4xl mb-3 opacity-50">📦</div>
          No products found matching your criteria.
        </div>
      ) : (
        <>
          <ProductGrid products={displayProducts} onDelete={confirmDelete} />
          <Pagination
            currentPage={page}
            totalItems={total}
            pageSize={limit}
            onPageChange={(p) => updateParams({ page: String(p) })}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
