/* Example:

test("All stories share the same schema", async ({ request }) => {
    const res = await request.get("/api/stories"); // list endpoint
    const body = await res.json();
    
    for (const story of body.items) {
      expect(story).toMatchObject({
        slug: expect.any(String),
        title: expect.any(String),
        publishedAt: expect.any(String),
        heroImage: expect.any(String),
      });
    }
    });

    */