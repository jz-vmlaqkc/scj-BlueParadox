/*Example:
test("Story response includes required fields", async ({ request }) => {
    const res = await request.get("/api/stories/the-big-one");
    const body = await res.json();
    
    expect(body).toMatchObject({
      title: expect.any(String),
      author: expect.any(String),
      publishedAt: expect.any(String),
      body: expect.any(String),
    });
    });
*/