'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      // Replace with your actual API endpoint
      const res = await fetch(`http://localhost:4000/api/v1/customer/products/${id}`);
      if (res.ok) {
        const result = await res.json();
        setProduct(result.data);
      }
      setLoading(false);
    }
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} width={300} />
      <p>{product.description}</p>
      <p>
        <strong>Price:</strong> ${product.price}
      </p>
    </div>
  );
}
