import paths from "../Constants/paths";

const ADMIN = "admin";
const CUSTOMER = "customer";
const OWNER = "owner";

export const moveUserTo = (role) => {
  console.log("Role received: ", role);
  switch (role) {
    case ADMIN:
      return paths.dashboard;
    case CUSTOMER:
      return paths.home;
    case OWNER:
      return paths.dashboard;
    default:
      return paths.home;
  }
};
