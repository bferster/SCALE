/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dialog to add resource macros to SCALE
/////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	CKEDITOR.dialog.add("scaleDialog", function(editor) {
		var str=AssessMacro();
		var asks=[];
		return {
			title: 'Edit SCALE resource',
			contents: [{
				id: "dialogContent",
				elements: [	{  type: 'html',  html: str }],
				}],
			onShow: function() {
			trace(123)
			},
			onOk: function() {
				editor.insertHtml("assess(1|2|3|4)");	// Add iframe to text
				}
			};
	});

	function AssessMacro()
	{
		var i,o
		var app=window.parent.app;												// Point at scale app
		for (i=0;i<app.doc.asks.length;++i) {									// For each ask
			o=app.doc.asks[i];													// Point at ask
			asks.push(o.id+" - "+o.name);										// Add to pulldown
			}
		var str="<br><table class='wm-navTable'>";								
		str+="<tr><td><b>Questions&nbsp;</b></td><td>"+MakeSelect("ckAsksBut",false,asks)+"</td><td>&nbsp;<div id='ckAddAskBut' class='wm-bs'>Add</div></td>";
		str+="</table>";
		return str;
	}

	function trace(msg) {	console.log(msg);	}
	