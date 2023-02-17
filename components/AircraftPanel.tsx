import { NextPage } from "next"
import { useState, useEffect } from 'react'

import { Aircraft } from "../types/Aircraft.types"
import { Player } from "../types/Player.types" 

import styles from '../styles/components/AircraftPanel.module.css'

import { AircraftItem, ListItem } from "./AircraftItem"
import { LoadingBar } from "./LoadingBar"

import { Spinner } from "react-activity"
import "react-activity/dist/library.css";
import { useContextValue } from "../services/ContextElement"

export const AircraftPanel:NextPage = () => {
  const [ aircrafts, setAircrafts ] = useState<Aircraft[]>([]);
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ draggableState, setDraggableState ] = useState<any>();

  const { player, setPlayer, gameTime } = useContextValue()
  
  async function loadAircrafts(){
    if (!player) return;
    let aux:Aircraft[] = [...player.aircrafts]

    const initialLength = aux.length
    if(initialLength<6) {
      for(let i=0;i<6-initialLength;i++) {
        let fakeAircraft:Aircraft = {...aux[0]}
        fakeAircraft.id*=-1
        aux.push(fakeAircraft)
      }
    }

    setAircrafts(aux)
    loadDrag(aux)
  }

  
  async function checkMatch(start:HTMLElement, end:HTMLElement, draggable:any, aircraftArray:Aircraft[]){    
    if (start.children[0].children[1].innerHTML==end.children[0].children[1].innerHTML) {
      draggable.destroy()
      // console.log(aircraftArray[parseInt(start.id)])
      // console.log(aircraftArray[parseInt(end.id)])
      const aircraftStartID = aircraftArray[parseInt(start.id)].id
      const aircraftEndID = aircraftArray[parseInt(end.id)].id
      
      let auxAircrafts = aircraftArray.filter(aircraft=> 
        aircraft.id!=aircraftEndID && aircraft.id>=0
      )

      auxAircrafts.map(aircraft=> {
        if (aircraft.id==aircraftStartID) {
          aircraft.level+=1
          aircraft.money_per_second*=1.2
        }
      })

      
      let auxPlayer = {...player}
      auxPlayer.aircrafts = auxAircrafts
      setPlayer(auxPlayer)
      
    } else {
      const copy = {...aircraftArray[parseInt(end.id)]}
      aircraftArray[parseInt(end.id)] = {...aircraftArray[parseInt(start.id)]}
      aircraftArray[parseInt(start.id)] = {...copy}
    }
    
    draggable.destroy()
    loadDrag(aircraftArray)
  }

  const addAircraft = async (aircraftImportedArray:Aircraft[]) => {
    let idToBeReplaced:number=0;
    aircraftImportedArray.map((a,pos)=>{
      if (a.id<0) {
        idToBeReplaced=pos
        return
      } 
    })

    if (!idToBeReplaced) return

    let aircraftsArray:Aircraft[] = JSON.parse(JSON.stringify([...aircrafts]))
    
    //FIXME: remove api call
    const newAircraft = await handleNewAircraft({
      player_id:player.id,
      level:1,
      money_per_second:10,
      bonus_multiplier:1
    })
    
    aircraftsArray[idToBeReplaced] = newAircraft

    let flow = 0;
    aircraftsArray.map((a)=>{
      if (a && a.id>=0) flow+=a.money_per_second
    })
    setFlow(flow)

    reloadPlayer(player.id)
    setAircrafts(aircraftsArray.filter((a)=>a!==null))     
    loadDrag(aircraftsArray)
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
    loadAircrafts()
  },[player?.aircrafts])
    
  return(
    <div className={styles.container}>
      
      <div className={styles.title}>
        <h1>FLYING</h1>
        <Spinner animating={loading} />
      </div>

      <ul className={styles.content}>
        {
          aircrafts?.map((aircraft,pos) =>{
            let listitem:ListItem = {
              aircraft:aircraft,
              ListID:pos
            }

            return <AircraftItem key={pos} {...listitem} /> 
          })
        }
      </ul>

      {/* <LoadingBar 
        addAircraft={addAircraft}
        aircrafts={aircrafts}
        setGlobalTimer={setGlobalTimer} /> */}

    </div>
  )
}