import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs/promises';
import { Transform } from 'node:stream';
import path from 'path';
import { csrfToken } from '../server.js';
import { CookieSet } from './middleware/cookie.middleware.js';

const isProduction = process.env.NODE_ENV === 'production';
const base         = process.env.BASE || '/';
const ABORT_DELAY  = 10000;

const templateHtml = isProduction
  ? await fs.readFile(path.join(process.cwd(), 'dist', 'client', 'index.html'), 'utf-8')
  : '';

const ssrManifest = isProduction
  ? await fs.readFile(path.join(process.cwd(), 'dist', 'client', '.vite', 'ssr-manifest.json'), 'utf-8')
  : undefined;

export const web = (vite) => {

    const routesWeb = express.Router();

    routesWeb.use(bodyParser.urlencoded({ extended: true }));
    routesWeb.use(bodyParser.json());

    routesWeb.use(csrfToken);
    routesWeb.use(CookieSet);

    routesWeb.use("*", async (req, res) => {

        const csrfToken = req.csrfToken();
        try {
            const url = req.originalUrl.replace(base, '');
            let template;
            let render;

            if (!isProduction) {
    
                render   = (await vite.ssrLoadModule(path.join(process.cwd(), 'src', 'entry-server.tsx'))).render
                template = await fs.readFile(path.join(process.cwd(), 'index.html'), 'utf-8');
                template = template.replace('<!--app-head-->', `<meta name="csrf-token" content="${csrfToken}"/>${(await render()).header}`);
                template = await vite.transformIndexHtml(`/${url}`, template);

            } else {
                render   = (await import('../dist/server/entry-server.js')).render
                template = templateHtml;
                template = template.replace('<!--app-head-->', `<meta name="csrf-token" content="${csrfToken}"/>${(await render()).header}`);
            }

            let didError = false;

            const { pipe, abort } = (await render(url, ssrManifest, {
                onShellError() {
                    res.status(500)
                    res.set({ 'Content-Type': 'text/html' })
                    res.send('<h1>Something went wrong</h1>')
                },
                onShellReady() {
                    res.status(didError ? 500 : 200);
                    res.set({ 'Content-Type': 'text/html' });
                    const transformStream = new Transform({
                        transform(chunk, encoding, callback) {
                            res.write(chunk, encoding)
                            callback();
                        }
                    });
                    const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`)
                    res.write(htmlStart)
                    transformStream.on('finish', () => {
                        res.end(htmlEnd)
                    });
                    pipe(transformStream);
                },
                onError(error) {
                    didError = true
                    console.error(error)
                }
            }, req)).body

            setTimeout(() => {
                abort();
            }, ABORT_DELAY)

        } catch (e) {
            vite?.ssrFixStacktrace(e)
            res.status(500).end(e.stack)
        }
    });

    return routesWeb;
}