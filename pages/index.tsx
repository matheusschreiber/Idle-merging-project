import { FormEvent, useState } from 'react'
import { NextPage } from "next"
import Router from 'next/router'

import { Spinner } from "react-activity";
import "react-activity/dist/library.css";

import Head from "next/head"

import { useContextValue } from '../services/ContextElement'

import styles from '../styles/Login.module.css'
import Swal from 'sweetalert2'
import api from '../services/api';
import { errorHandler } from '../services/errorHandler';

const Login:NextPage = () =>{
  const [ name, setName ] = useState<string>("")
  const [ password, setPassword ] = useState<string>("")
  const [ newPlayer, setNewPlayer ] = useState<boolean>(false)  
  const [ loading, setLoading ] = useState<boolean>(false)

  const { setPlayer, gameTime } = useContextValue()

  async function handleSubmit(e:FormEvent|undefined){
    setLoading(true)
    if (e) e.preventDefault()

    if (!newPlayer) {
      try {
        const response = await api.post('player/login', {
          name, password
        })
        Swal.fire({
          title: 'Successfully logged in',
          text: 'Redirecting...',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
        localStorage.setItem('IDLE_PLAYER', name)
        setPlayer(response.data)
        Router.push('/Home')
      } catch(err) {
        errorHandler(err)
        // setPassword("")
        // setLogin("")
      }

      setLoading(false)
    } else {
      const result = await Swal.fire({
        title: 'Create new account?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      })

      if (result.isConfirmed) {
        try {
          await api.post('player/new', {
            name, password
          })
          Swal.fire('New player registered!', '', 'success')
          localStorage.setItem('IDLE_PLAYER', name)
          Router.push('/Home')
        } catch(err){
          errorHandler(err)
        }
      }

      setLoading(false)
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
        <input placeholder="USERNAME" type="text" value={name} onChange={(e)=>setName(e.target.value)} maxLength={10}/>
        <div id={styles.divider}></div>
        <input placeholder="PASSWORD" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} maxLength={20}/>
        <input type="submit" hidden />
      </form>

      <button onClick={(e)=>handleSubmit(e)} className={styles.login_button}>Play</button>

      <Spinner size={20} className={styles.loading_icon} animating={loading}/>

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