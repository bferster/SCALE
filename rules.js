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
			if ((o.object.charAt(0) == '+') || (o.object.charAt(0) == '-'))											// If relative jump
				o.object=app.doc.lobs[(app.doc.curPos-0)+(o.object-0)].id;											// Get id
			switch(o.do.toUpperCase()) {																			// Route on verb
				case "SHOW": 	app.con.Draw(o.object-0);						break;								// SHOW							
				case "GOTO": 	app.Draw(app.doc.FindLobIndexById(o.object-0));	break;								// GOTO index						
				case "VAR": 	app.doc.vars[v[0]]=v[1];						break;								// SET VAR						
				case "STATUS": 																						// STATUS
					var l=app.doc.FindLobById(v[0]);																// Point at lob
					if (l)	l.status=v[1];																			// Set status
					app.nav.Draw();																					// Redraw nav
					break;		
				case "REPORT": 																						// REPORT
					app.msg.SaveToForm("Rule"+o.id+"="+o.object);													// Save value to form, if set		
					break;		
				}
			}
	}
	
}