export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      secrets: {
        Row: {
          content: string | null
          created_at: string | null
          expires_at: string
          hash: string
          id: number
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          expires_at: string
          hash: string
          id?: number
        }
        Update: {
          content?: string | null
          created_at?: string | null
          expires_at?: string
          hash?: string
          id?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
