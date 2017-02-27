// GLOBALS /////////////////////////////////////////////////////////////////////////////////////////////////////////

const COURSE=0, LESSON=1, TOPIC=2, CONCEPT=3, STEP=4, PAGE=5, NUMLEVELS=6;
const TODO=0, DONE=10;

var demo={
	lobs:[	{ name:"WriteMao", id:10 }, 
			{ name:"Clauses and phrases", id:20 }, 
			{ name:"Kinds of clauses", id:30 }, 
			{ name:"Separating clauses", id:40 }, 
			{ name:"Using commas", id:50 }, 
			{ name:"Using joiners", id:60}, 
			{ name:"Using semicolons", id:70 }, 
			{ name:"tell - 1 of 2", id:80 }, 
			{ name:"tell - 2 of 2", id:90 }, 
			{ name:"show", id:100 }, 
			{ name:"find", id:110 }, 
			{ name:"do", id:120 }, 
			{ name:"Using periods", id:130 }, 
			{ name:"Ordering clauses", id:140 }
			],
	map:[{ level:COURSE, id:10, children:[2], status: TODO }, 
				{ level:LESSON, id:20, parent: 0, children:[30,40,140], status: TODO }, 
				{ level:TOPIC, id:30, parent:1, children:[], status: DONE }, 
				{ level:TOPIC, id:40, parent:1, children:[50,60,70,130],status: TODO }, 
					{ level:CONCEPT,id:50, parent:3, children:[], status: TODO }, 
					{ level:CONCEPT,id:60, parent:3, children:[], status: TODO }, 
					{ level:CONCEPT,id:70, parent:3, children:[80,100,110,120], status: TODO }, 
						{ level:STEP, id:80, parent:6, children:[90], status: TODO }, 
							{ level:PAGE, id:90, parent:7, children:[], status: TODO }, 
						{ level:STEP, id:100, parent:6, children:[], status: TODO }, 
						{ level:STEP, id:110, parent:6, children:[], status: TODO }, 
						{ level:STEP, id:120, parent:6, children:[],status: TODO }, 
					{ level:CONCEPT,id:130, parent:3, children:[], status: TODO }, 
				{ level:TOPIC, id:140, parent:1, children:[],status: TODO } 
			]
}

// DOC /////////////////////////////////////////////////////////////////////////////////////////////////////////

class Doc  {

	constructor(o)	{																							// CONSTRUCTOR
		o=demo;
		this.lobs=this.map;																							// Holds learning objects/map
		if (o)  {																									// If default data
			this.lobs=o.lobs;																						// Add lobs
			this.map=o.map;																							// Add map
			}
		this.curMapPos=1;																							// Start at lesson
		this.firstName="Jerry";		this.lastName="Bruner";
		}

	Draw() {																									// SET LEVELS AND DATA
		var i;
		var _this=this;																								// Save context
		var mp=this.curMapPos;																						// Get id
		this.curLevel=this.map[mp].level;																			// Current level
		this.curLobId=this.map[mp].id;																				// Current lob id
		this.curLob=this.FindLobById(this.map[mp].id);																// Current lob pointer
		this.curCourse=this.FindLobParent(COURSE,mp);																// Current course
		this.curLesson=this.FindLobParent(LESSON,mp);																// Current lesson
		this.curTopic=this.FindLobParent(TOPIC,mp);																	// Current topic
		this.curConcept=this.FindLobParent(CONCEPT,mp);																// Current concept
		this.curStep=this.FindLobParent(STEP,mp);																	// Current step
		this.curPage=this.FindLobParent(PAGE,mp);																	// Current page
	}

	FindLobParent(level, mapPos) {																				// FIND MAP INDEX OF LOB PARENT
		var i,par;
		while (1) {
			par=this.map[mapPos].parent;																			// Get parent map object
			if (par == undefined)																					// If at root
				return 0;																							// Return root
			if (this.map[mapPos].level == level) 																	// At desired level
				return mapPos;																						// Return map index
			else																									// Still under it
				mapPos=par;																							// Got up a level
			}
		}

	FindLobById(id) {																							// FIND PTR TO LOB FROM ID
		var i,n=this.lobs.length;
		for (i=0;i<n;++i) {																							// For each lob
				if (id == this.lobs[i].id) 																			// A match
				return this.lobs[i];																				// Return ptr to lob
			}
		return null;																								// Not found
		}

	NextLob() {																									// ADVANCE THROUGH LOB MAP
		if (this.curMapPos < this.map.length-1)																		// If not last
			this.curMapPos++;																						// Advance
		else																										// Last
			this.curMapPos=1;																						// Loop around
	}

	UniqueId() {																								// MAKE UNIQUE ID
		var i,index;
		var ts=+new Date;																							// Get date
		var id=ts.toString();																						// Start with timestamp				
		var parts=id.split("").reverse();																			// Mix them up
		var n=parts.length-1;																						// Max
		var s=id.length;																							// Start digit
		for (i=s;i<s+8;++i) {																						// Add 8 random digits
			index=Math.floor(Math.random()*n);																		// Get index
			id+=parts[index];																						// Add to id 
			}
		return ""+id;																								// Return unique id	as string													
		}
}


// LOB /////////////////////////////////////////////////////////////////////////////////////////////////////////

class Lob {																										// BASE CLASS FOR LEARNING OBJECTS (LOBs)

	constructor(type)	{
		this.type=type;																								// Set type o lob
		this.id=app.doc.UniqueId();																					// Make unique id
		this.name="";																								// Name stub
		this.reqs=[];																								// Reqs stub
		this.subs=[];																								// Subs stub
		this.body="";																								// Body stub
		return this.id;																								// Return new id
		}

}