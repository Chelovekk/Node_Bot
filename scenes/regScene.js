const { Scenes } = require('telegraf') 

const RegisterScenes = require('../controllers/regScene.controller')
const crossRoad = require('../controllers/crossroad.controller')


const regScenes  = new RegisterScenes();
const nameScene = regScenes.nameScene();
const ageScene = regScenes.ageScene();
const placeScene = regScenes.placeScene();
const sexScene = regScenes.sexScene();
const descriptionScene = regScenes.descriptionScene();


const crossScenes  = new crossRoad();
const crossScene = crossScenes.crossScene();




const stage = new Scenes.Stage([nameScene, ageScene, placeScene, sexScene, descriptionScene, crossScene])


module.exports = stage;