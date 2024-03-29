import { NextPage } from "next";
import Image from "next/image";
import { FiPlus } from 'react-icons/fi'

import styles from '../styles/components/AircraftPanel.module.css'
import { Aircraft } from "../types/Aircraft.types";

export type ListItem = {
  aircraft:Aircraft,
  ListID: number
}

export function isBlankAircraft(string: string){
  if (string.includes("blank")) return true
  else return false
}

export function isPendingAircraft(string: string){
  if (string.includes("toRegister")) return true
  else return false
}

export function isValidAircraft(string: string){
  if (!isBlankAircraft(string) && !isPendingAircraft(string)) return true
  else return false
}

export const AircraftItem:NextPage<ListItem> = (listitem:ListItem) => {
  
  return(
    <li id={`${listitem.ListID}`} data-selectable={!isBlankAircraft(listitem.aircraft._id)?'yes':''}>      
      {
        //checking if it is an aircraft
        listitem.aircraft&&!isBlankAircraft(listitem.aircraft._id)?
        
        //if is an aircraft
        <div className={styles.aircraft_item} id={styles.on}>
          {/* <img src="/aircraft_mini.png" draggable="false" alt="aircraft"/> */}
          <div className={styles.aircraft_image_container}>
            <Image src={`/${listitem.aircraft.level}.png`} draggable="false" alt="aircraft image" width={60} height={60}/>
          </div>
          <p>{listitem.aircraft.level}</p> 
          {/* the paragraph must be 2nd child (to enable draggable) */}
          <h2>level {listitem.aircraft.level}</h2>
          <h3>${listitem.aircraft.money_per_second.toFixed(2)} p/ sec</h3>
        </div>
        
        :

        //if is an empty space
        <div className={styles.aircraft_item} id={styles.off}>
          <FiPlus />
          <h2></h2>
        </div>
      }
    </li> 
  )
}