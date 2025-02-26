const TelegramApi = require('node-telegram-bot-api');
const express = require('express');

const token = '8143728544:AAGweyqBG-2HScPWL5G31BomsnQtUPBDOCA';

const bot = new TelegramApi(token, { polling: true });

let msgnum = 0;
let msgnum2 = 0;
let msgarr = [];

bot.on('message', async (msg) => {
    console.log(msg);
    const text = msg.text;
    const chatId = msg.chat.id;

    msgarr.push(msg);

    if (msgarr.length > 21) {
        for (const msgelement of msgarr) {
            let index = msgarr.indexOf(msgelement);
            if (msgelement.from.id === msgarr[index + 1].from.id) {
                msgnum++;
                // if (msgelement.text === msgarr[index + 1].text || msgelement.thumb.file_id === msgarr[index + 2].thumb.file_id){
                //     msgnum2++;
                // }else{
                //     msgnum2 = 0;
                // }
            } else {
                msgnum = 0;
                msgarr = [];
                break;
            }
            if (msgnum >= 20) {
                    await bot.restrictChatMember(chatId, msgelement.from.id, {
                        permissions: {
                            can_send_messages: false,
                            can_send_media_messages: false,
                            can_send_polls: false,
                            can_send_other_messages: false,
                            can_add_web_page_previews: false,
                            can_change_info: false,
                            can_invite_users: false,
                            can_pin_messages: false
                        },
                        until_date: Math.floor(Date.now() / 1000) + 3600
                    });

                    bot.sendMessage(chatId, `Пользователь @${msgelement.from.first_name} зам'ючений на 1 годину.`);
            }

        }
    }
//console.log(msgnum);
//console.log(msgarr);
});
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Бот працює'));
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
