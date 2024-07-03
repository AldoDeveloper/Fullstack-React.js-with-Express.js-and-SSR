import React from "react";
import { useRouteError } from "react-router-dom";
import NotFound from "./not-found";

export default function ErrorHandleRouteClient() : React.ReactNode{
    const errorRoute = useRouteError() as any;

    if(errorRoute.status === 404) return <NotFound/>;
    return(
        <React.Fragment>
            <h1>ERROR ELEMENT</h1>
        </React.Fragment>
    )
}