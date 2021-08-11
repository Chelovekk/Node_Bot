const { Scenes } = require('telegraf') 

const crossRoad = require('../scene_controllers/crossroad.controller')


const scenes  = new crossRoad();
const crossScene = scenes.crossScene();
const stage = new Scenes.Stage([crossScene])


module.exports = stage;