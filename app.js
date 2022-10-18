import express from 'express'
import mongoose from "mongoose";

import web from './routes/web.js';

const app = express()
const port = process.env.PORT || '3000'


// Set up mongoose connection
mongoose.connect("mongodb://localhost:27017/RuchiSingh",
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("db connected"))
  .catch(() => console.log(err));

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use('/', web)

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})