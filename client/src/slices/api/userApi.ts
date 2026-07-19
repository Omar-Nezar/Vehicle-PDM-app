import API from "./base";

export const getUsersRequest = async () => {
  const res = await API.post("/user/getUsers");
  return res.data;
};