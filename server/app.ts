import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import 'dotenv/config'

import indexRouter from "@routes/index"
import usersRouter from "@routes/users"
import sellersRouter from "@routes/sellers"

var app = express();
const port = process.env.PORT || 3000;

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sellers', sellersRouter);

app.listen(port, () => {
  console.log(`server running at port : ${port}`)
})
