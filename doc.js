var demoCur={
    name:"WriteMao",
    lessons:    [ { name: "Clauses", depends:[0],
        topics:     [ { name: "Separating clauses", depends:[0],
            concepts:   [ { name: "Using semicolons", depends:[0],
                steps:      [ { name: "tell", depends:[0] },
                            { name: "show", depends:[0] },
                            { name: "find", depends:[0] },
                            { name: "do", depends:[0] } ] 
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
        }
  }
