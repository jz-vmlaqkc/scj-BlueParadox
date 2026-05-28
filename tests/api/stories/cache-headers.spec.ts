/*Example:
test("Story responses have cache headers", async ({ request }) => {
    const res = await request.get("/api/stories/the-big-one");
    const headers = res.headers();
    
    expect(headers["cache-control"]).toContain("max-age=");
    expect(headers["cache-control"]).toContain("public");
    });
*/
//3600 is a cache for 1 hour
//Could just make a negative test so cache-control does not have "no-store" as it's value