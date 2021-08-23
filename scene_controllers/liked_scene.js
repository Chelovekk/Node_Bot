const db = require('../db')
const {Scenes, Markup, Telegram} = require('telegraf')

const tgram = new Telegram('1913645556:AAFK_KneC3NBz6S823yrZRQGdwuxe8uUDtc')

class LikedScene{
    showLikes(){
        const liked = new Scenes.BaseScene('liked');
        liked.enter(async ctx=>{
            try {
                const user_id = ctx.update.message.from.id;
            const candidate = await db.query('SELECT  * FROM user_liked WHERE tele_id=$1 FETCH FIRST 1 ROWS ONLY ', [user_id]);
            ctx.session.candidate = candidate.rows;
                if(ctx.session.candidate.length){
                    const replyData = await db.query('SELECT sex, user_age, first_name, user_location, user_description, username FROM usertable WHERE tele_id=$1',[candidate.rows[0].another_user_id]);
                    const sex = replyData.rows[0].sex;
                    const user_age = replyData.rows[0].user_age;
                    const first_name = replyData.rows[0].first_name;
                    const user_location = replyData.rows[0].user_location;
                    const user_description = replyData.rows[0].user_description;
                    ctx.session.another_user_name = replyData.rows[0].username;
                    await ctx.reply(`${first_name}, ${user_age}, ${user_location}\n${user_description}\n ${sex}`, 
                                    Markup.keyboard(['Взаимно','Дальше', 'Вернуться'],{
                                        wrap: (btn, index, currentRow) => currentRow.length>=5
                                    }).resize()   
                        );
                  
                }else{
                    ctx.reply('Это все, продолжайте поиск', 
                    Markup.keyboard(['Вернуться'],
                    {
                        wrap: (btn, index, currentRow) => currentRow.length>=5
                    })
                    .resize()   
                    )
                }
            } catch (error) {
                
            }
                    
            })
        liked.on('text', async ctx => {
            try {
                if(ctx.update.message.text == 'Взаимно'){
                    await db.query('DELETE FROM user_liked WHERE another_user_id=$1 AND tele_id=$2',[ctx.session.candidate[0].another_user_id, ctx.update.message.from.id])
                    await tgram.sendMessage(
                        ctx.session.candidate[0].another_user_id, 
                        `<a href="tg://user?id=${ctx.update.message.from.id}">inline mention of a user</a> ответил взаимностью`,
                        { 'parse_mode': 'html' }
                        )
                    ctx.scene.reenter();
                }else if(ctx.update.message.text == 'Дальше'){
                    await db.query('DELETE FROM user_liked WHERE another_user_id=$1 AND tele_id=$2',[ctx.session.candidate[0].another_user_id, ctx.update.message.from.id])
                    ctx.scene.reenter();
                }else if(ctx.update.message.text == 'Вернуться'){
                    ctx.scene.enter('crossroad')
                } else if(ctx.update.message.text == 'Пропустить'){
                    ctx.scene.enter('crossroad')
                }else if(ctx.update.message.text == 'Посмотреть'){
                    ctx.scene.reenter();
                }
            } catch (error) {
                console.log(error)
            }
            

            
        })
        
        return liked;
    }
    
}

module.exports = LikedScene;