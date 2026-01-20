'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type SubmitState = 'idle' | 'verifying' | 'allocating' | 'success';

export default function BookingForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyUrl, setCompanyUrl] = useState('');
    const [emailError, setEmailError] = useState('');
    const [submitState, setSubmitState] = useState<SubmitState>('idle');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
        const domain = email.split('@')[1]?.toLowerCase();

        if (genericDomains.includes(domain)) {
            return 'Corporate Identity Required';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email format';
        }

        return '';
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (value.includes('@')) {
            const error = validateEmail(value);
            setEmailError(error);
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailValidation = validateEmail(email);
        if (emailValidation) {
            setEmailError(emailValidation);
            return;
        }

        setSubmitState('verifying');

        try {
            const response = await fetch('/api/send-demo-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    companyName,
                    companyUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit request');
            }

            setSubmitState('success');
        } catch (error) {
            console.error('Error submitting demo request:', error);
            setSubmitState('idle');
            alert('Failed to submit request. Please try again.');
        }
    };

    return (
        <section className="relative py-20 sm:py-28 lg:py-32 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 sm:mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold"
                    >
                        Book a Demo
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg sm:text-xl text-vigilance-muted max-w-2xl mx-auto"
                    >
                        Schedule a personalized demonstration
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card rounded-2xl p-5 sm:p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-mono text-vigilance-muted mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    disabled={submitState === 'success'}
                                    className="w-full code-input disabled:opacity-50"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Company Name Field */}
                            <div>
                                <label className="block text-sm font-mono text-vigilance-muted mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    onFocus={() => setFocusedField('company')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    disabled={submitState === 'success'}
                                    className="w-full code-input disabled:opacity-50"
                                    placeholder="Acme Corp"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-mono text-vigilance-muted mb-2">
                                    Work Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => handleEmailChange(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        required
                                        disabled={submitState === 'success'}
                                        className={`w-full code-input disabled:opacity-50 ${emailError ? 'ring-2 ring-vigilance-danger' : ''
                                            }`}
                                        placeholder="john@company.com"
                                    />
                                    <AnimatePresence>
                                        {emailError && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{
                                                    opacity: 1,
                                                    x: [0, -5, 5, -5, 5, 0],
                                                }}
                                                exit={{ opacity: 0 }}
                                                transition={{
                                                    x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
                                                    opacity: { duration: 0.2 },
                                                }}
                                                className="absolute -bottom-6 left-0 flex items-center gap-2 text-vigilance-danger text-xs font-mono"
                                            >
                                                <AlertCircle className="w-3 h-3" />
                                                {emailError}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Company URL Field */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-mono text-vigilance-muted mb-2">
                                    Company URL
                                </label>
                                <input
                                    type="url"
                                    value={companyUrl}
                                    onChange={(e) => setCompanyUrl(e.target.value)}
                                    onFocus={() => setFocusedField('url')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    disabled={submitState === 'success'}
                                    className="w-full code-input disabled:opacity-50"
                                    placeholder="https://company.com"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="relative">
                            <motion.button
                                type="submit"
                                disabled={submitState !== 'idle' || !!emailError}
                                whileHover={{ scale: submitState === 'idle' ? 1.02 : 1 }}
                                whileTap={{ scale: submitState === 'idle' ? 0.98 : 1 }}
                                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                            >
                                <span className={submitState === 'verifying' ? 'opacity-0' : ''}>
                                    Book a Demo
                                </span>
                                <AnimatePresence>
                                    {submitState === 'idle' && (
                                        <motion.div
                                            initial={{ x: 0, y: 0 }}
                                            exit={{
                                                x: 300,
                                                y: -300,
                                                scale: 0.3,
                                                rotate: 45
                                            }}
                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                        >
                                            <Send className="w-5 h-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {submitState === 'verifying' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </motion.div>
                                )}
                            </motion.button>
                        </div>

                        {/* Success Message */}
                        <AnimatePresence>
                            {submitState === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="glass-panel rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-vigilance-primary flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-semibold text-white">Request Submitted!</p>
                                            <p className="text-xs text-vigilance-muted mt-0.5">
                                                Our team will contact you shortly to schedule your demo.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Privacy Notice */}
                        <p className="text-xs text-vigilance-muted text-center font-mono">
                            By submitting, you agree to our{' '}
                            <a href="#" className="text-vigilance-secondary hover:underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-vigilance-secondary hover:underline">
                                Privacy Policy
                            </a>
                        </p>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}


