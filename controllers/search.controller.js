const {Scenes, Markup} = require('telegraf')
const db = require('../db')

class Search{
    searchScene(){
        const search = new Scenes.BaseScene('search');

        search.enter(async ctx => {
            ctx.session.candidates = await db.query('SELECT * FROM ');
        })

        return search;
    }
}

module.exports = Search