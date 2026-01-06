/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from 'buffer';

interface ProcessLike {
  env: {
    NODE_ENV: string;
  };
}

if (typeof window !== 'undefined') {
  (window as any).global = window;
  (window as any).Buffer = Buffer;
  (globalThis as any).global = globalThis;
  if (!(globalThis as any).process) {
    (globalThis as any).process = {
      env: {
        NODE_ENV: 'production',
      },
    } as ProcessLike;
  }
} else if (typeof globalThis !== 'undefined') {
  (globalThis as any).global = globalThis;
}