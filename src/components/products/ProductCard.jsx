import { Link } from 'react-router-dom';

export default function ProductCard({ product, onDelete }) {
  return (
    <div className="flex flex-col bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-colors">
      <img src={product.thumbnail} alt={product.title} className="h-44 w-full object-cover bg-slate-700" />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="min-w-0 flex-1 mr-2">
            <h3 className="font-semibold text-white text-sm line-clamp-1">{product.title}</h3>
            <p className="text-xs text-slate-400 capitalize">{product.category?.replace(/-/g, ' ')}</p>
          </div>
          <span className="text-green-400 font-bold text-sm whitespace-nowrap">${product.price?.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between mb-4 text-xs">
          <span className="text-slate-300">{product.rating} ⭐</span>
          <span className={`font-medium ${
            product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-700/50 flex gap-2">
          <Link to={`/products/${product.id}`} className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-white py-1.5 rounded-lg text-xs font-medium transition-colors">
            View
          </Link>
          <Link to={`/products/${product.id}/edit`} className="flex-1 text-center bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-lg text-xs font-medium transition-colors">
            Edit
          </Link>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 text-center border border-red-500/40 text-red-400 hover:bg-red-500/10 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
