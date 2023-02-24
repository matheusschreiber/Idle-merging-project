
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Aircraft } from "../types/Aircraft.types";
import { Player } from "../types/Player.types";
import api from "./api";
import { errorHandler } from "./errorHandler";

type useContextType = {
    player: Player | null
    setPlayer: Function
    moneyPerSecond: number
    gameTime: number
    maxAircrafts: number
}

const contextDefaultValues: useContextType = {
    player: null,
    setPlayer: (p:Player)=>{},
    gameTime:0,
    moneyPerSecond: 0,
    maxAircrafts: 6
}

export const ContextElement = createContext<useContextType>(contextDefaultValues)

export function useContextValue() {
    return useContext(ContextElement)
}

type Props = {
    children: ReactNode;
}

export const addEmptySpaces = (player: any, max: number) => {    
    if (!player) return player;

    //if there's empty spaces on player, they must be computed
    let playerCopy = {...player}
    let aux = [...playerCopy.aircrafts]
    const initialLength = aux.length
    if (initialLength<max) {
        for(let i=initialLength;i<max;i++){
            aux[i]={...aux[i-1]}
            aux[i].id=-1
        }
        playerCopy.aircrafts = [...aux]
        return playerCopy
    }

    //otherwise just return normally
    return player;
};

export function ContextProvider({ children }: Props) {
    const [ gameTime, setGameTime ] = useState<number>(0);
    const [ playerState, setPlayerState ] = useState<Player|null>(null)
    const [ moneyState, setMoneyState ] = useState<number>(0)
    const { maxAircrafts } = useContextValue()

    const addAircraft = () => {
        if (!playerState || !playerState.aircrafts) return;
        
        let idToBeReplaced:number|null=null;

        for(let i=0;i<playerState.aircrafts.length;i++){
            if (playerState.aircrafts[i].id<0) {
                idToBeReplaced=i
                break
            }
        }
        
        if (idToBeReplaced==null || idToBeReplaced>=maxAircrafts) return;

        const newAircraftData = {
            player_id:playerState.id,
            level:1,
            money_per_second:10,
            bonus_multiplier:1
        }

        let playerCopy = {...playerState}
        playerCopy.aircrafts[idToBeReplaced] = {
            id: new Date().getTime()+0.5, //this id is float, to indicate to backend that this aircraft is not registered yet
            ...newAircraftData
        }
        
        setPlayerState(playerCopy)
    }

    const saveGame = async () => {
        try {
            //FIXME: this cant be made like this
            // i must save the changes on each aircraft first!!!!!
            await api.post('player/edit', playerState)
        } catch (err) {
            errorHandler(err)
        }
    }

    useEffect(()=>{
        const gameLoop = setInterval(() => {
            if (playerState) {
                if (gameTime<10) setGameTime(gameTime+1)
                else setGameTime(1)

                let aux = 0
                playerState?.aircrafts?.map((aircraft:Aircraft)=>{
                    if (aircraft.id>0) aux += aircraft.money_per_second * aircraft.bonus_multiplier
                })

                let copyPlayer = {...playerState}
                copyPlayer.wallet+=aux
                setPlayerState(copyPlayer)
                setMoneyState(aux)
                
                if ((gameTime%10)*10 == 0) {
                    // saveGame()
                    addAircraft()
                }
            }        
        }, 1000);

        return () => clearInterval(gameLoop);
    }, [gameTime, playerState]) 

    const value = {
        player:playerState,
        setPlayer:setPlayerState,
        moneyPerSecond:moneyState,
        gameTime,
        maxAircrafts
    }

    return (
        <>
            <ContextElement.Provider value={value}>
                {children}
            </ContextElement.Provider>
        </>
    )
}


