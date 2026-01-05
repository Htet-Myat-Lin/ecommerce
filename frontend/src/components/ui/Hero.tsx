import { ShoppingCart, Laptop, Truck, ShieldCheck, Headphones } from "lucide-react";
import heroImg from "../../assets/hero1.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 sm:px-10 lg:py-20 animate-fade-in">
      {/* Optional decorative background blob */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Promo Badge */}
            <span className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
              ✨ New Collection 2025
            </span>
            
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-5xl">
              Upgrade Your <span className="text-blue-600">Digital Life</span>
            </h1>
            
            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              Discover the latest smartphones, laptops, tablets, and accessories
              from top brands at unbeatable prices. Free shipping on orders over
              $299.
            </p>

            {/* Features Row */}
            <div className="mb-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-slate-700">
                <Truck size={18} className="text-blue-600" />
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-slate-700">
                <ShieldCheck size={18} className="text-blue-600" />
                <span className="text-sm font-medium">2-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 text-slate-700">
                <Headphones size={18} className="text-blue-600" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 sm:w-auto">
                <ShoppingCart size={20} />
                Shop Latest Deals
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-transparent px-8 py-4 font-bold text-slate-900 transition-all hover:bg-slate-50 active:scale-95 sm:w-auto">
                <Laptop size={20} />
                Browse All
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative group">
            {/* Decorative Frame */}
            <div className="absolute -inset-2 rounded-2xl bg-linear-to-tr from-blue-100 to-indigo-100 opacity-50 blur-lg transition-all group-hover:opacity-100" />
            
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
              <img
                src={heroImg}
                className="aspect-4/3 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Latest electronic gadgets"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}