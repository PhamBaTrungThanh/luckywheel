/*****************************************************************/
/***********************  SPIN CONTROL  **************************/
/*****************************************************************/

var SpinController = (function($) {
/*****************************************************************/
/* PRIVATE VARIABLES *********************************************/
/*****************************************************************/
	var
	$spinner           = $('#spinner'),
	$result            = $('#result'),
	$stopContent       = $('#stop-content'),
	$wheel             = $('#wheel'),
	$resultTitle       = $('#result-title'),
	$resultText        = $('#result-text'),
	$btnContinue       = $('#continue'),
	$memesContainer    = $('#memes'),
	spinTime           = 800,
	breakCountPerCycle = 3,
	firstTimeInit      = true,
	currentType        = '',
	wheelData          = Config.getWheel(),
	memes              = Config.getMemes();

/*****************************************************************/
/* PRIVATE METHODS ***********************************************/
/*****************************************************************/
	var	
	// 
	setPlace = function() {
		var parentHeight = $spinner.parent().outerHeight();
		var parentWidth  = $spinner.parent().outerWidth();
		var myHeight     = $spinner.outerHeight();
		$spinner.css({
			right: -myHeight*1/3 + 'px',
			top: -(myHeight - parentHeight)/2 + 'px'
		});	

	},
	setSize = function() {
		var WIDTH = $(document).width();
		if (WIDTH < 1280) {
			var ratio = WIDTH/1280
			// Set radius of the wheel
			var r = ratio * 986;
			$wheel.prop('width', r).prop('height', r);
			//Set size of result pannel
			$result.css({
				width: ratio * 562,
				height: ratio * 750,
				paddingTop: ratio * 60,
				paddingRight: ratio * 113,
				paddingBottom: ratio * 98,
				paddingLeft: ratio * 104
			});
			$resultTitle.parent().css({
				borderRadius: ratio * 38
			});
			$btnContinue.css({
				backgroundSize: ratio * 159 + 'px auto',
				borderRadius: ratio * 38
			});

		}
	},
	animate = function() {
		var queue = [
			{e: $spinner, p: 'transition.fadeIn', o: {duration: 500}},
			{e: $wheel, p: {rotateZ: [360, 0]}, o: {duration: spinTime + 400, easing: 'easeInSine'}},
			{e: $wheel, p: {rotateZ: [360, 0]}, o: {duration: spinTime, easing: 'linear', loop: true, delay: 0, begin: function() {
				$stopContent.removeClass('disable');	
				//$result.velocity('transition.perspectiveLeftIn');
				$result.velocity('transition.fadeIn');
			}}}
		];
		$.Velocity.RunSequence(queue);
	},
	stopWheel = function() {

		$stopContent.addClass('activating');
		$wheel.velocity('stop');

		var currentDeg      = parseInt($.Velocity.hook($wheel, "rotateZ"));
		var randomDeg       = $.fn.randBetween(180, 360, false);

		console.log('currentDeg: ', currentDeg);

		/*
		var queue     = [];
		var totalTime = 0;
		var _easing   = 'linear';
		for (var i = 1; i <= (loops * breakCountPerCycle); i++) {
			totalTime += spinTime + (i-1)*spinTime/breakCountPerCycle;
			console.log('time: ', totalTime);
			if (totalTime + spinTime + (i)*spinTime/breakCountPerCycle >= destinationTime) {
				_easing = 'easeOutSine';
			}
			var n = {e: $wheel, p: {rotateZ: [currentDeg + i*360/breakCountPerCycle, currentDeg + (i-1)*360/breakCountPerCycle]}, o: {duration: spinTime + (i-1)*spinTime/breakCountPerCycle, easing: _easing,
				progress: function(elements) {
					populateResult($.Velocity.hook(elements, "rotateZ"));
				}}}
			queue.push(n);
			if (totalTime + spinTime + (i)*spinTime/breakCountPerCycle >= destinationTime) {
				break;
			}
		}
		//queue.push({e: $wheel, p: {rotateZ: [destinationDeg + (loops)*360, currentDeg + (loops)*360]}, o: {duration: spinTime*(loops), easing: 'EaseOutSine'}})
		$.Velocity.RunSequence(queue);
		var stopper = window.setTimeout(function(){
			$wheel.velocity('stop');
			console.log('Wheel stopped');
		}, destinationTime);
		*/
		$wheel.velocity({rotateZ: [currentDeg + randomDeg, currentDeg]}, {duration: spinTime*5, easing:'easeOutCubic'
			, progress: function(elements) {
			populateResult($.Velocity.hook(elements, "rotateZ"));
		},    complete: function() {
			redirecting();
		}});
	},
	readWheel = function(angle){

		angle = (angle <= 360) ? angle : angle - Math.trunc(angle/360)*360;
		//read from the data
		//the css angle and the data angle are opposite, so we have to backward the angle
		angle = (angle == 0) ? 360 : 360 - angle;
		var index = 0;
		for (var i = wheelData.length - 1; i >= 0; i--) {
			for (var j = wheelData[i].directions.length - 1; j >= 0; j--) {
				if (( wheelData[i].directions[j].from < angle ) && (angle <= wheelData[i].directions[j].to)) {
					index = i;
					break;
				}
			}
		}

		return wheelData[index];
	},
	populateResult = function(currentDeg) {

		currentDeg   = parseFloat(currentDeg).toFixed(2);		
		var _current = readWheel(currentDeg);
		$resultTitle.parent().css({backgroundColor: _current.color.path});
		$resultTitle.parent().css({background: 'linear-gradient(to bottom right, '+_current.color.glow+', '+_current.color.path+')'});
		$resultTitle.text(_current.result.title);
		$resultText.text(_current.type);

		currentType = _current.type;
		
	},
	redirecting = function() {
		console.log('animation finished, redirecting');
		showMeme(currentType);
		$btnContinue.addClass('clickable');
	}, 
	route = function() {
		if ($btnContinue.hasClass('clickable')) {
			switch (currentType) {
				case 'sorry':
					console.log('`sorry` type');
					reset();
					$('#wheelModal').closeModal();
					break;
				case 'prize':
					console.log('`prize` type');
					reset();
					$('#wheelModal').closeModal();
					GameController.showAnswerModal();
					break;
				case 'bingo':
					console.log('`bingo` type');
					reset();
					$('#wheelModal').closeModal();
					GameController.makeLuckyFlip();
					break;		
			}
		}	
	},
	showMeme = function(type) {
		if (memes[type]) {
			if (memes[type].length > 1) {
				memeIndex = $.fn.randBetween(0, memes[type].length);
			} else {
				memeIndex = 0;
			}
			var img = $('<img />').attr('src', memes[type][memeIndex].src);
			$memesContainer.append(img);
			if (memes[type][memeIndex].mirror == true) {
				var mirror_img =  $('<img />').attr('src', memes[type][memeIndex].src).addClass('mirror')
				$memesContainer.append(mirror_img);
			}
			var _height = 50 - memes[type][memeIndex].height;
			console.log(_height);
			$memesContainer.velocity({bottom: [0, _height], opacity: [1, 0]}, {duration: 800, display: 'block', easing: 'easeInOutElastic'}).velocity("reverse", { duration: 800, delay: 1600, display: 'none'});
		}
	},
	ready = function() {
		if (firstTimeInit) {
			setPlace();
			firstTimeInit = false;
		}
		
		animate();
	},
	reset = function() {
		animationFinished = false;
		$result.css('opacity', 0);
		$wheel.css({transform: 'rotateZ(0deg)'});
		$stopContent.removeClass().addClass('disable');
		$spinner.css('opacity', 0);
		$resultTitle.parent().css({background: '#ffffff'});
		$resultTitle.text('');
		$resultText.text('');
		$btnContinue.removeClass('clickable');
		$memesContainer.velocity('stop').css('display', 'none').html('');

		 if (GameController.isComplete()) {
		 	$('.modal-trigger.wheel').addClass('hide');
		 }

	};
/*****************************************************************/
/* INITIALIZE ****************************************************/
/*****************************************************************/
	(function(){
		setSize();
		$stopContent.children().on('click', function(event) {
			if ($stopContent.hasClass('disable') || $stopContent.hasClass('activating')) {
				console.log('Button still disable');
			} else {
				console.log('Stop button fired');
				stopWheel();
			}
			return false;
		});
		$btnContinue.on('click', function() {
			route();
		});
		$.key("enter", function(event) {
			event.preventDefault();
			console.log('Fired stop event by enter');
			$stopContent.children().click();
			return false;
		});

		$('.modal-trigger.wheel').leanModal({
			dismissible: false, // Modal can be dismissed by clicking outside of the modal
			opacity: 0.6,
			ready: function() {
				ready();
			},
		});
	})();

/*****************************************************************/
/* PUBLIC METHODS ************************************************/
/*****************************************************************/
	return {

		reset: function() {
			reset();
		}
	}
})(jQuery);
