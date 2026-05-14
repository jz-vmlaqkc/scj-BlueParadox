export const components = {
  header: ".scj-navigation",
  footer: "footer[aria-label='Site Footer']",
  cookieBanner: "#onetrust-banner-sdk",
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
