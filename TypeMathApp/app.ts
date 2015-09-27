/// <reference path="../TypeMath/typings/jquery.d.ts" />

import TypeMath from '../TypeMath/typemath';

window.onload = () => {
	let app = new TypeMath($("#field"), $("#latex"), $("#candy"), $("#ghost"), $("#select"), $('#debug'));

	let $importer = $("#importer")
	  , $importerBox = $('#importer>textarea')
	  , $autosave = $("input#autosave")
	  , $proof = $("input#proofMode")
	  , $btnimport = $('button#import');

	// restore from local storage
	let code = "";
	if (code = localStorage.getItem("latex"))
	{
		console.log("load localStorage");
		$autosave.prop("checked", true);
		app.importLaTeXCode(code);
	}
	if (localStorage.getItem("proof")) {
		$proof.prop("checked", true);
	}

	// ui event handling
	$proof.change(e => {
		app.proofMode = $proof.prop('checked');
		if (app.proofMode) { localStorage.setItem('proof', '_'); }
		else { localStorage.removeItem('proof'); }
		$("#latex").focus();
	});
	$autosave.change(e => {
		let autosave = $autosave.prop('checked');
		if (autosave) { localStorage.setItem('latex', app.latexCode); }
		else { localStorage.removeItem('latex'); }
		$("#latex").focus();
	});
	$btnimport.on('mouseup', (e) => {
		if ($importer.css('visibility') === 'visible') {
			let code = $importerBox.val();
			app.importLaTeXCode(code);
			$importer.css('visibility', 'hidden');
			$("#latex").focus();
		}
		else {
			$importerBox.val('');
			$importer.css('visibility', 'visible');
			$importerBox.focus();
		}
	});

	app.changed = () => {
		if ($autosave.prop('checked')) {
			localStorage.setItem('latex', app.latexCode);
		}
	};
};
