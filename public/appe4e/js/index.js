$(function(){
	if($("#index").length!=0){
		$('#index').fullpage({
			navigation: true,
			navigationPosition: 'right',
			anchors: ['firstPage', 'secondPage', '3rdPage'],
			sectionsColor: ['#fff', '#FF441C', '#fff'],
			navigationColor:'#B3B3B3',
			css3: true,
			scrollingSpeed: 1700,
			easing: 'easeOutBack',
			resize : false,
			scrollOverflow: true,
			loopBottom:true
		});
	}

	if($("#register").length!=0){
		$("#register").fullpage({
			sectionsColor: ['#fff'],
			navigationColor:'#B3B3B3',
			css3: true,
			scrollingSpeed: 1700,
			easing: 'easeOutBack',
			resize : false,
			scrollOverflow: true,
			loopBottom:true
		});
	}

	if($("#success").length!=0){
		$("#success").fullpage({
			sectionsColor: ['#fff'],
			navigationColor:'#B3B3B3',
			css3: true,
			scrollingSpeed: 1700,
			easing: 'easeOutBack',
			resize : false,
			scrollOverflow: true,
			loopBottom:true
		});
	}

});