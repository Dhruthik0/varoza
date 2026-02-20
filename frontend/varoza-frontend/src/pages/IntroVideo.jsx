import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function IntroVideo() {
  const navigate = useNavigate();

  useEffect(() => {
  const hasSeenIntro = sessionStorage.getItem("varoza_intro_seen");

  if (hasSeenIntro === "true") {
    navigate("/marketplace", { replace: true });
    return;
  }

  const timer = setTimeout(() => {
    sessionStorage.setItem("varoza_intro_seen", "true");
    navigate("/marketplace", { replace: true });
  }, 8500);

  return () => clearTimeout(timer);
}, [navigate]);

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
      <video
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default IntroVideo;
