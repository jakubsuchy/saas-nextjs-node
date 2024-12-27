// src/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';

// Helper to sync auth to cookie
const syncAuthCookie = (token: string | null) => {
  if (token) {
    // Set cookie that middleware can read
    document.cookie = `pb_auth=${token}; path=/;`;
  } else {
    // Clear cookie
    document.cookie = 'pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!pb) {
      setIsLoading(false);
      return;
    }

    // Initial sync
    if (pb.authStore.isValid) {
      syncAuthCookie(pb.authStore.token);
    }

    setUser(pb.authStore.model);
    setIsLoading(false);

    const unsubscribe = pb.authStore.onChange((token) => {
      setUser(pb.authStore.model);
      syncAuthCookie(token);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!pb) throw new Error('PocketBase not initialized');
    const authData = await pb.collection('users').authWithPassword(email, password);
    setUser(authData.record);
    syncAuthCookie(authData.token);
    return authData;
  };

  const logout = () => {
    if (!pb) return;
    pb.authStore.clear();
    setUser(null);
    syncAuthCookie(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    register: async (data: any) => {
      if (!pb) throw new Error('PocketBase not initialized');
      const username = data.email.toLowerCase().replace(/[@.+]/g, '_').replace(/__+/g, '_');
      return await pb.collection('users').create({
        ...data,
        username,
      });
    },
  };
}
