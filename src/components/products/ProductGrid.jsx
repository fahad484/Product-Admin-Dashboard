import ProductTable from './ProductTable';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onDelete }) {
  return (
    <div className="w-full">
      <ProductTable products={products} onDelete={onDelete} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {products.map(product => (
          <ProductCard key={product.id} product={product} onDelete={onDelete} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-8 text-center text-slate-400 bg-slate-800/20 rounded-xl border border-slate-700">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
