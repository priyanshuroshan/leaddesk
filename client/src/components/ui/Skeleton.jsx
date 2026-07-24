/**
 * Skeleton loading components for graceful loading states
 */

export function SkeletonBox({ className = '' }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-4 rounded-lg ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-10 w-10" />
        <SkeletonBox className="h-5 w-16" />
      </div>
      <SkeletonBox className="h-8 w-24" />
      <SkeletonText lines={1} className="w-32" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800">
      {[140, 180, 80, 200, 80, 100, 80].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className={`skeleton h-4 rounded`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}
