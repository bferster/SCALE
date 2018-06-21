///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
	
	constructor()   																							// CONSTRUCTOR
	{	
		this.lobId;																									// Currently drawn lob id
		this.resumeId=0;																							// Id of triggered lob
		this.resumeTime=0;																							// Time of trigger
	}

	Draw(id) 																									// REDRAW
	{	
		var h=app.hgt-$("#headerDiv").height()-$("#navDiv").height()-36;											// Get height
		h=Math.min(h,1000);																							// Cap at 1000
		$("#contentDiv").height(h);																					// Size content
		var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>"; 										// Add next button
		$("#contentDiv").html(str);																					// Set content
		this.lobId=id ? id : app.doc.curLobId;																		// Get lob id
		this.GetContentBody();																						// Add content
		$("#nextBut").on("click",()=> { app.doc.NextLob(); app.Draw(); ButtonPress("nextBut")} );					// On button click, navigate forward   
	}

	GetContentBody()																							// ADD LOB CONTENT
	{	
		var ifr,ifs,str="";
		$("#zoomerOuterDiv").remove();																				// Kill any left-over zoomers
		app.allowResize=true;																						// Allow resizing
		var l=app.doc.FindLobById(this.lobId);																		// Point at lob
		if (app.doc.curPos)																							// If not splash page
			str+=l.name ? "<div class='wm-pageTitle'>"+l.name+"</div>" : "";										// Add page title
		str+="<div id='contentBodyDiv' class='wm-contentBody'>";													// Container div
		if (l) {																									// Valid lob
			str+=l.body ? l.body : "";																				// Add body
			if (ifr=str.match(/scalemedia\((.+)\)/i)) {																// If a media tag
				var w=99.5,b=0;																						// Assume full width
				var h=$("#contentDiv").height()-180;																// Set default height												
				ifr=(""+ifr[1]).split(",");																			// Get params
				if (ifr[1])		h=h*ifr[1]/100;																		// Calc height based on height percentage
				if (ifr[2])		w=w*ifr[2]/100;																		// Width too
				if (ifr[3])		b=1;																				// Border
				if (this.resumeTime && this.resumeId)																// A resume time/id set
					ifr[0]+="|start="+this.resumeTime;																// Set new start
				ifs="<div style='text-align:center'>";																// For centering
				ifs+="<iframe id='contentIF' class='wm-media' align='middle' frameborder='"+b+"' src='"+ifr[0]+"' style='height:"+h+"px;width:"+w+"%'></iframe></div>";	// Load in iframe
				str=str.replace(/scalemedia\(.+\)/i,ifs);															// Get tag and replace it with iframe
				}
			else if (ifr=str.match(/assess\((.+)\)/i)) {															// If an assess tag
				var w=99.5,b=0;																						// Assume full width
				var h=$("#contentDiv").height()-250;																// Set default height												
				ifs="<div style='text-align:center'>";																// For centering
				var url="assess.htm?"+ifr[1];
				ifs+="<iframe id='contentIF' class='wm-media' align='middle' frameborder='0' src='"+url+"' style='height:"+h+"px;width:66%'></iframe></div>";	// Load in iframe
				str=str.replace(/assess\(.+\)/i,ifs);																// Get tag and replace it with iframe
				}
			$("#contentDiv").append(str+"</div>");																	// Set content
		}
	}
}


