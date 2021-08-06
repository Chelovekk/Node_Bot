const { Scenes } = require('telegraf') 

const RegisterScenes = require('../controllers/regScene.controller')


const scenes  = new RegisterScenes();
const nameScene = scenes.nameScene();
const ageScene = scenes.ageScene();
const placeScene = scenes.placeScene();
const sexScene = scenes.sexScene();
const descriptionScene = scenes.descriptionScene();
const stage = new Scenes.Stage([nameScene, ageScene, placeScene, sexScene, descriptionScene])


module.exports = stage;