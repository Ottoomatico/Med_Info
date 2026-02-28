'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const supabase = getSupabaseClient();
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError('Identifiants invalides. Veuillez reessayer.');
                return;
            }

            router.push('/admin/dashboard');
        } catch {
            setError('Une erreur est survenue. Veuillez reessayer.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="bg-surface rounded-xl border border-border p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-foreground">Administration</h1>
                        <p className="text-sm text-muted mt-1">Connectez-vous pour acceder au panneau d&apos;administration.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                                Adresse e-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-light/30 focus:border-primary-light transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-light/30 focus:border-primary-light transition-all"
                                placeholder="Votre mot de passe"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-danger" role="alert">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
