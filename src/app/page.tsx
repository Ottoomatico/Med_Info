import { createServerClient } from '@/lib/supabase/server';
import SearchBar from '@/components/SearchBar';
import DiseaseCard from '@/components/DiseaseCard';
import type { Symptom } from '@/lib/types';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createServerClient();

  // Fetch all diseases with their symptoms
  const { data: diseases } = await supabase
    .from('diseases')
    .select('*')
    .order('name');

  // Fetch disease-symptom relationships
  const { data: diseaseSymptoms } = await supabase
    .from('disease_symptoms')
    .select('disease_id, symptom_id');

  // Fetch all symptoms
  const { data: symptoms } = await supabase
    .from('symptoms')
    .select('*');

  // Build symptom map
  const symptomMap = new Map<string, Symptom>();
  symptoms?.forEach((s) => symptomMap.set(s.id, s));

  // Build disease → symptoms map
  const diseaseSymptomsMap = new Map<string, Symptom[]>();
  diseaseSymptoms?.forEach((ds) => {
    const symptom = symptomMap.get(ds.symptom_id);
    if (symptom) {
      const existing = diseaseSymptomsMap.get(ds.disease_id) || [];
      existing.push(symptom);
      diseaseSymptomsMap.set(ds.disease_id, existing);
    }
  });

  return (
    <>
      {/* Hero Section */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              Encyclopedie medicale
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed">
              Consultez des informations detaillees et fiables sur les maladies,
              leurs symptomes, diagnostics et traitements.
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Diseases Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Toutes les maladies
            </h2>
            <p className="text-sm text-muted mt-1">
              {diseases?.length || 0} fiches medicales disponibles
            </p>
          </div>
        </div>

        {diseases && diseases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diseases.map((disease) => (
              <DiseaseCard
                key={disease.id}
                disease={disease}
                symptoms={diseaseSymptomsMap.get(disease.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted">Aucune maladie repertoriee pour le moment.</p>
          </div>
        )}
      </section>
    </>
  );
}
