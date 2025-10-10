import React, { useState, useEffect } from "react";

// Static testimonial data
const testimonials = [
  {
    quote:
      "This platform made me feel so much safer in my city. The community is supportive and the features are easy to use. Highly recommended!",
    name: "Ananya Singh",
    location: "Mumbai, India",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote:
      "Reporting incidents was quick and anonymous. The legal aid information was clear and helpful. Thank you for empowering women!",
    name: "Priya Sharma",
    location: "Delhi, India",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    quote:
      "I love the SOS alert and community features. It gives me peace of mind knowing I am not alone. Great initiative!",
    name: "Sneha Patel",
    location: "Ahmedabad, India",
    image: "https://randomuser.me/api/portraits/women/66.jpg",
  },
];

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => setCurrent(idx);

  return (
    <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-3xl px-8 py-10 flex flex-col items-center text-center space-y-7 relative">
      <img
        className="w-20 h-20 rounded-full object-cover border-4 border-pink-200 shadow"
        src={testimonials[current].image}
        alt={testimonials[current].name}
      />
      <p className="text-xl font-semibold text-gray-700 leading-relaxed">
        “{testimonials[current].quote}”
      </p>
      <div>
        <span className="block text-lg font-bold text-pink-600">
          {testimonials[current].name}
        </span>
        <span className="block text-gray-400 text-sm">
          {testimonials[current].location}
        </span>
      </div>
      {/* Slider dots */}
      <div className="flex space-x-2 justify-center mt-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${current === idx ? "bg-pink-500" : "bg-gray-300"} transition-colors`}
            aria-label={`Go to testimonial ${idx + 1}`}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;