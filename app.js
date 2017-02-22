///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// APP
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class App  {                                                                                                            // APP
    constructor()   {
        app=this;
        this.curLesson=this.curTopic=this.curConcept=this.curStep=this.curPage=0;
        this.name="WriteMao";
        this.doc=new Doc();
        this.con=new Content();
        this.nav=new Navigation();
        this.Draw(); 
     }
     
    Draw() {                                                                                                            // REDRAW
        this.wid=$(window).width();                                                                                         // Get window width
        this.hgt=$(window).height();                                                                                        // Height
        this.con.Draw();                                                                                                    // Draw container & header
        this.nav.Draw();                                                                                                    // Draw navigator
     }
}
