# SCJohnson: Blue Paradox
## The Test Automation Repo, Welcome!

## Table of Contents
1. [Capabilities & Coverage](#suite-capabilities--test-coverage)
 - [Future Aspirations](#the-future-looks-bright)
2. [Contributing](#contributing)
 - [Setup](#setup)
 - [Guidelines](#guidelines)
3. [Testing](#running-tests)  

## Suite Capabilities & Test Coverage
Currently, this site has six delightfully crafted core pages, with content-driven articles, covering three regional locales.

Testing includes
- Basic link validation
- High level content validation
- Sanity style visual validation
- Varied API validation, like cache-control, schema, & body response
- Storybook testing


### The Future Looks Bright
Due to limited resources, this suite will house smoke level testing. Specific future additions would expand such as:
Accessibiity is configured for a short run on VML AQ's Total Validator
Visual, functional, & link validation are very base level, & condensed.

## Contributing

### Setup

```
npm i
```
That should resolve any dependency issues. Full list:
```
npm install -D @playwright/test@latest
npx playwright install --with-deps
npm install dotenv
npm install cross-env
```

### Guidelines
Always pull from main before you begin.
Always create a new branch before you make any changes.
Make small commits with meaningful messages.
Test your integration before you create a PR.
PRs will not be reviewed without proof.

## Running Tests
Referring to scripts in the package, you can append your testing direction by environment.
This will be updated as suite grows.  


 
