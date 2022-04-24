import api from './api'
import Swal from 'sweetalert2'


export async function handleNewPlayer(){
  const player = {
    name:"Matheus",
    password:"123123"
  }
  try {
    await api.post('new/player', player)
  } catch {
    Swal.fire('Something went wrong', 'Error at player creation, please report this bug on the github comments', 'error')
  }
}

export async function handleEditPlayer(){
  const player = {
    id:7,
    name:"Matheus",
    password:"123123",
    rank:1,
    aircrafts:"[1]",
    wallet:1000
  }
  try {
    await api.post('edit/player', player)
  } catch {
    Swal.fire('Something went wrong', 'Error at player creation, please report this bug on the github comments', 'error')
  }
}

export async function handleDeletePlayer(){
  try {
    await api.put('delete/player', {id:9})
  } catch {
    Swal.fire('Something went wrong', 'Error at player creation, please report this bug on the github comments', 'error')
  }
}

export async function handleListPlayer(){
  try {
    const response = await api.get('list/player')
    console.log(response.data)
  } catch {
    Swal.fire('Something went wrong', 'Error at player creation, please report this bug on the github comments', 'error')
  }
}

export async function handleGetPlayer(){
  try {
    const response = await api.put('get/player', {id:11})
    console.log(response.data)
  } catch {
    Swal.fire('Something went wrong', 'Error at player creation, please report this bug on the github comments', 'error')
  }
}