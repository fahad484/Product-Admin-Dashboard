import { useState, useEffect } from 'react';

export default function ProductForm({ initialData, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    brand: '',
    thumbnail: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        category: initialData.category || '',
        stock: initialData.stock !== undefined ? initialData.stock : '',
        brand: initialData.brand || '',
        thumbnail: initialData.thumbnail || ''
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    }
    if (!formData.description) {
      newErrors.description = 'Description is required.';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number.';
    }
    if (formData.stock && (Number(formData.stock) < 0 || !Number.isInteger(Number(formData.stock)))) {
      newErrors.stock = 'Stock must be a non-negative integer.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    
    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: formData.stock ? Number(formData.stock) : 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";

  return (
    <div className="bg-slate-800/20 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="Product title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={inputClass}
              placeholder="Product description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={inputClass}
              placeholder="0.00"
            />
            {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={inputClass}
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-400">{errors.stock}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. smartphones"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Apple"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Thumbnail URL</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-700">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : initialData ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
