'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Disease, Symptom } from '@/lib/types';

interface SourceFormData {
    title: string;
    url: string;
    publisher: string;
    published_date: string | null;
}

export default function AdminDashboard() {
    const [diseases, setDiseases] = useState<Disease[]>([]);
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'diseases' | 'symptoms'>('diseases');
    const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
    const [showDiseaseForm, setShowDiseaseForm] = useState(false);
    const [newSymptom, setNewSymptom] = useState('');
    const router = useRouter();
    const supabase = getSupabaseClient();

    const loadData = useCallback(async () => {
        const [{ data: diseasesData }, { data: symptomsData }] = await Promise.all([
            supabase.from('diseases').select('*').order('name'),
            supabase.from('symptoms').select('*').order('name'),
        ]);
        setDiseases((diseasesData as Disease[]) || []);
        setSymptoms((symptomsData as Symptom[]) || []);
    }, [supabase]);

    useEffect(() => {
        async function checkAuth() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/admin');
                return;
            }
            setIsAuthenticated(true);
            await loadData();
            setIsLoading(false);
        }
        checkAuth();
    }, [supabase, router, loadData]);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push('/admin');
    }

    async function handleDeleteDisease(id: string) {
        if (!confirm('Confirmer la suppression de cette maladie ?')) return;
        await supabase.from('diseases').delete().eq('id', id);
        await loadData();
    }

    async function handleAddSymptom(e: React.FormEvent) {
        e.preventDefault();
        if (!newSymptom.trim()) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('symptoms').insert as any)({ name: newSymptom.trim() });
        setNewSymptom('');
        await loadData();
    }

    async function handleDeleteSymptom(id: string) {
        if (!confirm('Confirmer la suppression de ce symptome ?')) return;
        await supabase.from('disease_symptoms').delete().eq('symptom_id', id);
        await supabase.from('symptoms').delete().eq('id', id);
        await loadData();
    }

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary-light/30 border-t-primary-light rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Panneau d&apos;administration</h1>
                    <p className="text-sm text-muted mt-1">Gerez les maladies et symptomes.</p>
                </div>
                <button onClick={handleLogout} className="text-sm text-muted hover:text-foreground transition-colors">
                    Deconnexion
                </button>
            </div>

            <div className="flex gap-1 bg-surface-alt rounded-lg p-1 mb-6 w-fit">
                <button
                    onClick={() => setActiveTab('diseases')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'diseases' ? 'bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground'
                        }`}
                >
                    Maladies ({diseases.length})
                </button>
                <button
                    onClick={() => setActiveTab('symptoms')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'symptoms' ? 'bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground'
                        }`}
                >
                    Symptomes ({symptoms.length})
                </button>
            </div>

            {activeTab === 'diseases' && (
                <div>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => { setEditingDisease(null); setShowDiseaseForm(true); }}
                            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors"
                        >
                            Ajouter une maladie
                        </button>
                    </div>

                    {showDiseaseForm && (
                        <DiseaseForm
                            disease={editingDisease}
                            onSave={async () => { setShowDiseaseForm(false); setEditingDisease(null); await loadData(); }}
                            onCancel={() => { setShowDiseaseForm(false); setEditingDisease(null); }}
                        />
                    )}

                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-surface-alt">
                                    <th className="text-left text-xs font-medium text-muted px-4 py-3">Nom</th>
                                    <th className="text-left text-xs font-medium text-muted px-4 py-3">Slug</th>
                                    <th className="text-right text-xs font-medium text-muted px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diseases.map((disease) => (
                                    <tr key={disease.id} className="border-b border-border last:border-0 hover:bg-surface-alt/50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-foreground">{disease.name}</td>
                                        <td className="px-4 py-3 text-sm text-muted font-mono">{disease.slug}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => { setEditingDisease(disease); setShowDiseaseForm(true); }}
                                                className="text-sm text-primary-light hover:underline mr-3"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDisease(disease.id)}
                                                className="text-sm text-danger hover:underline"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'symptoms' && (
                <div>
                    <form onSubmit={handleAddSymptom} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            value={newSymptom}
                            onChange={(e) => setNewSymptom(e.target.value)}
                            placeholder="Nouveau symptome..."
                            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-light/30 focus:border-primary-light transition-all"
                        />
                        <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors">
                            Ajouter
                        </button>
                    </form>

                    <div className="bg-surface rounded-xl border border-border overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {symptoms.map((symptom) => (
                                <div key={symptom.id} className="flex items-center justify-between px-4 py-3 border-b border-r border-border">
                                    <span className="text-sm text-foreground">{symptom.name}</span>
                                    <button onClick={() => handleDeleteSymptom(symptom.id)} className="text-xs text-danger hover:underline ml-2">
                                        Supprimer
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ============================================================
 * Disease CRUD Form
 * ============================================================ */
function DiseaseForm({
    disease,
    onSave,
    onCancel,
}: {
    disease: Disease | null;
    onSave: () => void;
    onCancel: () => void;
}) {
    const supabase = getSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = supabase as any;

    const [formData, setFormData] = useState({
        name: disease?.name || '',
        slug: disease?.slug || '',
        description: disease?.description || '',
        causes: disease?.causes || '',
        risk_factors: disease?.risk_factors || '',
        diagnosis: disease?.diagnosis || '',
        treatment: disease?.treatment || '',
        prevention: disease?.prevention || '',
        consultation: disease?.consultation || '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [allSymptoms, setAllSymptoms] = useState<Symptom[]>([]);
    const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);
    const [sources, setSources] = useState<SourceFormData[]>([]);

    useEffect(() => {
        async function loadFormData() {
            const { data: syms } = await supabase.from('symptoms').select('*').order('name');
            setAllSymptoms((syms as Symptom[]) || []);

            if (disease) {
                const { data: dsLinks } = await supabase
                    .from('disease_symptoms')
                    .select('symptom_id')
                    .eq('disease_id', disease.id);
                setSelectedSymptomIds(
                    ((dsLinks as { symptom_id: string }[]) || []).map((l) => l.symptom_id)
                );

                const { data: sourcesData } = await supabase
                    .from('sources')
                    .select('*')
                    .eq('disease_id', disease.id);
                setSources(
                    ((sourcesData as { title: string; url: string; publisher: string; published_date: string | null }[]) || []).map((s) => ({
                        title: s.title,
                        url: s.url,
                        publisher: s.publisher,
                        published_date: s.published_date,
                    }))
                );
            }
        }
        loadFormData();
    }, [disease, supabase]);

    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    function handleNameChange(name: string) {
        setFormData((prev) => ({
            ...prev,
            name,
            slug: disease ? prev.slug : generateSlug(name),
        }));
    }

    function toggleSymptom(id: string) {
        setSelectedSymptomIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSaving(true);

        try {
            let diseaseId: string;

            if (disease) {
                await sbAny.from('diseases').update(formData).eq('id', disease.id);
                diseaseId = disease.id;
                await supabase.from('disease_symptoms').delete().eq('disease_id', diseaseId);
                await supabase.from('sources').delete().eq('disease_id', diseaseId);
            } else {
                const { data: newDisease, error } = await sbAny
                    .from('diseases')
                    .insert(formData)
                    .select('id')
                    .single();
                if (error || !newDisease) throw error;
                diseaseId = newDisease.id;
            }

            if (selectedSymptomIds.length > 0) {
                await sbAny.from('disease_symptoms').insert(
                    selectedSymptomIds.map((sid) => ({
                        disease_id: diseaseId,
                        symptom_id: sid,
                    }))
                );
            }

            if (sources.length > 0) {
                await sbAny.from('sources').insert(
                    sources.map((s) => ({
                        ...s,
                        disease_id: diseaseId,
                    }))
                );
            }

            onSave();
        } catch {
            alert('Erreur lors de la sauvegarde.');
        } finally {
            setIsSaving(false);
        }
    }

    const fields: { key: keyof typeof formData; label: string; type: 'text' | 'textarea' }[] = [
        { key: 'name', label: 'Nom de la maladie', type: 'text' },
        { key: 'slug', label: 'Slug (URL)', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'causes', label: 'Causes', type: 'textarea' },
        { key: 'risk_factors', label: 'Facteurs de risque', type: 'textarea' },
        { key: 'diagnosis', label: 'Diagnostic', type: 'textarea' },
        { key: 'treatment', label: 'Traitement', type: 'textarea' },
        { key: 'prevention', label: 'Prevention', type: 'textarea' },
        { key: 'consultation', label: 'Quand consulter', type: 'textarea' },
    ];

    return (
        <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
                {disease ? 'Modifier la maladie' : 'Nouvelle maladie'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map((field) => (
                    <div key={field.key}>
                        <label htmlFor={field.key} className="block text-sm font-medium text-foreground mb-1.5">
                            {field.label}
                        </label>
                        {field.type === 'text' ? (
                            <input
                                id={field.key}
                                type="text"
                                value={formData[field.key]}
                                onChange={(e) =>
                                    field.key === 'name'
                                        ? handleNameChange(e.target.value)
                                        : setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                                }
                                required={field.key === 'name' || field.key === 'slug'}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-light/30 focus:border-primary-light transition-all"
                            />
                        ) : (
                            <textarea
                                id={field.key}
                                value={formData[field.key]}
                                onChange={(e) => setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                rows={3}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary-light/30 focus:border-primary-light transition-all resize-y"
                            />
                        )}
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Symptomes</label>
                    <div className="flex flex-wrap gap-2 p-3 bg-background border border-border rounded-lg max-h-40 overflow-y-auto">
                        {allSymptoms.map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => toggleSymptom(s.id)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedSymptomIds.includes(s.id)
                                        ? 'bg-primary text-white'
                                        : 'bg-surface-alt text-muted hover:bg-accent hover:text-primary'
                                    }`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-foreground">Sources</label>
                        <button
                            type="button"
                            onClick={() => setSources([...sources, { title: '', url: '', publisher: '', published_date: null }])}
                            className="text-xs text-primary-light hover:underline"
                        >
                            + Ajouter une source
                        </button>
                    </div>
                    {sources.map((source, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 p-3 bg-background border border-border rounded-lg">
                            <input
                                type="text"
                                placeholder="Titre"
                                value={source.title}
                                onChange={(e) => {
                                    const updated = [...sources];
                                    updated[index] = { ...updated[index], title: e.target.value };
                                    setSources(updated);
                                }}
                                className="px-2 py-1.5 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-light/30"
                            />
                            <input
                                type="url"
                                placeholder="URL"
                                value={source.url}
                                onChange={(e) => {
                                    const updated = [...sources];
                                    updated[index] = { ...updated[index], url: e.target.value };
                                    setSources(updated);
                                }}
                                className="px-2 py-1.5 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-light/30"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Editeur"
                                    value={source.publisher}
                                    onChange={(e) => {
                                        const updated = [...sources];
                                        updated[index] = { ...updated[index], publisher: e.target.value };
                                        setSources(updated);
                                    }}
                                    className="flex-1 px-2 py-1.5 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-light/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setSources(sources.filter((_, i) => i !== index))}
                                    className="text-danger text-xs hover:underline px-1"
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Sauvegarde...' : disease ? 'Mettre a jour' : 'Creer'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-surface-alt text-foreground text-sm font-medium rounded-lg hover:bg-border transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}
