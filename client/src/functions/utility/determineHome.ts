import decodeToken from "./decodeToken";

export default function determineHome(type?: string) {
    const uType = type ?? decodeToken()?.type
    switch (uType) {
        case "car_owner": return "/carownerhome";
        case "admin": return "/adminhome";
        case "inventory_manager": return "/inventorymanagerhome";
        default: return "/"
    }
}