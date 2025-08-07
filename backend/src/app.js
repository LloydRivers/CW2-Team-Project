require("dotenv").config();
const express = require("express");
const healthRoutes = require("./routes/healthRoutes");
const driverRoutes = require("./routes/driverRoutes")

const port = process.env.PORT

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/health", healthRoutes)
app.use("/drivers", driverRoutes)

app.listen(port, () => {
    console.log(`server running on ${port}`)
})