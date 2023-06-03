import { CliOptions } from './types';
import { OperationCollection, transformToHandlerCode, transformToResObject } from './transform';

const getImportsCode = (options: CliOptions) => {
  const {output, zodios} = options;
  const imports = [`import { rest } from 'mswx';`, `import { faker } from '@faker-js/faker';`, `import { generateMock } from '@anatine/zod-mock';`];

  if (zodios) {
    const outputPath = output.replace(/\\/g, '/').replace(/\.\/|[^\/]+$/g, '');
    const zodiosPath = zodios.replace(/\\/g, '/').replace(/^\.\//g, '').replace(/\.ts$/, '');
    const relativePath = outputPath.replace(/[^\/]+/g, '..');
    const importPath = relativePath + zodiosPath;
    imports.push(`import { schemas } from '${importPath}';`);
  }

  if (options.node) {
    imports.push(`import { setupServer } from 'msw/node'`);
  }

  return imports.join('\n');
};

export const mockTemplate = (operationCollection: OperationCollection, baseURL: string, options: CliOptions) => {
  // console.log(operationCollection[0].response[0].responses?.['application/json']);
  // get output extension
  const { output } = options;
  const ext = output.split('.').slice(-1)[0];

  return `/**
  * This file is AUTO GENERATED by [msw-auto-mock](https://github.com/zoubingwu/msw-auto-mock)
  * Feel free to commit/edit it as you need.
  */
  /* eslint-disable */
  /* tslint:disable */
  ${getImportsCode(options)}
  
  faker.seed(1);
  
  const MAX_ARRAY_LENGTH = ${options?.maxArrayLength ?? 20};

  ${ext === 'ts' ? 
    `
    interface Nexts {
      [key: string]: number;
    }
    const nexts: Nexts = {};
    `.trimEnd() : 
    `
    const nexts = {};
    `.trimEnd()
  }
  let nextValue = 0;
  
  const NextMiddleware = rest.middleware((req, res, ctx, next) => {
    const { pathname } = req.url;
    if (!nexts[pathname]) {
      nexts[pathname] = 0;
    }
    nextValue = nexts[pathname]++;
    return next();
  });
  
  rest.config.API_PREFIX = '${baseURL}';
  export const handlers = [
    ${transformToHandlerCode(operationCollection)}
  ].map(NextMiddleware);
  
  ${transformToResObject(operationCollection, options)}
  
  `
}
