export default function FlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}