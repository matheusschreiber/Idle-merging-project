
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

export function ContextProvider({ children }: Props) {
    const [ gameTime, setGameTime ] = useState<number>(0);
    const [ playerState, setPlayerState ] = useState<Player|null>(null)
    const [ moneyState, setMoneyState ] = useState<number>(0)
    const { maxAircrafts } = useContextValue()

    const addAircraft = async () => {
        if (!playerState) return;
        
        let idToBeReplaced:number=0;
        playerState.aircrafts.map((a,pos)=>{
            idToBeReplaced=pos+1
        })
        
        //TODO: fixed amount of max aircrafts
        if (idToBeReplaced>=5) return;

        if (!idToBeReplaced) return;
        const newAircraftData = {
            player_id:playerState.id,
            level:1,
            money_per_second:10,
            bonus_multiplier:1
        }

        try {
            const response = await api.post('aircraft/new', newAircraftData)
            let playerCopy = {...playerState}
            playerCopy.aircrafts = [
            ...playerCopy.aircrafts,
            response.data
            ]
            setPlayerState(playerCopy)
        } catch(err) {
            errorHandler(err)
        }
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
        // let aux = 0
        // playerState?.aircrafts.map((aircraft:Aircraft)=>{
        //     aux += aircraft.money_per_second
        // })
        // setMoneyState(aux)
    }, [playerState?.aircrafts])
    

    useEffect(()=>{
        const gameLoop = setInterval(() => {
            if (playerState) {
                if (gameTime<10) setGameTime(gameTime+1)
                else setGameTime(1)

                let aux = 0
                playerState?.aircrafts?.map((aircraft:Aircraft)=>{
                    aux += aircraft.money_per_second * aircraft.bonus_multiplier
                })

                let copyPlayer = {...playerState}
                copyPlayer.wallet+=aux
                setPlayerState(copyPlayer)
                setMoneyState(aux)
                
                if ((gameTime%10)*10 == 0) {
                    // saveGame()
                    // addAircraft()
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