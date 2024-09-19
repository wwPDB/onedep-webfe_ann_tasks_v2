/*
 * File:  annTasksCommon.js
 * Date:  21-April-2012  J. Westbrook
 *
 * Updates:
 *  23-April-2012  jdw -  Revise session model.
 *  23-April-2012  jdw -  Separate applet launch and load operations.
 *  29-June-2012   jdw -  Remove foundation methods -
 *   1-July-2012   jdw -  Fixed column table option fixed
 *                 jdw -  Assembly selection callback assigned to button
 *                     -  download option -
 *   4-July-2012   jdw -  added form configuration for "other annotation tasks"
 *                     -  new session called on reloading upload page.
 *   6-July-2012   jdw -  add support to preserve and recover command line arguments.
 *                     -  add file label for edit option
 *   8-July-2012   jdw -  use local url for editor module.
 *   9-July-2012   rds -  Fixed jmol dialog bug fix with different browser dependencies.
 *  10-July-2012   rds -  Fixed bug fix for ajax file upload for older browsers.
 *   2-Aug -2012   jdw -  Fix initialization problem with entryId/FileName
 *  31-Jan -2013   jdw -  Add additional upload for experimental data -
 *  20-Feb-2013    jdw -  errortext->statustext
 *  29-Apr-2013    jdw -  Add plugin from sequence module for handling manual input of assembly details.
 *  02-Apr-2013    jdw -  Add provenance in assembly results table
 *  04-Apr-2013    jdw -  Add map calculation option.
 *  03-May-2013    jdw -  Fix iframe size for the editor
 *  07-Oct-2013    zk  -  Add additional correspondence to depositor
 *  09-Oct-2013    zk  -  Add manual coordinate editing
 *  18-Oct-2013    jdw -  Add new dcc tasks
 *  12-Nov-2013    jdw -  Add jsmol functions
 *  13-Nov-2013    jdw -  Add jsmol map display functions
 *  15-Nov-2013    jdw    Fixed update problem with jquery.ief plugin
 *  25-Nov-2013    jdw    Fixed upload problem for secondary structure and coordinate transformation
 *  12-Dec-2013    jdw    Add options for merging replacement coordinates and replacing terminal atoms.
 *  16-Jan-2014    jdw    Update JMOL configuration
 *  28-Jan-2014    jdw    reset iframe height for editor module to 3.5K
 *  09-Feb-2014    jdw    add finish call back
 *
 * 10-Feb-2014     jdw    v2
 * 17-Feb-2014     jdw    disable old footer handling
 * 12-Mar-2014     jdw    restyle coordinate editor and add event to expose embedded coordinate tables -
 * 18-Mar-2014     jdw    change close button style on dialogs
 * 19-Mar-2014     jdw    add sidebar nav to check reports
 *                        Add menu item highlighting
 * 23-Mar-2014     jdw    Add close confirmations
 *  2-Apr-2014     jdw    Reorganize the modal confirmation dialog and progress display handling.
 * 13-Jun-2014     jdw    Add entryinfo service
 * 14-Sep-2014     jdw    add NMR tools
 * 16-Sep-2014     jdw    adding upload check in progress --- jdw
 * 24-Sep-2014     jdw    add support for chemical shift data files -
 *  3-Jul-2015     jdw    add visualization of generated assemblies and persistence of generated state.
 * 30-Aug-2015     jdw    add broader map display and edit functions
 * 22-Oct-2015     jdw    add em file download support
 * 04-Jun-2016     ep     add variables for status, experimental methods and if CS file writen to archive. 
 *                        add a callback for a task for additional processing.
 *                        for NMR on REPL/PROC in which CS file not written to archive - warn
 * 13-Jan-2017     ep     add special-position-update-task-form support
 * 19-Feb-2017     ep     add opening of editor module on page load
 * 04-Oct-2017     zf     add getEntityInfoDetails(), getSymopInfoDetails(), getAsuJsmolLink() & select_entry()
 * 07-Jul-2021     zf     removed 'site-task-form', added set_all_monomers(), and $('#add_row_button').click(function() {});
 * 14-Nov-2023     zf     add entryNmrDataFileName
 * 09-Aug-2024     zf     add uploadBiomtServiceUrl, assemblyAcceptServiceUrl,  and #point-suite-dialog section
 * 10-Sep-2024     zf     add MissingPcmStatus variable
 * 19-Sep-2024     zf     add 'flag' parameter to show_model_in_mol_star() function
 */
//
// Globals -
//
var sessionId = '';
var entryId = '';
var entryFileName = '';
var entryExpFileName = '';
var entryNmrDataFileName = '';
var entryCsFileName = '';
var successFlag = 'false';
var errorFlag = '';
var errotText = '';
var wfStatus='';
var AssemblyStatus='';
var MissingPcmStatus='';
var standaloneMode='';
var pagePath ='';
var entStatusCode='';
var experimentalMethods = '';
//
var fullTaskIdList = ['#solvent-task-form',
                      '#link-task-form',
                      '#secstruct-task-form',
                      '#nafeature-task-form',
                      // '#site-task-form',
                      '#extracheck-task-form',
                      '#valreport-task-form',
                      '#mapcalc-task-form',
                      '#npcc-mapcalc-task-form',
                      '#dcc-calc-task-form',
                      '#dcc-refine-calc-task-form',
                      '#trans-coord-task-form',
                      '#special-position-task-form',
                      '#special-position-update-task-form',
                      '#tls-range-correction-form',
                      '#mtz-mmcif-conversion-form',
                      '#sf-mmcif-free-r-correction-form',
                      '#database-related-correction-form',
                      '#mtz-mmcif-semi-auto-conversion-form',
                      '#biso-full-task-form',
                      '#terminal-atoms-task-form',
                      '#merge-xyz-task-form',
                      '#geom-valid-task-form',
                      '#dict-check-task-form',
                      '#reassign-altids-task-form',
                      '#reflection-file-update-task-form',
                      '#nmr-cs-upload-check-form',
                      '#nmr-cs-atom-name-check-form',
                      '#nmr-rep-model-update-form',
                      '#nmr-cs-update-archive-form',
                      '#nmr-data-processing-form',
                      '#nmr-cs-processing-form',
                      '#nmr-cs-edit-form',
];

var uploadFileTaskIdList = [ '#tls-range-correction-form', '#mtz-mmcif-conversion-form' ];

var fullTaskDict  = {'#solvent-task-form'          : '/service/ann_tasks_v2/solventcalc',
                     '#link-task-form'             : '/service/ann_tasks_v2/linkcalc',
                     '#secstruct-task-form'        : '/service/ann_tasks_v2/secstructcalc',
                     '#nafeature-task-form'        : '/service/ann_tasks_v2/naFeaturescalc',
                     // '#site-task-form'             : '/service/ann_tasks_v2/sitecalc',
                     '#dict-check-task-form'       : '/service/ann_tasks_v2/dictcheck',
                     '#extracheck-task-form'       : '/service/ann_tasks_v2/extracheck',
                     '#valreport-task-form'        : '/service/ann_tasks_v2/valreport',
                     '#mapcalc-task-form'          : '/service/ann_tasks_v2/mapcalc',
                     '#npcc-mapcalc-task-form'     : '/service/ann_tasks_v2/npccmapcalc',
                     '#dcc-calc-task-form'         : '/service/ann_tasks_v2/dcccalc',
                     '#dcc-refine-calc-task-form'  : '/service/ann_tasks_v2/dccrefinecalc',
                     '#trans-coord-task-form'      : '/service/ann_tasks_v2/transformcoordcalc',
                     '#special-position-task-form' : '/service/ann_tasks_v2/specialpositioncalc',
                     '#special-position-update-task-form' : '/service/ann_tasks_v2/specialpositionupdate',
                     '#tls-range-correction-form' : '/service/ann_tasks_v2/tlsrangecorrection',
                     '#mtz-mmcif-conversion-form' : '/service/ann_tasks_v2/mtz_mmcif_conversion',
                     '#sf-mmcif-free-r-correction-form' : '/service/ann_tasks_v2/correcting_sf_free_r_set',
                     '#database-related-correction-form' : '/service/ann_tasks_v2/correcting_database_releated',
                     '#mtz-mmcif-semi-auto-conversion-form' : '/service/ann_tasks_v2/mtz_mmcif_conversion',
                     '#biso-full-task-form'        : '/service/ann_tasks_v2/bisofullcalc',
                     '#terminal-atoms-task-form'   : '/service/ann_tasks_v2/terminalatomscalc',
                     '#merge-xyz-task-form'        : '/service/ann_tasks_v2/mergexyzcalc',
                     '#geom-valid-task-form'       : '/service/ann_tasks_v2/geomvalidcalc',
                     '#reassign-altids-task-form'  : '/service/ann_tasks_v2/reassignaltidscalc',
                     '#reflection-file-update-task-form' : '/service/ann_tasks_v2/update_reflection_file',
                     '#nmr-cs-upload-check-form'        : '/service/ann_tasks_v2/nmr_cs_upload_check',
                     '#nmr-cs-atom-name-check-form'     : '/service/ann_tasks_v2/nmr_cs_atom_name_check',
                     '#nmr-rep-model-update-form'       : '/service/ann_tasks_v2/nmr_rep_model_update',
                     '#nmr-cs-update-archive-form'      : '/service/ann_tasks_v2/nmr_cs_archive_update',
                     "#nmr-cs-update-form"              : '/service/ann_tasks_v2/nmr_cs_update',
                     "#nmr-cs-misc-checks-form"         : '/service/ann_tasks_v2/nmr_cs_misc_checks',
                     "#nmr-data-processing-form"        : '/service/ann_tasks_v2/nmr_data_auto_processing',
                     "#nmr-cs-processing-form"          : '/service/ann_tasks_v2/nmr_cs_auto_processing',
                     "#nmr-cs-edit-form"                : '/service/ann_tasks_v2/cs_editor',
};

var uploadFromIdServiceUrl = '/service/ann_tasks_v2/uploadfromid';
var uploadServiceUrl = '/service/ann_tasks_v2/upload';
var uploadBiomtServiceUrl = '/service/ann_tasks_v2/upload_biomt';
var newSessionServiceUrl = '/service/ann_tasks_v2/newsession';
var endSessionServiceUrl = '/service/ann_tasks_v2/finish';

var jmolLaunchServiceUrl = '/service/ann_tasks_v2/launchjmol';
var jmolWithMapLaunchServiceUrl = '/service/ann_tasks_v2/launchjmolwithmap';
var mapFlag=false;
var omitMapFlag=false;
var assemblyAcceptServiceUrl = '/service/ann_tasks_v2/assemblyaccept';
var assemblyCalcServiceUrl = '/service/ann_tasks_v2/assemblycalc';
var assemblyRestartServiceUrl = '/service/ann_tasks_v2/assemblyrestart';
var assemblySelectServiceUrl = '/service/ann_tasks_v2/assemblyselect';

var assemblyLoadFormServiceUrl = '/service/ann_tasks_v2/assemblyloadform';
var assemblySaveFormServiceUrl = '/service/ann_tasks_v2/assemblysaveform';
var assemblySaveDefaultServiceUrl = '/service/ann_tasks_v2/assemblysavedefaultinfo';

var assemblyLoadDepInfoServiceUrl = '/service/ann_tasks_v2/assemblyloaddepinfo';
var depInfoDisplayFlag = 'false';

var getSessionInfoServiceUrl = '/service/ann_tasks_v2/getsessioninfo';

var correspondenceSelectServiceUrl = '/service/ann_tasks_v2/getcorrespondencetemplate';
var correspondenceGenerateServiceUrl = '/service/ann_tasks_v2/generatecorrespondence';

var coordFormServiceUrl = '/service/ann_tasks_v2/manualcoordeditorform';
var coordEditorSavingServiceUrl = '/service/ann_tasks_v2/manualcoordeditorsave';
var coordUpdateServiceUrl = '/service/ann_tasks_v2/manualcoordeditorupdate';
var checkReportIdOpsUrl = '/service/ann_tasks_v2/checkreports';
//
var getLocalMapInfoServiceUrl='/service/ann_tasks_v2/localmapinfo';

//  NMR
var uploadMultiServiceUrl = '/service/ann_tasks_v2/uploadmulti';
var csFormServiceUrl = '/service/ann_tasks_v2/manualcseditorform';
var csEditorSavingServiceUrl = '/service/ann_tasks_v2/manualcseditorsave';
var csUpdateServiceUrl = '/service/ann_tasks_v2/manualcseditorupdate';

// PCM
var pcmFormServiceUrl = '/service/ann_tasks_v2/pcm_get_ccd_form';

//
// Globals for JSmol
//
var jsmolAppOpen={};
var jsmolAppDict={};


/*window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};*/

(function(){var b,d,c=this,a=c.console;c.log=b=function(){d.push(arguments);a&&a.log[a.firebug?"apply":"call"](a,Array.prototype.slice.call(arguments))};c.logargs=function(e){b(e,arguments.callee.caller.arguments)};b.history=d=[]})();
String.prototype.startsWith = function (str){
	return this.indexOf(str) == 0;
};

function getModelFileUrl() {
    var url;
    var fn;
    if (entryFileName.length > 0) {
        fn = entryFileName;
        url = "/sessions/" + sessionId + "/" + fn;
    } else {
        url = "#";
        fn = "";
    }
    return url
}

function setDownloadModelFileUrl(id) {
    var url;
    var fn;
    if (entryFileName.length > 0) {
        fn = entryFileName;
        url = getModelFileUrl()
    } else {
        url = "#";
        fn = "";
    }
    $(id).attr("href", url);
    $(id).html(fn);
    $(id).show();
}
function getDownloadModelFileLabel() {
    var fn;
    if (entryFileName.length > 0) {
        fn = "Download annotated model file: ";
    } else {
        fn = "No model file uploaded";
    }
    return fn;
}
function setDownloadExpFileUrl(id) {
    var url;
    var fn;
    if (entryExpFileName.length > 0) {
        fn = entryExpFileName;
        url = "/sessions/" + sessionId + "/" + fn;
    } else {
        url = "#";
        fn = "";
    }
    $(id).attr("href", url);
    $(id).html(fn);
    $(id).show();
}
function getDownloadExpFileLabel() {
    var fn;
    if (entryExpFileName.length > 0) {
        fn = "Download experimental data file: ";
        //    } else {
        //      fn = "No experimental data file uploaded";
    }
    return fn;
}

function getDepId() {
    var fn;
    var entryFileNameSplit;
    entryFileNameSplit = entryFileName.split("_");
    fn = entryFileNameSplit[0] + "_" + entryFileNameSplit[1];

    return fn;
}

function display_mol_star(molecule_url = 'undefined', {mapsList = []}={}){
    molstar.Viewer.create('myViewer', {
                extensions: [],
                layoutIsExpanded: false,
                layoutShowControls: true,
                layoutShowRemoteState: false,
                layoutShowSequence: true,
                layoutShowLog: false,
                layoutShowLeftPanel: false,

                viewportShowExpand: false,
                viewportShowSelectionMode: false,
                viewportShowAnimation: false,
                volumeStreamingDisabled: true

            }).then(function(viewerInstance) {   // This could also be viewerInstance => {
		if (molecule_url !== 'undefined') {
            viewerInstance.loadAllModelsOrAssemblyFromUrl(molecule_url, 'mmcif', false, {representationParams: {theme: {globalName: 'operator-name'}}});
        }
        mapsList = JSON.parse(mapsList) //the returned object from the fetch is a string, this converts to a dictionary
        for (i = 0; i < mapsList.length; i++) {
                    viewerInstance.loadVolumeFromUrl(
                        {
                            url: mapsList[i]["url_name"],
                            format: 'dscif',
                            isBinary: true
                        },
                        [{
                            type: 'absolute',
                            value: mapsList[i]["contourLevel"],
                            color: mapsList[i]["mapColor"],
                            alpha: 0.35
                        }],
                        {
                            isLazy: false,
                            entryId: mapsList[i]["displayName"]
                        }
                    );
                }
            })
    }

