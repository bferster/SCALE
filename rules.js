///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RULES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Rules {
	
	constructor() 																								// CONSTRUCTOR
	{	
		this.rules=[];																								// Holds rule
	}
	
	CheckRules(op, subject, value) 																				// CHECK RULES FOR MATCH
	{	
		var i,o,act=false;
		var n=this.rules.length;																					// Number of rules
		for (i=0;i<n;++i) {																							// For each rule
			o=this.rules[i];																						// Point at it
			if (o.subject != subject) 																				// Rule doesn't match IF target	
			continue;																								// Next																			
			switch(o.verb.toUpperCase()) {																			// Route on verb
				case "EQ": if (value == o.trigger)		act=true;	break;											// EQ							
				case "NE": if (value != o.trigger)		act=true;	break;											// NE							
				case "GT": if (value >  o.trigger)		act=true;	break;											// GT							
				case "GE": if (value >= o.trigger)		act=true;	break;											// GE							
				case "LT": if (value <  o.trigger)		act=true;	break;											// LT							
				case "LE": if (value <= o.trigger)		act=true;	break;											// LE							
				}
			if (act)																								// If act
				this.RunRule(o.do,o.object);																		// Run rule																		
			}
	}

	RunRule(op, what)																							// RUN RULE
	{
		var v=what.split(":");																						// Split object
		if ((what.charAt(0) == '+') || (what.charAt(0) == '-'))														// If relative jump
			what=app.doc.lobs[(app.doc.curPos-0)+(what-0)].id;														// Get id
			switch(op.toUpperCase()) {																				// Route on verb
			case "SHOW": 	app.con.Draw(what-0);						break;										// SHOW							
			case "GOTO": 	app.Draw(app.doc.FindLobIndexById(what-0));	break;										// GOTO index						
			case "VAR": 	app.doc.vars[v[0]]=v[1];					break;										// SET VAR						
			case "SEND":	SendToIframe(what,"#contentIFWidget");		break;										// SEND TO IFRAME
			case "STATUS": 																							// STATUS
				var l=app.doc.FindLobById(v[0]);																	// Point at lob
				if (l) {
					if (v[1].charAt(0) == "+")		l.status+=(v[1]-0);												// Set status incremental up
					else if (v[1].charAt(0) == "-")	l.status=Math.max(0,l,status+(v[1]-0));							// Down
					else							l.status=(v[1]-0);												// Absolute
					}
				app.nav.Draw();																						// Redraw nav
				break;		
			case "REPORT": 																							// REPORT
				app.msg.SaveToForm("Report="+what);																	// Save value to form, if set		
				break;		
			}
	}



}


