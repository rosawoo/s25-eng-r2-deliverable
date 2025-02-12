export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          biography: string | null;
          display_name: string;
          email: string;
          id: string;
        };
        Insert: {
          biography?: string | null;
          display_name: string;
          email: string;
          id: string;
        };
        Update: {
          biography?: string | null;
          display_name?: string;
          email?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      species: {
        Row: {
          author: string;
          common_name: string | null;
          description: string | null;
          id: number;
          image: string | null;
          kingdom: Database["public"]["Enums"]["kingdom"];
          scientific_name: string;
          total_population: number | null;
          endangered?: boolean;
        };
        Insert: {
          author: string;
          common_name?: string | null;
          description?: string | null;
          id?: number;
          image?: string | null;
          kingdom: Database["public"]["Enums"]["kingdom"];
          scientific_name: string;
          total_population?: number | null;
          endangered?: boolean;
        };
        Update: {
          author?: string;
          common_name?: string | null;
          description?: string | null;
          id?: number;
          image?: string | null;
          kingdom?: Database["public"]["Enums"]["kingdom"];
          scientific_name?: string;
          total_population?: number | null;
          endangered?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "species_author_fkey";
            columns: ["author"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      comments: {
        Row: {
          id: number;
          species_id: number;
          user_id: string;
          comment_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          species_id: number;
          user_id: string;
          comment_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          species_id?: number;
          user_id?: string;
          comment_text?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_species_id_fkey";
            columns: ["species_id"];
            referencedRelation: "species";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      kingdom: "Animalia" | "Plantae" | "Fungi" | "Protista" | "Archaea" | "Bacteria";
    };
    CompositeTypes: { [_ in never]: never };
  };
}
