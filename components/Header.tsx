import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import styles from '../styles/components/Header.module.css'

import { Player } from '../types/Player.types'
import { Aircraft } from '../types/Aircraft.types'

import { Button } from './Button'

import {
  handleNewAircraft,
  handleDeleteAircraft,
  handleEditAircraft,
  handleListAircraft,
  handleGetAircraft
} from '../services/aircraft'

import {
  handleNewPlayer,
  handleEditPlayer,
  handleDeletePlayer,
  handleListPlayer,
  handleGetPlayer
} from '../services/player'

export const Header: NextPage<Player> = (playerImported:Player) => {
  const [ flow, setFlow ] = useState<number>(0)
  const [ player, setPlayer ] = useState<Player>(playerImported)
  const [ autosave, setAutoSave ] = useState<number>(0)
  const [ maintenanceMode, setMaintenanceMode ] = useState<boolean>(true)
  const autoSaveDelay = 1200 //on seconds (20 minutes)

  async function getFlow(){
    let flowSum = 0
    await Promise.all(
      player.aircrafts.split(',').map(async (id:string)=>{
        const aircraft:Aircraft = await handleGetAircraft(parseInt(id))
        flowSum += aircraft.money_per_second
      })
    )

    setFlow(flowSum)
  }

  async function saveGame() {
    if (!player) return

    let value = {...player}
    value.wallet = parseFloat(value.wallet.toFixed(2))
    await handleEditPlayer(value)

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      width:300,
      text: 'The game was saved',
      showConfirmButton: false,
      timer: 1500
    })
  }
  
  
  useEffect(()=>{
    if (!player || maintenanceMode) return

    getFlow()

    const gameLoop = setInterval(() => {
      let playerCopy = {...player}
      playerCopy.wallet += (flow/10)
      setPlayer(playerCopy)
      setAutoSave(autosave+0.1)
    }, 100);

    if (autosave>=autoSaveDelay) {
      saveGame()
      setAutoSave(0)
    }
    
    return () => clearInterval(gameLoop);
  }, [player, autosave, flow]) 

  return(
    <div className={styles.container}>
      <h1>$ {player.wallet?player.wallet.toFixed(2):'loading...'}</h1>
      <p>${flow} per second</p>
      <div 
        className={styles.button_container}
        onClick={saveGame}><Button text="Save game" /></div>
      
    </div>
  )
}