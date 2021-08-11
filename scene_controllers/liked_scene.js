const db = require('../db')
const tgram = new Telegram('1913645556:AAFK_KneC3NBz6S823yrZRQGdwuxe8uUDtc')

class likedScene{
    showLokes(){
        const liked = new Scenes.BaseScene('liked');
        liked.enter(async ctx=>{
            const user_id = ctx.update.messege.from.id;
            const liked_data = await db.query('SELECT another_user_id FROM user_liked WHERE tele_id=$1',[user_id]);
            liked_data.rows.forEach(async element=>{
                console.log(element)
                // const data = await db.query('SELECT sex, user_age, first_name, user_location, user_description FROM usertable WHERE tele_id=$1',[element.tele])
            })
        })
    }
}