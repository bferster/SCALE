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