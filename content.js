///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
	
	constructor()   {																							// CONSTRUCTOR
		this.left=this.top=this.wid=this.hgt=0;																		// Sizes																
	}

	Draw() {																									// REDRAW
		var h=app.hgt-$("#headerDiv").height()-$("#navDiv").height()-36;											// Get height
		$("#contentDiv").height(h);																					// Position nav box
		$("#contentDiv").html(this.GetContentBody());																// Set content
		$("#nextBut").on("click",()=> { app.doc.NextLob(); app.Draw(); ButtonPress("nextBut")} );					// On button click, navigate forward   
	}

	GetContentBody()	{																						// ADD LOB CONTENT
		var l;
		var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>"; 										// Add next button
		str+="<div id='contentbodyDiv' class='wm-contentBody'>";													// Container div
		if (l=app.doc.curLob)																						// Valid lob
			str+=l.body ? l.body : "";																				// Add body
		return str+"</div>";																						// Close div and return content
		}
}

