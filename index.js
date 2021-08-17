const express = require('express');
const app = express();
const {session, Telegraf, Markup , Telegram} = require('telegraf') 

const regStage = require('./scenes/regScene')
const db = require('./db')
// const geoRev = require('geo-reverse')



const bot = new Telegraf("1913645556:AAFK_KneC3NBz6S823yrZRQGdwuxe8uUDtc") 
const tgram = new Telegram('1913645556:AAFK_KneC3NBz6S823yrZRQGdwuxe8uUDtc')


// const { enter, leave } = Scenes.Stage

bot.use(Telegraf.log())
bot.use(session())
bot.use(regStage.middleware())
///
bot.start(async(ctx) => {
    tele_id = ctx.update.message.from.id;
    const user = await db.query('SELECT first_name FROM usertable WHERE tele_id=$1',[tele_id])
    if(user.rows.length){
        await ctx.reply(`Привет ${user.rows[0].first_name}`);
        await ctx.scene.enter('crossroad');
    } else{
        await ctx.reply('Вас я не знаю');
        await ctx.scene.enter('name');

    }
    // ctx.reply('Welcome')
}) 

bot.hears('🚫 Стоп', async (ctx)=>{
    ctx.scene.enter('crossroad')
})

bot.help((ctx) => {
    console.log(ctx)
    ctx.reply(ctx.botInfo)
}) 
 
bot.on('text', async ctx=>{
     if(ctx.update.message.text == 'Посмотреть'){
        ctx.scene.enter('liked');

    } else if(ctx.update.message.text == 'Пропустить'){
        ctx.scene.enter('crossroad');
    }
})

bot.hears('hi', async (ctx) => {
    let a = await db.query('select * from usertable')
    console.log(a)
    ctx.reply('Hey there')
})



  



bot.launch()




app.listen(3000, ()=> console.log(`started on ... `));