function show_model_in_mol_star(flag){
    fetch('/service/ann_tasks_v2/molstarmapsjson?entryid='+getDepId()+'&primarymapflag='+flag).
    then(result => result.json()).then(data => display_mol_star(getModelFileUrl(), ({'mapsList':data['htmlcontent']})));
}

function uploadFile(serviceUrl, formElementId, progressElementId) {
    // Upload model of sf file -
    var bar = $('.bar');
    var percent = $('.percent');
    var serviceData = {};
    serviceData = getServiceContext();
    logContext("Starting uploadFile ");
    $(progressElementId).find('div').hide();
    var options = {
          beforeSubmit: function (arr, $form, options) {
	            arr.push({
                        "name": "sessionid",
                        "value": sessionId
                    });
                    arr.push({
                        "name": "entryid",
                        "value": entryId
                    });
                    arr.push({
                        "name": "entryfilename",
                        "value": entryFileName
                    });
                    arr.push({
                        "name": "entryexpfilename",
                        "value": entryExpFileName
                    });
                    arr.push({
                        "name": "entrynmrdatafilename",
                        "value": entryNmrDataFileName
                    });
                    arr.push({
                        "name": "entrycsfilename",
                        "value": entryCsFileName
                    });
	      },

	    beforeSend: function () {
	        $(progressElementId).find('div').show();
            var percentVal = '0%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        success:   function (jsonObj) {
	        if (jsonObj.errorflag) {
		        $(formElementId + " div.op-status ").html(jsonObj.statustext);
		        $(formElementId + " div.op-status ").show();
	        } else {
		        if ("entryid" in jsonObj) {
		            entryId = jsonObj.entryid;
		        }
		        if ("entryfilename" in jsonObj) {
		            entryFileName = jsonObj.entryfilename;
		        }
		        if ("entryexpfilename" in jsonObj) {
		            entryExpFileName = jsonObj.entryexpfilename;
		        }
		        if ("entrynmrdatafilename" in jsonObj) {
		            entryNmrDataFileName = jsonObj.entrynmrdatafilename;
		        }
		        if ("entrycsfilename" in jsonObj) {
		            entryCsFileName = jsonObj.entrycsfilename;
		        }
		        $(formElementId + " div.op-status ").html(jsonObj.htmlcontent);
		        $(formElementId + " div.op-status ").show();
		        //
		        $('#span_identifier').html(entryId).removeClass('displaynone');
		        $('title').html("Ann: " + entryId);
		        appendContextToMenuUrls();
		        $(progressElementId).find('div').hide(3000);
	        }
        },
        dataType: 'json'
    };
    $(formElementId).ajaxForm(options);
}

function uploadMultipleFiles(serviceUrl, formElementId, progressElementId) {
    // Upload model of sf file -
    var bar = $('.bar');
    var percent = $('.percent');
    logContext("Configure uploadMultipleFiles ...  "+sessionId);
    $(progressElementId).find('div').hide();
    // jdw
    //$("#nmr-cs-upload-check-form").hide();


	$(formElementId).ajaxForm({
		url: serviceUrl,
		dataType: 'json',
        beforeSubmit: function (arr, $form, options) {
	        arr.push({
                "name": "sessionid",
                "value": sessionId
            });
            arr.push({
                "name": "entryid",
                "value": entryId
            });

	    },

	    beforeSend: function () {
	        $(progressElementId).find('div').show();
            var percentVal = '0%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        success:   function (jsonObj) {
	        if (jsonObj.errorflag) {
		        $(formElementId + " div.op-status ").html(jsonObj.statustext);
		        $(formElementId + " div.op-status ").show();
	        } else {
		        $(formElementId + " div.op-status ").html(jsonObj.htmlcontent);
		        $(formElementId + " div.op-status ").show();
		        //
		        $(progressElementId).find('div').hide(3000);
                $("nmr-cs-upload-check-form").show();
                //$("#nmr-cs-atom-name-check").show();
	        }

	    }
    });
}

function uploadFromId(serviceUrl, formElementId) {
    logContext("Starting uploadFromId");
    $(formElementId + " div.op-status ").hide();

    var options = {
	url: serviceUrl,
        dataType: 'json',
        beforeSubmit: function (arr, $form, options) {
            progressStart();
	        arr.push({
                "name": "sessionid",
                "value": sessionId
            });
	    },
        success:   function (jsonObj) {
	        progressEnd();
	        if (jsonObj.errorflag) {
		        $(formElementId + " div.op-status ").html(jsonObj.statustext);
		        $(formElementId + " div.op-status ").show();
		        if ("entryid" in jsonObj) {
		            entryId = jsonObj.entryid;
		            $('#span_identifier').html(entryId).removeClass('displaynone');
		            $('title').html("Ann:" + entryId);
		            appendContextToMenuUrls();
		        }
	        } else {
		        if ("entryid" in jsonObj) {
		            entryId = jsonObj.entryid;
		        }
		        if ("entryfilename" in jsonObj) {
		            entryFileName = jsonObj.entryfilename;
		        }
		        if ("entryexpfilename" in jsonObj) {
		            entryExpFileName = jsonObj.entryexpfilename;
		        }
		        if ("entrynmrdatafilename" in jsonObj) {
		            entryNmrDataFileName = jsonObj.entrynmrdatafilename;
		        }
		        if ("entrycsfilename" in jsonObj) {
		            entryCsFileName = jsonObj.entrycsfilename;
		        }
		        logContext("After upload from idcode");
		        $(formElementId + " div.op-status ").html(jsonObj.htmlcontent);
		        $(formElementId + " div.op-status ").show();
		        //
		        $('#span_identifier').html(entryId).removeClass('displaynone');
		        $('title').html("Ann:" + entryId);
		        appendContextToMenuUrls();
	        }
        },
    };
    $(formElementId).ajaxForm(options);
}

function getEntryInfo(callback) {
    "use strict";
    var entryInfoUrl = '/service/ann_tasks_v2/entryinfo';
    var serviceData = getServiceContext();
    //if (callback != null) {
    //	serviceData.usesaved = 'yes';
    //}
    //serviceData['my_entryid'] = entryId;
    $.ajax({
        url: entryInfoUrl,
        async: true,
        data: serviceData,
        dataType: 'json',
        type: 'post',
        beforeSend: function() {
            logContext("Calling getEntryInfo from beforesend -----------");
            //progressStart();
        },
        success: function (jsonObj) {
            logContext("Success Calling getEntryInfo on success -----------");
	        if ("struct_title" in jsonObj  && jsonObj.struct_title.length > 0) {
		        $('#my_title').remove();
		        $('.page-header').append('<h5 id="my_title"> Title: ' + jsonObj.struct_title + '</h5>');
	        }
	        if ("comb_id" in jsonObj && jsonObj.comb_id.length > 0) {
		        $('title').html("Ann: " + jsonObj.comb_id);
	        } else if ("pdb_id" in jsonObj && jsonObj.pdb_id.length > 0) {
		        $('title').html("Ann: " + jsonObj.pdb_id + '/' + entryId);
	        }
	        if ("statuscode" in jsonObj && jsonObj.statuscode.length > 0) {
		        entStatusCode=jsonObj.statuscode;
	        }
	        if ("experimental_methods" in jsonObj && jsonObj.experimental_methods.length > 0) {
		        experimentalMethods=jsonObj.experimental_methods;
	        }
	        if (callback) {
	        	callback();
	        }	
            //progressEnd();
        }
    });
    //
    //logContext("After getEntryInfo ");
}

function newSession(context) {
    var retObj;
    clearServiceContext();
    var serviceData = getServiceContext();
    logContext("Calling newsession ");
    //$.ajax({url: newSessionServiceUrl, async: false, data: {context: context}, type: 'post', success: assignSession } );
    $.ajax({
        url: newSessionServiceUrl,
        async: false,
        data: serviceData,
        type: 'post',
        success: function (jsonObj) {
            retObj = jsonObj;
        }
    });
    //
    assignContext(retObj);
    logContext("After newsession ");
    appendContextToMenuUrls();
}

function closeWindow() {
    if (navigator.userAgent.match(/firefox/i) ){
	logContext("Call window for firefox");
	window.open('','_parent','');
	window.close();
    } else  {
	logContext("Call window for webkit");
	var win=window.open("","_self");
	win.close();
    }
}

//Callback function to invoke after GetEntryInfo in starting finish
function prepareToFinish1() {
    "use strict";
    logContext("Prepare to finish1 from GetEntryInfo");
    logContext("Exptl:" + experimentalMethods);
    var markup = null;
/*
    if (experimentalMethods.search('SOLUTION NMR|SOLID-STATE NMR') >= 0) {
	var tObj = getSessionInfo("");
	var nmrCS = tObj['#nmr-cs-update-archive-form'];
	var csFileArchived = false;
	if (nmrCS.statustext == 'Archive CS file update task completed.') {
	    if (nmrCS.errorflag == false) {
		csFileArchived = true;
	    }
	}
	logContext("csFileArchved " + csFileArchived);
	logContext("entStatusCode " + entStatusCode);

	if (entStatusCode.search('AUTH|PROC|REPL') >= 0 && csFileArchived == false) {
	    markup = "<p style='color:red'>Warning: The CS file has not been updated in the archive</p>";
	}
    }
*/
    prepareToFinish(endSession, markup);



    //alert(nmrCS);
	
}

function prepareToFinish(callback, markup) {
    var isComplete=false;
    if (markup == null) {
	markup =  "";
    }

    $("#confirm-dialog").dialog({
        resizable: false,
        modal: true,
        title: "Completion confirmation",
        height: 250,
        width: 400,
        async: true,
	close: function( event, ui ) {
	    logContext("Close action starts ... isComplete status " + isComplete);
	    if (isComplete) {
		callback();
	    }
	    logContext("Close action ends ... ");
	},
	open: function( event, ui) {
	    $(this).html(markup);
	},
        buttons: {
            "Done": function () {
		isComplete=true;
                $(this).dialog('close');
            },
            "Cancel": function () {
		isComplete=false;
                $(this).dialog('close');
            }
        }
    });

}

function endSession() {
    logContext("Starting endSession ");
    var serviceData = getServiceContext();
    $.ajax({
        url: endSessionServiceUrl,
        async: true,
        data: serviceData,
        type: 'post',
        beforeSend: function() {
            progressStart();
	        $("#confirm-dialog").html("Ready to leave this module?");
        },
        success: function (jsonObj) {
	        progressEnd();
	        if (jsonObj.errorflag) {
		        $("#op-status").html(jsonObj.statustext);
	        } else {
		        $("#op-status").html(jsonObj.htmlcontent);
		        $(window).unbind('beforeunload')
		        closeWindow();
	        }
        }
    });
}


function updateDownloadOptions(jsonObj) {
    var url;
    var el;
    var fn;
    var arr;
    var htmlS;

    if ("logfiles" in jsonObj) {
        arr = jsonObj.logfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-logfiles").html(htmlS);
            $("#download-logfiles-label").html("Log files:");
            $("#download-logfiles").show();
            $("#download-logfiles-label").show();
        }
    }
    if ("assemblymodelfiles" in jsonObj) {
        arr = jsonObj.assemblymodelfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-assembly-model-files").html(htmlS);
            $("#download-assembly-model-files-label").html("Assembly model files:");
            $("#download-assembly-model-files").show();
            $("#download-assembly-model-files-label").show();
        }
    }
    if ("genassemblymodelfiles" in jsonObj) {
        arr = jsonObj.genassemblymodelfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-genassembly-model-files").html(htmlS);
            $("#download-genassembly-model-files-label").html("Generated assembly model files:");
            $("#download-genassembly-model-files").show();
            $("#download-genassembly-model-files-label").show();
        }
    }
    if ("siteresultfiles" in jsonObj) {
        arr = jsonObj.siteresultfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-site-result-files").html(htmlS);
            $("#download-site-result-files-label").html("Site result files:");
            $("#download-site-result-files").show();
            $("#download-site-result-files-label").show();
        }
    }
    if ("pisareports" in jsonObj) {
        arr = jsonObj.pisareports;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-pisa-report-files").html(htmlS);
            $("#download-pisa-report-files-label").html("Pisa report files:");
            $("#download-pisa-report-files").show();
            $("#download-pisa-report-files-label").show();
        }
    }
    if ("checkxmlreportfiles" in jsonObj) {
        arr = jsonObj.checkxmlreportfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-check-xmlreport-files").html(htmlS);
            $("#download-check-xmlreport-files-label").html("PDBML check reports:");
            $("#download-check-xmlreport-files").show();
            $("#download-check-xmlreport-files-label").show();
        }
    }

    if ("checkreportfiles" in jsonObj) {
        arr = jsonObj.checkreportfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-check-report-files").html(htmlS);
            $("#download-check-report-files-label").html("Dictionary check reports:");
            $("#download-check-report-files").show();
            $("#download-check-report-files-label").show();
        }
    }

    if ("valreportfiles" in jsonObj) {
        arr = jsonObj.valreportfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-val-report-files").html(htmlS);
            $("#download-val-report-files-label").html("Validation reports:");
            $("#download-val-report-files").show();
            $("#download-val-report-files-label").show();
        }
    }

    if ("mapfiles" in jsonObj) {
        arr = jsonObj.mapfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-map-files").html(htmlS);
            $("#download-map-files-label").html("Map files:");
            $("#download-map-files").show();
            $("#download-map-files-label").show();
        }
    }
    if ("csfiles" in jsonObj) {
        arr = jsonObj.csfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-cs-files").html(htmlS);
            $("#download-cs-files-label").html("Chemical shift files:");
            $("#download-cs-files").show();
            $("#download-cs-files-label").show();
        }
    }

    // ok
    if ("dccfiles" in jsonObj) {
        arr = jsonObj.dccfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-dcc-files").html(htmlS);
            $("#download-dcc-files-label").html("DCC files:");
            $("#download-dcc-files").show();
            $("#download-dcc-files-label").show();
        }
    }
    // ok
    if ("extracheckreportfiles" in jsonObj) {
        arr = jsonObj.extracheckreportfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-emd-xml-check-report-files").html(htmlS);
            $("#download-emd-xml-check-report-files-label").html("Extra check reports:");
            $("#download-emd-xml-check-report-files").show();
            $("#download-emd-xml-check-report-files-label").show();
        }
    }
    // ok
    if ("emdxmlreportfiles" in jsonObj) {
        arr = jsonObj.emdxmlreportfiles;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-extra-check-report-files").html(htmlS);
            $("#download-extra-check-report-files-label").html("EMD XML reports:");
            $("#download-extra-check-report-files").show();
            $("#download-extra-check-report-files-label").show();
        }
    }
    // ok
    if ("correspondencefile" in jsonObj) {
        arr = jsonObj.correspondencefile;
        htmlS = "";
        for (var i = 0; i < arr.length; i++) {
            fn = arr[i];
            url = "/sessions/" + sessionId + "/" + fn;
            el = '<span> &nbsp; <a href="' + url + '">' + fn + '</a> </span>'
            logContext("log file " + i + " " + el);
            htmlS += el;
        }
        if (arr.length > 0) {
            $("#download-correspondence-to-depositor-file").html(htmlS);
            $("#download-correspondence-to-depositor-file-label").html("Correspondence to depositor:");
            $("#download-correspondence-to-depositor-file").show();
            $("#download-correspondence-to-depositor-file-label").show();
        }
    }
}

