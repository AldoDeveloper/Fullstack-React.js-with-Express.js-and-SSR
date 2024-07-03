import React from "react";

export const RootLayoutContextLoad = React.lazy(async() => await import("../layout/root.layout"));
export const ErrorHandleRouteClientLoad = React.lazy(async() => await import("../error/element.error"));
export const PageIndexLoad = React.lazy(async() => await import("../page/index"));