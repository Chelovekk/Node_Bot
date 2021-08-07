const {Scenes, Markup} = require('telegraf')
const db = require('../db')

class crossRoad{
    crossScene(){
        const cross = new Scenes.BaseScene('crossroad')
        cross.enter(async (ctx)=>{
            const user = await db.query('SELECT * FROM usertable WHERE tele_id=$1', [ctx.update.message.from.id])
            await ctx.reply(`Ваша анекета: \n ${user.rows[0].first_name} \n ${user.rows[0].user_age} \n ${user.rows[0].user_location} \n ${user.rows[0].user_description}`,
                        Markup.keyboard(                        
                            ['Начять поиск(🤡)', 'Измень анкету(🤡)', 'Остановить поиск(🤡)'],
                            {
                                wrap: (btn, index, currentRow) => currentRow.length>=5
                            }
                         )
                        .resize()
                        )
        })
        cross.on('text', async(ctx)=>{
            if(ctx.update.message.text == 'Начять поиск(🤡)'){
                const user_id = ctx.update.message.from.id;
                const user_prefer = db.query('SELECT preferences FROM usertable WHERE tele_id=$1',[user_id]);
                //XПЕРЕДЕЛАТЬ
                if(user_prefer == 'Парни' ){
                    let candidates = await db.query('SELECT tele_id FROM usertalbe WHERE sex=$1',['Мужчина']);
                    candidates.rows.forEach(async candidate=>{
                    await db.query('INSERT INTO user_candidates (tele_id, another_user_id) values ($!,$2)',[user.id, candidate])
                    })
                }else {
                    let candidates = await db.query('SELECT tele_id FROM usertalbe WHERE sex=$1',['Женшина']);
                    candidates.rows.forEach(async candidate=>{
                    await db.query('INSERT INTO user_candidates (tele_id, another_user_id) values ($!,$2)',[user.id, candidate])
                    })
                }
                ctx.scene.enter('search');
            } else if(ctx.update.message.text == 'Измень анкету(🤡)'){
                ctx.scene.enter('name');
            } else if(ctx.update.message.text =='Остановить поиск(🤡)'){
                ctx.scene.reenter();
            } else
            ctx.scene.reenter();
        })
        return cross
    }
    
}


module.exports = crossRoad