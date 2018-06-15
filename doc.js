// GLOBALS /////////////////////////////////////////////////////////////////////////////////////////////////////////

const COURSE=0, LESSON=1, TOPIC=2, CONCEPT=3, STEP=4, PAGE=5, NUMLEVELS=6;
const TODO=0, DONE=10;

// DOC /////////////////////////////////////////////////////////////////////////////////////////////////////////

class Doc {
	constructor(id)																								// CONSTRUCTOR
		{
		this.map=[  { level:0, id: 0 }];																			// Map
		this.lobs=[ { name:"", id:0, status:0, body:""}];															// Lob
		this.asks=[];																								// Assessment
		this.vars=[];																								// Associative array to hold
		this.curPos=0;																								// Start at lesson
		this.courseId=id;																							// Default course id
		this.GDriveLoad(this.courseId);																				// Load default lobs/map
		this.firstName="Jerry";		this.lastName="Bruner";
	}

	AddChildList()																								// ADD LIST OF CHILDREN
	{	
		var i,par,n=this.map.length;
		for (i=0;i<n;++i) {																							// For each map element
			this.map[i].children=[];																				// Alloc arrays
			this.map[i].kids=[];																
			this.lobs[i].children=[];																				// Alloc arrays
			this.lobs[i].kids=[];																
			}
		for (i=0;i<n;++i) {																							// For each map element
			if (this.lobs[i].parent === "")	delete(this.lobs[i].parent);
			par=this.FindLobIndexById(this.lobs[i].parent);															// Get index of parent
			if (par)	this.map[i].parent=par;																		// If valid, set index 
			this.lobs[i].level=this.FindLobLevelById(this.lobs[i].id);												// Set level
			
			this.map[i].level=this.FindLobLevelById(this.lobs[i].id);												// Set level
			this.map[i].id=this.lobs[i].id;
			if (par != undefined) {																					// If not root
				this.map[par].children.push(this.map[i].id);														// Add id of child lob
				this.map[par].kids.push(this.map[i]);																// Add id of map
				this.lobs[par].children.push(this.lobs[i].id);														// Add id of child lob
				this.lobs[par].kids.push(this.lobs[i]);																// Add ptr to lob
				}			
			}
	}

	Draw() 																										// DRAW
	{
		this.SetCurVars(this.curPos);																				// Get id
	}

	SetCurVars(id)																								// SET CURRENT AREAS
	{
		this.curLevel=this.lobs[id].level;																			// Current level
		this.curLobId=this.lobs[id].id;																				// Current lob id
		this.curLob=this.FindLobById(this.map[id].id);																// Current lob pointer
		this.curCourse=this.FindLobParent(COURSE,id);																// Current course
		this.curLesson=this.FindLobParent(LESSON,id);																// Current lesson
		this.curTopic=this.FindLobParent(TOPIC,id);																	// Current topic
		this.curConcept=this.FindLobParent(CONCEPT,id);																// Current concept
		this.curStep=this.FindLobParent(STEP,id);																	// Current step
		this.curPage=this.FindLobParent(PAGE,id);																	// Current page
	}
	
	FindLobParent(level, index) 																				// FIND MAP INDEX OF LOB PARENT
	{		
		var i,par;
		while (1) {																									// Loop
			par=this.FindLobIndexById(this.lobs[index].parent);														// Get parent object
			if (par == undefined)																					// If at root
				return 0;																							// Return root
			if (this.lobs[index].level == level) 																	// At desired level
				return index;																						// Return index
			else																									// Still under it
				index=par;																							// Go up a level
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

	FindLobIndexById(id) {																						// FIND INDEX OF LOB FROM ID
		var i,n=this.lobs.length;
		for (i=0;i<n;++i) {																							// For each lob
			if (id == this.lobs[i].id) 																				// A match
				return i;																							// Return ptr to lob
			}
			return undefined;																						// Not found
		}

	FindLobLevelById(id) {																						// FIND LEVEL OF LOB FROM ID
		var level=0;
		var o=this.FindLobById(id);																					// Point at lob
		while (o.parent) {																							// While not root
			o=this.FindLobById(o.parent);																			// Set id to parent and go up hierarchy
			++level;																								// Increase level
			}
		return level;																								// Return level of lob
	}

	FindAskById(id) {																							// FIND PTR TO ASK FROM ID
		var i,n=this.asks.length;
		for (i=0;i<n;++i) {																							// For each ask
			if (id == this.asks[i].id) 																				// A match
				return this.asks[i];																				// Return ptr to ask
			}
		return null;																								// Not found
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
		if (this.curPos < this.map.length-1)																		// If not last
			this.curPos++;																						// Advance
		else																										// Last
			this.curPos=0;																						// Loop around
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
			_this.asks=[];																							// Init assessment
			app.rules=[];
			for (i=1;i<csv.length;++i) {																			// For each line
				v=csv[i].split("\t");																				// Split into fields
				if (v[0] == "lob")																					// A lob
					_this.lobs.push({ name:v[2], id:v[1]-0, parent:v[3], body:v[4], status:0 });					// Add learning object
				else if (v[0] == "map") {
						if (v[3] != "")
							_this.map.push({ level:v[2]-0, id:v[1]-0, parent:v[3]-0 });								// Add mapping
						else
							_this.map.push({ level:v[2]-0, id:v[1]-0 });											// Add mapping
					}
				else if (v[0] == "ask")																				// An assessment step
					_this.asks.push({ id:v[1]-0, name:v[2], step:v[4]});											// Add ask
				else if (v[0] == "rule")	{																		// A Rule
					var o={id:v[1]-0, name:v[2] };																	// Base
					v[4]=v[4].replace(/ +/g," ");																	// Single space
					v=v[4].split(" ");																				// Split by space														
					if (v.length < 6)	continue;																	// Skip if now well formed
					o.subject=v[1];		o.verb=v[2];  	o.trigger=v[3];												// Left
					o.do=v[5];			o.object=v[6];																// Right
					app.rul.rules.push(o);																			// Add step
					}
				}
_this.lobs[2].status=_this.lobs[5].status=_this.lobs[7].status=_this.lobs[8].status=10;
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
	
	

