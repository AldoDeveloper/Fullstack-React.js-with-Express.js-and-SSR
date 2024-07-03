import React, { startTransition } from "react";
import { renderToPipeableStream, RenderToPipeableStreamOptions, renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom/server";
import { routeController } from "./routes/route";
import { HeaderHtml } from "./entry-header-server";

async function headerFunction(): Promise<string> { // config SEO Header or More
  return renderToString(<HeaderHtml/>)
}

function createFetchRequest(req: any) {
  const { method, headers, body, protocol, hostname, originalUrl } = req;
  const url = `${protocol}://${hostname}${originalUrl}`;
  return new Request(url, {
    method,
    headers: new Headers(headers),
    body: method === 'GET' || method === 'HEAD' ? null : body
  });
}

export async function render(url?: string, _ssrManifest?: string, options?: RenderToPipeableStreamOptions, req?: any) {

  let body: any;
  let header : any;

  if (req) {
    let { query, dataRoutes } = createStaticHandler(routeController);
    let fetchRequest = createFetchRequest(req);
    let context = await query(fetchRequest);
    if (context instanceof Response) throw context;
    let router: any;

    startTransition(() => {
      router = createStaticRouter(dataRoutes, context);
    });

    body = renderToPipeableStream(
      <React.Suspense fallback={<><h2>Loading</h2></>}>
        <StaticRouterProvider
          hydrate={true}
          router={router}
          context={context} />
      </React.Suspense>,
      options
    );
  }else{
    header = await headerFunction();
  }

  return { body, header }
}
