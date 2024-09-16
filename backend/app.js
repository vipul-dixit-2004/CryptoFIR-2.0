const express = require("express");
const Web3 = require("web3");
require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const bodyParser = require("body-parser");
const FIR_Records = require("../frontend/src/FIR_Records.json");
const connectDB = require("./dbConnect");
const cors = require("cors");
const complainController = require("./Controllers/_complain");
const { fetchCount } = require("./contract");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
connectDB();
// Initialize Express app
const app = express();
app.use(bodyParser.json());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

// DB
app.post("/createComplain", complainController.createComplain);
app.get("/api/records", complainController.fetchAll);
app.get("/api/searchFIR", complainController.findByNameOrCode);
app.delete("/api/delete/:id", complainController.deleteComplain);

//BlockChain
app.get("/fetchComplain/:id", async (req, res) => {
  const recordId = req.params.id;
  try {
    const record = await contract.methods.fetchComplain(recordId).call();
    res.status(200).json(record);
  } catch (error) {
    res.status(500).send("Error fetching complaint: " + error.message);
  }
});

// Endpoint to get the total number of records
app.get("/recordCount", async (req, res) => {
  try {
    const count = await fetchCount();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).send("Error fetching record count: " + error.message);
  }
});

// login api
const JWT_KEY = process.env.JWT_KEY; // Ensure you have this in your .env file

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "Admin@admin.com" && password === "admin") {
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30; // Token expiration in 30 days
    const token = jwt.sign({ sub: email, exp }, JWT_KEY);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      expires: new Date(exp),
    });
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.get("/api/checkAuth", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
  jwt.verify(token, JWT_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Failed to authenticate token" });
    }
    res.json({ success: true, user: decoded });
  });
});

// Starting Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
