export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          client_id: string
          created_at: string
          id: string
          ip_address: string
          name: string
          status: string
          vulnerabilities: Json | null
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          ip_address: string
          name: string
          status: string
          vulnerabilities?: Json | null
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          ip_address?: string
          name?: string
          status?: string
          vulnerabilities?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          settings: Json | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          settings?: Json | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          settings?: Json | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          action_taken: string | null
          alert_category: string | null
          alert_name: string | null
          client_id: string | null
          comments: string | null
          destination_ip: string | null
          destination_port: number | null
          detection_engine: string | null
          event_id: string
          event_type: string | null
          file_hash_md5: string | null
          file_hash_sha256: string | null
          file_name: string | null
          file_path: string | null
          geo_location: string | null
          host_ip: string | null
          host_name: string | null
          label: string | null
          mitre_attack_tactic: string | null
          mitre_attack_technique: string | null
          network_connection: boolean | null
          parent_process_id: number | null
          parent_process_name: string | null
          persistence_mechanism: string | null
          process_id: number | null
          process_name: string | null
          process_path: string | null
          protocol: string | null
          registry_key: string | null
          severity: string | null
          source_ip: string | null
          source_port: number | null
          status: string | null
          timestamp: string
          user_name: string | null
        }
        Insert: {
          action_taken?: string | null
          alert_category?: string | null
          alert_name?: string | null
          client_id?: string | null
          comments?: string | null
          destination_ip?: string | null
          destination_port?: number | null
          detection_engine?: string | null
          event_id: string
          event_type?: string | null
          file_hash_md5?: string | null
          file_hash_sha256?: string | null
          file_name?: string | null
          file_path?: string | null
          geo_location?: string | null
          host_ip?: string | null
          host_name?: string | null
          label?: string | null
          mitre_attack_tactic?: string | null
          mitre_attack_technique?: string | null
          network_connection?: boolean | null
          parent_process_id?: number | null
          parent_process_name?: string | null
          persistence_mechanism?: string | null
          process_id?: number | null
          process_name?: string | null
          process_path?: string | null
          protocol?: string | null
          registry_key?: string | null
          severity?: string | null
          source_ip?: string | null
          source_port?: number | null
          status?: string | null
          timestamp: string
          user_name?: string | null
        }
        Update: {
          action_taken?: string | null
          alert_category?: string | null
          alert_name?: string | null
          client_id?: string | null
          comments?: string | null
          destination_ip?: string | null
          destination_port?: number | null
          detection_engine?: string | null
          event_id?: string
          event_type?: string | null
          file_hash_md5?: string | null
          file_hash_sha256?: string | null
          file_name?: string | null
          file_path?: string | null
          geo_location?: string | null
          host_ip?: string | null
          host_name?: string | null
          label?: string | null
          mitre_attack_tactic?: string | null
          mitre_attack_technique?: string | null
          network_connection?: boolean | null
          parent_process_id?: number | null
          parent_process_name?: string | null
          persistence_mechanism?: string | null
          process_id?: number | null
          process_name?: string | null
          process_path?: string | null
          protocol?: string | null
          registry_key?: string | null
          severity?: string | null
          source_ip?: string | null
          source_port?: number | null
          status?: string | null
          timestamp?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          client_id: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          permissions: Database["public"]["Enums"]["app_permission"][] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permissions?: Database["public"]["Enums"]["app_permission"][] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permissions?: Database["public"]["Enums"]["app_permission"][] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_permissions: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["app_permission"][]
      }
      has_permission: {
        Args: {
          permission_name: Database["public"]["Enums"]["app_permission"]
          user_uuid: string
        }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      app_permission:
        | "manage_users"
        | "manage_roles"
        | "view_all_clients"
        | "manage_clients"
        | "view_logs"
        | "manage_logs"
        | "view_assets"
        | "manage_assets"
        | "view_reports"
        | "manage_reports"
      app_role: "super_admin" | "soc_admin" | "client_user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_permission: [
        "manage_users",
        "manage_roles",
        "view_all_clients",
        "manage_clients",
        "view_logs",
        "manage_logs",
        "view_assets",
        "manage_assets",
        "view_reports",
        "manage_reports",
      ],
      app_role: ["super_admin", "soc_admin", "client_user"],
    },
  },
} as const
