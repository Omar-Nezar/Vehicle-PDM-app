import getUserType from "./getUserType";

export default function determineHome(type?: string) {
    const uType = type ?? getUserType()
    switch (uType) {
        case "car_owner": return "/carownerhome";
        case "admin": return "/adminhome";
        case "inventory_manager": return "/inventorymanagerhome";
        default: return "/"
    }
}