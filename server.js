const express = require("express");
const app = express();

app.use(express.json());

let codes = {};

// SAVE CODE
app.post("/save", (req,res)=>{
  const code = req.body.code;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  codes[code] = {
    used: false,
    ip: ip,
    time: Date.now()
  };

  res.send("saved");
});

// VERIFY CODE
app.post("/verify", (req,res)=>{
  const {code} = req.body;

  if(!codes[code]){
    return res.send("invalid");
  }

  if(codes[code].used){
    return res.send("used");
  }

  // expire after 5 min
  if(Date.now() - codes[code].time > 300000){
    return res.send("expired");
  }

  codes[code].used = true;

  res.send("valid");
});

app.listen(3000, ()=>{
  console.log("Server running");
});
