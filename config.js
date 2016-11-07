/*****************************************************************/
/*************************  CONFIGURE  ***************************/
/*****************************************************************/

var Config = (function() {

/*****************************************************************/
/* PRIVATE VARIABLES *********************************************/
/*****************************************************************/
	var wheel = [
		{
			type: 'sorry',
			directions: [],
			color: { path: '#b71c1c', glow: '#e57373' },
			result: {
				title: 'Sorry', 
				text:''
			}
		},
		{ 
			type: 'bingo',
			directions: [],
			color: { path: '#880e4f', glow: '#f06292' },
			result: {				
				title: 'Wow! BINGO',
				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#4a148c', glow: '#ba68c8' },
			result: {
				title: 'Congratulation', 
				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#311b92', glow: '#9575cd' },
			result: {
				title: 'Victory', 
				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#1a237e', glow: '#7986cb' },
			result: {
				title: 'Well done',
 				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#0d47a1', glow: '#64b5f6' },
			result: {
				title: 'Yay', 
				text:''
			}
		},
		{ 
			type: 'sorry',
			directions: [],
			color: { path: '#01579b', glow: '#4fc3f7' },
			result: {
				title: 'Too bad',
				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#006064', glow: '#4dd0e1' },
			result: {
				title: 'Congratulation', 
				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#004d40', glow: '#4db6ac' },
			result: {
				title: '(╯°□°）╯︵ ┻━┻', 
				text:''
			}
		},
		{ 
			type: 'bingo',
			directions: [],
			color: { path: '#1b5e20', glow: '#81c784' },
			result: {
				title: '(╯°□°）╯︵ ┻━┻',
				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#33691e', glow: '#aed581' },
			result: {
				title: 'Very good',
				text:''
			}
		},
		{ 
			type: 'sorry',
			directions: [],
			color: { path: '#827717', glow: '#dce775', text: 'black' },
			result: {
				title: 'Awww', 
				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#bf360c', glow: '#ff8a65' },
			result: {
				title: 'Ooohhh', 
				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#3e2723', glow: '#a1887f' },
			result: {
				title: 'Yes', 
				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#263238', glow: '#90a4ae' },
			result: {
				title: 'Winner', 
				text:''
			}
		},
		{ 
			type: 'prize',
			directions: [],
			color: { path: '#01579b', glow: '#4fc3f7' },
			result: {
				title: 'Congratulation', 
				text:''
			}
		}
	];

	var questions = [
		{
			question: 'Who is the fastest in the world?',
			answer: 'Usain Bolt',
			background: '',

		},
		{
			question: 'Name of the biggest moutain in the world?',
			answer: 'Himalayas',
			background: '',
		},
		{
			question: 'Something big and long and break two line',
			answer: 'abcdefgh jkl mnopq',
			background: '',
		}		
	];

	var memes = {
		sorry: [
			{
				name: "Hunting dog",
				src: 'images/memes/1.gif',
				height: 256,
				mirror: false
			}
		],
		bingo: [
			{
				name: "Rainbow frog",
				src: 'images/memes/2.gif',
				height: 333,
				mirror: true
			}
		]
	};

/*****************************************************************/
/* PRIVATE METHODS ***********************************************/
/*****************************************************************/

	var capitalizeFirstLetter = function(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	};

/*****************************************************************/
/* INITIALIZE ****************************************************/
/*****************************************************************/

	(function() {
		var angle = 360 / wheel.length;
		var direction = [];
		var before = 0;
		for (var i = 0; i < wheel.length; i++) {
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
			wheel[i].directions = direction;
		}

		//console.dir(wheel);

		for (var i = questions.length - 1; i >= 0; i--) {
			questions[i].isComplete = false;
			questions[i].isActive   = false;

		}
	})();


/*****************************************************************/
/* PUBLIC METHODS ************************************************/
/*****************************************************************/
	return {
		shortListForRender: function() {
			var list = [];
			for (var i = 0; i < wheel.length; i++) {
				list.push(capitalizeFirstLetter(wheel[i].type));
			}
			// Because of weird rendering method, we need to cut of
			// 4 items at the end of the list and push it in the
			// begining
			//return [].concat(list.slice(list.length - 4 , list.length), list.slice(0 , list.length - 4))
			return list;

		
		},
		colorPalete: function() {
			var list = [];
			for (var i = 0; i < wheel.length; i++) {
				list.push(wheel[i].color);
			}
			// Because of weird rendering method, we need to cut of
			// 4 items at the end of the list and push it in the
			// begining
			//return [].concat(list.slice(list.length - 4 , list.length), list.slice(0 , list.length - 4))
			return list;	
		},
		getWheel: function() {
			return wheel;
		},
		getQuestions: function() {
			return questions;
		},
		getMemes: function() {
			return memes;
		}
	}
})();