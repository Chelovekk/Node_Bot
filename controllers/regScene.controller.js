const {Scenes, Markup} = require('telegraf')
const db = require('../db')


class RegisterScenes{
    nameScene(){
      const username = new Scenes.BaseScene('name')
      username.enter(async(ctx) => await ctx.reply('Введите ваше имя'))
      username.on('text', async(ctx) => {
        if(ctx.update.message.text){
            await ctx.scene.enter('age')
            ctx.session.name = ctx.update.message.text
            // await ctx.scene.leave()
        } else{
            await ctx.reply('Повтори')
            await ctx.scene.reenter()
        }
       })
    username.on('message', (ctx) => ctx.reply('Это не имя'))

    return username
    }
    ageScene(){
        const age = new Scenes.BaseScene('age')
        age.enter(async(ctx) => await ctx.reply('Введите свой возраст'))
        age.on('text', async(ctx) => {
            const userAge = Number(ctx.update.message.text)
            if(userAge && userAge>0){
                ctx.session.age = userAge;
                // await ctx.enter('age')
                await ctx.scene.enter('sex')
            } else{
                await ctx.reply('Не похоже на возраст')
                await ctx.scene.reenter()
            }
           })
           return age
    }
    sexScene(){
        const sex = new Scenes.BaseScene('sex')
        sex.enter(async(ctx) =>  {
            await ctx.reply(
                'Ваш пол',
                Markup.keyboard(['Мужчина', 'Женщина']).resize()
                )
            })
        sex.on('text', async(ctx)=>{
            const sex = ctx.update.message.text;
            if(sex=='Мужчина' || sex=='Женщина'){
                ctx.session.sex = sex;
                await ctx.scene.enter('place');
            }
            else {
                ctx.reply();
                ctx.scene.reenter();
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
                                   ['Киев	', 'Житомир	', 'Ивано-Франковск	'],
                                   ['Кропивницкий	', 'Луганск	', 'Луцк	'],
                                   ['Николаев	', 'Одесса	', 'Ровно	'],
                                   ['Николаев	', 'Одесса	', 'Ровно	'],
                                   ['Николаев	', 'Одесса	', 'Ровно	']]
            
                                ).resize()
              )
        })
        place.on('text', async(ctx) => {
            ctx.session.location = ctx.update.message.text;
            console.log(ctx.update.message.text)
             
              await ctx.scene.enter('description');
              // await ctx.scene.leave()
              
         })
         
      return place;
    }
    descriptionScene(){
        const description = new Scenes.BaseScene('description');
        
        description.enter(async(ctx)=>{
            ctx.reply('Опиши себя',
                      Markup.keyboard(['Пропустить']).resize()
            )
            description.on('text', async(ctx)=>{
            const user_description = ctx.update.message.text;
            const first_name = ctx.session.name;
            const tele_id = ctx.update.message.from.id;
            const username = ctx.update.message.from.username;
            const location = ctx.session.location;
            const age = ctx.session.age;
            if(user_description == 'Пропустить'){
                await ctx.reply(`  ${ctx.session.name}, ${ctx.session.age},Город ${ctx.session.city}`,
                 Markup.keyboard(['❤️', '❌', '🚫'])
                 )   
                await db.query('INSERT INTO usertable (tele_id, first_name, user_age, user_location, user_description, username)  values ($1,$2, $3, $4, $5, $6)', [tele_id, first_name, age, location, user_description, username])

                await ctx.scene.leave()
            } else{
                await ctx.reply(` Имя ${ctx.session.name} \n Возраст ${ctx.session.age} \n Пол ${ctx.session.sex} \n Город ${ctx.session.city} \n ${user_description}`,Markup.removeKeyboard())  
                await db.query('INSERT INTO usertable (tele_id, first_name, user_age, user_location, user_description, username)  values ($1,$2, $3, $4, $5, $6)', [tele_id, first_name, age, location, user_description, username])
                await ctx.scene.enter('crossroad')
            }
        })
        })
        return description;
    }
  }
  

module.exports = RegisterScenes

// await ctx.reply(` Имя ${ctx.session.name} \n Возраст ${ctx.session.age} \n Пол ${ctx.session.sex} \n Город ${ctx.update.message.text}`)
