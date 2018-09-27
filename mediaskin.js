// MEDIA SKIN /////////////////////////////////////////////////////////////////////////////////////////////////////////

class MediaSkin {
	
	constructor()																								// CONSTRUCTOR
	{
		this.skins=[];																							// Holds skins
	}

	AddSkin(id, name, raw)																						// PARSE SKIN SPEC AND ADD
	{
		var e,i,j,v,o,evts=[];
		if (!raw) return;																							// Quit if no data
		raw=raw.replace(/\n|\r|\t/g,"");																			// Remove CR/LF/Tab
		raw=raw.replace(/<\/*p>/g,"");																				// Remove <p>s
		raw=raw.replace(/&nbsp;/g,"");																				// Remove spaces
		raw=raw.replace(/=/g,",");																					// = to ,
		e=raw.split("|");																							// Split into events
		for (i=0;i<e.length;++i) {																					// For each event
			v=e[i].split(",");																						// Split into fields
			for (j=0;j<v.length;++j) 	v[j]=v[j].trim();															// Trim fields
			o={};																									// Init obj
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
			else if ((o.type == "pic") && (v.length > 6)) {															// Valid pic event
				o.x=v[1];	o.y=v[2];	o.d=v[3];																	// Position
				o.pic=v[4];	o.w=v[5];																				// Pic to drag
				o.yes=v[6] ? v[6] : "";																				// Yes action
				o.no=v[7] ? v[7] : "";																				// No action
				evts.push(o);																						// Add event
				}
			else if ((o.type == "type") && (v.length > 5)) {														// Valid type event
				o.x=v[1];	o.y=v[2];	o.w=v[3];																	// Position
				o.style=v[4];	o.value=v[5];	o.title=[5];														// Pic to drag
				o.yes=v[6] ? v[6] : "";																				// Yes action
				o.no=v[7] ? v[7] : "";																				// No action
				evts.push(o);																						// Add event
				}
			}
		if (evts.length)	this.skins.push({ id:id, name:name, items:evts, body:raw });							// Add to skins
		}

	Draw(paneId, skin, div)																							// DRAW SKIN ON PANE
	{
		if (!skin) return;																							// Quit if nothing
		var i,o,d;
		var x=$(div).offset().left, y=$(div).offset().top;															// Position of base
		var w=$(div).width(), 		h=$(div).height();																// Size
		$("#amsDiv").remove();																						// Remove old overlay
		var str="<div id='amsDiv' style='position:absolute;";														// Add overlay
		str+="top:"+y+"px;left:"+x+"px;width:"+w+"px;height:"+h+"px'>";												// Position over base

		for (i=0;i<skin.items.length;++i) {																			// For each item
			o=skin.items[i];																						// Point at item
			if ((o.type == "click") || (o.type == "hover")) {														// A click or hover event
				x=o.x-(o.d/2);		y=o.y-(o.d/2); 		d=Math.round(w*o.d/100);									// Define area
				str+="<div id='click-"+i+"' style='position:absolute;opacity:.3;background-color:blue;pointer-events: none;";			// Add capture div
				str+="top:"+y+"%;left:"+x+"%;width:"+d+"px;height:"+d+"px;border-radius:"+d+"px'";					// Position over base
				str+="></div>";
			}
		}
		$("body").append(str+"</div>");																				// Add overlay
		$("#amsDiv").on("click", (e)=> {																			// On click
			x=(e.offsetX)/w*100;	y=(e.offsetY)/h*100;															// As %s
			for (i=0;i<skin.items.length;++i) {																		// For each item
				o=skin.items[i];																					// Point at item
				if (o.type == "click")	{																			// If a click event
					d=o.d/2;																						// Half dx
					if ((x > o.x-d) &&  (x < o.x-0+d) && (y > o.y-d)  && (y < o.y-0+d))	{							// In hotspot
						this.SendActions(o.yes);																	// Perform yes actions
						return;
						}
					this.SendActions(o.no);																			// Perform no actions
					}		
				}
	
			});

	}


	SendActions(acts)																							// SEND ACTIONS
	{
		trace (acts)
	}


}