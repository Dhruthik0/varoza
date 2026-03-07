import { Link } from "react-router-dom";

const SUPPORT_EMAIL = "varoza-@outlook.com";
const SIZE_GUIDE_IMAGE = "/faq-size-guide.jpg";

const dealRows = [
  "Buy 2 Get 1 Free - Add 3 posters to cart",
  "Buy 6 Get 3 Free - Add 9 posters to cart"

];

const faqItems = [
  {
    q: "How can I place an order for a custom poster?",
    a: "Use the custom poster option in Varoza and upload your image/reference. If needed, our support team will guide you."
  },
  {
    q: "What sizes are available?",
    a: "We provide A7,A6, A5, A4 and A3"
  },
  {
    q: "What material do you use?",
    a: "All posters are printed on premium 300 GSM matte stock for strong color and clean detail."
  },
  {
    q: "Is there a white border?",
    a: "Yes If the customer needs it otherwise no."
  },
  {
    q: "What is the delivery timeline?",
    a: "Delivery generally takes 3-5 days for prepaid and 5-7 days, depending on location."
  },
  {
    q: "What is your refund and return policy?",
    a: "As a print-on-demand store, replacements are provided for damaged or defective products with valid proof. Change-of-mind returns are not accepted."
  },
  {
    q: "Can I cancel or change my order?",
    a: "Custom orders are final once placed. Non-custom orders can be changed/cancelled only before dispatch."
  },
  {
    q: "Do you offer international shipping?",
    a: "Yes, we can ship internationally on request. Any customs charges are borne by the buyer."
  },
  {
    q: "Do you provide bulk or wholesale orders?",
    a: `Yes. For bulk requirements, contact us at ${SUPPORT_EMAIL}.`
  }
];

export default function Faqs() {
  return (
    <div className="varoza-container pb-20 pt-6 md:pt-10">
      <section className="section-panel card-shadow overflow-hidden bg-white">
        <div className="p-6 sm:p-8 md:p-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#58181F]">Help Center</p>
          <h1 className="mt-3 font-['Cinzel'] text-4xl font-bold text-black sm:text-5xl md:text-6xl">FAQs</h1>

          <div className="mt-8 space-y-8 text-black/80">
            <div>
              <h2 className="font-['Cinzel'] text-2xl font-semibold text-black sm:text-3xl">
                How to make the most of Varoza offers
              </h2>
              <p className="mt-3 text-lg">
                Transform your space while saving more. Add the exact quantity below and discounts apply automatically.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-lg">
                {dealRows.map((row) => (
                  <li key={row}>{row}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-['Cinzel'] text-2xl font-semibold text-black sm:text-3xl">Poster size guide</h2>
              <p className="mt-3 text-lg">Use this guide to choose the ideal size for your wall and style preference.</p>
              <img
                src={SIZE_GUIDE_IMAGE}
                alt="Varoza poster size guide"
                className="mt-5 w-full rounded-xl border border-black/10"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div>
              <h2 className="font-['Cinzel'] text-2xl font-semibold text-black sm:text-3xl">Frequently Asked Questions</h2>
              <div className="mt-4 space-y-3">
                {faqItems.map((item) => (
                  <details key={item.q} className="rounded-xl border border-black/15 bg-[#fff9ef] p-4">
                    <summary className="cursor-pointer list-none text-lg font-bold text-black">{item.q}</summary>
                    <p className="mt-3 text-base leading-relaxed text-black/75">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#58181F]/20 bg-[#58181F]/5 p-5 text-lg">
              Still have questions? Contact us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-bold text-[#58181F] underline underline-offset-4">
                {SUPPORT_EMAIL}
              </a>
              .
              <div className="mt-4">
                <Link to="/marketplace" className="inline-flex rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white">
                  Back to Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
