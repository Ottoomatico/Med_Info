'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SearchResult } from '@/lib/types';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const router = useRouter();

    const search = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/search?q=${encodeURIComponent(searchQuery)}`
            );
            if (response.ok) {
                const data = await response.json();
                setResults(data.results || []);
                setIsOpen(true);
            }
        } catch {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(query), 250);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, search]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleKeyDown(e: React.KeyboardEvent) {
        if (!isOpen || results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            navigateToResult(results[activeIndex]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    }

    function navigateToResult(result: SearchResult) {
        setIsOpen(false);
        setQuery('');
        router.push(`/maladie/${result.slug}`);
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
            <div className="relative">
                {/* Search icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                        className="w-5 h-5 text-muted"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(-1);
                    }}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Rechercher une maladie ou un symptome..."
                    className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-light/30 focus:border-primary-light transition-all"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-autocomplete="list"
                    aria-label="Rechercher une maladie ou un symptome"
                    id="search-bar"
                />

                {/* Loading spinner */}
                {isLoading && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <div className="w-4 h-4 border-2 border-primary-light/30 border-t-primary-light rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Results dropdown */}
            {isOpen && results.length > 0 && (
                <ul
                    className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-lg overflow-hidden"
                    role="listbox"
                    id="search-results"
                >
                    {results.map((result, index) => (
                        <li
                            key={`${result.type}-${result.id}`}
                            role="option"
                            aria-selected={index === activeIndex}
                            className={`px-4 py-3 cursor-pointer transition-colors ${index === activeIndex
                                ? 'bg-accent'
                                : 'hover:bg-surface-alt'
                                } ${index > 0 ? 'border-t border-border' : ''}`}
                            onClick={() => navigateToResult(result)}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-2 h-2 rounded-full flex-shrink-0 ${result.type === 'disease'
                                        ? 'bg-primary-light'
                                        : 'bg-success'
                                        }`}
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {result.name}
                                    </p>
                                    <p className="text-xs text-muted truncate">
                                        {result.type === 'disease' ? 'Maladie' : 'Symptome'}{' '}
                                        {result.description && `— ${result.description}`}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* No results */}
            {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-lg p-4">
                    <p className="text-sm text-muted text-center">
                        Aucun resultat pour &laquo; {query} &raquo;
                    </p>
                </div>
            )}
        </div>
    );
}
