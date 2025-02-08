const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Create a base folder to store session data
const baseDataFolder = path.join(__dirname, "questionnaire_sessions");
if (!fs.existsSync(baseDataFolder)) {
  fs.mkdirSync(baseDataFolder);
}

app.use(express.json());
app.use(express.static("public")); // Serve static files from the "public" folder

// Endpoint to save data
app.post("/save-data", (req, res) => {
  const { sessionId, data } = req.body;
  const sessionFolder = path.join(baseDataFolder, `session_${sessionId}`);

  // Create a new folder for the session if it doesn't exist
  if (!fs.existsSync(sessionFolder)) {
    fs.mkdirSync(sessionFolder);
  }

  const fileName = `question_${data.question.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
  const filePath = path.join(sessionFolder, fileName);

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ message: "Failed to save data" });
    }
    res.json({ message: "Data saved successfully", file: fileName });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});