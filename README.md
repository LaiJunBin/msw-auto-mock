# msw-auto-mock

A cli tool to generate random mock data from OpenAPI descriptions for [mswx](https://github.com/LaiJunBin/mswx).

## Why

We already have all the type definitions from OpenAPI spec so hand-writing every response resolver is completely unnecessary.

## Usage

**This tool also requires @faker-js/faker >= 8.**

Install:

```sh
pnpm i -D https://github.com/LaiJunBin/msw-auto-mock.git zod mswx @faker-js/faker @anatine/zod-mock
```

Usage:

Define script in `package.json`:

```json
{
  "scripts": {
    "mock": "msw-auto-mock <spec> [options]"
  }
}
```

Example:
```json
{
  "scripts": {
    "mock": "msw-auto-mock ./openapi.yaml -o ./mocks.ts"
  }
}
```

Run:
```sh
pnpm mock
```

## Options

- `-o, --output`: specify output file path or output to stdout.
- `-m, --max-array-length <number>`: specify max array length in response, default value is `20`, it'll cost some time if you want to generate a huge chunk of random data.
- `-t, --includes <keywords>`: specify keywords to match if you want to generate mock data only for certain requests, multiple keywords can be seperated with comma.
- `-e, --excludes <keywords>`: specify keywords to exclude, multiple keywords can be seperated with comma.
- `--base-url`: output code with specified base url or fallback to server host specified in OpenAPI.
- `--node`: by default it will generate code for browser environment, use this flag if you want to use it in Node.js environment.
- `-c, --codes <keywords>`: comma separated list of status codes to generate responses for
- `-z, --zodios <api-client>`: integrate zodios schema and use zod-mock to generate data.
- `-h, --help`: show help info.
