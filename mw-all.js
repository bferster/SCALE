///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// APP
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class App  {                                                                                                            // APP
    constructor()   {
        app=this;
        this.curLesson=this.curTopic=this.curConcept=this.curStep=0;
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
var demoCur={
    name:"WriteMao",
    lessons:    [ { name: "Clauses", depends:[0], id:1,
        topics:     [ { name: "Separating clauses", depends:[0], id:1,
            concepts:   [ { name: "Using semicolons", depends:[0], id:1,
                steps:      [ { name: "tell", depends:[0], id:1 },
                            { name: "show", depends:[0], id:2 }, 
                            { name: "find", depends:[0], id:3 },
                            { name: "do", depends:[0], id:4 } ] 
                }]
             }]
        }]
    };

class Doc  {
    constructor(o)   {
        o=demoCur;  // demo //
        this.name=o.name ? o.name : "";
        this.lessons=o.lessons ? o.lessons : [];
        this.firstName="Jerry";
        this.lastName="Bruner";
        app.c=this.lessons;    
    }
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
    constructor()   {
        }
    
    Draw() {                                                                                                            // REDRAW
        var h=app.hgt-$("#headerDiv").height()-$("#navDiv").height();
        this.UpdateHeader();
        $("#contentDiv").height(h-66);

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NAVIGATION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Navigation {
    constructor() {

    }
    Forward() {
  //      if (app.curStep < )





    }
    Back() {
    }
    Draw() {                                                                                                            // REDRAW
        var w=$(window).width()-32;                                                                                         // Get window width
        var h=$(window).height()-$("#navDiv").height()-16;                                                                  // Height
        $("#navDiv").css({top:h+"px",width:w+"px"});                                                                        // Position at bottom
        }
}