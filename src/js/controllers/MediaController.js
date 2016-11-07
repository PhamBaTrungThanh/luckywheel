	/**********************  MEDIA + EFFECT **************************/
	/*****************************************************************/

var MediaController = (function() {
	/* Public variable*/
	


	/* Private Variable */

	var 
		colorPalete = [
			{h: 351, s: 1, l: 0.961, name: 'red'},
			{h: 340, s: 0.8, l: 0.941, name: 'pink'},
			{h: 292, s: 0.444, l: 0.929, name: 'purple'},
			{h: 264, s: 0.455, l: 0.935, name: 'deep-purple'},
			{h: 231, s: 0.438, l: 0.937, name: 'indigo'}, 
			{h: 351, s: 1, l: 0.961, name: 'red'},
			{h: 340, s: 0.8, l: 0.941, name: 'pink'},
			{h: 292, s: 0.444, l: 0.929, name: 'purple'},
			{h: 264, s: 0.455, l: 0.935, name: 'deep-purple'},
			{h: 231, s: 0.438, l: 0.937, name: 'indigo'}, 
			{h: 205, s: 0.867, l: 0.941, name: 'blue'},
			{h: 199, s: 0.935, l: 0.939, name: 'light-blue'},
			{h: 187, s: 0.722, l: 0.929, name: 'purple'},
			{h: 264, s: 0.455, l: 0.935, name: 'cyan'},
			{h: 177, s: 0.409, l: 0.914, name: 'teal'}, 
			{h: 125, s: 0.394, l: 0.935, name: 'green'},
			{h: 88, s: 0.517, l: 0.943, name: 'light-green'},
			{h: 66, s: 0.714, l: 0.945, name: 'lime'},
			{h: 55, s: 1, l: 0.953, name: 'yellow'},
			{h: 46, s: 1, l: 0.941, name: 'amber'}, 
			{h: 37, s: 1, l: 0.939, name: 'orange'},
			{h: 6, s: 0.714, l: 0.945, name: 'deep-orange'},  
			{h: 20, s: 0.158, l: 0.925, name: 'brown'},
			{h: 204, s: 0.152, l: 0.935, name: 'blue-grey'},
			{h: 0, s: 0, l: 0.98, name: 'text'}
		],
		firstRunEffect = true,
		soundSourceList      = [
			{ src: 'waiting_1_edited', keyBind: '3' },
			{ src: 'congratulation', keyBind: '1' },
			{ src: 'ding_edited', id:'ding' },
			{ src: 'intro' },
			{ src: 'congratulation2', keyBind: '2' }
			
		],
		crossfaderTime = 2000;
		soundList = [];



/****************************************************************************/
/**** PRIVATE FUNCTION ******************************************************/
/****************************************************************************/
var 
	decompose =  function(a, b, c, d, e, f) {
		var acos = Math.acos, // caching for readability below
				atan = Math.atan,
				sqrt = Math.sqrt,
				pi   = Math.PI,

				translate = {x: e, y: f},
				rotation  = 0,
				scale     = {x: 1, y: 1},
				skew      = {x: 0, y: 0},

				determ = a * d - b * c;   // get determinant
				// Apply the QR-like decomposition.
				if (a || b) {
						var r = sqrt(a*a + b*b);
						rotation = b > 0 ? acos(a / r) : -acos(a / r);
						scale    = {x: r, y: determ / r};
						skew.x   = atan((a*c + b*d) / (r*r));
				}
				else if (c || d) {
						var s = sqrt(c*c + d*d);
						rotation = pi * 0.5 - (d > 0 ? acos(-c / s) : -acos(c / s));
						scale    = {x: determ/s, y: s};
						skew.y   = atan((a*c + b*d) / (s*s));
				}
				else { // a = b = c = d = 0
						scale = {x:0, y:0};     // = invalid matrix
				}
	

		return {
				scale    : scale,
				translate: translate,
				rotation : Math.round(rotation * (180/Math.PI)),
				skew     : skew
		};
	},
	getContrastYIQ = function(r,g,b) {
		var yiq = ((r*299)+(g*587)+(b*114))/1000;
		return (yiq >= 128) ? '#000000' : '#ffffff';
	},
	getColorPalete = function(length) {

		function hslToHex(h, s, l) {
			var r, g, b;
			function componentToHex(c) {
					var hex = c.toString(16);
					return hex.length == 1 ? "0" + hex : hex;
			}

			function rgbToHex(r, g, b) {
					return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
			}

			if (s == 0) {
				r = g = b = Math.round(l * 255); // achromatic
			} else {
				function hue2rgb(p, q, t) {
					if (t < 0) t += 1;
					if (t > 1) t -= 1;
					if (t < 1/6) return p + (q - p) * 6 * t;
					if (t < 1/2) return q;
					if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
					return p;
				}

				var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				var p = 2 * l - q;

				r = Math.round(255 * hue2rgb(p, q, h + 1/3));
				g = Math.round(255 * hue2rgb(p, q, h));
				b = Math.round(255 * hue2rgb(p, q, h - 1/3));

			}
			var result = {
				bg: rgbToHex(r, g, b),
				color: getContrastYIQ(r,g,b)
			};
			return result;
		}

		var max = colorPalete.length - 2;
		var randomNumber = Math.round(Math.random() * max );

		var baseColor = colorPalete[randomNumber],
				returner  = [];
		console.log(baseColor.name);
		for (var i = 0; i < length; i++) {
			var h = baseColor.h/360;
			var s = baseColor.s - baseColor.s*((i)*0.04);
			var l = baseColor.l - baseColor.l*((i)*0.04);
			var result = hslToHex(h, s, l);
			returner.push(result);
		}

		colorList = returner;
		return returner;    
	},
	soundInterface = function(audio) {
		var _audio = '';
		var defaultConfig = {
			preload: true,
			loop: false,
			keyBind: false,
			desc : '',
			$node: false,
			id: (audio.id) ? audio.id : audio.src,
			isPlaying: false
		}
		var defaultMethod = {
			play: function() {
				_audio.$node.trigger('play');
			},
			pause: function() {
				_audio.$node.trigger('pause');
			},
			stop: function() {
				_audio.$node.trigger('pause').prop("currentTime",0);
			}
		}
		_audio = jQuery.extend({}, defaultConfig, defaultMethod, audio);

		_audio.$node = jQuery('<audio></audio>')
							.attr({
								preload: _audio.preload,
								id: _audio.id,
								loop: audio.loop
							})
							.attr('src', 'audio/'+audio.src+'.mp3');
		/* Do some binding */
		if (_audio.keyBind) {
			$.key(_audio.keyBind, function(event) {
				event.preventDefault();
				event.stopPropagation();
				if (_audio.isPlaying == true)	{
					_audio.stop();
					console.log('Stop `' + _audio.id + '`.');
					_audio.isPlaying = false;
				} else {
					_audio.play();
					console.log('Play `' + _audio.id + '`.');
					_audio.isPlaying = true;		
				}
			});
		}
		return _audio;
	},
	registerSoundAndEvent = function() {

		var parent = jQuery('<section></section>').attr('role', 'sound-holder');
		for (var i = soundSourceList.length - 1; i >= 0; i--) {
			var audio = new soundInterface(soundSourceList[i]);
			soundList[audio.id] = audio;
			parent.append(audio.$node);
		}	
		jQuery('body').append(parent);		

		/** Register Event */
		$.key('0', function() {
			MediaController.stopAllAudio();
		});
		console.log('-------- Sound list ---------');
		console.log(soundList);
	},

	crossfader = function() {
		var crossfaderEffect = function(value) {
			for (var i = soundList.length - 1; i >= 0; i--) {
				if (soundList[i].isPlaying) {}
			}
		}

	}



/****************************************************************************/
/**** INITIALIZE FUNCTION ***************************************************/
/****************************************************************************/
registerSoundAndEvent();

/****************************************************************************/
/**** PUBLIC FUNCTION *******************************************************/
/****************************************************************************/




	return {

		/**** Effect section */
		titleEffect: function() {
			var list = $('#title span:not(.empty)');
			var ANIMATION_TIME = 300;
			var ANIMATION_STEP = 150;
			var _colorPalete = getColorPalete(list.length);

			var mySequence = [];
			list.each(function(index, value){
				node = $(value);
				if (firstRunEffect == true) {
					var tr = node.css('transform');
					var values = tr.split('(')[1].split(')')[0].split(',');
					var q = decompose.apply(q, values);
					$.Velocity.hook(node, "translateX", q.translate.x + 'px'); 
					$.Velocity.hook(node, "translateY", q.translate.y + 'px'); 
					$.Velocity.hook(node, "rotateZ", q.rotation + 'deg'); 
				}
			 /* mySequence.push({
					e: node,
					p: {rotateY: ['360deg', 0], backgroundColor: _colorPalete[index].bg, color: _colorPalete[index].text, sequenceQueue: false, queue: false},
					o: {duration: ANIMATION_TIME}
				});*/

				node.velocity({rotateY: ['360deg', 0], backgroundColor: _colorPalete[index].bg, color: _colorPalete[index].color}, {duration: ANIMATION_TIME, delay: (index)*ANIMATION_STEP});        
			});

			firstRunEffect = false;
			/*
			$.Velocity.RunSequence(mySequence);*/
			window.setTimeout(function() {
				MediaController.titleEffect();
			}, (list.length)*(ANIMATION_TIME + ANIMATION_STEP)); 
		},
		playSound: function(name, forcePlay) {

			if (soundList[name]) {
				if (forcePlay) {
					soundList[name].stop();
				}
				soundList[name].play();
			}
		},
		stopAllAudio: function() {
			jQuery.each(soundList, function(index, sound) {
				sound.stop();
			});
			console.log('All audio stopped');
		},
		animateVolumeDown: function(timeout) {

		}

	};
})();