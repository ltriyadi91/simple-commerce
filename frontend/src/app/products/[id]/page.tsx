'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: {
    url: string;
    id: number
  }[];
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

  if (loading) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>;
  if (!product) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Product not found.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f7f7f7" }}>
      <header style={{
        width: "100%",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        padding: "1rem 0",
        marginBottom: "2rem"
      }}>
        <div style={{ maxWidth: "400px", margin: "0 auto", display: "flex", alignItems: "center" }}>
          <Link href="/products" style={{
            textDecoration: "none",
            color: "#0070f3",
            fontWeight: "bold",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center"
          }}>
            ← Back to Home
          </Link>
        </div>
      </header>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "2rem",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center"
        }}>
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0]?.url}
              alt={product.title}
              width={300}
              style={{ borderRadius: "12px", marginBottom: "1.5rem", objectFit: "cover", maxHeight: "300px" }}
            />
          )}
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#222" }}>{product.title}</h1>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>{product.description}</p>
          <p style={{ fontWeight: "bold", fontSize: "1.25rem", color: "#0070f3", marginBottom: "0.5rem" }}>
            ${product.price}
          </p>
        </div>
      </div>
    </div>
  );
}
