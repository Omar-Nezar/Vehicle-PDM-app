const getUserBadge = (type: string) => {
  switch (type) {
    case "admin":
      return {
        label: "Admin",
        className: "bg-destructive/10 text-destructive",
      };

    case "inventory_manager":
      return {
        label: "Inventory Manager",
        className: "bg-primary/10 text-primary",
      };

    case "car_owner":
      return {
        label: "Car Owner",
        className: "bg-secondary text-secondary-foreground",
      };

    default:
      return {
        label: type,
        className: "bg-muted text-muted-foreground",
      };
  }
};
export default getUserBadge