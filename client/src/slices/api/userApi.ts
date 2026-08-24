import API from "./base";

export const getUsersRequest = async () => {
  const res = await API.get("/user/getUsers");
  return res.data;
};

export const getUserCarsRequest = async (userId: string) => {
  const res = await API.get(`/user/getusercars/${userId}`);
  return res.data;
}

export const delUserRequest = async (_id: string) => {
  const res = await API.delete(`/user/deluser/${_id}`)
  return res.data
}

export const getAuditLogsRequest = async () => {
  const res = await API.get("/user/getlogs");
  return res.data;
}

export const getServiceHistoryRequest = async () => {
  const res = await API.get("/user/getHistory")
  return res.data
}

export const getVehiclesRequest = async () => {
  const res = await API.get("/user/getVehicles")
  return res.data
}

export const deleteUserCarRequest = async (vid: string, userId: string) => {
  const res = await API.delete(`/user/deleteUserCar/${vid}/${userId}`)
  return res.data
}