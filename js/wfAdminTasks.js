/*
 * File:  wfAdminTasks.js
 * Date:  10-Dec-2012  J. Westbrook
 *
 * Updates:
 *
 */
//
// Globals -
//
var sessionId = '';
var entryId = '';
var entryfilename = '';
var entryexpfilename = '';
var successFlag = 'false';
var errorFlag = '';
var errotText = '';
//
var uploadServiceUrl        = '/service/ann_tasks_v2/wfadmin_upload';
var newEntryServiceUrl      = '/service/ann_tasks_v2/wfadmin_new_entry';
var resetEntryServiceUrl    = '/service/ann_tasks_v2/wfadmin_reset_entry';
var reassignEntryServiceUrl = '/service/ann_tasks_v2/wfadmin_reassign_entry';
//
var newSessionServiceUrl     = '/service/ann_tasks_v2/newsession';
var getSessionInfoServiceUrl = '/service/ann_tasks_v2/getsessioninfo';

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
function setDownloadFileUrl(id) {
    var url;
    var fn;
    if (entryId.length > 0) {
        //fn  = entryId + "-updated.cif";
        fn = entryfilename;
        url = "/sessions/" + sessionId + "/" + fn;
    } else {
        url = "#";
        fn = "";
    }
    $(id).attr("href", url);
    $(id).html(fn);
    $(id).show();
}

function getDownloadFileName() {
    var fn;
    if (entryfilename.length > 0) {
        fn = "Download annotated file: ";
    } else {
        fn = "No file uploaded";
    }
    return fn;
}

function uploadFile(serviceUrl, formElementId, progressElementId) {
    var bar = $('.bar');
    var percent = $('.percent');
    var status = $('#status');
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
                        "value": entryfilename
                    });
                    arr.push({
                        "name": "entryexpfilename",
                        "value": entryexpfilename
                    });
      },

        beforeSend: function () {
            $(progressElementId).find('div').show();
            status.empty();
            var percentVal = '0%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        uploadProgress: function (event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
        },
        complete: function (xhr) {
			var tS,tJ;
			if (xhr.responseText.startsWith("<textarea>")) {
				tS = $(xhr.responseText).val();
			} else {
				tS = xhr.responseText;
			}
			tJ = $.parseJSON(tS);
			status.html(tJ.htmlcontent);
			if ("entryid" in tJ) {
				entryId = tJ.entryid;
			}
			if ("entryfilename" in tJ) {
				entryfilename = tJ.entryfilename;
				$("#new-entry-form").show();	    	
			}
			if ("entryexpfilename" in tJ) {
				entryexpfilename = tJ.entryexpfilename;
			}
			logContext("After file upload");
			appendContextToMenuUrls();
			$(progressElementId).find('div').hide(3000);
        },
	  // data: serviceData
        dataType: 'json'

    };
    $(formElementId).ajaxForm(options);
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

}

