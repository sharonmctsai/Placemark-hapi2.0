import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { categoryController } from "./controllers/category-controller.js";
import { adminDashboardController } from "./controllers/admin-dashboard-controller.js";

export const webRoutes = [
  //accounts
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "GET", path: "/about", config: aboutController.index },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
  { method: "POST", path: "/updateuser/{id}", config: accountsController.updateUser },

  //admin
  { method: "GET", path: "/admin", config: adminDashboardController.index },
  { method: "GET", path: "/admin/deleteuser/{id}", config: adminDashboardController.deleteUser },
  { method: "GET", path: "/admin/showanalytics", config: adminDashboardController.showAnalytics },
  
  //categories
  { method: "GET", path: "/categories", config: categoryController.index },

  //dashboard
  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "GET", path: "/profile", config: dashboardController.showProfile },  
  { method: "GET", path: "/dashboard/uploadimage/{id}", config: dashboardController.showUploadImageForm },
  { method: "POST", path: "/dashboard/uploadimage/{id}", config: dashboardController.uploadImage },
  { method: "GET", path: "/dashboard/deleteimage/{id}", config: dashboardController.deleteImage },
  { method: "POST", path: "/dashboard/addplacemark", config: dashboardController.addPlacemark },
  { method: "GET", path: "/dashboard/deleteplacemark/{id}", config: dashboardController.deletePlacemark },
  { method: "GET", path: "/dashboard/updateplacemark/{id}", config: dashboardController.showUpdatePlacemarkForm },
  { method: "POST", path: "/dashboard/updateplacemark/{id}", config: dashboardController.updatePlacemark },

  { method: "GET", path: "/dashboard/addtofavorites/{id}", config: dashboardController.addToFavorites },
{ method: "GET", path: "/dashboard/favorites", config: dashboardController.showFavorites },
{ method: "GET", path: "/dashboard/share/{id}", config: dashboardController.sharePlacemark },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } }
];
