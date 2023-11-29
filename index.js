import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import routes from "./routes/noteRoutes.js";

mongoose.connect('mongob://127.0.0.1:27017/notes')
console.log('PRG6')
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

//conect router notes
app.use("/notes", notesRouter);

app.get("/", (req, res)=>{
  res.send("Hello World")
});

app.listen(process.env.EXPRESS_PORT,()=>{
  console.log(`Webserver started at port ${process.env.EXPRESS_PORT}`);
});