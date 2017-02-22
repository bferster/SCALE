"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// APP
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var App = function () {
    // APP
    function App() {
        _classCallCheck(this, App);

        app = this;
        this.curLesson = this.curTopic = this.curConcept = this.curStep = 0;
        this.name = "WriteMao";
        this.doc = new Doc();
        this.con = new Content();
        this.nav = new Navigation();
        this.Draw();
    }

    _createClass(App, [{
        key: "Draw",
        value: function Draw() {
            // REDRAW
            this.wid = $(window).width(); // Get window width
            this.hgt = $(window).height(); // Height
            this.con.Draw(); // Draw container & header
            this.nav.Draw(); // Draw navigator
        }
    }]);

    return App;
}();

var demoCur = {
    name: "WriteMao",
    lessons: [{ name: "Clauses", depends: [0], id: 1,
        topics: [{ name: "Separating clauses", depends: [0], id: 1,
            concepts: [{ name: "Using semicolons", depends: [0], id: 1,
                steps: [{ name: "tell", depends: [0], id: 1 }, { name: "show", depends: [0], id: 2 }, { name: "find", depends: [0], id: 3 }, { name: "do", depends: [0], id: 4 }]
            }]
        }]
    }]
};

var Doc = function Doc(o) {
    _classCallCheck(this, Doc);

    o = demoCur; // demo //
    this.name = o.name ? o.name : "";
    this.lessons = o.lessons ? o.lessons : [];
    this.firstName = "Jerry";
    this.lastName = "Bruner";
    app.c = this.lessons;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var Content = function () {
    function Content() {
        _classCallCheck(this, Content);
    }

    _createClass(Content, [{
        key: "Draw",
        value: function Draw() {
            // REDRAW
            var h = app.hgt - $("#headerDiv").height() - $("#navDiv").height();
            this.UpdateHeader();
            $("#contentDiv").height(h - 66);
        }
    }, {
        key: "UpdateHeader",
        value: function UpdateHeader() {
            var o = app.doc.lessons;
            var t = o[app.curLesson].topics[app.curTopic];
            var s = t.concepts[app.curConcept].steps[app.curStep];

            $("#lessonTitle").html(o[app.curLesson].name);
            $("#topicTitle").html(t ? t.name : "");
            $("#stepTitle").html(s ? s.name.toUpperCase() : "");
            $("#userName").html(app.doc.firstName + " " + app.doc.lastName);
            if (s.name) $("#stepImg").prop("src", "img/" + s.name + ".png");
        }
    }]);

    return Content;
}();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NAVIGATION
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var Navigation = function () {
    function Navigation() {
        _classCallCheck(this, Navigation);
    }

    _createClass(Navigation, [{
        key: "Forward",
        value: function Forward() {
            //      if (app.curStep < )


        }
    }, {
        key: "Back",
        value: function Back() {}
    }, {
        key: "Draw",
        value: function Draw() {
            // REDRAW
            var w = $(window).width() - 32; // Get window width
            var h = $(window).height() - $("#navDiv").height() - 16; // Height
            $("#navDiv").css({ top: h + "px", width: w + "px" }); // Position at bottom
        }
    }]);

    return Navigation;
}();

