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
		this.playerNow=0;																							// Current player time
		this.playerTimer=null;																						// Transcript timer
		this.toneJS=null;																							// ToneJS instance
	}

	Draw(id) 																									// REDRAW
	{	
		app.ams.Clear();																							// Clear any overlay skins
		$("#transDiv").remove();																					// Clear transcript
		var h=$("#mainDiv").height()-24;																			// Get height
		if (!app.hideHeader && !app.fullScreen)																		// If not hiding header and not full
			h-=Math.max($("#headerDiv").height(),32)+10;															// Accommodate for it
		if (!app.fullScreen && ($("#mainDiv").width() > 599))														// If not full screen
			h-=$("#navDiv").height();																				// Accomodate
		h=Math.min(h,1000);																							// Cap at 1000
		$("#contentDiv").height(h);																					// Size content
		var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>"; 										// Add next button
		str+="<img id='mobileMenu' src='img/mobilemenu.png' class='wm-mobileBut' onclick='app.nav.MobileNavigator()'>";  // Add mobile button
		str+="<div id='backBut' class='wm-backBut' title='Go back a step' onclick='app.nav.Back()'>BACK</div>"; 	// Add back button
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
			this.ToneJS();																							// Init ToneJS library if enabled
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
					app.rul.RunRule(v[0],t);																		// Run action
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
		var i,v,s,ifr,ifs,str="";
		var w,h,b;
		var margin=app.defMargin ? app.defMargin : 0;																// Default margin
		var widgetSrc,widgetTop,widgetWid;
		$("#zoomerOuterDiv").remove();																				// Kill any left-over zoomers
		app.allowResize=true;																						// Allow resizing
		if (id == undefined)	id=app.doc.curLobId;																// Use curent
		var l=app.doc.FindLobById(id);																				// Point at lob
		if (app.doc.curPos)																							// If not splash page
			str+=l.name ? "<div id='paneTitle' class='wm-pageTitle'>"+l.name+"</div>" : "";							// Add page title
		str+="<div id='contentBodyDiv' class='wm-contentBody'>";													// Container div
		if (l) {																									// Valid lob
			str+=l.body ? l.body : "";																				// Add body
			if (ifr=str.match(/margin\((.*?)\)/i)) {																// If a margin tag
				margin=ifr[1];																						// Set margin
				str=str.replace(/margin\(.*?\)/i,"");																// Kill tag
				}
			if ((ifr=str.match(/scalemedia\((.*?)\)/i))) {															// If a media tag
				w=99.5; b=0;																						// Assume full width
				h=$("#contentDiv").height()-200;																	// Set default height												
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
			if ((ifr=str.match(/scalevideo\((.*?)\)/i))) {															// If a video tag
				w=99.5;	b=0;																						// Assume full width, no border
				var asp=0.5625;																						// Assume .5625 aspect
				ifr=(""+ifr[1]).split(",");																			// Get params
				ifr[0]="video.htm?"+ifr[0];																			// Add video url
				if (ifr[2])		w=w*ifr[2]/100;																		// Width too
				if (ifr[3])		b=1;																				// Border
				h=$("#contentDiv").width()*margin/50;																// Margin size
				h=($("#contentDiv").width()-h)*asp*(w/100);															// Set height based on aspect												
				if (this.resumeTime && this.resumeId)																// A resume time/id set
					ifr[0]+="|start="+this.resumeTime;																// Set new start
				ifs="<div style='text-align:center'>";																// For centering
				ifs+="<iframe id='contentIF' class='wm-media' align='middle' scrolling='no' frameborder='"+b+"' src='"+ifr[0]+"' style='overflow:hidden;height:"+h+"px;width:"+w+"%'></iframe></div>";	// Load in iframe
				str=str.replace(/scalevideo\(.*?\)/i,ifs);															// Get tag and replace it with iframe
				}
			if (ifr=str.match(/assess\((.*?)\)/i)) {																// If an assess tag
				w=99.5; b=0;																						// Assume full width
				var h=$("#contentDiv").height()-250;																// Set default height												
				ifs="<div style='text-align:center'>";																// For centering
				var url="assess.htm?"+ifr[1];																		// Get answers
				url+="|"+l.id;																						// Add overall assessment id
				ifs+="<iframe id='contentIF' class='wm-media' align='middle' frameborder='0' src='"+url+"' style='height:"+h+"px;width:100%'></iframe></div>";	// Load in iframe
				str=str.replace(/assess\(.*?\)/i,ifs);																// Get tag and replace it with iframe
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
			if ((ifr=str.match(/textbox\(.+?\)/ig))) {																// If a textbox() tag
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
			if ((ifr=str.match(/scalewidget\((.*?)\)/i))) {															// If a widget tag
				ifr=(""+ifr[1]).split(",");																			// Get params
				widgetSrc=ifr[0].substr(4);																			// Set src
				widgetWid=ifr[1] ? ifr[1]/100 : 0.6667;																// Set width
				widgetTop=ifr[2] ? ifr[2]-0 : 80;																	// Set top
				str=str.replace(/scalewidget\(.*?\)/i,"");															// Kill tag
				}
			if ((ifr=str.match(/scalePDF\((.*?)\)/i))) {															// If a PDF tag
				w=$("#contentDiv").width();																			// Assume 100%
				if (widgetSrc) w=w*widgetWid;																		// Widget takes up space
				ifr=(""+ifr[1]).split(",");																			// Get params
				if (!ifr[2]) ifr[2]=77.2;																			// Default to 8.5 * 11	
				h=(w-48)/(ifr[2]/100);																				// Set height via aspect
				h=Math.min(h,$("#contentDiv").height()-200);														// Cap to screen													
				ifs="<iframe id='contentIF' class='wm-media' frameborder='0' src='"+ConvertFromGoogleDrive(ifr[0])+"#page="+ifr[1]+"&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0' style='height:"+h+"px;width:100%;overflow:hidden;'></iframe>";	// Load in iframe
				str=str.replace(/scalePDF\(.*?\)/i,ifs);															// Get tag and replace it with iframe
				}
			if (ifr=str.match(/scaleAMS\((.*?)\)/i)) {																// If an AMS tag
				let o=app.doc.FindLobById(ifr[1],app.ams.skins);													// Get skin												
				app.ams.Draw(app.doc.curLobId,o)																	// Draw it
				str=str.replace(/scaleAMS\(.*?\)/i,"");																// Remove tag
				}
			if (ifr=str.match(/scalebutton\((.*?)\)/i)) {															// If a button tag
				ifr=(""+ifr[1]).split(",");																			// Get params
				s="<button class='wm-is' style='width:auto' onclick='app.rul.RunRule(\""+ifr[1]+"\",\""+ifr[2]+"\")'>"+ifr[0]+"</button>";			// Make button											
				str=str.replace(/scalebutton\(.*?\)/i,s);															// Add button
				}
			if (ifr=str.match(/scalelink\((.*?)\)/i)) {																// If a link tag
				ifr=(""+ifr[1]).split(",");																			// Get params
				s="<a style='color:#000099;text-decoration:underline' onclick='app.rul.RunRule(\""+ifr[1]+"\",\""+ifr[2]+"\")'>"+ifr[0]+"</a>";	// Make link											
				str=str.replace(/scalelink\(.*?\)/i,s);																// Add link
				}
/*			if (ifr=str.match(/scaleselect\((.*?)\)/i)) {															// If a select tag
				ifr=(""+ifr[1]).split(",");																			// Get params
				s="<select class='wm-is' style='width:auto' onchange='(function (){ trace(this.value);app.rul.RunRule(this.value)})()'>";
				for (i=0;i<ifr.length;i+=3)																			// For each option triplet (name, op, action)
					s+="<option value='"+ifr[i+1]+"|"+ifr[i+2]+"'>"+ifr[i+0]+"</option>";							// Add option
				s+="</select>";																						// Close select
				str=str.replace(/scaleselect\(.*?\)/i,s);															// Add select
				} 
*/
			$("#contentDiv").append(str+"</div>");																	// Set content
			$("#contentDiv").css("max-width",app.fullScreen ? "calc(100% - 16px)" : "950px" )						// Reset width
		
			if (widgetSrc) {																						// If a widget
				widgetSrc=widgetSrc.replace(/&amp;/g,"&");															// Change &amp; -> &
				if (!$("#contentIFWidget").length) {																// If not made yet
					str="<iframe src='"+widgetSrc+"' id='contentIFWidget' allow='microphone' ";						// Add iframe to hold  widget
					str+="style='border:none;position:absolute;top:0;display:none'></iframe>";						// Style it
					$("#mainDiv").append(str);																		// Add iFrame
					}
				if (widgetSrc != $("#contentIFWidget").prop("src")) {												// If a new URL
					$("#contentIFWidget").remove();																	// Kill old one
					str="<iframe src='"+widgetSrc+"' id='contentIFWidget' allow='microphone' ";						// Add iframe to hold  widget
					str+="style='border:none;position:absolute;top:0;display:none'></iframe>";						// Style it
					$("#mainDiv").append(str);																		// Add iFrame
					}
				margin=0;																							// Force no margins
				var w=$("#contentDiv").width()*(1-widgetWid)-32;													// Widget width
				var h=$("#contentDiv").height()-widgetTop-80+"px";													// Height
				$("#contentBodyDiv").css("max-width",w);															// Reset content width
//				$("#paneTitle").css("max-width",w);
				$("#contentIFWidget").css({ width:$("#contentDiv").width()*widgetWid-64+"px",height:h, display:"block",	// Position widget
					top:$("#contentDiv").offset().top+widgetTop+"px",	
					left:$("#contentDiv").offset().left+w+56+"px"	
					});	
				}
			else 	$("#contentIFWidget").css({  display:"none" });													// Hide widget
	
			if (margin && (margin != "0"))	{																		// If a margin set
				var pct=100-margin-margin;																			// Width
				margin+="%";																						// Add %
				$("#contentBodyDiv").css({ "padding-left":margin,"padding-right":margin,width:pct+"%" });			// Set margin	
				}	
		}
	}

	TableOfContents(id) 																						//	SHOW TOC
	{
		var v,i,s,h;
		$("#tocDiv").remove();																						// Clear it
		var ts="color:#009900;cursor:pointer";																		// Timecode style
		var ns="font-size:13px;border:none;background:none;width:100%;padding:0px;margin:0px;margin-left:3px;border-radius:8px;"; 
		var str="<div id='tocDiv' style='position:absolute;padding:16px;border-radius:8px;";						// Div
		str+="background-color:#f8f8f8;border:1px solid #ccc;";														// Set coloring
		str+="min-width:200px;max-width:400px;height:300px'>";														// Set size
		str+="<img src='img/closedot.gif' style='float:right;margin:-12px' id='tocCloser' title='Close contents'>";	// Closer				
		str+="<div style='text-align:center;font-size:18px;color:#009900;'><b>Contents</b></div><hr>"; // Title
		str+="<div style='width:100%;height:270px;margin-top:12px;overflow-y:auto;overflow-x:hidden' id='tocTxt'></div>"; // Holds toc
		$('body').append(str+"</div>");																				// Add to body								
		$("#tocDiv").css("left",$("#contentBodyDiv").offset().left+$("#contentBodyDiv").width()-$("#tocDiv").width()-32+"px");	// Position X
		
		$("#tocDiv").css("top",$("#contentBodyDiv").offset().top+($("#contentBodyDiv").width()*.5625-300)/2+"px");	// Center Y
		v=app.doc.FindLobById(id,app.doc.trans).text.split("|");													// Get body
		str="";																										// Start fresh
		for (i=0;i<v.length;++i) {																					// For each line
			s=TimecodeToSeconds(v[i].substring(0,5));																// Get time in seconds
			h=v[i].charAt(6);																						// Level
			str+="<div id='tttc-"+s+"'";																			// Start div
			str+="style='cursor:pointer;line-height:1.3;margin-left:"+h*16+"px'>";									// Add style
			if (h == "1")		str+="<b><span style='color:#27ae60'>&bull; </span>";								// Level 1
			else 				str+="<span style='color:#27ae60'>&bull; </span>";									// Level 2+
			str+=v[i].substr(8)+"</i></b></div>";																	// Text
			}
		$("#tocTxt").html(str);																						// Add to div
		$("#tocDiv").draggable();																					// Make draggable
		$("#tocCloser").on("click", ()=> {	$("#tocDiv").remove(); 	});												// Handle close
		$("[id^=tttc-]").click(function(e){																			// Add click handler
			var time=e.currentTarget.id.substr(5);																	// Get time from id
			SendToIframe("ScaleAct=play|"+time);																	// Send to iFrame
			$("#tocDiv").remove();																					// Remove it
		});
	
	}

	Transcript(id) 																							//	SHOW TRANSCRIPT
	{
		var v,i,t;
		var times=[],words=[],last=0;
		$("#transDiv").remove();																					// Clear it
		clearInterval(this.playerTimer);																			// Clear timer
		var ts="color:#009900;cursor:pointer";																		// Timecode style
		var ns="font-size:13px;border:none;background:none;width:100%;padding:0px;margin:0px;margin-left:3px;border-radius:8px;"; 
		var str="<div id='transDiv' style='position:absolute;padding:16px;border-radius:8px;";						// Div
		str+="background-color:#f8f8f8;border:1px solid #ccc;";														// Set coloring
		str+="top:33%;left:33%;width:500px;height:300px'>";															// Set size/position
		str+="<div style='text-align:center;;color:#009900;font-size:16px;'><b>Clickable transcript</b>";				// Title
		str+="<div style='float:right'>";									
		str+="<input style='width:100px;border-radius:16px;text-align:center;height:14px' id='transSearch' placeholder='Search'>";
		str+="&nbsp;<img src='img/closedot.gif' id='trCloser' title='Close transcript'></div></div><hr>";					
		str+="<div style='width:100%;height:270px;overflow-y:auto;overflow-x:hidden' id='transTxt'></div>";			// Holds transcript
		$('body').append(str+"</div>");																				// Add to body								
		v=app.doc.FindLobById(id,app.doc.trans).text.split("|");													// Get body
		str="";
		for (i=0;i<v.length;++i) {																					// For each line
			var t=v[i].substring(0,5);																				// Get timecode
			var s=TimecodeToSeconds(t);																				// Get time in seconds
			times.push(s);																							// Add to times array
			words.push( { label:v[i], t:s } );																		// Add to words array
			str+="<span id='ttm-"+s+"' style='color:#006600;cursor:pointer'>"+t+"&nbsp;</span>";					// Timecode
			str+="<span id='ttt-"+s+"'>"+v[i].substr(5)+"&nbsp;</span><br>";										// Text
			}
		$("#transTxt").html(str);																					// Add to div
		$("#transDiv").draggable();																					// Make draggable
		$("#trCloser").on("click", ()=> {																			// Handle close
			clearInterval(this.playerTimer);																		// Clear timer
			$("#transDiv").remove(); 																				// Remove dialog
			});												

		this.playerTimer=setInterval( ()=> {																		// Set timer 2fps
			RunPlayer("time");																						// Get player time
			for (i=0;i<times.length-1;++i) 																			// For each time slice
				if ((this.playerNow >= times[i]) && (this.playerNow < times[i+1])) {								// In this one
					$("#ttt-"+times[last]).css("background-color","#fff");											// Clear last
					$("#ttt-"+times[i]).css("background-color","#ddeeff");											// Highlight
					if (last != i)	$("#transTxt").scrollTop((i-7)*16);												// If different place, scroll there
					last=i;																							// Then is now
					break;																							// Quit looking
					}
			},500);															

		$("[id^=ttm-]").click(function(e){																			// Add click handler
			var time=e.currentTarget.id.substr(4);																	// Get time from id
			RunPlayer("play",time);																					// Cue player
			});
	
		function RunPlayer(op, param) {																				// VIDEO PLAYER ACTION
			SendToIframe("ScaleAct="+op+(param ? "|"+param: ""));													// Send to iFrame
			}
	
		$("#transSearch").autocomplete({ source: words, 															// SEARCH AUTOCOMPLETE HANDLER
			select: function(event, ui)  { RunPlayer("seek",ui.item.t); },											// On select cue player
			close: function()			 { $("#transSearch").val("");	}											// Clear text	
			});

		}

	VideoNotes() 																								//	ADD NOTES TO VIDEO
	{
		var i,str,v;
		var _this=this;
		RunPlayer("time");																							// Get player time
		$("#notesDiv").remove();																					// Clear it
		var ts="color:#009900;cursor:pointer";																		// Timecode style
		var ns="font-size:13px;border:none;background:none;width:100%;padding:0px;margin:0px;margin-left:3px;border-radius:8px;"; 		// Note style	
		str="<div id='notesDiv' style='position:absolute;padding:16px;overflow-y:auto;overflow-x:hidden;border-radius:8px;";	// Div
		str+="background-color:#f8f8f8;border:1px solid #ccc;";														// Set coloring
		str+="top:33%;left:20%;width:500px;height:300px'>";															// Set size/position
		str+="<table id='notesTbl' width='100%'>";																	// Table
		str+="<div style='text-align:center;color:#009900;font-size:16px;'><b>Personal notes</b>";							// Title
		str+="<img src='img/closedot.gif' id='nCloser' title='Close notes' style='float:right;'></div><hr></div>";
		str+="<tr><td width='38' id='ntc-0' style='"+ts+"'>Type:</td><td><input id='ntx-0' type='input' style='"+ns+"'/></td></tr>";
		str+="</table>";																							// End table
		str+="<div style='text-align:right;color:#666'><br>Pause video while typing? <input type='checkbox' id='notesPause' style='height:11px'>";
		str+="&nbsp;&nbsp;&nbsp;<div id='notesSave' class='wm-bs'>Save</div>";										// Save but
		$('body').append(str+"</div>");																				// Add to body								

		if (this.notesText) {																						// If notes
			v=this.notesText.split("|");																			// Divide into lines
			for (i=0;i<v.length;++i) {																				// For each line
				if (!v[i])	continue;																				// Ignore blanks
				str="<tr><td id='ntc-"+i+"' style='"+ts+"'>Type:</td><td><input id='ntx-"+i+"' type='input' style='"+ns+"'/></td></tr>";
				if (i)																								// 1st row is already there
					$("#notesTbl").append(str);																		// Add row
				$("#ntc-"+i).text(v[i].substring(0,5));																// Set timecode	
				$("#ntx-"+i).val(v[i].substr(5));																	// Set text	
				$("#ntc-"+i).click(function(e){																		// Add click handler
						var time=$("#"+e.target.id).text();															// Get time
						RunPlayer("time");																			// Get player time
						RunPlayer("scrub",TimecodeToSeconds(time));													// Cue player
						});
				}
			}
		
		$("#notesDiv").draggable();																					// Make draggable
		$("#ntx-0").focus();																						// Focus on first one
		
		$("#notesSave").on("click", function(e) {																	// Handle save
			_this.notesText="";
			for (var i=0;i<$("#notesTbl tr").length;++i) 															// For each row
				if ($("#ntx-"+i).val())																				// If something there
					_this.notesText+=$("#ntc-"+i).text()+"-1 "+$("#ntx-"+i).val()+"|"; 								// Add row
			app.msg.SaveToForm("Notes"+app.doc.curLobId+"="+_this.notesText.substring(0,_this.notesText.length-1));	// Save to student data
			});			

		$("#nCloser").on("click", function(e) {																		// Handle close
			_this.notesText="";
			for (var i=0;i<$("#notesTbl tr").length;++i) 															// For each row
				if ($("#ntx-"+i).val())																				// If something there
					_this.notesText+=$("#ntc-"+i).text()+$("#ntx-"+i).val()+"|"; 									// Add row
			$("#notesDiv").remove();																				// Clear it
			});			

		$("#notesTbl").on("keydown", function(e) {																	// Handle key down
			var cap=false;																							// Don't cap
			var rowNum=e.target.id.split("-")[1];																	// Get rownum
			if ($("#"+e.target.id).val().length > 70)																// If past limit
				cap=true;																							// Let's cap line
			if ((e.keyCode == 13) || (cap)) {																		// Enter on capping a line
				var id=$("#notesTbl tr").length;																	// If on next row
				var str="<tr><td id='ntc-"+id+"' style='"+ts+"'>Type:</td><td><input id='ntx-"+id+"' type='input' style='"+ns+"'/></td></tr>";
				$("#notesTbl").append(str);																			// Add row
				$("#ntx-"+id).focus();																				// Focus on new one
				if ($("#notesPause").prop('checked') && !cap) 														// If checked and not capped
					RunPlayer("play");																				// Resume player
				if (cap)																							// If line is capped
					$("#ntc-"+id).text($("#ntc-"+rowNum).text());													// Set to same time
				}
			else if ((e.keyCode == 8) || (e.keyCode == 46)) {														// Delete
				var id="#"+e.target.id;																				// Get id
				if ((!$(id).val()) && (id != "#ntx-0")) {															// No more chars left sand not 1st row
					id="ntx-"+(id.substr(5)-1);																		// Last row										
					$("#"+id).focus();																				// Focus there to prevent page back action
					$("#"+e.target.id).parent().parent().remove();													// Delete
					}			
				}
			else if (!$("#ntx-"+rowNum).val()) {																	// A key and nothing in the field yet
				RunPlayer("time");																					// Get player time
				$("#ntc-"+rowNum).text(SecondsToTimecode(_this.playerNow).substring(0,5));							// Set new time
				if ($("#notesPause").prop('checked')) 																// If checked
					RunPlayer("pause");																				// Pause player
				
				$("#ntc-"+rowNum).click(function(e){																// Add click handler
					RunPlayer("time");																				// Get player time
					var time=$("#"+e.target.id).text();																// Get time
						RunPlayer("play",TimecodeToSeconds(time));													// Cue player
						});
				}
			});

			function RunPlayer(op, param) {																			// VIDEO PLAYER ACTION
				SendToIframe("ScaleAct="+op+(param ? "|"+param: ""));												// Send to iFrame
				}
		}

		ToneJS(a1, a2, a3, a4) 																					// RUN A TONE JS COMMAND
		{
			if (!app.toneJS)	return;																				// Not enabled
			if (!this.toneJS) { 																					// If not loaded yet
				$.getScript("lib/Tone.js").done(()=> { 																// Load library
					this.toneJS=new Tone.Synth().toMaster(); 														// Alloc module
					if (a1) this.toneJS.triggerAttackRelease(a1,a2,a3,a4);										// Do action
					});
				}
			else if (a1) this.toneJS.triggerAttackRelease(a1,a2,a3,a4);											// Do action if loaded
		}
		

} // Content class closure







