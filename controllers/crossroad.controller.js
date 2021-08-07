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
                ctx.scene.leave();
            } else if(ctx.update.message.text == 'Измень анкету(🤡)'){
                ctx.scene.enter('name')
            } else{
                ctx.scene.reenter();
            }
        })
        return cross
    }
    
}


module.exports = crossRoad