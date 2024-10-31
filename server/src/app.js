const express = require("express");
const app = express();
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Đặt đúng origin của client
    credentials: true,
    optionsSuccessStatus: 200, // Cho phép gửi cookies và các thông tin xác thực
  })
);
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../src/configs/swaggerOptions');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Database
require("./configs/configs.mysql");
// Routes

app.use("", require("./routers"));
// client check kết nối với server

// error handler
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500);
  console.log(error.message);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
