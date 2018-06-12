///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MESSAGING
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Messaging {
	
	constructor() {																								// CONSTRUCTOR
		}
	
	OnMessage(msg) {																							// ON MESSAGE
		var v;
		var source=msg.source;																						// Get source
		msg=msg.data;																								// Extract just message
		if (!msg)																									// Nothing there
			return;																									// Quit			
		v=msg.split("|");																							// Chop into params
		if (msg.match(/ShivaGraph=click/)) 																			// On graph click
			MenuBarMsg("You clicked on "+v[2]);																		// React							
		else if (msg.match(/ShivaChart=click/)) 																	// On chart click
			MenuBarMsg("You clicked on "+v[2]);																		// React							
		else if (msg.match(/ShivaMap=click/)) 																		// On map click
			MenuBarMsg("You clicked on "+v[2]+","+v[3]);															// React							
		else if (msg.match(/Assess=ready/)) {																		// Assessment module loaded
			var i,j,o;
			var oo=app.doc.FindAssessById(v[1]);																	// Point at assess
			if (!oo)	return;																						// Invalid assessment
			var str="ScaleAct=data|"+JSON.stringify({});															// Get data
			str='ScaleAct=data|{"pages":[';																			// Header
			for (i=0;i<oo.steps.length;++i) {																		// For each step
				j=oo.steps[i]-0;																					// Get step id	
				o=app.doc.FindAskById(j);																			// Point at step
				if (!o)	continue;																					// Invalid step
				str+=o.step;																						// Add step
				if (i != oo.steps.length-1)																			// Not last
					str+=",\n";																						// Add comma
				else																								// Last
					str+="]}";																						// Close array/object										
				}	
			source.postMessage(str,"*");																			// Send data to window
			}
		else if (msg.match(/ScaleVideo=play/)) {																	// Video play event
			trace(v[1]);
			}
		else if (msg.match(/ScaleVideo/)) {																			// Video event
			if (msg.match(/next/)) {																				// Go onto next event
				app.doc.NextLob(); 																					// Advance to next pos
				app.Draw();																							// Redraw
				}
		}
		else
			trace(msg)
		}

}