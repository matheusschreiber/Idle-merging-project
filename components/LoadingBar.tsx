import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useContextValue } from "../services/ContextElement";
import styles from '../styles/components/LoadingBar.module.css'
import { isBlankAircraft } from "./AircraftItem";

export const LoadingBar:NextPage = () => {
  const [ full, setFull ] = useState<boolean>(false)
  const { gameTime, player, maxAircrafts } = useContextValue()

  useEffect(()=>{
    let flagFull = false
    let validAircrafts = 0

    player?.aircrafts.map((aircraft)=>{
      if (!isBlankAircraft(aircraft._id)) validAircrafts++
      if (validAircrafts>=maxAircrafts) flagFull=true
    })
    setFull(flagFull)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[gameTime])
  
  return(
    <div className={styles.loading_bar_container}>
      {
        full?
        <h2>FULL</h2>:
        <h2>{11-gameTime} seconds until next aircraft</h2>
      }
      
      <div className={styles.loading_bar}>
        <div className={styles.filled} style={!full?{width:gameTime*10+"%"}:{width:"100%"}}></div>
      </div>
    </div>
  )


}