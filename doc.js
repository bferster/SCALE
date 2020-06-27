// GLOBALS /////////////////////////////////////////////////////////////////////////////////////////////////////////

const COURSE=0, LESSON=1, TOPIC=2, CONCEPT=3, STEP=4, PAGE=5, NUMLEVELS=6;
const TODO=0, DONE=10;

// DOC /////////////////////////////////////////////////////////////////////////////////////////////////////////

class Doc {

	constructor(id)																								// CONSTRUCTOR
	{
		this.lobs=[ { name:"Course name", id:1, status:0, body:"", children:[], kids:[]}];							// Lob
		this.map=[];																								// Map of mobs in order
		this.asks=[];																								// Assessment
		this.vars=[];																								// Associative array to hold
		this.trans=[];																								// Transcripts
		this.curPos=0;																								// Start at lesson
		this.courseId=id;																							// Default course id
		this.curLevel=this.curLesson=this.curTopic=this.curConcept=this.curStep=-1;									// Nowhere yet
		this.statusThreshold=10;																					// Threshold for mastery

		if (id == "preview") {																						// Preview instructions
			var str="<br><br><p style='text-align:center'><img src='img/scalelogo.png'>";
			str+="<br>This tab will show previews of your course.";
			str+="<br>Return on the <b> SCALE Course Editor tab</b> to begin editing</p>";
			this.lobs[0].name="Preview";
			this.lobs[0].body=str;
			this.firstName=this.lastName="";
			}
		else if (id) {																								// Normal load
			this.GDriveLoad(this.courseId);																			// Load default lobs
			this.firstName="Jerry";		this.lastName="Bruner";
			}
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
		id=Math.min(id,this.lobs.length-1);																			// Cap at max
		if (id < 0) return;																							// Quit if no lobs yet
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
		str+="\n";																									// Add blank line
		for (i=0;i<app.ams.skins.length;++i) {																		// For each ams	
			var o=app.ams.skins[i];																					// Point at ams
			str+=makeTSVLine("ams",o.id,o.name,"",o.body);															// Add ams
			}
		for (i=0;i<app.doc.trans.length;++i) {																		// For each transcript	
			var o=app.doc.trans[i];																					// Point at transcript
			str+=makeTSVLine("tra",o.id,o.name,"",o.text);															// Add it
			}
		
		var s="assessLevel="+app.assessLevel;																		// Add assessment level
		if (!app.setDone) 		s+=" setDone";																		// Don't set done
		if (app.skipDone) 		s+=" skipDone";																		// Set skipping when done
		if (app.login) 			s+=" login";																		// Set login
		if (app.hideHeader) 	s+=" hideHeader";																	// Set hiding of header
		if (app.fullScreen) 	s+=" fullScreen";																	// Set init full
		if (app.toneJS) 		s+=" toneJS";																		// Set init toneJS lib
		if (app.reportLevel)	s+=" reportLevel="+app.reportLevel;													// Report level
		if (app.reportLink)		s+=" reportLink="+app.reportLink;													// Report link
		if (app.namePrefix)		s+=" namePrefix="+app.namePrefix;													// Username prefix
		if (app.defMargin)		s+=" margin="+app.defMargin;														// Default margin
		if (app.discussion)		s+="discussion="+app.discussion;													// Discussion link
		str+=makeTSVLine("set","","Settings","",s);																	// Add set

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

	SetStatus(index, amount) 																					// SET LOB'S STATUS
	{
		var i;
		var o=this.lobs[index];																						// Point at lob
		while (o) {																									// Look at kids
			for (i=0;i<o.children.length;++i) {																		// For each child
				if (this.lobs[o.kids[i]].status < this.statusThreshold)												// Not complete yet
					return;																							// Quit
				}
			o.status=amount;																						// This mob complete
			o=this.FindLobById(o.parent);																			// Point at parent
			}
		}

	GetStatusArray()																							// GET LOB STATUS AS ARRAY
	{
		let i,a=[];
		for (i=0;i<this.lobs.length;++i)	a.push(this.lobs[i].status);											// Add status to array
		return a;
	}

	SetStatusArray(a)																							// SET LOB STATUS FROM ARRAY
	{
		let i;
		if (!a || !a.length)	return;																				// Quit if nothing there
		for (i=0;i<a.length;++i) {																					// For each element
			if (i >= this.lobs.length) 	break;																		// Quit if too many
			this.lobs[i].status=a[i];																				// Set status
			}
	}

	AddNewLob(parent, id, name)																					// ADD NEW LOB
	{
		if (parent < 0)	return;																						// Quit on invalid parent
		if (!id)	id=this.UniqueLobId(parent);																	// If not spec'd add unique id based on parent
		if (!name)	name="Rename this";																				// And name
		if (this.FindLobLevelById(parent) > 2)																		// If too deep
			parent=this.FindLobById(parent).parent;																	// Get parent's parent
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
		if (!this.DescendedFrom(this.lobs[i].id,this.lobs[j].id))													// If this log is not a descendant
			this.lobs[i].parent=parent;																				// Set new parent
		this.AddChildList();																						// Remake childen/kids arrays
		}
	}

