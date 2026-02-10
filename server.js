const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("."));

// 提交手机号 API
app.post("/api/submit", (req, res) => {
  const phone = req.body.phone;

  if (!/^1\d{10}$/.test(phone)) {
    return res.json({ message: "手机号格式错误" });
  }

  const record = {
    phone,
    time: new Date().toISOString(),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    ua: req.headers["user-agent"]
  };

  fs.appendFileSync("data.jsonl", JSON.stringify(record) + "\n");

  res.json({ message: "提交成功，我们将尽快回访" });
});

// 后台数据接口
app.get("/admin/data", (req, res) => {
  if (!fs.existsSync("data.jsonl")) return res.json([]);

  const lines = fs.readFileSync("data.jsonl", "utf8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(JSON.parse);

  res.json(lines);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});