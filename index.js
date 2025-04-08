import { bot } from "./src/bot.js";
import express from 'express';
const app = express();

app.get('/health', (req, res) => {
    res.status(200).send('Bot is healthy');
});

bot.launch().then(() => {
    console.log("Bot is up and running");
}).catch((err) => {
    console.error('there are some errors', err);
});





// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))