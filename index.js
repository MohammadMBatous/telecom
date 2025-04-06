import { bot } from "./src/bot.js";

bot.launch().then(() => {
    console.log("Bot is up and running");
}).catch((err) => {
    console.error('there are some errors', err);
});




// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))