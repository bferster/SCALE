///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
	
	constructor()   {																							// CONSTRUCTOR
		}

	Draw() {																									// REDRAW
		var h=app.hgt-$("#headerDiv").height()-$("#navDiv").height()-36;											// Get height
		$("#contentDiv").height(h);																					// Position nav box
		var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>"; 										// Add next button
		str+=this.GetContentBody();																					// Add content
		$("#contentDiv").html(str);																					// Set content
		$("#nextBut").on("click",()=> { app.doc.NextLob(); app.Draw(); ButtonPress("nextBut")} );					// On button click, navigate forward   
		}

	GetContentBody()	{																						// ADD LOB CONTENT
		var ifr,ifs,str="";
		var l=app.doc.curLob;																						// Point at lab
		if (app.doc.curMapPos)																						// If not splash page
			str+=l.name ? "<div class='wm-pageTitle'>"+l.name+"</div>" : "";										// Add page title
		str+="<div id='contentbodyDiv' class='wm-contentBody'>";													// Container div
		if (l) {																									// Valid lob
			str+=l.body ? l.body : "";																				// Add body
			if (ifr=str.match(/scalemedia\((.+)\)/i)) {																// If a media tag
				var h=$("#contentDiv").height()-200;																// Calc height
				ifr=(""+ifr[1]).split(",");																			// Get params
				if (ifr[1])	h=ifr[1];
				ifs="<iframe class='wm-media' frameborder=0 src='"+ifr[0]+"' style='height:"+h+"px'></iframe>";		// Load in iframe
				str=str.replace(/scalemedia\(.+\)/i,ifs);															// Get tag and replace it with iframe
				}
		}
		return str+"</div>";																						// Close div and return content
		}
}

