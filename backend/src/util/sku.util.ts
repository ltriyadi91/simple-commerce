export default function generateSku(productName: string) {
  const cleanProductName = productName.replace(/[^a-zA-Z0-9\s]/g, '');
  const words = cleanProductName.split(/\s+/);
  const skuPrefix = words.map(word => word.charAt(0).toUpperCase()).join('');
  const randomNumber = Math.floor(Math.random() * 10000);
  const sku = `${skuPrefix}-${randomNumber.toString().padStart(4, '0')}`;
  return sku;
}
