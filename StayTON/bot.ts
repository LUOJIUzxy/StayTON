const { Telegraf } = require('telegraf');
const bot = new Telegraf('7331330433:AAE7QyYiErhbZJmHsF9ZXhKbJRQDsVHH-os');


// Start command handler
bot.command('start', ctx => {
    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, 'Hello there! Welcome to StayTON - Your one and only on-chain booking tool.');
});

// Phone number request handler
bot.hears('phone', (ctx) => {
    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, 'Can we access your phone number?', requestPhoneKeyboard);
});

// Location request handler
bot.hears('location', (ctx) => {
    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, 'Can we access your location?', requestLocationKeyboard);
});

// Mini App request handler
bot.hears('MiniApp', (ctx) => {
    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, 'Open the Mini App:', requestUrlKeyboard);
});

// Keyboard for requesting phone number
const requestPhoneKeyboard = {
    reply_markup: {
        one_time_keyboard: true,
        keyboard: [
            [{
                text: "My phone number",
                request_contact: true
            }],
            ['Cancel']
        ]
    }
};

// Keyboard for requesting location
const requestLocationKeyboard = {
    reply_markup: {
        one_time_keyboard: true,
        keyboard: [
            [{
                text: "My location",
                request_location: true
            }],
            ['Cancel']
        ]
    }
};

// Inline keyboard for opening the Mini App
const requestUrlKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: "Open Mini App",
                web_app: { url: "https://stay-ton-gm.vercel.app/" }
            }]
        ]
    }
};

// Launch the bot
bot.launch();
