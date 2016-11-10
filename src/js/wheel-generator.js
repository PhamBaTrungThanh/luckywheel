/* globals Config, fabric */
function renderWheel(wheel) {
	var
	start_x      = 500,
	start_y      = 300,
	outer_length = 500,
	inner_length = 130,
	radius       = 0,
    degree       = 0,
	old_top      = 0,
	old_left     = 0,
	canvas       = this.__canvas = new fabric.StaticCanvas('c', {backgroundColor: 'transparent'}),
	buffer       = 0,
	stroke_width = 6,
	text_lib     = [];


	//begin calculation
	for (var i = 0; i < wheel.length; i++) {
		const text = wheel[i].text.charAt(0).toUpperCase() + wheel[i].text.slice(1);
		text_lib.push(text);
	}
	degree = radius = 360 / text_lib.length;
	radius = radius*Math.PI/180;
	var d = '';
	d += 'M' + (start_x - Math.cos(radius/2)*inner_length) +',' + (start_y + Math.sin(radius/2)*inner_length) + ' ';
	d += 'L' + (start_x - Math.cos(radius/2)*outer_length) + ',' + (start_y + Math.sin(radius/2)*outer_length) + ' ';
	d += 'A' + outer_length + ',' + outer_length + ' 0 0,1 ' + (start_x - Math.cos(radius/2)*outer_length) + ',' + (start_y - Math.sin(radius/2)*outer_length) + ' ';
	d += 'L' + (start_x - Math.cos(radius/2)*inner_length) + ',' + (start_y - Math.sin(radius/2)*inner_length) + ' ';
	d += 'A' + inner_length + ',' + inner_length + ' 1 0,0 ' +  (start_x - Math.cos(radius/2)*inner_length) +',' + (start_y + Math.sin(radius/2)*inner_length);



	var outer_circle = new fabric.Circle({
		originX: 'center',
		originY: 'center',
		fill: '#01579b',
		stroke: '#03a9f4',
		strokeWidth: stroke_width,
		radius: outer_length + buffer,
		left: outer_length + buffer + stroke_width/2,
		top: outer_length + buffer + stroke_width/2
 });
	var inner_shape = new fabric.Circle({
		originX: 'center',
		originY: 'center',
		fill: 'white',
		radius: inner_length + 60,
		top: outer_length + 40 + stroke_width/2,
		left: outer_length + stroke_width/2
 });
	var group_all = new fabric.Group([], {
		top: 0,
		left: 0,
		hasBorders: false,
 });
	var group_all_text = new fabric.Group([], {
		top: 0,
		left: 0,
		hasBorders: false,
 });
	var animated = new fabric.Group([], {
		top: 0,
		left: 0,
		centeredRotation: true,
		originX: 'center',
		originY: 'top',
		hasBorders: false,
 });
 	var noAnimated = new fabric.Group([], {
		top: 0,
		left: 0,
		centeredRotation: true,
		originX: 'center',
		originY: 'center',
		hasBorders: false,
 });
	//group_all.addWithUpdate(outer_circle);
	//group_all.add(inner_shape);
	for (var i = 0; i <= text_lib.length - 1; i++) {

		var path = new fabric.Path(d, {
			originX: 'center',
			originY: 'center',
			fill: wheel[i].color.path
	 });  // For color and size

		var glower = new fabric.Path(d, { // For inner glow
			scaleX: 0.88,
			scaleY: 0.7,
			originX: 'center',
			originY: 'center',
			strokeWidth: 5,
			fill: wheel[i].color.path,
	 });
		glower.setShadow({
			color: wheel[i].color.glow,
			offsetX: 0,
			offsetY: 0,
			blur: 50
	 });
		var base = new fabric.Path(d, { // For inner glow
			scaleX: 0.98,
			scaleY: 0.96,
			originX: 'center',
			originY: 'center',
			fill: 'transparent',
			stroke: wheel[i].color.glow,
			strokeWidth: stroke_width	
	 });
		var dot = new fabric.Circle({
			radius: 10,
			fill: 'white',
			originX: 'left',
			originY: 'center',
			left: 100,
			shadow: 'rgba(255,255,255,0.5) 0 0 5px',
	 });

		var text_holder = new fabric.Rect({
			width: path.getWidth(),
			height: path.getHeight(),
			fill: 'transparent',
			originX: 'center',
			originY: 'center',
			hasBorders: false,
			strokeWidth: 0,
			stroke: 'transparent',
			selectable: false,
	 });
	 text_holder.hasBorders = false;

		var text = new fabric.Text(text_lib[i], {
		  fontSize: 60,
		  originX: 'center',
		  originY: 'center',
		  left: -40,
		  top: 5,
		  fontFamily: 'Roboto',
		  fill: 'white',
		  shadow: 'rgba(0,0,0,0.5) 0 0 5px',
		  hasBorders: false,
		  selectable: false,
	 });

		var group_text = new fabric.Group([text_holder, text, dot], {	
	 });
		var group = new fabric.Group([path, base, glower], {
			hasBorders: false,
	 });

		if (old_top === 0) {
			old_top = outer_length + path.height/2 - stroke_width;
			old_left = 0;
	 }

		var 
		height   = group.getHeight(),
		new_top  = old_top  = old_top  - Math.cos(radius*i) * height,
		new_left = old_left = old_left + Math.sin(radius*i) * height;
		group_text.set({
			top: new_top,
			left: new_left,
			selection: false,
			angle: i*degree
	 });
		group.set({
			top: new_top,
			left: new_left,
			selection: false,
			angle: i*degree
	 });


		/// addWithUpdateING BID DOT outside

		var big_dot = new fabric.Circle({
			radius: 10,
			fill: 'white',
			shadow: 'rgba(255,255,255,0.5) 0 0 15px',
			originX: 'left',
			originY: 'center',
			left: (outer_length - buffer)/-2 + buffer/4,
			top: 0
	 });
		//group.addWithUpdate(big_dot);
		group_all.addWithUpdate(group);
		group_all_text.add(group_text);
 }
	animated.addWithUpdate(group_all);
	animated.addWithUpdate(group_all_text);
	//animated.setAngle(90);
	//console.log(d);

	

	const ani_width = animated.width;
	const ani_height = animated.height;
	const ani_top  = -(ani_height - ani_width)/2;
	const ani_left = ani_width/2;
	animated.set({top: ani_top, left: ani_left});
	canvas.setWidth(ani_width);
	canvas.setHeight(ani_width);

	ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.add(animated);
	animated.centerH();
	console.log(ani_width, ani_height);
	console.log(animated);

	var img = canvas.toDataURL("image/png");
	return img;
}
