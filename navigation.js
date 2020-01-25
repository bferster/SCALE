///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NAVIGATION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Navigation {
	
	constructor() {																								// CONSTRUCTOR
		$("#lessonBut").on("click",()=> { this.ChangeLesson() } );													// Click on lesson button
		}
	
	ChangeLesson() 																								// CLICK ON CHANGE LESSON BUTTON
	{	
		var i,id;
		var o=app.doc.lobs[0].children;																				// Point at children of root (lessons)
		if ($("#menuSlotDiv").length) {																				// If already open
			$("#menuSlotDiv").remove();																				// Close it																
			return;																									// Quit
			}
		var str="<div class='wm-pullDown' id='menuSlotDiv'>";														// Add menu div
		for (i=0;i<o.length;++i) {																					// For each lesson
			id=app.doc.lobs[0].kids[i];																				// Point at id of start
			str+="<div class='wm-pullDownItem' id='lessonId-"+id+"'><span";											// Add header
			if (app.doc.FindLobById(o[i]).status >= app.doc.statusThreshold)	str+=" style='color:#08aa08'";		// Green if done
			str+=">"+app.doc.FindLobById(o[i]).name;																// Add name
			if (app.doc.FindLobById(o[i]).status >= app.doc.statusThreshold)	str+=" &#10003;";					// Add check if done
			str+="</span></div>";															
			}		
		$("body").append(str);																						// Add menu to body
		$("[id^=lessonId-]").on("click", function(e) {																// Lesson click handler
			var id=e.currentTarget.id.substr(9);																	// Extract id
			app.doc.curPos=id;																						// Go to start of lesson
			app.Draw();																								// Redraw
			Sound("click");																							// Click
			$("#menuSlotDiv").remove();																				// Close menu	
		});
		
		var x=$("#lessonTitle").offset().left-8+"px";																// Left
		var y=$("#contentDiv").offset().top-20+"px";																// Top
		var w=$("#lessonTitle").width()+26+"px";																	// Width
		$("#menuSlotDiv").css( {left:x,top:y, "min-width":w} );														// Position
		}
	
	Forward() 																									// FORWARD ONE STEP
	{	
		app.Draw();																									// Redraw
	}

	Back() 																										// BACK ONE STEP
	{	
		app.doc.NextLob(-1);																						// Back one
		app.Draw();																									// Redraw
	}

	Draw() 																										// REDRAW
	{
		var str="";
		var i,j,id,ww,name,children;
		var w=$("#navDiv").width()+16;																				// Content width
		var l=$("#navDiv").offset().left;																			// Left
		this.UpdateHeader();																						// Update header																						
		$("#menuSlotDiv").remove();																					// Close lesson picker															
		$("#navDiv").css("display","block");																		// Make sure it shows
		if (app.fullScreen || ($("#contentDiv").width() < 600)) {													// If full screeen or too small
			$("#navDiv").css("display","none");																		// Hide it
			return;																									// Quit
			}
		if (app.doc.curLesson != -1) {																				// If a lesson active
			str+="<div id='topicBar' class='wm-topicBar'></div>";													// Topic bar
			children=app.doc.lobs[app.doc.curLesson].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				name=app.doc.FindLobById(children[i]).name;															// Get topic name
				j=app.doc.FindLobIndexById(children[i]);															// Get topic index
				str+="<div id='topicDotLab-"+i+"'class='wm-topicDotLab'style='";									// Label container
				if ((app.doc.curLobId == children[i]) || (j == app.doc.curTopic)) str+="color:#c57117;";			// Highlight if current						
				if (w < 800)			name=ShortenString(name,18);												// If small, shorten label
				if (i%2 && (w < 800)) 	str+="margin-top:34px";														// Stagger if small width
				str+=`'>${name}</div>`;																				// Add label
				str+="<div id='topicDotDot-"+i+"' class='wm-topicDot'></div>";										// Add dot
				}
			}
		
		if (app.doc.curTopic != -1) {																				// If a topic active
			children=app.doc.lobs[app.doc.curTopic].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				name=app.doc.FindLobById(children[i]).name;															// Get concept name
				j=app.doc.FindLobIndexById(children[i]);															// Get concept index
				str+=`<div id='conceptBar-${i}' class='wm-conceptBar' style='`;
				if (w < 800)					 str+="top:60px;";													// Shift down
				if (i == 0)						 str+="border-top-left-radius:16px;border-bottom-left-radius:16px;"; // Round left side
				if (i == children.length-1) str+="border-top-right-radius:16px;border-bottom-right-radius:16px;";	// Round right
				id=app.doc.lobs[app.doc.curTopic].children[i];														// Get topic id
				if ((app.doc.curLobId == children[i]) || (j == app.doc.curConcept))									// If current Topic
				 	str+="color:#c57117;font-weight:bold;";															// Show current place
				if (app.doc.FindLobById(id).status >= app.doc.statusThreshold)										// If done
					str+="color:#007700";																			// Show done color
				str+=`'>${name}</div>`;
				}
			}
	
		if (app.doc.curConcept != -1) {																				// If a step active
			str+="<div id='stepBarDiv' class='wm-stepBar'";															// Stepbar div
			if (w < 800)	str+=" style='top:84px'";																// Shift down if too narrow													
			str+=">";
			children=app.doc.lobs[app.doc.curConcept].children;														// Get topics
			for (i=0;i<children.length;++i) {																		// For each topic 
				name=app.doc.FindLobById(children[i]).name;															// Get concept name
				str+=`<span id='stepBar-${i}' class='wm-stepBarItem' style='`;										// Use ES6 templates!
				id=app.doc.lobs[app.doc.curConcept].children[i];													// Get concept id
				if (app.doc.FindLobById(id).status >= app.doc.statusThreshold)										// If done
					str+="color:#007700;";																			// Show done color
				if (app.doc.curLobId == children[i]) 																// If current Topic
				 	str+="color:#c57117;font-weight:bold";															// Show current place
				str+=`'>${name}</span>`;																			// Add name
				if (i != children.length-1)																			// Id not last
					str+="<span style='color:#999'>|</span>";														// Add pipe
				}	
			}
	
		$("#navDiv").html(str);																						// Add content	

		if (app.doc.curLesson != -1) {																				// If a lesson active
			l=-92;																									// Start left
			children=app.doc.lobs[app.doc.curLesson].children;														// Get topics
			ww=(w-48)/(children.length-1);																			// Width between topic dots
			for (i=0;i<children.length;++i) {																		// For each topic 
					$("#topicDotDot-"+i).on("click",function(e) {													// ON TOPIC CLICK
						var id=e.currentTarget.id.substr(12);														// Extract id
						id=app.doc.lobs[app.doc.curLesson].children[id];											// Get topic id
						app.Draw(app.doc.FindLobIndexById(id));														// Set new index and redraw
						Sound("click");																				// Click
						});
						$("#topicDotLab-"+i).css({ left:l+"px"} );													// Position label
						$("#topicDotDot-"+i).css({ left:(l+100)+"px"} );											// Position dot
						var id=app.doc.lobs[app.doc.curLesson].children[i];											// Get topic is
					if (app.doc.FindLobById(id).status >= app.doc.statusThreshold)	{								// If done
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
		if (app.hideHeader || app.fullScreen) {																		// If not hiding header or full screen
			$("#headerDiv").css("display","none");																	// Hide it
			$("body").css("background-color","#ddd")																// Background gray
			}
		else
			$("#headerDiv").css("display","block");																	// Show it		
		$("#courseTitle").html(app.doc.lobs[0].name);																// Show course name
		if (app.doc.curLesson <= 0)																					// On splash page
			$("#lessonTitle").html("");																				// Hide lesson name
		else																										// Into course
			$("#lessonTitle").html(app.doc.lobs[app.doc.curLesson].name);											// Show lesson name
		$("#userName").html(app.doc.firstName+"&nbsp;"+app.doc.lastName);											// Show user
		if (app.discussion)		$("#showDiscuss").show();															// If discussion set
	}

	MobileNavigator()																							// MOBILE NAVIGATION
	{
		var str="<p class='wm-pageTitle'>Choose pane</p>";															// Title
		str+="<div id='treeDiv' class='wm-tree' style='margin-left:10%'></div>";									// Add tree
		str+="<div style='margin-left:72px'>LEGEND: ";																// Add legend 
		str+="<span style='color:#000088'>Not done yet</span> | "; 
		str+="<span style='color:#c57117'>Partial</span> | ";
		str+="<span style='color:#009900'>Done</span> | "
		str+="(#) is value from 0 to "+app.doc.statusThreshold+"</div>";											// Number
		$("#contentDiv").html(str);																					// Set tree menu
		new Tree(app.doc.curLobId);																					// Populate tree
	}
} // Nav class closure
																													
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TREE NAVIGATION 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Tree {

	constructor(id)  																							// CONSTRUCTOR
	{
		this.Init(id);																								// Init tree
	}

	Init(id) 																									// INIT TREE
	{
		var _this=this;																								// Save context		
		var o=app.doc.lobs[0];																						// Point at root												
		if (!o)	return;																								// If invalid, quit
		var str="<ul><li class='parent active'><a id='tr-"+o.id+"'>"+o.name+"</a></li>"; 							// Add root tree node
		$("#treeDiv").html(str+"</ul>");																			// Add to tree div
		this.AddChildren($("#tr-"+o.id),0);																			// Add children to tree
		$("#tr-"+o.id).parent().children('ul').slideToggle('fast');            										// Open course
		if (id != undefined) this.Open(id);																			// Open pane

		$('.wm-tree li > a').on("click", function(e) {																// ON CLICK OF NODE TEXT
			_this.handleTreeClick($(this),e);  																		// Handle
			Sound("click"); 																						// Click
			});      
	}

	Open(id)																									// OPEN TREE AT ID
	{
		var i;
		var row=$("#tr-"+id);																						// Row
		var par=row.parent();																						// Point at previous line
		$('.wm-tree li a').each( function() {                          												// For each line
			$(this).css({"font-weight":"normal"});      															// Normal
			}); 
		row.css({"font-weight":"bold"});          																	// Bold 
		for (i=0;i<20;++i) {																						// Iterate upwards
			if ($(par).attr("class") == "wm-tree")	break;															// Quit at top of tree
			if ($(par).attr("class") == "parent") {																	// Has children
				par.addClass('active');                         													// Active class on 
				par.children('ul').slideToggle('fast');            													// Slide into place
				}
			par=par.parent();																						// Up a level
			}
		}

	handleTreeClick(row, e)																						// HANDLE TREE CLICK
	{
		if (e.offsetX < 12) {                                         				  								// In icon
			row.parent().toggleClass('active');                         											// Toggle active class on or off
			row.parent().children('ul').slideToggle('fast');            											// Slide into place
			}
		else{																										// In text
			var id=e.target.id.substr(3);																			// Get id
			app.doc.curPos=app.doc.FindLobIndexById(id);															// Set pos
			app.Draw();																								// Go to pane
			}
		}

	AddChildren(row, id) 																						// ADD CHILDREN TO TREE RECURSIVELY
	{
		var i,o,oo;
		if (id < 0)	return;																							// Invalid index
		var o=app.doc.lobs[id];																						// Point at parent												
		if (!o)	return;																								// If invalid, quit
		if (!o.children)	return;																					// Quit if no children
		var str="<ul style='display:none'>";																		// Wrapper
		for (i=0;i<o.children.length;++i) {																			// For each child
			oo=app.doc.lobs[o.kids[i]];																				// Point at child lob via index
			str+="<li style='color:";																				// Start row
			if (oo.status >= app.doc.statusThreshold)			str+="#009900'";									// Completed
			else if (oo.status >= app.doc.statusThreshold/2)	str+="#c57117'";									// Half
			else 												str+="#000088'";									// None
			if (oo.children.length)	str+=" class='parent'"															// Add parent if it has children
			str+=`><a id='tr-${oo.id}'>${oo.name} (${oo.status})</a></li>`;											// Add index, name, and status
			}
		row.after(str+"</ul>");																						// Add to tree
		for (i=0;i<o.children.length;++i) {																			// For each child
			row=$("#tr-"+o.children[i]);																			// Get row
			this.AddChildren(row,o.kids[i]);																		// Recurse
			}
		}
	
	} // Tree class closure
