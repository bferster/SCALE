///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// APP
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class App  {																									 // APP

	constructor()   {
		app=this;
		this.pl=this.pt=this.pc=this.ps=this.pp=null;																// Pointers to curriculum parts
		this.cl=this.ct=this.cc=this.cs=this.cp=0;																	// Current spont in curriculum
		this.name="WriteMao";
		this.doc=new Doc();
		this.con=new Content();
		this.nav=new Navigation();
		this.Draw(); 
		}
 
	Draw() {																									// REDRAW
		this.wid=$(window).width();																					// Get window width			
		this.hgt=$(window).height();																				// Height
		this.con.Draw();																							// Draw container & header
		this.nav.Draw();																							// Draw navigator
		}
}
