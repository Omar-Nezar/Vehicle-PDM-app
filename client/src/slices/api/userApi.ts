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