///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CONTENT
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Content  {
	
	constructor()   {																							// CONSTRUCTOR
		}

	Draw() {																									// REDRAW
		var h=app.hgt-$("#headerDiv").height()-$("#navDiv").height()-36;											// Get height
		h=Math.min(h,1000);																							// Cap at 1000
		$("#contentDiv").height(h);																					// Size content
		var str="<img id='nextBut' src='img/next.png' class='wm-nextBut'>"; 										// Add next button
		$("#contentDiv").html(str);																					// Set content
		this.GetContentBody();																						// Add content
		var l=app.doc.curLob;																						// Point at lab
		$("#nextBut").on("click",()=> { app.doc.NextLob(); app.Draw(); ButtonPress("nextBut")} );					// On button click, navigate forward   
		}

	GetContentBody()	{																						// ADD LOB CONTENT
		var ifr,ifs,str="";
		$("#zoomerOuterDiv").remove();																				// Kill any left-over zoomers
		app.allowResize=true;																						// Allow resizing
		var l=app.doc.curLob;																						// Point at lab
		if (app.doc.curMapPos)																						// If not splash page
			str+=l.name ? "<div class='wm-pageTitle'>"+l.name+"</div>" : "";										// Add page title
		str+="<div id='contentBodyDiv' class='wm-contentBody'>";													// Container div
		if (l) {																									// Valid lob
			str+=l.body ? l.body : "";																				// Add body
			if (ifr=str.match(/scalemedia\((.+)\)/i)) {																// If a media tag
				var w=99.5,b=0;																						// Assume full width
				var h=$("#contentDiv").height()-200;																// Set default height												
				ifr=(""+ifr[1]).split(",");																			// Get params
				if (ifr[1])		h=h*ifr[1]/100;																		// Calc height based on height percentage
				if (ifr[2])		w=w*ifr[2]/100;																		// Width too
				if (ifr[3])		b=1;																				// Border
				ifs="<div style='text-align:center'>";																// For centering
				ifs+="<iframe class='wm-media' align='middle' frameborder='"+b+"' src='"+ifr[0]+"' style='height:"+h+"px;width:"+w+"%'></iframe></div>";	// Load in iframe
				str=str.replace(/scalemedia\(.+\)/i,ifs);															// Get tag and replace it with iframe
				}
			$("#contentDiv").append(str+"</div>");																	// Set content
		}
	}
}

/*
GDriveLoad(id) 																								// LOAD FROM GOOGLE DRIVE
{
	var _this=this;																								// Save context
	var str="https://docs.google.com/spreadsheets/d/"+id+"/export?format=tsv";									// Access tto
	var xhr=new XMLHttpRequest();																				// Ajax
	xhr.open("GET",str);																						// Set open url
	xhr.onload=function() { 																					// On successful load
		return;
		var i,v,csv;
		if (xhr.responseText) csv=xhr.responseText.replace(/\\r/,"");											// Remove CRs
		csv=csv.split("\n");																					// Split into lines
		_this.lobs=[]
		_this.map=[];
		for (i=1;i<csv.length;++i) {																			// For each line
			v=csv[i].split("\t");																				// Split into fields
			if (v[0] == "lob")																					// A lob
				_this.lobs.push({ name:v[2], id:v[1]-0, status:v[3].toUpperCase(), body:v[4]});					// Add learning object
			if (v[0] == "map")																					// A map
				_this.map.push({ level:v[2].toUpperCase(), id:v[1]-0, parent:v[3]-0 });							// Add mapping
			}
		_this.AddChildList(true);																				// Add children	
		_this.Draw()
		trace(_this.map,_this.lobs)
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
*/

