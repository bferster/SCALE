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
		$("#lessonTitle").html(app.doc.lobs[app.doc.curLesson].name);												// Show lesson name
		$("#userName").html(app.doc.firstName+"&nbsp;"+app.doc.lastName);											// Show user
	}

}

