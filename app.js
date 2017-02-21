class App  {
    constructor()   {
        this.name="WriteMao";
        this.doc=new Doc();
        this.content=new Content();
        this.draw();  
     }
     draw() {
        this.content.draw();
     }
}
