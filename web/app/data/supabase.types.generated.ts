export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      ai_model_families: {
        Row: {
          company: string;
          description: string;
          name: string;
          slug: string;
          url: string | null;
        };
        Insert: {
          company: string;
          description: string;
          name: string;
          slug: string;
          url?: string | null;
        };
        Update: {
          company?: string;
          description?: string;
          name?: string;
          slug?: string;
          url?: string | null;
        };
        Relationships: [];
      };
      ai_models: {
        Row: {
          context_tokens_input: number | null;
          context_tokens_output: number | null;
          created_at: string;
          description: string;
          dimensions: number | null;
          family_slug: string;
          input_modalities: Database["public"]["Enums"]["ai_model_modality"][];
          is_deprecated: boolean;
          model_type: Database["public"]["Enums"]["ai_model_type"];
          name: string;
          output_modalities: Database["public"]["Enums"]["ai_model_modality"][];
          slug: string;
          url: string | null;
        };
        Insert: {
          context_tokens_input?: number | null;
          context_tokens_output?: number | null;
          created_at?: string;
          description: string;
          dimensions?: number | null;
          family_slug: string;
          input_modalities: Database["public"]["Enums"]["ai_model_modality"][];
          is_deprecated?: boolean;
          model_type: Database["public"]["Enums"]["ai_model_type"];
          name: string;
          output_modalities: Database["public"]["Enums"]["ai_model_modality"][];
          slug: string;
          url?: string | null;
        };
        Update: {
          context_tokens_input?: number | null;
          context_tokens_output?: number | null;
          created_at?: string;
          description?: string;
          dimensions?: number | null;
          family_slug?: string;
          input_modalities?: Database["public"]["Enums"]["ai_model_modality"][];
          is_deprecated?: boolean;
          model_type?: Database["public"]["Enums"]["ai_model_type"];
          name?: string;
          output_modalities?: Database["public"]["Enums"]["ai_model_modality"][];
          slug?: string;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ai_models_family_slug_fkey";
            columns: ["family_slug"];
            isOneToOne: false;
            referencedRelation: "ai_model_families";
            referencedColumns: ["slug"];
          },
        ];
      };
      author_cran_package: {
        Row: {
          author_id: number;
          package_id: number;
          roles: string[] | null;
        };
        Insert: {
          author_id: number;
          package_id: number;
          roles?: string[] | null;
        };
        Update: {
          author_id?: number;
          package_id?: number;
          roles?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "author_cran_package_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "author_cran_package_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "cran_packages";
            referencedColumns: ["id"];
          },
        ];
      };
      authors: {
        Row: {
          _last_scraped_at: string;
          created_at: string;
          email: string | null;
          extra: string | null;
          github_id: string | null;
          github_link: string | null;
          id: number;
          linkedin_link: string | null;
          name: string;
          orc_id: string | null;
          orc_link: string | null;
          unknown_link: string | null;
          website_link: string | null;
        };
        Insert: {
          _last_scraped_at?: string;
          created_at?: string;
          email?: string | null;
          extra?: string | null;
          github_id?: string | null;
          github_link?: string | null;
          id?: never;
          linkedin_link?: string | null;
          name: string;
          orc_id?: string | null;
          orc_link?: string | null;
          unknown_link?: string | null;
          website_link?: string | null;
        };
        Update: {
          _last_scraped_at?: string;
          created_at?: string;
          email?: string | null;
          extra?: string | null;
          github_id?: string | null;
          github_link?: string | null;
          id?: never;
          linkedin_link?: string | null;
          name?: string;
          orc_id?: string | null;
          orc_link?: string | null;
          unknown_link?: string | null;
          website_link?: string | null;
        };
        Relationships: [];
      };
      cran_package_relationship: {
        Row: {
          package_id: number;
          related_package_id: number;
          relationship_type: Database["public"]["Enums"]["package_relationship_type"];
          version: string | null;
        };
        Insert: {
          package_id: number;
          related_package_id: number;
          relationship_type: Database["public"]["Enums"]["package_relationship_type"];
          version?: string | null;
        };
        Update: {
          package_id?: number;
          related_package_id?: number;
          relationship_type?: Database["public"]["Enums"]["package_relationship_type"];
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cran_package_relationship_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "cran_packages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cran_package_relationship_related_package_id_fkey";
            columns: ["related_package_id"];
            isOneToOne: false;
            referencedRelation: "cran_packages";
            referencedColumns: ["id"];
          },
        ];
      };
      cran_packages: {
        Row: {
          _last_scraped_at: string;
          _parsed_by_model: string | null;
          additional_repositories: Json | null;
          bug_reports: string | null;
          canonical_url: string | null;
          citation: Json | null;
          classification_acm: Json | null;
          classification_msc: Json | null;
          contact: Json | null;
          copyright: Json | null;
          cran_checks: Json | null;
          created_at: string;
          description: string;
          doi: Json | null;
          id: number;
          in_views: Json | null;
          language: string | null;
          last_released_at: string;
          licenses: Json | null;
          link: Json | null;
          macos_binaries: Json | null;
          mailing_list: string | null;
          materials: Json | null;
          name: string;
          needs_compilation: boolean | null;
          old_sources: Json | null;
          os_type: string | null;
          other_urls: Json | null;
          package_source: Json | null;
          priority: string | null;
          r_version: string | null;
          reference_manual: Json | null;
          synopsis: string;
          system_regs: string | null;
          title: string;
          version: string | null;
          vignettes: Json | null;
          windows_binaries: Json | null;
        };
        Insert: {
          _last_scraped_at?: string;
          _parsed_by_model?: string | null;
          additional_repositories?: Json | null;
          bug_reports?: string | null;
          canonical_url?: string | null;
          citation?: Json | null;
          classification_acm?: Json | null;
          classification_msc?: Json | null;
          contact?: Json | null;
          copyright?: Json | null;
          cran_checks?: Json | null;
          created_at?: string;
          description: string;
          doi?: Json | null;
          id?: never;
          in_views?: Json | null;
          language?: string | null;
          last_released_at: string;
          licenses?: Json | null;
          link?: Json | null;
          macos_binaries?: Json | null;
          mailing_list?: string | null;
          materials?: Json | null;
          name: string;
          needs_compilation?: boolean | null;
          old_sources?: Json | null;
          os_type?: string | null;
          other_urls?: Json | null;
          package_source?: Json | null;
          priority?: string | null;
          r_version?: string | null;
          reference_manual?: Json | null;
          synopsis: string;
          system_regs?: string | null;
          title: string;
          version?: string | null;
          vignettes?: Json | null;
          windows_binaries?: Json | null;
        };
        Update: {
          _last_scraped_at?: string;
          _parsed_by_model?: string | null;
          additional_repositories?: Json | null;
          bug_reports?: string | null;
          canonical_url?: string | null;
          citation?: Json | null;
          classification_acm?: Json | null;
          classification_msc?: Json | null;
          contact?: Json | null;
          copyright?: Json | null;
          cran_checks?: Json | null;
          created_at?: string;
          description?: string;
          doi?: Json | null;
          id?: never;
          in_views?: Json | null;
          language?: string | null;
          last_released_at?: string;
          licenses?: Json | null;
          link?: Json | null;
          macos_binaries?: Json | null;
          mailing_list?: string | null;
          materials?: Json | null;
          name?: string;
          needs_compilation?: boolean | null;
          old_sources?: Json | null;
          os_type?: string | null;
          other_urls?: Json | null;
          package_source?: Json | null;
          priority?: string | null;
          r_version?: string | null;
          reference_manual?: Json | null;
          synopsis?: string;
          system_regs?: string | null;
          title?: string;
          version?: string | null;
          vignettes?: Json | null;
          windows_binaries?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "cran_packages_parsed_by_model_fkey";
            columns: ["_parsed_by_model"];
            isOneToOne: false;
            referencedRelation: "ai_models";
            referencedColumns: ["slug"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      ai_model_modality:
        | "text"
        | "image"
        | "audio"
        | "video"
        | "time_series"
        | "other";
      ai_model_type: "embedding" | "generation";
      package_relationship_type:
        | "depends"
        | "imports"
        | "suggests"
        | "enhances"
        | "linking_to"
        | "reverse_depends"
        | "reverse_imports"
        | "reverse_suggests"
        | "reverse_enhances"
        | "reverse_linking_to";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
