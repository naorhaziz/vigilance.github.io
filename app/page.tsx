import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";
import Hero from "@/components/Hero";
import IncidentTimeline from "@/components/IncidentTimeline";
import DemoTabs from "@/components/DemoTabs";
import BookingForm from "@/components/BookingForm";

export default function Home() {
    return (
        <main className="relative overflow-hidden">
            <ScrollToTopOnMount />
            {/* Background Elements */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-vigilance-primary/5 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-vigilance-secondary/5 via-transparent to-transparent" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vigilance-primary to-vigilance-secondary flex items-center justify-center font-bold text-vigilance-base">
                            V
                        </div>
                        <span className="text-xl font-bold">Vigilance</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                        <a href="#book-demo" className="btn-primary text-sm px-4 py-2 w-full sm:w-auto text-center">
                            Book a Demo
                        </a>
                    </div>
                </div>
            </nav>

            {/* Sections */}
            <div className="pt-24 sm:pt-20 lg:pt-16">
                <Hero />

                <div id="demo">
                    <DemoTabs />
                </div>

                <div id="solution">
                    <IncidentTimeline />
                </div>

                <div id="book-demo">
                    <BookingForm />
                </div>

                {/* Footer */}
                <footer className="relative py-16 px-6 border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vigilance-primary to-vigilance-secondary flex items-center justify-center font-bold text-vigilance-base">
                                        V
                                    </div>
                                    <span className="text-xl font-bold">Vigilance</span>
                                </div>
                                <p className="text-sm text-vigilance-muted">
                                    Narrative Security Infrastructure for the AI Era
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Product</h4>
                                <ul className="space-y-2 text-sm text-vigilance-muted">
                                    <li><a href="#" className="hover:text-white transition-colors">Platform</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Resources</h4>
                                <ul className="space-y-2 text-sm text-vigilance-muted">
                                    <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Company</h4>
                                <ul className="space-y-2 text-sm text-vigilance-muted">
                                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                            <p className="text-sm text-vigilance-muted font-mono">
                                © 2026 Vigilance. All rights reserved.
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 text-sm text-vigilance-muted font-mono">
                                <span>TTD: 5ms</span>
                                <span>•</span>
                                <span>TTC: 50ms</span>
                                <span>•</span>
                                <span>Uptime: 99.99%</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
