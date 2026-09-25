import { Link } from 'react-router-dom';

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800/20">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 border-b border-slate-700/50">
          <tr>
            <th scope="col" className="px-5 py-3">Image</th>
            <th scope="col" className="px-5 py-3">Title</th>
            <th scope="col" className="px-5 py-3">Category</th>
            <th scope="col" className="px-5 py-3">Price</th>
            <th scope="col" className="px-5 py-3">Rating</th>
            <th scope="col" className="px-5 py-3">Stock</th>
            <th scope="col" className="px-5 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/30">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
              <td className="px-5 py-3">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-10 w-10 rounded-lg object-cover bg-slate-700"
                />
              </td>
              <td className="px-5 py-3 font-medium text-white max-w-[200px]">
                <Link to={`/products/${product.id}`} className="hover:text-indigo-400 transition-colors line-clamp-1">
                  {product.title}
                </Link>
              </td>
              <td className="px-5 py-3 capitalize text-slate-400 text-xs">
                {product.category?.replace(/-/g, ' ')}
              </td>
              <td className="px-5 py-3 text-green-400 font-medium">
                ${product.price?.toFixed(2)}
              </td>
              <td className="px-5 py-3 text-slate-300">
                {product.rating} ⭐
              </td>
              <td className={`px-5 py-3 font-medium ${
                product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {product.stock}
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <Link to={`/products/${product.id}/edit`} className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(product)}
                    className="text-red-400 hover:text-red-300 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
