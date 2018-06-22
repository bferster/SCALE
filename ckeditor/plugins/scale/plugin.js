CKEDITOR.plugins.add( 'scale', {
    icons: 'scale',
    init: function( editor ) {
        editor.addCommand( 'scale', new CKEDITOR.dialogCommand( 'scaleDialog' ) );
        editor.ui.addButton( 'scale', {
            label: 'Add SCALE resource',
            command: 'scale',
            toolbar: 'scale'
        });
        CKEDITOR.dialog.add( 'scaleDialog', this.path + 'dialogs/scale.js' );
    }
});