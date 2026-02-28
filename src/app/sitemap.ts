import { createServerClient } from '@/lib/supabase/server';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createServerClient();
    const { data: diseases } = await supabase
        .from('diseases')
        .select('slug, updated_at');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medinfo.vercel.app';

    const diseaseEntries: MetadataRoute.Sitemap = (diseases || []).map((d) => ({
        url: `${baseUrl}/maladie/${d.slug}`,
        lastModified: new Date(d.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...diseaseEntries,
    ];
}
