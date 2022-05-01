const rp = require('request-promise');
require('dotenv').config();

const TELEGRAM_URI = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
const FORBIDDEN_WORD = process.env.FORBIDDEN_KEY_WORD;

async function sendToUser(chat_id, text) {
  const options = {
    method: 'GET',
    uri: `${TELEGRAM_URI}/sendMessage`,
    qs: {
      chat_id,
      text
    }
  };

  return rp(options);
}

async function deleteMessage(chat_id, message_id) {
  const options = {
    method: 'GET',
    uri: `${TELEGRAM_URI}/deleteMessage`,
    qs: {
      chat_id,
      message_id
    }
  };

  return rp(options);
}

module.exports.shoppingbot = async event => {
  const body = JSON.parse(event.body);
  const { chat, text, message_id } = body.message;

  if (text) {
    let message = '';
    try {
      if (text.toLowerCase().indexOf(FORBIDDEN_WORD) >= 0) {
        await deleteMessage(chat.id, message_id);
        message = `Your message id:${message_id} was rejected by the bot.`;
        await sendToUser(chat.id, message);
      } else {
        message = `Your message id:${message_id} was ${text}`;
        await sendToUser(chat.id, message);
      }
    } catch (error) {
      message = `Input: ${text}, \nError: ${error.message}`;
      await sendToUser(chat.id, message);
    }

  } else {
    await sendToUser(chat.id, 'Text message is expected.');
  }

  return { statusCode: 200 };
};
