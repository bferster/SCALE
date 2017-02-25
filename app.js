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
		this.doc.lessons=this.doc.LevelIds(1);																		// Lessons in course
		this.doc.topics=this.doc.LevelIds(2);																		// Topics in this lesson
		this.doc.concepts=app.doc.LevelIds(3);																		// Concepts in this topic
		this.doc.steps=app.doc.LevelIds(4);																			//Steps in this concept
		this.doc.pages=this.doc.LevelIds(5);																		// Pages in this step
		this.con.Draw();																							// Draw container & header
		this.nav.Draw();																							// Draw navigator
		}
}
