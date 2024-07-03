import { RouteObject, useLoaderData } from "react-router-dom";
import { ErrorHandleRouteClientLoad, PageIndexLoad, RootLayoutContextLoad } from "./route.lazy";
import React from "react";

export const routeController : RouteObject[] = [
    {
        path : '/',

        loader: async ({ params, request }) => {
            return { name: "Aldo Ratmawan", email: "aldo.ratmawan9999@gmail.com" }
        },

        Component: () : React.ReactNode => {
            let data = useLoaderData();
            return <RootLayoutContextLoad/>
        },

        ErrorBoundary : () : React.ReactNode => {
            return <ErrorHandleRouteClientLoad/>
        },

         children : [
            {
                index: true,
                element: <PageIndexLoad/>,
            },
         ]
    }
];