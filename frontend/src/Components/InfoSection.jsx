import {
  FaShippingFast,
  FaHeadset,
  FaMoneyBillWave,
  FaLock,
  FaTag,
} from "react-icons/fa";

const InfoSection = () => {
  const infoItems = [
    {
      icon: <FaShippingFast />,
      title: "Free Shipping",
      description: "Get your order delivered with no extra cost",
    },
    {
      icon: <FaHeadset />,
      title: "24/7 Support",
      description: "We are here to assist you anytime",
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Money Back Guarantee",
      description: "Full refund if you are not satisfied",
    },
    {
      icon: <FaLock />,
      title: "Secure Payment",
      description: "Your payment information is safe with us",
    },
    {
      icon: <FaTag />,
      title: "Best Offers",
      description: "Enjoy the best prices on our products",
    },
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {infoItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center border shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* Icon */}
              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold text-gray-800">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
