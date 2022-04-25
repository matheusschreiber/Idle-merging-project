import { NextPage } from "next";
import { useDrag, DragSourceMonitor } from "react-dnd";

import styles from '../styles/components/AircraftPanel.module.css'
import { Aircraft } from "../types/Aircraft.types";

interface DropResult {
  dropEffect: string
  aircraftID: number
  aircraftlvl: number
}

export const AircraftItem:NextPage<Aircraft> = (aircraftObject:Aircraft) => {
  const [{ opacity }, drag ] = useDrag(() => ({
    type:'Aircraft',
    item: {aircraftObject},
    end(item, monitor) {
      const dropResult = monitor.getDropResult() as DropResult

      const differentAircrafts = item.aircraftObject.id!==dropResult.aircraftID
      const samelvlaircrafts = item.aircraftObject.level===dropResult.aircraftlvl
      const allowed = differentAircrafts && samelvlaircrafts

      if (allowed && dropResult.aircraftID>0) {
        console.log(`You merged ${item.aircraftObject.id} into ${dropResult.aircraftID}!`)
      }
    },
    collect: (monitor: DragSourceMonitor) => ({
      opacity: monitor.isDragging() ? 0 : 1,
    }),
  }),[aircraftObject]
  )
  
  
  return(
    <div 
      ref={drag} 
      className={styles.aircraft_item} 
      id={styles.on}
      style={{opacity}}>

      <img src="aircraft_mini.png"/>
      <p>{aircraftObject.level}</p>
      <h2>level {aircraftObject.level}</h2>
      <h3>${aircraftObject.money_per_second} p/ sec</h3>
    </div> 
  )
}