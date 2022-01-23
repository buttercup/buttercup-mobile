import React, { useMemo } from "react";
import { ChildElements } from "../types";

interface IAutofillContext {
    autofillURLs: Array<string>;
    isAutofill: boolean;
}

interface AutofillProviderProps {
    autofillURLs?: Array<string>;
    children: ChildElements;
    isAutofill: boolean;
}

export const AutofillContext = React.createContext<IAutofillContext>({} as IAutofillContext);

export function AutofillProvider(props: AutofillProviderProps) {
    const {
        autofillURLs = [],
        isAutofill
    } = props;
    const context: IAutofillContext = useMemo(() => ({
        autofillURLs,
        isAutofill
    }), [
        autofillURLs,
        isAutofill
    ]);
    return (
        <AutofillContext.Provider value={context}>{props.children}</AutofillContext.Provider>
    );
}
