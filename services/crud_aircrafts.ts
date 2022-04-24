import api from './api'
import Swal from 'sweetalert2'

import { Aircraft } from '../types/Aircraft.types'

export async function handleNewAircraft(aircraft:Aircraft){
  try {
    await api.post('new/aircraft', aircraft)
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

export async function handleListAircraft(){
  try {
    const response = await api.get('list/aircraft')
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