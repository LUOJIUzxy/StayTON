# from telegram import Bot, Update
# from telegram.ext import CommandHandler, Updater

# TOKEN = '7434553875:AAFyJa4R5Vak_P1frKvbJgY5cobbBdWV-rQ'

# def start(update, context):
#     chat_id = update.message.chat_id
#     context.bot.send_message(chat_id, text="Open the mini app:", 
#                              reply_markup={
#                                  "inline_keyboard": [
#                                      [{"text": "Open Mini App", "web_app": {"url": "https://172.16.0.161:5173/vite-boilerplate/"}}]
#                                  ]
#                              })

# # Create a bot object
# bot = Bot(token=TOKEN)

# updater = Updater(bot, update_queue=None)
# dispatcher = updater.dispatcher

# start_handler = CommandHandler('start', start)
# dispatcher.add_handler(start_handler)

# updater.start_polling()



from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes

TOKEN = '7434553875:AAFyJa4R5Vak_P1frKvbJgY5cobbBdWV-rQ'

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    chat_id = update.message.chat_id
    keyboard = [
        [InlineKeyboardButton("Open Mini App", web_app={'url': 'https://172.16.0.161:5173/vite-boilerplate/'})]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await context.bot.send_message(chat_id, text="Open the mini app:", reply_markup=reply_markup)

app = Application.builder().token(TOKEN).build()

start_handler = CommandHandler('start', start)
app.add_handler(start_handler)

app.run_polling()
