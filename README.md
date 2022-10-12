# Plone Remix Stack

[Remix](https://remix.run/stacks) stack for [Plone 6](https://plone.org/), the enterprise open-source CMS.

Handles multilanguage routing, navigation, and content rendering.

Supports [Volto](https://github.com/plone/volto) blocks with [volto-slate](https://github.com/plone/volto/tree/master/packages/volto-slate) text blocks.

Learn more about [Remix Stacks](https://remix.run/stacks).

```sh
npx create-remix --template raw-material/plone-remix
```

## What's in the stack

### i18n

- [remix-i18next](https://github.com/sergiodxa/remix-i18next)

### Plone REST API TypeScript Client

- [plone-restapi-client](https://github.com/collective/plone-restapi-client)

### Linting and formatting

- [Prettier](https://prettier.io)
- [ESLint](https://eslint.org)
- [StyleLint](https://stylelint.io/)
- [Husky](https://typicode.github.io/husky/#/)
- [Commitlint](https://commitlint.js.org/#/)

### Release

- [Commitlint](https://commitlint.js.org/#/)
- [Release-it](https://github.com/release-it/release-it)

### Misc

- [Storybook](https://storybook.js.org)
- [GitHub Actions](https://github.com/nzambello/vite-react-template/actions)

### Make it yours

In the `package.json` file, check `release-it`, `eslint`, `stylelint` and `prettier` configurations and change the values to match your project and your preferences.

## Getting started

Use this template:

```sh
npx create-remix --template raw-material/plone-remix
```

Or clone this template:

```sh
npx degit raw-material/plone-remix
```

And setup your environment variables:

```sh
mv .env.example .env
```

### Configuration

The stack is configured to work with a Plone site running on `http://localhost:8080/Plone` with the `plone.restapi` addon installed.

Check the `.env` file to change the configuration.

Setup your project settings in `app/config.tsx` as you do in Volto.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
