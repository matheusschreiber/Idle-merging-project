import { NextPage } from "next";
import { FiPlus } from 'react-icons/fi'

import styles from '../styles/components/AircraftPanel.module.css'
import { Aircraft } from "../types/Aircraft.types";

export type ListItem = {
  aircraft:Aircraft,
  ListID: number
}

export const AircraftItem:NextPage<ListItem> = (listitem:ListItem) => {
  
  return(
    <li id={`${listitem.ListID}`} data-selectable={listitem.aircraft.id>0?'yes':''}>
      {
        //checking if it is an aircraft
        listitem.aircraft&&listitem.aircraft.id>0?
        
        //if is an aircraft
        <div className={styles.aircraft_item} id={styles.on}>
          <img src="/aircraft_mini.png" draggable="false" alt="aircraft"/>
          <p>{listitem.aircraft.level}</p> 
          {/* the paragraph must be 2nd child (to enable draggable) */}
          <h2>level {listitem.aircraft.level}</h2>
          <h3>${listitem.aircraft.money_per_second.toFixed(2)} p/ sec</h3>
        </div>:

        //if is an empty space
        <div className={styles.aircraft_item} id={styles.off}>
          <FiPlus />
          <h2></h2>
        </div>
      }
      
    </li> 
  )
}