var demoLobs=[ 
{ type:"course", name:"WriteMao", id:1, subs:[2] }, 
{ type:"lesson", name:"Clauses", id:2, subs:[3,4,14] }, 
{ type:"topic", name:"Kinds of clauses", id:3, subs:[] }, 
{ type:"topic", name:"Separating clauses", id:4, subs:[5,6,7,13] }, 
{ type:"concept", name:"Using commas", id:5, subs:[] }, 
{ type:"concept", name:"Using joiners", id:6, subs:[] }, 
{ type:"concept", name:"Using semicolons", id:7, subs:[8,9,11,12] }, 
{ type:"step", name:"tell", id:8, subs:[] }, 
{ type:"step", name:"show", id:9, subs:[10] }, 
{ type:"page", name:"show", id:10, subs:[] }, 
{ type:"step", name:"find", id:11, subs:[] }, 
{ type:"step", name:"do", id:12, subs:[] }, 
{ type:"concept", name:"Using periods", id:13, subs:[] }, 
{ type:"topic", name:"Ordering clauses", id:14, subs:[] }
];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DOC
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Doc  {

	constructor(o)	{																							// CONSTRUCTOR
		o=demoLobs;
		this.lobs=[];																								// Holds learning objectas
		if (o)  this.lobs=demoLobs;																					// If default lobs set, use them
		else 	this.AddLob(0,new Lob("course"));																	// Add root
		this.curLob=this.lobs[0].id;																				// Set current lob
		this.firstName="Jerry";		this.lastName="Bruner";
		
	trace(this.FindLobById(this.curLob))

		this.curLob=this.NextLob(this.curLob)
	trace(this.FindLobById(this.curLob))
}


	AddLob(parentId,lob) {																						// ADD NEW LOB
		this.lobs.push(lob);																						// Add to collection
		if (!parentId)																								// If root
			return lob.id;																							// Quit and return id
		var l=this.FindLobById(parentId);																			// Get pointer to subs array
		if (l)																										// If subs member found
			l.subs.push(lob.id);																					// Add to subs array																							
		return lob.id;																								// Return id
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


	FindLobParent(id) {																							// FIND PTR TO LOB PARENT
		var i,j,n=this.lobs.length
		for (i=0;i<n;++i) {																							// For each lob
				for (j=0;j<this.lobs[i].subs.length;++j) {															// For each sub
					if (id == this.lobs[i].subs[j])																	// A match
						return this.lobs[i];																		// Return ptr to lob's parent
					}
			}
		return null;																								// Not found
		}


	NextLob(clob) {
		var p=this.FindLobById(clob);																				// Point at lob
		if (!p)																										// If no parent
			return null;																							// Quit with error
		// Am I at head
			// Go to 1st sub
		// Am I in a sub of parent
			// if not last
				// Advance in sub
			// If last
			



	
		for (i=0;i<p.subs.length;++i) {																			// Look thru subs
			if (this.curLob == p.subs[i]) {																		// If it's here
				if (i < subs.length-1) 																				// Not last sub
					return par.l[i+1];																			// Return next sub
				}
			}
		NextLob(par.id);																							// Recurse																					
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