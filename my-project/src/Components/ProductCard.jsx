import { FaStar } from "react-icons/fa";
import { addToCart } from "../redux/CartSlice";
import { useDispatch} from "react-redux";
import { Link } from "react-router-dom";

const ProductCard = ({product}) => {
  // const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = (e , product) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(addToCart(product));
    alert("Product added to cart")
  }
  return (
    <Link to={`/product/${product.id}`}> 
    <div key={product.id} className="bg-red-100 p-4 shadow rounded relative border transform transition-transform duration-300 hover:scale-105">
        <img src={product.image} alt={product.name} className="w-full h-48 object-contain mb-4"/>
        <h3 className="text-lg font-semibold">{product.title}</h3>
        <p className="text-gray-600">${product.price}</p>
        <div className="flex items-center mt-2">
            <FaStar className="text-yellow-500"/>
            <FaStar className="text-yellow-500"/>
            <FaStar className="text-yellow-500"/>
            <FaStar className="text-yellow-500"/>
            <FaStar className="text-yellow-500"/>
        </div>
        <div onClick={(e) => handleAddToCart(e,product)} className="absolute bottom-4 right-2 flex items-center justify-center w-8 h-8 bg-red-500 group text-white text-sm rounded-full hover:w-32 hover:bg-red-700 transition-all">
          {/* <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">+</span>
          <span className="opacity-0 group-hover:opacity-100">Add to Cart</span> */}
          <span className="group-hover:hidden">+</span>
          <span className="hidden group-hover:block" >Add to Cart</span>
       
        </div>
    </div>
    </Link>
  )
}

export default ProductCard