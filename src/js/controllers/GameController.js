/*****************************************************************/
/*************************  CONFIGURE  ***************************/
/*****************************************************************/

var GameController = (function() {

/*****************************************************************/
/* PRIVATE VARIABLES *********************************************/
/*****************************************************************/
	var 
		list                  = Config.getQuestions(),
		questionIndex         = 0;
		$question             = $('#question-container'),
		$answerBox            = $('#boxes-container'),
		$selectWrapper        = $('#selectWrapper'),
		$selectModal          = $('#selectQuestion'),
		$answerModal          = $('#answerLetter'),
		$answerer             = $('#pickLetter'),
		$btnConfirm           = $('.btn.confirm'),
		$questionBg           = $('#question-bg'),
		maxBoxPerLine         = 11,
		curtainEffectDuration = 600,
		luckyFlip             = false,
		isSelectQuestionOpen  = false,
		remaningLetters       = 0;

/*****************************************************************/
/* PRIVATE METHODS ***********************************************/
/*****************************************************************/

	var 
	makeBoxes = function (text) {
		
		var _string  = text.split(' ');
		var _length  = _string.length; //How many word
		var _answers = [];
		var _stop    = false; //Our stopper
		var _index   = 0;
		var _current = '';
	    $answerBox.html(''); // Reset the box holder

	    while (_stop == false) {
	    	_current = _current.trim();
	    	if (_index < _length) {
		    	if ((_current.length + _string[_index].length + 1) > maxBoxPerLine) {
		    		_answers.push(_current.trim());
		    		_current = '';
		    		
		    	} else {
		    		_current += ' ' + _string[_index]; 
		    		_index++;
		    		
		    	}
	    	}

	    	if (_index == _length) {
	    		_stop = true;
	    		_answers.push(_current.trim());
	    	}
	    }
	    
		$(_answers).each(function(index, answer) {
			var p = $("<p></p>")
		    for (var i = 0; i < answer.length; i++) {

		      var _class = (answer[i] == " ") ? 'space box hover-off' : 'box';
		      if ( (typeof answer[i+1] === 'ftp://ftp.') || (typeof answer[i-1] === 'ftp://ftp.')) {
		        /* do nothing */
		      } else {
		        if (answer[i+1] == " ") {
		          _class += " before";
		        }
		        if (answer[i-1] == " ") {
		          _class += " after";
		        }
		      }
		      var t = (answer[i] == " ") ? "" : answer[i];
		      var span = $("<span></span>")
			            .addClass(_class)
			            .attr('data-answer', answer[i].toUpperCase())
			            .attr('data-flipped', 'false')
			            .text(t)
		      if (answer[i] != ' ') {
		        span.on('click', function(target) {
		        	
					flipBox($(this), 0, true);
		        });
		      }
		      p.append(span);
		    }
		    $answerBox.append(p);
		});
	},
	setQuestion = function(text) {
		$question.text(text);
	},
	isQuestionComplete = function(number) {
		if ((typeof number) !== 'number') {
			number = 1;
		}
		remaningLetters -= number;
		if (remaningLetters == 0) {
			list[questionIndex].isComplete = true;
			list[questionIndex].isActive = false;
		}
		console.log('remaining letter: ', remaningLetters);
	}
	flipAllBox = function() {
		var _list = $('span.box[data-flipped=false]:not(.space)');
		_list.each(function(index, node) {
			flipBox($(node), index);
		});
		console.log('flip all ' + _list.length + ' remaining box');
		isQuestionComplete(_list.length);
	},
	flipBox = function(target, queueIndex, isClicked) {

		var box = target;
		if (isClicked == true) {
			if (luckyFlip == true) {
				luckyFlip = false;
				isQuestionComplete();		
			} else {
				return false;
			}		
		}


		if ((typeof box) === 'object') {
			if (box.attr('data-flipped') == 'false') {
				box.attr('data-flipped', 'true')
					.addClass('hover-off')
					//.velocity({rotateY: ['360deg', 0]}, {easing: 'linear', duration: 600, loop: (queueIndex), delay: queueIndex*100})
					.velocity({rotateY: [180, 0]}, {easing: 'linear', duration: 600})
					.velocity({rotateY: [360, 180], backgroundColor: '#000000'}, {duration: 1000, begin: function() {
					window.setTimeout(function() {
						MediaController.playSound('ding', true);
					}, 500);
				}});
			}   
		}
	},
	selectQuestion = function() {
		if (isSelectQuestionOpen == false) {
			isSelectQuestionOpen = true;
			var $wrapper = $('<div></div>').addClass('collection');
			$(list).each(function(index, value) {
				var _class  = 'collection-item';
					_class += (value.isActive == true) ? ' active' : '';
				var _text   = 'Question ' + (index+1)
					_text  += (value.isComplete == true) ? '<span class="badge">Complete</span>' : '';
				var $option = $('<a></a>');
					$option.attr('href', "#!");
					$option.html(_text);
					$option.addClass(_class);
				if (value.isComplete == false && value.isActive == false) {
					$option.on('click', function() {
						newGame(index);
						$selectModal.closeModal();
						openCurtain();
					})
				}	
				$wrapper.append($option);
			});
			

			$selectWrapper.html('').append($wrapper);
			closeCurtain(function() {
				$selectModal.openModal({dismissible: false});
			});
			
		}


	},
	registerInputHandler = function() {
	    $answerer.on('input change', function() {
	      
	      var t = $(this).val().toUpperCase().charCodeAt(0);
	      if ((65 <= t) && (t<=90)) {
	      	$(this).val($(this).val().toUpperCase());
	        $btnConfirm.removeClass('disabled');
	        return true;
	      } else {
	        $(this).val('').focus();
	      }
	    });
	},
	registerConfirmHandler = function() {
		$btnConfirm.click(function() {
			if (!$btnConfirm.hasClass('disabled') && $answerer.val() != '') {
				myAnswerIs($answerer.val());
			}
		});		
	},
	registerFlipAllHandle = function() {
		swal({
			title: "Warning",
			text: "Do you want to flip all the box?",
			type: "warning",
			showCancelButton: true,
			closeOnConfirm: true
		}, function() {
			flipAllBox();
		});
	}
	prepareToAnswer = function() {
		$answerer.val('').focus();

	},
	myAnswerIs = function(letter) {
		MediaController.stopAllAudio();
		var _list = $('span.box[data-answer=' + letter + ']');
		console.log(_list);
		$answerModal.closeModal();
		if (_list.length > 0) {
			for (var i = _list.length - 1; i >= 0; i--) {
				flipBox($(_list[i]));
			}
			isQuestionComplete(_list.length);
		}

	},
	setQuestionBackground = function(index) {
		src = 'images/question_background/' + (index+1) + '.jpg'
		$questionBg.attr({src: src, width: 640, height: 258});
		return true;
	},
	setPageBackground = function(index) {
		src = 'url(images/page_background/' + (index+1) + '.jpg)';
		$('#frontscene').css('background-image', src);

		return true;

	},
	closeCurtain = function(promise) {
		$('#qna').hide();
		$('#curtains').show();
		$('#curtainLeft').velocity({left: [0, '-50%']}, {duration: curtainEffectDuration});
		$('#curtainRight').velocity({right: [0, '-50%']}, {duration: curtainEffectDuration, 
			complete: function() {
				if (promise) {
					promise();
				}
				
			}});
	},
	openCurtain = function() {
		$('#loading').addClass('la-animate');
		$('#curtainLeft').velocity({left: '-50%'}, {delay: curtainEffectDuration*2, duration: curtainEffectDuration,
			begin: function() {
				$('#loading').removeClass('la-animate');
			}, 
			complete: function() {
				$('#curtains').hide();
			}});
		$('#curtainRight').velocity({right: '-50%'}, {delay: curtainEffectDuration*2, duration: curtainEffectDuration});
		window.setTimeout(function() {
			$('#qna').velocity('transition.slideUpIn', {duration: 800, display: 'block'})
		}, curtainEffectDuration *2 + curtainEffectDuration/2)
	},	
	newGame = function(question) {
		var _index = ((typeof question) === "number") ? question : 0;

		for (var i = list.length - 1; i >= 0; i--) {
			list[i].isActive = false;
			if ((typeof question) !== "number") {
				if (list[i].question === question.question) {
					_index = i;
					_question = list[i];
				}				
			}
		}

		_question = list[_index];
		questionIndex = _index;
		makeBoxes(_question.answer);
		setQuestion(_question.question);
		setQuestionBackground(_index);
		setPageBackground(_index);
		console.log(_question);
		list[_index].isActive = true;
		remaningLetters = $('span.box:not(.space)').length;
		isSelectQuestionOpen = false;
		$('.modal-trigger.wheel').removeClass('hide');
	};


/*****************************************************************/
/* INITIALIZE ****************************************************/
/*****************************************************************/

	(function() {
		
		selectQuestion();
		//newGame(1);
		//openCurtain();
		// Register KeyEvent
		$.key('f8', function() {
			selectQuestion();
		});
		$.key('f9', function() {
			registerFlipAllHandle();
		})
		// Register User Event Handler
		registerInputHandler();
		registerConfirmHandler();


	})();


/*****************************************************************/
/* PUBLIC METHODS ************************************************/
/*****************************************************************/
	return {
		makeLuckyFlip: function() {
			luckyFlip = true;
		},
		showAnswerModal: function() {
			$answerModal.openModal({dismissible: false});
			prepareToAnswer();
		},
		isComplete: function() {
			return (remaningLetters == 0) ? true : false;
		}
	}
})();