function updateAnnotTasksState(jsonObj) {
    for (var i =0; i < fullTaskIdList.length; i++) {
	logContext("updating task state for form " + 	fullTaskIdList[i]);
	taskFormCompletionOp(jsonObj, fullTaskIdList[i]);
    }
}

function getSessionInfo(uploadFileFormId) {
    var retObj;
    var serviceData = getServiceContext();
    if (uploadFileFormId != "") serviceData.uploadfileformid = uploadFileFormId;
    logContext("Calling getSessionInfo() for entry " + entryId);
    $.ajax({
        url: getSessionInfoServiceUrl,
        async: false,
        data: serviceData,
        type: 'post',
        success: function (jsonObj) {
            retObj = jsonObj;
        }
    });
    return retObj;
}

function getLocalMapInfo() {
    var retObj;
    var serviceData = getServiceContext();
    logContext("Calling getSessionInfo() for entry " + entryId);
    $.ajax({
        url: getLocalMapInfoServiceUrl,
        async: false,
        data: serviceData,
        type: 'post',
        success: function (jsonObj) {
            retObj = jsonObj;
        }
    });
    return retObj;
}

function callAssemblySaveDefaultService(serviceData) {
    $.ajax({ url: assemblySaveDefaultServiceUrl, data: serviceData, dataType: 'json',
          beforeSend: function() {
                 progressStart();
          },
          success: function (jsonOBJ) {
                  logContext("Completed assembly update " + jsonOBJ);
                  if (jsonOBJ.errorflag) {
                        $("#assembly-update-status").html(jsonOBJ.statustext);
                        $('#assembly-update-status').addClass('error-status');
                  } else {
                        $("#assembly-update-status").html(jsonOBJ.htmlcontent);
                        $('#assembly-update-status').removeClass('error-status');
                        if (jsonOBJ.assemgentable) {
                              $("#assembly-gen-container").html(jsonOBJ.assemgentable);
                        }
                  }
                  $("#assembly-update-status").show();
                  progressEnd();
          }
    });
}

function activateAssemblyInputButton() {
    $('#assembly-input-form-container').dialog({bgiframe: true,autoOpen: false,modal: false,height: 700,width: $(window).width()*0.95,
						close: function (event, ui) {
                            // refresh depositor details --
                            getDepositorAssemblyDetails();
                            progressEnd();
						    $('#assembly-input-form-container').empty();
						}
				});
    $('#assembly-input-form-button').click(function(){
	    var serviceData = getServiceContext();
	    // var refId=$(this).parent().prev().find('a').attr('id');
	    var placeholder="click-to-edit"
	    $.ajax({
            url: assemblyLoadFormServiceUrl,
            data: serviceData,
            dataType: 'json',
            beforeSend: function() {
                progressStart();
            },
            success: function (jsonObj) {
                        progressEnd();
		        $('#assembly-input-form-container').html(jsonObj.htmlcontent).dialog("open");
		        $('.ui-dialog-titlebar-close').removeClass("ui-dialog-titlebar-close").html('<span>X</span>');
		        $('.ief').ief({
		            onstart:function(){
			            if ($(this).hasClass('greyedout')){
			                $(this).attr('placeholder',$(this).html()).empty();
			            }
		            },
		            oncommit:function(){
			            if ($(this).hasClass('greyedout') && !$(this).is(":empty")){
			                $(this).removeClass('greyedout');
			            } else if ($(this).hasClass('greyedout')) {
			                $(this).html(placeholder).addClass('greyedout');
			            } else if ($(this).is(":empty")) {
			                $(this).html(placeholder).addClass('greyedout');
			            }
		            },
		            oncancel:function(){
			            if ($(this).is(":empty")){
			                $(this).html(placeholder).addClass('greyedout');
			            }
		            }
		        });
                        $('#add_row_button').click(function() {
                            var selectvalues = '[{"value":"author_defined_assembly","label":"author_defined_assembly","selected":true},'
                                             + '{"value":"software_defined_assembly","label":"software_defined_assembly","selected":false},'
                                             + '{"value":"author_and_software_defined_assembly","label":"author_and_software_defined_assembly","selected":false}]';
                            var formlength = parseInt($('#formlength').val());
                            var instanceidlist = $('#polyinstanceidlist').val().split(',');
                            var linearbranchinfo = $('#linearbranchmap').val();
                            var linearbranchmap = {};
                            if (linearbranchinfo != "") {
                                 tmp_list = linearbranchinfo.split(';');
                                 for (var i = 0; i < tmp_list.length; ++i) {
                                      var key_valist = tmp_list[i].split(':');
                                      linearbranchmap[key_valist[0]] = key_valist[1].split(',');
                                 }
                            }
                            
                            var additional_row_text = "";
                            var tagIdList = [];
                            for (var i = 0; i < 5; ++i) {
                                 formlength++;
                                 var assemId = formlength.toString();
                                 additional_row_text += '<tr><td><input type="hidden" name="a_id_' + assemId + '" value="' + assemId + '" />' + assemId + '</td>';
                                 additional_row_text += '<td><span id="a_prov_' + assemId + '" data-ief-edittype="select" data-ief-selectvalues=\''
                                                      + selectvalues + '\'>author_defined_assembly</span>';
                                 additional_row_text += '<td><span  id="a_ba_' + assemId + '">click-to-edit</span></td>';
                                 additional_row_text += '<td><span  id="a_sa_' + assemId + '">click-to-edit</span></td>';
                                 additional_row_text += '<td><span  id="a_fe_' + assemId + '">click-to-edit</span></td>';
                                 additional_row_text += '<td><span  id="a_oc_' + assemId + '">click-to-edit</span></td>';
                                 additional_row_text += '<td class="textleft">';
                                 tagIdList.push('a_prov_' + assemId);
                                 tagIdList.push('a_ba_' + assemId);
                                 tagIdList.push('a_sa_' + assemId);
                                 tagIdList.push('a_fe_' + assemId);
                                 tagIdList.push('a_oc_' + assemId);
                                 for (var j = 0; j < instanceidlist.length; ++j) {
                                      additional_row_text += ' ' + instanceidlist[j] + ' <input name="a_' + assemId + '_inst_' + instanceidlist[j] + '" type="checkbox" />';
                                      additional_row_text += ' OP <span id="a_' + assemId + '_symop_' + instanceidlist[j] + '">1_555</span> <br/>';
                                      tagIdList.push('a_' + assemId + '_symop_' + instanceidlist[j]);
                                      if (instanceidlist[j] in linearbranchmap) {
                                           var includeBranchList = [];
                                           for (var k = 0; k < linearbranchmap[instanceidlist[j]].length; ++k) {
                                                var instId = linearbranchmap[instanceidlist[j]][k];
                                                includeBranchList.push(' ' + instId + '  <input name="a_' + assemId + '_inst_' + instId +
                                                      '" type="checkbox" />  OP <span  id="a_' + assemId + '_symop_' + instId + '">1_555</span>');
                                                tagIdList.push('a_' + assemId + '_symop_' + instId);
                                           }
                                           for (var k = 0; k < includeBranchList.length; ++k) {
                                                if (k == 0) additional_row_text += '( ';
                                                additional_row_text += includeBranchList[k];
                                                if (k == (includeBranchList.length - 1)) additional_row_text += ' )';
                                                additional_row_text += ' <br/>';
                                           }
                                      }
                                 }
                                 additional_row_text += '</td></tr>'
                            }
                            $('#assembly_input_table').append(additional_row_text);

                            for (var i = 0; i < tagIdList.length; ++i) {
                                 $('#' + tagIdList[i]).addClass('ief');
                                 if (tagIdList[i].indexOf("_symop_") == -1) $('#' + tagIdList[i]).addClass('greyedout');
                                 $('#' + tagIdList[i]).ief({
                                     onstart:function(){
                                            if ($(this).hasClass('greyedout')){
                                                $(this).attr('placeholder',$(this).html()).empty();
                                            }
                                     },
                                     oncommit:function(){
                                            if ($(this).hasClass('greyedout') && !$(this).is(":empty")){
                                                $(this).removeClass('greyedout');
                                            } else if ($(this).hasClass('greyedout')) {
                                                $(this).html(placeholder).addClass('greyedout');
                                            } else if ($(this).is(":empty")) {
                                                $(this).html(placeholder).addClass('greyedout');
                                            }
                                     },
                                     oncancel:function(){
                                            if ($(this).is(":empty")){
                                                $(this).html(placeholder).addClass('greyedout');
                                            }
                                     }
                                 });
                            }
                            $('#assembly_input_table').show();
                            $('#formlength').val(formlength.toString());
                        });
		        $('.assembly_ajaxform').ajaxForm({
		            beforeSubmit: function (formData, jqForm, options) {
                                    progressStart();
			            formData.push({name:'sessionid',value:sessionId});
			            formData.push({name:'entryid',value:entryId});
			            formData.push({name:'entryfilename',value:entryFileName});
			            formData.push({name:'entryexpfilename',value:entryExpFileName});
			            formData.push({name:'entrynmrdatafilename',value:entryNmrDataFileName});
			            formData.push({name:'entrycsfilename',value:entryCsFileName});
		            },
		            success: function (jsonOBJ) {
			            logContext("Assembly form updated " + jsonOBJ);
			            if (jsonOBJ.errorflag) {
			                $("#assembly-form-status").html(jsonOBJ.statustext);
			            } else {
			                $('#assembly-update-button').show();
			                $("#assembly-form-status").html(jsonOBJ.htmlcontent);
			                $('#assembly-input-form-container').dialog("close");
			            }
			            $("#assembly-form-status").show();
                                    progressEnd();
		            }
		        });

	        }
	    });
    });
    $('#one-assembly-button').click(function(){
          var serviceData = getServiceContext();
          callAssemblySaveDefaultService(serviceData);
    });
    $('#all-monomer-assemblies-button').click(function(){
          var serviceData = getServiceContext();
          serviceData.allmonomerflag = "yes";
          callAssemblySaveDefaultService(serviceData);
    });
}

function activateAssemblyDepInfoButton() {
    logContext("Call activateAssemblyDepInfoButton");
    $('#assembly-dep-info-hide-button').click(function(){
	    depInfoDisplayFlag = 'false';
	    $('#assembly-dep-info-container').hide();
	    $('#assembly-dep-info-button').show();
	    $('#assembly-dep-info-hide-button').hide();
    });

    $('#assembly-dep-info-button').click(function(){
	    var serviceData = getServiceContext();
	    $.ajax({
	        url: assemblyLoadDepInfoServiceUrl,
	        data: serviceData,
	        dataType: 'json',
	        success: function (jsonObj) {
		        $('#assembly-dep-info-container').html(jsonObj.htmlcontent);
		        $('#assembly-dep-info-container').show();
		        depInfoDisplayFlag = 'true';
		        $('#assembly-dep-info-button').hide();
		        $('#assembly-dep-info-hide-button').show();
	        }
	    });
    });
}

function doAssemblyRestart() {
    if (entryFileName.length == 0) return false;

    logContext("doAssemblyRestart() starting ")
    $.when(
        getDepositorAssemblyDetails(),getComputedAssemblyDetails(),getEntityInfoDetails(),getSymopInfoDetails()//,getAsuJsmolLink()
    ).then(function(a,b) {
        logContext("ALL DONE WITH RESTART in then()");
        progressEnd();
    });

    logContext("doAssemblyRestart() leaving  ")
}

function doDepInfoRefresh() {
    logContext("doDepInfoRefresh() starting ")
    $.when(
        getDepositorAssemblyDetails()

    ).then(function(a,b) {
        logContext("ALL DONE WITH Refresh in then()");
        progressEnd();
    });

    logContext("doAssemblyRestart() leaving  ")
}

function getDepositorAssemblyDetails() {
    var serviceData = getServiceContext();
    return $.ajax({
	    url: assemblyLoadDepInfoServiceUrl,
	    data: serviceData,
	    dataType: 'json',
        async: true,
        beforeSend: function() {
            progressStart();
            logContext("Starting get depositor assembly details for entry " + entryId);
        },
	    success: function (jsonObj) {
	        $('#assembly-dep-info-container-alt').html(jsonObj.htmlcontent);
	        $('#assembly-dep-info-container-alt').show();
	        depInfoDisplayFlag = 'true';
	        //$('#assembly-dep-info-button').hide();
	        //$('#assembly-dep-info-hide-button').show();
            logContext("Completed get depositor assembly details for entry " + entryId);
	    }
    });
}

function getComputedAssemblyDetails() {
    var serviceData = getServiceContext();
    return $.ajax({
        url: assemblyRestartServiceUrl,
        data: serviceData,
        dataType: 'json',
        async: false,
        beforeSend: function() {
            progressStart();
            logContext("Starting  get computed assembly details  for entry " + entryId);
        },

        success: function (jsonObj) {
            logContext("Returned from assembly restart");
            updateCompletionStatus(jsonObj, '#assemblyForm');
            var assemCount = jsonObj.assemcount;
            logContext("Assembly count is " + assemCount);
            if (assemCount > 0) {
                $('#assembly-html-container').html(jsonObj.tablecontent);
                $('#assembly-html-container').show();
		// setAssemblyViewCallback();
                //getAssemblyTable(jsonObj.rowdata);
                $('#assembly-update-button').show();

            } else {
                if (jsonObj.errorflag) {
                    $("#assembly-container-alt").html(jsonObj.statustext);
                } else {
                    $("#assembly-container-alt").html(jsonObj.htmlcontent);
                }
                $("#assembly-container-alt").show();
            }
            updateCompletionStatus(jsonObj, '#assemblyForm');
            var selectText = jsonObj.selecttext;
            $('#assembly-update-status').html(selectText);
            $('#assembly-update-status').show();
            $('#assembly-calc-button').show();
            var assemArgs = jsonObj.assemblyargs;
            logContext("restarting with arguments " + assemArgs);
            if (assemArgs.length > 0) {
                $("#assemblyargs").val(assemArgs);
            }
            if (jsonObj.assemgentable) {
                $("#assembly-gen-container").html(jsonObj.assemgentable);
            }
            logContext("Completed get computed assembly details  for entry " + entryId);
        }
    });
}

function getEntityInfoDetails() {
    var serviceData = getServiceContext();
    return $.ajax({
	    url: '/service/ann_tasks_v2/entityloadinfo',
	    data: serviceData,
	    dataType: 'json',
        async: true,
        beforeSend: function() {
            progressStart();
            logContext("Starting get entity details for entry " + entryId);
        },
	    success: function (jsonObj) {
	        $('#entity-info-content').html(jsonObj.htmlcontent);
	        $('#entity-info-container').show();
            logContext("Completed get entity details for entry " + entryId);
	    }
    });
}

function getSymopInfoDetails() {
    var serviceData = getServiceContext();
    return $.ajax({
	    url: '/service/ann_tasks_v2/symoploadinfo',
	    data: serviceData,
	    dataType: 'json',
        async: true,
        beforeSend: function() {
            progressStart();
            logContext("Starting get symop details for entry " + entryId);
        },
	    success: function (jsonObj) {
	        $('#symop-info-content').html(jsonObj.htmlcontent);
	        $('#symop-info-container').show();
            logContext("Completed get symop details for entry " + entryId);
	    }
    });
}

