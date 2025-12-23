import shopImage from "../assets/Images/shop.jpg";
import profileImage from "../assets/Images/women.jpg";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-500 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            About E-Shop
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-red-100 leading-relaxed">
            E-Shop is your trusted online marketplace — delivering quality,
            affordability, and convenience straight to your doorstep.
            We’re here to make shopping simple, fast, and enjoyable.
          </p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our mission is to empower customers by providing a seamless,
              secure, and satisfying shopping experience. We carefully select
              high-quality products and offer them at fair prices, backed by
              outstanding customer service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe shopping should be effortless, transparent, and
              enjoyable — every single time.
            </p>
          </div>

          <div className="relative">
            <img
              src={shopImage}
              alt="Our Mission"
              className="rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-6 -left-6 bg-red-600 text-white px-6 py-4 rounded-xl shadow-lg">
              <p className="font-semibold">Trusted by 10,000+ customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Core Values
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Customer First",
                desc: "Every decision we make starts with our customers in mind.",
                icon: "💖",
              },
              {
                title: "Quality Products",
                desc: "We deliver only products that meet our quality standards.",
                icon: "⭐",
              },
              {
                title: "Sustainability",
                desc: "Committed to eco-friendly and responsible practices.",
                icon: "🌱",
              },
              {
                title: "Innovation",
                desc: "Continuously evolving to improve your experience.",
                icon: "🚀",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center shadow hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Meet Our Team
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Behind E-Shop is a passionate team dedicated to building a better
          shopping experience for you.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { name: "John Doe", role: "Founder & CEO" },
            { name: "Jane Smith", role: "Head of Marketing" },
            { name: "Alice Brown", role: "Operations Manager" },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 text-center"
            >
              <img
                src={profileImage}
                alt={member.name}
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-gradient-to-r from-red-600 to-red-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Have Questions or Need Support?
          </h2>
          <p className="mb-8 text-red-100">
            Our support team is always ready to help you.
          </p>
          <button className="bg-white text-red-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
