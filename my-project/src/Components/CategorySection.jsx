import ManCategory from "../assets/Images/mens.jpg";
import WomenCategory from "../assets/Images/women.jpg";
import KidsCategory from "../assets/Images/kids.jpg";

const categories = [
    {
        title:'Men',
        imageurl:ManCategory,
    },
    {
        title:'Women',
        imageurl:WomenCategory,
    },
    {
        title:'Kids',
        imageurl:KidsCategory
    }

]
const CategorySection = () => {
  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 ">
        {categories.map((category,index)=>(
            <div key={index} className="relative h-64  transform transition-transform duration-300 hover:scale-105 cursor-pointer">
                <img src={category.imageurl} alt=""  className="w-full h-full object-cover rounded-lg shadow-md opacity-3 "/>
                <div className="absolute bottom-0 left-0 w-full bg-red-100 p-4 hover:bg-red-200" >
                    <p className="text-xl font-bold text-gray-800">{category.title}</p>
                    <p className="text-red-600 font-semibold font-sans">View All</p>
                </div>
            </div>  
        ))}
 
    </div>
  )
}

export default CategorySection