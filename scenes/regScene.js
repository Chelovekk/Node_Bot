const { Scenes } = require('telegraf') 

const RegisterScenes = require('../scene_controllers/regScene.controller')
const crossRoad = require('../scene_controllers/crossroad.controller')
const searchScenes = require('../scene_controllers/search.controller')

const regScenes  = new RegisterScenes();
const nameScene = regScenes.nameScene();
const ageScene = regScenes.ageScene();
const placeScene = regScenes.placeScene();
const sexScene = regScenes.sexScene();
const descriptionScene = regScenes.descriptionScene();
const preferenceScene = regScenes.preferencesScene();

const crossScenes  = new crossRoad();
const crossScene = crossScenes.crossScene();

const search = new searchScenes();
const searchScene = search.searchScene();


const stage = new Scenes.Stage([nameScene, ageScene, placeScene, sexScene, descriptionScene, crossScene, preferenceScene, searchScene])


module.exports = stage;