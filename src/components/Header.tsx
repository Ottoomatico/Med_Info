import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-surface border-b border-border sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 no-underline">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M12 2v20M2 12h20" />
                            </svg>
                        </div>
                        <span className="text-lg font-semibold text-foreground tracking-tight">
                            MedInfo
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-6" aria-label="Navigation principale">
                        <Link
                            href="/"
                            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                        >
                            Accueil
                        </Link>
                        <Link
                            href="/admin"
                            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
                        >
                            Administration
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
