import { NextPage } from "next"
import { useState } from 'react'

import styles from '../styles/components/AircraftPanel.module.css'
import { FiPlusCircle } from 'react-icons/fi'

import { Aircraft } from "../types/Aircraft.types"

export const AircraftPanel:NextPage = () => {
  const [ aircrafts, setAicrafts ] = useState<Aircraft[]>([])

  return(
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>FLYING</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.aircraft_item} id={styles.on}>
          <img src="aircraft_mini.png" />
          <p>1</p>
          <h2>level 1</h2>
          <h3>$12 p/ sec</h3>
        </div> 

        <div className={styles.aircraft_item} id={styles.on}>
          <img src="aircraft_mini.png" />
          <p>2</p>
          <h2>level 2</h2>
          <h3>$15 p/ sec</h3>
        </div>

        <div className={styles.aircraft_item} id={styles.off}>
          <FiPlusCircle />
          <h2></h2>
        </div>

        <div className={styles.aircraft_item} id={styles.off}>
          <FiPlusCircle />
          <h2></h2>
        </div>

        <div className={styles.aircraft_item} id={styles.off}>
          <FiPlusCircle />
          <h2></h2>
        </div>

        <div className={styles.aircraft_item} id={styles.off}>
          <FiPlusCircle />
          <h2></h2>
        </div>
      </div>

      <div className={styles.loading_bar_container}>
        <h2>10 seconds until next aircraft</h2>
        <div className={styles.loading_bar}>
          <div className={styles.filled}></div>
        </div>
      </div>
    </div>
  )
}