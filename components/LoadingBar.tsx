import { NextPage } from "next";
import { useEffect, useState } from "react";

import styles from '../styles/components/LoadingBar.module.css'
import { Aircraft } from "../types/Aircraft.types";

type addAircraft = {
  addAircraft:Function,
  aircrafts: Aircraft[],
  setGlobalTimer: Function
}

export const LoadingBar:NextPage<addAircraft> = ({addAircraft, aircrafts, setGlobalTimer}) => {
  const [ timer, setTimer ] = useState<number>(10)
  const [ full, setFull ] = useState<boolean>(true)

  useEffect(()=>{
    for(let i=0;i<aircrafts.length;i++){
      if (aircrafts[i].id<0) {
        setFull(false)
        break
      } else setFull(true)
    }    

    const interval = setInterval(()=>{
      if (full) {
        setTimer(10)
        setGlobalTimer(10)
      } else if (timer<=0) {
        addAircraft(aircrafts)
        setTimer(10)
        setGlobalTimer(10)
      } else {
        setGlobalTimer(timer-1)
        setTimer(timer-1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [aircrafts, full, timer, addAircraft, setGlobalTimer])
  
  return(
    <div className={styles.loading_bar_container}>
      {
        full?
        <h2>FULL</h2>:
        <h2>{timer} seconds until next aircraft</h2>
      }
      
      <div className={styles.loading_bar}>
        <div className={styles.filled} style={{width:(10-timer)*10+"%"}}></div>
      </div>
    </div>
  )


}