// MEDIA SKIN /////////////////////////////////////////////////////////////////////////////////////////////////////////

class MediaSkin {
	
	constructor()																								// CONSTRUCTOR
	{
		this.skins=[];																								// Holds skins
		this.macros=[];																								// Holds macros (associative_
		this.settings={};																							// Holds settings (associative)
		this.curSkin;																								// Currently active skin ojject
	}

	AddSkin(id, name, raw)																						// PARSE SKIN SPEC AND ADD
	{
		var e,i,j,v,o,evts=[];
		if (!raw) return;																							// Quit if no data
		raw=raw.replace(/\n|\r|\t/g,"");																			// Remove CR/LF/Tab
		raw=raw.replace(/<\/*p>/g,"");																				// Remove <p>s
		raw=raw.replace(/\(/g,",");																					// ( to ,
		raw=raw.replace(/&nbsp;/g,"");																				// Remove spaces
		e=raw.split(")");																							// Split into events	
		for (i=0;i<e.length;++i) {																					// For each event
			if (!e[i] || (e[i].length < 10))	continue;															// Skip blank
			v=e[i].split(",");																						// Split into fields
			o={ right:0 };																							// Init obj
			o.type=v[0].toLowerCase().trim();																		// Set type
			for (j=1;j<v.length;++j)																				// For each param
				if (v[j])	o[v[j].split('=')[0].trim().toLowerCase()]=v[j].split('=')[1].trim();					// Add params
			evts.push(o);																							// Add event
			}
		if (evts.length)																							// If anything there
			this.skins.push({ id:id, name:name, items:evts, body:raw });											// Add to skins
	}

	Clear()																										// CLEAR SKINS
	{
		$("#amsDiv").remove();																						// Remove old overlay
		$("#amsTextDiv").remove();																					// Remove text box
		}

	Draw(paneId, skin, div)																						// DRAW SKIN ON PANE
	{
		this.Clear();																								// Clear old overlays
		if (!skin) return;																							// Quit if nothing
		var i,o,d,y;
		this.curSkin=skin;																							// Set curent skin
		var x=$(div).offset().left, y=$(div).offset().top;															// Position of base
		var w=$(div).width(), 		h=$(div).height();																// Size
		var str="<div id='amsDiv' style='position:absolute;";														// Add overlay
		str+="top:"+y+"px;left:"+x+"px;width:"+w+"px;height:"+h+"px"												// Position over base
		if (this.settings["background-color"])	str+=";background-color:"+this.settings["background-color"];		// Background color
		if (this.settings["opacity"])			str+=";opacity:"+this.settings["opacity"]/100;						// Opacity
		str+="'>";
	
		for (i=0;i<skin.items.length;++i) {																			// For each item
			o=skin.items[i];																						// Point at item
			y=o.y*w/100;																							// Y is based on % of width
			if (o.type == "hover") {																				// A hover event
				x=o.x-(o.d/2);		y=o.y-(o.d/2); 		d=Math.round(w*o.d/100);									// Define area
				str+="<div id='amsClick-"+i+"' style='position:absolute;";											// Add capture div
				str+="top:"+y+"px;left:"+x+"%;width:"+d+"px;height:"+d+"px'";										// Position over base
				str+=" onmouseenter='app.ams.SendActions(\""+o.yes+"\")'";											// Over area
				str+=" onmouseleave='app.ams.SendActions(\""+o.no+"\")'";											// Out
				str+="></div>";
				}
			else if (o.type == "pic") {																				// A pic event
				str+="<img id='amsPic-"+i+"' src='"+o.pic+"' style='position:absolute;";							// Add pic
				str+="top:"+y+"px;left:"+o.x+"%;width:"+o.w+"%;"													// Position and size
				if (o.motion) 	str+="display:none;";																// Hide if animating
				if (o.alpha) 	str+="opacity:"+o.alpha/100;														// Add alpha
				str+="'>";													
				}
			else if (o.type == "text") {																			// A text event
				str+="<div id='amsText-"+i+"' type='text' style='font-size:18px;color:#fff;font-weight:bold;";		// Add div
				str+="cursor:pointer;position:absolute;top:"+y+"px;left:"+o.x+"%;";									// Position 
				if (o.style) str+=o.style;		str+="'";															// Add style
				str+=">"+o.text+"</div>";																			// Add text to show
				}
			else if (o.type == "type") {																			// A type event
				str+="<input id='amsType-"+i+"' type='text' style='position:absolute;border:none;";					// Add type
				str+="border-radius:16px;font-size:16px;padding:2px 8px;";
				str+="top:"+y+"px;left:"+o.x+"%;width:"+o.w+"%;";													// Position and size
				if (o.style) str+=o.style;		str+="'";															// Add style
				if (o.place) str+=" placeholder='"+o.place+"'";														// Add placeholder
				str+=">";
				}
			else if (o.type == "button") {																			// A button event
				str=str+"<"+(isMobile ? "div" : "button");															// Div if mobile
				str+=" id='amsBut-"+i+"' type='button' style='position:absolute;background-color:#eee;";			// Add button
				str+="top:"+y+"px;left:"+o.x+"%;border-radius:16px;font-size:16px;padding:2px 8px;";				// Position and size
				if (o.style) str+=o.style;																			// Add style
				str=str+"'>"+o.label+"</"+(isMobile ? "div>" : "button>");											// Div if mobile
				}
			else if (o.type == "drag") {																			// A drag event
				str+="<img id='amsDrag-"+i+"' src='"+o.pic+"' style='position:absolute;cursor:pointer;";			// Add pic
				str+="top:"+y+"px;left:"+o.x+"%;width:"+o.w+"%'";													// Position and size
				str+=">";
			}
			}
		x=$(div).offset().left;	 y=$(div).offset().top+$(div).height();												// Position
		var h2=$("#nextBut").offset().top-y;																		// Size
		str+="</div><div id='amsTextDiv' style='position:absolute;text-align:center;font-size:14px;";				// Add overlay text area
		str+="top:"+y+"px;left:"+x+"px;width:"+w+"px;height:"+h2+"px'></div>"										// Position below
		$("body").append(str);																						// Add overlay

		for (i=0;i<skin.items.length;++i) {																			// For each item
			o=skin.items[i];																						// Point at item
			if (o.type == "drag") {																					// A drag event
				$("#amsDrag-"+i).draggable({ stop:(e,ui)=> {														// Make it draggable
					o=skin.items[e.target.id.substr(8)];															// Point at item
					var x=(ui.position.left-0+e.target.width/2)/w*100;												// Get center point X as %
					var y=(ui.position.top-0+e.target.height/2)/w*100;												// Get center point Y as %
					d=o.d/2;																						// Half dx
					if ((x > o.x2-d) &&  (x < o.x2-0+d) && (y > o.y2-d)  && (y < o.y2-0+d))							// In hotspot
						o.right=1,this.SendActions(o.yes);															// Perform yes actions
					else																							// No
						this.SendActions(o.no);																		// Perform no actions
					}});
				}
			else if (o.type == "pic") {																				// A pic event
				if (o.motion) {
					var m=o.motion.toLowerCase();																	// Motion spec'd
					if (m == "fade in")		$("#amsPic-"+i).fadeIn(800);											// Fade in
					else if (m == "center zoom") {																	// Zoom out
						$("#amsPic-"+i).css({width:0,left:o.x-0+o.w/2+"%",top:o.y-0+o.w/2+"%"}); 					// Starting pos
						$("#amsPic-"+i).show(0);																	// Show it		
						$("#amsPic-"+i).animate({ left: o.x+"%",top: o.y+"%",width:+o.w+"%"});						// Zoom out
						}
					else if (m == "bottom zoom") {																	// Zoom from bottom
						$("#amsPic-"+i).css({width:0,left:o.x-0+o.w/2+"%",top:"100%"}); 							// Starting pos
						$("#amsPic-"+i).show(0);																	// Show it		
						$("#amsPic-"+i).animate({ left: o.x+"%",top: o.y+"%",width:+o.w+"%"});						// Zoom out
						}
					else if (m == "top zoom") {																		// Zoom from top
						$("#amsPic-"+i).css({width:0,left:o.x-0+o.w/2+"%",top:0}); 									// Starting pos
						$("#amsPic-"+i).show(0);																	// Show it		
						$("#amsPic-"+i).animate({ left: o.x+"%",top: o.y+"%",width:+o.w+"%"});						// Zoom out
						}
					}
				$("#amsPic-"+i).on("click", (e)=> {																	// On click
					o=skin.items[e.target.id.substr(7)];															// Point at item
					this.SendActions(o.yes);																		// Send action
					o.right=1;																						// Correct
					});
				}
			if (o.type == "button") {																				// A button event
				$("#amsBut-"+i).on("click", (e)=> {																	// On click
					o=skin.items[e.target.id.substr(7)];															// Point at item
					this.SendActions(o.yes);																		// Send action
					o.right=1;																						// Correct
					});
				}
			else if (o.type == "text") {																			// A type event
				$("#amsText-"+i).on("click", (e)=> {																	// On click
					o=skin.items[e.target.id.substr(8)];															// Point at item
					this.SendActions(o.yes);																		// Send action
					o.right=1;																						// Correct
					});
				}
			else if (o.type == "type") {																			// A type event
				$("#amsType-"+i).on("change", (e)=> {																// On enter
					o=skin.items[e.target.id.substr(8)];															// Point at item
					if ((o.value.toLowerCase() == $("#"+e.target.id).val().toLowerCase()) || !o.value)				// A math or no value				
						this.SendActions(o.yes,$("#"+e.target.id).val());											// Send yes action and value
					else
						this.SendActions(o.no,$("#"+e.target.id).val());											// Send no action and value
					o.right=1;																						// Correct
					});
				}
			else if (o.type == "banner") {																			// A banner event
				$("#amsTextDiv").html(o.text);																		// Show it
				if (o.sound) {																						// If sound																							
					str=o.sound.toLowerCase();																		// Make lc
				if ((str == "ding") || (str == "click") || (str == "delete"))		Sound(str)						// Built in sound
				else																Sound(o.sound);					// MP3
				}	
			}
		}

		$("#amsDiv").on("click", (e)=> {																			// On click
			x=(e.offsetX)/w*100;	y=(e.offsetY)/w*100;															// As %s
			if (e.altKey)			PopUp(x.toFixed(3)+","+y.toFixed(3),4000);										// Show pos
			for (i=0;i<skin.items.length;++i) {																		// For each item
				o=skin.items[i];																					// Point at item
				if (o.type == "click")	{																			// If a click event
					d=o.d/2;																						// Half dx
					if ((x > o.x-d) &&  (x < o.x-0+d) && (y > o.y-d)  && (y < o.y-0+d))	{							// In hotspot
						o.right=1;																					// Right
						this.SendActions(o.yes);																	// Perform yes actions
						return;
						}
					this.SendActions(o.no);																			// Perform no actions
					}		
				}
	
			});
	}

	SendActions(acts, param)																					// SEND ACTIONS
	{
		var i,o,v,s,macro;
		if (!acts)	return;																							// Nothing to do
		if ((macro=acts.match(/~(.*?)~/))) {																		// Extract macro
			if (macro[0] != "~p~")																					// If not param
				acts=acts.replace(RegExp(macro[0]),this.macros[macro[1]]);											// Replace
			}
		acts=acts.split('+');																						// Split into array of actions
		for (i=0;i<acts.length;++i) {																				// For each action
			if (acts[i].match(/~p~/) && param) 																		// Params macro
				acts[i]=acts[i].replace(/~p~/g,param);																// Replace with param
			o=acts[i].split(':');																					// Split off opcode
			s=o[0].toLowerCase();																					// Make lc
			if (s == "banner")																						// BANNER
				$("#amsTextDiv").html(o[1]);																		// Show it
			else if (s == "sound") {																				// SOUND
				s=o[1].toLowerCase();																				// Make lc
				if ((s == "ding") || (s == "click") || (s == "delete"))		Sound(s)								// Built in sound
				else														Sound(o[1]);							// MP3
				}
			else if (s == "goto") 																				// GOTO
				app.msg.OnMessage({ data:"ActiveMediaSkin=goto|"+o[1]});											// Send goto message
			else if (s == "show") 																				// SHOW
				app.msg.OnMessage({ data:"ActiveMediaSkin=show|"+o[1]});											// Send show message
			else if (s == "report") 																			// REPORT
				app.msg.OnMessage({ data:"ActiveMediaSkin=report|"+o[1]+"|"+this.curSkin.id});						// Send report message
			else if (s == "clear") 																				// CLEAR
				this.Clear();																						// Clear skin
			else if (s == "play") {																				// PLAY
				this.Clear();																						// Clear skin
				SendToIframe("ScaleAct=play"+(o[1] ? "|"+o[1] : ""));												// Send play to iFrame
				}
			else if (s == "var") 																				// VAR
				app.doc.vars[o[1].split('=')[0]]=o[1].split('=')[1];												// Set var
			else if (s == "if") {																				// IF
				var act=false;																						// Assume nothing
				o[1]=o[1].replace(/ +/g," ");																		// Single space
				for (i=2;i<o.length;++i)	o[1]+=":"+o[i];															// Rejoin colon'd off pieces
				v=o[1].split(" ");																					// Split by space														
				if (v.length < 5)	return;																			// Skip if not well formed
				s=app.doc.vars[v[0]];																				// Get var value
				switch(v[1].toUpperCase()) {																		// Route on verb
					case "EQ": if (s == v[2])		act=true;	break;												// EQ							
					case "NE": if (s != v[2])		act=true;	break;												// NE							
					case "GT": if (s >  v[2])		act=true;	break;												// GT							
					case "GE": if (s >= v[2])		act=true;	break;												// GE							
					case "LT": if (s <  v[2])		act=true;	break;												// LT							
					case "LE": if (s <= v[2])		act=true;	break;												// LE							
					}
				if (act) 	this.SendActions(v[3]);																	// Yes action
				else 		this.SendActions(v[4])																	// No action
				}
			}
		this.CheckGroups();																							// Check to see if agroup rule needs to be triggered			
		}

		CheckGroups()																							// CHECK GROUPS TO TEST TRIGGER
		{
			var i,j,o,n,mem;
			for (i=0;i<this.curSkin.items.length;++i) {																// For each item
				o=this.curSkin.items[i];																			// Point at item
				if (o.type != "group")	continue;																	// Only groups
				n=0;																								// Reset counter
				mem=o.members.split("+");																			// Into array
				for (j=0;j<mem.length;++j) 																			// For each group member
					n+=this.curSkin.items[mem[j]-1].right;															// Add right/wrong count
				if ((n == mem.length) && !o.right)																	// Done, but do only once
					++o.right,this.SendActions(o.yes);																// Send right
				}
			}

}