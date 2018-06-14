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
		else if (msg.match(/ShivaMap=marker/)) 																		// On map click
			MenuBarMsg("You clicked marker at "+v[3]+","+v[4]);														// React							
		else if (msg.match(/Assess=ready/)) {																		// Assessment module loaded
			var i,o;
			var str='ScaleAct=data|{"pages":[';																		// Header
			for (i=1;i<v.length;++i) {																				// For each step
				o=app.doc.FindAskById(v[i]);																		// Point at step
				if (!o)	continue;																					// Invalid step
				str+=o.step;																						// Add step
				if (i != v.length-1)	str+=",\n";																	// Not last, add comma
				else					str+="]}";																	// Last, close array/object										
				}	
			source.postMessage(str,"*");																			// Send data to window
			}
		else if (msg.match(/Assess=done/)) {																		// Assessment module loaded
			if (app.con.resumeId)																					// If a resume set
				app.con.Draw(app.doc.curLobId);																		// Init player
			else{																									// Normal end
				app.doc.NextLob(); 																					// Advance to next pos
				app.Draw();																							// Redraw
				}
			app.con.resumeId=app.con.resumeTime=0;																	// Clear resume
			trace("Done with "+Math.floor(v[1]*100)+"%");															// Send to rules
			}
		else if (msg.match(/Assess=answer/)) {																		// Assessment module loaded
			trace("answer",app.doc.curLobId+":"+v[1],v[2]);															// Sedn to rule checker
			}	
		else if (msg.match(/ScaleVideo=play/)) 																		// Video play event
			app.rul.CheckRules("play",v[1]);																		// Match rule
		else if (msg.match(/ScaleVideo/)) {																			// Video event
			if (msg.match(/next/)) {																				// Go onto next event
				app.doc.NextLob(); 																					// Advance to next pos
				app.Draw();																							// Redraw
				}
			if (msg.match(/trigger/)) {																				// Hit a trigger point
				app.con.resumeId=app.doc.curLobId;																	// Store resume id
				app.con.resumeTime=v[2];																			// Store resume time
				app.con.Draw(v[1]);																					// Draw content
				}
			}
		else
			trace(msg)
		}
		

}