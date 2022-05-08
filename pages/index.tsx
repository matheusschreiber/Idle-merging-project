import { FormEvent, useState } from 'react'
import { NextPage } from "next"
import Router from 'next/router'

import Head from "next/head"

import { 
  handleLoginPlayer,
  handleNewPlayer,
  handleDeletePlayer
 } from '../services/player'

import { useContextValue } from '../services/ContextElement'

import styles from '../styles/Login.module.css'
import Swal from 'sweetalert2'

const Login:NextPage = () =>{
  const [ login, setLogin ] = useState<string>("")
  const [ password, setPassword ] = useState<string>("")
  const [ newPlayer, setNewPlayer ] = useState<boolean>(false)  

  const { name, setName } = useContextValue()

  async function handleSubmit(e:FormEvent){
    e.preventDefault()

    if (!newPlayer) {
      const player = await handleLoginPlayer(login, password)
      if (!player) {
        await Swal.fire('Wrong Login', 'Please try again', 'error')
        setPassword("")
        setLogin("")
      } else {
        Swal.fire({
          title: 'Successfully logged in',
          text: 'Redirecting...',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
        localStorage.setItem('IDLE_PLAYER', login)
        setName(login)
        Router.push('/Home')
      }
    } else {
      Swal.fire({
        title: 'Create new account?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, create',
        denyButtonText: `No, take me back!`,
      }).then(async(result) => {
        if (result.isConfirmed) {
          await handleNewPlayer(login, password)
          Swal.fire('New player registered!', '', 'success')
        }
      }).then(()=>{
        setName(login)
        localStorage.setItem('IDLE_PLAYER', login)
        Router.push('/Home')
      })
    }
  }


  return (
    <div className={styles.main_container}>
      <Head>
        <title>IDLE</title>
        <meta name="description" content="Idle game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form className={styles.form_container} onSubmit={(e)=>handleSubmit(e)}>
        <input placeholder="LOGIN" type="text" value={login} onChange={(e)=>setLogin(e.target.value)}/>
        <div id={styles.divider}></div>
        <input placeholder="PASSWORD" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <input type="submit" hidden />
      </form>

      <div
        id={styles.new_player} 
        onClick={()=>setNewPlayer(!newPlayer)} 
        style={newPlayer?{backgroundColor:'var(--light_redish)', color:'var(--light_redish'}:{}}>

        <h1>new player</h1>
        <div id={styles.new_player_selector} style={newPlayer?{left:'+26%', backgroundColor:'var(--redish)'}:{}}></div>
      </div>

      {/* <button onClick={()=>handleDeletePlayer(19)}>delete player</button> */}
    </div>
  )
}

export default Login