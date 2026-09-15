import { vi } from 'vitest';

export interface SupabaseMockResult {
  data: unknown;
  error: unknown;
}

export const mockSupabaseResponse: SupabaseMockResult = {
  data: null,
  error: null,
};

const chainable = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  lt: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  gt: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
  },
  rpc: vi.fn().mockReturnThis(),
  then: (onfulfilled?: (value: SupabaseMockResult) => unknown) =>
    Promise.resolve({ data: mockSupabaseResponse.data, error: mockSupabaseResponse.error }).then(onfulfilled),
};

export const mockSupabase = chainable;
