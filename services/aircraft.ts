import api from './api'
import Swal from 'sweetalert2'

import { Aircraft } from '../types/Aircraft.types'

type newAircraft = {
  player_id:number,
  level: number,
  money_per_second: number,
  bonus_multiplier: number,
}
export async function handleNewAircraft(aircraft:newAircraft){
  try {
    const response = await api.post('new/aircraft', aircraft)
    return response.data
  } catch {
    Swal.fire('Something went wrong', 'Error at aircraft creation, please report this bug on the github comments', 'error')
  }
}

export async function handleEditAircraft(aircraft:Aircraft){
  try {
    await api.post('edit/aircraft', aircraft)
  } catch {
    Swal.fire('Something went wrong', 'Error at aircraft edit, please report this bug on the github comments', 'error')
  }
}

export async function handleDeleteAircraft(id:Number){
  try {
    await api.put('delete/aircraft', {id:id})
  } catch {
    Swal.fire('Something went wrong', 'Error at aircraft deletion, please report this bug on the github comments', 'error')
  }
}

export async function handleListAircraft(player_id:number){
  try {
    const response = await api.put('list/aircraft', {player_id})
    return response.data
  } catch {
    Swal.fire('Something went wrong', 'Error at aircraft list, please report this bug on the github comments', 'error')
  }
}

export async function handleGetAircraft(id:Number){
  try {
    const response = await api.put('get/aircraft', {id:id})
    return response.data
  } catch {
    Swal.fire('Something went wrong', 'Error at aircraft search, please report this bug on the github comments', 'error')
  }
}

export async function handleUpgradeAircraft(aircraft1:Aircraft, aircraft2:Aircraft){
  try{
    if (aircraft1.level!==aircraft2.level || aircraft1.player_id !== aircraft2.player_id) return
    aircraft2.level++
    aircraft2.money_per_second+= (aircraft2.level**2)/5
    await handleEditAircraft(aircraft2)
    await handleDeleteAircraft(aircraft1.id)

  } catch(err) {
    Swal.fire('Something went wrong', 'Error at aircraft upgrade, please report this bug on the github comments ' + err, 'error')
  }
}

