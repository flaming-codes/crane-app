# og-poster-gen

## About

This service generates an image for the open graph poster to be used for entities' sites hosted on https://www.cran-e.com. It makes a screenshot of the entity's poster site and returns it as a JPEG image.

## Development

### Requirements

Make sure you have the currently selected version from `/.nvmrc` installed. You can run `nvm use` to switch to the correct version if you have nvm installed.

- [Node.js](https://nodejs.org/en/) (v18.x)

If not present, copy the contents of `.env.example` to `.env`. Replace the path to your local Chromium executable in the `CHROME_BIN` variable if necessary.

### Installation

```bash
npm i
```

### Usage

For development, you can simply start the server using the following command:

```bash
npm dev
```

There's currently no live reloading. You'll have to restart the server after every change. There's no transpilation step. We're using JSDoc's TypeScript support to infer the types w/o using TypeScript.

After starting the server, you can simply provide the `domain` and `id` as part of the path. For example, to generate an image for the entity with the id `xadmix` for the domain `package`, you can simply visit `http://localhost:7070/package/xadmix`. This will in turn call the website and make a screenshot of the entity's poster site.
