declare module '@paypal/checkout-server-sdk' {
  namespace core {
    class PayPalHttpClient {
      constructor(environment: SandboxEnvironment | LiveEnvironment);
      execute<T>(request: T): Promise<{ result: any }>;
    }
    class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
    class LiveEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
  }

  namespace orders {
    class OrdersCreateRequest {
      prefer(prefer: string): void;
      requestBody(body: any): void;
    }
    class OrdersCaptureRequest {
      constructor(orderId: string);
    }
  }
}

