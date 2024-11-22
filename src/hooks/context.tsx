"use client"

import { createContext, useState } from "react";

interface DevContextValues {
    devMessages: string[];
    setDevMessages: (messages: string[]) => void;
}

export const DevContext = createContext<DevContextValues>({
    devMessages: [],
    setDevMessages: (messages: string[]) => {
        console.log("DevProvider not implemented"+messages);
    },
});

export const DevContextProvider = (props:React.PropsWithChildren) => {
    const [devMessages, setDevMessages] = useState<string[]>([]);
    return (
        <DevContext.Provider value={{
            devMessages,
            setDevMessages
        }}>
            {props.children}
        </DevContext.Provider>
    )
}