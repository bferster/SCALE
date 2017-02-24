var demo={
	lobs:[	{ name:"WriteMao", id:1 }, 
			{ name:"Clauses", id:2 }, 
			{ name:"Kinds of clauses", id:3 }, 
			{ name:"Separating clauses", id:4 }, 
			{ name:"Using commas", id:5 }, 
			{ name:"Using joiners", id:6 }, 
			{ name:"Using semicolons", id:7 }, 
			{ name:"tell", id:8 }, 
			{ name:"show", id:9 }, 
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
			{ level:4, id:9 }, 
			{ level:5, id:10 }, 
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
			}
		this.curPos=0;																								// Set current lob
		this.firstName="Jerry";		this.lastName="Bruner";

trace(this.GetLevels(13))
	}

	RemoveLob() {																								// REMOVE LOB AND ALL REFERENCES TO IT
		}


	FindLobById(id) {																							// FIND PTR TO LOB FROM ID
		var i,n=this.lobs.length;
		for (i=0;i<n;++i) {																							// For each lob
				if (id == this.lobs[i].id) 																			// A match
				return this.lobs[i];																				// Return ptr to lob
			}
		return null;																								// Not found
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
			
		GetLevels(mapIndex)
		{
			var i;
			var levels=[0,0,0,0];
			var curLevel=-1;
			var o=this.map[mapIndex];
			
			var curLevel=o.level;
			for (i=mapIndex;i>=0;--i) {																				// Work upwards
				var o=this.map[i];																					// Get map entry
				if (curLevel != o.level) {																			// A different level than previous
					trace(curLevel,o.level)
					curLevel=o.level;																				// Then is now
					if (!levels[curLevel])																			// Not set yet
						levels[curLevel]=o.id;																		// Save
					if (curLevel == 0)																				// If last one
						return levels;																				// Return levels array
					}
				}
			return levels;																							// Return levels array
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