	NextLob(dir) 																								// ADVANCE THROUGH LOB
	{	
		var i,o;
		if (!dir)	dir=1;																							// Assume forward
		var here=this.curLobId;																						// Start where we are now
		this.IterateLobs();																							// Make new mob map						
		for (i=0;i<this.map.length-1;++i)	{																		// Find index of active mob
			o=this.FindLobById(this.map[i]);																		// Point at lob	in map														
			if (!o)	continue;																						// Skip invalid mob			
			if (this.map[i] == here) {																				// A match
				o=this.FindLobById(this.map[i+1]);																	// Point at nextlob	in map														
				if (!app.skipDone)						break;														// If skipping done panes
				if (o.status >= this.statusThreshold) 	here=this.map[i+1];											// This one's already done, keep looking
				else									break;														// Stop looking
				}
			}
		this.curPos=i+dir;																							// Advance to next
		if (this.curPos < 0 )																						// If first
			this.curPos=this.map.length-1;																			// Loop around
		else if (this.curPos >= this.map.length)																	// If last
			this.curPos=0;																							// Loop around
	}

	
/// DATA HELPERS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


	DescendedFrom(lobId, testId) 																				// FIND IF IS A DESCENDENT
	{		
		var par=this.FindLobById(testId);																			// Point at pareent
		while (par) {																								// While still a parent
			if (par.parent == lobId)	return true;																// It's in the chain
			par=this.FindLobById(par.parent);																		// Go up a level
			}
		return false;																								// Not in the chain
	}

	FindLobParent(level, index) 																				// FIND INDEX OF LOB PARENT
	{		
		var i,par;
		while (1) {																									// Loop
			par=this.FindLobIndexById(this.lobs[index].parent);														// Get parent object
			if (par == -1)																							// If at root
				return -1;																							// Return root
			if (this.lobs[index].level == level) 																	// At desired level
				return index;																						// Return index
			else																									// Still under it
				index=par;																							// Go up a level
			}
	}

	FindLobById(id, objArray) {																					// FIND POINTER TO OBJECT FROM ID
		var i;
		var o=objArray ? objArray : this.lobs;																		// Point at array of object array
		var n=o.length;																								// Set length
		for (i=0;i<n;++i) {																							// For each obj
			if (id == o[i].id) 																						// A match
				return o[i];																						// Return ptr to obj
			}
		return null;																								// Not found
		}

	FindLobIndexById(id, objArray ) {																			// FIND INDEX OF OBJECT FROM ID
		var i;
		var o=objArray ? objArray : this.lobs;																		// Point at array of object array
		var n=o.length;																								// Set length
		for (i=0;i<n;++i) {																							// For each lob
			if (id == o[i].id) 																						// A match
				return i;																							// Return ptr to lob
			}
		return -1;																									// Not found
		}

