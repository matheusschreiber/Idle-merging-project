import api from './api'
import Swal from 'sweetalert2'

import { Player } from '../types/Player.types'

export async function handleNewPlayer(name:String, password:String){
  try {
    await api.post('new/player', {name,password})
  } catch {
    Swal.fire('Something went wrong', 'Error at player creation, please report this bug on the github comments', 'error')
  }
}

export async function handleEditPlayer(player:Player){
  try {
    await api.post('edit/player', player)
  } catch {
    Swal.fire('Something went wrong', 'Error at player edit, please report this bug on the github comments', 'error')
  }
}

export async function handleDeletePlayer(id:Number){
  try {
    await api.put('delete/player', {id:id})
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

type handleGetPlayer = (id:Number) => Promise<Player>
export const handleGetPlayer:handleGetPlayer = async (id) => {
  try {
    const response = await api.put('get/player', {id:id})
    return response.data
  } catch {
    Swal.fire('Something went wrong', 'Error at player search, please report this bug on the github comments', 'error')
  }
}