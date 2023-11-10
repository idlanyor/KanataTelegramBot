const fs = require('fs')
const rawCfg = fs.readFileSync('config.json')
const cfg = JSON.parse(rawCfg);
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios')
const token = cfg.apiTele;
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
const apiHelperLol = async (endpoint, query) => {
    try {
        const response = await axios.get(`${cfg.urlLol}/${endpoint}apikey=${cfg.apiLol}`);
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
                    result = await apiHelperLol("asmaulhusna?");
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

                break;
            case '/js':
                // Meminta lokasi pengguna
                let cityName;
                if (args[1] === undefined) {
                    bot.sendMessage(chatId, 'Silakan kirimkan lokasi Anda,atau balas pesan dengan /js namakota(Contoh : /js purbalingga).', {
                        reply_markup: {
                            keyboard: [
                                [{
                                    text: 'Kirim Lokasi',
                                    request_location: true,
                                }],
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        },
                    });
                    bot.on('location', async (msg) => {
                        const latitude = msg.location.latitude;
                        const longitude = msg.location.longitude;
                        cityName = await getLokasi(latitude, longitude);
                        async function getLokasi(lat, long) {
                            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=${cfg.apiLok}&q=${lat}+${long}`);
                            const resultLok = response.data.results[0].components.county;
                            return resultLok;
                        }
                        result = await apiHelperLol(`sholat/${cityName}?`);
                        let replyText = 'Jadwal shalat ' + result.wilayah + '\n';
                        replyText += '  Tanggal: ' + result.tanggal + '\n';
                        replyText += '  Sahur: ' + result.sahur + '\n';
                        replyText += '  Imsak: ' + result.imsak + '\n';
                        replyText += '  Subuh: ' + result.subuh + '\n';
                        replyText += '  Terbit: ' + result.terbit + '\n';
                        replyText += '  Dhuha: ' + result.dhuha + '\n';
                        replyText += '  Dzuhur: ' + result.dzuhur + '\n';
                        replyText += '  Ashar: ' + result.ashar + '\n';
                        replyText += '  Maghrib: ' + result.maghrib + '\n';
                        replyText += '  Isya: ' + result.isya + '\n';

                        bot.sendMessage(chatId, replyText);
                    });

                } else {
                    cityName = args[1]
                }
                try {
                    result = await apiHelperLol(`sholat/${cityName}?`);
                    // console.log(result)
                    let replyText = 'Jadwal shalat ' + result.wilayah + '\n';
                    replyText += '  Tanggal: ' + result.tanggal + '\n';
                    replyText += '  Sahur: ' + result.sahur + '\n';
                    replyText += '  Imsak: ' + result.imsak + '\n';
                    replyText += '  Subuh: ' + result.subuh + '\n';
                    replyText += '  Terbit: ' + result.terbit + '\n';
                    replyText += '  Dhuha: ' + result.dhuha + '\n';
                    replyText += '  Dzuhur: ' + result.dzuhur + '\n';
                    replyText += '  Ashar: ' + result.ashar + '\n';
                    replyText += '  Maghrib: ' + result.maghrib + '\n';
                    replyText += '  Isya: ' + result.isya + '\n';

                    // console.log(replyText);

                    bot.sendMessage(chatId, replyText);
                } catch (error) {
                    bot.sendMessage(chatId, 'Terjadi kesalahan dalam mengurai permintaan, Silahkan coba beberapa saat lagi');
                }
                break
            case '/tt':
                if (args[1] === undefined) {
                    bot.sendMessage(chatId, 'Tiktok downloader no watermark \n Masukkan url tiktok (Contoh: /tt https://vt.tiktok.com/ZSwWCk5o/)')
                } else {
                    try {
                        result = await apiHelperLol(`tiktok?url=${args[1]}&`);
                        // result = await apiHelperLol(`tiktok?url=https://vt.tiktok.com/ZSwWCk5o/&`);
                        console.log(result.thumbnail)
                        replyText = `KANATA TIKTOK DOWNLOADER\n`
                        replyText = `Title : ${result.title}\n`
                        replyText += `Upload by : ${result.author.nickname}\n`
                        replyText += `bentar yaa,video lagi dikirim`
                        // console.log(result)
                        bot.sendPhoto(chatId, result.thumbnail, { caption: replyText });
                        await bot.sendVideo(chatId, result.link)
                    } catch (error) {
                        bot.sendMessage(chatId, 'Terjadi kesalahan dalam mengurai permintaan, Silahkan coba beberapa saat lagi');
                    }
                }
                break
            case '/tta':
                if (args[1] === undefined) {
                    bot.sendMessage(chatId, 'Tiktok audio downloader \n Masukkan url tiktok (Contoh: /tta https://vt.tiktok.com/ZSwWCk5o/)')
                } else {
                    try {
                        result = await apiHelperLol(`tiktokmusic?url=${args[1]}&`);
                        bot.sendMessage(chatId, "_Bentar yaa..Audio lagi dikirim_", { parse_mode: 'Markdown' });
                        await bot.sendAudio(chatId, result)
                    } catch (error) {
                        bot.sendMessage(chatId, 'Terjadi kesalahan dalam mengurai permintaan, Silahkan coba beberapa saat lagi');
                    }
                }
                break
            case '/ig':
                if (args[1] === undefined) {
                    bot.sendMessage(chatId, 'Instagram Video downloader \n Masukkan url instagram')
                } else {
                    try {
                        result = await apiHelperLol(`instagram?url=${args[1]}&`);
                        // console.log(result[0]);
                        bot.sendMessage(chatId, "_Bentar yaa..Video lagi dikirim_", { parse_mode: 'Markdown' });
                        await bot.sendVideo(chatId, result[0])
                    } catch (error) {
                        bot.sendMessage(chatId, 'Terjadi kesalahan dalam mengurai permintaan, Silahkan coba beberapa saat lagi');
                    }
                }
                break
            case '/play':
                if (args[1] === undefined) {
                    bot.sendMessage(chatId, 'Youtube Player \n (Ex : /play usik feby putri)')
                } else {
                    try {
                        result = await apiHelperLol(`ytplay?query=${args[1] + args[2]}&`);
                        console.log(result.audio.link)
                        replyText = `KANATA YOUTUBE PLAYER\n`
                        replyText = `Title : ${result.title}\n`
                        replyText += `Upload by : ${result.uploader}\n\n`
                        replyText += `bentar yaa,audio lagi dikirim`
                        bot.sendPhoto(chatId, result.thumbnail, { caption: replyText });
                        // await bot.sendMessage(chatId, result.audio.link)
                        convertWebMtoMP3(result.audio.link, chatId,result.title);
                        function convertWebMtoMP3(inputFilePath, chatId,capt) {
                            const outputFilePath = './libs/';  // Ganti dengan path untuk menyimpan file hasil konversi MP3

                            ffmpeg()
                                .input(inputFilePath)
                                .audioCodec('libmp3lame')
                                .toFormat('mp3')
                                .on('end', () => {
                                    bot.sendAudio(chatId, outputFilePath, { caption: capt });
                                })
                                .on('error', (err) => {
                                    console.error('Error:', err);
                                })
                                .save(outputFilePath);
                        }
                    } catch (error) {
                        bot.sendMessage(chatId, 'Terjadi kesalahan dalam mengurai permintaan, Silahkan coba beberapa saat lagi');
                    }
                }
                break
            default:
                bot.sendMessage(chatId, `Perintah ${msg.text} tidak ditemukan,ketik /help untuk bantuan`);
                break;
        }
    }


})