///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// APP
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class App  {																									 // APP

	constructor()   {
		app=this;
		this.allowResize=true;																						// Redraw after a resize
		this.doc=new Doc();																							// Alloc doc
		this.con=new Content();																						// Content
		this.nav=new Navigation();																					// Navigation
		this.Draw(); 																								// Draw app
		}
 
	Draw(mapIndex) {																							// REDRAW
		if ((mapIndex != undefined) && (mapIndex != -1))															// A valid index
			app.doc.curMapPos=mapIndex;																				// Set new index
		this.wid=$(window).width();																					// Get window width			
		this.hgt=$(window).height();																				// Height
		app.doc.Draw();																								// Reset various params
		this.con.Draw();																							// Draw container
		this.nav.Draw();																							// Draw navigator and header
		}
}
