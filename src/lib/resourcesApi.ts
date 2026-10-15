import { supabase } from './supabase';

export interface RatingSummary {
  average: number;
  count: number;
  mine?: number;
}

export interface ResourceSuggestion {
  id: string;
  name: string;
  url: string;
  description: string | null;
  category: string | null;
  createdAt: string;
}

/** All ratings, summarised per resource. Returns null if the table isn't there yet. */
export async function fetchRatingSummaries(userId: string | undefined): Promise<Map<string, RatingSummary> | null> {
  const { data, error } = await supabase.from('english_resource_ratings').select('resource_id, user_id, rating');
  if (error) {
    console.error('fetchRatingSummaries', error);
    return null;
  }
  const map = new Map<string, RatingSummary>();
  for (const row of (data ?? []) as Array<{ resource_id: string; user_id: string; rating: number }>) {
    const cur = map.get(row.resource_id) ?? { average: 0, count: 0 };
    const count = cur.count + 1;
    map.set(row.resource_id, {
      average: (cur.average * cur.count + row.rating) / count,
      count,
      mine: row.user_id === userId ? row.rating : cur.mine,
    });
  }
  return map;
}

export async function rateResource(resourceId: string, userId: string, rating: number): Promise<boolean> {
  const { error } = await supabase
    .from('english_resource_ratings')
    .upsert({ resource_id: resourceId, user_id: userId, rating, updated_at: new Date().toISOString() }, { onConflict: 'resource_id,user_id' });
  if (error) console.error('rateResource', error);
  return !error;
}

export async function fetchMySuggestions(userId: string): Promise<ResourceSuggestion[] | null> {
  const { data, error } = await supabase
    .from('english_resource_suggestions')
    .select('id, name, url, description, category, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchMySuggestions', error);
    return null;
  }
  return ((data ?? []) as Array<{ id: string; name: string; url: string; description: string | null; category: string | null; created_at: string }>).map((r) => ({
    id: r.id,
    name: r.name,
    url: r.url,
    description: r.description,
    category: r.category,
    createdAt: r.created_at,
  }));
}

export async function addSuggestion(
  userId: string,
  s: { name: string; url: string; description?: string; category?: string }
): Promise<ResourceSuggestion | null> {
  const { data, error } = await supabase
    .from('english_resource_suggestions')
    .insert({ user_id: userId, name: s.name, url: s.url, description: s.description || null, category: s.category || null })
    .select('id, name, url, description, category, created_at')
    .single();
  if (error || !data) {
    console.error('addSuggestion', error);
    return null;
  }
  const r = data as { id: string; name: string; url: string; description: string | null; category: string | null; created_at: string };
  return { id: r.id, name: r.name, url: r.url, description: r.description, category: r.category, createdAt: r.created_at };
}

export async function deleteSuggestion(id: string): Promise<boolean> {
  const { error } = await supabase.from('english_resource_suggestions').delete().eq('id', id);
  if (error) console.error('deleteSuggestion', error);
  return !error;
}

/** Add https:// when missing and validate. Returns null for anything that isn't a web URL. */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (!url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}
