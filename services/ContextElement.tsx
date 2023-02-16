
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Aircraft } from "../types/Aircraft.types";
import { Player } from "../types/Player.types";

type useContextType = {
    player: Player | null
    setPlayer: Function
    moneyPerSecond: number
    setMoneyPerSecond: Function
    gameTime: number
}

const contextDefaultValues: useContextType = {
    player: null,
    setPlayer: (p:Player)=>{},
    gameTime:0,
    moneyPerSecond: 0,
    setMoneyPerSecond: (n:number)=>{}
}

export const ContextElement = createContext<useContextType>(contextDefaultValues)

export function useContextValue() {
    return useContext(ContextElement)
}

type Props = {
    children: ReactNode;
}

export function ContextProvider({ children }: Props) {
    const [ gameTime, setGameTime ] = useState<number>(0);
    const [ playerState, setPlayerState ] = useState<Player|null>(null)
    const [ moneyState, setMoneyState ] = useState<number>(0)

    useEffect(()=>{
        // let aux = 0
        // playerState?.aircrafts.map((aircraft:Aircraft)=>{
        //     aux += aircraft.money_per_second
        // })
        // setMoneyState(aux)
    }, [playerState?.aircrafts])

    useEffect(()=>{
        const gameLoop = setInterval(() => {
            if (playerState) {
                setGameTime(gameTime+1)
                let copyPlayer = {...playerState}
                copyPlayer.wallet+=1
                setPlayerState(copyPlayer)
            }
    
            // if (autosave>=autoSaveDelay) {
            //   saveGame()
            //   setAutoSave(0)
            // }
           
        }, 1000);

        return () => clearInterval(gameLoop);
    }, [gameTime, playerState]) 

    const value = {
        player:playerState,
        setPlayer:setPlayerState,
        moneyPerSecond:moneyState,
        setMoneyPerSecond:setMoneyState,
        gameTime,
    }



    return (
        <>
            <ContextElement.Provider value={value}>
                {children}
            </ContextElement.Provider>
        </>
    )
}