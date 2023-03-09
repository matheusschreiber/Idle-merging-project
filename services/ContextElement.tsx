
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { isBlankAircraft, isValidAircraft } from "../components/AircraftItem";
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

export const saveGame = async (player:Player) => {
    try {
        await api.post('player/edit', {
            id: player._id,
            rank: player.rank,
            aircrafts: player.aircrafts,
            wallet: player.wallet
        })

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            width:300,
            text: 'The game was saved',
            showConfirmButton: false,
            timer: 1500
        })

    } catch (err) {
        errorHandler(err)
    }
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
            aux[i]._id="blank " + new Date().getTime()
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
    const [ autoSave, setAutoSave ] = useState<number>(0)
    const { maxAircrafts } = useContextValue()

    const addAircraft = () => {
        if (!playerState || !playerState.aircrafts) return;
        
        let idToBeReplaced:number|null=null;

        for(let i=0;i<playerState.aircrafts.length;i++){
            if (isBlankAircraft(playerState.aircrafts[i]._id)) {
                idToBeReplaced=i
                break
            }
        }
        
        if (idToBeReplaced==null || idToBeReplaced>=maxAircrafts) return;

        const newAircraftData = {
            player_id:playerState._id,
            level:1,
            money_per_second:10,
            bonus_multiplier:1
        }

        let playerCopy = {...playerState}
        playerCopy.aircrafts[idToBeReplaced] = {
            _id: "toRegister " + new Date().getTime(),
            ...newAircraftData
        }
        
        setPlayerState(playerCopy)
    }

    useEffect(()=>{
        const gameLoop = setInterval(() => {
            if (playerState) {
                if (gameTime<10) setGameTime(gameTime+1)
                else setGameTime(1)

                setAutoSave(autoSave+1)

                let aux = 0
                playerState?.aircrafts?.map((aircraft:Aircraft)=>{
                    if (isValidAircraft(aircraft._id)) aux += aircraft.money_per_second * aircraft.bonus_multiplier
                })

                let copyPlayer = {...playerState}
                copyPlayer.wallet+=aux
                setPlayerState(copyPlayer)
                setMoneyState(aux)
                
                if ((gameTime%10) == 0) {
                    addAircraft()

                    // each 20 minutes the game autosaves
                    if (autoSave%1200 == 0 && autoSave) saveGame(playerState)
                }
            }        
        }, 1000);

        return () => clearInterval(gameLoop);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
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


