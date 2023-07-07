import Swal from "sweetalert2";

export async function errorHandler(err: any) {
  try {
    const message = err.response.data.error;
    if (message) await Swal.fire("Something went wrong", message, "warning");
    else await Swal.fire("Ops", "Possibly, servers are down </br>" + message, "error");
  } catch(err2){
    await Swal.fire("Ops", "Unexpected error " + err, "error");
  }
}