import { useSelector } from "react-redux";
import ProductCard from "../Components/ProductCard";
import Modal from "../Components/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FilterData = () => {
  const navigate = useNavigate();
  const filterProducts = useSelector((state) => state.product.filtersdData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mx-auto py-12 px-4 md:px-16 lg:px-24">
      {filterProducts.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center"> Shop</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 cursor-pointer">
            {filterProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </>
      ) : (
        <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          {
            <>
              <h2 className="text-2xl font-bold mb-6 text-center text-red-600 bg-gray-300">
                {" "}
                Product Not Found
              </h2>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2"
                onClick={navigate("/shop")}
              >
                Login
              </button>
            </>
          }
        </Modal>
      )}
    </div>
  );
};

export default FilterData;
