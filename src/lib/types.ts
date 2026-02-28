/* ============================================================
 * MedInfo — TypeScript type definitions
 * ============================================================ */

/** Supabase Database schema typing */
export interface Database {
    public: {
        Tables: {
            diseases: {
                Row: Disease;
                Insert: Omit<Disease, 'id' | 'created_at' | 'updated_at' | 'search_vector'>;
                Update: Partial<Omit<Disease, 'id' | 'created_at' | 'search_vector'>>;
            };
            symptoms: {
                Row: Symptom;
                Insert: Omit<Symptom, 'id' | 'created_at'>;
                Update: Partial<Omit<Symptom, 'id' | 'created_at'>>;
            };
            disease_symptoms: {
                Row: DiseaseSymptom;
                Insert: DiseaseSymptom;
                Update: Partial<DiseaseSymptom>;
            };
            sources: {
                Row: Source;
                Insert: Omit<Source, 'id' | 'created_at'>;
                Update: Partial<Omit<Source, 'id' | 'created_at'>>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}

/** Disease record */
export interface Disease {
    id: string;
    name: string;
    slug: string;
    description: string;
    causes: string;
    risk_factors: string;
    diagnosis: string;
    treatment: string;
    prevention: string;
    consultation: string;
    search_vector: string | null;
    created_at: string;
    updated_at: string;
}

/** Symptom record */
export interface Symptom {
    id: string;
    name: string;
    created_at: string;
}

/** Disease-Symptom join */
export interface DiseaseSymptom {
    disease_id: string;
    symptom_id: string;
}

/** Medical source reference */
export interface Source {
    id: string;
    disease_id: string;
    title: string;
    url: string;
    publisher: string;
    published_date: string | null;
    created_at: string;
}

/** Disease with related data (for detail pages) */
export interface DiseaseWithRelations extends Disease {
    symptoms: Symptom[];
    sources: Source[];
}

/** Search result shape */
export interface SearchResult {
    id: string;
    name: string;
    slug: string;
    description: string;
    type: 'disease' | 'symptom';
}
