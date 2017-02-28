function dependOn(){"use strict";return[require("communicate"),require("proxy"),require("common"),require("util"),require("analytics")]}var def;require=function(a){"use strict";return a},def=window.define?window.define:function(a,b){"use strict";return b.apply(null,[{ajax:$.ajax.bind($)}])};var exports=acom_analytics={};def(dependOn(),function(a,b,c,d,e){"use strict";var g,i,j,f=null,k=!1,l=0,m=1,n=2,o=3,p=4,q=10,r=11,s=12,t=13,u=14,v=[l,m,n,t,u],w=[n=2,r=11,s=12,t=13];j=function(){return a.getModule("acro-gstate")},i=function(){function h(a){var b;for(b=0;b<f.length;b+=1)if(f[b].tabId===a)return f[b];return null}function i(a){return chrome.i18n.getMessage(a)||chrome.i18n.getMessage("web2pdfStatusError")}function x(a){return a=a||chrome.i18n.getMessage("web2pdfUntitledFileName"),a.replace(/[<>?:|\*"\/\\'&\.]/g,"")}var f=[];this.proxy=b.proxy.bind(this),this.LOG=c.LOG,this.UNSET=0,this.OPEN_IN_ACROBAT=1,this.APPEND=2,this.CONVERT_PAGE=4,this.CONVERT_LINK=8,this.CONVERT_SELECTION=16,this.PRINT=32,this.EMAIL=64,this.CALLER_TOOLBAR=128,this.CLEAN_FILE_ON_FAILURE=256,this.STATUS_WAITING=1e4,this.STATUS_DOWNLOADING=10001,this.STATUS_CONVERTING=10002,this.STATUS_SUCCESS=10003,this.STATUS_ERROR=10004,this.STATUS_NOINSTANCE=10005,this.STATUS_FILELOCKED=10006,this.STATUS_NOACROBAT=10007,this.STATUS_CANCELLED=10008,this.STATUS_FILE_OPENED=10100,this.STATUS_FILE_OPEN_FAILED=10101,this.imagePromise=null,this.errorHandler=function(){try{if(0===f.length)return;this.Done(f[0].tabId,this.STATUS_ERROR,null,d.getTranslation("web2pdfHTMLJSError"))}catch(a){}},b.handlers(this.errorHandler.bind(this)),this.Done=function(a,b,c,d){if(a===-1){if(0===f.length)return;a=f[0].tabId}this.setStatus(a,b,c,d),this.nextConversion(a)},this.nextConversion=function(a){var b;for(b=0;b<f.length;b+=1)f[b].tabId===a&&f.splice(b,1);f.length>0&&f[0].start.resolve(f[0]),this.exitShim()},this.cancelConversion=function(a){var b;for(b=0;b<f.length;b+=1)f[b].tabId===a&&(f[b].start&&f[b].start.reject(),f.splice(b,1))},this.addConversion=function(a,b){return a.start=d.Deferred(),f.push(a),1===f.length?a.start.resolve(a):b&&b(),a.start},this.setStatus=function(b,c,f,g){var i,j=h(b)||this.openPDFRequest,k=new Date;return d.consoleLog("setStatus: "+b+" status: "+c),j?(j.timing||(j.timing=[]),c===this.STATUS_WAITING?(i="waiting",e.event(e.e.TREFOIL_HTML_CONVERT_WAITING),j.timing.push({stage:"WAIT",start_time:k.getTime()})):c===this.STATUS_DOWNLOADING?(e.event(e.e.TREFOIL_HTML_CONVERT_DOWNLOADING),i="downloading",this.logTiming(j.timing,"WAIT")):c===this.STATUS_CONVERTING?(e.event(e.e.TREFOIL_HTML_CONVERT_IN_PROGRESS),i="in_progress",this.logTiming(j.timing,"USER_PROMPT"),j.timing.push({stage:"CONVERT",start_time:k.getTime()})):c===this.STATUS_SUCCESS?(e.event(e.e.TREFOIL_HTML_CONVERT_COMPLETE),i="complete",this.logTiming(j.timing,"CONVERT")):c===this.STATUS_ERROR?(e.event(e.e.TREFOIL_HTML_CONVERT_FAILED),i="failure"):c===this.STATUS_CANCELLED?(e.event(e.e.TREFOIL_HTML_CONVERT_CANCELLED),i="cancelled",this.logTiming(j.timing,"USER_PROMPT")):c===this.STATUS_NOACROBAT?(e.event(e.e.TREFOIL_HTML_CONVERT_NO_ACROBAT),i="noacrobat"):c===this.STATUS_FILELOCKED?i="filelocked":c===this.STATUS_FILE_OPENED?(j.version===SETTINGS.READER_VER?e.event(e.e.TREFOIL_PDF_DOWNLOAD_OPENED_READER):e.event(e.e.TREFOIL_PDF_DOWNLOAD_OPENED),i="pdf_opened"):c===this.STATUS_FILE_OPEN_FAILED?(j.version===SETTINGS.READER_VER?e.event(e.e.TREFOIL_PDF_DOWNLOAD_OPEN_FAILED_READER):e.event(e.e.TREFOIL_PDF_DOWNLOAD_OPEN_FAILED),i="pdf_open_failed"):(d.consoleLog("Unexpected status: "+c),i="unknown"),j.panel_op="status",j.current_status=i,f&&(j.file_path=f),g&&(j.message=g),void a.deferMessage(j)):void d.consoleLog("failed to find conversion for tabId: "+b)},this.nativeMessageCallback=function(a){var b;"setStateCallback"===a.messageType?this.setStatus(+a.conversionID,+a.state):"doneCallback"===a.messageType?(a.filePath&&(b=d.atob16(a.filePath)),this.Done(+a.conversionID,+a.state,b)):"getMessageCallback"===a.messageType?this.sendMessageToNative({message:i(a.msgIDStr)}):"saveSuccessCallback"===a.messageType?(b=d.atob16(a.path),this.imagePromise.resolve(b)):"saveFailureCallback"===a.messageType?(d.consoleLogDir("failed to save image"),this.imagePromise.reject()):"shimVersionInfo"===a.messageType?this.versionCallback&&(this.versionCallback(a),delete this.versionCallback):"fileOpenCallback"===a.messageType&&(0===+a.state?this.setStatus(0,this.STATUS_FILE_OPENED):this.setStatus(0,this.STATUS_FILE_OPEN_FAILED),this.openPDFRequest&&(this.nextConversion(this.openPDFRequest.tabId),delete this.openPDFRequest))},this.init=function(){this.m_NativeConnectionPort=chrome.runtime.connectNative("com.adobe.acrobat.chrome_webcapture"),this.m_NativeConnectionPort.onMessage.addListener(this.proxy(this.nativeMessageCallback)),this.m_NativeConnectionPort.onDisconnect.addListener(this.proxy(function(){var a=this.STATUS_ERROR;"Specified native messaging host not found."===chrome.runtime.lastError.message&&(this.versionCallback&&(this.versionCallback({messageType:"shimVersionInfo",majorVersion:"0",minorVersion:"0"}),delete this.versionCallback),a=this.STATUS_NOACROBAT),"Native host has exited"===chrome.runtime.lastError.message&&(a=this.STATUS_ERROR),this.m_NativeConnectionPort=null,this.Done(-1,a)}))},this.sendMessageToNative=function(b){return a.legacyShim()&&b.task&&v.indexOf(b.task)===-1?void d.consoleLog("Skipping task: "+b.task+" in legacy shim"):(this.m_NativeConnectionPort||this.init(),this.m_NativeConnectionPort.postMessage(b),void(w.indexOf(b.task)!==-1&&setTimeout(this.proxy(function(){this.exitShim()}),1e3)))},this.exitShim=function(){0===f.length&&this.sendMessageToNative({task:u})},this.getVersion=function(a){this.versionCallback=a,this.sendMessageToNative({task:t})},this.openInAcrobat=function(a){this.addConversion(a).then(this.proxy(function(a){this.openPDFRequest=a,this.sendMessageToNative({task:s,pdfData:a.base64PDF.split(",")[1],fileName:a.filename}),e.checkAndLogPDFSize(a.base64PDF.length/1048576),delete a.base64PDF}))},this.openFile=function(a){0===f.length&&this.sendMessageToNative({task:r,filePath:a.file_path})},this.SendForConversion=function(a,b){try{var c,e=new Date;c=0!==(a.conversionSettings&this.APPEND)?m:l,b.timing||(b.timing=[]),b.timing.push({stage:"USER_PROMPT",start_time:e.getTime()}),b.outputPath?0===b.action?this.sendMessageToNative({task:o,conversionID:b.tabId,domData:a.domData,conversionSettings:a.conversionSettings,charset:a.charset,url:a.url,docTitle:a.domtitle,outputPath:b.outputPath}):1===b.action&&this.sendMessageToNative({task:p,conversionID:b.tabId,domData:a.domData,conversionSettings:a.conversionSettings,charset:a.charset,url:a.url,docTitle:a.domtitle,outputPath:b.outputPath}):this.sendMessageToNative({task:c,conversionID:b.tabId,domData:a.domData,conversionSettings:a.conversionSettings,charset:a.charset,url:a.url,docTitle:a.domtitle})}catch(a){this.Done(b.tabId,this.STATUS_ERROR)}},this.showConversionSettingsDialog=function(){0===f.length&&this.sendMessageToNative({task:n})},this.convertToPDF=function(a,b){var d;a.conversionSettings=this.UNSET,d=j().getViewResultsPreferenceState(),d&&(a.conversionSettings|=this.OPEN_IN_ACROBAT),a.action===j().web2pdfAction.APPEND?a.conversionSettings|=this.APPEND:a.conversionSettings|=this.CLEAN_FILE_ON_FAILURE,a.context===j().web2pdfContext.PAGE&&(a.conversionSettings|=this.CONVERT_PAGE),a.caller===j().web2pdfCaller.TOOLBAR?a.conversionSettings|=this.CALLER_TOOLBAR:a.context===j().web2pdfContext.LINK&&(a.conversionSettings|=this.CONVERT_LINK),this.SendForConversion(a,b)},this.processImages=function(a,b,c){var e=a.blob.refs[b],f=new Date;return a.timing||(a.timing=[]),a.imagesComplete||(a.imagesComplete=d.Deferred()),this.imagePromise=d.Deferred(),b>=a.blob.refs.length?(this.imagePromise.resolve(),a.imagesComplete.resolve(),this.imagePromise):(e.data&&"data:"!==e.data?"image"===e.type?(k||(a.timing.push({stage:"SEND_IMAGES",start_time:f.getTime()}),k=!0),a.blob.refs.splice(b,1),this.sendMessageToNative({task:q,imagedata:e.data.split(",")[1],conversionID:a.tabId}),this.imagePromise.then(this.proxy(function(a){c.push("<AcroexchangeDownloadSeprator AcroexchangeDownloadUrl="+e.placeholder+"><FILEPATH>"+a+"</FILEPATH></AcroexchangeDownloadSeprator>")}),function(){})):(this.imagePromise.resolve(),b+=1):(a.blob.refs.splice(b,1),this.imagePromise.resolve()),this.imagePromise.done(this.proxy(function(){this.processImages(a,b,c)})),this.imagePromise)},this.acro_html=function(a,b){var c,f,g;a.error?(d.consoleError(a.error),e.logError(a.error_analytics),this.Done(a.tabId,this.STATUS_ERROR,null,d.getTranslation(a.error))):(e.checkAndLogHTMLBlobSize(a.blob.currentSize/1048576),e.logContents(a),a.analytics&&e.setParamsAndLogAnalytics(a.analytics,e.e.HTML_SOURCE_CONTENT,"content"),e.setArg("stage","CLONE"),e.checkAndLogTimingRange(a.cloneTiming),g=h(a.tabId),g.blob=a.blob,f=[],k=!1,this.processImages(g,0,f),g.imagesComplete.then(this.proxy(function(){for(delete g.imagesComplete,this.logTiming(g.timing,"SEND_IMAGES"),f.push("<AcroexchangeDownloadSeprator AcroexchangeDownloadUrl="+b.tab.url+">"+g.blob.html+"</AcroexchangeDownloadSeprator>"),c=0;c<g.blob.refs.length;c+=1)f.push("<AcroexchangeDownloadSeprator AcroexchangeDownloadUrl="+g.blob.refs[c].placeholder+">"+g.blob.refs[c].data+"</AcroexchangeDownloadSeprator>");delete g.blob,this.convertToPDF({caller:g.caller,action:g.action,context:j().web2pdfContext.PAGE,domData:f.join("\n"),charset:"UTF-8",domtitle:g.domtitle,url:g.url},g)})))},this.logTiming=function(a,b){var c,d=new Date;a.forEach(function(a){a.stage===b&&(c=d.getTime()-a.start_time,e.setArg("stage",b),e.checkAndLogTimingRange(c/100))})},this.handleConversionRequest=function(b){var c,d=this.proxy(function(){this.setStatus(b.tabId,this.STATUS_WAITING)});a.legacyShim()||b.context!==j().web2pdfContext.PAGE?(a.legacyShim()||b.context===j().web2pdfContext.LINK)&&this.addConversion(b,d).then(this.proxy(function(a){this.convertToPDF({caller:a.caller,action:a.action,context:a.context,domData:"",charset:"UTF-8",domtitle:a.domtitle,url:a.url},a)})):this.addConversion(b,d).then(this.proxy(function(a){delete a.start,this.setStatus(a.tabId,this.STATUS_DOWNLOADING),e.logSiteAndProtocolAnalytics(a.url),c="var maxSize = "+SETTINGS.MAX_HTML_SIZE+", DEBUG = "+SETTINGS.DEBUG_MODE+", TABID = "+a.tabId+", OP = 'acro-html', EXCLUDE = ['font', 'svg_image'];",chrome.tabs.executeScript(a.tabId,{code:c,runAt:"document_start"},this.proxy(function(){if(chrome.runtime.lastError)throw new Error(chrome.runtime.lastError.message);chrome.tabs.executeScript(a.tabId,{file:"data/js/get-html.js"})}))}))},this.convertToPDFPopupMenu=function(a,b){var c={tabId:b.tab.id,caller:j().web2pdfCaller.TOOLBAR,action:j().web2pdfAction.CONVERT,context:j().web2pdfContext.PAGE,url:b.tab.url,domtitle:x(b.tab.title)};a.outputPath&&(c.outputPath=a.outputPath),this.handleConversionRequest(c)},this.appendToExistingPDFPopupMenu=function(a,b){var c={tabId:b.tab.id,caller:j().web2pdfCaller.TOOLBAR,action:j().web2pdfAction.APPEND,context:j().web2pdfContext.PAGE,url:b.tab.url,domtitle:x(b.tab.title)};a.outputPath&&(c.outputPath=a.outputPath),this.handleConversionRequest(c)}},f||(f=new i,a.registerModule("acro-web2pdf",f),a.registerHandlers({"acro-html":f.proxy(f.acro_html),appendToExistingPDFPopupMenu:f.proxy(f.appendToExistingPDFPopupMenu),convertToPDFPopupMenu:f.proxy(f.convertToPDFPopupMenu),showConversionSettingsDialog:f.proxy(f.showConversionSettingsDialog)}));for(g in f)f.hasOwnProperty(g)&&("function"==typeof f[g]?exports[g]=f[g].bind(f):exports[g]=f[g]);return f});