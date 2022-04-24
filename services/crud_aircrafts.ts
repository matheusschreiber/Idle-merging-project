import api from './api'
import Swal from 'sweetalert2'


export async function handleNewAircraft(){
  const aircraft = {
    level:1,
    player_id: 11,
    money_per_second:10,
    bonus_multiplier:1,
  }
  try {
    await api.post('new/aircraft', aircraft)
  } catch {
    Swal.fire('Something went wrong', 'Error at aircraft creation, please report this bug on the github comments', 'error')
  }
}

export async function handleEditAircraft(){
  const aircraft = {
    id:10,
    level:2,
    money_per_second:15,
    bonus_multiplier:5,
    owner:"Matheus"
  }
  try {
    await api.post('edit/aircraft', aircraft)
  } catch {
    Swal.fire('Something went wrong', 'Error at aircraft creation, please report this bug on the github comments', 'error')
  }
}

export async function handleDeleteAircraft(){
  try {
    await api.put('delete/aircraft', {id:11})
  } catch {
    Swal.fire('Something went wrong', 'Error at aircraft creation, please report this bug on the github comments', 'error')
  }
}

export async function handleListAircraft(){
  try {
    const response = await api.get('list/aircraft')
    console.log(response.data)
  } catch {
    Swal.fire('Something went wrong', 'Error at aircraft creation, please report this bug on the github comments', 'error')
  }
}