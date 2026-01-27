import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;


// Chat API
app.post("/api/chat", async (req,res)=>{

  try{

    const userMsg = req.body.message;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
        },
        body:JSON.stringify({
          model:"gpt-4o-mini",
          messages:[
            {role:"system",content:"You are a helpful AI Study Coach."},
            {role:"user",content:userMsg}
          ],
          max_tokens:200
        })
      }
    );

    const data = await response.json();

    res.json({
      reply: data.choices[0].message.content
    });

  }
  catch(err){
    console.log(err);
    res.status(500).json({reply:"Server error"});
  }

});


app.listen(PORT,()=>{
  console.log("Server running at http://localhost:"+PORT);
});
