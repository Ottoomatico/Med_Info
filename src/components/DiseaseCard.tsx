import Link from 'next/link';
import type { Disease, Symptom } from '@/lib/types';
import SymptomTag from './SymptomTag';

interface DiseaseCardProps {
    disease: Disease;
    symptoms?: Symptom[];
}

export default function DiseaseCard({ disease, symptoms = [] }: DiseaseCardProps) {
    return (
        <Link
            href={`/maladie/${disease.slug}`}
            className="group block bg-surface rounded-xl border border-border p-6 hover:border-primary-light/30 hover:shadow-md transition-all duration-200 no-underline"
        >
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary-light transition-colors mb-2">
                {disease.name}
            </h3>
            <p className="text-sm text-muted line-clamp-2 mb-4 leading-relaxed">
                {disease.description}
            </p>
            {symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {symptoms.slice(0, 4).map((s) => (
                        <SymptomTag key={s.id} name={s.name} />
                    ))}
                    {symptoms.length > 4 && (
                        <span className="inline-flex items-center px-2 py-1 text-xs text-muted">
                            +{symptoms.length - 4}
                        </span>
                    )}
                </div>
            )}
        </Link>
    );
}
