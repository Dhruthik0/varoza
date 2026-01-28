import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMyPosters, getEarnings } from "../services/sellerService";

import SellerStats from "../components/SellerStats";
import SellerPosterCard from "../components/SellerPosterCard";
import UploadPoster from "../components/UploadPoster";
import SellerWithdrawals from "../components/SellerWithdrawals";

export default function SellerDashboard() {
  const { user } = useContext(AuthContext);

  const [posters, setPosters] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    available: 0,
    sold: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);

      const posterData = await getMyPosters(user.token);
      const earningData = await getEarnings(user.token);

      setPosters(posterData || []);
      setEarnings({
        total: earningData?.total || 0,
        available: earningData?.available || 0,
        sold: earningData?.sold || 0,
      });
    } catch (err) {
      console.error("Failed to load seller data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center text-gray-400">
        Loading seller dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-purple-400 mb-8">
        Seller Dashboard
      </h1>

      <SellerStats earnings={earnings} />

      <UploadPoster onUpload={loadData} />

      {posters.length === 0 ? (
        <p className="text-gray-400 mt-10">
          You haven’t uploaded any posters yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {posters.map((p) => (
            <SellerPosterCard key={p._id} poster={p} />
          ))}
        </div>
      )}
      <SellerWithdrawals />

    </div>

  );
}
