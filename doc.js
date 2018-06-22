// GLOBALS /////////////////////////////////////////////////////////////////////////////////////////////////////////

const COURSE=0, LESSON=1, TOPIC=2, CONCEPT=3, STEP=4, PAGE=5, NUMLEVELS=6;
const TODO=0, DONE=10;

// DOC /////////////////////////////////////////////////////////////////////////////////////////////////////////

class Doc {

	constructor(id)																								// CONSTRUCTOR
	{
		this.lobs=[ { name:"", id:0, status:0, body:""}];															// Lob
		this.map=[];																								// Map of mobs in order
		this.asks=[];																								// Assessment
		this.vars=[];																								// Associative array to hold
		this.curPos=0;																								// Start at lesson
		this.courseId=id;																							// Default course id
		this.GDriveLoad(this.courseId);																				// Load default lobs
		this.firstName="Jerry";		this.lastName="Bruner";
	}

	AddChildList()																								// ADD LIST OF CHILDREN
	{	
		var i,par,n=this.lobs.length;
		for (i=0;i<n;++i) {																							// For each element
			this.lobs[i].children=[];																				// Alloc arrays
			this.lobs[i].kids=[];																
			}
		for (i=0;i<n;++i) {																							// For each element
			if (this.lobs[i].parent === "")	delete(this.lobs[i].parent);											// Blank = undefined
			par=this.FindLobIndexById(this.lobs[i].parent);															// Get index of parent
			if (par < 0)	continue;																				// Skip if invalid parent
			this.lobs[i].level=this.FindLobLevelById(this.lobs[i].id);												// Set level
			if (par != undefined) {																					// If not root
				this.lobs[par].children.push(this.lobs[i].id);														// Add id of child lob
				this.lobs[par].kids.push(i);																		// Add index of child lob
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
		this.curLob=this.FindLobById(this.lobs[id].id);																// Current lob pointer
		this.curLesson=this.FindLobParent(LESSON,id);																// Current lesson
		this.curTopic=this.FindLobParent(TOPIC,id);																	// Current topic
		this.curConcept=this.FindLobParent(CONCEPT,id);																// Current concept
		this.curStep=this.FindLobParent(STEP,id);																	// Current step
		this.curPage=this.FindLobParent(PAGE,id);																	// Current page
	}
	
/// MANAGEMENT //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	MakeTabFile()																							// MAKE TAB-DELINEATED FILE OF COURSE
	{
		var i,o;
		var str=makeTSVLine("type","id","name","parent","body");													// Add header
		this.IterateLobs((i,id)=> {																					// Iterate through list in order
			var o=this.lobs[i];																						// Point at lob
			str+=makeTSVLine("lob",o.id,o.name,o.parent,o.body);													// Add connected lob
			});		
		str+="\n";																									// Add blank line
		for (i=1;i<this.lobs.length;++i) {																			// For each lob	
			var o=this.lobs[i];																						// Point at lob
			if (!this.FindLobById(o.parent))																		// Not connected anywhere
				str+=makeTSVLine("lob",o.id,o.name,o.parent,o.body);												// Add un connected connected lob
			}
		str+="\n";																									// Add blank line
		for (i=0;i<app.rul.rules.length;++i) {																		// For each rule	
			var o=app.rul.rules[i];																					// Point at rule
			var s="IF "+o.subject+" "+o.verb+" "+o.trigger+" THEN "+o.do+" "+o.object;								// Remake text rule
			str+=makeTSVLine("rul",o.id,o.name,"",s);																// Add rule
			}
		str+="\n";																									// Add blank line
		for (i=0;i<app.doc.asks.length;++i) {																		// For each ask	
			var o=app.doc.asks[i];																					// Point at ask
			str+=makeTSVLine("ask",o.id,o.name,"",o.step);															// Add ask
			}

		function makeTSVLine(type, id, name, parent, body) {														// CREATE TSV OF LOB																				
			var s=type+"\t";																						// Save type
			s+=(id ? (""+id).replace(/(\n|\r|\t)/g,"") : "")+"\t";													// Id, remove CRs/LFs/TABs
			s+=(name ? (""+name).replace(/(\n|\r|\t)/g,"") : "")+"\t";												// Name 
			s+=(parent ? (""+parent).replace(/(\n|\r|\t)/g,"") : "")+"\t";											// Parent 
			s+=(body ? (""+body).replace(/(\n|\r|\t)/g,"") : "")+"\n";												// Body 
			return s;																								// Return TSV line
			}
		return str;																									// Return tab-delimited version
		}

	AddNewLob(parent, id, name)																					// ADD NEW LOB
	{
		if (parent < 0)	return;																						// Quit on invalid parent
		if (!id)	id=this.UniqueLobId(parent);																	// If not spec'd add unique id based on parent
		if (!name)	name="Rename this";																				// And name
		this.lobs.push({ name:name, id:id, status:0, body:"", parent:parent, kids:[], children:[]});				// Add lob
		parent=this.FindLobById(parent);																			// Point at parent lob
		if (parent) {																								// If has a parent
			parent.children.push(id);																				// Add id to children	
			parent.kids.push(this.lobs.length-1);																	// Add index to kids	
			}
		}

	UnlinkLob(id)																								// UNLINK LOB
	{
		var i=this.FindLobIndexById(id);																			// Get index
		if (i <= 0)	return;																							// Root or invalid index
		var o=this.FindLobById(this.lobs[i].parent);																// Get pointer parent
		if (!o)			return;																						// Invalid parent
		for (i=0;i<o.children.length;++i) 																			// For each child
			if (o.children[i] == id)  {																				// Matches this id
				o.kids.splice(i,1);																					// Remove from from kids
				o.children.splice(i,1);																				// Remove from from children
				break;
				}
	}

	RenameLobId(oldId, newId)																					// RENAME LOB's ID
	{
		var i;
		var o=this.FindLobById(oldId);																				// Get pointer to lob
		if (!o) return;																								// Quit if bad
		o.id=newId;																									// Set new id
		for (i=0;i<this.lobs.length;++i)																			// For each lob
			if (this.lobs[i].parent == oldId)																		// If parent is this old id
				this.lobs[i].parent=newId;																			// Change it to the new one
		this.AddChildList();																						// Remake chilrens/kids
		}

	ChangeOrder(lobId, parent, mode)																			// CHANGE LOB'S ORDER VIA PARENT OR PLACE IN CHILDREN
	{
		var i=this.FindLobIndexById(lobId);																			// Get index of lob to move	
		if (i < 0)	return;																							// Quit if invalid
		var j=this.FindLobIndexById(parent);																		// Get index of lob to move to	
		if (j < 0)	return;																							// Quit if invalid
		if ((this.lobs[j].parent == this.lobs[i].parent) && (mode == "shift"))	{									// Pointing to same parent
			var ii,fromKid,fromChild;
			var o=this.FindLobById(this.lobs[j].parent);															// Point at parent lob
			for (ii=0;ii<o.children.length;++ii) 																	// For reach child
				if (o.children[ii] == lobId)  {																		// Save from point
					fromKid=o.kids[ii];																				// Save from kids value
					fromChild=o.children[ii];																		// Save from child value
					o.kids.splice(ii,1);																			// Remove from from kids
					o.children.splice(ii,1);																		// Remove from from children
					break;
					}
			for (ii=0;ii<o.children.length;++ii) 																	// For reach child
				if (o.children[ii] == parent)  {																	// Save from point
					o.kids.splice(ii,0,fromKid);																	// Add from kids
					o.children.splice(ii,0,fromChild);																// Add from children
					break;
					}
		}
	else{	
		this.lobs[i].parent=parent;																					// Set new parent
		this.AddChildList();																						// Remake childen/kids arrays
		}
	}

	GetMastery(num) 																							// GET MASTERY OF LOB AT POSITION
	{	
		var numNodes=-1,done=0;
		var _this=this;																								// Context
		if (_this.FindLobById(this.lobs[num].id).status == DONE)													// If it's already done
			return DONE;																							// Return done
		
		function iterate(node) {																					// RECURSIVE FUNCTION
			var i;
			++numNodes;																								// Add to count
			if (_this.FindLobById(node.id).status == DONE)															// If lob is done
				++done;																								// Add to count																		
			for (i=0;i<node.kids.length;i++) 																		// For each child
				iterate(node.kids[i]);																				// Recurse
			}
		
		iterate(this.lobs[num]);																					// Start looking
		return ((done == numNodes) && numNodes) ? DONE : TODO;														// Return mastery for node
	}

	NextLob() 																									// ADVANCE THROUGH LOB
	{	
		var i;
		this.IterateLobs();																							// Make new mob map						
		for (i=0;i<this.map.length;++i)																				// Find index of active mob
			if (this.map[i] == this.curLobId) 																		// A match
				break;																								// Quit looking
		this.curPos=i+1;																							// Advance to next
		if (this.curPos >= this.map.length-1)																		// If last
			this.curPos=0;																							// Loop around
	}

/// DATA HELPERS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	FindLobParent(level, index) 																				// FIND INDEX OF LOB PARENT
	{		
		var i,par;
		while (1) {																									// Loop
			par=this.FindLobIndexById(this.lobs[index].parent);														// Get parent object
			if (par == -1)																						// If at root
				return -1;																							// Return root
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
		return -1;																									// Not found
		}

	FindLobLevelById(id) {																						// FIND LEVEL OF LOB FROM ID
		var level=0;
		var o=this.FindLobById(id);																					// Point at lob
		while (o.parent) {																							// While not root
			o=this.FindLobById(o.parent);																			// Set id to parent and go up hierarchy
			if (!o)	return 0;																						// At root level
			++level;																								// Increase level
			}
		return level;																								// Return level of lob
	}

	FindAskById(id) 																							// FIND PTR TO ASK FROM ID
	{	
		var i,n=this.asks.length;
		for (i=0;i<n;++i) {																							// For each ask
			if (id == this.asks[i].id) 																				// A match
				return this.asks[i];																				// Return ptr to ask
			}
		return null;																								// Not found
	}

	FindAskIndexById(id) {																						// FIND INDEX OF ASK FROM ID
		var i,n=this.asks.length;
		for (i=0;i<n;++i) {																							// For each lob
			if (id == this.laskss[i].id) 																			// A match
				return i;																							// Return ptr to lob
			}
		return -1;																									// Not found
		}
	
	IterateLobs(callback) 																						// ITERATE THROUGH FLAT LOB LIST
	{
		var _this=this;																								// Context
		this.map=[];																								// Clear mob map
		iterate(0);																									// Start process																					

		function iterate(index) {																				// RECURSIVE FUNCTION
			var i;
			var o=_this.lobs[index];																				// Point at lob
			_this.map.push(o.id);																					// Save map
			if (callback) 	callback(index,o.id);																	// Show progress, if a callback defined
			for (i=0;i<o.children.length;i++) 																		// For each child 
				iterate(o.kids[i]);																					// Recurse using cild index
			}

		}	

/// MISC //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	UniqueLobId(id) 																							// MAKE UNIQUE LOB ID BASED ON PARENT
	{	
		var nid,add=1;																								// Add number																				
		nid=id+""+add;																								// Add number to parent
		while (this.FindLobById(nid))																				// While not unique
			nid=id+"."+(++add);																						// Add to count until it is																					
		return nid;																									// Return unique id												
	}

	UniqueAskId(id) 																							// MAKE UNIQUE ASK ID BASED ON PARENT
	{	
		var nid,add=1;																								// Add number																				
		nid=id+""+add;																								// Add number to parent
		while (this.FindAskById(nid))																				// While not unique
			nid=id+"."+(++add);																						// Add to count until it is																					
		return nid;																									// Return unique id												
	}

	InitFromTSV(tsv)																							// INIT APP DATA FROM TSV FILE
	{
		var i,v;
		this.lobs=[];																								// Init lobs
		this.asks=[];																								// Init assessment
		app.rul.rules=[];																							// Init rules
		tsv=tsv.replace(/\\r/,"");																					// Remove CRs
		tsv=tsv.split("\n");																						// Split into lines
		for (i=1;i<tsv.length;++i) {																				// For each line
			v=tsv[i].split("\t");																					// Split into fields
			if (v[0] == "lob") 																						// A lob
				this.lobs.push({ name:v[2], id:v[1]-0, parent:v[3], body:v[4], status:0 });							// Add learning object
			else if (v[0] == "ask")																					// An assessment step
				this.asks.push({ id:v[1]-0, name:v[2], step:v[4]});													// Add ask
			else if (v[0] == "rul")	{																				// A Rule
				var o={id:v[1]-0, name:v[2] };																		// Base
				v[4]=v[4].replace(/ +/g," ");																		// Single space
				v=v[4].split(" ");																					// Split by space														
				if (v.length < 6)	continue;																		// Skip if now well formed
				o.subject=v[1];		o.verb=v[2];  	o.trigger=v[3];													// Left
				o.do=v[5];			o.object=v[6];																	// Right
				app.rul.rules.push(o);																				// Add step
				}
			}
this.lobs[2].status=this.lobs[5].status=this.lobs[7].status=this.lobs[8].status=10;
		this.AddChildList();																						// Add children	
		app.Draw();																									// Reset data positions
	}

	GDriveLoad(id) 																								// LOAD DOC FROM GOOGLE DRIVE
	{
		var _this=this;																								// Save context
		var str="https://docs.google.com/spreadsheets/d/"+id+"/export?format=tsv";									// Access tto
		var xhr=new XMLHttpRequest();																				// Ajax
		xhr.open("GET",str);																						// Set open url
		xhr.onload=function() { _this.InitFromTSV(xhr.responseText); };												// On successful load, init app from TSV file
		xhr.send();																									// Do it
		
		xhr.onreadystatechange=function(e) { 																		// ON AJAX STATE CHANGE
			if ((xhr.readyState === 4) && (xhr.status !== 200)) {  													// Ready, but no load
				Sound("delete");																					// Delete sound
				PopUp("<p style='color:#990000'><b>Couldn't load Google Doc!</b></p>Make sure that <i>anyone</i><br>can view it in Google",5000); // Popup warning
				}
			};		
		}
	}																												// CLASS CLOSURE
	
	

