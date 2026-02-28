export default function MedicalDisclaimer() {
    return (
        <section
            className="bg-surface-alt border-t border-border"
            role="contentinfo"
            aria-label="Avertissement medical"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary-light" aria-hidden="true">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                        <strong className="text-foreground">Avertissement :</strong> Les informations
                        fournies sur MedInfo sont destinees a des fins educatives et informatives
                        uniquement. Elles ne constituent pas un avis medical et ne doivent pas se
                        substituer a une consultation avec un professionnel de sante qualifie.
                        Consultez toujours votre medecin pour toute question relative a votre sante.
                    </p>
                </div>
            </div>
        </section>
    );
}
