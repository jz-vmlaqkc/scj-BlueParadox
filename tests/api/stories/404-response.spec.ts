/*Example:
test("Unknown story returns empty payload", async ({ request }) => {
    const res = await request.get("/api/stories/this-does-not-exist");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.items).toEqual([]); // or whatever "empty" looks like
    });
    */
   //Add tag to simple UI 404 tests