declare global {
  namespace App {
    interface Platform {
      env: {
        MDIX_REGISTRY: R2Bucket;
        ADMIN_KEY: string;
        SUPABASE_URL: string;
        SUPABASE_ANON_KEY: string;
        SUPABASE_SERVICE_ROLE_KEY: string;
      };
    }
  }
}

export {};
