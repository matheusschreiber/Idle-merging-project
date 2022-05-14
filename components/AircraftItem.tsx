import { NextPage } from "next";
import { FiPlus } from 'react-icons/fi'

import styles from '../styles/components/AircraftPanel.module.css'
import { Aircraft } from "../types/Aircraft.types";

type ListItem = {
  aircraft:Aircraft,
  ListID: number
}

export const AircraftItem:NextPage<ListItem> = (listitem:ListItem) => {
  
  return(
    <li id={`${listitem.ListID}`} className={listitem.aircraft.id>0?"selectable":""}>
      {
        listitem.aircraft&&listitem.aircraft.id>0?
        <div className={styles.aircraft_item} id={styles.on}>
          <img src="/aircraft_mini.png" draggable="false" alt="aircraft"/>
          <p>{listitem.aircraft.level}</p>
          <h2>level {listitem.aircraft.level}</h2>
          <h3>${listitem.aircraft.money_per_second.toFixed(2)} p/ sec</h3>
        </div>:
        <div className={styles.aircraft_item} id={styles.off}>
          <FiPlus />
          <h2></h2>
        </div>
      }
      
    </li> 
  )
}