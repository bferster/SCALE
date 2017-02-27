///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
	
	constructor()   {																							// CONSTRUCTOR
		this.left=this.top=this.wid=this.hgt=0;																		// Sizes																
	}

	Draw() {																									// REDRAW
		var h=app.hgt-$("#headerDiv").height()-$("#navDiv").height()-66;											// Get height
		$("#contentDiv").height(h);																					// Position nav box
		var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>"; 										// Add next button
		str+=this.GetContentBody();																					// Get content body
		$("#contentDiv").html(str);																					// Set content
		$("#nextBut").css({"top":h-10+"px"});																		// Pos next button
		$("#nextBut").on("click",()=> { app.doc.NextLob(); app.Draw(); ButtonPress("nextBut")} );					// On button click, navigate forward   
	}

	GetContentBody(d)	{
		var l;
		var str="<div id='contentbodyDiv' class='wm-contentBody'>"
		if (l=app.doc.curLob)
			str+=l.body ? l.body : "";
		return str+"</div>";
		}
}

