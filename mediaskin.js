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
		raw=raw.replace(/&nbsp;/g,"");																				// Remove spaces
		raw=raw.replace(/\(/g,",");																					// ( to ,
		e=raw.split(")");																							// Split into events

		for (i=0;i<e.length;++i) {																					// For each event
			v=e[i].split(",");																						// Split into fields
			for (j=0;j<v.length;++j) 	v[j]=v[j].trim();															// Trim fields
			o={ right:0 };																							// Init obj
			o.type=v[0].toLowerCase();																				// Set type
			if (((o.type == "click") || (o.type == "hover")) && (v.length > 4)) {									// Valid click/hover event
				o.x=v[1];	o.y=v[2];	o.d=v[3];																	// Position
				o.yes=v[4];																							// Yes action
				o.no=v[5] ? v[5] : "";																				// No action
				evts.push(o);																						// Add event
				}
			else if ((o.type == "drag") && (v.length > 8)) {														// Valid drag event
				o.x1=v[1];	o.y1=v[2];																				// Start position
				o.x2=v[3];	o.y2=v[4];	o.d=v[5]																	// Target position
				o.pic=v[6];	o.w=v[7];																				// Pic to drag
				o.yes=v[8];																							// Yes action
				o.no=v[9] ? v[10] : "";																				// No action
				evts.push(o);																						// Add event
				}
			else if ((o.type == "group") && (v.length > 2)) {														// Valid group event
				o.members=v[1].split("+");																			// Get members																				
				o.yes=v[2];																							// Yes action
				o.no=v[3] ? v[3] : "";																				// No action
				if (o.members.length)	evts.push(o);																// Add event if members
				}
			else if ((o.type == "pic") && (v.length > 4)) {															// Valid pic event
				o.x=v[1];	o.y=v[2];																				// Position
				o.pic=v[3];	o.w=v[4];																				// Pic to drag
				o.yes=v[5] ? v[5] : "";																				// Yes action
				o.no=v[6] ? v[6] : "";																				// No action
				evts.push(o);																						// Add event
				}
			else if ((o.type == "type") && (v.length > 4)) {														// Valid type event
				o.x=v[1];	o.y=v[2];	o.w=v[3];																	// Position
				o.style=v[4];	o.value=v[5];	o.place=v[6];														// Pic to drag
				o.yes=v[7] ? v[7] : "";																				// Yes action
				o.no=v[8] ? v[8] : "";																				// No action
				evts.push(o);																						// Add event
				}
			else if ((o.type == "button") && (v.length > 5)) {														// Valid button event
				o.x=v[1];	o.y=v[2];	o.label=v[3];	o.style=v[4];												// Position
				o.yes=v[5] ? v[5] : "";																				// Yes action
				o.no=v[6] ? v[6] : "";																				// No action
				evts.push(o);																						// Add event
				}
			else if ((o.type.charAt(0) == "~") && (v.length > 1)) 													// Valid macro 
				this.macros[o.type.substr(1)]=v[1];																	// Add macro
			else if ((o.type == "settings")) 																		// Settings
				for (i=1;i<v.length;++i)																			// For each setting
					this.settings[v[i].split('=')[0].toLowerCase()]=v[i].split('=')[1];								// Add to settings object
			}
		if (evts.length)	this.skins.push({ id:id, name:name, items:evts, body:raw });							// Add to skins
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
		var i,o,d;
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
			if (o.type == "hover") {																				// A hover event
				x=o.x-(o.d/2);		y=o.y-(o.d/2); 		d=Math.round(w*o.d/100);									// Define area
				str+="<div id='click-"+i+"' style='position:absolute;";												// Add capture div
				str+="top:"+y+"%;left:"+x+"%;width:"+d+"px;height:"+d+"px'";										// Position over base
				str+=" onmouseenter='app.ams.SendActions(\""+o.yes+"\")'";											// Over area
				str+=" onmouseleave='app.ams.SendActions(\""+o.no+"\")'";											// Out
				str+="></div>";
				}
			else if (o.type == "pic") {																				// A pic event
				str+="<img id='pic-"+i+"' src='"+o.pic+"' style='position:absolute;";								// Add pic
				str+="top:"+o.y+"%;left:"+o.x+"%;width:"+o.w+"%'>";													// Position and size
				}
			else if (o.type == "type") {																			// A type event
				str+="<input id='type-"+i+"' type='text' style='position:absolute;border:none;";					// Add type
				str+="top:"+o.y+"%;left:"+o.x+"%;width:"+o.w+"%;";													// Position and size
				if (o.style) str+=o.style;		str+="'";															// Add style
				if (o.value) str+=" value='"+o.value+"'";															// Add def value
				if (o.place) str+=" placeholder='"+o.place+"'";														// Add placeholder
				str+=">";
				}
			else if (o.type == "button") {																			// A button event
				str+="<button id='but-"+i+"' type='button' style='position:absolute;";								// Add button
				str+="top:"+o.y+"%;left:"+o.x+"%;border-radius:16px;font-size:16px;padding:2px 8px;";				// Position and size
				if (o.style) str+=o.style;																			// Add style
				str+="'>"+o.label+"</button>";																		// Add label
				}
			else if (o.type == "drag") {																			// A drag event
				str+="<img id='drag-"+i+"' src='"+o.pic+"' style='position:absolute;cursor:pointer;";				// Add pic
				str+="top:"+o.y1+"%;left:"+o.x1+"%;width:"+o.w+"%'";												// Position and size
				str+=">";
				}
			}
		x=$(div).offset().left;	 y=$(div).offset().top+$(div).height();												// Position
		var h2=$("#nextBut").offset().top-y;																		// Size
		str+="</div><div id='amsTextDiv' style='position:absolute;";												// Add overlay text area
		str+="top:"+y+"px;left:"+x+"px;width:"+w+"px;height:"+h2+"px'></div>"										// Position below
		$("body").append(str);																						// Add overlay

		for (i=0;i<skin.items.length;++i) {																			// For each item
			o=skin.items[i];																						// Point at item
			if (o.type == "drag") {																					// A drag event
				$("#drag-"+i).draggable({ stop:(e,ui)=> {															// Make it draggable
					o=skin.items[e.target.id.substr(5)];															// Point at item
					var x=(ui.position.left-0+e.target.width/2)/w*100;												// Get center point X as %
					var y=(ui.position.top-0+e.target.height/2)/h*100;												// Get center point X as %
					d=o.d/2;																						// Half dx
					if ((x > o.x2-d) &&  (x < o.x2-0+d) && (y > o.y2-d)  && (y < o.y2-0+d))							// In hotspot
						o.right=1,this.SendActions(o.yes);															// Perform yes actions
					else																							// No
						this.SendActions(o.no);																		// Perform no actions
					}});
				}
			else if (o.type == "pic") {																				// A pic event
				$("#pic-"+i).on("click", (e)=> {																	// On click
					o=skin.items[e.target.id.substr(4)];															// Point at item
					this.SendActions(o.yes);																		// Send action
					o.right=1;																						// Correct
					});
				}
			if (o.type == "button") {																				// A button event
				$("#but-"+i).on("click", (e)=> {																	// On click
					o=skin.items[e.target.id.substr(4)];															// Point at item
					this.SendActions(o.yes);																		// Send action
					o.right=1;																						// Correct
					});
				}
			else if (o.type == "type") {																			// A type event
				$("#type-"+i).on("change", (e)=> {																	// On enter
					o=skin.items[e.target.id.substr(5)];															// Point at item
					this.SendActions(o.yes,$("#"+e.target.id).val());												// Send action and value
					o.right=1;																						// Correct
					});
				}
			}
		
		$("#amsDiv").on("click", (e)=> {																			// On click
			x=(e.offsetX)/w*100;	y=(e.offsetY)/h*100;															// As %s
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
				this.Clear(),trace(1111);																						// Clear skin
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
			var i,j,o,n;
			for (i=0;i<this.curSkin.items.length;++i) {																// For each item
				o=this.curSkin.items[i];																			// Point at item
				if (o.type != "group")	continue;																	// Only groups
				n=0;																								// Reset counter
				for (j=0;j<o.members.length;++j)																	// For each group member
					n+=this.curSkin.items[o.members[j]-1].right;													// Add right/wrong count
				if ((n == o.members.length) && !o.right)															// Done, but do only once
					++o.right,this.SendActions(o.yes);																// Send right
				}
			}

}