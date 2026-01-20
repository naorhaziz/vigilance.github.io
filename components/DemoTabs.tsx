'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle, CheckCircle2, ExternalLink, FileText, Search, Sparkles, MoreVertical } from 'lucide-react';

type TabType = 'google' | 'chatgpt';

export default function DemoTabs() {
    const [activeTab, setActiveTab] = useState<TabType>('google');
    const [googleProtected, setGoogleProtected] = useState(false);
    const [chatgptProtected, setChatgptProtected] = useState(false);

    const handleTabChange = (tab: TabType) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
        setGoogleProtected(false);
        setChatgptProtected(false);
    };

    return (
        <section className="relative py-20 sm:py-28 lg:py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 sm:mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                    >
                        Real-World AI Hallucination Cases
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg sm:text-xl text-vigilance-muted max-w-2xl mx-auto"
                    >
                        See how Vigilance prevents actual liability events from Google Gemini and ChatGPT hallucinations
                    </motion.p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-10 sm:mb-12">
                    <div className="glass-panel rounded-xl p-2 inline-flex flex-wrap gap-2 justify-center w-full sm:w-auto">
                        <TabButton
                            active={activeTab === 'google'}
                            onClick={() => handleTabChange('google')}
                        >
                            Google AI Overview
                        </TabButton>
                        <TabButton
                            active={activeTab === 'chatgpt'}
                            onClick={() => handleTabChange('chatgpt')}
                        >
                            ChatGPT
                        </TabButton>
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'google' && (
                        <GoogleDemo
                            key="google"
                            isProtected={googleProtected}
                            setIsProtected={setGoogleProtected}
                        />
                    )}
                    {activeTab === 'chatgpt' && (
                        <ChatGPTDemo
                            key="chatgpt"
                            isProtected={chatgptProtected}
                            setIsProtected={setChatgptProtected}
                        />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <motion.button
            onClick={onClick}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold transition-all relative ${active ? 'text-white' : 'text-vigilance-muted hover:text-white'
                }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {active && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-vigilance-primary/20 rounded-lg border border-vigilance-primary/50"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
            )}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
}

