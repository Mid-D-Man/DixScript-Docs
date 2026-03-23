declare global {
  namespace App {
    interface Platform {
      env: {
        MDIX_REGISTRY: R2Bucket;
      };
    }
  }
}

export {};
