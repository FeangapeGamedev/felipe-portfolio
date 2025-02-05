import React from "react";

const Contact = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-300 hover:text-white"
        >
          ✖
        </button>
        <h1 className="text-4xl font-bold text-white mb-4">Contact Me</h1>
        <p className="text-lg mb-6 text-center text-gray-300">
          Feel free to reach out! Whether it's for a project, collaboration, or just to say hi.
        </p>
        <form>
          <label className="block mb-4">
            <span className="text-gray-300">Your Name</span>
            <input type="text" className="mt-2 p-2 w-full bg-gray-700 text-white rounded" placeholder="John Doe" required />
          </label>
          <label className="block mb-4">
            <span className="text-gray-300">Your Email</span>
            <input type="email" className="mt-2 p-2 w-full bg-gray-700 text-white rounded" placeholder="email@example.com" required />
          </label>
          <label className="block mb-4">
            <span className="text-gray-300">Your Message</span>
            <textarea className="mt-2 p-2 w-full bg-gray-700 text-white rounded" placeholder="Say something..." rows="4" required></textarea>
          </label>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
