/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dialog to add resource macros to SCALE
/////////////////////////////////////////////////////////////////////////////////////////////////////////

	CKEDITOR.dialog.add("scaleDialog", function(editor) {
		var str='Assignment and media makers go here'
		
		
		
		
		
		return {
			title: 'Edit SCALE resource',
			contents: [{
				id: "dialogContent",
				elements: [	{  type: 'html',  html: str }],
				}],
			onLoad: function() {},
			onOk: function() {
				editor.insertHtml("scalemedia(myUrl)");	// Add iframe to text
				}
			};
	});


	function trace(msg)
	{
		console.log(msg)
	}

