///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MESSAGING
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Messaging {
	
	constructor() {																								// CONSTRUCTOR
		}
	
	OnMessage(msg) {																							// ON MESSAGE
		var v;
		if (!msg)																									// Nothing there
			return;																									// Quit
		v=msg.split("|");																							// Chop into params
		if (msg.match(/ShivaGraph=click/)) 																			// On graph click
			MenuBarMsg("You clicked on "+v[2]);																		// React							
		else if (msg.match(/ShivaChart=click/)) 																	// On chart click
			MenuBarMsg("You clicked on "+v[2]);																		// React							
		else if (msg.match(/ShivaMap=click/)) 																		// On map click
			MenuBarMsg("You clicked on "+v[2]+","+v[3]);															// React							
//		else if (msg.match(/ShivaMap=move/)) 																		// On map move
//			MenuBarMsg("You moved map to "+v[2]+","+v[3]+","+v[4]);													// React							
		else
			trace(msg)
		}

}