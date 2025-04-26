'use client'
import { ProductProvider } from "./context/productContext";
import ProductCatalog from "./productCatalog";

function ShopPage() {
  return (
    <ProductProvider>
      <ProductCatalog />
    </ProductProvider>
  );
}

export default ShopPage;