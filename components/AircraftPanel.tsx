import { NextPage } from "next"
import { useState, useEffect } from 'react'

import { Aircraft } from "../types/Aircraft.types"
import { Player } from "../types/Player.types" 

import styles from '../styles/components/AircraftPanel.module.css'

import { handleNewAircraft, handleListAircraft, handleUpgradeAircraft } from '../services/aircraft'
import { AircraftItem } from "./AircraftItem"
import { LoadingBar } from "./LoadingBar"

type ListItem = {
  aircraft:Aircraft,
  ListID: number
}

type PanelObject = {
  player: Player,
  setShowing: Function,
  getFlow: Function
}

export const AircraftPanel:NextPage<PanelObject> = ({player, setShowing, getFlow}) => {
  const [ aircrafts, setAircrafts ] = useState<Aircraft[]>([])
  const [ update, setUpdate ] = useState()
  const [ draggableState, setDraggableState ] = useState<any>();

  async function loadAircrafts(){
    let aux = await handleListAircraft(player.id)

    const length = aux.length
    if(length<6) for(let i=0;i<6-length;i++) {
      let fakeAircraft:Aircraft = {...aux[0]}
      fakeAircraft.id*=-1
      aux.push(fakeAircraft)
    }
   
    setAircrafts(aux)
    loadDrag(aux)
  }


  async function updateAircraft(aircraftId1:number, aircraftId2:number, aircraftArray:Aircraft[]){
    const backup:Aircraft[] = JSON.parse(JSON.stringify([...aircraftArray]))   
    let updatedAircrafts = JSON.parse(JSON.stringify([...aircraftArray]))
    updatedAircrafts[aircraftId2].level++
    updatedAircrafts[aircraftId2].money_per_second += (updatedAircrafts[aircraftId2].level**2)/5
    updatedAircrafts[aircraftId1].id *= -1

    try{
      handleUpgradeAircraft({...backup[aircraftId1]}, {...backup[aircraftId2]})
      return updatedAircrafts
    } catch(err) {
      console.log('Nope, you cant do that' + err)
      setAircrafts(backup)
    }
  }
  

  async function checkMatch(start:HTMLElement, end:HTMLElement, draggable:any, aircraftArray:Aircraft[]){    
    if (start.children[0].children[1].innerHTML==end.children[0].children[1].innerHTML) {
      aircraftArray = await updateAircraft(parseInt(start.id), parseInt(end.id), [...aircraftArray])
    } else if (end.children[0].children[1].innerHTML==="") {
      aircraftArray[parseInt(end.id)] = {...aircraftArray[parseInt(start.id)]}
      aircraftArray[parseInt(start.id)].id *= -1
    }

    draggable.destroy()

    let flow = 0;
    aircraftArray.map((a)=>flow+=a.money_per_second)
    getFlow(flow)
    
    setAircrafts(aircraftArray)
    loadDrag(aircraftArray)
  }

  const addAircraft = async () => {
    let flow = 0;
    aircrafts.map((a)=>flow+=a.money_per_second)
    getFlow(flow)

    let idToBeReplaced:number=0;
    aircrafts.map((a,pos)=>{
      if (a.id<0) {
        idToBeReplaced=pos
        return
      } 
    })

    if (!idToBeReplaced) return

    let aircraftsArray:Aircraft[] = JSON.parse(JSON.stringify([...aircrafts]))
    
    const newAircraft = await handleNewAircraft({
      player_id:player.id,
      level:1,
      money_per_second:10,
      bonus_multiplier:1
    })
    
    aircraftsArray[idToBeReplaced] = newAircraft
    setAircrafts(aircraftsArray)     
    loadDrag(aircraftsArray)
  }

  async function loadDrag(aircrafts:Aircraft[]){
    const {
      Draggable,
    } = await import(/* webpackChunkName: "user-defined" */'@shopify/draggable')

    if (draggableState) draggableState.destroy()

    const containers = document.querySelectorAll('ul');

    if (containers.length === 0) {
      return false;
    }

    const draggable = new Draggable(containers, {
      draggable: 'li',
      mirror: {
        constrainDimensions: true,
      },
    });

    draggable.on("drag:move", () => {
      let element:HTMLElement = document.getElementsByClassName('draggable-source--is-dragging')[0] as HTMLElement
      element.style.visibility = 'hidden';   
    });

      // draggable.on("drag:over", ()=>{
      //   let element:HTMLElement = document.getElementsByClassName('draggable--over')[0]
      //   console.log(element.children[0].children[1].innerHTML)
      // })

    draggable.on("drag:stop", () => {
      let start:HTMLElement = document.getElementsByClassName('draggable-source--is-dragging')[0] as HTMLElement
      let end:HTMLElement = document.getElementsByClassName('draggable--over')[0] as HTMLElement

      if (!start || !end) return
      checkMatch(start, end, draggable, aircrafts) 
    })

    setDraggableState(draggable)
  }

  useEffect(()=>{
    loadAircrafts()
  },[update])
    
  return(
    <div className={styles.container}>
      
      <div className={styles.title} onClick={()=>setShowing(0)}>
        <h1>FLYING</h1>
      </div>

      <ul className={styles.content}>
        {
          aircrafts.map((aircraft,pos) =>{
            let listitem:ListItem = {
              aircraft:aircraft,
              ListID:pos
            }

            return <AircraftItem key={pos} {...listitem} /> 
          })
        }
      </ul>

      <LoadingBar addAircraft={addAircraft} />

    </div>
  )
}