function getAsuJsmolLink() {
    var urlText = 'javascript:loadFileJsmol("myApp1","#jsmol-dialog-1","/sessions/' + sessionId + '/' + entryFileName + '","cpk")';
    var htmlText = "<br /><a href='" + urlText + "'>View deposited coordinates as is in Jsmol</a>";
    $('#asu-jsmol-container').html(htmlText);
    $('#asu-jsmol-container').show();
}

function appendContextToMenuUrls() {
    // append the current session id to menu urls
    $("fieldset legend a, #top-menu-options li a, .navbar-header a" ).attr('href', function (index, href) {
        ret = href.split("?")[0];
        if (sessionId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'sessionid=' + sessionId;
        }
        if (entryId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryid=' + entryId;
        }
        if (entryFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryfilename=' + entryFileName;
        }

        if (entryExpFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryexpfilename=' + entryExpFileName;
        }

        if (entryNmrDataFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entrynmrdatafilename=' + entryNmrDataFileName;
        }

        if (entryCsFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entrycsfilename=' + entryCsFileName;
        }

        if (standaloneMode.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'standalonemode=' + standaloneMode;
        }

        if (AssemblyStatus.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'assemblystatus=' + AssemblyStatus;
        }

        //console.log("index = " + index + " href " + href + " ret = " + ret);

        return ret;
    });
    //JDW ###
    if (entryId.length > 0 && entryFileName.length > 0 ) {
	   getEntryInfo(null);

    }


}

function assignContext(jsonObj) {
    sessionId = jsonObj.sessionid;
    //  message  =jsonObj.htmlcontent;
    errorFlag = jsonObj.errorflag;
    errorText = jsonObj.statustext;
    if ('entryid' in jsonObj) {
        entryId = jsonObj.entryid;
    }
    if ('entryfilename' in jsonObj) {
        entryFileName = jsonObj.entryfilename;
    }
    if ('entryexpfilename' in jsonObj) {
        entryExpFileName = jsonObj.entryexpfilename;
    }
    if ("entrynmrdatafilename" in jsonObj) {
        entryNmrDataFileName = jsonObj.entrynmrdatafilename;
    }
    if ('entrycsfilename' in jsonObj) {
        entryCsFileName = jsonObj.entrycsfilename;
    }
    if ('standalonemode' in jsonObj) {
        standaloneMode = jsonObj.standalonemode;
    }

}

function logContext(message) {
  log("%lc: " + message + " ( session id " + sessionId + " entry id " + entryId + " entry filename " + entryFileName + " entry reflection filename " + entryExpFileName + " entry nmr-data filename " + entryNmrDataFileName + " entry cs filename " + entryCsFileName + ")");
}

function getCurrentContext() {
    var myUrl = $(location).attr('href');
    params = $.url(myUrl).param();
    pagePath = $.url(myUrl).attr('relative');
    if ("sessionid" in params) {
        sessionId = params.sessionid;
    }
    if ("entryid" in params) {
        entryId = params.entryid;
	    $('#span_identifier').html(entryId).removeClass('displaynone');
	    $('title').html("Ann: " + entryId);
    }
    if ("entryfilename" in params) {
        entryFileName = params.entryfilename;
    }
    if ("entryexpfilename" in params) {
        entryExpFileName = params.entryexpfilename;
    }

    if ("entrynmrdatafilename" in params) {
        entryNmrDataFileName = params.entrynmrdatafilename;
    }

    if ("entrycsfilename" in params) {
        entryCsFileName = params.entrycsfilename;
    }

    if ("wfstatus" in params) {
        wfStatus = params.wfstatus;
    }

    if ("assemblystatus" in params) {
        AssemblyStatus = params.assemblystatus;
    }

    if ("missingpcmstatus" in params) {
        MissingPcmStatus = params.missingpcmstatus;
    }

    if ("standalonemode" in params) {
        standaloneMode = params.standalonemode;
    }

    if (standaloneMode == 'y' || ($("#upload-dialog").length > 0)) {
	    standaloneMode='y';
    }

    if (standaloneMode == 'y') {
	    $(".workflow-only").hide();
	    $(".standalone-only").show();
    } else {
	    $(".standalone-only").hide();
	    $(".workflow-only").show();
    }
    logContext("Leaving getCurrentContext() with wfstatus = " + wfStatus + " standaloneMode " + standaloneMode);
}

function clearServiceContext() {
  sessionId='';
  entryId='';
  entryFileName='';
  entryExpFileName='';
  entryNmrDataFileName='';
  entryCsFileName='';
    //standaloneMode='n';
}


function getServiceContext() {
    var sc = {};
    sc.sessionid = sessionId;
    sc.entryid = entryId;
    sc.entryfilename = entryFileName;
    sc.entryexpfilename = entryExpFileName;
    sc.entrynmrdatafilename = entryNmrDataFileName;
    sc.entrycsfilename = entryCsFileName;
    //sc.standalonemode  = standaloneMode;
    return sc;
}

function getDisplayButtonLabel() {
    var retS = '';
    if (entryFileName.length > 0) {
        retS = "Current data file: " + entryFileName;
    } else {
        retS = "No current data file ";
    }
    return retS;
}

function getDisplayCsButtonLabel() {
    var retS = '';
    if (entryCsFileName.length > 0) {
        retS = "Current CS file: " + entryCsFileName;
    } else {
        retS = "No current CS file ";
    }
    return retS;
}

function setOptionButtonVisible(id) {
    if (entryFileName.length > 0) {
        $(id).show();
    } else {
        $(id).hide();
    }
}

//function setAssemblyViewCallback() {
    // make assembly view links ajax - jmol removed - but this might be useful in future
//    
//}

// Callback from the editor javascript code
function hideEditFrame() {
    $('#edit-frame').addClass('displaynone');
    $('#wrap').show();
    $('#footer').show();
}
function progressStart() {
    logContext("Called progressStart() -----------");
    $("#loading").fadeIn('slow').spin("large", "black");
    return false;
}

function progressEnd() {
    logContext("Called progressEnd() -----------");
    $("#loading").fadeOut('fast').spin(false);
    return false;
}

function updateCompletionStatusWf(statusHtml, formId) {
  $(formId + ' div.op-status').html(statusHtml);
  $(formId + ' div.op-status').removeClass('error-status');
  $(formId + ' div.op-status').show();
}

function updateCompletionStatus(jsonObj, statusId) {
    var retHtml = jsonObj.htmlcontent;
    var errFlag = jsonObj.errorflag;
    var errText = jsonObj.statustext;
    //  if (errText.length > 0 ) {
    if (errFlag) {
        $(statusId + ' div.op-status').html(errText);
        $(statusId + ' div.op-status').addClass('error-status');
    } else {
        $(statusId + ' div.op-status').html(retHtml);
        $(statusId + ' div.op-status').removeClass('error-status');
    }
    $(statusId + ' div.op-status').show();
}

function updateReportContent(jsonObj, contentId) {
    var retHtml = jsonObj.htmlcontent;
    var errFlag = jsonObj.errorflag;
    logContext('Updating report content  = ' + contentId);
    if (! errFlag) {
	//logContext('Updating report content  with = ' + retHtml);
	//logContext('Selection container ' + $(contentId).length  );
	//logContext('Selection report div ' + $(contentId + ' div.report-content').length  );
	$(contentId + ' div.report-content').html(retHtml);
	$(contentId + ' div.report-content').show();
    }
}

function updateLinkContent(jsonObj, contentId) {
    var retHtml = jsonObj.htmllinkcontent;
    logContext('Updating link content id = ' + contentId);
    if (retHtml.length > 0) {
      logContext('Updating link content  with = ' + retHtml);
      logContext('Selection container ' + $(contentId).length  );
      logContext('Selection link div '  + $(contentId + ' div.op-links').length  );
      $(contentId + ' div.op-links ').html(retHtml);
      $(contentId + ' div.op-links ').show();
    }
}

function updateFormStatus(jsonObj) {

    var formId= '';
    var statusText ='';
    if ('taskformid' in jsonObj) {
	formId = jsonObj.taskformid;
    }
    if ('statustext' in jsonObj) {
	statusText = jsonObj.statustext;
    }

    logContext("updateformstatus   >> " + formId + " statustext " + statusText);

    if (formId.length > 0 && statusText.length > 0) {
	var errFlag = false;
        if ('errorflag' in jsonObj) {
            errFlag = jsonObj.errorflag;
        }
	if (errFlag) {
            $(formId + ' fieldset div.my-task-form-status').html(statusText);
            $(formId + ' fieldset div.my-task-form-status').addClass('error-status');
	} else {
            $(formId + ' fieldset div.my-task-form-status').html(statusText);
            $(formId + ' fieldset div.my-task-form-status').removeClass('error-status');
	}
	$(formId + ' fieldset div.my-task-form-status').show();
    }
}

function updateFormLinkContent(jsonObj) {
    var formId = '';
    var linkList = [];
    if ('taskformid' in jsonObj) {
        formId = jsonObj.taskformid;
    }
    if ('links' in jsonObj) {
        linkList = jsonObj.links;
    }
    if (linkList.length > 0 && formId.length > 0) {
	linkHtml = '<span class="my-task-form-url-list">Download: ' + linkList.join(' ')  +  '</span>'
	$(formId + ' fieldset div.my-task-form-links ').html(linkHtml);
	$(formId + ' fieldset div.my-task-form-links ').show();
    }
}

function taskFormCompletionOp(jsonObj, formId) {
    logContext("Completion processing for  >> " + formId);
    if ( !(formId in jsonObj) ) {
	logContext("ERROR formId not in returned object");
	progressEnd();
	return
    }
    updateFormStatus(jsonObj[formId]);
    updateFormLinkContent(jsonObj[formId]);
    if ($(formId).length > 0) {
        if (((formId == "#tls-range-correction-form") || (formId == "#mtz-mmcif-conversion-form")) && (formId + "-uploadfilelist" in jsonObj)) {
             var html_text = '';
             for (var i = 0; i < jsonObj[formId + "-uploadfilelist"].length; i++) {
                  html_text += '<option value="' + jsonObj[formId + "-uploadfilelist"][i][1] + '" ';
                  if (i == 0) html_text += 'selected="selected" ';
                  html_text += '>' + jsonObj[formId + "-uploadfilelist"][i][0] + '</option>';
             }
             $(formId + " " + formId + "-inp-1").html(html_text);
             $(formId + " " + formId + "-inp-1").show();
             $(formId + " fieldset input.my-task-form-submit ").attr("disabled", false);
        }
        if ((formId == "#nmr-data-processing-form") && (entryNmrDataFileName.length > 0)) {
             $(formId + " fieldset input.my-task-form-submit ").attr("disabled", false);
        }
        if (((formId == "#nmr-cs-processing-form") || (formId == "#nmr-cs-edit-form")) && (entryCsFileName.length > 0)) {
             $(formId + " fieldset input.my-task-form-submit ").attr("disabled", false);
        }
        $(formId + ' fieldset input.my-task-form-submit ').show();
    }
    progressEnd();
}

function updateTaskFormContent(arr,formId) {
    arr.push({ "name": "sessionid",           "value": sessionId    });
    arr.push({ "name": "entryid",             "value": entryId    });
    arr.push({ "name": "entryfilename",       "value": entryFileName    });
    arr.push({ "name": "entryexpfilename",    "value": entryExpFileName    });
    arr.push({ "name": "entrynmrdatafilename", "value": entryNmrDataFileName });
    arr.push({ "name": "entrycsfilename",    "value": entryCsFileName    });
    arr.push({ "name": "taskformid",          "value": formId   });
}

function taskFormPrepOp(arr, formId) {
    logContext("Before task calculation >> " + formId);
    progressStart();
    $(formId + ' fieldset div.my-task-form-status').hide();
    $(formId + ' fieldset input.my-task-form-submit ').hide();
    updateTaskFormContent(arr,formId);
}

//
// jdw add methods for JSmol
//

function initJsmolApp(appName, id, buttonId) {
    var xSize=700;
    var ySize=700;
    Jmol._binaryTypes = [".map",".omap",".gz",".jpg",".png",".zip",".jmol",".bin",".smol",".spartan",".mrc",".pse"];
    Info = {
        j2sPath: "/assets/applets/jmol-latest/jsmol/j2s",
        serverURL: "/assets/applets/jmol-latest/jsmol/php/jsmol.php",
	    //serverURL: "http://chemapps.stolaf.edu/jmol/jsmol/php/jsmol.php",
        // Setting this did not solve the menu occlusion problem ..
        zIndexBase: 20000,
        width:  xSize,
        height: ySize,
        debug: false,
        color: "0xC0C0C0",
        disableJ2SLoadMonitor: true,
        disableInitialConsole: true,
        addSelectionOptions: false,
        use: "HTML5",
        readyFunction: null,
        script: ""
    };
    Jmol.setDocument(0);
    jsmolAppDict[appName]=Jmol.getApplet(appName,Info);


    $(id).html(Jmol.getAppletHtml(jsmolAppDict[appName])).dialog({
        bgiframe: true,
        autoOpen: true,
        modal: false,
        height: xSize,
        width: ySize,
        close: function (event, ui) {
	        $(id).attr("disabled", false);
	        if ( buttonId.length  > 0) {
		        $(buttonId).attr("disabled", false);
	        }
	        jsmolAppOpen[appName]=false;
        }
    });
    jsmolAppOpen[appName]=true;
    //jdw
    //$('.ui-dialog-titlebar-close').removeClass("ui-dialog-titlebar-close").html('<span>X</span>');
    $('.ui-dialog-titlebar-close').removeClass("ui-dialog-titlebar-close").html('<span>X</span>');
}


function loadFileJsmol(appName, id, filePath, jmolMode) {
    if (!jsmolAppOpen[appName] ) {
	   initJsmolApp(appName,id,'')
    }
    var setupCmds = '';
    if (jmolMode == 'wireframe') {
	   setupCmds = " background black; wireframe only; wireframe 0.05; labels off; slab 100; depth 40; slab on; ";
    } else if (jmolMode == 'cpk') {
	   setupCmds = " background white; wireframe off; spacefill on; color chain; labels off; slab 100; depth 40; slab on; ";
    } else if (jmolMode == 'secstruct1') {
	   // setupCmds = " select *; background white; wireframe off; ribbons off; cartoons off; labels off; rockets only; color rockets structure;  slab 100; depth 40; slab on; ";
        setupCmds = " select *; background white; wireframe off; ribbons off; cartoons on; labels off; spacefill off; color property chainNo; select ligands; spacefill on; slab 100; depth 10; slab on; ";
    } else if (jmolMode == 'secstruct2') {
	   setupCmds = " select *; background white; wireframe off; ribbons off; cartoons off; labels off; rockets only; color rockets structure;  slab 100; depth 40; slab on; ";
    } else {
        setupCmds = "";
    }
    //
    var postOpts = " frame *; display *; "
    var modelOpts = " models ({0:100}) ";
    //
    //var modelOpts = " ";
    var jmolCmds = "load " + modelOpts + filePath + "; " + setupCmds + postOpts;
    Jmol.script(jsmolAppDict[appName], jmolCmds);
}


