import { GET } from "../destinations/route";

describe("Destinations API", () => {
  it("returns a random destination with options", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("destination");
    expect(data).toHaveProperty("options");
    expect(data.options.length).toBe(4);
    expect(data.options).toContain(
      `${data.destination.city}, ${data.destination.country}`
    );
  });
});
