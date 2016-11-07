(function(){
	if (window.chrome) {
		$('body').addClass('chrome');
	}
	jQuery.fn.randBetween = function(min, max, notrounded) {
	  var t = Math.random() * (max - min) + min;
	  if (notrounded == true) {
	    return t;
	  } else {
	    return Math.round(t);
	  }
	}

})();