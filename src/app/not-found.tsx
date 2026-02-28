import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Page non trouvee
                </h2>
                <p className="text-sm text-muted mb-8 max-w-sm mx-auto">
                    La page que vous recherchez n&apos;existe pas ou a ete deplacee.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors no-underline"
                >
                    Retour a l&apos;accueil
                </Link>
            </div>
        </div>
    );
}
