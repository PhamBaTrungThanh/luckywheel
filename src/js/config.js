/*****************************************************************/
/*************************  CONFIGURE  ***************************/
/*****************************************************************/
const fs = require("fs");
const path = require('path');
var Config = (function() {

/*****************************************************************/
/* PRIVATE VARIABLES *********************************************/
/*****************************************************************/
let _config = '';
const _defaultConfig = {
	colorPallet: [
		{glow: '#ffcdd2', path: '#c62828'},
		{glow: '#f8bbd0', path: '#ad1457'},
		{glow: '#e1bee7', path: '#6a1b9a'},
		{glow: '#d1c4e9', path: '#4527a0'},
		{glow: '#c5cae9', path: '#283593'},
		{glow: '#bbdefb', path: '#1565c0'},
		{glow: '#b3e5fc', path: '#0277bd'},
		{glow: '#b2ebf2', path: '#00838f'},
		{glow: '#b2dfdb', path: '#00695c'},
		{glow: '#c8e6c9', path: '#2e7d32'},
		{glow: '#dcedc8', path: '#558b2f'},
		{glow: '#f0f4c3', path: '#9e9d24'},
		{glow: '#ffd54f', path: '#ff6f00'},
		{glow: '#ff8a65', path: '#d84315'},
		{glow: '#bcaaa4', path: '#4e342e'},
		{glow: '#cfd8dc', path: '#37474f'}
	]
}
/*****************************************************************/
/* PRIVATE METHODS ***********************************************/
/*****************************************************************/

	const capitalizeFirstLetter = function(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	};
	const readAssetDir = function(dir) {
		dir = './assets/' + dir;
		var list = fs.readdirSync(dir);
		return list;
	};
	const saveWheelImage = (dataURL) => {
		/*
		const data = atob( dataURL.substring( "data:image/png;base64,".length ) ),
			asArray = new Uint8Array(data.length);

		for( let i = 0, len = data.length; i < len; ++i ) {
			asArray[i] = data.charCodeAt(i);    
		}

		const blob = new Blob( [ asArray.buffer ], {type: "image/png"} );
		console.log(blob);*/
		const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");
		fs.writeFileSync('./assets/wheel.png', base64Data, 'base64');
	};
	const save = () => {
		fs.writeFileSync('config.json', JSON.stringify(_config), 'utf-8');
	};
	const toArray = (object) => {

	} 

/*****************************************************************/
/* INITIALIZE ****************************************************/
/*****************************************************************/

	(function() {
		// Read data from string;

		const data = fs.readFileSync('config.json', 'utf-8');
		_config = JSON.parse(data);
		var angle = 360 / _config.wheel.length;
		var direction = [];
		var before = 0;
		for (var i = 0; i < _config.wheel.length; i++) {
			if (i == 0) { //
				direction = [
					{from: 360 - angle/2, to: 360
		},
					{from: 0, to: angle/2}
				];
				before = angle/2;
			} else {
				direction = [{from: before, to: before + angle}];
				before += angle;
			}
			_config.wheel[i].directions = direction;
		}

		//console.dir(wheel);
		for (var i = _config.questions.length - 1; i >= 0; i--) {
			_config.questions[i].isComplete = false;
			_config.questions[i].isActive   = false;
		}
		//merge all
		_config = Object.assign(_config, _defaultConfig);
		console.log(_config);
	})();


/*****************************************************************/
/* PUBLIC METHODS ************************************************/
/*****************************************************************/
	return {
		shortListForRender: function() {
			var list = [];
			for (var i = 0; i < _config.wheel.length; i++) {
				list.push(capitalizeFirstLetter(_config.wheel[i].text));
			}
			// Because of weird rendering method, we need to cut of
			// 4 items at the end of the list and push it in the
			// begining
			//return [].concat(list.slice(list.length - 4 , list.length), list.slice(0 , list.length - 4))
			return list;

		
		},
		colorPalete: function() {
			var list = [];
			for (var i = 0; i < _config.wheel.length; i++) {
				list.push(_config.wheel[i].color);
			}
			// Because of weird rendering method, we need to cut of
			// 4 items at the end of the list and push it in the
			// begining
			//return [].concat(list.slice(list.length - 4 , list.length), list.slice(0 , list.length - 4))
			return list;	
		},
		getWheel: function() {
			return _config.wheel;
		},
		getQuestions: function() {
			return _config.questions;
		},
		getMemes: function() {
			return _config.memes;
		},
		getBackgroundDir: function() {
			return readAssetDir('background');
		},
		getImageDir: function() {
			return readAssetDir('image');
		},
		getColorPallet: () => {
			return _config.colorPallet;
		},
		removeQuestion: function(index) {
			_config.questions.splice(index, 1);
			return _config.questions;
		},
		removeWheelBox: (index) => {
			_config.wheel.splice(index, 1);
			return true;
		},
		saveQuestions: function(questions) {
			_config.questions = questions;
			return true;
		},
		saveWheel: (wheel) => {
			_config.wheel = wheel;
			return true;
		},
		saveWheelImage: (dataURL) => {
			saveWheelImage(dataURL);
			return true;
		},
		save: () => {
			save();
			return true;
		}
	}
})();