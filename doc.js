// GLOBALS /////////////////////////////////////////////////////////////////////////////////////////////////////////

const COURSE=0, LESSON=1, TOPIC=2, CONCEPT=3, STEP=4, PAGE=5, NUMLEVELS=6;
const TODO=0, DONE=10;

// DOC /////////////////////////////////////////////////////////////////////////////////////////////////////////

class Doc  {

	constructor(o)	{																							// CONSTRUCTOR
		o=demo;
		this.lobs=this.map;																							// Holds learning objects/map
		if (o)  {																									// If default data
			this.lobs=o.lobs;																						// Add lobs
			this.map=o.map;																							// Add map
			}
		this.curMapPos=0;																							// Start at lesson
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
			if (id == this.lobs[i].id) 																				// A match
				return this.lobs[i];																				// Return ptr to lob
			}
		return null;																								// Not found
		}

	FindMapIndexById(id) {																						// FIND MAP INDEX FROM ID
		var i,n=this.map.length;
		for (i=0;i<n;++i) {																							// For each lob
			if (id == this.map[i].id) 																				// A match
				return i;																							// Return index
			}
		return -1;																								// Not found
		}

	GetStatus(mapPos, child) {																					// FIND MAP ITEM'S STATUS
		var status=TODO;																							// Assume not done
		var m=this.map[mapPos];
		var level=m.level;
		if (level == LESSON && !child)
			return DONE;
		if (level == TOPIC && child < 2)
			return DONE;
		return TODO;
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

// DATA /////////////////////////////////////////////////////////////////////////////////////////////////////////


var demo={
	lobs:[	{ name:"WriteMao", id:10, status: 0 }, 
			{ name:"Clauses and phrases", id:20, status: TODO }, 
			{ name:"Kinds of clauses", id:30, status: DONE }, 
			{ name:"Separating clauses", id:40, status: TODO }, 
			{ name:"Using commas", id:50, status: DONE }, 
			{ name:"Using joiners", id:60, status: DONE }, 
			{ name:"Using semicolons", id:70, status: TODO }, 
			{ name:"tell - 1 of 2", id:80, status: TODO }, 
			{ name:"tell - 2 of 2", id:90, status: TODO }, 
			{ name:"show", id:100, status: TODO }, 
			{ name:"find", id:110, status: TODO }, 
			{ name:"do", id:120, status: TODO }, 
			{ name:"Using periods", id:130, status: TODO }, 
			{ name:"Ordering clauses", id:140, status: TODO },
			{ name:"Assessment", id:150, status: TODO },
/*15*/		{ name:"Media demo", id:200, status: TODO },
			{ name:"Video", id:210, status: TODO },
			{ name:"Qmedia", id:211, status: TODO },
			{ name:"YouTube Video", id:212, status: TODO },
			{ name:"Images", id:220, status: TODO },
/*20*/		{ name:"Maps", id:221, status: TODO },
			{ name:"Zoomable Image", id:222, status: TODO },
			{ name:"Montage", id:223, status: TODO },
			{ name:"3D Model", id:224, status: TODO },
			{ name:"Tools", id:230, status: TODO },
			{ name:"Assessment", id:231, status: TODO },
			{ name:"Graphing calculator", id:232, status: TODO },
			{ name:"Chemistry (Drawing molecules)", id:233, status: TODO },
			{ name:"Today's News", id:234, status: TODO },
			{ name:"Data Visualization", id:240, status: TODO },
			{ name:"Tree graph", id:241, status: TODO },
			{ name:"Network graph", id:242, status: TODO },
			{ name:"Parallel graph", id:243, status: TODO },
			{ name:"Chord chart", id:244, status: TODO }
			],

	map:[{ level:COURSE, id:10, children:[2] }, 
				{ level:LESSON, id:20, parent: 0, children:[30,40,140,200,150] }, 
				{ level:TOPIC, id:30, parent:1, children:[] }, 
				{ level:TOPIC, id:40, parent:1, children:[50,60,70,130] }, 
					{ level:CONCEPT,id:50, parent:3, children:[] }, 
					{ level:CONCEPT,id:60, parent:3, children:[] }, 
					{ level:CONCEPT,id:70, parent:3, children:[80,100,110,120] }, 
						{ level:STEP, id:80, parent:6, children:[90] }, 
							{ level:PAGE, id:90, parent:7, children:[] }, 
						{ level:STEP, id:100, parent:6, children:[] }, 
	/*10*/					{ level:STEP, id:110, parent:6, children:[] }, 
						{ level:STEP, id:120, parent:6, children:[] }, 
					{ level:CONCEPT,id:130, parent:3, children:[] }, 
				{ level:TOPIC, id:140, parent:1, children:[] }, 
				{ level:TOPIC, id:200, parent:1, children:[210,220,230,240] }, 
	/*15*/				{ level:CONCEPT,id:210, parent:14, children:[211,212] }, 
						{ level:STEP, id:211, parent:15, children:[] }, 
						{ level:STEP, id:212, parent:15, children:[] }, 
					{ level:CONCEPT,id:220, parent:14, children:[221,222,223,224] }, 
						{ level:STEP, id:221, parent:18, children:[] }, 
	/*20*/				{ level:STEP, id:222, parent:18, children:[] }, 
						{ level:STEP, id:223, parent:18, children:[] }, 
						{ level:STEP, id:224, parent:18, children:[] }, 
					{ level:CONCEPT,id:230, parent:14, children:[150,232,233,234] }, 
						{ level:STEP, id:150, parent:23, children:[] }, 
	/*25*/				{ level:STEP, id:232, parent:23, children:[] }, 
						{ level:STEP, id:233, parent:23, children:[] }, 
						{ level:STEP, id:234, parent:23, children:[] }, 
					{ level:CONCEPT,id:240, parent:14, children:[241,242,243,244] }, 
						{ level:STEP, id:241, parent:28, children:[] }, 
	/*30*/				{ level:STEP, id:242, parent:28, children:[] }, 
						{ level:STEP, id:243, parent:28, children:[] }, 
						{ level:STEP, id:244, parent:28, children:[] }, 
				{ level:TOPIC, id:150, parent:1, children:[] } 
			]
}

demo.lobs[0].body=`<br><br><br><p style="text-align:center"><img alt="" src="img/scaleLogo.png" /></p>
<h1 style="text-align:center"><span style="background-color:transparent; color:rgb(153, 153, 153); font-family:trebuchet ms; font-size:18pt">S C A L E</span></h1>
<h1 style="text-align:center"><span style="background-color:transparent; color:rgb(153, 153, 153); font-family:trebuchet ms; font-size:18pt">Student-Centered Adaptive Learning Environment</span></h1>
<br>
<p style="text-align:center"><span style="font-size:14px"><em>A platform to guide learning- not just deliver it.</em></span></p>
`
demo.lobs[1].body=`<p style="text-align:left;font-size:14px"><span><span style="font-family:arial,helvetica,sans-serif">This semester, I hope you&#39;ll&nbsp;write in every class, and not just here. Nothing is more effective for learning a subject matter than writing about it &ndash; or teaching it. (Ask any teacher.) So, when an instructor assigns a chapter, summarize it or write a critique. You&#39;ll improve your performance in that course, and you&#39;ll improve your performance here. If you&#39;re not in school now, you could keep a journal. And always write carefully, as you would if you were submitting a writing to your instructor. This includes your email. One of my own goals is to proofread my emails. Make it your goal too. The editing will be very good practice for us all,</span></span></p>
`
demo.lobs[2].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about the kinds of clauses.</p>";
demo.lobs[3].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about separating clauses.</p>";
demo.lobs[4].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about using commas.</p>";
demo.lobs[5].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about using joiners.</p>";
demo.lobs[6].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about using semicolons.</p>";
demo.lobs[7].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about using semicolons (Tell page 1).</p>";
demo.lobs[8].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about using semicolons (Tell page 2).</p>";
demo.lobs[9].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about using semicolons (Show).</p>";
demo.lobs[10].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about using semicolons (Find).</p>";
demo.lobs[11].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about using semicolons (Do).</p>";
demo.lobs[12].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about using periods.</p>";
demo.lobs[13].body="<br><br><br><p style='text-align:center'>This panel will contain instruction about ordering clauses.</p>";
demo.lobs[14].body="<br><br>scaleMedia(assess.htm,66,66)<p style='text-align:center'>Full traditional assessment tools are available.</p>";
demo.lobs[15].body=`<p style="text-align:center"><img src='img/scaleLogo.png' height='32'"></p>
<blockquote><blockquote><blockquote><blockquote><blockquote>
You can easily add a wide variety of interactive media elements into your course.<br> Although almost any web-app can be added, SCALE includes a number of useful built-in elements:<br>
<ul><li><strong>Audio and video clips</strong></li>
	<li><strong>Images animation</strong></li>
	<li><strong>Maps</strong></li>
	<li><strong>3D models</strong></li>
	<li><strong>Assessments</strong></li>
	<li><strong>Tools </strong></li>
	<li><strong>Data visualizations</strong></li></ul>
<p> Clicking on the next button below will show samples of media the can be added.</p>
</blockquote></blockquote></blockquote></blockquote></blockquote>
`
demo.lobs[16].body=`<p style="text-align:center"><img src='img/scaleLogo.png' height='32'"></p>
<blockquote><blockquote><blockquote><blockquote><blockquote>
<p>You can easily add video and audio based media elements to the course. This can be as simple as adding Youtube, Vimeo, or Kaltura clips that begin and end at particular times, to a full multimedia experience provided by the Qmedia authoring tool.</p>
<ul><li><strong>Audio and video clips</strong></li>
	<li><strong>YouTube</strong></li>
	<li><strong>Vimeo</strong></li>
	<li><strong>Kaltura</strong></li>
	<li><strong>Qmedia</strong></li>
	<li><strong>3D animations </strong></li></ul>
	<p>Clicking on the next button below will show samples of YouTube and Qmedia clips.</p>
</blockquote></blockquote></blockquote></blockquote></blockquote>
`
demo.lobs[17].body=`scaleMedia(//stagetools.com/qmedia/show.htm?1479)
<p>Qmedia provides new ways to use video for instructional  purposes. This demo is live, so you can try out Qmedia here, or see the <a href='//qmediaplayer.com' target='_blank'> Qmedia website</a>.</p>
`
demo.lobs[18].body=`scaleMedia(https://www.youtube.com/embed/2doZROwdte4,66)
<p style='text-align:center'>You can add video and audio based media elements to the course.<br>We support Youtube, Vimeo, or Kaltura clips that can begin and end at particular time.</p>
`
demo.lobs[19].body=`<p style="text-align:center"><img src='img/scaleLogo.png' height='32'"></p>
<blockquote><blockquote><blockquote><blockquote><blockquote>
<p>These can show a single image, a zoomable, slide-show, an animated pan-and zoom with a single image, or even a Ken Burns-style montage with multiple images and audio track.<p>
<ul><li><strong>Audio and video clips</strong></li>
	<li><strong>Maps</strong></li>
	<li><strong>Zoomable images</strong></li>
	<li><strong>Image Montages</strong></li>
	<li><strong>3D models </strong></li></ul>
	<p>Clicking on the next button below will show samples image media elements.</p>
</blockquote></blockquote></blockquote></blockquote></blockquote>
`
demo.lobs[20].body=`scaleMedia(//www.viseyes.org/shiva/go.htm?e=1103)
<p style='text-align:center'>Add maps with image and marker overlay with a number of different basemap styles.</p>
`
//demo.lobs[21].body=`zoomer(//farm9.staticflickr.com/8019/7310697988_08d33c75b3_o.jpg)
//<p style='text-align:center'>Add high-resolution images with controls to pan and zoom through them.</p>
//`
demo.lobs[21].body=`scaleMedia(//www.viseyes.org/shiva/go.htm?e=3554)
<p style='text-align:center'>Add high-resolution images with controls to pan and zoom through them.</p>
`
demo.lobs[22].body=`scaleMedia(//www.viseyes.org/shiva/go.htm?e=393)
<p style='text-align:center'>Add animated pan-and zoom for a Ken Burns-style montage with multiple images and audio track.<br>Click on the play button in the center to play move.</p>
`
demo.lobs[23].body=`scaleMedia(//stagetools.com/qmedia/wgl.htm)
<p style='text-align:center'>Fully interactive 3D scenes and walk-throughs. You can rotate around this scene by dragging.</p>
`
demo.lobs[24].body=`<p style="text-align:center"><img src='img/scaleLogo.png' height='32'"></p>
<blockquote><blockquote><blockquote><blockquote><blockquote>
<p>SCALE has full assesment tools, as well as accesws to discipline-specific tools such as graphing calculator .<p>
<ul><li><strong>Audio and video clips</strong></li>
	<li><strong>Assessments</strong></li>
	<li><strong>Graphing calculator</strong></li>
	<li><strong>Chemistry tools</strong></li>
	<li><strong>Websites and web-services</strong></li></ul>
	<p>Clicking on the next button below will show sample tools.</p>
</blockquote></blockquote></blockquote></blockquote></blockquote>
`
demo.lobs[26].body=`<br><br>scaleMedia(//www.viseyes.org/shiva/graphr/?x^3/20,66,66,1)
<p style='text-align:center'>Tools such as this interactive graphing caculator can be added.<br>The results being sent back to SCALE to automatically assess progress.</p>
`
demo.lobs[27].body=`<br>scaleMedia(//stagetools.com/qmedia/chem/chemdraw.htm,66)
<div style='text-align:center'>This interactive molecule drawing tool can send results being sent back to SCALE to automatically assess progress.</div>
`
demo.lobs[28].body=`scaleMedia(//www.washingtonpost.com/)
<p style='text-align:center;font-weight:bold'> Link to any website, or web-service, live.</p>
`
demo.lobs[29].body=`<p style="text-align:center"><img src='img/scaleLogo.png' height='32'"></p>
<blockquote><blockquote><blockquote><blockquote><blockquote>
<p>Visualizations make data more accessible. SCALE draws on the SHIVA data visualization tools display Google spreadsheet data in meaningful ways.<p>
<ul><li><strong>Tree Graphs</strong></li>
	<li><strong>Network graphs</strong></li>
	<li><strong>Charts</strong></li></ul>
	<p>Clicking on the next button below will show samples of data visualizations.</p>
</blockquote></blockquote></blockquote></blockquote></blockquote>
`
demo.lobs[30].body=`scaleMedia(//www.viseyes.org/shiva/go.htm?e=3637)
<p style='text-align:center'>Tree graphs show hierarchical data in an easy to understand form. You can open and close nodes.</p>
`
demo.lobs[31].body=`scaleMedia(//www.viseyes.org/shiva/go.htm?e=1121)
<p style='text-align:center'>Network graphs show relations between items.</p>
`
demo.lobs[32].body=`scaleMedia(//www.viseyes.org/shiva/go.htm?e=3638)
<p style='text-align:center'>Parallel graphs allow for interesting explorations of causal data. Highlight the lines to see how the factors relate to one another.</p>
`
demo.lobs[33].body=`scaleMedia(//www.viseyes.org/shiva/go.htm?e=3639,75,66)
<p style='text-align:center'>Chord graphs show relations between items.</p>
`
