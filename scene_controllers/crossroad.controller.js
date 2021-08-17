const {Scenes, Markup} = require('telegraf')
const db = require('../db')

class crossRoad{
    crossScene(){
        const cross = new Scenes.BaseScene('crossroad')
        cross.enter(async (ctx)=>{
            const user = await db.query('SELECT * FROM usertable WHERE tele_id=$1', [ctx.update.message.from.id])
            await ctx.reply(`Ваша анекета: \n ${user.rows[0].first_name} \n ${user.rows[0].user_age} \n ${user.rows[0].user_location} \n ${user.rows[0].user_description}`,
                        Markup.keyboard(                        
                            ['Начfть поиск(🤡)', 'Измень анкету(🤡)', 'Остановить поиск(🤡)'],
                            {
                                wrap: (btn, index, currentRow) => currentRow.length>=5
                            }
                         )
                        .resize()
                        )
        })
        cross.on('text', async(ctx)=>{
            try {
                if(ctx.update.message.text == 'Начfть поиск(🤡)'){
                    const user_id = ctx.update.message.from.id;
                    const user_prefer = await db.query('SELECT preferences FROM usertable WHERE tele_id=$1',[user_id]);
                    //XПЕРЕДЕЛАТЬ
                    
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
                    ctx.scene.enter('search');
                } 
                else if(ctx.update.message.text == 'Измень анкету(🤡)'){
                    ctx.scene.enter('name');
                } else if(ctx.update.message.text =='Остановить поиск(🤡)'){
                    ctx.scene.reenter();
                } else if(ctx.update.message.text == 'Посмотреть'){
                    ctx.scene.enter('liked');

                } else if(ctx.update.message.text == 'Пропустить'){
                    ctx.scene.reenter();
                }
            } catch (err) {
                console.log(err)
            }
               
        })
       
        return cross
    }
    
}


module.exports = crossRoad