import ManCategory from "../assets/Images/mens.jpg";
import WomenCategory from "../assets/Images/women.jpg";
import KidsCategory from "../assets/Images/kids.jpg";

const categories = [
  {
    title: "Men",
    imageurl: ManCategory,
  },
  {
    title: "Women",
    imageurl: WomenCategory,
  },
  {
    title: "Kids",
    imageurl: KidsCategory,
  },
];

const CategorySection = () => {
  return (
    <section className="container mx-auto px-4 md:px-16 lg:px-24 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative h-72 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <img
              src={category.imageurl}
              alt={category.title}
              className="w-full h-full object-cover"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <h3 className="text-2xl font-bold">{category.title}</h3>
              <p className="mt-1 text-sm text-gray-200 group-hover:text-red-400 transition-colors">
                View Collection →
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
