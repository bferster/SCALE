class App  {
    constructor()   {
        app=this;
        this.curLesson=this.curTopic=this.curConcept=this.curStep=0;
        this.name="WriteMao";
        this.doc=new Doc();
        this.content=new Content();
        this.Draw(); 
     }
     
     Draw() {
        this.content.Draw();
     }
}
