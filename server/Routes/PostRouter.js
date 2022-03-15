import express from "express";
import { ServePosts, 
  ServePost, 
  CreatePost, 
  UpdatePost, 
  LikeHandler,
  DeletePost,
} from "../RouteHandlers/PostRouteHandlers.js";
import Auth from "../Middlewares/Auth.js";

const PostRouter = express.Router();

PostRouter.get("/", ServePosts);
PostRouter.get("/:ut", ServePost);
PostRouter.post("/", Auth, CreatePost);
PostRouter.patch("/:id", Auth, UpdatePost);
PostRouter.patch("/:id/like", Auth, LikeHandler);
PostRouter.delete("/:id",Auth, DeletePost);

export default PostRouter;