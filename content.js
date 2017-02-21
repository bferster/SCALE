class Content  {
    constructor()   {
        }
    Draw() {
        this.UpdateHeader()    
    }
    
    UpdateHeader() {
        var o=app.doc.lessons;
        var t=o[app.curLesson].topics[app.curTopic];
        var s=t.concepts[app.curConcept].steps[app.curStep];
      
        $("#lessonTitle").html(o[app.curLesson].name);
        $("#topicTitle").html(t ? t.name : "");
        $("#stepTitle").html(s ? s.name.toUpperCase() : "");
        $("#userName").html(app.doc.firstName+" "+app.doc.lastName);
        if (s.name)
            $("#stepImg").prop("src","img/"+s.name+".png");  




    }

}

