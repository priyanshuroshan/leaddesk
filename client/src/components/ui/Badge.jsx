/**
 * Status badge for lead status
 * @param {{ status: 'New'|'Contacted'|'Closed', className?: string }} props
 */
export default function Badge({ status, className = '' }) {
  const map = {
    New: 'badge-new',
    Contacted: 'badge-contacted',
    Closed: 'badge-closed',
  };

  const dotColor = {
    New: 'bg-blue-500',
    Contacted: 'bg-amber-500',
    Closed: 'bg-emerald-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        map[status] || 'bg-zinc-100 text-zinc-600'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor[status] || 'bg-zinc-400'}`} />
      {status}
    </span>
  );
}
