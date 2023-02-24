import { FormEvent, useEffect, useState } from 'react'
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
  const [ buttonStatus, setButtonStatus ] = useState<"newplayer"|"offline"|"existing">("existing")  
  const [ loading, setLoading ] = useState<boolean>(false)

  const { setPlayer } = useContextValue()

  async function handleSubmit(e:FormEvent|undefined){
    setLoading(true)
    if (e) e.preventDefault()

    if (buttonStatus=="existing") {
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
        await setPlayer(response.data)
        localStorage.setItem('IDLE_ID', response.data.id)
        Router.push('/Home')
      } catch(err) {
        errorHandler(err)
        // setPassword("")
        // setLogin("")
      }

      setLoading(false)
    } else if (buttonStatus=="newplayer") {
      const result = await Swal.fire({
        title: 'Create new account?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
      })

      if (result.isConfirmed) {
        try {
          let response = await api.post('player/new', {
            name, password
          })

          let playerAux:any = response.data
          
          response = await api.post('aircraft/new', {
            player_id:response.data.id,
            level:1,
            money_per_second:10,
            bonus_multiplier:1,
          })

          Swal.fire('New player registered!', '', 'success')
          localStorage.setItem('IDLE_ID', playerAux.id)
          await setPlayer({
            ...playerAux,
            aircrafts:[
              response.data
            ]
          })
          Router.push('/Home')
        } catch(err){
          errorHandler(err)
        }
      }

      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  async function fetchConnection() {
    try {
      const response = await api.get('connection')
      if (response.data) return; 
    } catch (err) {}

    Swal.fire("Ops","Servers are offline at the moment, please come back later", "warning")
    setButtonStatus("offline")
  }

  useEffect(()=>{
    fetchConnection()
  },[])


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

      <button 
        onClick={(e)=>handleSubmit(e)}
        className={styles.login_button}
        id={buttonStatus!="offline"?styles.login_button_enabled:styles.login_button_disabled}
        disabled={buttonStatus=="offline"}>
          
      </button>

      <Spinner size={20} className={styles.loading_icon} animating={loading}/>

      <div
        id={styles.new_player} 
        onClick={()=>setButtonStatus(
          buttonStatus!="offline"?buttonStatus=="newplayer"?"existing":"newplayer":"offline"
        )} 
        style={
          buttonStatus!="offline"?
            buttonStatus=="newplayer"?
            {backgroundColor:'var(--light_redish)', color:'var(--light_redish'}
            :{}
          :{backgroundColor: 'gray', cursor:'not-allowed', color:'gray'}
        }>

        <h1>new player</h1>
        <div id={styles.new_player_selector} style={buttonStatus=="newplayer"?{left:'+26%', backgroundColor:'var(--redish)'}:{}}></div>
      </div>

    </div>
  )
}

export default Login