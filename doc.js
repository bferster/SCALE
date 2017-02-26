// GLOBALS /////////////////////////////////////////////////////////////////////////////////////////////////////////

const COURSE=0, LESSON=1, TOPIC=2, CONCEPT=3, STEP=4, PAGE=5, NUMLEVELS=6;
const TODO=0, DONE=10;

var demo={
	lobs:[	{ name:"WriteMao", id:1 }, 
			{ name:"Clauses", id:2 }, 
			{ name:"Kinds of clauses", id:3 }, 
			{ name:"Separating clauses", id:4 }, 
			{ name:"Using commas", id:5 }, 
			{ name:"Using joiners", id:6 }, 
			{ name:"Using semicolons", id:7 }, 
			{ name:"tell 1/2", id:8 }, 
			{ name:"tell 2/2", id:9 }, 
			{ name:"show", id:10 }, 
			{ name:"find", id:11 }, 
			{ name:"do", id:12 }, 
			{ name:"Using periods", id:13 }, 
			{ name:"Ordering clauses", id:14 }
			],
	map:[{ level:COURSE, id:1, parent:0, children:[2], status: TODO }, 
				{ level:LESSON, id:2, parent:1, children:[3,4,14], status: TODO }, 
				{ level:TOPIC, id:3, parent:2, children:[], status: DONE }, 
				{ level:TOPIC, id:4, parent:2, children:[5,6,7,13],status: TODO }, 
					{ level:CONCEPT,id:5, parent:4, children:[], status: TODO }, 
					{ level:CONCEPT,id:6, parent:4, children:[], status: TODO }, 
					{ level:CONCEPT,id:7, parent:4, children:[8,10,11,12], status: TODO }, 
						{ level:STEP, id:8, parent:7, children:[9], status: TODO }, 
							{ level:PAGE, id:9, parent:8, children:[], status: TODO }, 
						{ level:STEP, id:10, parent:7, children:[], status: TODO }, 
						{ level:STEP, id:11, parent:7, children:[], status: TODO }, 
						{ level:STEP, id:12, parent:7, children:[],status: TODO }, 
					{ level:CONCEPT,id:13, parent:4, children:[], status: TODO }, 
				{ level:TOPIC, id:14, parent:1, children:[],status: TODO } 
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
		var mp=this.curMapPos;																					// Get id
		this.curLevel=this.map[mp].level;																			// Current level
		this.curLobId=this.map[mp].id;																				// Current lob id
		this.curLob=this.FindLobById(this.map[mp].id);																// Current lob pointer
		this.curLesson=this.FindLevel(LESSON,mp);																	// Current lesson
		this.curTopic=this.FindLevel(TOPIC,mp);																		// Current topic
		this.curConcept=this.FindLevel(CONCEPT,mp);																	// Current concept
		this.curStep=this.FindLevel(STEP,mp);																		// Current step
		this.curPage=this.FindLevel(PAGE,mp);																		// Current page
	}

	FindLevel(level, pos) {
		var i,par,opos=pos;;
		do	{
			par=this.map[pos].parent;
			if (par == undefined)
				return 0;
			if (this.map[pos].level == level) {
				trace(this.map[par].children)

				///////////////////////////////////////////////////////////////////
				return pos;
			}
			else
				pos=par;
			}
		while (1);
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