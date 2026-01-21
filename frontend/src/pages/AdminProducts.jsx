import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProductsAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  clearError,
  clearSuccess,
} from "../redux/AdminSlice";
import AdminLayout from "../Components/AdminLayout";
import AddProduct from "../Components/AddProduct";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error, success, pagination } = useSelector((state) => state.admin);
  const [showModal, setShowModal] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    dispatch(fetchAllProductsAdmin({ page, limit: 10, search: searchTerm }));
  }, [page, dispatch]);

  useEffect(() => {
    if (success) {
      setFormData({
        title: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
      });
      setShowModal(false);
      setEditingId(null);
      setTimeout(() => dispatch(clearSuccess()), 3000);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    dispatch(fetchAllProductsAdmin({ page: 1, limit: 10, search: e.target.value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateProductAdmin({ id: editingId, data: formData }));
    } else {
      dispatch(createProductAdmin(formData));
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image,
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProductAdmin(id));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image: "",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-2">Manage your products</p>
          </div>
          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus size={20} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Messages */}
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 rounded-lg">Operation successful!</div>}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-xl text-gray-500">Loading...</div>
            </div>
          ) : products && products.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{product.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{product.category}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">${Number(product.price).toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{product.stock}</td>
                        <td className="px-6 py-4 text-sm space-x-2 flex">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </p>
                <div className="space-x-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page >= Math.ceil(pagination.total / pagination.limit)}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-96">
              <div className="text-xl text-gray-500">No products found</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal with AddProduct Component */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <AddProduct onSuccess={() => {
                setShowAddProduct(false);
                dispatch(fetchAllProductsAdmin({ page, limit: 10, search: searchTerm }));
              }} />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
