import React from "react";

export default function CustomerSupportModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-black text-white rounded-xl w-full max-w-md p-6 border border-white/10 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-purple-400 mb-4">
          Customer Support
        </h2>

        <p className="text-gray-300 mb-6">
          Contact admin for any query, payment issue, or custom orders.
        </p>

        <div className="space-y-4">

          {/* PHONE */}
          <div className="bg-black/60 p-4 rounded border border-white/10">
            <p className="text-gray-400 text-sm">Phone</p>
            <a
              href="tel:+919999999999"
              className="text-lg text-purple-400 font-semibold"
            >
              +91 78924 03563
            </a>
          </div>

          {/* WHATSAPP */}
          <div className="bg-black/60 p-4 rounded border border-white/10">
            <p className="text-gray-400 text-sm">WhatsApp</p>
            <a
              href="https://wa.me/917892403563"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-green-400 font-semibold"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* HOURS */}
          <div className="text-sm text-gray-400 pt-2">
            Support Hours: 10:00 AM – 7:00 PM
          </div>
        </div>
      </div>
    </div>
  );
}
