import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import type { SearchResult } from '@/lib/types';

/**
 * Normalize accented characters for comparison
 */
function normalizeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * GET /api/search?q=<query>
 * Searches diseases by name (FTS + ilike) AND by symptom name.
 * When a symptom matches, returns ALL diseases linked to that symptom.
 * Supports accent-insensitive matching (e.g. "fievre" matches "Fièvre").
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    const supabase = createServerClient();
    const results: SearchResult[] = [];
    const seenDiseaseIds = new Set<string>();
    const normalizedQuery = normalizeAccents(query.toLowerCase());

    // 1. Full-text search on diseases using tsvector
    const tsQuery = query
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => `${word}:*`)
        .join(' & ');

    const { data: ftsResults } = await supabase
        .from('diseases')
        .select('id, name, slug, description')
        .textSearch('search_vector', tsQuery, { type: 'plain', config: 'french' })
        .limit(10);

    if (ftsResults) {
        for (const d of ftsResults) {
            if (!seenDiseaseIds.has(d.id)) {
                seenDiseaseIds.add(d.id);
                results.push({
                    id: d.id,
                    name: d.name,
                    slug: d.slug,
                    description: d.description.substring(0, 120),
                    type: 'disease',
                });
            }
        }
    }

    // 2. ilike fallback on disease name for partial matching
    if (results.length < 5) {
        const { data: fallback } = await supabase
            .from('diseases')
            .select('id, name, slug, description')
            .ilike('name', `%${query}%`)
            .limit(8);

        if (fallback) {
            for (const d of fallback) {
                if (!seenDiseaseIds.has(d.id)) {
                    seenDiseaseIds.add(d.id);
                    results.push({
                        id: d.id,
                        name: d.name,
                        slug: d.slug,
                        description: d.description.substring(0, 120),
                        type: 'disease',
                    });
                }
            }
        }
    }

    // 3. Search symptoms by name (accent-insensitive) — return ALL diseases linked to matching symptoms
    // First, get ALL symptoms and filter client-side for accent-insensitive matching
    const { data: allSymptoms } = await supabase
        .from('symptoms')
        .select('id, name');

    const matchingSymptoms = allSymptoms?.filter((s) =>
        normalizeAccents(s.name.toLowerCase()).includes(normalizedQuery)
    ) || [];

    if (matchingSymptoms.length > 0) {
        const symptomIds = matchingSymptoms.map((s) => s.id);
        const symptomNames = new Map(matchingSymptoms.map((s) => [s.id, s.name]));

        // Get all disease-symptom links for matching symptoms
        const { data: links } = await supabase
            .from('disease_symptoms')
            .select('disease_id, symptom_id')
            .in('symptom_id', symptomIds);

        if (links && links.length > 0) {
            // Get unique disease IDs not already in results
            const newDiseaseIds = [...new Set(links.map((l) => l.disease_id))]
                .filter((id) => !seenDiseaseIds.has(id));

            if (newDiseaseIds.length > 0) {
                const { data: linkedDiseases } = await supabase
                    .from('diseases')
                    .select('id, name, slug, description')
                    .in('id', newDiseaseIds)
                    .order('name')
                    .limit(25);

                if (linkedDiseases) {
                    for (const d of linkedDiseases) {
                        // Find which symptom linked this disease
                        const link = links.find((l) => l.disease_id === d.id);
                        const symptomName = link ? symptomNames.get(link.symptom_id) : '';

                        seenDiseaseIds.add(d.id);
                        results.push({
                            id: d.id,
                            name: d.name,
                            slug: d.slug,
                            description: symptomName ? `Symptôme : ${symptomName}` : d.description.substring(0, 120),
                            type: 'symptom',
                        });
                    }
                }
            }
        }
    }

    return NextResponse.json({ results: results.slice(0, 30) });
}
