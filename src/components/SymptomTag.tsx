export default function SymptomTag({ name }: { name: string }) {
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-primary border border-primary/10">
            {name}
        </span>
    );
}
