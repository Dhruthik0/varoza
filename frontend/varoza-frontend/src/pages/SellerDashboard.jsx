import { useCallback, useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getMyPosters, getEarnings } from "../services/sellerService";

import SellerStats from "../components/SellerStats";
import SellerPosterCard from "../components/SellerPosterCard";
import UploadPoster from "../components/UploadPoster";
import SellerWithdrawals from "../components/SellerWithdrawals";

export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [posters, setPosters] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    available: 0,
    sold: 0,
  });
  const [loading, setLoading] = useState(true);
  const approvedCount = posters.filter((poster) => poster.approved).length;
  const pendingCount = posters.length - approvedCount;
  const approvalRate = posters.length ? Math.round((approvedCount / posters.length) * 100) : 0;

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

  const scrollToWithdrawals = useCallback(() => {
    let attempts = 0;

    const tryScroll = () => {
      const target = document.getElementById("seller-withdrawals");
      if (!target) return false;

      const headerOffset = window.innerWidth < 768 ? 100 : 120;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: "smooth"
      });

      return true;
    };

    if (tryScroll()) {
      return;
    }

    const intervalId = setInterval(() => {
      attempts += 1;
      if (tryScroll() || attempts >= 16) {
        clearInterval(intervalId);
      }
    }, 80);
  }, []);

  useEffect(() => {
    if (loading || location.hash !== "#seller-withdrawals") return;
    scrollToWithdrawals();
  }, [location.hash, loading, scrollToWithdrawals]);

  useEffect(() => {
    if (loading) return undefined;

    const handler = () => {
      scrollToWithdrawals();
    };

    window.addEventListener("varoza-scroll-withdrawals", handler);
    return () => {
      window.removeEventListener("varoza-scroll-withdrawals", handler);
    };
  }, [loading, scrollToWithdrawals]);

  if (loading) {
    return (
      <div className="varoza-container py-20 text-center text-sm font-semibold uppercase tracking-[0.16em] text-black/55">
        Loading seller dashboard...
      </div>
    );
  }

  return (
    <div className="varoza-container py-8 md:py-10">
      <section className="section-panel card-shadow relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[24px] border-[#58181F]/10" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-[#f7e7ce]/70 blur-[2px]" />

        <div className="relative grid gap-6 bg-gradient-to-br from-white via-[#fff9f0] to-[#f7e7ce] p-6 md:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#58181F]">Seller Workspace</p>
            <h1 className="mt-3 font-['Cinzel'] text-4xl font-bold text-black md:text-5xl">
              Seller Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-base text-black/65 md:text-lg">
              Manage uploads, monitor your earnings, and request withdrawals from one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 self-start">
            <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Total Posters</p>
              <p className="mt-1 text-3xl font-extrabold text-[#58181F]">{posters.length}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Approved</p>
              <p className="mt-1 text-3xl font-extrabold text-black">{approvedCount}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Pending</p>
              <p className="mt-1 text-3xl font-extrabold text-[#58181F]">{pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">Approval Rate</p>
              <p className="mt-1 text-3xl font-extrabold text-black">{approvalRate}%</p>
            </div>
          </div>
        </div>
      </section>

      <SellerStats earnings={earnings} />

      <UploadPoster onUpload={loadData} />

      {posters.length === 0 ? (
        <section className="section-panel card-shadow mt-2 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-black/55">
            You haven’t uploaded any posters yet.
          </p>
        </section>
      ) : (
        <section className="section-panel card-shadow mt-2 overflow-hidden">
          <div className="border-b border-black/10 bg-gradient-to-r from-[#fffdf8] to-[#f7e7ce] px-6 py-5">
            <h2 className="font-['Cinzel'] text-2xl font-bold text-[#58181F] md:text-[1.9rem]">Your Posters</h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-black/50">
              Latest uploads and approval status
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {posters.map((p) => (
              <SellerPosterCard key={p._id} poster={p} />
            ))}
          </div>
        </section>
      )}
      <SellerWithdrawals />

    </div>

  );
}
