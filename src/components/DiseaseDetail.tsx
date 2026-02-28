import type { DiseaseWithRelations } from '@/lib/types';
import SymptomTag from './SymptomTag';

interface DiseaseDetailProps {
    disease: DiseaseWithRelations;
}

/** Section wrapper with consistent styling */
function Section({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="bg-surface rounded-xl border border-border p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-primary-light flex-shrink-0">
                    {icon}
                </div>
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            </div>
            <div className="text-sm text-muted leading-relaxed whitespace-pre-line">
                {children}
            </div>
        </section>
    );
}

/** Icons (inline SVG for zero dependency) */
const icons = {
    description: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
    ),
    symptoms: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
    ),
    causes: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
    ),
    risk: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
    ),
    diagnosis: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>
    ),
    treatment: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" /></svg>
    ),
    prevention: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    ),
    consult: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
    sources: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
    ),
};

export default function DiseaseDetail({ disease }: DiseaseDetailProps) {
    const updatedDate = new Date(disease.updated_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-surface rounded-xl border border-border p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs text-muted mb-3">
                    <span>Mis a jour le {updatedDate}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                    {disease.name}
                </h1>
                {disease.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {disease.symptoms.map((s) => (
                            <SymptomTag key={s.id} name={s.name} />
                        ))}
                    </div>
                )}
            </div>

            {/* Description */}
            {disease.description && (
                <Section title="Description" icon={icons.description}>
                    {disease.description}
                </Section>
            )}

            {/* Causes */}
            {disease.causes && (
                <Section title="Causes" icon={icons.causes}>
                    {disease.causes}
                </Section>
            )}

            {/* Risk factors */}
            {disease.risk_factors && (
                <Section title="Facteurs de risque" icon={icons.risk}>
                    {disease.risk_factors}
                </Section>
            )}

            {/* Diagnosis */}
            {disease.diagnosis && (
                <Section title="Diagnostic" icon={icons.diagnosis}>
                    {disease.diagnosis}
                </Section>
            )}

            {/* Treatment */}
            {disease.treatment && (
                <Section title="Traitement" icon={icons.treatment}>
                    {disease.treatment}
                </Section>
            )}

            {/* Prevention */}
            {disease.prevention && (
                <Section title="Prevention" icon={icons.prevention}>
                    {disease.prevention}
                </Section>
            )}

            {/* Consultation */}
            {disease.consultation && (
                <Section title="Quand consulter" icon={icons.consult}>
                    {disease.consultation}
                </Section>
            )}

            {/* Sources */}
            {disease.sources.length > 0 && (
                <Section title="Sources medicales" icon={icons.sources}>
                    <ul className="space-y-3 mt-2">
                        {disease.sources.map((source) => (
                            <li key={source.id} className="flex flex-col">
                                {source.url ? (
                                    <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-primary-light hover:underline"
                                    >
                                        {source.title}
                                    </a>
                                ) : (
                                    <span className="text-sm font-medium text-foreground">
                                        {source.title}
                                    </span>
                                )}
                                <span className="text-xs text-muted">
                                    {source.publisher}
                                    {source.published_date &&
                                        ` — ${new Date(source.published_date).toLocaleDateString('fr-FR', {
                                            month: 'long',
                                            year: 'numeric',
                                        })}`}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}
        </div>
    );
}
