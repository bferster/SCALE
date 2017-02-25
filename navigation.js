///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NAVIGATION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Navigation {
	constructor() {
		this.left=this.top=this.wid=this.hgt=0;																		// Sizes
		}
	Forward() {
 		app.Draw();																									// Redraw
		}

	Back() {
		}

	Draw() {																									// REDRAW
		var i,ww,name;
		var w=$("#contentDiv").width()+16;																			// Content width
		var l=$("#contentDiv").offset().left;																		// Left
		var h=$(window).height()-$("#navDiv").height();																// Height
		$("#navDiv").css({top:h+"px",left:l+"px", width:w+"px"});													// Position at bottom
		var str="<div id='topicBar' class='wm-topicBar'></div>";													// Topic bar
		for (i=0;i<app.doc.topics.length;++i) {																		// For each topic 
			name=app.doc.FindLobById(app.doc.topics[i]).name;
			str+="<div id='topicDot-"+i+"' style='position:absolute'>";
			str+=`<div class='wm-topicDotLab'>${name}</div>`;
			str+="<div class='wm-topicDot'></div></div>";
			}
		for (i=0;i<app.doc.concepts.length;++i) {																	// For each concept 
			name=app.doc.FindLobById(app.doc.concepts[i]).name;
			str+=`<div id='conceptBar-${i}' class='wm-conceptBar'`;
			if (i == 0)									str+= " style='border-top-left-radius:16px;border-bottom-left-radius:16px'";
			else if (i == app.doc.concepts.length-1)	str+= " style='border-top-right-radius:16px;border-bottom-right-radius:16px'";
			str+=`<>${name}</div>`;
			}

		$("#navDiv").html(str);																						// Add content	

		l=-92;																										// Start left
		ww=(w-36)/(app.doc.topics.length-1);																			// Width between topic dots
		for (i=0;i<app.doc.topics.length;++i) {																		// For each topic 
			$("#topicDot-"+i).css({top:"-9px",left:l+"px"});														// Position dot
			l+=ww;
			}
		l=16;																										// Start left
		ww=(w-32)/(app.doc.concepts.length);																		// Width between topic dots
		for (i=0;i<app.doc.concepts.length;++i) {																	// For each concept 
			trace(ww)
			$("#conceptBar-"+i).css({top:"px",left:l+"px",width:ww-4+"px"});											// Position concept bar
			l+=ww;
			}
		}


}