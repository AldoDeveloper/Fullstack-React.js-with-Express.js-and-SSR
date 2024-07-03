import express from 'express'
import { api } from './api/api.js'
import { web } from './web/web.js'
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { errorHandle } from './error/error.handling.js';
import path from 'path';
// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

export const csrfToken = csurf({cookie: true});
const app = express();

let vite;

if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  });
  app.use(vite.middlewares);

} else {
  const compression = (await import('compression')).default;
  const sirv        = (await import('sirv')).default;
  app.use(compression())
  app.use(base, sirv(`${process.cwd()}/dist/client`, { extensions: [] }))
}

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(cookieParser());
app.use('/api', api);
app.use('*', web(vite));
app.use(errorHandle);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
});
