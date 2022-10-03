require('dotenv').config()
const TelegramApi = require('node-telegram-bot-api');
const fetch = require('cross-fetch');

const bot = new TelegramApi(process.env.TOKEN, {polling: true});
const webAppUrl = 'https://reibike.vercel.app/';

async function sendMessage(chatId, text, user) {
    try {
        if (String(text).includes('/start')) {
            return bot.sendMessage(chatId, `🖐 Вітаємо! Опишіть проблему у повідомленні`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Наш сайт', web_app: {url: webAppUrl}}]
                    ]
                }
            })
        }

        if (String(text).length < 15) {
            return bot.sendMessage(chatId, `❌ Довжина повідомлення не менше ніж 15 символів`)
        }

        if (String(text).length > 500) {
            return bot.sendMessage(chatId, `❌ Довжина повідомлення не більше ніж 500 символів`)
        }

        const res = await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage?chat_id=${process.env.GROUP_ID}&text=@${user} ${String(text).trim()}`);
    
        if (res.status >= 400) {
            return bot.sendMessage(chatId, `❌ Ваше повідомлення «${String(text).trim()}» НЕ було надіслано, спробуйте знову`)
        }

        return bot.sendMessage(chatId, `✅ Ваше повідомлення «${String(text).trim()}» було надіслано, ми розглянемо його та зв'яжемося з вами, якщо це потрібно`)
    } catch (err) {
        return bot.sendMessage(chatId, `❗Помилка ❯ ${err}`)
    }
}

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const user = msg.chat.username;

    sendMessage(chatId, text, user)
})