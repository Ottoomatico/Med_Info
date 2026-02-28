import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import type { SearchResult } from '@/lib/types';

/**
 * GET /api/search?q=<query>
 * Full-text search on diseases + symptom name matching.
 * Returns up to 10 results.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    const supabase = createServerClient();
    const results: SearchResult[] = [];

    // Full-text search on diseases using tsvector
    const tsQuery = query
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => `${word}:*`)
        .join(' & ');

    const { data: diseaseResults } = await supabase
        .from('diseases')
        .select('id, name, slug, description')
        .textSearch('search_vector', tsQuery, { type: 'plain', config: 'french' })
        .limit(6);

    if (diseaseResults) {
        for (const d of diseaseResults) {
            results.push({
                id: d.id,
                name: d.name,
                slug: d.slug,
                description: d.description.substring(0, 100),
                type: 'disease',
            });
        }
    }

    // If few FTS results, try ilike fallback for partial matching
    if (results.length < 3) {
        const { data: fallback } = await supabase
            .from('diseases')
            .select('id, name, slug, description')
            .ilike('name', `%${query}%`)
            .limit(4);

        if (fallback) {
            for (const d of fallback) {
                if (!results.find((r) => r.id === d.id)) {
                    results.push({
                        id: d.id,
                        name: d.name,
                        slug: d.slug,
                        description: d.description.substring(0, 100),
                        type: 'disease',
                    });
                }
            }
        }
    }

    // Search symptoms by name (to link to diseases that have them)
    const { data: symptomResults } = await supabase
        .from('symptoms')
        .select('id, name')
        .ilike('name', `%${query}%`)
        .limit(4);

    if (symptomResults) {
        for (const s of symptomResults) {
            // Find diseases linked to this symptom
            const { data: linked } = await supabase
                .from('disease_symptoms')
                .select('disease_id')
                .eq('symptom_id', s.id)
                .limit(1);

            if (linked && linked.length > 0) {
                const { data: disease } = await supabase
                    .from('diseases')
                    .select('id, name, slug, description')
                    .eq('id', linked[0].disease_id)
                    .single();

                if (disease && !results.find((r) => r.id === disease.id)) {
                    results.push({
                        id: disease.id,
                        name: disease.name,
                        slug: disease.slug,
                        description: `Symptome : ${s.name}`,
                        type: 'symptom',
                    });
                }
            }
        }
    }

    return NextResponse.json({ results: results.slice(0, 10) });
}
