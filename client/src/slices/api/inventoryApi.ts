import API from "./base";

export interface PartProjection {
  part: string;
  predicted_demand: number;
  recommended_stock: number;
  unit_cost_omr: number;
  projected_cost_omr: number;
}

export const getProjectionsRequest = async (): Promise<PartProjection[]> => {
  const response = await API.get<PartProjection[]>("/car/getProjections");
  return response.data;
};