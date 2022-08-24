import api from './api'
import Swal from 'sweetalert2'

import crypto from 'crypto'

import { Player } from '../types/Player.types'

import { Aircraft } from '../types/Aircraft.types'

import {
  handleListAircraft,
  handleDeleteAircraft
} from './aircraft'

export async function handleNewPlayer(name:String, password:String){
  try {
    const player = await api.post('new/player', {name,password})
    const aircraft = await api.post('new/aircraft', {
      player_id: player.data.id,
      level: 1,
      money_per_second: 10,
      bonus_multiplier: 1,
    })
    return player
  } catch(err) {
    Swal.fire('Something went wrong', 'Error at player creation, please report this bug on the github comments', 'error')
    return 0
  }
}

export async function handleEditPlayer(player:Player){
  try {
    await api.post('edit/player', player)
  } catch {
    Swal.fire('Something went wrong', 'Error at player edit, please report this bug on the github comments', 'error')
  }
}

export async function handleDeletePlayer(id:number){
  try {
    const aircrafts:Aircraft[] = await handleListAircraft(id)
    
    await Promise.all(aircrafts.map(async(a)=>{
      await handleDeleteAircraft(a.id)
    }))

    await api.post('delete/player', {id:id})
  } catch {
    Swal.fire('Something went wrong', 'Error at player deletion, please report this bug on the github comments', 'error')
  }
}

type handleListPlayer = () => Promise<Player[]>
export const handleListPlayer:handleListPlayer = async () => {
  try {
    const response = await api.get('list/player')
    return response.data
  } catch {
    Swal.fire('Something went wrong', 'Error at player list, please report this bug on the github comments', 'error')
  }
}

type playerNameOrId = {
  id: number | undefined,
  name: string | undefined
}
type handleGetPlayer = (obj:playerNameOrId) => Promise<Player>
export const handleGetPlayer:handleGetPlayer = async (obj:playerNameOrId) => {
  try {
    let response;
    if (obj.id) response = await api.post('get/player', {id:obj.id})
    else if (obj.name) response = await api.post('get/player', {name:obj.name})

    return response?.data;
  } catch (err) {
    Swal.fire('Something went wrong', 'Error at player search (probably cors block), please report this bug on the github comments', 'error')
    console.log(err)
  }
}

export const handleLoginPlayer = async (name:string, pass:string) => {
  try {
    const response = await api.post('get/player', {name:name})
    const hash = crypto.createHash('sha256');
    hash.update(pass)  
    if(hash.digest("hex")==response.data.password) return response.data
    else return 0
  } catch (err) {
    Swal.fire('Something went wrong', 'Error at player login, please report this bug on the github comments', 'error')
  }

}