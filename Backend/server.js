// index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;


// -------------------- Middleware --------------------
app.use(express.json());
app.use(cors()); // Allow all origins for now, or specify frontend URL


// ... (Your other endpoints)

const upgradeFeature= require("./routes/upgrade.route");
const notesApi = require("./routes/notes.route");
const userInformation = require("./routes/user.route");

app.use("/auth", userInformation); // Error is likely here
app.use('/api', notesApi);
app.use('/api', upgradeFeature);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});