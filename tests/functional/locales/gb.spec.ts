import { test, expect } from "@playwright/test";

test('Locale persistence, GB', async ({page}) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Accept Cookies" }).click();
    await page.getByRole("button", { name: "United States (EN)" }).click();
    await page.getByRole("menuitem", { name: "Great Britain (EN)" }).click();

    await page.getByRole("link", { name: "Paradox Logo" }).click();
    await expect(page).toHaveURL('/gb');

    await page
      .getByRole("link", { name: "Paradox of Plastic" })
      .first()
      .click();
    await expect(page).toHaveURL("/gb/paradox-of-plastic");  

    await page.getByRole("link", { name: "Impact Stories" }).first().click();
    await expect(page).toHaveURL("/gb/stories");

    await page.getByRole("link", { name: "Meet Zuzu" }).first().click();
    await expect(page).toHaveURL("/gb/zuzu");

    //Footer Links
    await page.getByRole('link', { name: 'Paradox of Plastic', description: 'Learn more about our story', exact: true }).click();
    await expect(page).toHaveURL("/gb/paradox-of-plastic");  
    
    await page.getByRole('link', { name: 'Impact Stories', description: 'Impact Stories', exact: true }).click();
    await expect(page).toHaveURL("/gb/stories");
    await page
      .getByRole("link", {
        name: "Meet Zuzu",
        description: "Meet Zuzu",
        exact: true,
      })
      .click();
      await expect(page).toHaveURL("/gb/zuzu");
})