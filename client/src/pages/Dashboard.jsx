import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  InboxIcon,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { useLeads } from '../hooks/useLeads';
import { toast } from '../hooks/useToast';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import LeadDetailPanel from '../components/ui/LeadDetailPanel';
import Button from '../components/ui/Button';
import { SkeletonCard, SkeletonTableRow } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';

// ─── Status cycle ─────────────────────────────────────────────────────────────
const STATUS_CYCLE = { New: 'Contacted', Contacted: 'Closed', Closed: 'New' };

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, bg, delay = 0 }) {
  return (
    <motion.div
      className="card flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{value ?? '—'}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const {
    leads,
    stats,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    fetchLeads,
    updateLeadStatus,
    deleteLead,
  } = useLeads();

  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null); // for detail panel

  // Fetch on filter change
  useEffect(() => {
    fetchLeads(filters);
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({ ...f, search, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusFilter = (status) => {
    setFilters((f) => ({ ...f, status, page: 1 }));
  };

  const handleStatusToggle = useCallback(
    async (lead, nextStatus) => {
      const next = nextStatus || STATUS_CYCLE[lead.status];
      setUpdatingId(lead._id);
      try {
        await updateLeadStatus(lead._id, next);
        // Update selected lead if panel is open
        setSelectedLead((prev) =>
          prev && prev._id === lead._id ? { ...prev, status: next } : prev
        );
        toast.success(`Status updated to ${next}`);
      } catch {
        toast.error('Failed to update status');
      } finally {
        setUpdatingId(null);
      }
    },
    [updateLeadStatus]
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteLead(deleteTarget._id);
      toast.success('Lead deleted');
      if (selectedLead?._id === deleteTarget._id) setSelectedLead(null);
      setDeleteTarget(null);
      if (leads.length === 1 && filters.page > 1) {
        setFilters((f) => ({ ...f, page: f.page - 1 }));
      }
    } catch {
      toast.error('Failed to delete lead');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePage = (page) => setFilters((f) => ({ ...f, page }));

  const statCards = [
    { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-950' },
    { label: 'New', value: stats.new, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
    { label: 'Contacted', value: stats.contacted, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
    { label: 'Closed', value: stats.closed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">Dashboard</h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => fetchLeads(filters)}
            disabled={loading}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading && leads.length === 0
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : statCards.map((card, i) => (
                  <StatCard key={card.label} {...card} delay={i * 0.05} />
                ))}
          </div>

          {/* Table card */}
          <div className="card p-0 overflow-hidden">
            {/* ── Toolbar ── */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input pl-9 h-10 text-sm w-full"
                  />
                </div>

                {/* Status filter */}
                <div className="relative flex-shrink-0">
                  <select
                    value={filters.status}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="input h-10 text-sm appearance-none pl-4 pr-9 min-w-[150px] cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                  {/* Custom chevron */}
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Active filter chips */}
              {(filters.status || filters.search) && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs text-zinc-400">Filters:</span>
                  {filters.status && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      Status: {filters.status}
                      <button
                        onClick={() => handleStatusFilter('')}
                        className="ml-1 hover:text-red-500 transition-colors leading-none"
                      >×</button>
                    </span>
                  )}
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      Search: "{filters.search}"
                      <button
                        onClick={() => { setSearch(''); setFilters((f) => ({ ...f, search: '', page: 1 })); }}
                        className="ml-1 hover:text-red-500 transition-colors leading-none"
                      >×</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Error state */}
            {error && (
              <div className="p-8 text-center">
                <p className="text-red-500 text-sm">{error}</p>
                <Button variant="ghost" size="sm" className="mt-3" onClick={() => fetchLeads(filters)}>
                  Retry
                </Button>
              </div>
            )}

            {!error && (
              <>
                {/* ── Table ── */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-900/50">
                        <th className="px-6 py-3 whitespace-nowrap">Name</th>
                        <th className="px-4 py-3 whitespace-nowrap">Email</th>
                        <th className="px-4 py-3 whitespace-nowrap">Budget</th>
                        <th className="px-4 py-3 whitespace-nowrap">Message</th>
                        <th className="px-4 py-3 whitespace-nowrap">Status</th>
                        <th className="px-4 py-3 whitespace-nowrap">Date</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {loading && leads.length === 0
                        ? Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} />)
                        : leads.map((lead) => (
                            <motion.tr
                              key={lead._id}
                              className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              layout
                              onClick={() => setSelectedLead(lead)}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {lead.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm font-medium text-zinc-900 dark:text-white whitespace-nowrap">
                                    {lead.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                                  {lead.email}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded-full whitespace-nowrap">
                                  {lead.budget}
                                </span>
                              </td>
                              <td className="px-4 py-4 max-w-[180px]">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                                    {lead.message}
                                  </p>
                                  <Eye className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 flex-shrink-0 group-hover:text-brand-400 transition-colors" />
                                </div>
                              </td>
                              <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleStatusToggle(lead)}
                                  disabled={updatingId === lead._id}
                                  title="Click to advance status"
                                  className="hover:scale-105 transition-transform active:scale-95"
                                >
                                  {updatingId === lead._id ? (
                                    <span className="text-xs text-zinc-400 animate-pulse whitespace-nowrap">Updating…</span>
                                  ) : (
                                    <Badge status={lead.status} />
                                  )}
                                </button>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-xs text-zinc-400 whitespace-nowrap">
                                  {new Date(lead.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setSelectedLead(lead)}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
                                    title="View details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget(lead)}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                    title="Delete lead"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty state */}
                {!loading && leads.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <InboxIcon className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        {filters.search || filters.status ? 'No matching leads' : 'No leads yet'}
                      </h3>
                      <p className="text-sm text-zinc-400 dark:text-zinc-500">
                        {filters.search || filters.status
                          ? 'Try adjusting your search or filter'
                          : 'Leads submitted via the landing page will appear here'}
                      </p>
                    </div>
                    {(filters.search || filters.status) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearch('');
                          setFilters((f) => ({ ...f, search: '', status: '', page: 1 }));
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-3">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Showing{' '}
                      <span className="font-medium text-zinc-900 dark:text-white">
                        {(pagination.page - 1) * pagination.limit + 1}–
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium text-zinc-900 dark:text-white">{pagination.total}</span>
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePage(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - pagination.page) <= 1)
                        .map((p, i, arr) => {
                          const items = [];
                          if (i > 0 && arr[i - 1] !== p - 1) {
                            items.push(<span key={`e-${p}`} className="text-zinc-400 text-sm px-1">…</span>);
                          }
                          items.push(
                            <button
                              key={p}
                              onClick={() => handlePage(p)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                p === pagination.page
                                  ? 'bg-brand-600 text-white'
                                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                              }`}
                            >
                              {p}
                            </button>
                          );
                          return items;
                        })}
                      <button
                        onClick={() => handlePage(pagination.page + 1)}
                        disabled={pagination.page >= pagination.pages}
                        className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Lead Detail Slide-over Panel */}
      <LeadDetailPanel
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleStatusToggle}
      />

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={
          deleteTarget
            ? `Are you sure you want to delete the lead from "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete Lead"
        loading={deleteLoading}
      />
    </div>
  );
}
