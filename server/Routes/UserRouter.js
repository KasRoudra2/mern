import express from "express";
import { ServeUsers,
  ServeUser,
  SignUp,
  Login,
  DeleteUser,
} from '../RouteHandlers/UserRouteHandlers.js';
import Auth from "../Middlewares/Auth.js";

const UserRouter = express.Router();

UserRouter.get("/", Auth, ServeUsers);
UserRouter.get("/:email", Auth, ServeUser);
UserRouter.post("/login", Login);
UserRouter.post("/signup", SignUp);
UserRouter.delete("/:id", Auth, DeleteUser);


export default UserRouter;