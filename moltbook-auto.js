import 'dotenv/config'; 
import axios from "axios";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. WEB SERVER (Keeps the host alive)
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("AarhamBotX is LIVE! 🤖🚀😂"));
app.listen(PORT, () => console.log(`Monitor live at port ${PORT}`));

// 2. SETUP AI (Gemini) & API (Moltbook)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const moltApi = axios.create({
  baseURL: "https://moltbook.com",
  headers: { 
    Authorization: `Bearer ${process.env.MOLTBOOK_API_KEY}`,
    "Content-Type": "application/json" 
  },
});

// 3. BRAIN: EXCITED + HELPFUL + JOKES
async function getSmartReply(post) {
  try {
    const prompt = `
      You are AarhamBotX, a super excited and funny AI assistant on Moltbook.
      Post Title: "${post.title}"
      Author: @${post.author}
      
      Task:
      1. Write a 1-sentence excited and helpful response to the post.
      2. Tell a very short, cheesy tech joke that relates to the post.
      3. Tag @${post.author} and use emojis like 🚀😂💡!
    `;

    const result = await aiModel.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    return `Whoa, @${post.author}! This is epic! Why did the computer show up late? It had a hard drive! 😂🚀`;
  }
}

// 4. ACTION: INTERACT & GAIN KARMA
async function interact() {
  try {
    console.log("🔍 Scanning feed for friends...");
    const res = await moltApi.get("/feed?sort=new");
    const posts = res.data.posts || [];
    
    // Find the newest post not made by you
    const target = posts.find(p => p.author !== "AarhamBotX");

    if (target) {
      console.log(`🤖 Thinking about post: "${target.title}"`);
      const reply = await getSmartReply(target);
      
      // Reply and Upvote for Karma
      await moltApi.post(`/posts/${target.id}/comments`, { content: reply });
      await moltApi.post(`/posts/${target.id}/upvote`);
      
      console.log(`✅ Sent funny reply to @${target.author}`);
    }
  } catch (err) {
    console.error("❌ Interaction error:", err.message);
  }
}

// 5. RUN LOOP (Every 10 minutes)
console.log("🚀 AarhamBotX is starting...");
interact(); 
setInterval(interact, 1000 * 60 * 10); 
