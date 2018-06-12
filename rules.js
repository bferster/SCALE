///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RULES
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Rules {
	
	constructor() {																								// CONSTRUCTOR
		this.rules=[];																								// Holds rule
		}
	
	CheckRules(op, val) {																						// CHECK RULES FOR MATCH
		var i,o;
		var n=this.rules.length;																					// Number of rules
		for (i=0;i<n;++i) {																							// For each rule
			o=this.rules[i];																						// Point at it
			if (o.subject == app.doc.curMapPos) {																	// Rule matches IF target																				
				if ((op == "play") && (Math.abs(val-o.trigger) < .15))	{											// Near trigger point
					SendToIframe("ScaleAct=pause");																	// Pause player
					this.DoAction(o.do,o.object);																	// Do something	
					}
				}
			}
		}
	
	DoAction(what, object)																						// HANDLE ACTION
	{
		if (what.toLowerCase() == "show") 																			// Show a new lob by map
			app.Draw(object);																						// Draw new page
			}
}