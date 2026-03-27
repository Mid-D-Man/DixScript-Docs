declare global {
  namespace App {
    interface Platform {
      env: {
        MDIX_REGISTRY: R2Bucket;
        ADMIN_KEY: string;
      };
    }
  }
}

export {};
