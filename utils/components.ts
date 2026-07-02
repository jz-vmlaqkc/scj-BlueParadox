export const components = {
  header: {selector: ".scj-navigation", testID: "426" },
  footer: {selector: "footer[aria-label='Site Footer']", testID: "427"},
  cookieBanner: {selector: "#onetrust-banner-sdk" , testID:"47"}
} as const;

/* It's the notes!
export const components = {
    // CSS class
    header: ".scj-navigation",
    
    // HTML tag
    footer: "footer",
    
    // ID
    cookieBanner: "#onetrust-banner-sdk",
    
    // Tag + attribute
    nav: "nav[aria-label='Main navigation']",
    
    // data-testid (recommended for custom components)
    hero: "[data-testid='hero-banner']",
    } as const;

    // Exact match
    "footer[aria-label='Site Footer']"
    
    // Contains
    "footer[aria-label*='Footer']"
    
    // Starts with
    "footer[aria-label^='Site']"
    */   
