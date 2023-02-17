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
import api from '../services/api'
import { errorHandler } from '../services/errorHandler'

const Home: NextPage = () => {
  
  //FIXME: describe this variable "showing"
  const [ isMouseOverPanel, setMouseOverPanel ] = useState<boolean>(true)  
  const [ showingPanel, setShowingPanel] = useState<boolean>(false)
  const { player, setPlayer, gameTime, moneyPerSecond } = useContextValue()

  async function loadPlayerData(){    
    if (!player) {
      try {
        const id = localStorage.getItem('IDLE_ID')
        if (!id) throw Error('No id found')

        const response = await api.get('player/get/'+id)
        localStorage.setItem('IDLE_ID', response.data.id)
        setPlayer(response.data)
      } catch (err) {
        errorHandler(err)
        localStorage.removeItem('IDLE_ID')
        Router.push('/')
      }

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
