// services/vehicleService.ts
import API from "./base";

export const addCarRequest = async (vid: string) => {
  const res = await API.post(`/car/addcar/${vid}`);
  return res.data;
};

export const getCarsRequest = async () => {
  const res = await API.get("/car/getCars")
  return res.data
}

export const getVehicleByVidRequest = async (vid: string) => {
  const res = await API.get(`/car/getCarDetails/${vid}`)
  return res.data
}

export const delCarRequest = async (vid: string) => {
  const res = await API.delete(`/car/deleteCar/${vid}`)
  return res.data
}

export const updCarRequest = async (_id: string, data: any) => {
  const res = await API.put(`/car/updateCar/${_id}`, data)
  return res.data
}