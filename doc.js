class Doc  {
    constructor(o)   {
       this.name="WriteMao";
       this.Lessons=[];
    }
}

class Lesson  {
    constructor(o)   {
    this.topics=[];
    }
}

class Topic  {
    constructor(o)   {
    this.concepts=[];
    }
}

class Concept  {
    constructor(o)   {
    this.steps=[];
    }
}

class Page  {
    constructor(o)   {
    this.header;
    }
}

class Step  {
    constructor(o)   {
        this.type=o.type == undefined ? "tell" : o.type;
        this.title=!o.title ? "" : o.title;
        
    }
}
