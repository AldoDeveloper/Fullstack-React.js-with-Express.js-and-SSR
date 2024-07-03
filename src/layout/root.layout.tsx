import React from "react";
import { Outlet } from "react-router-dom";

export default function RootLayoutContext(): React.ReactNode {
    return (
        <React.Fragment>
            <Outlet />
        </React.Fragment>
    )
}