function loadFileWithMapJsmol(appName, id, xyzFilePath, mapFilePath, jmolMode) {
    if (!jsmolAppOpen[appName] ) {
	initJsmolApp(appName,id,'')
    }
    var setupCmds = '';
    if (jmolMode == 'map-style-1') {
	mapCmds = "background black; wireframe only; wireframe 0.05; labels off; slab 60;  depth 20; slab on; isosurface surf_15 color [x3050F8] sigma 1.5 within 2.0 {*} '" + mapFilePath + "' mesh nofill;"
    } else if (jmolMode == 'map-style-2') {
	mapCmds = "background black; wireframe only; wireframe 0.1; labels off; slab 50; depth 20; slab on; refresh; isosurface downsample 2 cutoff 0.5 boundbox '" + mapFilePath + "'  mesh nofill; isosurface display within 2.0 {*};"
    } else    if (jmolMode == 'map-style-sig20') {
	mapCmds = "background black; wireframe only; wireframe 0.1; labels off; slab 90;  depth 20; slab on; isosurface surf_15 color [x3050F8] sigma 2.0 within 2.0 {*} '" + mapFilePath + "' mesh nofill;"
    } else    if (jmolMode == 'map-style-sig15') {
	mapCmds = "background black; wireframe only; wireframe 0.1; labels off; slab 90;  depth 20; slab on; isosurface surf_15 color [xFCD630] sigma 1.5 within 2.0 {*} '" + mapFilePath + "' mesh nofill;"
    } else    if (jmolMode == 'map-style-sig10') {
	mapCmds = "background black; wireframe only; wireframe 0.1; labels off; slab 90;  depth 20; slab on; isosurface surf_15 color [x6E71B7] sigma 1.0 within 2.0 {*} '" + mapFilePath + "' mesh nofill;"
    } else    if (jmolMode == 'map-style-sig08') {
	mapCmds = "background black; wireframe only; wireframe 0.1; labels off; slab 90;  depth 20; slab on; isosurface surf_15 color [x00AB24] sigma 0.8 within 2.0 {*} '" + mapFilePath + "' mesh nofill;"
    } else {
	mapCmds = "";
    }
    var jmolCmds = "load " + xyzFilePath + "; " + mapCmds;
    Jmol.script(jsmolAppDict[appName], jmolCmds);
}


function setupSideBar() {
    /*
     *   For control of side nav bar --
     */
    var $window = $(window);
    var $body = $(document.body);

    var navHeight = $('.navbar').outerHeight(true) + 10;
    $body.scrollspy({
	target: '.bs-sidebar',
	offset: navHeight
    });

    $window.on('load', function() {
	$body.scrollspy('refresh')
    });

    $('.bs-docs-container [href=#]').click(function(e) {
	e.preventDefault()
    });

    // back to top
    setTimeout(function() {
	var $sideBar = $('.bs-sidebar')

	$sideBar.affix({
            offset: {
		top: function() {
                    var offsetTop = $sideBar.offset().top
                    var sideBarMargin = parseInt($sideBar.children(0).css('margin-top'), 10)
                    var navOuterHeight = $('.bs-docs-nav').height()
                    return (this.top = offsetTop - navOuterHeight - sideBarMargin)
		},
		bottom: function() {
                    return (this.bottom = $('.bs-footer').outerHeight(true))
		}
            }
	})
    }, 100);
}
//
function handleCLoseWindow() {
    var inFormOrLink;
    $('a').on('click', function() { inFormOrLink = true; });
    $('form').on('submit', function() { inFormOrLink = true; });

    $(window).bind('beforeunload', function(eventObject) {
	var returnValue = undefined;
	if (! inFormOrLink) {
	    returnValue = "Do you really want to close?";
	}
	eventObject.returnValue = returnValue;
	return returnValue;
    });
}

// -------------------------------------------------------
// EM Methods --
//
function getMapList() {
    logContext("Calling getMapList()");
    var getMapListUrl = '/service/ann_tasks_v2/list_em_maps';
    var serviceData = getServiceContext();
    $.ajax({
        url: getMapListUrl,
        async: true,
        data: serviceData,
        dataType: 'json',
        type: 'post',
        success: function(jsonObj) {
            if ("map_list" in jsonObj && jsonObj.map_list.length > 0) {
                $('#em-map-file-list').html(jsonObj.map_list);
            }
            if ("mask_list" in jsonObj && jsonObj.mask_list.length > 0) {
                $('#em-mask-file-list').html(jsonObj.mask_list);
            }
            if ("half_map_list" in jsonObj && jsonObj.half_map_list.length > 0) {
                $('#em-half-map-file-list').html(jsonObj.half_map_list);
            }
            if ("additional_map_list" in jsonObj && jsonObj.additional_map_list.length > 0) {
                $('#em-additional-map-file-list').html(jsonObj.additional_map_list);
            }
            if ("em_download_files" in jsonObj && jsonObj.em_download_files.length > 0) {
                $('#em-download-file-list').html(jsonObj.em_download_files);
            }
            bindMapFileEvents();
        }
    });
    //
    logContext("After getMapList()");
}


function bindMapFileEvents() {
    $('a.my-map-selectable').bind('click', function(event) {
        event.preventDefault();
        $.getJSON(this.href, {}, function(jsonObj) {
            $('#em-map-header-container').html(jsonObj.map_header_html);
            $('#em-map-plot-container').html(jsonObj.map_density_plot);
            if ("map_edit_links" in jsonObj && jsonObj.map_edit_links.length > 0) {
                $('#em-map-edit-links').html(jsonObj.map_edit_links);
            }
            // activate the plugin  --
            $('.ief').ief({
                onstart: function() {
                    if ($(this).hasClass('greyedout')) {
                        $(this).data('placeholder', $(this).html()).empty();
                    }
                },
                oncommit: function() {
                    // New filtering blank form elements --
                    if ($.trim($(this).html()).length == 0) {
                        $(this).data('placeholder', $(this).html()).empty();
                        $(this).html(placeholderVal).addClass('greyedout');
                    } else if ($(this).hasClass('greyedout') && !$(this).is(":empty")) {
                        $(this).removeClass('greyedout');
                    } else if ($(this).hasClass('greyedout')) {
                        $(this).html($(this).data('placeholder')).addClass('greyedout');
                    }
                },
                oncancel: function() {
                    if ($(this).is(":empty")) {
                        $(this).html($(this).data('placeholder')).addClass('greyedout');
                    }
                }
            });

            $('#map-edit-form').ajaxForm({
                url: '/service/ann_tasks_v2/edit_em_map_header_responder',
                dataType: 'json',
                type: 'post',
                beforeSubmit: function(formData, jqForm, options) {
                    formData.push({
                        name: 'map_buggies',
                        value: 'bigbugs'
                    });
                    $("#map-edit-form input.map-edit-form-submit").hide();
                },
                success: function(jsonObj) {
                    if ("map_edit_status" in jsonObj && jsonObj.map_edit_status.length > 0) {
                        $('#em-map-edit-status').html(jsonObj.map_edit_status);
                    }

                    if ("map_edit_links" in jsonObj && jsonObj.map_edit_links.length > 0) {
                        $('#em-map-edit-links').html(jsonObj.map_edit_links);
                    }
                    if ("map_list" in jsonObj && jsonObj.map_list.length > 0) {
                        $('#em-map-file-list').html(jsonObj.map_list);
                    }

                    bindMapFileEvents();
                    $("#map-edit-form input.map-edit-form-submit").show();
                }


            });
        });
    });
}

function select_entry(formid, tagid) {
       var request = $('#' + tagid).attr('value');
       $('#' + formid).find("input[name^='a_1_inst_']:checkbox").each(function() {
            if (request == 'Select All')
                 $(this).prop('checked', true);
            else $(this).prop('checked', false);
       });
       if (request == 'Select All') {
            $('#' + tagid).attr('value', 'Unselect All');
       } else {
            $('#' + tagid).attr('value', 'Select All');
       }
}

function set_all_monomers(formid, tagid, instIdsText) {
       var instIdList = instIdsText.split(',');
       var request = $('#' + tagid).attr('value');
       for (var i = 0; i < instIdList.length; ++i) {
            if (request == 'All Monomers')
                 $('#' + formid + ' #' + instIdList[i]).prop('checked', true);
            else $('#' + formid + ' #' + instIdList[i]).prop('checked', false);
       }
       if (request == 'All Monomers') {
            $('#' + tagid).attr('value', 'Unset All Monomers');
       } else {
            $('#' + tagid).attr('value', 'All Monomers');
       }
}

function select_close_contact_covalent_bond(formid, nameprefix, tagid, type) {
       var selected_val = 'Select All';
       if (type != '') selected_val = 'Select All ' + type;
       var unselected_val = 'Unselect All';
       if (type != '') unselected_val = 'Unselect All ' + type;

       var request = $('#' + tagid).attr('value');
       $('#' + formid).find("input[name^='" + nameprefix + "']:checkbox").each(function() {
            if (type != '') { 
                 if ($(this).hasClass(type)) {
                      if (request == selected_val)
                           $(this).prop('checked', true);
                      else $(this).prop('checked', false);
                 }
            } else {
                 if (request == selected_val)
                      $(this).prop('checked', true);
                 else $(this).prop('checked', false);
            }
       });
       if (request == selected_val) {
            $('#' + tagid).attr('value', unselected_val);
            if ((tagid == 'close_contact_select_all') && ($('#close_contact_select_all_green').length > 0)) {
                 $('#close_contact_select_all_green').attr('value', 'Unselect All green');
            }
       } else {
            $('#' + tagid).attr('value', selected_val);
            if ((tagid == 'close_contact_select_all') && ($('#close_contact_select_all_green').length > 0)) {
                 $('#close_contact_select_all_green').attr('value', 'Select All green');
            }
       }
}

function validate_close_contact_covalent_bond_form($form, type) {
       var selected_count = 0;
       $form.find('input[name^="' + type + '"]:checkbox').each(function() {
            if ($(this).is(':checked')) selected_count += 1;
       });
       if (selected_count == 0) {
            alert("No record selected");
            return false;
       }

       return true;
}

function exit_close_contact_covalent_bond_page() {
       $('#update-close-contact-form-data').html('');
       $('#update-covalent-bond-form-data').html('');
       $('#review-close-contact-page').hide();
       $('#review-covalent-bond-page').hide();
       $('#mapcalc-task-form, #npcc-mapcalc-task-form, #trans-coord-task-form, #special-position-task-form, #biso-full-task-form').show();
       $('#terminal-atoms-task-form, #geom-valid-task-form, #reflection-file-update-task-form, #mtz-mmcif-semi-auto-conversion-form').show();
       $('#mtz-mmcif-conversion-form, #sf-mmcif-free-r-correction-form, #special-position-update-task-form, #tls-range-correction-form').show();
       $('#database-related-correction-form, #review-close-contact-form, #review-covalent-bond-form').show();
}

function processSemeAutoConvertForm(htmlText) {
       var currentTaskIdList = [];
       for (var i = 0; i < fullTaskIdList.length; i++) {
            if ($(fullTaskIdList[i]).length > 0 && fullTaskIdList[i] != "#mtz-mmcif-semi-auto-conversion-form") {
                 currentTaskIdList.push(fullTaskIdList[i]);
            }
       }
       if (htmlText != '') {
            $('#mtz-mmcif-semi-auto-conversion-form #mtz-mmcif-semi-auto-conversion-form-data').html(htmlText);
            $('#mtz-mmcif-semi-auto-conversion-form').show();
	    $('#mtz-mmcif-semi-auto-conversion-form fieldset div.my-task-form-status').hide();
	    $('#mtz-mmcif-semi-auto-conversion-form fieldset div.my-task-form-links ').hide();
            for (var i = 0; i < currentTaskIdList.length; i++) {
                 $(currentTaskIdList[i]).hide();
            }
       } else {
            $('#mtz-mmcif-semi-auto-conversion-form #mtz-mmcif-semi-auto-conversion-form-data').html('');
            $('#mtz-mmcif-semi-auto-conversion-form').hide();
            for (var i = 0; i < currentTaskIdList.length; i++) {
                 $(currentTaskIdList[i]).show();
            }
       }
}

function getAssemblyInfo() {
       var html_text = "";

       if (AssemblyStatus == "existed") {
            html_text = "Assembly information already present in model file!";
       } else if (AssemblyStatus == "updated") {
            html_text = "Successfully filled in unit assembly information!";
       } else if (AssemblyStatus == "failed") {
            html_text = "Failed to automatically fill in assembly information!";
       }

       return html_text;
}

