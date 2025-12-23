
import { useState } from "react";
import api from "../api/axios";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    stock: ""
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ text: "Please select an image file", type: "error" });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: "Image size should be less than 5MB", type: "error" });
        return;
      }

      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage({ text: "Please upload an image", type: "error" });
      return;
    }

    // Create FormData for file upload
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('stock', formData.stock || 0);
    data.append('image', image);

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });

      await api.post("/api/products", data, {
        headers: { 
          "Content-Type": "multipart/form-data" 
        },
      });

      setMessage({ text: "✅ Product added successfully", type: "success" });

      // Reset form
      setFormData({
        title: "",
        price: "",
        category: "",
        description: "",
        stock: ""
      });
      setImage(null);
      setImagePreview(null);
      
      // Clear file input
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "❌ Failed to add product", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Product
      </h2>

      {message.text && (
        <div 
          className={`mb-4 px-4 py-3 rounded ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-600" 
              : "bg-red-50 border border-red-200 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Title */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Product Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Price *</label>
            <input
              type="number"
              name="price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              placeholder="0"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="">Select Category</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelery</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Product Image *</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Max size: 5MB. Accepted formats: JPEG, PNG, WebP
          </p>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <label className="block text-gray-700 mb-2 font-medium">Preview:</label>
            <div className="border rounded-lg p-4 bg-gray-50">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 mx-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;