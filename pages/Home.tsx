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
  const [ isMouseOverPanel, setMouseOverPanel ] = useState<boolean>(true)  
  const [ showingPanel, setShowingPanel] = useState<boolean>(false)
  const { player, gameTime, moneyPerSecond } = useContextValue()

  async function loadPlayerData(){    
    if (!player) {
      //TODO: inser an api call to get local storage data an insert on context
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
    <div className={styles.container} onClick={()=>{if(!isMouseOverPanel&&showingPanel) setShowingPanel(false)}}>
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
              item.innerHTML = 'SOON'
              item.style.backgroundColor = 'var(--dark_gray)'
              item.style.color = 'var(--redish)'
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

          <li onClick={()=>setShowingPanel(true)}>
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

        <div style={player&&showingPanel?{}:{display:'none'}}
          onMouseOver={()=>setMouseOverPanel(true)}
          onMouseOut={()=>setMouseOverPanel(false)}>
          {     
            player  ?
            <AircraftPanel /> 
            : ""
          }
        </div>

        {/* { player  ? <Ring player={player}/> : "" } */}


      </main>

      
    </div>
  )
}

export default Home
