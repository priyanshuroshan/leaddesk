import { useState, useCallback, useRef } from 'react';
import api from '../services/api';

/**
 * Hook for fetching and managing leads with search, filter, pagination
 * @returns {{
 *   leads: Array,
 *   stats: object,
 *   pagination: object,
 *   loading: boolean,
 *   error: string|null,
 *   filters: object,
 *   setFilters: Function,
 *   fetchLeads: Function,
 *   updateLeadStatus: Function,
 *   deleteLead: Function,
 * }}
 */
export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, closed: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    limit: 10,
    sort: '-createdAt',
  });

  const abortRef = useRef(null);

  const fetchLeads = useCallback(async (overrideFilters = {}) => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    const params = { ...filters, ...overrideFilters };

    try {
      const { data } = await api.get('/leads', {
        params,
        signal: abortRef.current.signal,
      });
      if (data.success) {
        setLeads(data.data);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        setError(err.response?.data?.message || 'Failed to fetch leads');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateLeadStatus = useCallback(async (id, status) => {
    const { data } = await api.patch(`/leads/${id}`, { status });
    if (data.success) {
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: data.data.status } : l))
      );
    }
    return data;
  }, []);

  const deleteLead = useCallback(async (id) => {
    const { data } = await api.delete(`/leads/${id}`);
    if (data.success) {
      setLeads((prev) => prev.filter((l) => l._id !== id));
      setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    }
    return data;
  }, []);

  return {
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
  };
}
