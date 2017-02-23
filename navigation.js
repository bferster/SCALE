///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NAVIGATION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Navigation {
	constructor() {
		this.left=this.top=this.wid=this.hgt=0;																		// Sizes
		}
	Forward() {
  		if (app.cp < app.ps.pages.length-1)				app.cp++;													// Next page
		else if (app.cs < app.pc.steps.length-1)		app.cs++;													// Next step
		else if (app.cc < app.pt.concepts.length-1)		app.cc++;													// Next concept
		else if (app.ct < app.pl.topics.length-1)		app.ct++;													// Next topic
		else if (app.cl < app.doc.lessons.length-1 )	app.cl++;													// Next lesson
		else 											app.cs=0;
		app.Draw();																									// Redraw
		}

	Back() {
	}
	Draw() {																									// REDRAW
		var i;
		var w=$("#contentDiv").width()+16;																			// Content width
		var l=$("#contentDiv").offset().left;																		// Left
		var h=$(window).height()-$("#navDiv").height()-16;															// Height
		$("#navDiv").css({top:h+"px",left:l+"px", width:w+"px"});													// Position at bottom
		var str="<div id='topicBar' class='wm-topicBar'></div>";													// Topic bar
		for (i=0;i<app.pl.topics.length;++i)																		// For each topic 
			str+="<div id='topicDot-"+i+"' class='wm-topicDot'></div>";												// Add dot
		$("#navDiv").html(str);																						// Add content	
		l=8;																										// Start left
		w=(w-32)/(app.pl.topics.length-1);																			// Width between topic dots
		for (i=0;i<app.pl.topics.length;++i) {																	// For each topic 
			$("#topicDot-"+i).css({top:"10px",left:l+"px"});														// Position dot
			l+=w;
		}

	}
}