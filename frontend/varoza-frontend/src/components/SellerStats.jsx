export default function SellerStats({ earnings }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2
    }).format(Number(value || 0));

  const stats = [
    {
      label: "Total Earnings",
      value: `₹${formatCurrency(earnings.total)}`,
      tone: "text-[#58181F]",
      accent: "bg-[#58181F]",
      note: "All-time completed orders"
    },
    {
      label: "Available Balance",
      value: `₹${formatCurrency(earnings.available)}`,
      tone: "text-black",
      accent: "bg-black",
      note: "Ready for withdrawal"
    },
    {
      label: "Posters Sold",
      value: Number(earnings.sold || 0),
      tone: "text-[#58181F]",
      accent: "bg-[#58181F]",
      note: "Paid + delivering orders"
    }
  ];

  return (
    <div className="mb-10 mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((item) => (
        <div key={item.label} className="section-panel card-shadow relative overflow-hidden p-5 md:p-6">
          <div className={`absolute left-0 right-0 top-0 h-1.5 ${item.accent}`} />
          <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full border-[12px] border-[#f7e7ce]/70" />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/55">{item.label}</p>
          <h2 className={`mt-2 text-3xl font-extrabold md:text-[2.25rem] ${item.tone}`}>{item.value}</h2>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-black/45">{item.note}</p>
        </div>
      ))}
    </div>
  );
}
