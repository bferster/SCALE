///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
	
	constructor()   {																							// CONSTRUCTOR
		}

	Draw() {																									// REDRAW
		var h=app.hgt-$("#headerDiv").height()-$("#navDiv").height()-36;											// Get height
		h=Math.min(h,1000);																							// Cap at 1000
		$("#contentDiv").height(h);																					// Size content
		var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>"; 										// Add next button
		$("#contentDiv").html(str);																					// Set content
		this.GetContentBody();																						// Add content
		var l=app.doc.curLob;																						// Point at lab
		$("#nextBut").on("click",()=> { app.doc.NextLob(); app.Draw(); ButtonPress("nextBut")} );					// On button click, navigate forward   
		}

	GetContentBody()	{																						// ADD LOB CONTENT
		var ifr,ifs,str="";
		$("#zoomerOuterDiv").remove();																				// Kill any left-over zoomers
		app.allowResize=true;																						// Allow resizing
		var l=app.doc.curLob;																						// Point at lab
		if (app.doc.curMapPos)																						// If not splash page
			str+=l.name ? "<div class='wm-pageTitle'>"+l.name+"</div>" : "";										// Add page title
		str+="<div id='contentBodyDiv' class='wm-contentBody'>";													// Container div
		if (l) {																									// Valid lob
			str+=l.body ? l.body : "";																				// Add body
			if (ifr=str.match(/scalemedia\((.+)\)/i)) {																// If a media tag
				var w=100,b=0;																						// Assume full width
				var h=$("#contentDiv").height()-200;																// Set default height												
				ifr=(""+ifr[1]).split(",");																			// Get params
				if (ifr[1])		h=h*ifr[1]/100;																		// Calc height based on height percentage
				if (ifr[2])		w=w*ifr[2]/100;																		// Width too
				if (ifr[3])		b=1;																				// Border
				ifs="<div style='text-align:center'>";																// For centering
				ifs+="<iframe class='wm-media' align='middle' frameborder='"+b+"' src='"+ifr[0]+"' style='height:"+h+"px;width:"+w+"%'></iframe></div>";	// Load in iframe
				str=str.replace(/scalemedia\(.+\)/i,ifs);															// Get tag and replace it with iframe
				}
			$("#contentDiv").append(str+"</div>");																	// Set content
		}
	}
}

