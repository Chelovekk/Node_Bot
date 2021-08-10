const { query } = require('express');
const {Scenes, Markup} = require('telegraf')
const db = require('../db')

class Search{
    searchScene(){
        const search = new Scenes.BaseScene('search');

        search.enter(async ctx => {
            await ctx.reply('search')
            // console.log(candidate.rows)
            const user_id = ctx.update.message.from.id;
            const candidate = await db.query('SELECT  * FROM user_candidates WHERE tele_id=$1 FETCH FIRST 1 ROWS ONLY ', [user_id]);
            ctx.session.candidate = candidate.rows;
                if(ctx.session.candidate){
                    await ctx.reply(ctx.session.candidate, 
                                    Markup.keyboard(['Оценить','Дальше','Стоп'],{
                                        wrap: (btn, index, currentRow) => currentRow.length>=5
                                    }).resize()   
                        );
                    // console.log(ctx.session.candidate[0].another_user_id)
                  
                }
            // ctx.reply(user.rows )
        })
        search.on('text', async ctx => {
            const user_id = ctx.update.message.from.id;
            const liked_user = ctx.session.candidate[0].tele_id;
            if(ctx.update.message.text == 'Оценить'){
                await db.query('INSERT INTO user_liked (tele_id, another_user_id) values ($1,$2)',[liked_user, user_id])
                await db.query('DELETE FROM user_candidates WHERE another_user_id=$1 AND tele_id=$2 RETURNING *',[ctx.session.candidate[0].another_user_id, user_id])
                
            }else if(ctx.update.message.text == 'Дальше'){
                await db.query('DELETE FROM user_candidates WHERE another_user_id=$1 AND tele_id=$2 RETURNING *',[ctx.session.candidate[0].another_user_id, user_id])
                ctx.scene.reenter();

            }else if(ctx.update.message.text == 'Стоп'){
                ctx.scene.enter('crossroad')
            }
        })

        return search;
    }
}

module.exports = Search