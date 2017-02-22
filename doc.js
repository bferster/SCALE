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
