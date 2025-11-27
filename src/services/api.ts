import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login or clear token
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/auth/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  me: async () => {
    return api.get('/users/me'); 
  }
};

export const dashboardApi = {
  getStudentDashboard: async (studentId: number) => {
    const response = await api.get(`/dashboard/${studentId}`);
    return response.data;
  },
  getTimeline: async (studentId: number) => {
    const response = await api.get(`/dashboard/${studentId}/timeline`);
    return response.data;
  },
  getAdminStats: async () => {
    const response = await api.get('/dashboard/admin/stats');
    return response.data;
  }
};

export const studentsApi = {
  getAll: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const response = await api.get(`/users/?skip=${skip}&limit=${limit}`);
    return response.data;
  }
};

export const agentsApi = {
  getDispatch: async () => {
    const response = await api.get('/monitor/dispatch');
    return response.data;
  },
  getRecentActivity: async () => {
    const response = await api.get('/monitor/recent-activity');
    return response.data;
  }
};

export const analyticsApi = {
  getFeatureImportance: async () => {
    const response = await api.get('/analytics/feature-importance');
    return response.data;
  },
  getCorrelations: async () => {
    const response = await api.get('/analytics/correlations');
    return response.data;
  },
  runSimulation: async (adjustmentFactor: number, targetVariable: string) => {
    const response = await api.post(`/analytics/simulation?adjustment_factor=${adjustmentFactor}&target_variable=${targetVariable}`);
    return response.data;
  }
};

export const financialApi = {
  getStats: async () => {
    const response = await api.get('/financial/stats');
    return response.data;
  },
  getTrends: async () => {
    const response = await api.get('/financial/trends');
    return response.data;
  },
  getDelinquency: async () => {
    const response = await api.get('/financial/delinquency');
    return response.data;
  }
};

export const genericCrudApi = {
  getAll: async (resource: string) => {
    // Resource format: "academic/materias" or "admin/categorias"
    const response = await api.get(`/${resource}/`);
    return response.data;
  },
  create: async (resource: string, data: any) => {
    const response = await api.post(`/${resource}/`, data);
    return response.data;
  },
  update: async (resource: string, id: number, data: any) => {
    const response = await api.put(`/${resource}/${id}`, data);
    return response.data;
  },
  delete: async (resource: string, id: number) => {
    const response = await api.delete(`/${resource}/${id}`);
    return response.data;
  }
};

export const attendanceApi = {
  getStats: async () => {
    const response = await api.get('/attendance/stats');
    return response.data;
  },
  getByCourse: async () => {
    const response = await api.get('/attendance/by-course');
    return response.data;
  },
  getCritical: async () => {
    const response = await api.get('/attendance/critical');
    return response.data;
  }
};

export const rolesApi = {
  getUsersWithRoles: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const response = await api.get(`/roles/users-with-roles?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  assignRole: async (personaId: number, categoriaId: number) => {
    const response = await api.post('/roles/assign-role', { persona_id: personaId, categoria_id: categoriaId });
    return response.data;
  },
  revokeRole: async (personaId: number, categoriaId: number) => {
    const response = await api.post('/roles/revoke-role', { persona_id: personaId, categoria_id: categoriaId });
    return response.data;
  }
};

export const logsApi = {
  search: async (params: any) => {
    // Params: start_date, end_date, user_id, action_type
    const response = await api.get('/admin/logs/search', { params });
    return response.data;
  }
};