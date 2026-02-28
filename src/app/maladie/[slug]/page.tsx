import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import DiseaseDetail from '@/components/DiseaseDetail';
import type { DiseaseWithRelations } from '@/lib/types';

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

/** Generate static paths for all diseases at build time */
export async function generateStaticParams() {
    const supabase = createServerClient();
    const { data: diseases } = await supabase
        .from('diseases')
        .select('slug');

    return (diseases || []).map((d) => ({ slug: d.slug }));
}

/** Dynamic metadata for SEO */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createServerClient();

    const { data: disease } = await supabase
        .from('diseases')
        .select('name, description')
        .eq('slug', slug)
        .single();

    if (!disease) {
        return {
            title: 'Maladie non trouvee',
        };
    }

    const description = disease.description.substring(0, 160);

    return {
        title: disease.name,
        description,
        openGraph: {
            title: `${disease.name} | MedInfo`,
            description,
            type: 'article',
        },
    };
}

export default async function DiseasePage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = createServerClient();

    // Fetch disease
    const { data: disease } = await supabase
        .from('diseases')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!disease) {
        notFound();
    }

    // Fetch symptoms via join table
    const { data: diseaseSymptomLinks } = await supabase
        .from('disease_symptoms')
        .select('symptom_id')
        .eq('disease_id', disease.id);

    const symptomIds = diseaseSymptomLinks?.map((ds) => ds.symptom_id) || [];

    let symptoms: DiseaseWithRelations['symptoms'] = [];
    if (symptomIds.length > 0) {
        const { data: symptomData } = await supabase
            .from('symptoms')
            .select('*')
            .in('id', symptomIds);
        symptoms = symptomData || [];
    }

    // Fetch sources
    const { data: sources } = await supabase
        .from('sources')
        .select('*')
        .eq('disease_id', disease.id)
        .order('published_date', { ascending: false });

    const diseaseWithRelations: DiseaseWithRelations = {
        ...disease,
        symptoms,
        sources: sources || [],
    };

    // Schema.org structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'MedicalCondition',
        name: disease.name,
        description: disease.description,
        possibleTreatment: disease.treatment
            ? {
                '@type': 'MedicalTherapy',
                description: disease.treatment,
            }
            : undefined,
        riskFactor: disease.risk_factors || undefined,
        signOrSymptom: symptoms.map((s) => ({
            '@type': 'MedicalSignOrSymptom',
            name: s.name,
        })),
        dateModified: disease.updated_at,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Breadcrumb */}
                <nav className="mb-6" aria-label="Fil d'Ariane">
                    <ol className="flex items-center gap-2 text-sm text-muted">
                        <li>
                            <a href="/" className="hover:text-foreground transition-colors">
                                Accueil
                            </a>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li className="text-foreground font-medium truncate">
                            {disease.name}
                        </li>
                    </ol>
                </nav>

                <DiseaseDetail disease={diseaseWithRelations} />
            </div>
        </>
    );
}
