// services/vehicleService.ts
import API from "./base";

export const addCarRequest = async (vehicleData: any) => {
  const res = await API.post("/car/addcar", vehicleData);
  return res.data;
};

export const getCarsRequest = async () => {
  const res = await API.get("/car/getUserCars")
  return res.data
}

export const delCarRequest = async (_id: string) => {
  const res = await API.delete(`/car/deleteCar/${_id}`)
  return res.data
}

export const updCarRequest = async (_id: string, data: any) => {
  const res = await API.put(`/car/updateCar/${_id}`, data)
  return res.data
}