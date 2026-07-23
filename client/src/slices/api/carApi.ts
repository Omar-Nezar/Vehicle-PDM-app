// services/vehicleService.ts
import API from "./base";

export const addCarRequest = async (vehicleData: any) => {
  const res = await API.post("/car/addcar", vehicleData);
  return res.data;
};