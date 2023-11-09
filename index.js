const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios')
const token = 'y:oratidokan';
const { menu } = require('./libs/menu.js')

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
                    { text: '🎬 Entertainment', callback_data: 'entertainment' },
                    { text: '🖼️ Kreasi Gambar', callback_data: 'gambar' },
                ],
                [
                    { text: '📰 random', callback_data: 'random' },
                    { text: '🎞️ Anime', callback_data: 'anime' },
                    { text: '🗿 Game', callback_data: 'game' },
                ],
            ],
            one_time_keyboard: true,
        },
    };

    bot.sendMessage(chatId, ` Hai ${msg.from.first_name} ,Berikut command bot yang tersedia`, tombolMenu);
});


// Menghandle callback data dari tombol inline yang ditekan
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    // Merespons aksi ketika tombol ditekan
    let listMenu;
    switch (data) {
        case 'islami':
            listMenu = menu.islami.join("\n");
            bot.sendMessage(chatId, `List Command Bot Islami:\n${listMenu}`);
            break;
        case 'download':
            listMenu = menu.downloader.join("\n");
            bot.sendMessage(chatId, `List Command Bot Downloader :\n${listMenu}`);
            break;
        case 'edukasi':
            listMenu = menu.edukasi.join("\n");
            bot.sendMessage(chatId, `List Command Bot Edukasi:\n${listMenu}`);
            break;
        case 'entertainment':
            listMenu = menu.entertainment.join("\n");
            bot.sendMessage(chatId, `List Command Bot Entertainment:\n${listMenu}`);
            break;
        case 'gambar':
            listMenu = menu.gambar.join("\n");
            bot.sendMessage(chatId, `List Command Bot Kreasi Gambar:\n${listMenu}`);
            break;
        case 'random':
            listMenu = menu.random.join("\n");
            bot.sendMessage(chatId, `List Command Bot Random generator:\n${listMenu}`);
            break;
        case 'anime':
            listMenu = menu.anime.join("\n");
            bot.sendMessage(chatId, `List Command Bot Anime:\n${listMenu}`);
            break;
        case 'game':
            listMenu = menu.game.join("\n");
            bot.sendMessage(chatId, `List Command Bot Game:\n${listMenu}`);
            break;

    }
});
// helper axios
const apiHelper = async (url) => {
    try {
        const response = await axios.get(url);
        console.log(response.data)
        return response.data.result;
    } catch (e) {
        console.error('Error: ', e);
        throw e;
    }
}
bot.on('message', async (msg) => {
    if (msg.text && msg.text.trim() !== '') {

        const chatId = msg.chat.id
        const perintah = msg.text.split(" ")[0].toLowerCase();
        const args = msg.text.split(" ");
        console.log(perintah)
        // penampung
        let result, replyText;

        switch (perintah) {
            // islami 
            case '/help':
                break
            case '/99':
                try {
                    result = await apiHelper("https://api.lolhuman.xyz/api/asmaulhusna?apikey=oratidokan");
                    replyText = `Indeks: ${result.index}\nLatin: ${result.latin}\nArab: ${result.ar}\nID: ${result.id}\nEN: ${result.en}`;
                    bot.sendMessage(chatId, replyText);
                } catch (error) {
                    bot.sendMessage(chatId, 'Terjadi kesalahan dalam mengurai permintaan, Silahkan coba beberapa saat lagi');
                }
                break;
            case '/quran':
                console.log(args[1])
                if (args[1] === undefined) {
                    console.log(args)
                    let optQuran = "List menu Al - qur'an\n"
                    optQuran += "/ayat Get ayat from surah\n"
                    optQuran += "/audioayat Get audio ayat from surah (Misyari Rasyid)\n"
                    optQuran += "/audiosurah Get audio surah from Al Quran (Misyari Rasyid)\n"
                    optQuran += "/listsurah Show all surah in Al Quran\n"
                    optQuran += "/surah Get surah from Al Quran"
                    bot.sendMessage(chatId, optQuran);
                    return;
                }
                try {
                    const apiUrl = '';
                    result = await performAxiosRequest(apiUrl);
                    bot.sendMessage(chatId, replyText);
                } catch (error) {
                    bot.sendMessage(chatId, 'Terjadi kesalahan dalam mengurai permintaan, Silahkan coba beberapa saat lagi');
                }
                break;
            case '/js':
                // Meminta lokasi pengguna
                bot.sendMessage(chatId, 'Silakan kirimkan lokasi Anda.', {
                    reply_markup: {
                        keyboard: [
                            [{
                                text: 'Kirim Lokasi',
                                request_location: true,
                            }],
                        ],
                        resize_keyboard: true,
                    },
                });
                bot.on('location', async (msg) => {
                    const chatId = msg.chat.id;
                    const latitude = msg.location.latitude;
                    const longitude = msg.location.longitude;

                    // Menggunakan API pihak ketiga untuk mendapatkan nama kota berdasarkan koordinat
                    try {
                        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key="oratidokan"&q=${latitude}+${longitude}`);
                        console.log(response.data.results[0].components.county)
                        const cityName = response.data.results[0].components.county;

                        // Menampilkan nama kota
                        // bot.sendMessage(chatId, `Anda berada di kota ${cityName}. \n Lat : ${latitude} \nLong : ${longitude}`);
                        try {
                            const apiUrl = `https://api.lolhuman.xyz/api/sholat/${cityName}?apikey=oratidokan`;
                            result = await apiHelper(apiUrl);
                            console.log(result)
                            let replyText = 'Jadwal shalat ' + result.result.wilayah + '\n';
                            replyText += '  Tanggal: ' + result.result.tanggal + '\n';
                            replyText += '  Sahur: ' + result.result.sahur + '\n';
                            replyText += '  Imsak: ' + result.result.imsak + '\n';
                            replyText += '  Subuh: ' + result.result.subuh + '\n';
                            replyText += '  Terbit: ' + result.result.terbit + '\n';
                            replyText += '  Dhuha: ' + result.result.dhuha + '\n';
                            replyText += '  Dzuhur: ' + result.result.dzuhur + '\n';
                            replyText += '  Ashar: ' + result.result.ashar + '\n';
                            replyText += '  Maghrib: ' + result.result.maghrib + '\n';
                            replyText += '  Isya: ' + result.result.isya + '\n';

                            console.log(replyText);

                            bot.sendMessage(chatId, replyText);
                        } catch (error) {
                            bot.sendMessage(chatId, 'Terjadi kesalahan dalam mengurai permintaan, Silahkan coba beberapa saat lagi');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        bot.sendMessage(chatId, 'Terjadi kesalahan saat mengambil informasi lokasi.');
                    }
                });

                break
            default:
                bot.sendMessage(chatId, `Perintah ${msg.text} tidak ditemukan,ketik /help untuk bantuan`);
                break;
        }
    }


})