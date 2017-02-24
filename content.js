///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
	constructor()   {
		this.left=this.top=this.wid=this.hgt=0;																		// Sizes
	}

	Draw() {																									// REDRAW
		var h=app.hgt-$("#headerDiv").height()-$("#navDiv").height()-66;											// Get height
		var w=$("#contentDiv").width();																				// Content width
		var l=$("#contentDiv").offset().left;																		// Left
		var t=$("#contentDiv").offset().top;																		// Top

		this.UpdateHeader(); 																						// Update header
		$("#contentDiv").height(h);																					// Position nav box
		var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>"; 										// Add next button
	
	
		$("#contentDiv").html(str);																					// Set content
		$("#nextBut").css({"top":h-10+"px"});																		// Pos next button
		$("#nextBut").on("click",()=> { app.nav.Forward(); ButtonPress("nextBut")} );								// On button click, navigate forward   
 }
		
	UpdateHeader() {
/*		$("#lessonTitle").html(app.pl.name);
		$("#topicTitle").html(app.pt ? app.pt.name : "");
		if (app.ps.name) {																							// If a named step
			var str=app.ps.name.charAt(0).toUpperCase()+app.ps.name.substr(1);										// Add step name
			if (app.ps.pages.length > 1)																			// If multiple pages
				str+=`&nbsp;&nbsp;<i>(${app.cp+1}&nbsp;of&nbsp;${app.ps.pages.length})</i>`;						// Add place in pages, if more than 1
			$("#stepTitle").html(str);																				// Add content	
			}

		$("#userName").html(app.doc.firstName+"&nbsp;"+app.doc.lastName);
*/	}

}

