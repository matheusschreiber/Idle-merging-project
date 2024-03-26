import styles from '../styles/components/AircraftPanel.module.css'

import { useState, useEffect } from 'react'
import { NextPage } from "next"

import { addEmptySpaces, useContextValue } from "../services/ContextElement"
import { AircraftItem, ListItem } from "./AircraftItem"
import { Aircraft } from "../types/Aircraft.types"
import { LoadingBar } from "./LoadingBar"

export const AircraftPanel:NextPage = () => {
  const [ draggableState, setDraggableState ] = useState<any>();

  const { player, setPlayer, gameTime, maxAircrafts } = useContextValue()
  
  async function checkMatch(start:HTMLElement, end:HTMLElement, draggable:any, aircraftArray:Aircraft[]){    
    
    // if its just dragging to the same place (just do nothing)
    if (start.id===end.id){}
    
    // if its a match
    else if (start.children[0].children[1].innerHTML==end.children[0].children[1].innerHTML) {
      draggable.destroy()
      const aircraftStartID = aircraftArray[parseInt(start.id)]._id
      const aircraftEndID = aircraftArray[parseInt(end.id)]._id
      
      // improving aircraft of destiny (merge) and deleting the dragged one
      aircraftArray.map(aircraft=> {
        if (aircraft._id==aircraftStartID) {
          aircraft._id="blank " + new Date().getTime()
        } else if (aircraft._id==aircraftEndID) {
          aircraft.level+=1
          aircraft.money_per_second*=2.1
        }
      })
      
      //updating player's aircrafts
      let auxPlayer = {...player}
      auxPlayer.aircrafts = aircraftArray
      setPlayer(addEmptySpaces(auxPlayer, maxAircrafts))

    //if its not a match (just switching places)
    } else {
      const copy = {...aircraftArray[parseInt(end.id)]}
      aircraftArray[parseInt(end.id)] = {...aircraftArray[parseInt(start.id)]}
      aircraftArray[parseInt(start.id)] = {...copy}
    }
    
    draggable.destroy()
    loadDrag(aircraftArray)
  }

  async function loadDrag(aircrafts:Aircraft[]){
    //Draggable library setup
    const { Draggable } = await import(/* webpackChunkName: "user-defined" */'@shopify/draggable')
    if (draggableState) draggableState.destroy()
    const containers = document.querySelectorAll('ul');
    if (containers.length === 0) return false;

    const draggable = new Draggable(containers, {
      draggable: "li",
      mirror: {
        constrainDimensions: true,
      },
    });

    draggable.on("drag:move", () => {
      let element:HTMLElement = document.getElementsByClassName(draggable.getClassNameFor('mirror'))[0] as HTMLElement      
      if (element.attributes[0].value=='yes') {
        element = document.getElementsByClassName(draggable.getClassNameFor('source:dragging'))[0] as HTMLElement
      } 

      element.style.visibility = 'hidden' 
      element.style.opacity = '0.001';
    });

    draggable.on("drag:stop", async () => {
      let element:HTMLElement = document.getElementsByClassName(draggable.getClassNameFor('mirror'))[0] as HTMLElement      
      if (element.attributes[0].value!='yes') return;

      let start = document.getElementsByClassName(draggable.getClassNameFor('source:dragging'))[0] as HTMLElement
      let end = document.getElementsByClassName(draggable.getClassNameFor('draggable:over'))[0] as HTMLElement
      
      if (!start || !end) return;
      await checkMatch(start, end, draggable, aircrafts) 
    })

    setDraggableState(draggable)
  }

  useEffect(()=>{
    //on each update on the aircrafts, reload the draggable
    if (player) loadDrag(player?.aircrafts)
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[player?.aircrafts])

  return(
    <div className={styles.container}>
      
      <div className={styles.title}><h1>FLYING</h1></div>

      <ul className={styles.content}>
        {
          player?.aircrafts.map((aircraft,pos) =>{
            let listitem:ListItem = {
              aircraft:aircraft,
              ListID:pos,
            }

            return <AircraftItem key={pos} {...listitem} /> 
          })
        }
      </ul>

      <LoadingBar />

    </div>
  )
}
