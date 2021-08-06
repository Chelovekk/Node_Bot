const { Markup } = require('telegraf')


class someCommands{
    async someFunction(ctx){
        ctx.reply('One time keyboard', Markup
        .keyboard(['/simple', '/inline', '/pyramid'])
        .oneTime()
        .resize()
  )
    }
}

module.exports = new someCommands;
