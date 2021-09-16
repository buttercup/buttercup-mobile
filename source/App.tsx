import React from "react";
import { StandardApp } from "./StandardApp";
import { AutofillApp } from "./AutofillApp";

interface AppProps {
    isContextAutoFill?: number;
    serviceIdentifiers?: Array<string>;
}

export function App(props: AppProps = {}) {
    console.log("AppProps", props);
    if (props.isContextAutoFill === 1) {
        return (
            <AutofillApp
                urls={props.serviceIdentifiers || []}
            />
        );
    }
    return <StandardApp />;
}
