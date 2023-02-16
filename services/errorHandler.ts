import Swal from "sweetalert2";

export async function errorHandler(err: any) {
  const message = err.response.data.error;
  if (message) await Swal.fire("Something went wrong", message, "warning");
  else await Swal.fire("Ops", "Servers are down", "error");
}