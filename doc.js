// GLOBALS /////////////////////////////////////////////////////////////////////////////////////////////////////////

const COURSE=0, LESSON=1, TOPIC=2, CONCEPT=3, STEP=4, PAGE=5, NUMLEVELS=6;
const TODO=0, DONE=10;

// DOC /////////////////////////////////////////////////////////////////////////////////////////////////////////

class Doc  {

	constructor(id)	{																							// CONSTRUCTOR
		this.map=[  { level:0, id: 0 }];																			// Map
		this.lobs=[ { name:"", id:0, status:0, body:""}];															// Lob
		this.assess=[],this.asks=[];																				// Assessment
		this.studentMap=[];																							// Map of student progress
		this.curMapPos=0;																							// Start at lesson
		this.mapId=id;																								// Default lobs/map id
		this.GDriveLoad(this.mapId);																				// Load default lobs/map
		this.firstName="Jerry";		this.lastName="Bruner";
		}

	AddChildList()	{																							// ADD LIST OF CHILDREN
		var i,par,n=this.map.length;
		for (i=0;i<n;++i) {																							// For each map element
			this.map[i].children=[];																				// Alloc arrays
			this.map[i].kids=[];																
			}
		for (i=0;i<n;++i) {																							// For each map element
			par=this.map[i].parent;																					// Point at parent
			if (par != undefined) {																					// If not root
				this.map[par].children.push(this.map[i].id);														// Add id of child lob
				this.map[par].kids.push(this.map[i]);																// Add id of map
				}			
			}
		}

	Draw() {																									// SET LEVELS AND DATA
		var i;
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
		for (i=0;i<this.lobs.length;++i)	this.studentMap[i]=0;													// Zero progress
this.studentMap[4]=this.studentMap[5]=this.studentMap[7]=this.studentMap[8]=10			
		for (i=0;i<this.lobs.length;++i)																			// For each lob
			this.lobs[i].status=this.studentMap[i];																	// Set progress
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
			if (id == this.lobs[i].id) 																				// A match
				return this.lobs[i];																				// Return ptr to lob
			}
		return null;																								// Not found
		}

	FindAssessById(id) {																						// FIND PTR TO ASSESS FROM ID
		var i,n=this.assess.length;
		for (i=0;i<n;++i) {																							// For each assess
			if (id == this.assess[i].id) 																			// A match
				return this.assess[i];																				// Return ptr to assess
			}
		return null;																								// Not found
		}
		
	FindAskById(id) {																							// FIND PTR TO ASK FROM ID
		var i,n=this.asks.length;
		for (i=0;i<n;++i) {																							// For each ask
			if (id == this.asks[i].id) 																				// A match
				return this.asks[i];																				// Return ptr to ask
			}
		return null;																								// Not found
		}
	
	FindMapIndexById(id) {																						// FIND MAP INDEX FROM ID
		var i,n=this.map.length;
		for (i=0;i<n;++i) {																							// For each lob
			if (id == this.map[i].id) 																				// A match
				return i;																							// Return index
			}
		return -1;																									// Not found
		}

	GetMastery(num) {																							// GET MASTERY OF LOB AT MAP POSITION
		var numNodes=-1,done=0;
		var _this=this;																								// Context
		if (_this.FindLobById(this.map[num].id).status == DONE)														// If it's already done
			return DONE;																							// Return done
		
		function iterate(node) {																					// RECURSIVE FUNCTION
			var i;
			++numNodes;																								// Add to count
			if (_this.FindLobById(node.id).status == DONE)															// If lob is done
				++done;																								// Add to count																		
			for (i=0;i<node.kids.length;i++) 																		// For each child
				iterate(node.kids[i]);																				// Recurse
			}
		
		iterate(this.map[num]);																						// Start looking
		return ((done == numNodes) && numNodes) ? DONE : TODO;														// Return mastery for node
		}

	NextLob() {																									// ADVANCE THROUGH LOB MAP
		if (this.curMapPos < this.map.length-1)																		// If not last
			this.curMapPos++;																						// Advance
		else																										// Last
			this.curMapPos=0;																						// Loop around
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

	GDriveLoad(id) 																								// LOAD FROM GOOGLE DRIVE
	{
		var _this=this;																								// Save context
		var str="https://docs.google.com/spreadsheets/d/"+id+"/export?format=tsv";									// Access tto
		var xhr=new XMLHttpRequest();																				// Ajax
		xhr.open("GET",str);																						// Set open url
		xhr.onload=function() { 																					// On successful load
			var i,v,csv;
			if (xhr.responseText) csv=xhr.responseText.replace(/\\r/,"");											// Remove CRs
			csv=csv.split("\n");																					// Split into lines
			_this.map=[],_this.lobs=[];																				// Init maps
			_this.assess=[],_this.asks=[];																			// Init assessment
			for (i=1;i<csv.length;++i) {																			// For each line
				v=csv[i].split("\t");																				// Split into fields
				if (v[0] == "lob")																					// A lob
					_this.lobs.push({ name:v[2], id:v[1]-0, status:v[3], body:v[4]});								// Add learning object
				else if (v[0] == "map") {
						if (v[3] != "")
							_this.map.push({ level:v[2]-0, id:v[1]-0, parent:v[3]-0 });								// Add mapping
						else
							_this.map.push({ level:v[2]-0, id:v[1]-0 });											// Add mapping
					}
				else if (v[0] == "assess")																			// An assessment
					_this.assess.push({ id:v[1]-0, name:v[2], steps:v[4].split(",")});								// Add asks array
				else if (v[0] == "ask")																				// An assessment step
					_this.asks.push({ id:v[1]-0, name:v[2], step:v[4]});											// Add step

				}
			_this.AddChildList();																					// Add children	
			app.Draw();																								// Redraw
			};			
		xhr.onreadystatechange=function(e)  { 																		// On readystate change
			if ((xhr.readyState === 4) && (xhr.status !== 200)) {  													// Ready, but no load
				Sound("delete");																					// Delete sound
				PopUp("<p style='color:#990000'><b>Couldn't load Google Doc!</b></p>Make sure that <i>anyone</i><br>can view it in Google",5000); // Popup warning
				}
			};		
		xhr.send();																										// Do it
		}
	}																												// Class closur
	
	

