// const express = require("express");
// const app = express();
// const cors = require("cors");
// const fetch = import("node-fetch");
// const pool = require("./dmbs");
// const FlightSearch = require("./FlightSearch");

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes

// // Get all flights from database
// app.get("/flights", async (req, res) => {
//   try {
//     const allFlights = await pool.query("SELECT * FROM flights");
//     res.json(allFlights.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: "Error getting flights" });
//   }
// });

// // Get a specific flight by ID from database
// app.get("/flights/:flightId", async (req, res) => {
//   try {
//     const { flightId } = req.params;
//     const flight = await pool.query("SELECT * FROM flights WHERE flightid = $1", [
//       flightId,
//     ]);
//     res.json(flight.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: "Error getting flight" });
//   }
// });

// // Search for flights using FlightStats API
// app.get("/search-flights", async (req, res) => {
//   const { origin, destination } = req.query;

//   try {
//     const flights = await FlightSearch.searchFlights(origin, destination);
//     res.json(flights);
//   } catch (error) {
//     console.log("Error searching for flights:", error);
//     res.status(500).json({ message: "Error searching for flights" });
//   }
// });

// // Start the server
// app.listen(5300, () => {
//   console.log("Server started on port 5300");
// });





// Import required libraries
const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./dmbs");

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// User sign up
app.post("/signup", async (req, res) => {
    const { username, password, type } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await pool.query(
        "SELECT * FROM login WHERE username = $1",
        [username]
      );
  
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: "Username already taken" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Insert new user into login table
      const newUser = await pool.query(
        "INSERT INTO login (username, password, type) VALUES ($1, $2, $3) RETURNING id",
        [username, hashedPassword, type]
      );
  
        
  
      // Determine user type and insert into appropriate table
      const userId = newUser.rows[0].id;
  
      if (type === "customer") {
        const newCustomer = await pool.query(
          "INSERT INTO customer_new (cid) VALUES ($1)",
          [userId]
        );
      } else if (type === "employee") {
        const newEmployee = await pool.query(
          "INSERT INTO employee_new (sid) VALUES ($1)",
          [userId]
        );
      } else {
        return res.status(400).json({ message: "Invalid user type" });
      }
  
      res.json({ message: "User created successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Error creating user" });
    }
  });  


// Start the server
app.listen(5300, () => {
  console.log("Server started on port 5300");
});
