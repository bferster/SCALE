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

		var i,ww,name,children,curConPos=0;
		var w=$("#contentDiv").width()+16;																			// Content width
		var l=$("#contentDiv").offset().left;																		// Left
		var h=$(window).height()-$("#navDiv").height();																// Height
		$("#navDiv").css({top:h+"px",left:l+"px", width:w+"px"});													// Position at bottom
		var str="<div id='topicBar' class='wm-topicBar'></div>";													// Topic bar
		
		var curPos=app.doc.curMapPos
		var curLob=app.doc.map[curPos].id;
		var parPos=app.doc.map[curPos].parent;
		var parLev=app.doc.map[parPos].level;

		if (app.doc.curLesson) {																					// If a lesson active
			while (parLev > LESSON) {																				// While parent is not lesson
				curLob=app.doc.map[parPos].id;																		// Use parent
				parPos=app.doc.map[parPos].parent;																	// New parent
				parLev=app.doc.map[parPos].level;																	// Get level
				}	
				
			children=app.doc.map[app.doc.curLesson].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				name=app.doc.FindLobById(children[i]).name;															// Get topic name
				str+="<div id='topicDot-"+i+"' style='position:absolute";											// Add dot container
				str+=`'><div class='wm-topicDotLab'`;																// Label div
				if (curLob == children[i]) 	str+=" style='color:#006600'";											// Highlight if current						
				str+=`>${name}</div>`;																				// Add label
				str+="<div class='wm-topicDot'></div></div>";														// Add dot
				}
			}
		
		if (app.doc.curTopic) {																						// If a topic active
			curLob=app.doc.map[curPos].id;
			parPos=app.doc.map[curPos].parent;
			parLev=app.doc.map[parPos].level;
			while (parLev > TOPIC) {																				// While parent is not topic
				curLob=app.doc.map[parPos].id;																		// Use parent
				parPos=app.doc.map[parPos].parent;																	// New parent
				parLev=app.doc.map[parPos].level;																	// Get level
				}	
			children=app.doc.map[app.doc.curTopic].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				name=app.doc.FindLobById(children[i]).name;															// Get concept name
				str+=`<div id='conceptBar-${i}' class='wm-conceptBar' style='`;
				if (i == 0)						 str+="border-top-left-radius:16px;border-bottom-left-radius:16px";	// Round left side
				else if (i == children.length-1) str+="border-top-right-radius:16px;border-bottom-right-radius:16px";	// Round right
				if (curLob == children[i]) {																		// If current Topic
					 str+=";color:#006600;font-weight:bold";														// Highlight					
					 curConPos=i;																					// Save position
					}
				str+=`'>${name}</div>`;
				}
			}

		if (app.doc.curStep) 																						// If a step active
			str+="<div id='stepLab' class='wm-stepLab'></div>";														// Step label
		
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
					$("#conceptBar-"+i).css({top:"36px",left:l+"px",width:ww-6+"px"});								// Position concept bar
					l+=ww;
					}
				}
			}

		if (app.doc.curStep) {																						// If a step active
			l=16+(curConPos*ww);																					// To start of concept bar
			name=app.doc.FindLobById(app.doc.curLobId).name;														// Get step name
			$("#stepLab").html(name.charAt(0).toUpperCase()+name.substr(1));										// Show it
			$("#stepLab").css({top:"60px",left:l+"px",width:ww-4+"px"});											// Position step label
			}	
		}

}