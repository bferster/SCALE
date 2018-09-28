///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
	
	constructor()   																							// CONSTRUCTOR
	{	
		this.resumeId=0;																							// Id of triggering lob
		this.triggerId=0;																							// Id of triggered lob
		this.resumeTime=0;																							// Time of trigger
		this.actionQueue=[];																						// Delayed actions on next button
	}

	Draw(id) 																									// REDRAW
	{	
		app.ams.Clear();																							// Clear any overlay skins
		var h=$("#mainDiv").height()-24;																			// Get height
		if (!app.hideHeader && !app.fullScreen)																		// If not hiding header and not full
			h-=Math.max($("#headerDiv").height(),32)+10;															// Accommodate for it
		if (!app.fullScreen && ($("#mainDiv").width() > 599))														// If not full screen
			h-=$("#navDiv").height();																				// Accomodate
		h=Math.min(h,1000);																							// Cap at 1000
		$("#contentDiv").height(h);																					// Size content
		var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>"; 										// Add next button
		if ($("#mainDiv").width() < 600)																			// If too small																
			str+="<img id='mobileMenu' src='img/mobilemenu.png' class='wm-mobileBut' onclick='app.nav.MobileNavigator()'>"; // Add mobile button
		str+="<img id='fullBut' src='img/fullbut.png' class='wm-fullBut'>"; 										// Add full button
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
			var i,v,t
			var b=app.doc.lobs[app.doc.curPos].body;																// Point at body
			if (b.match(/assess\(/i)) {																				// If in an assessment
				Sound("delete");																					// Sound
				PopUp("Please finish this assessment first");														// Popup message
				return;
				}
			for (i=0;i<this.actionQueue.length;++i) {																// For each queued action
				t="";																								// Clear
				v=this.actionQueue[i]=this.actionQueue[i].substr(0,this.actionQueue[i].length-1).split(" ");		// Trim paren and split
				if ((v[0] == "REPORT") && $("#txb-"+i).val()) {														// If a REPORT value
					t=v[1].substr(0,v[1].length-1)+":"+$("#txb-"+i).val();						 					// Get val
					app.rul.RunRule({ id: app.doc.curLobId, do: v[0], object: t });									// Run action
					}
				}
			app.con.actionQueue=[];																					// Clear queue
			app.doc.NextLob(1); 																					// Next lob
			app.Draw(); 																							// Draw it
			ButtonPress("nextBut");																					// Wiggle button
			app.con.resumeId=app.con.triggerId=app.con.resumeTime=0;												// Clear resume
			});				

		$("#fullBut").on("click", ()=> { 																			// Full screen button
			app.fullScreen=!app.fullScreen;																			// Toggle mode
			app.Draw(); 																							// Draw it
			$("#mainDiv").height($(window).height());																// Set main
		});
	}

	GetContentBody(id)																							// ADD LOB CONTENT
	{	
		var v,ifr,ifs,str="";
		var margin=app.defMargin ? app.defMargin : 0;																// Default margin
		$("#zoomerOuterDiv").remove();																				// Kill any left-over zoomers
		app.allowResize=true;																						// Allow resizing
		if (id == undefined)	id=app.doc.curLobId;																// Use curent
		var l=app.doc.FindLobById(id);																				// Point at lob
		if (app.doc.curPos)																							// If not splash page
			str+=l.name ? "<div id='paneTitle' class='wm-pageTitle'>"+l.name+"</div>" : "";							// Add page title
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
			if (ifr=str.match(/do\(.+?\)"/ig)) {																	// If a do() tag
				var i,d;	
				for (i=0;i<ifr.length;++i) {																		// For each do() macro
					d="javascript:app.rul.RunRule(";																// Rule function
					d+="{ id:0, do:\'"+ifr[i].substr(3,ifr[i].length-5).split(" ")[0];
					d+="\', object:\'"+ifr[i].substr(3,ifr[i].length-5).split(" ")[1]+"'}\)";
					str=str.replace(/do\(.+?\)/i,d);																// Replace tag
					}
				}
			if (ifr=str.match(/textbox\(.+?\)/ig)) {																// If a textbox() tag
				var i,t;	
				for (i=0;i<ifr.length;++i) {																		// For each do() macro
					v=(""+ifr[i]).split(",");																		// Get params
					v[0]=v[0].substr(8);																			// Remove header
					if (v[1] == 1) 																					// Single line
						t="<input id='txb-"+i+"' class='wm-is' width:"+v[0]+"%' type='text'>";						// Use input
					else{
						t="<textarea id='txb-"+i+"' style='width:"+v[0]+"%;"										// Add textarea
						t+="vertical-align:top;border-radius:12px;' rows='"+v[1]+"'></textarea>";	
						}
					str=str.replace(/textbox\(.+?\)/i,t);															// Replace tag
					this.actionQueue.push(v[2]+" "+v[3]);															// Add action to queue
					}
				}

			$("#contentDiv").append(str+"</div>");																	// Set content
			$("#contentDiv").css("max-width",app.fullScreen ? "calc(100% - 16px)" : "1000px" )						// Reset width
	
			if (margin && (margin != "0"))	{																		// If a margin set
				var pct=100-margin-margin;																			// Width
				margin+="%";																						// Add %
				$("#contentBodyDiv").css({ "padding-left":margin,"padding-right":margin,width:pct+"%" });			// Set margin	
				}	
		}
	}
}


