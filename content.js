///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
	
	constructor()   																							// CONSTRUCTOR
	{	
		this.resumeId=0;																							// Id of triggered lob
		this.resumeTime=0;																							// Time of trigger
	}

	Draw(id) 																									// REDRAW
	{	
		var h=app.hgt-$("#navDiv").height()-24;																		// Get height
		if (!app.hideHeader)																						// If not hiding header
			h-=$("#headerDiv").height()+10;																			// Accommodate for it
		h=Math.min(h,1000);																							// Cap at 1000
		$("#contentDiv").height(h);																					// Size content
		var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>"; 										// Add next button
		$("#contentDiv").html(str);																					// Set content
		if (id == "discuss") {																						// If a discussion
			var str="<img onclick='javascript:app.con.Draw()' src='img/next.png' class='wm-nextBut'>"; 				// Add exit button
			var h=$("#contentDiv").height()-200;																	// Set default height												
			var link="disqus.htm?"+app.discussion;																	// Set link
			str+="<div class='wm-pageTitle'>Discussion</div><br>";													// Add page title
			str+="<div style='text-align:center'>";																	// For centering
			str+="<iframe id='contentIF' class='wm-media' align='middle' frameborder='0' src='"+link+"' style='height:"+h+"px;width:75%'></iframe></div>";	// Load in iframe
			$("#contentDiv").append(str);																			// Run discussion
			}
		else
			this.GetContentBody(id);																				// Add content
		$("#nextBut").on("click",()=> { 																			// On button click, navigate forward   
			var b=app.doc.lobs[app.doc.curPos].body;																// Point at body
			if (b.match(/assess\(/i)) {																				// If in an assessment
				Sound("delete");																					// Sound
				PopUp("Please finish this assessment first");														// Popup message
				return;
				}
			app.doc.NextLob(1); 																					// Next lob
			app.Draw(); 																							// Draw it
			ButtonPress("nextBut");																					// Wiggle button
			});				
	}

	GetContentBody(id)																							// ADD LOB CONTENT
	{	
		var ifr,ifs,str="";
		var margin=app.defMargin ? app.defMargin : 0;																// Default margin
		$("#zoomerOuterDiv").remove();																				// Kill any left-over zoomers
		app.allowResize=true;																						// Allow resizing
		if (id == undefined)	id=app.doc.curLobId;																// Use curent
		var l=app.doc.FindLobById(id);																				// Point at lob
		if (app.doc.curPos)																							// If not splash page
			str+=l.name ? "<div class='wm-pageTitle'>"+l.name+"</div>" : "";										// Add page title
		str+="<div id='contentBodyDiv' class='wm-contentBody'>";													// Container div
		if (l) {																									// Valid lob
			str+=l.body ? l.body : "";																				// Add body
			if (ifr=str.match(/scalemedia\((.*?)\)/i)) {															// If a media tag
				var w=99.5,b=0;																						// Assume full width
				var h=$("#contentDiv").height()-200;																// Set default height												
				ifr=(""+ifr[1]).split(",");																			// Get params
				if (ifr[1])		h=h*ifr[1]/100;																		// Calc height based on height percentage
				if (ifr[2])		w=w*ifr[2]/100;																		// Width too
				if (ifr[3])		b=1;																				// Border
				if (this.resumeTime && this.resumeId)																// A resume time/id set
					ifr[0]+="|start="+this.resumeTime;																// Set new start
				ifs="<div style='text-align:center'>";																// For centering
				ifs+="<iframe id='contentIF' class='wm-media' align='middle' frameborder='"+b+"' src='"+ifr[0]+"' style='height:"+h+"px;width:"+w+"%'></iframe></div>";	// Load in iframe
				str=str.replace(/scalemedia\(.*?\)/i,ifs);															// Get tag and replace it with iframe
				}
			if (ifr=str.match(/assess\((.*?)\)/i)) {																// If an assess tag
				var w=99.5,b=0;																						// Assume full width
				var h=$("#contentDiv").height()-250;																// Set default height												
				ifs="<div style='text-align:center'>";																// For centering
				var url="assess.htm?"+ifr[1];																		// Get answers
				url+="|"+l.id;																						// Add overall assessment id
				ifs+="<iframe id='contentIF' class='wm-media' align='middle' frameborder='0' src='"+url+"' style='height:"+h+"px;width:100%'></iframe></div>";	// Load in iframe
				str=str.replace(/assess\(.*?\)/i,ifs);																// Get tag and replace it with iframe
				}
			if (ifr=str.match(/margin\((.*?)\)/i)) {																// If a margin tag
				margin=ifr[1];																						// Set margin
				str=str.replace(/margin\(.*?\)/i,"");																// Kill tag
				}
			$("#contentDiv").append(str+"</div>");																	// Set content
	
			if (margin && (margin != "0"))	{																		// If a margin set
				var pct=100-margin-margin;																			// Width
				margin+="%";																						// Add %
				$("#contentBodyDiv").css({ "padding-left":margin,"padding-right":margin,width:pct+"%" });			// Set margin	
				}	
		}
	}
}