function getSessionInfo() {
    var retObj;
    var serviceData = getServiceContext();
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

function appendContextToMenuUrls() {
    // append the current session id to menu urls
  /*
    $("#top-menu-options").find("li > a").attr('href', function (index, href) {
        ret = href.split("?")[0];
        if (sessionId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'sessionid=' + sessionId;
        }
        if (entryId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryid=' + entryId;
        }
        if (entryfilename.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryfilename=' + entryfilename;
        }
        if (entryexpfilename.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryexpfilename=' + entryexpfilename;
        }
        //console.log("index = " + index + " href " + href + " ret = " + ret);
        return ret;
    });
  */
    $("fieldset legend a, #top-menu-options li a" ).attr('href', function (index, href) {
        ret = href.split("?")[0];
        if (sessionId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'sessionid=' + sessionId;
        }
        if (entryId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryid=' + entryId;
        }
        if (entryfilename.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryfilename=' + entryfilename;
        }
        if (entryexpfilename.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryexpfilename=' + entryexpfilename;
        }
        //console.log("index = " + index + " href " + href + " ret = " + ret);
        return ret;
    });


}
function assignContext(jsonObj) {
    sessionId = jsonObj.sessionid;
    //  message  =jsonObj.htmlcontent;
    errorFlag = jsonObj.errorflag;
    errorText = jsonObj.errortext;
    if ('entryid' in jsonObj) {
        entryId = jsonObj.entryid;
    }
    if ('entryfilename' in jsonObj) {
        entryfilename = jsonObj.entryfilename;
    }
    if ('entryexpfilename' in jsonObj) {
        entryexpfilename = jsonObj.entryexpfilename;
    }

    //console.log("Assigning - session id " + sessionId + " entry id " + entryId + " entry filename " + entryfilename);
}
function logContext(message) {
    //console.log("%lc: " + message + " ( session id " + sessionId + " entry id " + entryId + " entry filename " + entryfilename + ")");
	log("%lc: " + message + " ( session id " + sessionId + " entry id " + entryId + " entry model filename " + entryfilename +" entry sf filename " + entryexpfilename + ")");
}
function getCurrentContext() {
    var myUrl = $(location).attr('href');
    params = $.url(myUrl).param();
    if ("sessionid" in params) {
        sessionId = params.sessionid;
    }
    if ("entryid" in params) {
        entryId = params.entryid;
    }
    if ("entryfilename" in params) {
        entryfilename = params.entryfilename;
    }
    if ("entryexpfilename" in params) {
        entryexpfilename = params.entryexpfilename;
    }

    logContext("after getCurrentContext()");
}

function clearServiceContext() {
  sessionId='';
  entryId='';
  entryfilename='';
  entryexpfilename='';
}

function getServiceContext() {
    var sc = {};
    sc.sessionid = sessionId;
    sc.entryid = entryId;
    sc.entryfilename = entryfilename;
    sc.entryexpfilename = entryexpfilename;
    return sc;
}

function getDisplayButtonLabel() {
    var retS = '';
    if (entryfilename.length > 0) {
        retS = "Current data file: " + entryfilename;
    } else {
        retS = "No current data file ";
    }
    return retS;
}

function setOptionButtonVisible(id) {
    if (entryfilename.length > 0) {
        $(id).show();
    } else {
        $(id).hide();
    }
}

function progressStart() {
    $("#loading").fadeIn('slow').spin("large", "black");
}

function progressEnd() {
    $("#loading").fadeOut('fast').spin(false);
}

function updateCompletionStausWf(statusHtml, formId) {
  $(formId + ' div.op-status').html(statusHtml);
  $(formId + ' div.op-status').removeClass('error-status');
  $(formId + ' div.op-status').show();
}

function updateCompletionStaus(jsonObj, statusId) {
    var retHtml = jsonObj.htmlcontent;
    var errFlag = jsonObj.errorflag;
    var errText = jsonObj.errortext;
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
//
// Document ready entry point
//
$(document).ready(function () {
    $("#uploadProgress").find('*').hide();
    getCurrentContext();
    appendContextToMenuUrls();
    if (sessionId.length == 0) {
        newSession('request session');
        logContext('Assigning new session id  = ' + sessionId);
    }
    if ($("#wf-admin-dialog").length > 0) {
        newSession('reset session before upload');
        uploadFile(uploadServiceUrl, "#upload-wf-admin-model", "#uploadProgress");
        uploadFile(uploadServiceUrl, "#upload-wf-admin-exp",   "#uploadProgress");

	if (entryfilename.length > 0) {
	    $("#new-entry-form").show();
	} else {
	  $("#new-entry-form").hide();	    
	}	    
            <!-- New entry form -->
            $('#new-entry-form').ajaxForm({
                url: newEntryServiceUrl,
                dataType: 'json',
                success: function (jsonObj) {
                    logContext("New entry successfully added to workflow system");
                    progressEnd();
                    $('#new-entry-button').show();
                    updateCompletionStaus(jsonObj, '#new-entry-form');
                },
                beforeSubmit: function (arr, $form, options) {
		    $('#new-entry-form div.op-status').hide();
                    progressStart();
                    $('#new-entry-button').hide();
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
                        "value": entryfilename
                    });
                    arr.push({
                        "name": "entryexpfilename",
                        "value": entryexpfilename
                    });
                }
            });


        <!-- Reset entry form -->
	$('#reset-entry-form').ajaxForm({
                url: resetEntryServiceUrl,
                dataType: 'json',
                success: function (jsonObj) {
                    logContext("Entry status successfully reset in the workflow system");
                    progressEnd();
                    $('#reset-entry-button').show();
                    updateCompletionStaus(jsonObj, '#reset-entry-form');
                },
                beforeSubmit: function (arr, $form, options) {
		    $('#reset-entry-form div.op-status').hide();
                    progressStart();
                    $('#reset-entry-button').hide();
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
                        "value": entryfilename
                    });
                    arr.push({
                        "name": "entryexpfilename",
                        "value": entryexpfilename
                    });
                }
         });


        <!-- Reassign entry form -->
	$('#reassign-entry-form').ajaxForm({
                url: reassignEntryServiceUrl,
                dataType: 'json',
                success: function (jsonObj) {
                    logContext("Entry annotator successfully reassigned in the workflow system");
                    progressEnd();
                    $('#reassign-entry-button').show();
                    updateCompletionStaus(jsonObj, '#reassign-entry-form');
                },
                beforeSubmit: function (arr, $form, options) {
		    $('#reassign-entry-form div.op-status').hide();
                    progressStart();
                    $('#reassign-entry-button').hide();
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
                        "value": entryfilename
                    });
                    arr.push({
                        "name": "entryexpfilename",
                        "value": entryexpfilename
                    });
                }
         });


    }

    <!-- end assembly operations -->
    <!-- Download task operations -->
    if ($("#download-dialog").length > 0) {
        $("#download-logfiles").hide();
        $("#download-logfiles-label").hide();
        var sObj = getSessionInfo();
        updateDownloadOptions(sObj);
        //
        $('#download-url').hide();
        $("#download-url-label").html(getDownloadFileName());
        setDownloadFileUrl("#download-url");
    }
    <!-- manage position of page footer -->
    positionFooter();
    function positionFooter() {
        $("#footer").css({
            position: "absolute",
            top: ($(window).scrollTop() + $(window).height() - $("#footer").height()) + "px"
        })
    }
    $(window).scroll(positionFooter).resize(positionFooter);
}); // end-ready

