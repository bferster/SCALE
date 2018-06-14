///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RULES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Rules {
	
	constructor() {																								// CONSTRUCTOR
		this.rules=[];																								// Holds rule
		}
	
	CheckRules(op, subject, value) {																			// CHECK RULES FOR MATCH
		var i,o,v,act=false;
		var n=this.rules.length;																					// Number of rules
		for (i=0;i<n;++i) {																							// For each rule
			o=this.rules[i];																						// Point at it
			if (o.subject != subject) 																				// Rule doesn't match IF target	
				continue;																							// Next																			
			switch(o.verb.toUpperCase()) {																			// Route on verb
				case "EQ": if (value == o.trigger)		act=true;	break;											// EQ							
				case "NE": if (value != o.trigger)		act=true;	break;											// NE							
				case "GT": if (value >  o.trigger)		act=true;	break;											// GT							
				case "GE": if (value >= o.trigger)		act=true;	break;											// GE							
				case "LT": if (value <  o.trigger)		act=true;	break;											// LT							
				case "LE": if (value <= o.trigger)		act=true;	break;											// LE							
				}
			if (!act)																								// Don't act?
				continue;																							// Next																			
			v=o.object.split(":");																					// Split object
			switch(o.do.toUpperCase()) {																			// Route on verb
				case "SHOW": 	app.con.Draw(o.object);				break;											// SHOW							
				case "GOTO": 	app.Draw(o.object);					break;											// GOTO MAP SLOT						
				case "VAR": 	app.doc.vars[v[0]]=v[1];			break;											// SET VAR						
				case "STATUS": 																						// STATUS
					var l=app.doc.FindLobById(v[0]);																// Point at lob
					if (l)	l.status=v[1];																			// Set status
					break;		
					}
			}
		}
	
	DoAction(what, object)																						// HANDLE ACTION
	{
		if (what.toLowerCase() == "show") 																			// Show a new lob by map
			app.Draw(object);																						// Draw new page
			}
}