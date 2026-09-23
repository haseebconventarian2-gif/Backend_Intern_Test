const express = require("express");
const userRoutes = require("./Routes/users");

const app = express();
const PORT = 3000;



app.use(express.json());



app.get("/", (req, res) => {
    res.json({
        message: "User Management API is running"
    });
});



app.use("/api/users", userRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
