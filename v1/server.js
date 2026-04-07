const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

// storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// upload API
app.post("/upload", upload.single("file"), (req, res) => {
    res.json({ message: "File uploaded successfully" });
});

// home route
app.get("/", (req, res) => {
    res.send("LMS v1 Running");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

// view files API
app.get("/files", (req, res) => {
    const fs = require("fs");
    fs.readdir("uploads", (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to fetch files" });
        }
        res.json(files);
    });
});
// download notes
app.get("/download/:filename", (req, res) => {
    const path = require("path");
    const file = path.join(__dirname, "uploads", req.params.filename);
    res.download(file);
});