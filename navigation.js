///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NAVIGATION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Navigation {
	
	constructor() {																								// CONSTRUCTOR
		this.left=this.top=this.wid=this.hgt=0;																		// Sizes
		$("#lessonBut").on("click",()=> { this.ChangeLesson() } );													// Click on lesson button
		}
	
	ChangeLesson() 																							// CLICK ON CHANGE LESSON BUTTON
	{	
		var i;
		var o=app.doc.lobs[0].children;																				// Point at children of root (lessons)
		if ($("#menuSlotDiv").length) {																				// If already open
			$("#menuSlotDiv").remove();																				// Close it																
			return;																									// Quit
			}
		var str="<div class='wm-pullDown' id='menuSlotDiv'>";														// Add menu div
		for (i=0;i<o.length;++i) {																					// For each lesson
			str+="<div class='wm-pullDownItem' onclick='$(\"#menuSlotDiv\").remove()'><span";						// Add header
			if (app.doc.FindLobById(o[i]).status > 9)	str+=" style='color:#08aa08'";								// Green if done
			str+=">"+app.doc.FindLobById(o[i]).name;																// Add name
			if (app.doc.FindLobById(o[i]).status > 9)	str+=" &#10003;";											// Add check if done
			str+="</span></div>";															
			}		
		str+="<div class='wm-pullDownItem' onclick='$(\"#menuSlotDiv\").remove()'>Week 2 &#10003;</div>";
		str+="<div class='wm-pullDownItem' onclick='$(\"#menuSlotDiv\").remove()'>Week 3 &#10003;</div>";
		str+="<div class='wm-pullDownItem' onclick='$(\"#menuSlotDiv\").remove()'>Week 4</div>";
		str+="<div class='wm-pullDownItem' onclick='$(\"#menuSlotDiv\").remove()'>Week 5</div>";
		str+="<div class='wm-pullDownItem' onclick='$(\"#menuSlotDiv\").remove()'>Week 6</div>";
		str+="<div class='wm-pullDownItem' onclick='$(\"#menuSlotDiv\").remove()'>Week 7</div>";
		str+="<div class='wm-pullDownItem' onclick='$(\"#menuSlotDiv\").remove()'>Week 8</div>";
		$("body").append(str);																						// Add menu to body
		var x=$("#lessonTitle").offset().left-8+"px";																// Left
		var y=$("#contentDiv").offset().top-20+"px";																// Top
		var w=$("#lessonTitle").width()+26+"px";																	// Width
		$("#menuSlotDiv").css( {left:x,top:y, "min-width":w} );														// Position
		}
	
	Forward() 
	{	
		app.Draw();																									// Redraw
	}

	Back() 
	{	
	}

	Draw() 																										// REDRAW
	{
		var str="";
		var i,j,id,ww,name,children;
		var w=$("#navDiv").width()+16;																				// Content width
		var l=$("#navDiv").offset().left;																			// Left
		this.UpdateHeader();																						// Update header																						
		$("#menuSlotDiv").remove();																					// Close lesson picker															
	
		if (app.doc.curLesson != -1) {																				// If a lesson active
			str+="<div id='topicBar' class='wm-topicBar'></div>";													// Topic bar
			children=app.doc.lobs[app.doc.curLesson].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				name=app.doc.FindLobById(children[i]).name;															// Get topic name
				j=app.doc.FindLobIndexById(children[i]);															// Get topic index
				str+="<div id='topicDot-"+i+"' class='wm-topicDotDiv'><div  id='topicDotLab-"+i+"'class='wm-topicDotLab'";	// Add dot container
				if ((app.doc.curLobId == children[i]) || (j == app.doc.curTopic)) str+=" style='color:#c57117'";	// Highlight if current						
				str+=`>${name}</div>`;																				// Add label
				str+="<div id='topicDotDot-"+i+"' class='wm-topicDot'></div></div>";								// Add dot
				}
			}
		
		if (app.doc.curTopic != -1) {																				// If a topic active
			children=app.doc.lobs[app.doc.curTopic].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				name=app.doc.FindLobById(children[i]).name;															// Get concept name
				j=app.doc.FindLobIndexById(children[i]);															// Get concept index
				str+=`<div id='conceptBar-${i}' class='wm-conceptBar' style='`;
				if (i == 0)						 str+="border-top-left-radius:16px;border-bottom-left-radius:16px";	// Round left side
				else if (i == children.length-1) str+="border-top-right-radius:16px;border-bottom-right-radius:16px";	// Round right
				id=app.doc.lobs[app.doc.curTopic].children[i];														// Get topic id
				if ((app.doc.curLobId == children[i]) || (j == app.doc.curConcept))									// If current Topic
				 	str+=";color:#c57117;font-weight:bold";															// Show current place
				if (app.doc.FindLobById(id).status == DONE)															// If done
					str+=";color:#007700";																			// Show done color
				str+=`'>${name}</div>`;
				}
			}
		if (app.doc.curConcept != -1) {																				// If a step active
			str+="<div id='stepBarDiv' class='wm-stepBar'>";														// Stepvbar div
			children=app.doc.lobs[app.doc.curConcept].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				name=app.doc.FindLobById(children[i]).name;															// Get concept name
				str+=`<span id='stepBar-${i}' class='wm-stepBarItem' style='`;										// Use ES6 templates!
				id=app.doc.lobs[app.doc.curConcept].children[i];													// Get concept id
				if (app.doc.FindLobById(id).status == DONE)															// If done
					str+=";color:#007700";																			// Show done color
				if (app.doc.curLobId == children[i]) 																// If current Topic
				 	str+=";color:#c57117;font-weight:bold";															// Show current place
				str+=`'>${name}</span>`;
				if (i != children.length-1)
					str+="<span style='color:#999'>|</span>"
				}	
			}

		$("#navDiv").html(str);																						// Add content	

		if (app.doc.curLesson != -1) {																				// If a lesson active
			l=-92;																									// Start left
			children=app.doc.lobs[app.doc.curLesson].children;														// Get topics
			ww=(w-48)/(children.length-1);																			// Width between topic dots
			for (i=0;i<children.length;++i) {																		// For each topic 
					$("#topicDot-"+i).on("click",function(e) {														// ON TOPIC CLICK
						var id=e.currentTarget.id.substr(9);														// Extract id
						id=app.doc.lobs[app.doc.curLesson].children[id];											// Get topic id
						app.Draw(app.doc.FindLobIndexById(id));														// Set new index and redraw
						Sound("click");																				// Click
						});
					$("#topicDot-"+i).css({ left:l+"px"} );															// Position dot
					var id=app.doc.lobs[app.doc.curLesson].children[i];												// Get topic is
					if (app.doc.FindLobById(id).status == DONE)	{													// If done
//						$("#topicDotDot-"+i).css({"background-color":"#009900"});									// Done status
						$("#topicDotLab-"+i).css({color:"#066600"});												// Done status
						}
					l+=ww;																							// Next pos
					}
			}

		if (app.doc.curTopic != -1) {																				// If a topic active
			l=14;																									// Start left
			children=app.doc.lobs[app.doc.curTopic].children;														// Get 
			ww=(w-40)/children.length;																				// Width between topic dots
			for (i=0;i<children.length;++i) {																		// For each topic 
				for (i=0;i<children.length;++i) {																	// For each concept 
					$("#conceptBar-"+i).on("click",function(e) {													// ON CONCEPT CLICK
						var id=e.currentTarget.id.substr(11);														// Extract id
						id=app.doc.lobs[app.doc.curTopic].children[id];												// Get concept id
						app.Draw(app.doc.FindLobIndexById(id));														// Set new index and redraw
						Sound("click");																				// Click
						});
					$("#conceptBar-"+i).css({left:l+"px",width:ww-6+"px"});											// Position concept bar
					l+=ww;																							// Next pos
					}
				}
			}

		if (app.doc.curConcept != -1) {																				// If a step active
			l=56;																									// Start left
			children=app.doc.lobs[app.doc.curConcept].children;														// Get 
			ww=(w-120)/children.length;																				// Width between topic dots
			for (i=0;i<children.length;++i) {																		// For each topic 
				for (i=0;i<children.length;++i) {																	// For each concept 
					$("#stepBar-"+i).on("click",function(e) {														// ON STEP CLICK
						var id=e.currentTarget.id.substr(8);														// Extract id
						id=app.doc.lobs[app.doc.curConcept].children[id];											// Get step id
						app.Draw(app.doc.FindLobIndexById(id));														// Set new index and redraw
						Sound("click");																				// Click
						});
					l+=ww;																							// Next pos
					}
				}
			}
	}

	UpdateHeader() 																								// UPDATE HEADER																					
	{	
		$("#courseTitle").html(app.doc.lobs[0].name);																// Show course name
		if (app.doc.curLesson <= 0)																					// On splash page
			$("#lessonTitle").html("");																				// Hide lesson name
		else																										// Into course
			$("#lessonTitle").html(app.doc.lobs[app.doc.curLesson].name);											// Show lesson name
		$("#userName").html(app.doc.firstName+"&nbsp;"+app.doc.lastName);											// Show user
	}

}