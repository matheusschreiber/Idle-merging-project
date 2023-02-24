import type { NextPage } from 'next'
import Swal from 'sweetalert2'
import styles from '../styles/components/Header.module.css'
import { FiArrowLeftCircle  } from 'react-icons/fi'
import { Button } from './Button'
import Router from 'next/router'
import { useContextValue } from '../services/ContextElement'


export const Header: NextPage = () => {
  const { player, moneyPerSecond } = useContextValue()

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
    
    console.log('saving this player: ')
    console.log(player)
    
    let value = {...player}
    value.wallet = parseFloat(value.wallet.toFixed(2))

    //TODO: add player update route

    Swal.fire({
      position: 'top-end',
      icon: 'success',
      width:300,
      text: 'The game was saved',
      showConfirmButton: false,
      timer: 1500
    })
  }

  return(
    <div className={styles.container}>
      {/* <h1>${player.wallet?formatValue(player.wallet):'loading...'}</h1> */}
      <h1>{player?new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(player.wallet):'loading...'}</h1>
      <p>{moneyPerSecond?new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(moneyPerSecond)+' per second':'loading...'}</p>
      {/* <p>${flow.toFixed(2)} per second</p> */}
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