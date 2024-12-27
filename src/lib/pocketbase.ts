// src/lib/pocketbase.ts
'use client';

import PocketBase from 'pocketbase';

let pb: PocketBase | null = null;

// Only initialize on the client side
if (typeof window !== "undefined") {
  pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
}

export { pb };
