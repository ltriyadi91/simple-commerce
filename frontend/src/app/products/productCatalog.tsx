import React, { useState } from "react";
import { useProductContext } from "./context/productContext";
import { useRouter } from "next/navigation";

const ProductCatalog: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { products, loading, error, pagination, fetchProducts } =
    useProductContext();
  const router = useRouter();

  if (loading) return <div className="text-center py-10 text-lg font-semibold">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 px-4 py-3 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">Product Catalog</h1>
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => {
            setIsSidebarOpen(prev => !prev);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>
      <div className="flex flex-wrap gap-6 justify-center px-4">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 p-4 w-64 cursor-pointer flex flex-col"
            onClick={() => router.push(`/products/${product.id}`)}
          >
            <img
              src={product.images?.[0] || "https://via.placeholder.com/200"}
              alt={product.title}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold mb-2 truncate">{product.title}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            <p className="mb-2">
              <b>Price:</b>{" "}
              <span className="text-green-600 font-bold">${product.finalPrice ?? product.price}</span>
              {product.discount > 0 && (
                <span className="text-gray-400 line-through ml-2">
                  ${product.price}
                </span>
              )}
            </p>
            <p className="text-sm text-gray-500 mt-auto">
              <b>Stock:</b> {product.quantity}
            </p>
          </div>
        ))}
      </div>
      {pagination && (
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() =>
              fetchProducts({
                page: pagination.page - 1,
                limit: pagination.limit,
              })
            }
            disabled={pagination.page <= 1}
            className={`px-4 py-2 rounded bg-blue-500 text-white font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            Previous
          </button>
          <span className="text-lg">
            Page <span className="font-bold">{pagination.page}</span> of <span className="font-bold">{pagination.totalPages}</span>
          </span>
          <button
            onClick={() =>
              fetchProducts({
                page: pagination.page + 1,
                limit: pagination.limit,
              })
            }
            disabled={pagination.page >= pagination.totalPages}
            className={`px-4 py-2 rounded bg-blue-500 text-white font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
