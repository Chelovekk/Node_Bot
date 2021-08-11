const {Scenes, Markup, Telegram} = require('telegraf')
const db = require('../db')
const tgram = new Telegram('1913645556:AAFK_KneC3NBz6S823yrZRQGdwuxe8uUDtc')
class Search{
    searchScene(){
        const search = new Scenes.BaseScene('search');

        search.enter(async ctx => {
            try {
            // console.log(candidate.rows)
            const user_id = ctx.update.message.from.id;
            const candidate = await db.query('SELECT  * FROM user_candidates WHERE tele_id=$1 FETCH FIRST 1 ROWS ONLY ', [user_id]);
            ctx.session.candidate = candidate.rows;
                if(ctx.session.candidate.length){
                    const replyData = await db.query('SELECT sex, user_age, first_name, user_location, user_description FROM usertable WHERE tele_id=$1',[candidate.rows[0].another_user_id]);
                    const sex = replyData.rows[0].sex;
                    const user_age = replyData.rows[0].user_age;
                    const first_name = replyData.rows[0].first_name;
                    const user_location = replyData.rows[0].user_location;
                    const user_description = replyData.rows[0].user_description;

                    await ctx.reply(`${first_name}, ${user_age}, ${user_location}\n${user_description}\n ${sex}`, 
                                    Markup.keyboard(['Оценить','Дальше','Стоп'],{
                                        wrap: (btn, index, currentRow) => currentRow.length>=5
                                    }).resize()   
                        );
                    // console.log(ctx.session.candidate[0].another_user_id)
                  
                }else{
                    const user_id = ctx.update.message.from.id;
                    const user_prefer = await db.query('SELECT preferences FROM usertable WHERE tele_id=$1',[user_id]);

                    if(user_prefer.rows[0].preferences == 'Парни' ){
                        let candidates = await db.query('SELECT tele_id FROM usertable WHERE sex=$1',['Мужчина']);
                        candidates.rows.sort(() => Math.random() - 0.5);
                        candidates.rows.forEach(async candidate=>{
                            await db.query('INSERT INTO user_candidates (tele_id, another_user_id) values ($1,$2) ON CONFLICT DO NOTHING',[user_id, candidate.tele_id])
                        })
                    }else {
                        let candidates = await db.query('SELECT tele_id FROM usertable WHERE sex=$1',['Женщина']);
                      candidates.rows.sort(() => Math.random() - 0.5);
                        candidates.rows.forEach(async candidate=>{
                            await db.query('INSERT INTO user_candidates (tele_id, another_user_id) values ($1,$2) ON CONFLICT DO NOTHING',[user_id, candidate.tele_id])
                        })
                    }
                    ctx.scene.reenter();
                }
            // ctx.reply(user.rows )
            } catch (error) {
                
            }
            
        })
        search.on('text', async ctx => {
            try {
                const user_id = ctx.update.message.from.id;
                const liked_user = ctx.session.candidate[0].another_user_id;
                if(ctx.update.message.text == 'Оценить'){
                    await db.query('INSERT INTO user_liked (tele_id, another_user_id) values ($1,$2) ON CONFLICT DO NOTHING',[liked_user, user_id])
                    await db.query('DELETE FROM user_candidates WHERE another_user_id=$1 AND tele_id=$2',[ctx.session.candidate[0].another_user_id, user_id])
                    const replyData = await db.query('SELECT sex, user_age, first_name, user_location, user_description FROM usertable WHERE tele_id=$1',[user_id]);
                    const sex = replyData.rows[0].sex;
                    const user_age = replyData.rows[0].user_age;
                    const first_name = replyData.rows[0].first_name;
                    const user_location = replyData.rows[0].user_location;
                    const user_description = replyData.rows[0].user_description;
                    console.log(liked_user)
                    if(liked)
                    // tgram.sendMessage(liked_user,`${first_name}, ${user_age}, ${user_location}\n${user_description}\n ${sex}`)
                    tgram.sendMessage(liked_user,Markup(
                                        ['check'].resize()
                    ))

                    ctx.scene.reenter();
                }else if(ctx.update.message.text == 'Дальше'){
                    await db.query('DELETE FROM user_candidates WHERE another_user_id=$1 AND tele_id=$2',[ctx.session.candidate[0].another_user_id, user_id])
                    ctx.scene.reenter();

                }else if(ctx.update.message.text == 'Стоп'){
                    ctx.scene.enter('crossroad')
                }
            } catch (err) {
                console.log(err)
            }
            
        })

        return search;
    }
}

module.exports = Search