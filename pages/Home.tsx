import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import styles from '../styles/Home.module.css'

import { AircraftPanel } from '../components/AircraftPanel'
import { Header } from '../components/Header'
import { Ring } from '../components/Ring'

import { addEmptySpaces, useContextValue } from '../services/ContextElement'

import Router from 'next/router'
import api from '../services/api'
import { errorHandler } from '../services/errorHandler'

const Home: NextPage = () => {
  
  const [ isMouseOverPanel, setMouseOverPanel ] = useState<boolean>(true)  
  const [ showingPanel, setShowingPanel] = useState<boolean>(false)
  const { player, setPlayer, gameTime, maxAircrafts } = useContextValue()

  async function loadPlayerData(){    
    if (!player) {
      try {
        const id = localStorage.getItem('IDLE_ID')
        if (!id) throw Error('No id found')

        const response = await api.get('player/get/'+id)
        localStorage.setItem('IDLE_ID', response.data._id)
        
        await setPlayer(addEmptySpaces(response.data, maxAircrafts))

      } catch (err) {
        errorHandler(err)
        localStorage.removeItem('IDLE_ID')
        Router.push('/')
      }
    }
  }     

  useEffect(()=>{
    loadPlayerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  

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
            style={{width:(gameTime*10)+40+"%"}}
            ></div>
          </li>
        </ul>      
      </aside>

      <main className={styles.main}>
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

        {
          player ?
          <Ring /> 
          : ""
        }


      </main>

      
    </div>
  )
}

export default Home
