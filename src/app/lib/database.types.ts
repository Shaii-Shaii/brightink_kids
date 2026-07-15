type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles_parent: {
        Row: { id: string; full_name: string | null; created_at: string | null }
        Insert: { id: string; full_name?: string | null; created_at?: string | null }
        Update: { id?: string; full_name?: string | null; created_at?: string | null }
      }
      child_profiles: {
        Row: { id: string; parent_id: string | null; name: string; age: number | null; avatar_url: string | null; created_at: string | null }
        Insert: { id?: string; parent_id?: string | null; name: string; age?: number | null; avatar_url?: string | null; created_at?: string | null }
        Update: { id?: string; parent_id?: string | null; name?: string; age?: number | null; avatar_url?: string | null; created_at?: string | null }
      }
      stories: {
        Row: { id: string; child_id: string | null; title: string | null; theme: string | null; content: Json; ai_feedback: Json | null; is_curated: boolean | null; created_at: string | null }
        Insert: { id?: string; child_id?: string | null; title?: string | null; theme?: string | null; content: Json; ai_feedback?: Json | null; is_curated?: boolean | null; created_at?: string | null }
        Update: { id?: string; child_id?: string | null; title?: string | null; theme?: string | null; content?: Json; ai_feedback?: Json | null; is_curated?: boolean | null; created_at?: string | null }
      }
      tracing_progress: {
        Row: { id: string; child_id: string | null; letter: string; accuracy: number | null; attempts: number | null; completed_at: string | null }
        Insert: { id?: string; child_id?: string | null; letter: string; accuracy?: number | null; attempts?: number | null; completed_at?: string | null }
        Update: { id?: string; child_id?: string | null; letter?: string; accuracy?: number | null; attempts?: number | null; completed_at?: string | null }
      }
      vocabulary_progress: {
        Row: { id: string; child_id: string | null; word: string; pronunciation_score: number | null; attempts: number | null; last_practiced_at: string | null }
        Insert: { id?: string; child_id?: string | null; word: string; pronunciation_score?: number | null; attempts?: number | null; last_practiced_at?: string | null }
        Update: { id?: string; child_id?: string | null; word?: string; pronunciation_score?: number | null; attempts?: number | null; last_practiced_at?: string | null }
      }
      comprehension_results: {
        Row: { id: string; child_id: string | null; story_id: string | null; score: number | null; answers: Json | null; completed_at: string | null }
        Insert: { id?: string; child_id?: string | null; story_id?: string | null; score?: number | null; answers?: Json | null; completed_at?: string | null }
        Update: { id?: string; child_id?: string | null; story_id?: string | null; score?: number | null; answers?: Json | null; completed_at?: string | null }
      }
      achievements: {
        Row: { id: string; child_id: string | null; badge_key: string; earned_at: string | null }
        Insert: { id?: string; child_id?: string | null; badge_key: string; earned_at?: string | null }
        Update: { id?: string; child_id?: string | null; badge_key?: string; earned_at?: string | null }
      }
    }
  }
}
