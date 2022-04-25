import { NextPage } from "next";
import { useState } from "react";
import { useDrop } from "react-dnd";

import { FiPlusCircle } from 'react-icons/fi'

import styles from '../styles/components/AircraftPanel.module.css'
import { Aircraft } from "../types/Aircraft.types";

import { AircraftItem } from './AircraftItem'

export const AircraftItemWrapper:NextPage<Aircraft> = (aircraftObject:Aircraft) => {

  const [{canDrop, isOver}, drop] = useDrop(() => ({
    accept:'Aircraft',
    drop: () => ({
      aircraftID: aircraftObject.id,
      aircraftlvl: aircraftObject.level,
    }),
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))

  const isActive = canDrop && isOver;
 
  return(
    <li ref={drop}>
      {
        aircraftObject.id>0
        ?
        <AircraftItem {...aircraftObject}/>
        :
        <div id={styles.off} className={styles.aircraft_item}>
          <FiPlusCircle />
          <h2></h2>
        </div>
      }
    </li>
  )
}