$('#ignore-mtz-mmcif-semi-auto-conversion').click(function() {
       processSemeAutoConvertForm('');
});
//
//
// Document ready entry point
//
$(document).ready(function () {
    $("#uploadProgress").find("*").hide();
    $("#assembly-table-container").hide();
    getCurrentContext();
    //
    // Warn about out of workflow condition ---
    //
    if ($("#wf-startup-dialog").length > 0) {
        var html_text = "<ul>";
	if (wfStatus == "completed") {
            html_text += "<li>Workflow status update successful!</li>";
	} else if (wfStatus == "failed") {
            html_text += "<li>Workflow status update failed!   Proceed with caution!</li>";
	}

        var AssemblyInfo = getAssemblyInfo();
        if (AssemblyInfo != "") {
             html_text += "<li><strong>" + AssemblyInfo + "</strong></li>";
        }

        if (MissingPcmStatus == "yes") {
             html_text += '<li><span style="font-weight:bold;color:red;">CCD(s) missing PCM/PTM annotation</span></li>';
        }

        html_text += "</ul>";

        $("#op-status").html(html_text);
    }

    //  Add session context to navbar menu items
    appendContextToMenuUrls();

    if (sessionId.length == 0) {
        newSession('request session');
        logContext('Assigning new session id  = ' + sessionId);
    }

    if ($("#em-map-dialog").length > 0) {
	    getMapList();
    }

    if ($("#wf-finish-dialog").length > 0) {
	logContext("Exptl bef:" + experimentalMethods)
	// async call
	getEntryInfo(prepareToFinish1);
    }

    if ($("#upload-dialog").length > 0) {
	    $('#span_identifier').html("").addClass('displaynone');
	    $('title').html("");
	    $('#my_title').remove();
	    standaloneMode='y';
        newSession('reset session before upload');
	    uploadFromId(uploadFromIdServiceUrl,"#id-form");
        uploadFile(uploadServiceUrl, "#upload-model", "#uploadProgress");
        uploadFile(uploadServiceUrl, "#upload-exp",   "#uploadProgress");

    }


    //<!-- Viewer  operations for model and map display-->
    if ($("#jmol-dialog").length > 0) {
        var tObj = getSessionInfo("");

	// Look for map availibility ....
	if ("mapdisplayflag" in tObj) {
	    mapFlag=true;
	}
	if ("omitmapdisplayflag" in tObj) {
	    omitMapFlag=true;
	}

	lObj=getLocalMapInfo();
	if ("htmlcontent" in lObj) {
	    $("#local-map-index-1").html(lObj.htmlcontent);
	}
	//  JSMol options
	setOptionButtonVisible("#jsmol-opener-button-1");
        $('#jsmol-opener-button-1').click(function () {
	    logContext("Launching Jsmol One");
            var filePath = "/sessions/" + sessionId + "/" + entryFileName;
	    jsmolAppOpen["myApp1"]=false;
	    initJsmolApp("myApp1",'#jsmol-dialog-1','#jsmol-opener-button-1');
	    loadFileJsmol("myApp1", "#jsmol-dialog-1", filePath,'wireframe');
	    $('#jsmol-opener-button-1').attr("disabled", true);
	});

	if (mapFlag) {
            $('#jsmol-with-map-opener-button-1').click(function () {
		logContext("Launching Jsmol One");
		var filePath = "/sessions/" + sessionId + "/" + entryFileName;
		var mapPath = "/sessions/" + sessionId + "/" + entryId + "_map-2fofc_P1.map";
		jsmolAppOpen["myApp1"]=false;
		initJsmolApp("myApp1",'#jsmol-dialog-1','#jsmol-with-map-opener-button-1');
		loadFileWithMapJsmol("myApp1", "#jsmol-dialog-1", filePath,mapPath,'map-style-1');
		$('#jsmol-with-map-opener-button-1').attr("disabled", true);
	    });
            $('#jsmol-with-map-opener-button-1').show();
	} else {
	    logContext("Hiding jsmol with map button");
            $('#jsmol-with-map-opener-button-1').hide();
	}


	if (omitMapFlag) {
            $('#jsmol-with-omit-map-opener-button-1').click(function () {
		logContext("Launching Jsmol One");
		var filePath = "/sessions/" + sessionId + "/" + entryFileName;
		var mapPath = "/sessions/" + sessionId + "/" + entryId + "_omit-map-2fofc_P1.map";
		jsmolAppOpen["myApp1"]=false;
		initJsmolApp("myApp1",'#jsmol-dialog-1','#jsmol-with-omit-map-opener-button-1');
		loadFileWithMapJsmol("myApp1", "#jsmol-dialog-1", filePath,mapPath,'map-style-1');
		$('#jsmol-with-omit-map-opener-button-1').attr("disabled", true);
	    });
            $('#jsmol-with-omit-map-opener-button-1').show();
	} else {
	    logContext("Hiding jsmol with omit map button");
            $('#jsmol-with-omit-map-opener-button-1').hide();
	}


	// Jmol options
        $("#display-button-label").html(getDisplayButtonLabel());

    }
    //<!-- Assembly operations -->
    if ($("#assembly-dialog").length > 0) {

        $('#assembly-update-button').hide();
        $('#assembly-status').hide();
        $('#assembly-update-status').hide();
        $('#entity-info-container').hide();
        $('#symop-info-container').hide();
        $('#asu-jsmol-container').hide();
	    //$('#assembly-dep-info-hide-button').hide();
	    //$('#assembly-dep-info-button').show();
        $("#assembly-container-alt").hide();
        //$("#assembly-dep-info-container").hide();
        var AssemblyInfo = getAssemblyInfo();
        if (AssemblyInfo != "") {
             $('#assembly-status').html(AssemblyInfo);
             $('#assembly-status').show();
        }
        $("#assembly-button-label").html(getDisplayButtonLabel());
        setOptionButtonVisible("#assembly-calc-button");
        $('#download-model-url').hide();
        $("#download-model-url-label").html(getDownloadModelFileLabel());
        setDownloadModelFileUrl("#download-model-url");
        <!-- assembly form -->
        $('#assemblyForm div.op-status').hide();

        // This form runs the assembly calculation task ---
        $('#assemblyForm').ajaxForm({
            url: assemblyCalcServiceUrl,
	        cache:  true,
            dataType: 'json',
            success: function (jsonObj) {
                logContext("Returned from assembly calculation");
                progressEnd();
                //
                updateCompletionStatus(jsonObj, '#assemblyForm');
                var assemCount = jsonObj.assemcount;
                logContext("Assembly count is " + assemCount);
                if (assemCount > 0) {
                    $('#assembly-html-container').html(jsonObj.tablecontent);
                    $('#assembly-html-container').show();
		     // setAssemblyViewCallback();
                    //getAssemblyTable(jsonObj.rowdata);
                    $('#assembly-update-button').show();
                } else {
                    if (jsonObj.errorflag) {
                        $("#assembly-container-alt").html(jsonObj.statustext);
                    } else {
                        $("#assembly-container-alt").html(jsonObj.htmlcontent);
                    }
                    $("#assembly-container-alt").show();
                }
                updateCompletionStatus(jsonObj, '#assemblyForm');
                $('#assembly-update-status').hide();
                $('#assembly-calc-button').show();
            },
            beforeSubmit: function (arr, $form, options) {
                progressStart();
                $('#assembly-calc-button').hide();
                $("#assembly-container-alt").hide();
                $('#assemblyForm div.op-status').hide();
                //console.log(toString(arr));
                arr.push({
                    "name": "sessionid",
                    "value": sessionId
                });
                arr.push({
                    "name": "entryid",
                    "value": entryId
                });
                arr.push({
                    "name": "entryfilename",
                    "value": entryFileName
                });
                arr.push({
                    "name": "entrynmrdatafilename",
                    "value": entryNmrDataFileName
                });
                arr.push({
                    "name": "entrycsfilename",
                    "value": entryCsFileName
                });
            }
        });

        //update the model file with the current assembly selection  --
        $('#assembly-update-button').click(function () {
            var serviceData = getServiceContext();
            var checkList = '';
	        var provenanceList = '';
            $.each($('input.assem_select:checked'), function (i) {
                checkList += $(this).val() + ","
            });
            logContext("Assembly selection : " + checkList);

            $.each($('select.assem_prov option:selected'), function (i) {
                provenanceList += $(this).parent().attr('name') +":"+$(this).val() + ","
            });
            logContext("Assembly provenance : " + provenanceList);
            serviceData.selected = checkList;
            serviceData.provenance = provenanceList;

            //
            //$('#assembly-calc-button').hide();
            $('#assembly-update-button').hide();
            progressStart();
            $.ajax({
                url: assemblySelectServiceUrl,
                data: serviceData,
                dataType: 'json',
                success: function (jsonObj) {
                    logContext("Completed assembly selection update");
                    progressEnd();
                    $('#assembly-update-button').show();
                    if (jsonObj.errorflag) {
                        $('#assembly-update-status').html(jsonObj.statustext);
                        $('#assembly-update-status').addClass('error-status');
                    } else {
                        $('#assembly-update-status').html(jsonObj.htmlcontent);
                        $('#assembly-update-status').removeClass('error-status');
                    }
                    $('#assembly-update-status').show();
                    logContext("testing gen table");
                    if (jsonObj.assemgentable) {
                        $("#assembly-gen-container").html(jsonObj.assemgentable);
                        // setAssemblyViewCallback();
                    }
                }
            });

        });

        $('.jshead').on("click", function() {
             var style = $(this).next().attr("style");
             $(this).next().toggle('slow');
             return false;
        });
	    activateAssemblyInputButton();
	    //activateAssemblyDepInfoButton();
        //restartAssemblySession();
        doAssemblyRestart();
    }
    //    <!-- end assembly operations -->

    //<!-- Download task operations -->
    if ($("#download-dialog").length > 0) {
        $("#download-logfiles").hide();
        $("#download-logfiles-label").hide();
	//$("#download-logfiles-label").css("display","none")

        var sObj = getSessionInfo("");
        updateDownloadOptions(sObj);
        //
        $('#download-model-url').hide();
        $("#download-model-url-label").html(getDownloadModelFileLabel());
        setDownloadModelFileUrl("#download-model-url");
	//
        $('#download-exp-url').hide();
        $("#download-exp-url-label").html(getDownloadExpFileLabel());
        setDownloadExpFileUrl("#download-exp-url");
    }
    //    <!-- Annotation task operations -->
    if ($("#task-dialog").length > 0) {
        if (entryFileName.length > 0) {
            //
            var uploadFileFormId = "";
            for (var i = 0; i < uploadFileTaskIdList.length; i++) {
                 if ($(uploadFileTaskIdList[i]).length > 0) {
                      if (uploadFileFormId != "") uploadFileFormId += ",";
                      uploadFileFormId += uploadFileTaskIdList[i];
                 }
            }
            var sObj = getSessionInfo(uploadFileFormId);
            updateAnnotTasksState(sObj);
            //
            if ($("#nmr-tasks-dialog").length > 0) {
                 if (entryNmrDataFileName.length > 0) {
                      $("#task-alt-dialog").html("Annotating file: " + entryFileName + ", " + entryNmrDataFileName);
                 } else if (entryCsFileName.length > 0) {
                      $("#task-alt-dialog").html("Annotating file: " + entryFileName + ", " + entryCsFileName);
                 } else {
                      $("#task-alt-dialog").html("Annotating file: " + entryFileName);
                 }
            } else if (($("#mapcalc-task-form").length > 0) && (entryExpFileName.length > 0)) {
                 $("#task-alt-dialog").html("Annotating file: " + entryFileName + ", " + entryExpFileName);
            } else {
                 $("#task-alt-dialog").html("Annotating file: " + entryFileName);
            }
            $("#task-alt-dialog").show();
            $("#task-dialog").show();

            if ($("#nmr-tasks-dialog").length > 0) {
                 var serviceData = getServiceContext();
                 $.ajax({
                     url: '/service/ann_tasks_v2/get_nmr_processing_message',
                     data: serviceData,
                     dataType: 'json',
                     beforeSend: function() {
                         progressStart();
                     },
                     success: function (jsonObj) {
                         progressEnd();
                         $('#diagnostics_box').html(jsonObj.htmlcontent);
                         $('#diagnostics_box').show();
                     },
                     error: function (data, status, e) {
                         progressEnd();
                         alert(e);
                         return false;
                     }
                 });
            }

                for ( var myTask in fullTaskDict) {
                            <!-- lite up the task form -->
                            $(myTask).ajaxForm({
                                    url: fullTaskDict[myTask],
                                    dataType: 'json',
                                    success: function (jsonObj,statusText, xhr, $form) {
                                        if ($form.attr('id') == 'nmr-cs-edit-form') {
                                            $('#cs-content').html(jsonObj.htmlcontent);

                                            $('.jshead').on("click", function(event) {
                                                $(this).next().toggle('slow');
                                                event.preventDefault();
                                                return false;
                                            });

                                            $('.tblhead').on("click", function(event) {
                                                var id = $(this).attr('id');
                                                var tblid = '#table_' + id;
                                                $(tblid).toggle('fast');
                                                event.preventDefault();
                                            });

                                            $('#cs-table-container table').addClass('table table-condensed table-bordered table-striped');
                                            $('#cs-table-container').removeClass('displaynone');
                                            $('#cs-table-container').show();
                                            $('#nmr-tasks-dialog').hide();

                                            $('#cs-content').show();

                                            $('.editable_text').editable(csEditorSavingServiceUrl, {
                                                type      : 'text',
                                                cancel    : 'Cancel',
                                                submit    : 'OK',
                                                width     : '60px',
                                                submitdata : { sessionid: sessionId, entryid: entryId },
                                                onsubmit: function(settings, tag) {
                                                     var value = $(tag).find('input').val();
                                                     var id = $(tag).attr('id');
                                                     var tlist = id.split('_');
                                                     var rstatus = true;
                                                     if (tlist[0] == 'resChainId')
                                                         rstatus = isPDBChainID(value);
                                                     else if (tlist[0] == 'resNum')
                                                         rstatus = isPDBNumber(value);
                                                     else if (tlist[0] == 'resName')
                                                         rstatus = isPDBName(value);
                                                     if (rstatus == false) {
                                                         tag.reset();
                                                         return false;
                                                     } else return true;
                                                }
                                            });

                                            $('.editable_select').editable(csEditorSavingServiceUrl, {
                                                data      : select_data,
                                                type      : 'select',
                                                submit    : 'OK',
                                                submitdata : { sessionid: sessionId, entryid: entryId }
                                            });

                                            $('.editable_select_YN').editable(csEditorSavingServiceUrl, {
                                                data      : " { 'Y':'Y', 'N':'N' } ",
                                                type      : 'select',
                                                submit    : 'OK',
                                                submitdata : { sessionid: sessionId, entryid: entryId }
                                            });
                                        } else if ($form.attr('id') == 'nmr-cs-processing-form') {
                                            if ('htmlcontent' in jsonObj) {
                                                 $('#diagnostics_box').html(jsonObj.htmlcontent);
                                                 $('#diagnostics_box').show();
                                            }
                                        } else if ($form.attr('id') == 'reflection-file-update-task-form') {
                                            if ('wvinfo' in jsonObj) {
                                                 var maximum_number = jsonObj['wvinfo']['maximum_number'];
                                                 var colspan = maximum_number + 2;
                                                 var input_text_count = 0;
                                                 var html_text = '<table>';
                                                 for (var i = 0; i < jsonObj['wvinfo']['datablock'].length; i++) {
                                                      var blockName = jsonObj['wvinfo']['datablock'][i];
                                                      if (!(blockName in jsonObj['wvinfo'])) continue;
                                                      var prefix = '';
                                                      var suffix = '';
                                                      if (('diff' in jsonObj['wvinfo'][blockName]) && jsonObj['wvinfo'][blockName]['diff']) {
                                                           prefix = '<span style="color:red">'
                                                           suffix = '</span>'
                                                      }
                                                      html_text += '<tr><td style="border-style:none" colspan="' + colspan + '">&nbsp;</td></tr>';
                                                      html_text += '<tr><td style="border-style:none" colspan="' + colspan
                                                                 + '">Data block name in reflection data file: ' + prefix + blockName + suffix + '.';
                                                      if ('model' in jsonObj['wvinfo'][blockName]) {
                                                           var model_wvlength = '';
                                                           for (var j = 0; j < jsonObj['wvinfo'][blockName]['model'].length; j++) {
                                                                if (model_wvlength != '') model_wvlength += ', ';
                                                                model_wvlength += jsonObj['wvinfo'][blockName]['model'][j];
                                                           }
                                                           html_text += ' &nbsp; &nbsp; Wavelength from model coordinate file: ' + model_wvlength + '.';
                                                      }
                                                      html_text += '</td></tr>';

                                                      var sf_wvlength = [];
                                                      if ('sf' in jsonObj['wvinfo'][blockName]) sf_wvlength = jsonObj['wvinfo'][blockName]['sf'];
                                                      html_text += '<tr><td style="border-style:none;padding:5px;" colspan="2">Wavelength for this block: </td>';
                                                      for (var j = 0; j < maximum_number; j++) {
                                                           html_text += '<td style="border-style:none;padding:5px;"><input type="text" size="10" value="';
                                                           if (j < sf_wvlength.length) html_text += sf_wvlength[j];
                                                           html_text += '" name="wavelength_' + input_text_count + '" /></td>';
                                                           html_text += '<input type="hidden" value="' + blockName + '" name="blockname_'
                                                                      + input_text_count + '" />';
                                                           input_text_count++;
                                                      }
                                                      html_text += '</tr>';
                                                 }
                                                 html_text += '</table>';
                                                 html_text += '<input type="hidden" value="' + input_text_count + '" name="total_input_text_count" />';

                                                 $('#' + $form.attr('id') + ' #sf_submit_id').val('Update');
                                                 $('#' + $form.attr('id') + ' #wavelength_data_form').html(html_text);
                                                 $('#' + $form.attr('id') + ' #wavelength_data_form').show();
                                            } else {
                                                 $('#' + $form.attr('id') + ' #sf_submit_id').val('Run');
                                                 $('#' + $form.attr('id') + ' #wavelength_data_form').html('');
                                                 $('#' + $form.attr('id') + ' #wavelength_data_form').hide();
                                            }
                                        } else if ($form.attr('id') == 'mtz-mmcif-conversion-form') {
                                            if ('mtzinfo' in jsonObj) {
                                                 processSemeAutoConvertForm(jsonObj['mtzinfo']);
                                            }
                                        }
                                        if ($form.attr('id') == 'mtz-mmcif-semi-auto-conversion-form') {
                                            if (jsonObj.errorflag) {
                                                 taskFormCompletionOp(jsonObj, "#" + $form.attr('id'));
                                            } else {
                                                 processSemeAutoConvertForm('');
                                                 taskFormCompletionOp(jsonObj, "#mtz-mmcif-conversion-form");
                                            }
                                        } else {
                                            taskFormCompletionOp(jsonObj, "#" + $form.attr('id'));
                                        }
                                    },
                                    beforeSubmit: function (arr, $form, options) {
                                        taskFormPrepOp(arr,"#" + $form.attr('id'));
                                    }
                            });
                }

            $('#review-close-contact-button').click(function () {
                 var serviceData = getServiceContext();
                 $.ajax({
                     url: '/service/ann_tasks_v2/get_close_contact_content',
                     data: serviceData,
                     dataType: 'json',
                     beforeSend: function() {
                         progressStart();
                     },
                     success: function (jsonObj) {
                         progressEnd();
                         if (("htmlcontent" in jsonObj) && (jsonObj.htmlcontent.length > 0)) {
                             $('#mapcalc-task-form, #npcc-mapcalc-task-form, #trans-coord-task-form, #special-position-task-form, #biso-full-task-form').hide();
                             $('#terminal-atoms-task-form, #geom-valid-task-form, #reflection-file-update-task-form, #mtz-mmcif-semi-auto-conversion-form').hide();
                             $('#mtz-mmcif-conversion-form, #sf-mmcif-free-r-correction-form, #special-position-update-task-form, #tls-range-correction-form').hide();
                             $('#database-related-correction-form, #review-close-contact-form, #review-covalent-bond-form').hide();
                             $('#update-close-contact-form-data').html(jsonObj.htmlcontent);
                             $('#review-close-contact-page').show();
                         } else {
                              $('#review-close-contact-form fieldset div.my-task-form-status').html("No close contact found.");
                              $('#review-close-contact-form fieldset div.my-task-form-status').show();
                         }
                     },
                     error: function (data, status, e) {
                         progressEnd();
                         alert(e);
                         return false;
                     }
                 });
            });

            $('#update-close-contact-form').ajaxForm({
                url: '/service/ann_tasks_v2/update_close_contact_content',
                dataType: 'json',
                beforeSubmit: function (arr, $form, options) {
                    if (!validate_close_contact_covalent_bond_form($form, 'close_contact_')) return false;
                    progressStart();
                    arr.push({
                        "name": "sessionid",
                        "value": sessionId
                    });
                    arr.push({
                        "name": "entryid",
                        "value": entryId
                    });
                    arr.push({
                        "name": "entryfilename",
                        "value": entryFileName
                    });
                },
                success: function (jsonObj) {
                    progressEnd();
                    if (jsonObj.errorflag) {
                         alert(jsonObj.errortext);
                    } else {
                         taskFormCompletionOp(jsonObj, "#review-close-contact-form");
                         exit_close_contact_covalent_bond_page();
                    }
                    return false;
                },
                error: function (data, status, e) {
                    progressEnd();
                    alert(e);
                    return false;
                }
            });

            $('#review-covalent-bond-button').click(function () {
                 var serviceData = getServiceContext();
                 $.ajax({
                     url: '/service/ann_tasks_v2/get_covalent_bond_content',
                     data: serviceData,
                     dataType: 'json',
                     beforeSend: function() {
                         progressStart();
                     },
                     success: function (jsonObj) {
                         progressEnd();
                         if (("htmlcontent" in jsonObj) && (jsonObj.htmlcontent.length > 0)) {
                             $('#mapcalc-task-form, #npcc-mapcalc-task-form, #trans-coord-task-form, #special-position-task-form, #biso-full-task-form').hide();
                             $('#terminal-atoms-task-form, #geom-valid-task-form, #reflection-file-update-task-form, #mtz-mmcif-semi-auto-conversion-form').hide();
                             $('#mtz-mmcif-conversion-form, #sf-mmcif-free-r-correction-form, #special-position-update-task-form, #tls-range-correction-form').hide();
                             $('#database-related-correction-form, #review-close-contact-form, #review-covalent-bond-form').hide();
                             $('#update-covalent-bond-form-data').html(jsonObj.htmlcontent);
                             $('#review-covalent-bond-page').show();
                         } else {
                              $('#review-covalent-bond-form fieldset div.my-task-form-status').html("No covalent bond found.");
                              $('#review-covalent-bond-form fieldset div.my-task-form-status').show();
                         }
                     },
                     error: function (data, status, e) {
                         progressEnd();
                         alert(e);
                         return false;
                     }
                 });
            });

            $('#update-covalent-bond-form').ajaxForm({
                url: '/service/ann_tasks_v2/update_covalent_bond_content',
                dataType: 'json',
                beforeSubmit: function (arr, $form, options) {
                    if (!validate_close_contact_covalent_bond_form($form, 'covalent_bond_')) return false;
                    progressStart();
                    arr.push({
                        "name": "sessionid",
                        "value": sessionId
                    });
                    arr.push({
                        "name": "entryid",
                        "value": entryId
                    });
                    arr.push({
                        "name": "entryfilename",
                        "value": entryFileName
                    });
                },
                success: function (jsonObj) {
                    progressEnd();
                    if (jsonObj.errorflag) {
                         alert(jsonObj.errortext);
                    } else {
                         taskFormCompletionOp(jsonObj, "#review-covalent-bond-form");
                         exit_close_contact_covalent_bond_page();
                    }
                    return false;
                },
                error: function (data, status, e) {
                    progressEnd();
                    alert(e);
                    return false;
                }
            });
        } else {
            $("#task-dialog").hide();
            $("#task-alt-dialog").html("No file uploaded");
            $("#task-alt-dialog").show();
        }
    }

    if ($("#point-suite-dialog").length > 0) {

        $('#upload-biomt').ajaxForm({
            url: uploadBiomtServiceUrl,
            dataType: 'json',
            beforeSubmit: function (arr, $form, options) {
                progressStart();
                arr.push({
                    "name": "sessionid",
                    "value": sessionId
                });
                arr.push({
                    "name": "entryid",
                    "value": entryId
                });
                arr.push({
                    "name": "entryfilename",
                    "value": entryFileName
                });
                arr.push({
                    "name": "entryexpfilename",
                    "value": entryExpFileName
                });
                arr.push({
                    "name": "entrynmrdatafilename",
                    "value": entryNmrDataFileName
                });
                arr.push({
                    "name": "entrycsfilename",
                    "value": entryCsFileName
                });
            },
            success: function (jsonObj) {
                progressEnd();
                if (jsonObj.errorflag) alert(jsonObj.errortext);
                else {
    	            if (("summary" in jsonObj) && (jsonObj.summary.length > 0)) $("#summary_info").val(jsonObj.summary);
    	            if (("textcontent" in jsonObj) && (jsonObj.textcontent.length > 0)) $("#detail_info").val(jsonObj.textcontent);
                    if (("model_url" in jsonObj) && (jsonObj.model_url.length > 0)) {
                        var mList = [];
                        if (("molstar_maps" in jsonObj) && (jsonObj.molstar_maps.length > 0)) mList = jsonObj.molstar_maps;
                        display_mol_star(jsonObj.model_url, ({"mapsList": mList}));
                    }
                    if (("successfulflag" in jsonObj) && (jsonObj.successfulflag == "yes"))
                         $("#accept_button").attr("disabled", false);
                    else $("#accept_button").attr("disabled", true);
                }
                return false;
            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });

        $('#accept_button').click(function () {
            var serviceData = getServiceContext();
            $.ajax({ url: assemblyAcceptServiceUrl, data: serviceData, dataType: 'json',
                beforeSend: function() {
                    progressStart();
                },
                success: function (jsonObj) {
                    progressEnd();
                    if (jsonObj.errorflag) alert(jsonObj.errortext);
                    else alert(jsonObj.textcontent);
                    return false;
                },
                error: function (data, status, e) {
                    progressEnd();
                    alert(e);
                    return false;
                }
            });
        });
    }

    //    <!-- edit operations -->
    if ($("#editor-auto-launch").length > 0) {
	logContext("EDITORAUTO");

            var serviceData = getServiceContext();
            var url = "/service/editor/launch?context=summaryreport&datafile=" + entryFileName + "&sessionid=" + sessionId + "&identifier=" + entryId;
            $("#wrap").hide();
            $("#footer").hide();
            $("#edit-frame").attr("src", url).removeClass("displaynone");
	    $("#edit-frame").height(3500);
    }


    if ($("#edit-dialog").length > 0) {
	logContext("BUTTONS");
        setOptionButtonVisible("#edit-opener-button");
        $("#edit-button-label").html(getDisplayButtonLabel());
        $('#edit-opener-button').click(function () {
            var serviceData = getServiceContext();
            var url = "/service/editor/launch?context=sumaryreport&datafile=" + entryFileName + "&sessionid=" + sessionId + "&identifier=" + entryId;
            $("#wrap").hide();
            $("#footer").hide();
            $("#edit-frame").attr("src", url).removeClass("displaynone");
	        $("#edit-frame").height(3500);
        });

        $('#edit-opener-button-alt').click(function () {
            var serviceData = getServiceContext();
            var url = "/service/editor/launch?context=summaryreport&datafile=" + entryFileName + "&sessionid=" + sessionId + "&identifier=" + entryId;
            $("#wrap").hide();
            $("#footer").hide();
            $("#edit-frame").attr("src", url).removeClass("displaynone");
	        $("#edit-frame").height(3500);
        });

        $('#edit-opener-button-nmr').click(function () {
            var serviceData = getServiceContext();
            var url = "/service/editor/launch?context=nmr&datafile=" + entryFileName + "&sessionid=" + sessionId + "&identifier=" + entryId;
            $("#wrap").hide();
            $("#footer").hide();
            $("#edit-frame").attr("src", url).removeClass("displaynone");
	        $("#edit-frame").height(3500);
        });

        $('#edit-opener-button-em').click(function () {
            var serviceData = getServiceContext();
            var url = "/service/editor/launch?context=em&datafile=" + entryFileName + "&sessionid=" + sessionId + "&identifier=" + entryId;
            $("#wrap").hide();
            $("#footer").hide();
            $("#edit-frame").attr("src", url).removeClass("displaynone");
	        //$("#edit-frame").height(3500);
            $("#edit-frame").height($(window).height()-5);
        });

    }

    //<!-- correspondence operations -->
    if ($("#correspondence-dialog").length > 0) {
        function textbox_toggle(cbox) {
            var id = $(cbox).attr('id');
            var splitarr = id.split('_');
            var textbox = '#text_' + splitarr[1];
            var style = $(textbox).attr("style");

            if (($(cbox).is(':checked') && style == 'display: none;') ||
               (!$(cbox).is(':checked') && style != 'display: none;')) {
                $(textbox).toggle('fast');
            }
        }

        $("#correspondence-button-label").html(getDisplayButtonLabel());

        $('.check_box').on("click", function() {
            textbox_toggle(this);
        });

        $('.global_check').on("click", function() {
            var type = $(this).val();
            $('#correspondenceForm').find('input[type="checkbox"]').each(function() {
                if (type == "Check all")
                    $(this).prop('checked', true);
                else if (type == "Uncheck all")
                    $(this).prop('checked', false);
                textbox_toggle(this);
            });
        });

        $('#correspondenceForm').ajaxForm({
            url: correspondenceGenerateServiceUrl,
            dataType: 'json',
            beforeSubmit: function (arr, $form, options) {
                progressStart();
                arr.push({
                    "name": "sessionid",
                    "value": sessionId
                });
                arr.push({
                    "name": "entryid",
                    "value": entryId
                });
                arr.push({
                    "name": "entryfilename",
                    "value": entryFileName
                });
                arr.push({
                    "name": "entryexpfilename",
                    "value": entryExpFileName
                });
                arr.push({
                    "name": "entrynmrdatafilename",
                    "value": entryNmrDataFileName
                });
                arr.push({
                    "name": "entrycsfilename",
                    "value": entryCsFileName
                });
            },
            success: function (jsonObj) {
                progressEnd();
                alert(jsonObj.textcontent);
                return false;
            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });

        var serviceData = getServiceContext();
        $.ajax({
            url: correspondenceSelectServiceUrl,
            data: serviceData,
            dataType: 'json',
            beforeSend: function() {
                progressStart();
            },
            success: function (jsonObj) {
                progressEnd();
                $('#correspondence-content').html(jsonObj.htmlcontent);
                $('#correspondence-content').show();
            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });
    }

    <!-- coord operations -->
    if ($("#coord-dialog").length > 0) {
	//alert("coord-dialog found");

        //$.ajax({url: '/editormodule/js/jquery/plugins/jquery.jeditable.mini.js', async: false, dataType: 'script'});

        $("#coord-button-label").html(getDisplayButtonLabel());

        var chainids = '';
        var select_data = '';

        function isPDBNumber(value) {
            if (value == null || value == '' || value.match(/^[-]?\d*$/) != value) {
                 alert('Invalid number: ' + value);
                 return false;
            }
            return true;
        }

        function isPDBChainID(value) {
            if (value == null || value == '' || value.match(/^[a-zA-Z0-9]+$/) != value ||
                value.length > 4) {
                 alert('Invalid chain ID: ' + value);
                 return false;
            }
            return true;
        }

        function isAltInsCode(value, label) {
            if (value == null || value == '' || value.match(/^[?A-Za-z]$/) != value) {
                 alert('Invalid ' + label + ': ' + value);
                 return false;
            }
            return true;
        }


        function isOccupancy(value) {
            if (value == null || value == '' || value.match(/^[0-1]\.?\d*$/) != value) {
                 alert('Invalid occupancy: ' + value);
                 return false;
            }
            var f = parseFloat(value);
            if (f <= 0.0 || f > 1.0) {
                 alert('Invalid occupancy: ' + value);
                 return false;
            }
            return true;
        }
        function validate_form($form) {
            var clist = chainids.split(',');
            var existChainIds = new Object();
            for (var i = 0; i < clist.length; i++) {
                 existChainIds[clist[i]] = clist[i];
            }

            var polyChain = new Object();
            var rstatus = true;
            $form.find('input[type="text"]').each(function() {
                var id = $(this).attr('id');
                var value = $(this).attr('value').trim();
                if (value != '') {
                    var tlist = id.split('_');
                    if (tlist[0] == 'chainId') {
                        if (!isPDBChainID(value))
                            rstatus = false;
                        else if (tlist[1] == '0')
                            existChainIds[tlist[2]] = value;
                    } else if (tlist[0] == 'chainNum') {
                        if (!isPDBNumber(value)) rstatus = false;
                        if (tlist[1] == 'Polymer') {
                            if (polyChain.hasOwnProperty(tlist[3]))
                                 polyChain[tlist[3]] += 1
                            else polyChain[tlist[3]] = 1
                        }
                    } else if (tlist[0] == 'chainRangeNum') {
                        if (polyChain.hasOwnProperty(tlist[2]))
                             polyChain[tlist[2]] += 1
                        else polyChain[tlist[2]] = 1
                    }
                }
            });

            for (var property in polyChain) {
                 if (polyChain[property] > 1) {
                     alert('Please only fill in one of "Renumbering Polymer Starting from:"/'
                         + '"Renumbering Polymer using Range:" boxes for chain ' + property);
                     rstatus = false;
                 }
            }

            var assignChainIds = new Object();
            for (var property in existChainIds) {
                 if (assignChainIds.hasOwnProperty(existChainIds[property])) {
                     alert('Assign chain ID ' + existChainIds[property] + ' to multiple chains');
                     rstatus = false;
                 }
                 assignChainIds[existChainIds[property]] = 1
            }
            return rstatus;
        }

        $('#coordEditorForm').ajaxForm({
            url: coordUpdateServiceUrl,
            dataType: 'json',
            beforeSubmit: function (arr, $form, options) {
                if (!validate_form($form)) return false;
                progressStart();
                arr.push({
                    "name": "sessionid",
                    "value": sessionId
                });
                arr.push({
                    "name": "entryid",
                    "value": entryId
                });
                arr.push({
                    "name": "entryfilename",
                    "value": entryFileName
                });
                arr.push({
                    "name": "entryexpfilename",
                    "value": entryExpFileName
                });
                arr.push({
                    "name": "entrynmrdatafilename",
                    "value": entryNmrDataFileName
                });
                arr.push({
                    "name": "entrycsfilename",
                    "value": entryCsFileName
                });
            },
            success: function (jsonObj) {
                progressEnd();
                if (!jsonObj.errorflag) {
                    alert(jsonObj.textcontent);
                    $('#coord-content').hide();
                    $('#coord-update-button').attr('disabled','disabled');
                } else alert(jsonObj.errortext);
                return false;
            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });

        $(document).on('click','.discontrol', function(event) {
            var id = $(this).attr('id');
            var displayid = 'display_' + id;
            if (!$('#' + displayid).hasClass('has_value')) {
                var inputData = {};
                inputData.sessionid = sessionId;
                inputData.entryid = entryId;
                inputData.display_identifier = id;
                backend_call(inputData, displayid);
            } else {
                $('#' + displayid).toggle('slow');
            }
            event.preventDefault();
        });

        function backend_call(inputData, displaytag) {
            $.ajax({
                url: coordFormServiceUrl,
                data: inputData,
                dataType: 'json',
                beforeSend: function() {
                    progressStart();
                },
                success: function (jsonObj) {
                    if (jsonObj.statuscode=='running') {
                        var inputData1 = inputData;
                        inputData1.semaphore = jsonObj.semaphore;
                        inputData1.delay = 2;
                        t = setTimeout(function() { backend_call(inputData1, displaytag) }, 3000);
                    } else if (jsonObj.statuscode=='ok') {
                        progressEnd();
                        if ("chainids" in jsonObj) chainids = jsonObj.chainids;
                        if ("select" in jsonObj) select_data = jsonObj.select;
                        $('#' + displaytag).html(jsonObj.htmlcontent);
                        $('#' + displaytag).show();
                        $('#' + displaytag).addClass('has_value');
                        // $('#coord-table-container table').addClass('table table-condensed table-bordered table-striped')

                        $('.editable_text').editable(coordEditorSavingServiceUrl, {
                            type      : 'text',
                            cancel    : 'Cancel',
                            submit    : 'OK',
                            width     : '60px',
                            submitdata : { sessionid: sessionId, entryid: entryId },
                            onsubmit: function(settings, tag) {
                                 var value = $(tag).find('input').val();
                                 var id = $(tag).attr('id');
                                 var tlist = id.split('_');
                                 var rstatus = true;
                                 if (tlist[0] == 'resChainId')
                                     rstatus = isPDBChainID(value);
                                 else if (tlist[0] == 'resNum')
                                     rstatus = isPDBNumber(value);
                                 else if (tlist[0] == 'resIns')
                                     rstatus = isAltInsCode(value, 'insertion code');
                                 else if (tlist[0] == 'resLoc')
                                     rstatus = isAltInsCode(value, 'alternate location indicator');
                                 else if (tlist[0] == 'atomLoc')
                                     rstatus = isAltInsCode(value, 'alternate location indicator');
                                 else if (tlist[0] == 'atomOcc')
                                     rstatus = isOccupancy(value);
                                 if (rstatus == false) {
                                     tag.reset();
                                     return false;
                                 } else return true;
                            }
                        });

                        $('.editable_select').editable(coordEditorSavingServiceUrl, {
                            data      : select_data,
                            type      : 'select',
                            submit    : 'OK',
                            submitdata : { sessionid: sessionId, entryid: entryId }
                        });

                        $('.editable_select_YN').editable(coordEditorSavingServiceUrl, {
                            data      : " { 'Y':'Y', 'N':'N' } ",
                            type      : 'select',
                            submit    : 'OK',
                            submitdata : { sessionid: sessionId, entryid: entryId }
                        });
                    } else {
                        progressEnd();
                        alert(jsonObj.statustext);
                    }
                },
                error: function (data, status, e) {
                    progressEnd();
                    alert(e);
                    return false;
                }
            });
        }

        var serviceData = getServiceContext();
        serviceData.display_identifier = entryId;
        backend_call(serviceData, 'coord-content');

    } <!-- end coord dialog -->


    <!-- cs operations -->
    if ($("#cs-dialog").length > 0) {
        $("#cs-button-label").html(getDisplayCsButtonLabel());

        function isPDBNumber(value) {
            if (value == null || value == '' || value.match(/^[-]?\d*$/) != value) {
                 alert('Invalid number: ' + value);
                 return false;
            }
            return true;
        }

        function isPDBChainID(value) {
            if (value == null || value == '' || value.match(/^[a-zA-Z0-9]+$/) != value || value.length > 4) {
                 alert('Invalid chain ID: ' + value);
                 return false;
            }
            return true;
        }

        function isPDBName(value) {
            if (value == null || value == '' || value.match(/^[a-zA-Z0-9]+$/) != value || value.length > 3) {
                 alert('Invalid Residue Name: ' + value);
                 return false;
            }
            return true;
        }

        $('.tblhead').on("click", function() {
            var id = $(this).attr('id');
            var tblid = '#table_' + id;
            $(tblid).toggle('fast');
        });

        $('#csEditorForm').ajaxForm({
            url: csUpdateServiceUrl,
            dataType: 'json',
            beforeSubmit: function (arr, $form, options) {
                progressStart();
                arr.push({
                    "name": "sessionid",
                    "value": sessionId
                });
                arr.push({
                    "name": "entryid",
                    "value": entryId
                });
                arr.push({
                    "name": "entryfilename",
                    "value": entryFileName
                });
                arr.push({
                    "name": "entryexpfilename",
                    "value": entryExpFileName
                });
                arr.push({
                    "name": "entrynmrdatafilename",
                    "value": entryNmrDataFileName
                });
                arr.push({
                    "name": "entrycsfilename",
                    "value": entryCsFileName
                });
            },
            success: function (jsonObj) {
                progressEnd();
                if (!jsonObj.errorflag) {
                    alert(jsonObj.textcontent);
                    $('#cs-content').hide();
                    $('#cs-update-button').attr('disabled','disabled');
                } else alert(jsonObj.errortext);
                return false;
            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });

        var serviceData = getServiceContext();
        $.ajax({
            url: csFormServiceUrl,
            data: serviceData,
            dataType: 'json',
            beforeSend: function() {
                progressStart();
            },
            success: function (jsonObj) {
                progressEnd();
                $('#cs-content').html(jsonObj.htmlcontent);

		$('.jshead').on("click", function(event) {
		    $(this).next().toggle('slow');
		    event.preventDefault();
		    return false;
		});

		$('.tblhead').on("click", function(event) {
		    var id = $(this).attr('id');
		    var tblid = '#table_' + id;
		    $(tblid).toggle('fast');
		    event.preventDefault();
		});

		$('#cs-table-container table').addClass('table table-condensed table-bordered table-striped');

                $('#cs-content').show();


                $('.editable_text').editable(csEditorSavingServiceUrl, {
	            type      : 'text',
	            cancel    : 'Cancel',
	            submit    : 'OK',
	            width     : '60px',
	            submitdata : { sessionid: sessionId, entryid: entryId },
	            onsubmit: function(settings, tag) {
	                 var value = $(tag).find('input').val();
	                 var id = $(tag).attr('id');
	                 var tlist = id.split('_');
	                 var rstatus = true;
	                 if (tlist[0] == 'resChainId')
	                     rstatus = isPDBChainID(value);
	                 else if (tlist[0] == 'resNum')
        	             rstatus = isPDBNumber(value);
                         else if (tlist[0] == 'resName')
                             rstatus = isPDBName(value);
	                 if (rstatus == false) {
	                     tag.reset();
	                     return false;
	                 } else return true;
	            }
	        });

                $('.editable_select').editable(csEditorSavingServiceUrl, {
                    data      : select_data,
                    type      : 'select',
                    submit    : 'OK',
                    submitdata : { sessionid: sessionId, entryid: entryId }
                });

		$('.editable_select_YN').editable(csEditorSavingServiceUrl, {
                    data      : " { 'Y':'Y', 'N':'N' } ",
                    type      : 'select',
                    submit    : 'OK',
                    submitdata : { sessionid: sessionId, entryid: entryId }
                });

            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });
    } <!-- end cs dialog -->


    <!-- cs editor under NMR tab -->
    if ($("#nmr-cs-editor-dialog").length > 0) {

        function isPDBNumber(value) {
            if (value == null || value == '' || value.match(/^[-]?\d*$/) != value) {
                 alert('Invalid number: ' + value);
                 return false;
            }
            return true;
        }

        function isPDBChainID(value) {
            if (value == null || value == '' || value.match(/^[a-zA-Z0-9]+$/) != value || value.length > 4) {
                 alert('Invalid chain ID: ' + value);
                 return false;
            }
            return true;
        }

        function isPDBName(value) {
            if (value == null || value == '' || value.match(/^[a-zA-Z0-9]+$/) != value || value.length > 3) {
                 alert('Invalid Residue Name: ' + value);
                 return false;
            }
            return true;
        }

        $('.tblhead').on("click", function() {
            var id = $(this).attr('id');
            var tblid = '#table_' + id;
            $(tblid).toggle('fast');
        });

        $('#csEditorForm').ajaxForm({
            url: csUpdateServiceUrl,
            dataType: 'json',
            beforeSubmit: function (arr, $form, options) {
                progressStart();
                arr.push({
                    "name": "sessionid",
                    "value": sessionId
                });
                arr.push({
                    "name": "entryid",
                    "value": entryId
                });
                arr.push({
                    "name": "entryfilename",
                    "value": entryFileName
                });
                arr.push({
                    "name": "entryexpfilename",
                    "value": entryExpFileName
                });
                arr.push({
                    "name": "entrynmrdatafilename",
                    "value": entryNmrDataFileName
                });
                arr.push({
                    "name": "entrycsfilename",
                    "value": entryCsFileName
                });
            },
            success: function (jsonObj) {
                progressEnd();
                if (!jsonObj.errorflag) {
                    alert(jsonObj.textcontent);
                    $('#cs-content').hide();
                    // $('#cs-update-button').attr('disabled','disabled');
                    $('#cs-table-container').addClass('displaynone');
                    $('#cs-table-container').hide();
                    $('#nmr-tasks-dialog').show();
                } else alert(jsonObj.errortext);
                return false;
            },
            error: function (data, status, e) {
                progressEnd();
                alert(e);
                return false;
            }
        });
    } <!-- end cs editor under NMR tab -->


    if ($("#check-report-dialog").length > 0) {
        if (entryFileName.length > 0) {
	        if (entryExpFileName.length > 0) {
		        $("#check-report-alt-dialog").html("Checking files: " + entryFileName + "&nbsp;" + entryExpFileName);
	        } else {
		        $("#check-report-alt-dialog").html("Checking file: " + entryFileName);
	        }
            $("#check-report-alt-dialog").show();
            $("#check-report-dialog").show();

	        $('#check-report-idops-form').ajaxForm({
	        url: checkReportIdOpsUrl,
                dataType: 'json',
                success: function (jsonObj) {
		            logContext("Operation completed");
		            var errFlag = jsonObj.errorflag;
		            var errText = jsonObj.statustext;
		            if (errFlag) {
			            $('#check-report-idops-form div.op-status').html(errText);
			            $('#check-report-idops-form div.op-status').addClass('error-status');
		            }
		            updateLinkContent(jsonObj,   '#check-report-idops-form');
		            updateReportContent(jsonObj, '#check-report-container');
		            //$('#check-report-container  div.report-content').show();
		            $('#check-report-idops-button').show();
		            progressEnd();
		            if ($("#consolidated-report-section").length > 0) {
			            setupSideBar();
		            }
                },
                beforeSubmit: function (arr, $form, options) {
		            $('#check-report-idops-form div.op-status').hide();
		            $('#check-report-idops-form div.op-links').hide();
		            $('#check-report-container  div.report-content').hide();

		            progressStart();
		            $('#check-report-idops-button').hide();
		            arr.push({
                        "name": "sessionid",
                        "value": sessionId
		            });
		            arr.push({
			            "name": "entryid",
			            "value": entryId
		            });
		            arr.push({
			            "name": "entryfilename",
			            "value": entryFileName
		            });
		            arr.push({
			            "name": "entryexpfilename",
			            "value": entryExpFileName
		            });
	                    arr.push({
	                            "name": "entrynmrdatafilename",
	                            "value": entryNmrDataFileName
	                    });
		            arr.push({
			            "name": "entrycsfilename",
			            "value": entryCsFileName
		            });

		            arr.push({
			            "name": "filesource",
			            "value": "session"
		            });

                }
	        });
	    } else {
            $("#check-report-dialog").hide();
            $("#check-report-alt-dialog").html("No file uploaded");
            $("#check-report-alt-dialog").show();
	    }

    } <!-- end of check-report-diag -->



     if ($("#nmr-tasks-dialog").length > 0) {
         logContext("Found NMR dialog");
         //$("#nmr-cs-atom-name-check-form").hide();
         //$("#nmr-cs-upload-check-form").hide();
         uploadMultipleFiles(uploadMultiServiceUrl, "#upload-cs-auth", "#uploadProgress");
     }

    // pcm

    if ($("#pcm-dialog").length > 0) {
        function backend_call(inputData, displaytag) {
            $.ajax({
                url: pcmFormServiceUrl,
                data: inputData,
                dataType: 'json',
                beforeSend: function() {
                    progressStart();
                },
                success: function (jsonObj) {
                    if (jsonObj.statuscode=='running') {
                        var inputData1 = inputData;
                        inputData1.semaphore = jsonObj.semaphore;
                        inputData1.delay = 2;
                        t = setTimeout(function() { backend_call(inputData1, displaytag) }, 3000);
                    } else if (jsonObj.statuscode=='ok') {
                        progressEnd();
                        $('#' + displaytag).html(jsonObj.htmlcontent);
                        $('#' + displaytag).show();
                        $('#' + displaytag).addClass('has_value');
                    } else {
                        progressEnd();
                        alert(jsonObj.statustext);
                    }
                },
                error: function (data, status, e) {
                    progressEnd();
                    alert(e);
                    return false;
                }
            });
        }

        $('#pcm-update-button').click(function() {
            var serviceData = getServiceContext();
            serviceData.display_identifier = entryId;
            backend_call(serviceData, 'ccd-table-content');
        });

        var serviceData = getServiceContext();
        serviceData.display_identifier = entryId;
        backend_call(serviceData, 'ccd-table-content');
    }

    //    <!-- make the nav item for the current page active -->
    $('.nav a[href="' + pagePath + '"]').parent().addClass('active');
    //
    handleCLoseWindow();

}); // end-ready

