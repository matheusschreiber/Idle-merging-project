import { NextPage } from "next"
import { useState, useEffect } from 'react'

import { Aircraft } from "../types/Aircraft.types"
import { Player } from "../types/Player.types" 

import styles from '../styles/components/AircraftPanel.module.css'

import { AircraftItem } from "./AircraftItem"
import { LoadingBar } from "./LoadingBar"

import { Spinner } from "react-activity"
import "react-activity/dist/library.css";
import { useContextValue } from "../services/ContextElement"

type ListItem = {
  aircraft:Aircraft,
  ListID: number
}

export const AircraftPanel:NextPage = () => {
  const [ aircrafts, setAircrafts ] = useState<Aircraft[]>([]);
  const [ update, setUpdate ] = useState<boolean>();
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ draggableState, setDraggableState ] = useState<any>();

  const { player, gameTime } = useContextValue()
  
  async function loadAircrafts(){
    if (!player) return;
    
    let aux:Aircraft[] = player.aircrafts

    if(aux.length<6) {
      for(let i=0;i<6-aux.length;i++) {
        let fakeAircraft:Aircraft = {...aux[0]}
        fakeAircraft.id*=-1
        aux.push(fakeAircraft)
      }
    }
    setAircrafts(aux)
    loadDrag(aux)
  }

  //FIXME: remove api calls
  async function updateAircraft(aircraftId1:number, aircraftId2:number, aircraftArray:Aircraft[]){
    setLoading(true)
    const backup:Aircraft[] = JSON.parse(JSON.stringify([...aircraftArray]))   
    let updatedAircrafts = JSON.parse(JSON.stringify([...aircraftArray]))
    updatedAircrafts[aircraftId2].level++
    updatedAircrafts[aircraftId2].money_per_second += (updatedAircrafts[aircraftId2].level**2)/5
    updatedAircrafts[aircraftId1].id *= -1

    try{
      await handleUpgradeAircraft({...backup[aircraftId1]}, {...backup[aircraftId2]})
      setLoading(false)
      return updatedAircrafts
    } catch(err) {
      setLoading(false)
      console.log('Nope, you cant do that' + err)
      setAircrafts(backup.filter((a)=>a!==null))
    }
  }
  
  async function checkMatch(start:HTMLElement, end:HTMLElement, draggable:any, aircraftArray:Aircraft[]){    
    if (start.children[0].children[1].innerHTML==end.children[0].children[1].innerHTML) {
      draggable.destroy()
      aircraftArray = await updateAircraft(parseInt(start.id), parseInt(end.id), [...aircraftArray])
    } else {
      const copy = {...aircraftArray[parseInt(end.id)]}
      aircraftArray[parseInt(end.id)] = {...aircraftArray[parseInt(start.id)]}
      aircraftArray[parseInt(start.id)] = {...copy}
    }
    
    draggable.destroy()

    let flow = 0;
    aircraftArray.map((a)=>{
      if (a.id>0) flow+=a.money_per_second
    })
    setFlow(flow)
    
    //FIXME: why this?
    reloadPlayer(player.id)
    setAircrafts(aircraftArray.filter((a)=>a!==null))
    
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
    const {Draggable } = await import(/* webpackChunkName: "user-defined" */'@shopify/draggable')
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
      let element:HTMLElement = document.getElementsByClassName('draggable-source--is-dragging')[0] as HTMLElement
      element.style.visibility = 'hidden' 
      element.style.opacity = '0.001';
    });

      // draggable.on("drag:over", ()=>{
      //   let element:HTMLElement = document.getElementsByClassName('draggable--over')[0]
      //   console.log(element.children[0].children[1].innerHTML)
      // })

    draggable.on("drag:stop", async () => {
      let start = document.getElementsByClassName('draggable-source--is-dragging')[0] as HTMLElement
      let end = document.getElementsByClassName('draggable--over')[0] as HTMLElement
      
      if (!start || !end) return
      await checkMatch(start, end, draggable, aircrafts) 
    })

    setDraggableState(draggable)
  }

  useEffect(()=>{
    loadAircrafts()
  },[])
    
  return(
    <div className={styles.container}>
      
      <div className={styles.title}>
        <h1>FLYING</h1>
        <Spinner animating={loading} />
      </div>

      <ul className={styles.content}>
        {
          aircrafts.length?
          aircrafts.map((aircraft,pos) =>{
            let listitem:ListItem = {
              aircraft:aircraft,
              ListID:pos
            }

            return <AircraftItem key={pos} {...listitem} /> 
          })
          :""
        }
      </ul>

      {/* <LoadingBar 
        addAircraft={addAircraft}
        aircrafts={aircrafts}
        setGlobalTimer={setGlobalTimer} /> */}

    </div>
  )
}