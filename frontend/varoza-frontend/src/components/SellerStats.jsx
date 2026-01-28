export default function SellerStats({ earnings }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
      
      {/* TOTAL EARNINGS */}
      <div className="bg-black/60 p-6 rounded-xl border border-white/10">
        <p className="text-gray-400 text-sm">Total Earnings</p>
        <h2 className="text-3xl font-bold text-purple-400">
          ₹{earnings.total || 0}
        </h2>
      </div>

      {/* AVAILABLE BALANCE */}
      <div className="bg-black/60 p-6 rounded-xl border border-white/10">
        <p className="text-gray-400 text-sm">Available Balance</p>
        <h2 className="text-3xl font-bold text-green-400">
          ₹{earnings.available || 0}
        </h2>
      </div>

      {/* POSTERS SOLD */}
      <div className="bg-black/60 p-6 rounded-xl border border-white/10">
        <p className="text-gray-400 text-sm">Posters Sold</p>
        <h2 className="text-3xl font-bold text-blue-400">
          {earnings.sold || 0}
        </h2>
      </div>

    </div>
  );
}
