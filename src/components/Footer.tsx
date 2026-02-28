export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface border-t border-border mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                                    <path d="M12 2v20M2 12h20" />
                                </svg>
                            </div>
                            <span className="font-semibold text-foreground">MedInfo</span>
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                            Plateforme d&apos;information medicale fiable et accessible.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3">Navigation</h3>
                        <ul className="space-y-2 text-sm text-muted">
                            <li>
                                <a href="/" className="hover:text-foreground transition-colors">Accueil</a>
                            </li>
                            <li>
                                <a href="/admin" className="hover:text-foreground transition-colors">Administration</a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3">Informations</h3>
                        <p className="text-sm text-muted leading-relaxed">
                            Les informations presentes sur ce site ne remplacent en aucun cas l&apos;avis d&apos;un professionnel de sante.
                        </p>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-6 text-center">
                    <p className="text-xs text-muted">
                        &copy; {currentYear} MedInfo. Tous droits reserves. Les contenus sont fournis a titre informatif uniquement.
                    </p>
                </div>
            </div>
        </footer>
    );
}
