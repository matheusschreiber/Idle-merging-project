import { NextPage } from "next";
import { FunctionComponent, useEffect, useState } from "react";

import styles from '../styles/components/LoadingBar.module.css'

type addAircraft = {
  addAircraft:Function
}

export const LoadingBar:NextPage<addAircraft> = ({addAircraft}) => {
  const [ timer, setTimer ] = useState<number>(10)


  useEffect(()=>{
    const interval = setInterval(()=>{
      if (timer<=0) {
        addAircraft()
        setTimer(10)
      } else setTimer(timer-1)
    }, 1000)

    return () => clearInterval(interval)
  })
  
  return(
    <div className={styles.loading_bar_container}>
      <h2>{timer} seconds until next aircraft</h2>
      <div className={styles.loading_bar}>
        <div className={styles.filled} style={{width:(10-timer)*10+"%"}}></div>
      </div>
    </div>
  )


}