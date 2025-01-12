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
  pgbouncer: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_auth: {
        Args: {
          p_usename: string;
        };
        Returns: {
          username: string;
          password: string;
        }[];
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
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "author_cran_package_package_id_fkey";
            columns: ["package_id"];
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
            referencedRelation: "cran_packages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cran_package_relationship_related_package_id_fkey";
            columns: ["related_package_id"];
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
            referencedRelation: "ai_models";
            referencedColumns: ["slug"];
          },
        ];
      };
      package_embeddings: {
        Row: {
          _embedded_by_model: string;
          cran_package_id: number;
          created_at: string;
          embedding: string;
          fts_content: unknown | null;
          package_type: Database["public"]["Enums"]["package_embedding_family_type"];
          source_chunk_type: Database["public"]["Enums"]["package_embedding_chunk_type"];
          source_content_hash: string;
          source_label: string | null;
          source_meta: Json | null;
          source_mime_type: Database["public"]["Enums"]["package_embedding_source_mime_type"];
          source_name: string;
          source_og_content: string | null;
          source_path: string | null;
          source_searchable_content: string;
          source_type: Database["public"]["Enums"]["package_embedding_source_type"];
          source_url: string | null;
          updated_at: string | null;
        };
        Insert: {
          _embedded_by_model: string;
          cran_package_id: number;
          created_at?: string;
          embedding: string;
          fts_content?: unknown | null;
          package_type?: Database["public"]["Enums"]["package_embedding_family_type"];
          source_chunk_type?: Database["public"]["Enums"]["package_embedding_chunk_type"];
          source_content_hash: string;
          source_label?: string | null;
          source_meta?: Json | null;
          source_mime_type?: Database["public"]["Enums"]["package_embedding_source_mime_type"];
          source_name: string;
          source_og_content?: string | null;
          source_path?: string | null;
          source_searchable_content: string;
          source_type: Database["public"]["Enums"]["package_embedding_source_type"];
          source_url?: string | null;
          updated_at?: string | null;
        };
        Update: {
          _embedded_by_model?: string;
          cran_package_id?: number;
          created_at?: string;
          embedding?: string;
          fts_content?: unknown | null;
          package_type?: Database["public"]["Enums"]["package_embedding_family_type"];
          source_chunk_type?: Database["public"]["Enums"]["package_embedding_chunk_type"];
          source_content_hash?: string;
          source_label?: string | null;
          source_meta?: Json | null;
          source_mime_type?: Database["public"]["Enums"]["package_embedding_source_mime_type"];
          source_name?: string;
          source_og_content?: string | null;
          source_path?: string | null;
          source_searchable_content?: string;
          source_type?: Database["public"]["Enums"]["package_embedding_source_type"];
          source_url?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "package_embeddings__embedded_by_model_fkey";
            columns: ["_embedded_by_model"];
            referencedRelation: "ai_models";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "package_embeddings_package_id_fkey";
            columns: ["cran_package_id"];
            referencedRelation: "cran_packages";
            referencedColumns: ["id"];
          },
        ];
      };
      press_article_authors: {
        Row: {
          author_slug: string;
          press_article_slug: string;
        };
        Insert: {
          author_slug: string;
          press_article_slug: string;
        };
        Update: {
          author_slug?: string;
          press_article_slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "press_article_authors_author_slug_fkey";
            columns: ["author_slug"];
            referencedRelation: "press_authors";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "press_article_authors_press_article_slug_fkey";
            columns: ["press_article_slug"];
            referencedRelation: "press_articles";
            referencedColumns: ["slug"];
          },
        ];
      };
      press_articles: {
        Row: {
          categories: Database["public"]["Enums"]["press_article_category"][];
          created_at: string;
          sections: Json;
          slug: string;
          subline: string | null;
          synopsis_html: string;
          title: string;
          type: Database["public"]["Enums"]["press_article_type"];
          updated_at: string | null;
        };
        Insert: {
          categories: Database["public"]["Enums"]["press_article_category"][];
          created_at: string;
          sections: Json;
          slug: string;
          subline?: string | null;
          synopsis_html: string;
          title: string;
          type: Database["public"]["Enums"]["press_article_type"];
          updated_at?: string | null;
        };
        Update: {
          categories?: Database["public"]["Enums"]["press_article_category"][];
          created_at?: string;
          sections?: Json;
          slug?: string;
          subline?: string | null;
          synopsis_html?: string;
          title?: string;
          type?: Database["public"]["Enums"]["press_article_type"];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      press_authors: {
        Row: {
          name: string;
          slug: string;
        };
        Insert: {
          name: string;
          slug: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      find_closest_authors: {
        Args: {
          search_term: string;
          result_limit: number;
          max_levenshtein_distance: number;
        };
        Returns: {
          id: number;
          name: string;
          levenshtein_distance: number;
        }[];
      };
      find_closest_package_embeddings: {
        Args: {
          search_term: string;
          result_limit: number;
          package_type_filter?: Database["public"]["Enums"]["package_embedding_family_type"];
          source_mime_type_filter?: Database["public"]["Enums"]["package_embedding_source_mime_type"];
          source_chunk_type_filter?: Database["public"]["Enums"]["package_embedding_chunk_type"];
        };
        Returns: {
          cran_package_id: number;
          source_name: string;
          source_searchable_content: string;
          package_type: Database["public"]["Enums"]["package_embedding_family_type"];
          source_url: string;
          source_mime_type: Database["public"]["Enums"]["package_embedding_source_mime_type"];
          source_type: Database["public"]["Enums"]["package_embedding_source_type"];
          rank: number;
        }[];
      };
      find_closest_packages: {
        Args: {
          search_term: string;
          result_limit: number;
        };
        Returns: {
          id: number;
          name: string;
          synopsis: string;
          levenshtein_distance: number;
        }[];
      };
      match_package_embeddings: {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          cran_package_id: number;
          package_type: string;
          created_at: string;
          updated_at: string;
          source_type: Database["public"]["Enums"]["package_embedding_source_type"];
          source_url: string;
          source_path: string;
          source_name: string;
          source_mime_type: Database["public"]["Enums"]["package_embedding_source_mime_type"];
          source_chunk_type: Database["public"]["Enums"]["package_embedding_chunk_type"];
          source_searchable_content: string;
          _embedded_by_model: string;
          similarity: number;
        }[];
      };
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
      package_embedding_chunk_type: "naive_chunk" | "summary" | "qa_pairs";
      package_embedding_family_type: "cran";
      package_embedding_source_mime_type:
        | "pkg/synopsis"
        | "text/plain"
        | "text/html"
        | "text/markdown"
        | "text/code"
        | "application/json"
        | "application/pdf";
      package_embedding_source_type: "remote" | "internal";
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
      press_article_category: "general" | "announcement";
      press_article_type: "news" | "magazine";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
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
