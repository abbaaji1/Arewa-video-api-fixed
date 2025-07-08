const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/download", async (req, res) => {
  const { url } = req.body;
  try {
    if (!ytdl.validateURL(url)) {
      return res.json({ success: false, message: "Invalid YouTube link." });
    }
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "highest" });

    return res.json({
      success: true,
      links: [{ url: format.url, quality: format.qualityLabel || "HD" }]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

app.get("/", (req, res) => {
  res.send("Arewa Video Downloader API is live!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));