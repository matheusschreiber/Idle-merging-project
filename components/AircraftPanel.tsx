import { NextPage } from "next"
import { useState, useEffect } from 'react'

import { Aircraft } from "../types/Aircraft.types"

import styles from '../styles/components/AircraftPanel.module.css'

import { AircraftItemWrapper } from "./AircraftItemWrapper"
import { handleGetAircraft } from '../services/crud_aircrafts'
import { handleGetPlayer } from '../services/crud_players'

type playerID = {
  playerID:number
}

type Empty = {
  id:number
}

export const AircraftPanel:NextPage<playerID> = ({playerID}) => {
  const [ aircrafts, setAircrafts ] = useState<Aircraft[]>([])
  const [ update, setUpdate ] = useState()

  async function loadAircrafts(){
    // TODO: Passar essa tratativa para o index.tsx, já que vai ser usada para o ring

    const player = await handleGetPlayer(playerID)
    
    let aux = aircrafts.slice()
    await Promise.all(
      player.aircrafts.split(',').map(async (aircraftID)=>{
        const aircraft = await handleGetAircraft(parseInt(aircraftID))
        aux.push(aircraft)
    }))

    const length = aux.length
    if(length<6) for(let i=1;i<=6-length;i++) {
      let fakeAircraft:Aircraft = {...aux[0]}
      fakeAircraft.id=-i
      aux.push(fakeAircraft)
    }
    console.log(aux)
    setAircrafts(aux)
  }

  useEffect(()=>{
    loadAircrafts()
  },[update])
  
  return(
    <div className={styles.container}>
      
      <div className={styles.title}>
        <h1>FLYING</h1>
      </div>

      <ul className={styles.content}>
        {
          aircrafts.map((a)=>(
            <AircraftItemWrapper key={a.id} {...a}/>
          ))
        }
      </ul>

      <div className={styles.loading_bar_container}>
        <h2>10 seconds until next aircraft</h2>
        <div className={styles.loading_bar}>
          <div className={styles.filled}></div>
        </div>
      </div>
    </div>
  )
}