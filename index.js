const TelegramBot = require('node-telegram-bot-api');
const token = '';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;

    const tombolMenu = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '☪️ Islami', callback_data: 'islami' },
                    { text: '⬇️ Downloader', callback_data: 'download' },
                    { text: '🎓 Edukasi', callback_data: 'edukasi' },
                ],
                [
                    { text: '📸 Kreasi Gambar', callback_data: 'kreasigambar' },
                    { text: '🖼️ Random Gambar', callback_data: 'randomgambar' },
                ],
                [
                    { text: '📰 Berita', callback_data: 'berita' },
                    { text: '🎞️ Anime', callback_data: 'berita' },
                    { text: '🗿 Game', callback_data: 'game' },
                ],
            ],
            one_time_keyboard: true,
        },
    };

    bot.sendMessage(chatId, ` Hai ${msg.chat.first_name} ,Berikut command bot yang tersedia`, tombolMenu);
});


// Menghandle callback data dari tombol inline yang ditekan
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Merespons aksi ketika tombol ditekan
    let menu;
    switch (data) {
        case 'islami':
            
            bot.sendMessage(chatId, menu);
            break;
        case 'download':
            menu = `
            List command bot Downloader
            
            `
            bot.sendMessage(chatId, menu.trim(""));
            break;
        case 'mplayer':
            menu = `
            List command bot Islami
            ➡️ Asmaul Husna
            ➡️ Al - quran
            ➡️ Hadits
            ➡️ Jadwal Shalat
            ➡️ Kisah Nabi 
            ➡️
            `
            bot.sendMessage(chatId, 'Anda menekan Tombol 1');
            break;
        case '':
            menu = `
            List command bot Islami
            ➡️ Asmaul Husna
            ➡️ Al - quran
            ➡️ Hadits
            ➡️ Jadwal Shalat
            ➡️ Kisah Nabi 
            ➡️
            `
            bot.sendMessage(chatId, 'Anda menekan Tombol 1');
            break;
    }
});