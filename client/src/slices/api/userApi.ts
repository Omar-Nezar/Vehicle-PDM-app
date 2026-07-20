import API from "./base";

export const getUsersRequest = async () => {
  const res = await API.get("/user/getUsers");
  return res.data;
};

export const delUserRequest = async (_id: string) => {
  const res = await API.delete(`/user/deleteuser/${_id}`)
  return res.data
}