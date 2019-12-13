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
		if (!msg || (typeof msg != "string"))																		// Nothing there
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
			for (i=1;i<v.length-1;++i) {																			// For each step
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
				app.con.Draw(app.con.resumeId);																		// Init player
			else{																									// Normal end
				app.doc.NextLob(); 																					// Advance to next pos
				app.Draw();																							// Redraw
				}
			var j=app.doc.FindLobIndexById(v[1]);																	// Get assessment lob index
			if (app.setDone && (j >= 0))																			// If setting																	
				app.doc.SetStatus(j,(v[2]-0 >= app.assessLevel-0) ? 10 : 0);										// If after pass level, set status
			app.con.resumeId=app.con.resumeTime=0;																	// Clear resume
			app.rul.CheckRules("assess",id,Math.floor(v[2]*100));													// Send to rules
			app.msg.SaveToForm("Assess"+v[1]+"="+Math.floor(v[2]*100));												// Save final score to form, if set		
			}
		else if (msg.match(/Assess=answer/)) {																		// Assessment module loaded
			if (app.con.resumeId)																					// In a trigger
				app.rul.CheckRules("answer",app.con.triggerId+":"+v[2],v[3]);										// Send trigger id to rule checker
			else																									// Direct
				app.rul.CheckRules("answer",app.doc.curLobId+":"+v[2],v[3]);										// Send to rule checker
			if (app.reportLevel == 1)																				// If reporting answers
				app.msg.SaveToForm("Answer"+app.doc.curLobId+":"+v[2]+"="+v[3]);									// Save answer to form, if set		
			}
		else if (msg.match(/ScaleVideo/)) {																			// Video event
			if (msg.toLowerCase() == "scalevideo=next") {															// Advance to next pos
				app.doc.NextLob();																					// Advance
				app.Draw();																							// Draw																																		
				return;
				}
			if (v[0].toLowerCase() == "scalevideo=notes") 															// Toggle notes
				app.con.VideoNotes();																				// Show notes dialog
			if (v[0].toLowerCase() == "scalevideo=trans") 															// Toggle transcription
				app.con.Transcript(v[1]);																			// Show transcription dialog
			if (v[0].toLowerCase() == "scalevideo=toc") 															// Toggle TOC
				app.con.TableOfContents(v[1]);																		// Show TOC dialog
			if (v[0].toLowerCase() == "scalevideo=time") 															// Incoming time
				app.con.playerNow=v[1];
			if (msg.match(/trigger/)) {																				// Hit a trigger point
				if (v[1].toLowerCase() == "next") {																	// Advance to next pos
					app.doc.NextLob();																				// Advance
					app.Draw();																						// Draw																																		
					return;
					}
				var o=app.doc.FindLobById(v[1]);																	// Point at triggered lob (typically an assessment)
				if (!o) {																							// Look for skin
					o=app.doc.FindLobById(v[1],app.ams.skins);														// Get skin												
					app.ams.Draw(app.doc.curLobId,o,"#contentIF");													// Draw skin
					return;																							// Quit 
					}
				if (o.body.match(/assess\(/i)) {																	// If an assessment
					app.con.triggerId=v[1];																			// Store trigger id
					app.con.resumeId=app.doc.curLobId;																// Store resume id
					app.con.resumeTime=v[2];																		// Store resume time
					}
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
		else if (msg.match(/ActiveMediaSkin/)) {																	// AMS
			if (msg.match(/show/)) 																					// Show pane
				app.con.Draw(v[1]-0);																				// Go	
			else if (msg.match(/goto/)) {																			// Goto pane
				if (v[1].toLowerCase() == "next")																	// Advance to next pos
					app.doc.NextLob(),app.Draw();																	// Go 																				
				else																								// To a specific pane
					app.Draw(app.doc.FindLobIndexById(v[1]-0))														// Go	
				}
			else if (msg.match(/report/)) 																			// REPORT
				app.msg.SaveToForm("Skin"+v[2]+"="+v[1]);															// Save value to form, if set		
			}
		else if (msg.match(/ScaleSnap/)) {																			// SCALE
			if (msg.match(/show/)) 																					// Show pane
				app.con.Draw(v[1]-0);																				// Go	
			else if (msg.match(/goto/)) {																			// Goto pane
				if (v[1].toLowerCase() == "next")																	// Advance to next pos
					app.doc.NextLob(),app.Draw();																	// Go 																				
				else																								// To a specific pane
					app.Draw(app.doc.FindLobIndexById(v[1]-0))														// Go	
				}
			else if (msg.match(/report/)) 																			// REPORT
				app.msg.SaveToForm("Skin"+v[2]+"="+v[1]);															// Save value to form, if set		
			}
		else
			trace(msg)
		}

		SaveToForm(data)																						// SAVE DATA TO FORM
		{
			var d={};
			if (!app.reportLink)	return;																			// Invalid link
			var url=app.reportLink.split("/viewform?")[0]+"/formResponse";											// Extract post url
			var nam=app.reportLink.match(/entry.[0-9]*=name/i)[0].split("=");										// Extract name
			var dat=app.reportLink.match(/entry.[0-9]*=data/i)[0].split("=");										// Extract data
			d[nam[0]]=(app.namePrefix ? app.namePrefix+':' : "") + app.userName;									// Use username from login																	
			d[dat[0]]=data;																							// Set data
			$.ajax({ url: url, data: d,  type: "POST",  dataType: "xml" });											// Will generate CORS error, but posts anyway
			}
}