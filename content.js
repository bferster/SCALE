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
		$("#nextBut").on("click",()=> { app.doc.NextLob(); app.Draw(); ButtonPress("nextBut")} );					// On button click, navigate forward   
}
		
	UpdateHeader() {
return;
		var name=app.doc.FindLobById(app.doc.levels[1]).name;														// Get lesson name
		$("#lessonTitle").html(name);																				// Show it
		if (app.doc.levels[2]) 	name=app.doc.FindLobById(app.doc.levels[2]).name;									// If live, get name
		else					name="";																			// Else null it
		$("#topicTitle").html(name ? name : "");																	// Show it
		if (app.doc.levels[3]) 	name=app.doc.FindLobById(app.doc.levels[3]).name;									// If live, get name
		else					name="";																			// Else null it
		$("#conceptTitle").html(name ? name : "");																	// Show it
		if (app.doc.levels[4]) 	name=app.doc.FindLobById(app.doc.levels[4]).name;									// If live, get name
		else					name="";																			// Else null it
		$("#stepTitle").html(name.charAt(0).toUpperCase()+name.substr(1));											// Show it
		$("#userName").html(app.doc.firstName+"&nbsp;"+app.doc.lastName);											// Show user
	}

}

