export const generateS3KeyName = (originalFileName: string): string => {
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  // Remove extension and replace spaces/underscores with dash
  const baseName = originalFileName
    .toLocaleLowerCase()
    .replace(/\.[^/.]+$/, '') // remove extension
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
  return `products/${YYYY}-${MM}-${dd}/${baseName}`;
}
