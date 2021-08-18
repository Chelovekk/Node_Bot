const {Scenes, Markup} = require('telegraf')
const db = require('../db')


class RegisterScenes{
    nameScene(){
      const username = new Scenes.BaseScene('name')
      username.enter(async(ctx) => await ctx.reply('Введите ваше имя'))
      username.on('text', async(ctx) => {
        try {
            if(ctx.update.message.text){
                await ctx.scene.enter('age')
                ctx.session.name = ctx.update.message.text
                // await ctx.scene.leave()
            } else{
                await ctx.reply('Повтори')
                await ctx.scene.reenter()
            }
        } catch (error) {
            
        }
       })
    username.on('message', (ctx) => ctx.reply('Это не имя'))

    return username
    }
    ageScene(){
        const age = new Scenes.BaseScene('age')
        age.enter(async(ctx) => await ctx.reply('Введите свой возраст'))
        age.on('text', async(ctx) => {
            try {
                const userAge = Number(ctx.update.message.text)
            if(userAge && userAge>0){
                ctx.session.age = userAge;
                // await ctx.enter('age')
                await ctx.scene.enter('sex')
            } else{
                await ctx.reply('Не похоже на возраст')
                await ctx.scene.reenter()
            }
            } catch (error) {
                
            }
           })
           return age
    }
    sexScene(){
        const sex = new Scenes.BaseScene('sex')
        sex.enter(async(ctx) =>  {
            try {
                await ctx.reply(
                    'Ваш пол',
                    Markup.keyboard(
                        ['Мужчина', 'Женщина'],
                        {
                            wrap: (btn, index, currentRow) => currentRow.length>=5
                        }
                    )
                    .resize()
                    )
            } catch (error) {
                
            }
            })
        sex.on('text', async(ctx)=>{
            try {
                const sex = ctx.update.message.text;
            if(sex=='Мужчина' || sex=='Женщина'){
                ctx.session.sex = sex;
                await ctx.scene.enter('place');
            }
            else {
                ctx.reply();
                ctx.scene.reenter();
            }
            } catch (error) {
                
            }             
    })
    return sex
    }
    placeScene(){
        const place = new Scenes.BaseScene('place')
        place.enter(async(ctx) => {
           await  ctx.reply(
                'Выбери свой город',
                Markup.keyboard(
            
                                  [['Винница', 'Днепр', 'Донецк'],
                                   ['Запорожье', 'Львов', 'Кривой Рог'],
                                   ['Севастополь', 'Николаев', 'Мариуполь'],
                                   ['Киев', 'Житомир', 'Ивано-Франковск	'],
                                   ['Кропивницкий', 'Луганск', 'Луцк'],
                                   ['Херсон	', 'Чернигов', 'Полтава	'],
                                   ['Черкассы', 'Хмельницкий', 'Черновцы'],
                                   ['Сумы', 'Севастополь', 'Ровно']]
            
                                ).resize()
              )
        })
        place.on('text', async(ctx) => {
            ctx.session.location = ctx.update.message.text;
            console.log(ctx.update.message.text)
             
              await ctx.scene.enter('preference');
              // await ctx.scene.leave()
              
         })
         
      return place;
    }
    preferencesScene(){
        const preference = new Scenes.BaseScene('preference');
        preference.enter(async (ctx) => {
            await ctx.reply('Кто тебе нравиться?',
                    Markup.keyboard(
                        ['Парни', 'Девушки'],
                        {
                            wrap: (btn, index, currentRow) => currentRow.length>=5
                        }
                    ).resize()
            )
        })
        preference.on('text', async (ctx)=>{
            const prefer = ctx.update.message.text;
            if(prefer=='Парни' || prefer=='Девушки'){
                ctx.session.prefer = prefer;
                await ctx.scene.enter('description');
            }
            else {
                ctx.reply();
                ctx.scene.reenter();
            } 
        })
        return preference;
    }
    descriptionScene(){
        const description = new Scenes.BaseScene('description');
        
        description.enter(async(ctx)=>{
            ctx.reply('Опиши себя',
                      Markup.keyboard(['Пропустить']).resize()
            )
        })    
            description.on('text', async(ctx)=>{
                if(ctx.update.message.text == 'Пропустить'){
                    ctx.session.description = " "; 
                }else {
                    ctx.session.description = ctx.update.message.text;
                }
            const user_description = ctx.session.description;
            const first_name = ctx.session.name;
            const tele_id = ctx.update.message.from.id;
            const username = ctx.update.message.from.username;
            const location = ctx.session.location;
            const age = ctx.session.age;
            const sex = ctx.session.sex;
            const preference = ctx.session.prefer;
            const possible_user = await db.query('SELECT * FROM usertable WHERE tele_id=$1', [tele_id])
            if(possible_user.rows.length){
                if(user_description == 'Пропустить'){
                    await db.query('UPDATE  usertable SET  first_name=$1, user_age=$2, user_location=$3, user_description=$4, username=$5, sex=$6, preferences=$7  WHERE tele_id=$8', [first_name, age, location, user_description, username, sex, preference, tele_id])
                } else{
                    await db.query('UPDATE  usertable SET  first_name=$1, user_age=$2, user_location=$3, user_description=$4, username=$5, sex=$6, preferences=$7  WHERE tele_id=$8', [first_name, age, location, user_description, username, sex, preference, tele_id])
                }
            }else{
                if(user_description == 'Пропустить'){
                    await db.query('INSERT INTO usertable (tele_id, first_name, user_age, user_location, user_description, username, sex, preferences)  values ($1,$2, $3, $4, $5, $6, $7, $8)', [tele_id, first_name, age, location, user_description, username, sex, preference])
                } else{
                    await db.query('INSERT INTO usertable (tele_id, first_name, user_age, user_location, user_description, username, sex, preferences)  values ($1,$2, $3, $4, $5, $6, $7, $8)', [tele_id, first_name, age, location, user_description, username, sex, preference])
                }
            }
            await ctx.scene.enter('crossroad');

            
        })
        return description;
    }
  }
  

module.exports = RegisterScenes

// await ctx.reply(` Имя ${ctx.session.name} \n Возраст ${ctx.session.age} \n Пол ${ctx.session.sex} \n Город ${ctx.update.message.text}`)
