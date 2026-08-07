-- Fix mutable search_path for security hardening
-- This migration sets a fixed search_path for three public functions
-- to prevent potential search_path manipulation attacks
-- Reference: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

-- Fix search_path for move_todo_item function
-- This function uses dynamic SQL with format() and execute
-- Setting search_path to public ensures table resolution is predictable
ALTER FUNCTION public.move_todo_item(p_id uuid, p_from_table text, p_to_table text, p_payload jsonb, p_user_id uuid)
SET search_path = public;

-- Fix search_path for toggle_sub_track_habit function
-- This function references sub_tracks and sub_track_entries tables
-- Setting search_path to public ensures these are resolved correctly
ALTER FUNCTION public.toggle_sub_track_habit(p_track_id uuid, p_user_id uuid, p_date date)
SET search_path = public;

-- Fix search_path for rollover_stale_todos function
-- This function references daily_todos and weekly_todos tables
-- Setting search_path to public ensures these are resolved correctly
ALTER FUNCTION public.rollover_stale_todos(p_user_id uuid, p_today date, p_week_start date)
SET search_path = public;
