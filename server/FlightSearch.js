const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./dmbs");
const fetch = import('node-fetch');

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

// get all flights
app.get("/flights", async (req, res) => {
  try {
    const { origin, destination } = req.query;
    const response = await fetch(`http://localhost:5300/flights?origin=${origin}&destination=${destination}`);
    const flights = await response.json();
    res.json(flights);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5200, () => {
  console.log("server has started on port 5200");
});
