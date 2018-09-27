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
		if (evts.length)	this.skins.push({ id:id, name:name, skins:evts, body:raw });							// Add to skins
		}

	Draw(num)
	{
	}

}