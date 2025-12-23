import { useState } from "react";

const Contact = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // or
    // const {value, name} = e .target;
    //  setData({...data,[name] : value});
    // or
    setData((preValue) => {
      console.log(preValue);
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200 py-6">
      <div className="w-full max-w-lg bg-red-100 shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Get in Touch
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              id="name"
              name="name"
              value={data.name}
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-600 focus:border-gray-600 outline-none"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              id="email"
              name="email"
              value={data.email}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-600 focus:border-gray-600 outline-none"
            />
          </div>
          {/* phone */}

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              onChange={handleChange}
              type="phone"
              id="phone"
              name="phone"
              value={data.phone}
              placeholder="Enter Phone Number"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-600 focus:border-gray-600 outline-none"
            />
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              onChange={handleChange}
              id="message"
              name="message"
              rows="4"
              value={data.message}
              placeholder="Write your message"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-600 focus:border-gray-600 outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
