import { create } from 'zustand';

export const useStore = create((set, get) => ({
  database: null,
  currentTenant: null,
  selectedThreat: null,
  isLoading: true,

  setDatabase: (data) => {
    const firstTenantId = Object.keys(data.tenants)[0];
    set({
      database: data,
      currentTenant: firstTenantId,
      isLoading: false
    });
  },

  setCurrentTenant: (tenantId) => set({ currentTenant: tenantId }),
  setSelectedThreat: (threat) => set({ selectedThreat: threat }),

  getTenant: () => {
    const { database, currentTenant } = get();
    return database?.tenants?.[currentTenant] || null;
  },

  getThreats: () => {
    const { database, currentTenant } = get();
    return database?.threats?.[currentTenant] || [];
  },

  getCriticalThreats: () => {
    return get().getThreats().filter(t =>
      t.severity === 'critical'
    );
  },
}));