function GoogleDemo({ isProtected, setIsProtected }: { isProtected: boolean; setIsProtected: (v: boolean) => void }) {
    const handleToggle = () => {
        setIsProtected(!isProtected);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-5 sm:p-8 space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Wolf River Electric v. Google</h3>
                    <p className="text-vigilance-muted">
                        Google AI Overview falsely claimed the company filed for bankruptcy
                    </p>
                </div>
                <ProtectionToggle isProtected={isProtected} onClick={handleToggle} />
            </div>

            {/* Google Search Interface */}
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="bg-white rounded-full border border-gray-300 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center gap-3 sm:gap-4">
                    <Search className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 flex-1">Wolf River Electric court case</span>
                    <Sparkles className="w-5 h-5 text-blue-500" />
                </div>

                {/* AI Overview Box */}
                <div className="bg-blue-50 rounded-2xl p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-start gap-3 mb-4">
                        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-blue-900 mb-2">AI Overview</h4>
                            <AnimatePresence mode="wait">
                                {!isProtected ? (
                                    <motion.div
                                        key="unprotected"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-3"
                                    >
                                        <p className="text-gray-800 leading-relaxed">
                                            Wolf River Electric, a Tennessee-based electrical contractor,
                                            <span className="bg-red-100 text-red-800 px-1 mx-1 rounded font-semibold">
                                                filed for Chapter 11 bankruptcy in 2023
                                            </span>
                                            following a series of legal disputes.
                                        </p>
                                        <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                                            <AlertCircle className="w-4 h-4" />
                                            Hallucination Detected - No fact-check performed
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="protected"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-3"
                                    >
                                        <p className="text-gray-800 leading-relaxed">
                                            Wolf River Electric is a Tennessee-based electrical contractor.
                                            <span className="bg-green-100 text-green-800 px-1 mx-1 rounded font-semibold">
                                                No bankruptcy filings found in federal court records.
                                            </span>
                                            The company has been involved in legal proceedings related to defamation claims against AI systems.
                                        </p>
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Fact-checked against PACER database
                                            </div>
                                            <SourceBadge source="U.S. Courts - PACER" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Search Results Below */}
                <div className="space-y-3">
                    <div className="bg-white p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <div className="text-blue-600 text-sm mb-1">theverge.com › ai-defamation</div>
                        <h3 className="text-lg font-medium text-blue-800 mb-1 hover:underline">
                            Google's AI Overview faces defamation lawsuit - The Verge
                        </h3>
                        <p className="text-sm text-gray-600">
                            Wolf River Electric is suing Google after its AI Overview feature generated false information...
                        </p>
                    </div>
                    <div className="bg-white p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <div className="text-blue-600 text-sm mb-1">reuters.com › legal › ai-defamation-lawsuits</div>
                        <h3 className="text-lg font-medium text-blue-800 mb-1 hover:underline">
                            Small business takes on Google over AI-generated false claims
                        </h3>
                        <p className="text-sm text-gray-600">
                            Tennessee electrical contractor says Google's Gemini AI damaged reputation with false bankruptcy...
                        </p>
                    </div>
                </div>
            </div>

            {/* Story & Impact */}
            <div className="glass-panel rounded-lg p-6 space-y-4">
                <AnimatePresence mode="wait">
                    {!isProtected && (
                        <motion.div
                            key="story-impact"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-vigilance-secondary" />
                                    The Story
                                </h4>
                                <p className="text-sm text-vigilance-muted leading-relaxed">
                                    Wolf River Electric, a Tennessee-based electrical contractor, discovered Google's AI Overview was telling potential clients they had filed for bankruptcy—a complete fabrication. The false information appeared prominently in search results for their company name, potentially devastating for a business that relies on customer trust and creditworthiness.
                                </p>
                            </div>

                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h5 className="text-sm font-semibold mb-3 text-vigilance-secondary">Impact</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="glass-panel rounded-lg p-3">
                                        <div className="text-xs text-vigilance-muted mb-1">Claim Type</div>
                                        <div className="text-xl font-bold text-vigilance-danger font-mono">Bankruptcy</div>
                                        <div className="text-xs text-red-400">Defamation per se</div>
                                    </div>
                                    <div className="glass-panel rounded-lg p-3">
                                        <div className="text-xs text-vigilance-muted mb-1">Source Platform</div>
                                        <div className="text-xl font-bold text-vigilance-danger font-mono">Google</div>
                                        <div className="text-xs text-red-400">AI Overview/Gemini</div>
                                    </div>
                                    <div className="glass-panel rounded-lg p-3">
                                        <div className="text-xs text-vigilance-muted mb-1">Business Type</div>
                                        <div className="text-xl font-bold text-vigilance-warning font-mono">Small</div>
                                        <div className="text-xs text-yellow-400">Electrical contractor</div>
                                    </div>
                                    <div className="glass-panel rounded-lg p-3">
                                        <div className="text-xs text-vigilance-muted mb-1">Legal Status</div>
                                        <div className="text-xl font-bold text-vigilance-warning font-mono">Pending</div>
                                        <div className="text-xs text-yellow-400">Lawsuit filed 2024</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isProtected && (
                    <motion.div
                        key="protected-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-vigilance-primary/5 border border-vigilance-primary/20 rounded-lg p-4"
                    >
                        <p className="text-sm text-vigilance-primary font-semibold">
                            ✓ Vigilance prevented this scenario by cross-referencing PACER federal bankruptcy database and Tennessee Secretary of State business records before publication.
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

function ChatGPTDemo({ isProtected, setIsProtected }: { isProtected: boolean; setIsProtected: (v: boolean) => void }) {
    const handleToggle = () => {
        setIsProtected(!isProtected);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-2xl p-5 sm:p-8 space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Hood v. OpenAI</h3>
                    <p className="text-vigilance-muted">
                        ChatGPT falsely claimed Brian Hood was imprisoned for bribery when he was the whistleblower
                    </p>
                </div>
                <ProtectionToggle isProtected={isProtected} onClick={handleToggle} />
            </div>

            {/* ChatGPT Interface */}
            <div className="bg-[#343541] rounded-2xl overflow-hidden">
                {/* ChatGPT Header */}
                <div className="bg-[#202123] px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-[#19C37D] to-[#0D8559] flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-medium text-sm">ChatGPT 4</span>
                    </div>
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                </div>

                {/* Chat Messages */}
                <div className="p-4 sm:p-6 space-y-6 min-h-[220px] sm:min-h-[280px]">
                    {/* User Message */}
                    <div className="flex gap-4 justify-end">
                        <div className="bg-[#40414F] rounded-2xl px-4 py-3 max-w-[80%]">
                            <p className="text-white text-sm">
                                Who is Brian Hood in the Securency bribery scandal context?
                            </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">U</span>
                        </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#19C37D] to-[#0D8559] flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                {!isProtected ? (
                                    <motion.div
                                        key="unprotected"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-3"
                                    >
                                        <p className="text-white text-sm leading-relaxed">
                                            Brian Hood was involved in the Securency International bribery scandal. He was
                                            <span className="bg-red-500/20 text-red-300 px-1 mx-1 rounded">
                                                charged with bribery and sentenced to 30 months in prison
                                            </span>
                                            in connection with illegal payments made to foreign officials.
                                        </p>
                                        <div className="flex items-center gap-2 text-red-400 text-xs">
                                            <AlertCircle className="w-4 h-4" />
                                            Hallucination: Inverted victim/perpetrator relationship
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="protected"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-3"
                                    >
                                        <p className="text-white text-sm leading-relaxed">
                                            Brian Hood was the
                                            <span className="bg-green-500/20 text-green-300 px-1 mx-1 rounded font-semibold">
                                                whistleblower who exposed the bribery scandal
                                            </span>
                                            at Securency International, Australia's banknote printer. He reported illegal payments to foreign officials and was never charged or imprisoned. His role as a whistleblower led to criminal prosecutions of others involved.
                                        </p>
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-3">
                                            <div className="flex items-center gap-2 text-green-400 text-xs">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Verified against DOJ records
                                            </div>
                                            <SourceBadge source="Australian Federal Police" dark />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Story & Impact */}
            <div className="glass-panel rounded-lg p-6 space-y-4">
                <AnimatePresence mode="wait">
                    {!isProtected && (
                        <motion.div
                            key="story-impact"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-vigilance-secondary" />
                                    The Story
                                </h4>
                                <p className="text-sm text-vigilance-muted leading-relaxed">
                                    Brian Hood, a regional mayor in Australia, was actually the whistleblower who exposed a massive bribery scandal at Securency International (now Note Printing Australia). Instead of being honored for his integrity, ChatGPT inverted the facts—claiming he was one of the criminals who went to prison. This hallucination spread across multiple queries, threatening his reputation and political career.
                                </p>
                            </div>

                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h5 className="text-sm font-semibold mb-3 text-vigilance-secondary">Impact</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="glass-panel rounded-lg p-3">
                                        <div className="text-xs text-vigilance-muted mb-1">Role Inversion</div>
                                        <div className="text-xl font-bold text-vigilance-danger font-mono">Victim→Criminal</div>
                                        <div className="text-xs text-red-400">Whistleblower defamed</div>
                                    </div>
                                    <div className="glass-panel rounded-lg p-3">
                                        <div className="text-xs text-vigilance-muted mb-1">False Claim</div>
                                        <div className="text-xl font-bold text-vigilance-danger font-mono">Prison</div>
                                        <div className="text-xs text-red-400">30 months sentence</div>
                                    </div>
                                    <div className="glass-panel rounded-lg p-3">
                                        <div className="text-xs text-vigilance-muted mb-1">Actual Role</div>
                                        <div className="text-xl font-bold text-vigilance-primary font-mono">Mayor</div>
                                        <div className="text-xs text-green-400">Hepburn Shire, AU</div>
                                    </div>
                                    <div className="glass-panel rounded-lg p-3">
                                        <div className="text-xs text-vigilance-muted mb-1">Legal Status</div>
                                        <div className="text-xl font-bold text-vigilance-warning font-mono">Threatened</div>
                                        <div className="text-xs text-yellow-400">First AI defamation</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isProtected && (
                    <motion.div
                        key="protected-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-vigilance-primary/5 border border-vigilance-primary/20 rounded-lg p-4"
                    >
                        <p className="text-sm text-vigilance-primary font-semibold">
                            ✓ Vigilance prevented this by verifying subject-predicate relationships against Australian Federal Police records and court transcripts, ensuring whistleblower status was correctly attributed.
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

function ProtectionToggle({ isProtected, onClick }: { isProtected: boolean; onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all ${isProtected
                ? 'bg-vigilance-primary/20 border border-vigilance-primary text-vigilance-primary'
                : 'bg-vigilance-danger/20 border border-vigilance-danger text-vigilance-danger'
                }`}
        >
            <div className="relative w-10 h-6 rounded-full bg-black/30">
                <motion.div
                    className={`absolute top-1 w-4 h-4 rounded-full ${isProtected ? 'bg-vigilance-primary' : 'bg-vigilance-danger'
                        }`}
                    animate={{ left: isProtected ? '20px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </div>
            <span>{isProtected ? 'ON' : 'OFF'}</span>
        </motion.button>
    );
}

function ScanningOverlay() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-blue-50 rounded-2xl p-6 border border-blue-200 space-y-4"
        >
            <div className="flex items-center gap-3">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <Shield className="w-5 h-5 text-blue-600" />
                </motion.div>
                <span className="font-semibold text-blue-900">Vigilance Fact-Checking...</span>
            </div>
            <div className="space-y-2">
                <ProgressBar label="Querying federal bankruptcy database (PACER)" delay={0} />
                <ProgressBar label="Cross-referencing business registrations" delay={0.3} />
                <ProgressBar label="Verifying court filing records" delay={0.6} />
            </div>
        </motion.div>
    );
}

function ProgressBar({ label, delay }: { label: string; delay: number }) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-gray-600 font-mono">{label}</p>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-blue-600"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, delay, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

function SourceBadge({ source, dark }: { source: string; dark?: boolean }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono ${dark
                ? 'bg-green-500/20 text-green-300'
                : 'bg-blue-100 text-blue-700'
                }`}
        >
            <FileText className="w-3 h-3" />
            {source}
            <ExternalLink className="w-3 h-3" />
        </motion.div>
    );
}
