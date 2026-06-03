# API Test Overview!
For reference, the package.json script for "stageApi" will run all the tests tagged with api. But here comes the breakdown!

## Locales
This tests the cache settings & redirect behavior of pages under a locale parameter:
1. For the "core" pages (sanity or smoke)
2. For any page in the sitemap (regression)

 If you want to test these AND the functional test for testing that parameter's persistence, run the script for locales.

## Pages
Same style of testing for NA variant, or "base" variants. The smoke functional test checks for http responses.

## Stories
Note, the fetching sub-folder is only there to populate some of the utilities used for the api tests, they're marked to be skipped intentionally.

This is more comprehensive to test whenever the client pushes up new "articles" to ensure their response body & schema remain intact.
