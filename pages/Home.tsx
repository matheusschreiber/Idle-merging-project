import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

import styles from '../styles/Home.module.css'
import { FiArrowLeft } from 'react-icons/fi'

import { Aircraft } from '../types/Aircraft.types'
import { Player } from '../types/Player.types'

import { AircraftPanel } from '../components/AircraftPanel'
import { Header } from '../components/Header'
import { Ring } from '../components/Ring'

import { handleGetPlayer } from '../services/player'
import { useContextValue } from '../services/ContextElement'

import Swal from 'sweetalert2'
import Router from 'next/router'

const Home: NextPage = () => {
  
  //FIXME: describe this variable "showing"
  const [ showing, setShowing ] = useState<number>(0)  
  const { player, gameTime, moneyPerSecond, setMoneyPerSecond } = useContextValue()

  async function loadPlayerData(){    
    if (!player) {
      await Swal.fire('Player not found', 'Redirecting to login screen...', 'warning')
      Router.push('/')
      return
    }
  }     

  useEffect(()=>{
    loadPlayerData()
  }, [])  

  useEffect
   
  return (
    <div className={styles.container} onClick={()=>{if(showing==2) setShowing(0)}}>
      <Head>
        <title>IDLE</title>
        <meta name="description" content="Idle game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <aside>
        <ul>
          <li
            onClick={()=>{
              let item = document.getElementsByTagName('li')[0]
              if (!showing) {
                item.innerHTML = 'SOON'
                item.style.backgroundColor = 'var(--dark_gray)'
                item.style.color = 'var(--redish)'
              } else {
                item.innerHTML = 'STORE'
                item.style.backgroundColor = 'white'
                item.style.color = 'var(--dark_gray)'
              }
            }}
            
            onMouseOver={()=>{
              let item = document.getElementsByTagName('li')[0]
              item.style.backgroundColor = 'var(--redish)'
              item.style.color = 'white'}}

            onMouseOut={()=>{
              let item = document.getElementsByTagName('li')[0]
              item.innerHTML = 'STORE'
              item.style.backgroundColor = 'white'
              item.style.color = 'var(--dark_gray)'}}
            >
              STORE
            </li>

          <li onClick={()=>setShowing(2)}>
            FLYING
            <div 
            style={{width:((gameTime%10)*10)+40+"%"}}
            ></div>
          </li>
        </ul>      
      </aside>

      <main className={styles.main}>
        {gameTime} 
        {
          player?
          <Header />
          :"Loading..."
        }

        {/* <div style={player&&(showing===2||showing===20)?{}:{visibility:'hidden'}}>
          {     
            player  ?
            <AircraftPanel 
              player={player} 
              setGlobalTimer={setGlobalTimer}
              reloadPlayer={reloadPlayer}
              setShowing={setShowing} 
              setFlow={setFlow}/> 
            : ""
          }
        </div>

        { player  ? <Ring player={player}/> : "" } */}


      </main>

      
    </div>
  )
}

export default Home
