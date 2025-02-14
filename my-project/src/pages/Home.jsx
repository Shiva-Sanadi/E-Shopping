import { useEffect } from "react"
import CategorySection from "../Components/CategorySection"
import InfoSection from "../Components/InfoSection"
import { Categories, mockData } from "../Components/mockData"
import HeroImage from '../assets/Images/bg3.jpg'

import { setProducts } from "../redux/ProductSlice"
import {useSelector, useDispatch } from "react-redux"
import ProductCard from "../Components/ProductCard"
import Shop from "./Shop"
  import axios from "axios"

const Home = () => {
  const dispatch = useDispatch()
  const products = useSelector(state => state.product)

// recieve data usinfg axios

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        console.log(response.data);
        dispatch(setProducts(response.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();  
  }, []);

  // useEffect(()=>{

  //   dispatch(setProducts(mockData))
  // },[])

  return (
    <div>
        <div className="bg-gray-100  mt-2 px-4 md:px-16 lg:px-24 ">
          <div className="container mx-auto py-4 flex flex-col items-center md:flex-row space-x-2">
            {/* <div className="w-full md:w-3/12"> */}
              
                <div className="bg-green-300 text-white text-sm text-center font-sans font-bold px-2 py-2">
                  SHOP BY CATEGORIES
                    <ul className="space-y-10 bg-transferent p-3 border pt-4">
                    {Categories.map((category, index) => (
                      <li key={index} className="flex items-center text-sm  font-medium text-gray-500">
                      <div className="w-2 h-2 border border-red-600 rounded-full mr-2"></div>
                      {category}</li>
                    ))}
                  </ul>
                </div>
              
                  <div className="w-full md:w-9/12 mt-8 md:mt-0 h-96 relative">
                      <img  src={HeroImage} alt="HeroImage" className="w-full h-full object-cover"/>
                      <div className="absolute top-16 left-8r bg-red-200 p-4">
                          <p className="text-gray-600 mb-4">shop your favourite products online</p>
                          <h2 className="text-3xl font-bold">Welcome to E-Shop</h2>
                          <p className="text-xl mt-2.5 font-bold text-gray-800">Millions of products at your fingertips</p>
                          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-8 mt-4 transform transition-transform duration-300 hover:scale-105 ">Shop Now</button>
                      </div>
                  </div>
                
            {/* </div> */}
          </div>
          <InfoSection/>
          <CategorySection/>
          <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold mb-6 text-center"> Top Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 cursor-pointer">
              {products.products.slice(0,5).map(((product)=>(
                <ProductCard product={product} key={product.id}/>
              )))}
            </div>
          </div>
          
        </div>
        <Shop/>
    </div>
  )
}

export default Home