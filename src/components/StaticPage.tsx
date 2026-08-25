import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface StaticPageProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function StaticPage({ title, icon, children }: StaticPageProps) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20">
        <div className="bg-brand-navy py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-3 flex items-center justify-center gap-3">
              {icon}
              {title}
            </h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