	FindLobLevelById(id) {																						// FIND LEVEL OF LOB FROM ID
		var level=0;
		var o=this.FindLobById(id);																					// Point at lob
		if (!o)	return 0;																							// A floater
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
	
	IterateLobs(callback, start) 																				// ITERATE THROUGH FLAT LOB LIST
	{
		var _this=this;																								// Context
		this.map=[];																								// Clear mob map
		start= start ? start : 0;																					// If  start not defined, use -
		var run=start ? false : true;																				// Don't run CB if a start defined
		iterate(start);																								// Start process																					
	
		function iterate(index) {																					// RECURSIVE FUNCTION
			var i;
			var o=_this.lobs[index];																				// Point at lob
			if (start == o.id)	run=true;																			// We're at the start to report
			_this.map.push(o.id);																					// Save map
			if (run && callback) 	callback(index,o.id);															// Show progress, if a callback defined
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
			nid=id+""+(++add);																						// Add to count until it is																					
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

	InitFromJSON(cells)																							// INIT APP DATA FROM GDOCS JSON FILE
	{
		let i,v,col,row,con,o,s=[];
		this.lobs=[];																								// Init lobs
		this.asks=[];																								// Init assessment
		this.trans=[];																								// Init transcripts
		app.rul.rules=[];																							// Init rules
		app.ams.skins=[];																							// Init skins
		for (i=0;i<cells.length;++i) {																				// For each cell
			o=cells[i];																								// Point at it
			col=o.gs$cell.col-1; 	row=o.gs$cell.row-1;															// Get cell coords
			con=o.content.$t;																						// Get content
			if (!con) 				continue;																		// Skip blank cells
			if (!s[row])			s[row]=["","","","",""];														// Add new row if not there already
			if (col < 5)			s[row][col]=con;																// Add cell to array
			}
		for (i=1;i<s.length;++i) {																					// For each line
			v=s[i];																									// Point atfields
			if (!v) continue;																						// Skip blank lines
			if (v[0] == "lob") 																						// A lob
				this.lobs.push({ name:v[2], id:v[1], parent:v[3], body:v[4], status:0 });							// Add learning object
			else if (v[0] == "ask")																					// An assessment step
				this.asks.push({ id:v[1], name:v[2], step:v[4]});													// Add ask
			else if (v[0] == "ams")																					// An active media skin
				app.ams.AddSkin(v[1],v[2],v[4]);																	// Add skin
			else if (v[0] == "tra")																					// A transcript
				this.trans.push({ id:v[1], name:v[2], text:v[4]});													// Add transcript
			else if (v[0] == "rul")	{																				// A Rule
				o={id:v[1], name:v[2] };																			// Base
				v[4]=v[4].replace(/ +/g," ");																		// Single space
				v=v[4].split(" ");																					// Split by space														
				if (v.length < 6)	continue;																		// Skip if now well formed
				o.subject=v[1];		o.verb=v[2];  	o.trigger=v[3];													// Left
				o.do=v[5];			o.object=v[6];																	// Right
				app.rul.rules.push(o);																				// Add step
				}
			else if (v[0] == "set")	{																				// A Setting
				if (v[4] && v[4].match(/login/i))			app.login=true;											// Force login
				if (v[4] && v[4].match(/setDone/i))			app.setDone=false;										// No status set
				if (v[4] && v[4].match(/skipDone/i))		app.skipDone=true;										// Skip if done
				if (v[4] && v[4].match(/hideHeader/i))		app.hideHeader=true;									// Hide header area
				if (v[4] && v[4].match(/toneJS/i))			app.toneJS=true;										// Init tone JS
				if (v[4] && v[4].match(/fullScreen/i))		app.fullScreen=true;									// Init full screen
				if (v[4] && v[4].match(/assessLevel=/i))	app.assessLevel=v[4].match(/assessLevel=(\.*\d+)/i)[1];	// Assessment pass level
				if (v[4] && v[4].match(/reportLevel=/i))	app.reportLevel=v[4].match(/reportLevel=(\.*\d+)/i)[1];	// Assessment reporting level
				if (v[4] && v[4].match(/reportLink=/i))		app.reportLink=v[4].match(/reportLink=(\.*\S+)/i)[1];	// Assessment reporting link
				if (v[4] && v[4].match(/namePrefix=/i))		app.namePrefix=v[4].match(/namePrefix=(\.*\S+)/i)[1];	// User name prefix
				if (v[4] && v[4].match(/margin=/i))			app.defMargin=v[4].match(/margin=(\.*\d+)/i)[1];		// Default margin
				if (v[4] && v[4].match(/discussion=/i))		app.discussion=v[4].match(/discussion=(\.*\S+)/i)[1];	// Discussion link
				}
			}
		if (!this.lobs.length)																						// No lobs defined
			this.lobs=[ { name:"Course name", id:1, status:0, body:"", children:[], kids:[]}];						// Add start Lob
		this.AddChildList();																						// Add children	
		app.Draw();																									// Redraw

		if (app.login)	GetTextBox("Please log in","Type your user name:","",function(s) { 							// Login
							app.userName=s;																			// Set name
							let i=GetCookie(app.doc.courseId+"_Last_"+s)											// Get last stop cookie
							if ((i > 0) && (i < app.doc.lobs.length))	app.doc.curPos=i;							// If valid start start there
							i=GetCookie(app.doc.courseId+"_Status_"+s)												// Get status cookie
							app.doc.SetStatusArray(i.split(","));													// Set status	
							app.Draw();																				// Redraw																		
							}); 		
		}

		InitFromTSV(tsv)																							// INIT APP DATA FROM TSV FILE
		{
			var i,v;
			this.lobs=[];																								// Init lobs
			this.asks=[];																								// Init assessment
			this.trans=[];																								// Init transcripts
			app.rul.rules=[];																							// Init rules
			app.ams.skins=[];																							// Init skins
			tsv=tsv.replace(/\\r/,"");																					// Remove CRs
			tsv=tsv.split("\n");																						// Split into lines
			for (i=1;i<tsv.length;++i) {																				// For each line
				v=tsv[i].split("\t");																					// Split into fields
				if (v[0] == "lob") 																						// A lob
					this.lobs.push({ name:v[2], id:v[1], parent:v[3], body:v[4], status:0 });							// Add learning object
				else if (v[0] == "ask")																					// An assessment step
					this.asks.push({ id:v[1], name:v[2], step:v[4]});													// Add ask
				else if (v[0] == "ams")																					// An active media skin
					app.ams.AddSkin(v[1],v[2],v[4]);																	// Add skin
				else if (v[0] == "tra")																					// A transcript
					this.trans.push({ id:v[1], name:v[2], text:v[4]});													// Add transcript
				else if (v[0] == "rul")	{																				// A Rule
					var o={id:v[1], name:v[2] };																		// Base
					v[4]=v[4].replace(/ +/g," ");																		// Single space
					v=v[4].split(" ");																					// Split by space														
					if (v.length < 6)	continue;																		// Skip if now well formed
					o.subject=v[1];		o.verb=v[2];  	o.trigger=v[3];													// Left
					o.do=v[5];			o.object=v[6];																	// Right
					app.rul.rules.push(o);																				// Add step
					}
				else if (v[0] == "set")	{																				// A Setting
					if (v[4] && v[4].match(/login/i))			app.login=true;											// Force login
					if (v[4] && v[4].match(/setDone/i))			app.setDone=false;										// No status set
					if (v[4] && v[4].match(/skipDone/i))		app.skipDone=true;										// Skip if done
					if (v[4] && v[4].match(/hideHeader/i))		app.hideHeader=true;									// Hide header area
					if (v[4] && v[4].match(/toneJS/i))			app.toneJS=true;										// Init tone JS
					if (v[4] && v[4].match(/fullScreen/i))		app.fullScreen=true;									// Init full screen
					if (v[4] && v[4].match(/assessLevel=/i))	app.assessLevel=v[4].match(/assessLevel=(\.*\d+)/i)[1];	// Assessment pass level
					if (v[4] && v[4].match(/reportLevel=/i))	app.reportLevel=v[4].match(/reportLevel=(\.*\d+)/i)[1];	// Assessment reporting level
					if (v[4] && v[4].match(/reportLink=/i))		app.reportLink=v[4].match(/reportLink=(\.*\S+)/i)[1];	// Assessment reporting link
					if (v[4] && v[4].match(/namePrefix=/i))		app.namePrefix=v[4].match(/namePrefix=(\.*\S+)/i)[1];	// User name prefix
					if (v[4] && v[4].match(/margin=/i))			app.defMargin=v[4].match(/margin=(\.*\d+)/i)[1];		// Default margin
					if (v[4] && v[4].match(/discussion=/i))		app.discussion=v[4].match(/discussion=(\.*\S+)/i)[1];	// Discussion link
					}
				}
			if (!this.lobs.length)																						// No lobs defined
				this.lobs=[ { name:"Course name", id:1, status:0, body:"", children:[], kids:[]}];						// Add start Lob
			this.AddChildList();																						// Add children	
			app.Draw();																									// Redraw

			if (app.login)	GetTextBox("Please log in","Type your user name:","",function(s) { 							// Login
								app.userName=s;																			// Set name
								let i=GetCookie(app.doc.courseId+"_Last_"+s)											// Get last stop cookie
								if ((i > 0) && (i < app.doc.lobs.length))	app.doc.curPos=i;							// If valid start start there
								i=GetCookie(app.doc.courseId+"_Status_"+s)												// Get status cookie
								app.doc.SetStatusArray(i.split(","));													// Set status	
								app.Draw();																				// Redraw																		
								}); 		
	}

	GDriveLoad(id) 																								// LOAD DOC FROM GOOGLE DRIVE
	{
		var _this=this;																								// Save context
		var str="https://spreadsheets.google.com/feeds/cells/"+id+"/1/public/values?alt=json";						// Make url
		$.ajax( { url:str, dataType:'jsonp' }).done((data)=> {														// Get date				
			_this.InitFromJSON(data.feed.entry);										
		}).fail((msg)=> { Sound("delete");																			// Delete sound
						PopUp("<p style='color:#990000'><b>Couldn't load Google Doc!</b></p>Make sure that it is<br><b>\"Published to web\"</b><br> in Google",5000); // Popup warning
						});		
	}
		
		/*	
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
*/
	}																												// CLASS CLOSURE
	
	

