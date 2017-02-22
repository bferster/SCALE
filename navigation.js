///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NAVIGATION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Navigation {
    constructor() {

    }
    Forward() {
        var pl=app.doc.lessons[app.curLesson];                                                                     // Point at current lesson
        var pt=pl.topics[app.curTopic];                                                                                     // Point at current topic
        var pc=pt.concepts[app.curConcept];                                                                                 // Point at current concept
        var ps=pc.steps[app.curStep];                                                                                       // Point at current step
        var pp=ps.pages[app.curPage];                                                                                       // Point at current page
       
        if (app.curPage < ps.pages.length-1)                app.curPage++;                                                  // Next page
        else if (app.curStep <pc.steps.length-1)            app.curStep++;                                                  // Next step
        else if (app.curConcept < pt.concepts.length-1)     app.curConcept++;                                               // Next concept
        else if (app.curTopic < pl.topics.length-1 )        app.curTopic++;                                                 // Next topic
        else if (app.curLesson < app.doc.lessons.length-1 ) app.curLesson++;                                                // Next lesson
        else  app.curStep=0;
        app.Draw();                                                                                                         // Redraw
        }
    
    Back() {
    }
    Draw() {                                                                                                            // REDRAW
        var w=$(window).width()-32;                                                                                         // Get window width
        var h=$(window).height()-$("#navDiv").height()-16;                                                                  // Height
        $("#navDiv").css({top:h+"px",width:w+"px"});                                                                        // Position at bottom
        }
}