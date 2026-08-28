import { defineStore } from 'pinia'
import authService from '../services/authService'
import userService from '../services/userService'
import { useChatStore } from './chatStore'

// Define the store
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
    currentAgency: JSON.parse(localStorage.getItem('currentAgency') || 'null'),
    users: [], // Add users list
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    userAgencyId: (state) => state.currentUser?.agencyId,
    userCompanyId: (state) => state.currentUser?.companyId,
    isAdmin: (state) => state.currentUser?.role === 'admin',
    isSuperAdmin: (state) => state.currentUser?.role === 'superadmin',
    currentAgencyId: (state) => state.currentAgency?.id,
    getAllUsers: (state) => {
      const all = state.users;
      const current = state.currentUser;
      if (!current) return [];
      if (current.role === 'superadmin') return all;
      return all.filter(u => u.companyId === current.companyId);
    },
  },

  actions: {
    async login(email, password) {
      try {
        const response = await authService.login(email, password);
        const { token, user } = response.data;

        // Store JWT token
        localStorage.setItem('token', token);
        
        // Normalize permissions: MySQL returns 0/1 or strings, sidebar needs real booleans
        let perms = user.permissions || {};
        if (typeof perms === 'string') {
          try { perms = JSON.parse(perms); } catch(e) { perms = {}; }
        }
        if (perms && typeof perms === 'object') {
          const normalized = {};
          for (const key of Object.keys(perms)) {
            normalized[key] = perms[key] === true || perms[key] === 1 || perms[key] === 'true';
          }
          perms = normalized;
        }

        // Store user state
        this.currentUser = {
          id: user.id,
          email: user.email,
          role: user.role,
          agencyId: user.agencyId || null,
          companyId: user.companyId || null,
          name: user.name,
          permissions: perms
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Company context mapping
        if (user.companyId) {
           localStorage.setItem('companyId', user.companyId);
        }

        // Superadmin does not need tenant chat bootstrap on login.
        if (user.role !== 'superadmin') {
          const chatStore = useChatStore();
          if (!chatStore.isInitialized) {
            await chatStore.initializeFromStorage();
          }
        }
        
        return true;
      } catch (error) {
        if (error.response && error.response.status === 401) {
           throw new Error(error.response.data.message || 'Email ou mot de passe invalide');
        } else if (error.response && error.response.status === 403) {
           throw new Error(error.response.data.message || 'Compte suspendu');
        }
        throw new Error('Erreur de connexion au serveur');
      }
    },

    logout() {
      const chatStore = useChatStore()
      chatStore.disconnectLiveUpdates()
      this.currentUser = null
      this.currentAgency = null
      localStorage.removeItem('currentUser')
      localStorage.removeItem('currentAgency')
    },

    async initializeFromStorage() {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
           // We try to authenticate via Backend API
           const response = await authService.getMe();
           this.currentUser = response.data;
           this.currentUser.permissions = this._normalizePermissions(this.currentUser.permissions);
           localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
           if (this.currentUser.companyId) {
             localStorage.setItem('companyId', this.currentUser.companyId);
           }
        } catch(e) {
           console.error("Token verification failed, falling back to storage", e);
           const storedUser = localStorage.getItem('currentUser');
           if (storedUser) {
             this.currentUser = JSON.parse(storedUser);
             this.currentUser.permissions = this._normalizePermissions(this.currentUser.permissions);
           }
        }
      } else {
        // Fallback for offline mode / migration
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          this.currentUser = JSON.parse(storedUser);
          this.currentUser.permissions = this._normalizePermissions(this.currentUser.permissions);
        }
      }
      
      if (this.currentUser) {
         try {
           if (this.currentUser.role !== 'superadmin') {
             await this.fetchUsers();
             const chatStore = useChatStore();
             if (!chatStore.isInitialized) {
               await chatStore.initializeFromStorage();
             }
           }
         } catch(e) {
           console.error('Failed to fetch users implicitly:', e);
         }
      }
      
      // Load currentAgency if it exists
      const storedAgency = localStorage.getItem('currentAgency');
      if (storedAgency) {
        this.currentAgency = JSON.parse(storedAgency);
      }
    },

    _normalizePermissions(perms) {
      if (!perms) return {};
      if (typeof perms === 'string') {
        try { perms = JSON.parse(perms); } catch(e) { return {}; }
      }
      if (typeof perms !== 'object' || Array.isArray(perms)) return {};
      const normalized = {};
      for (const key of Object.keys(perms)) {
        normalized[key] = perms[key] === true || perms[key] === 1 || perms[key] === 'true';
      }
      return normalized;
    },

    async fetchUsers() {
       try {
         const response = await userService.getAll();
         this.users = response.data;
       } catch (error) {
         console.error('Failed to fetch users:', error);
       }
    },

    async addUser(userData) {
      try {
        const response = await userService.create(userData);
        this.users.push(response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to add user:', error);
        throw error;
      }
    },

    async updateUser(updatedUser) {
      try {
        const response = await userService.update(updatedUser.id, updatedUser);
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...response.data };
        }
      } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
      }
    },

    async deleteUser(userId) {
      try {
        await userService.delete(userId);
        this.users = this.users.filter(u => u.id !== userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
        throw error;
      }
    },

    // Helper method to filter data based on multi-tenant SaaS and agency
    filterByAgency(items) {
      if (!this.currentUser) return [] // No user means no access
      if (this.isSuperAdmin) return items // SaaS owner sees literally everything
      
      // Step 1: Strict Multi-Tenant Fencing
      const companyItems = items.filter(item => item.companyId === this.currentUser.companyId)

      // Step 2: Agency filtering (if not a Tenant Admin)
      if (this.isAdmin) return companyItems // Tenant Admin sees all items of their company
      
      return companyItems.filter(item => {
        if (!item.agencyId && item.agentId) {
          return item.agentId === this.currentUser.id
        }
        return item.agencyId === this.currentUser.agencyId
      })
    }
  }
}) 
