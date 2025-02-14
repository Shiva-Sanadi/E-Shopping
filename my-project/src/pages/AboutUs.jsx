import image from '../assets/Images/shop.jpg'
import profile from '../assets/Images/women.jpg'

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-green-200 py-10">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="bg-red-200 rounded-lg shadow-lg p-8 mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            About Us
          </h1>
          <p className="text-gray-600">
            Welcome to <span className="font-semibold">Your E-Shop</span> – where quality meets convenience. 
            We’re passionate about delivering the best products and customer experience to help you shop smarter and live better.
          </p>
        </div>

        {/* Mission Section */}
        <div className="flex flex-wrap items-center mb-10">
          <div className="w-full md:w-1/2 mb-6 md:mb-0 px-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600">
              Our mission is to simplify online shopping by offering a curated selection of top-quality products at unbeatable prices. 
              We aim to build trust, deliver excellent service, and create a platform that people love to visit.
            </p>
          </div>
          <div className="w-full md:w-1/2 px-4">
            <img
              src={image}
              alt="Our Mission"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-red-200 rounded-lg shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Our Core Values
          </h2>
          <ul className="space-y-4 text-gray-600">
            <li>
              <span className="font-semibold">Customer First:</span> We prioritize customer satisfaction in every decision we make.
            </li>
            <li>
              <span className="font-semibold">Quality:</span> Only the best products that meet our standards make it to our store.
            </li>
            <li>
              <span className="font-semibold">Sustainability:</span> We strive to reduce our environmental impact and support eco-friendly initiatives.
            </li>
            <li>
              <span className="font-semibold">Innovation:</span> Continuously improving and adapting to serve our customers better.
            </li>
          </ul>
        </div>

        {/* Team Section */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Meet the Team
          </h2>
          <p className="text-gray-600 mb-8">
            Our dedicated team of professionals is committed to bringing you the best shopping experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-200 rounded-lg shadow-md p-6">
              <img
                src={profile}
                alt="Team Member"
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800">John Doe</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            <div className="bg-red-200 rounded-lg shadow-md p-6">
              <img
                src={profile}
                alt="Team Member"
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800">Jane Smith</h3>
              <p className="text-gray-600">Head of Marketing</p>
            </div>
            <div className="bg-red-200 rounded-lg shadow-md p-6">
              <img
                src={profile}
                alt="Team Member"
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-bold text-gray-800">Alice Brown</h3>
              <p className="text-gray-600">Operations Manager</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-red-500 text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Have Questions? We’d Love to Help!
          </h2>
          <p className="mb-6">
            Reach out to us anytime at <span className="font-semibold">support@eshop.com</span> or call us at <span className="font-semibold">+123 456 7890</span>.
          </p>
          <button className="bg-white text-red-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
