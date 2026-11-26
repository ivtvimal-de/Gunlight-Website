import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Factory } from "lucide-react";
import { COMPANY } from "../config";

export default function BrandStory() {
  return (
    <section className="py-10 sm:py-20 bg-white border-b border-[var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-5 sm:p-12 lg:p-14 overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-white px-3.5 py-1 text-xs font-semibold text-[var(--accent)] tracking-wider uppercase shadow-2xs">
                <Factory className="w-3.5 h-3.5" />
                About Jerone Enterprises
              </span>

              <h2 className="font-['Outfit'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                Engineered for Durability. Trusted Across India.
              </h2>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                Operated by <strong>{COMPANY.name}</strong> from {COMPANY.city}, Tamil Nadu, GunLite provides
                high-efficiency LED searchlights and portable rechargeable illumination equipment. Built with
                aircraft-grade aluminium, advanced thermal heat sinks, and high-capacity lithium-ion power cells,
                our equipment serves domestic users, industrial facilities, agricultural estates, and security
                personnel nationwide.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs transition-colors"
                >
                  <span>Learn More About GunLite</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                  <span>GSTIN: {COMPANY.gst}</span>
                </div>
              </div>
            </div>

            {/* Right Side Visual Badge */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-xs rounded-2xl border border-[var(--border-subtle)] bg-white p-6 text-center shadow-[0_4px_20px_rgba(20,22,26,0.06)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[var(--accent)] mb-4">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-['Outfit'] text-lg font-bold text-[var(--text-primary)]">
                  100% Quality Tested
                </h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                  Every torch undergoes strict battery, optical focus, and switch checks before packaging.
                </p>
                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
                  Dispatched from {COMPANY.city}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

