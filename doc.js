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
	levels:["course","lesson","topic","concept","step","page"],
	map:[	{ level:0, id:1 }, 
			{ level:1, id:2 }, 
			{ level:2, id:3 }, 
			{ level:2, id:4 }, 
			{ level:3, id:5 }, 
			{ level:3, id:6 }, 
			{ level:3, id:7 }, 
			{ level:4, id:8 }, 
			{ level:5, id:9 }, 
			{ level:4, id:10 }, 
			{ level:4, id:11 }, 
			{ level:4, id:12 }, 
			{ level:3, id:13 }, 
			{ level:2, id:14 } 
			]
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DOC
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Doc  {

	constructor(o)	{																							// CONSTRUCTOR
		o=demo;
		this.lobs=this.map=[];																						// Holds learning objects/map
		if (o)  {																									// If default data
			this.lobs=o.lobs;																						// Add lobs
			this.map=o.map;																							// Add map
			this.levels=o.levels;																					// Add map
			this.Lessons=[];																						// Lessons in course
			this.topics=[];																							// Topics in this lesson
			this.concepts=[];																						// Concepts in this topic
			this.concepts=[];																						// Steps in this concept
			this.pages=[];																							// Pages in the step
			}
		this.levelPos=[0,0,0,0,0];																					// Holds progress with in level
		this.curMapPos=1;																							// Start at lesson
		this.firstName="Jerry";		this.lastName="Bruner";
	}

	Draw() {																									// SET LEVELS AND DATA
		this.lessons=this.LevelIds(1);																				// Lessons in course
		this.topics=this.LevelIds(2);																				// Topics in this lesson
		this.concepts=app.doc.LevelIds(3);																			// Concepts in this topic
		this.steps=app.doc.LevelIds(4);																				//Steps in this concept
		this.pages=this.LevelIds(5);																				// Pages in this step
		this.levels=this.GetLevels();																				// Get levels	
		var id=this.map[this.curMapPos].id;																			// Get current id
		
		if (this.lessons.length)																					// If lessons
			this.levelPos[0]=this.lessons.findIndex(x => x == id);													// Get index of matching member in lessons
		if (this.topics.length)																						// If topics
			this.levelPos[1]=this.topics.findIndex(x => x == id);													// Get index 
		if (this.concepts.length)																					// If Concepts
			this.levelPos[2]=this.concepts.findIndex(x => x == id);													// Get index 
		if (this.steps.length)																						// If steps
			this.levelPos[3]=this.steps.findIndex(x => x == id);													// Get index 
		if (this.pages.length)																						// If pages
			this.levelPos[4]=this.pages.findIndex(x => x == id);													// Get index 
trace(this.levelPos[4],this.pages)
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
		for(i=s;i<s+8;++i) {																						// Add 8 random digits
			index=Math.floor(Math.random()*n);																		// Get index
			id+=parts[index];																						// Add to id 
			}
		return ""+id;																								// Return unique id	as string													
		}
			
	GetLevels(mapIndex)																							// GET LOB LEVELS
	{
		var i;
		if (!mapIndex)																								// If mapindex on set
			mapIndex=this.curMapPos;																				// Set cur pos
		var levels=[0,0,0,0,0,0];																					
		var highest=this.map[mapIndex].level;																		// Highest level to set
		for (i=0;i<=mapIndex;i++) {																					// Work to cur point
			var o=this.map[i];																						// Get map entry
			if (o.level <= highest)																					// If below limit 
				levels[o.level]=o.id;																				// Save id
			}
		return levels;																								// Return levels array
	}

	LevelIds(level) {																							// GET START OF LEVELS IN MAP
		var i,ids=[];
		var s=this.GetLevels()[level-1];																			// Get level map of start one higher up hierarchy
		var e=this.map.length-1;																					// Assume whole map
		for (i=s+1;i<this.map.length;++i)																			// For each lob under start
			if (this.map[i].level == level-1) {																		// If it reaches another of same parent level
				e=i;																								// This is the real end of the level
				break;																								// Quit looking
			}
		for (i=s;i<=e;++i) {																						// For each lob in the level
			if (this.map[i].level == level)																			// If a member
				ids.push(this.map[i].id);																			// Add its id to array
			}
		return ids;																									// Return ids array
		}




			
				






}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOB
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Lob {

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