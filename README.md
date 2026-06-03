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
npm install fast-xml-parser
npm install zod
```

### Guidelines
Always pull from main before you begin.
Always create a new branch before you make any changes.
If you add another dependency, add it to the list above.
If you add a new tag in any tests, be sure to add it to the scripts in package.json.
Make small commits with meaningful messages.
Test your integration before you create a PR.
PRs will not be reviewed without proof.

## Running Tests
Referring to scripts in the package, you can append your testing direction by environment.
This will be updated as suite grows.  

To use these scripts, select one, & run it after "npm run", for example, run the Storybook tests on Chrome desktop only, to just compare against the latest baselines:
```
npm run test:storybook
```

If you're not using a pre-defined script, make sure you're targeting the right environment, for example:
```
ENV=stage npx playwright test --grep @your-tag-here
```


 
