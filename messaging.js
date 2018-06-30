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
			app.rul.CheckRules("click",app.doc.curLobId,v[2]);														// Send to rules
		else if (msg.match(/ShivaChart=click/)) 																	// On chart click
			MenuBarMsg("You clicked on "+v[2]);																		// React							
		else if (msg.match(/ShivaMap=click/)) 																		// On map click
			MenuBarMsg("You clicked on "+v[2]+","+v[3]);															// React							
		else if (msg.match(/ShivaMap=marker/)) 																		// On map click
			MenuBarMsg("You clicked marker at "+v[3]+","+v[4]);														// React							
		else if (msg.match(/Assess=ready/)) {																		// Assessment module loaded
			var i,o;
			var str='ScaleAct=data|{"pages":[';																		// Header
			for (i=1;i<v.length-1;++i) {																				// For each step
				o=app.doc.FindAskById(v[i]);																		// Point at step
				if (!o)	continue;																					// Invalid step
				str+=o.step;																						// Add step
				if (i != v.length-2)	str+=",\n";																	// Not last, add comma
				else					str+="]}";																	// Last, close array/object										
			}	
			source.postMessage(str,"*");																			// Send data to window
			}
		else if (msg.match(/Assess=done/)) {																		// Assessment module loaded
			var id=app.doc.curLobId;																				// Save id to assessment
			if (app.con.resumeId)																					// If a resume set
				app.con.Draw(app.doc.curLobId);																		// Init player
			else{																									// Normal end
				app.doc.NextLob(); 																					// Advance to next pos
				app.Draw();																							// Redraw
				}
			var j=app.doc.FindLobIndexById(v[1]);																	// Get assessment lob index
			if (app.setDone && (j >= 0))																			// If setting																	
				app.doc.SetStatus(j,(v[2]-0 >= app.assessLevel-0) ? 10 : 0);										// If after pass level, set status
			app.con.resumeId=app.con.resumeTime=0;																	// Clear resume
			app.rul.CheckRules("assess",id,Math.floor(v[2]*100));													// Send to rules
			}
		else if (msg.match(/Assess=answer/)) 																		// Assessment module loaded
			app.rul.CheckRules("answer",app.doc.curLobId+":"+v[2],v[3]);											// Send to rule checker
		else if (msg.match(/ScaleVideo/)) {																			// Video event
			if (msg.match(/next/)) {																				// Go onto next event
				app.doc.NextLob(); 																					// Advance to next pos
				app.Draw();																							// Redraw
				}
			if (msg.match(/trigger/)) {																				// Hit a trigger point
				var o=app.doc.FindLobById(v[1]);																	// Point at assessment
				app.con.resumeId=app.doc.curLobId;																	// Store resume id
				app.con.resumeTime=v[2];																			// Store resume time
				if (app.skipDone && o && (o.status > 9)) 															// If seen and skipping
					app.con.Draw(app.doc.curLobId);																	// Resume playing
				else																								// Run trigger mob
					app.con.Draw(v[1]);																				// Draw content
				}
			}
		else if (msg.match(/ScalePreview/)) {																		// Preview call
			app.doc.InitFromTSV(msg.substr(13));																	// Init show
			app.Draw();																								// Redraw
			}														
		else
			trace(msg)
		}
		

}