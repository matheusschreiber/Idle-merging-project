
import { createContext, useContext, ReactNode, useState } from "react";

type useContextType = {
    name: string
    setName: Function
    timer:number
    setGlobalTimer: Function
}

const contextDefaultValues: useContextType = {
    name: "null",
    setName: ()=>{},
    timer:0,
    setGlobalTimer: ()=>{}
}

const ContextElement = createContext<useContextType>(contextDefaultValues)

export function useContextValue() {
    return useContext(ContextElement)
}

type Props = {
    children: ReactNode;
}

export function ContextProvider({ children }: Props) {
    const [ name, setName ] = useState<string>("null");
    const [ timer, setGlobalTimer ] = useState<number>(10);


    const value = {
      name,
      setName,
      timer,
      setGlobalTimer
    }

    return (
        <>
            <ContextElement.Provider value={value}>
                {children}
            </ContextElement.Provider>
        </>
    )
}