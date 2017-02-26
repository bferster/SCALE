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

		var i,ww,name,children;
		var w=$("#contentDiv").width()+16;																			// Content width
		var l=$("#contentDiv").offset().left;																		// Left
		var h=$(window).height()-$("#navDiv").height();																// Height
		$("#navDiv").css({top:h+"px",left:l+"px", width:w+"px"});													// Position at bottom
		var str="<div id='topicBar' class='wm-topicBar'></div>";													// Topic bar
		
		if (app.doc.curLesson) {																					// If a lesson active
			children=app.doc.map[app.doc.curLesson].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				name=app.doc.FindLobById(children[i]).name;															// Get topic name
				str+="<div id='topicDot-"+i+"' style='position:absolute";											// Add dot container
				str+=`'><div class='wm-topicDotLab'`;																// Label div
				if (app.doc.curLobId == children[i]) str+=" style='color:#009900'";									// Highlight if current						
				str+=`>${name}</div>`;																				// Add label
				str+="<div class='wm-topicDot'></div></div>";														// Add dot
				}
			}
		
		if (app.doc.curTopic) {																						// If a topic active
			children=app.doc.map[app.doc.curTopic].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				name=app.doc.FindLobById(children[i]).name;															// Get concept name
				str+=`<div id='conceptBar-${i}' class='wm-conceptBar'`;
				if (i == 0)							 str+= " style='border-top-left-radius:16px;border-bottom-left-radius:16px";
				else if (i == children.length-1)	 str+= " style='border-top-right-radius:16px;border-bottom-right-radius:16px";
				if (app.doc.curLobId == children[i]) str+=";color:#009900'";										// Highlight if current						
				str+=`'<>${name}</div>`;
				}
			}

		if (app.doc.curStep) 																						// If a step active
			str+="<div id='stepIndicator' class='wm-stepIndicator'></div>";											// Step triangle
		
		$("#navDiv").html(str);																						// Add content	

		if (app.doc.curLesson) {																					// If a lesson active
			l=-92;																									// Start left
			children=app.doc.map[app.doc.curLesson].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				ww=(w-36)/(children.length-1);																		// Width between topic dots
				for (i=0;i<children.length;++i) {																	// For each topic 
					$("#topicDot-"+i).css({top:"-9px",left:l+"px"});												// Position dot
					l+=ww;
					}
				}
			}

		if (app.doc.curTopic) {																						// If a topic active
			l=16;																									// Start left
			children=app.doc.map[app.doc.curTopic].children;														// Get 
			for (i=0;i<children.length;++i) {																		// For each topic 
				ww=(w-32)/(children.length);																		// Width between topic dots
				for (i=0;i<children.length;++i) {																	// For each concept 
					$("#conceptBar-"+i).css({top:"32px",left:l+"px",width:ww-4+"px"});								// Position concept bar
					l+=ww;
					}
				}
			}

		if (app.doc.curStep) {																						// If a step active
			l-=ww;																									// To start of concept bar
			$("#stepIndicator").css({top:"55px",left:l+"px"});														// Position step triangle
	trace(l)
			}	
		}

}