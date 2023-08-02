# Aperta Tokens

> Palabra gallega, que significa abrazo, la librería de diseño debe ser algo que abrace a todos los proyectos, tratándolos por igual y teniendo lo que necesita cada uno

## Getting Started

To start, clone this repo and run:

```bash
npm i
```

Create a local .env file named `.env.local` on main folder, and paste your Figma API Token on it (you can generate an API Token [here](https://www.figma.com/developers/api#access-tokens))

```env
FIGMA_PERSONAL_ACCESS_TOKEN="<YOUR FIGMA TOKEN>"
```

## Other commands

To process tokens from Figma JSON file:

```bash
npm run package:process-tokens
```

To generate Style Dictionary files:

```bash
npm run package:style-dictionary
```

To download Figma Foundations Library icons:

```bash
npm run package:download-svgs
```

To minify the downloaded icons change since last commit:

```bash
npm run package:minify-changed-svgs
```

To minify all the downloaded icons in src/icons folder:

```bash
npm run package:minify-all-svgs
```

## Use in projects

### 1. Install the npm package

```shell
npm i -D @opositatest/aperta-tokens
```

### 2. Use the Aperta tokens in JS, SCSS or in CSS

#### JS

```js
const apertaTokens = require('@opositatest/aperta-tokens/tokens/tokens.js');
```

#### SCSS

1. Configure Sass to import files from `node*modules/`

    ```js
    options: {
        includePaths: [ 'node*modules/' ]
      }
    }
    ```

2. Use it in a Sass file

    ```scss
    @use '@opositatest/aperta-tokens/tokens/tokens.scss';

    .element {
      color: tokens.$color-neutral-dark-80;
    }
    ```

#### CSS

```css
@import '~@opositatest/aperta-tokens/tokens/tokens.css';
```

## Generate release

The releases are automatically generated when a PR is merged. For the process to work correctly, each PR must have the version of the package.json updated.

When someone sends the tokens from Figma to the repository, an automatic pull request is generated, which remains pending for review.
Before merging this PR, it is important to remember to *update the version of the package.json*. Upon merging this PR, a new release will be generated with the changes that have been sent from Figma.

## Set up Figma

1. Install the [Design Tokens Figma plugin](https://www.figma.com/community/plugin/888356646278934516/Design-Tokens)
2. Once you installed it, go to [OpositaTest Library Foundations](https://www.figma.com/file/NDf5x8t9FYTvXLvEiRNa9V/Library-Foundations?type=design&node-id=1237%3A187&t=d7kFyPER5iHe9O3z-1)
3. Open the plugin from main menu, on the "Plugins" -> "Design Tokens" -> "Send Design Tokens to Url" option
4. A window will be opened, you have to fille the fields
   1. Check the "Compress JSON output" option
   2. On "Server url" file you have to put `https://api.github.com/repos/opositatest/aperta-tokens/dispatches`
   3. On "Access token" you have to put your GitHub personal Access Token
5. Press "Save & Export" button and the tokens will be sendend to our repository

## Local development

1. When you run local commands, the build assets are generated on dist folder
2. If you want to send changes from Figma and you don´t have permissions to install plugins, you can export the Figma file to your computer and import on your personal files or click on the "Duplicate to your drafts option". There you can install the plugin needed to make posts from Figma and generate a new tokens releases