import { NextPage } from "next"
import Head from "next/head"

import { useState } from 'react'

import styles from '../styles/Login.module.css'

const Login:NextPage = () =>{
  const [ login, setLogin ] = useState<string>("")
  const [ password, setPassword ] = useState<string>("")
  const [ newPlayer, setNewPlayer ] = useState<boolean>(false)

  return (
    <div className={styles.main_container}>
      <Head>
        <title>IDLE</title>
        <meta name="description" content="Idle game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <input placeholder="LOGIN" type="text" value={login} onChange={(e)=>setLogin(e.target.value)}/>
      <div id={styles.divider}></div>
      <input placeholder="PASSWORD" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>


      <div
        id={styles.new_player} 
        onClick={()=>setNewPlayer(!newPlayer)} 
        style={newPlayer?{backgroundColor:'var(--light_redish)', color:'var(--light_redish'}:{}}>

        <h1>new player</h1>
        <div id={styles.new_player_selector} style={newPlayer?{left:'+26%', backgroundColor:'var(--redish)'}:{}}></div>
      </div>
    </div>
  )
}

export default Login