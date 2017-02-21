class App  {
    constructor()   {
        app=this;
        this.curLesson=this.curTopic=this.curConcept=this.curStep=0;
        this.name="WriteMao";
        this.doc=new Doc();
        this.con=new Content();
        this.nav=new Navigation();
        this.Draw(); 
     }
     
     Draw() {
        this.con.Draw();
        this.nav.Draw();
     }
}
