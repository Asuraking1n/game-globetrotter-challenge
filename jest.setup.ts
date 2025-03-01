import "@testing-library/jest-dom";

// Mock fetch
global.fetch = jest.fn();

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Mock window.open
window.open = jest.fn();

// Mock NextRequest and NextResponse
jest.mock("next/server", () => {
  class MockNextRequest {
    url: string;
    method: string;
    body: Record<string, unknown>;
    json: () => Promise<Record<string, unknown>>;

    constructor(url: string, options: Record<string, unknown> = {}) {
      this.url = url;
      this.method = (options.method as string) || "GET";
      this.body = (options.body as Record<string, unknown>) || null;
      this.json = () => {
        if (typeof this.body === "string") {
          return Promise.resolve(JSON.parse(this.body));
        } else {
          return Promise.resolve(this.body);
        }
      };
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (
        data: Record<string, unknown>,
        options: Record<string, unknown> = {}
      ) => ({
        status: (options.status as number) || 200,
        json: () => Promise.resolve(data),
      }),
    },
  };
});
