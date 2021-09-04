const express = require('express');
const app = express();
const {session, Telegraf, Markup , Telegram} = require('telegraf') 
const LocalSession = require('telegraf-session-local')

const stage = require('./scenes/scenes')
const db = require('./db')
// const geoRev = require('geo-reverse')

require("dotenv").config();
console.log(process.env.PORT)

const bot = new Telegraf("1913645556:AAFK_KneC3NBz6S823yrZRQGdwuxe8uUDtc") 
const tgram = new Telegram('1913645556:AAFK_KneC3NBz6S823yrZRQGdwuxe8uUDtc')


// const { enter, leave } = Scenes.Stage

bot.use(Telegraf.log())
bot.use((new LocalSession({ database: './session_db.json' })).middleware())
bot.use(stage.middleware())
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
    } else{
        console.log('hi')
        await tgram.sendMessage(
            368161810, 
            '<a href="tg://user?id=368161810">inline mention of a user</a>',
             {
                 "parse_mode" : "HTML"
                }
            )
    }
})

bot.hears('hi', async (ctx) => {
   
})



  



bot.launch()




app.listen(3000, ()=> console.log(`started on ... `));