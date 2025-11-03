import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        
        // --- THIS IS THE CORRECTED LOGIC ---
        // The backend sends a flat object. We destructure the token
        // and collect the rest of the properties into a `userData` object.
        const { token, ...userData } = response.data;
        
        // Now, we create the user object that the rest of our app expects.
        const user = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role
        };
        // --- END OF CORRECTION ---

        set({ user, token }); // This now sets the user object correctly.
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return user;
      },
      updateUser: (updatedUserData) => set(state => ({
        user: { ...state.user, ...updatedUserData }
      })),
      logout: () => {
        set({ user: null, token: null });
        delete api.defaults.headers.common['Authorization'];
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
      },
    }
  )
);

export default useAuthStore;