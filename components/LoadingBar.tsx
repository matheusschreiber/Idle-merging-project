import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useContextValue } from "../services/ContextElement";
import styles from '../styles/components/LoadingBar.module.css'

export const LoadingBar:NextPage = () => {
  const [ full, setFull ] = useState<boolean>(false)
  const { gameTime, player, maxAircrafts } = useContextValue()

  useEffect(()=>{
    if (player?.aircrafts.length && player?.aircrafts.length> maxAircrafts) setFull(true)
  },[player?.aircrafts])
  
  return(
    <div className={styles.loading_bar_container}>
      {
        full?
        <h2>FULL</h2>:
        <h2>{11-gameTime} seconds until next aircraft</h2>
      }
      
      <div className={styles.loading_bar}>
        <div className={styles.filled} style={{width:gameTime*10+"%"}}></div>
      </div>
    </div>
  )


}