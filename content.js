///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
    constructor()   {
        }
    
    Draw() {                                                                                                            // REDRAW
        var h=app.hgt-$("#headerDiv").height()-$("#navDiv").height();                                                       // Get top
        this.UpdateHeader();                                                                                                // Update header
        $("#contentDiv").height(h-66);                                                                                      // Position nav box
        var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>";                                                 // Add next button
        $("#contentDiv").html(str);                                                                                         // Set content
        $("#nextBut").css({"top":h-64+"px"});                                                                              // Pos next button
        $("#nextBut").on("click",()=> { app.nav.Forward(); ButtonPress("nextBut")} );                                               // On button click, navigate forward   
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

