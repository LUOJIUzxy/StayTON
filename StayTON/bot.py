from telegram import Bot, Update
from telegram.ext import CommandHandler, Updater

TOKEN = '7331330433:AAE7QyYiErhbZJmHsF9ZXhKbJRQDsVHH-os'

def start(update, context):
    chat_id = update.message.chat_id
    context.bot.send_message(chat_id, text="Open the mini app:", 
                             reply_markup={
                                 "inline_keyboard": [
                                     [{"text": "Open Mini App", "web_app": {"url": "http://abc123.ngrok.io"}}]
                                 ]
                             })

# Create a bot object
bot = Bot(token=TOKEN)

updater = Updater(bot, update_queue=None)
dispatcher = updater.dispatcher

start_handler = CommandHandler('start', start)
dispatcher.add_handler(start_handler)

updater.start_polling()
