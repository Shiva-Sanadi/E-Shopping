// Utility functions for handling image URLs and errors

export const getImageUrl = (imagePath, size = 'md') => {
  // Return placeholder if no image
  if (!imagePath || imagePath === '' || imagePath === 'undefined' || imagePath === 'null') {
    const sizes = {
      sm: '100x100',
      md: '300x300',
      lg: '600x600'
    };
    return `https://via.placeholder.com/${sizes[size] || '300x300'}?text=No+Image`;
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${API_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

/**
 * Handle image load error
 * Sets a placeholder image on error
 * 
 * @param {Event} e - The error event
 * @param {string} size - Size hint for placeholder
 */
export const handleImageError = (e, size = 'md') => {
  e.target.onerror = null; // Prevent infinite loop
  const sizes = {
    sm: '100x100',
    md: '300x300',
    lg: '600x600'
  };
  e.target.src = `https://via.placeholder.com/${sizes[size] || '300x300'}?text=Image+Error`;
};

/**
 * Image component wrapper with automatic error handling
 * Usage: <ProductImage src={product.image} alt={product.title} size="md" />
 */
export const ProductImage = ({ src, alt, className, size = 'md' }) => {
  return (
    <img
      src={getImageUrl(src, size)}
      alt={alt}
      className={className}
      onError={(e) => handleImageError(e, size)}
      loading="lazy"
    />
  );
};

export default getImageUrl;