import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import styles from '../styles/components/Header.module.css'

import { FiArrowLeftCircle  } from 'react-icons/fi'

import { Player } from '../types/Player.types'
import { Aircraft } from '../types/Aircraft.types'

import { Button } from './Button'

import { handleGetAircraft } from '../services/aircraft'
import { handleEditPlayer } from '../services/player'
import Router from 'next/router'

type HeaderObject = {
  playerImported: Player,
  flowImported: number
}

export const Header: NextPage<HeaderObject> = ({playerImported, flowImported}) => {
  const [ flow, setFlow ] = useState<number>(0)
  const [ player, setPlayer ] = useState<Player>(playerImported)
  const [ autosave, setAutoSave ] = useState<number>(0)
  const [ maintenanceMode, setMaintenanceMode ] = useState<boolean>(false)

  const autoSaveDelay = 1200 //on seconds (20 minutes)

  function formatValue(value:number){
    if (value>=1000000) return `${(value/1000000).toFixed(2)} million`
    else if (value>=1000000000) return `${(value/1000000000).toFixed(2)} billion`
    else if (value>=1000000000000) return `${(value/1000000000000).toFixed(2)} trillion`
    else if (value>=1000000000000000) return `${(value/1000000000000000).toFixed(2)} quadrillion`
    else if (value>=1000000000000000) return `${(value/1000000000000000).toFixed(2)} quintillion`
    else return value.toFixed(2)
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

  useEffect(()=>setPlayer(playerImported), [playerImported])
  
  
  useEffect(()=>{
    setFlow(flowImported)
    if (!player || maintenanceMode) return

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
  }, [player, autosave, flow, flowImported, maintenanceMode]) 

  return(
    <div className={styles.container}>
      <h1>${player.wallet?formatValue(player.wallet):'loading...'}</h1>
      <p>${flow.toFixed(2)} per second</p>
      <div className={styles.button_container_box}>
        <div 
          className={styles.save_game_container}
          onClick={saveGame}><Button text="Save game" /></div>
        <div 
          className={styles.logout_container}
          onClick={()=>Router.push('/')}><FiArrowLeftCircle /></div>
      </div>
    </div>
  )
}