import React from "react";

export default function NotFound() : React.ReactNode{
    return(
        <React.Fragment>
            <div className="container-error">
                <div className="text-error text-center">404</div>
                <p className="text-center">NOT FOUND</p>
            </div>
        </React.Fragment>
    )
}