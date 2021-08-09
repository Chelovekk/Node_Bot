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
                    await ctx.reply(ctx.session.candidate);
                    // console.log(ctx.session.candidate[0].another_user_id)
                    const w = await db.query('DELETE FROM user_candidates WHERE another_user_id=$1 AND tele_id=$2 RETURNING *',[ctx.session.candidate[0].another_user_id, user_id])
                    console.log(w);
                }
            

            // ctx.reply(user.rows )
        })
        search.on('text', async ctx => {
            ctx.scene.reenter();
        })

        return search;
    }
}

module.exports = Search