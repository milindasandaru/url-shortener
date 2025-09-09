const express = require("express");
const morgan = require("morgan");
const urlRoutes = require("./routes/urlRoutes");

const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true}));
app.use("/", urlRoutes);

module.exports = app;