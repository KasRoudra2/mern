import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose  from "mongoose";
import PostRouter from './Routes/PostRouter.js';
import UserRouter from './Routes/UserRouter.js';

const app = express();

app.use(bodyParser.json({ limit: "1mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true}));

app.use(cors());

app.get("/", (req, res) => {
    res.send("Nothing here!");
});
app.get("/api", (req, res) => {
    res.send("Nothing here!");
});

app.use("/api/posts", PostRouter);
app.use("/api/users", UserRouter);

const url = process.env.MURL;
const port = process.env.PORT || 5000;

mongoose.connect(url, {  useNewUrlParser: true, useUnifiedTopology: true, })
   .then(()=> app.listen(port,()=> {
       console.log("Server running on port "+port)
   }))
   .catch((err)=> console.log(err))

