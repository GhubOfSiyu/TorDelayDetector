/**
 * XULSchoolChrome namespace.
 */
if ("undefined" == typeof(XULSchoolChrome)) {
  var XULSchoolChrome = {};
};

//XULSchoolChrome.count = 0;
//XULSchoolChrome.time_ary = new Array();
//XULSchoolChrome.list_len = 0;


XULSchoolChrome.urlAry = new Array();


//below obsolete------------------------------------------------------------------------------------------------------------------------
/**
 * Controls the browser overlay for the Hello World extension.
 */
XULSchoolChrome.BrowserOverlay = {
  /**
   * Says 'Hello' to the user.
   */
  sayHello : function(aEvent) {
    let stringBundle = document.getElementById("xulschoolhello-string-bundle");
    let message = stringBundle.getString("xulschoolhello.greeting.label");
    //let win = window.open("chrome://xulschoolhello/content/window.xul", "bmarks", "chrome,width=600,height=300,resizable=yes");
  
    
  },  

};


var myExtension = {
    init: function() {
        // The event can be DOMContentLoaded, pageshow, pagehide, load or unload.
        if(gBrowser) gBrowser.addEventListener("load", this.onPageLoad, true);
    },
    onPageLoad: function(aEvent) {
       
        var doc = aEvent.originalTarget; // doc is document that triggered the event
        var win = doc.defaultView; // win is the window for the doc
        var win_content = window.content;
        //window.alert(win.name)
        //XULSchoolChrome.count = doc.location.href;
        // test desired conditions and do something
        // if (doc.nodeName != "#document") return; // only documents
        // if (win != win.top) return; //only top window.
         if (win.frameElement) return; // skip iframes/frames
        
        //let time = window.content.performance.timing;
        let time = win_content.performance.timing;
        let before_request = time.requestStart-time.navigationStart
        let delay = time.responseEnd-time.requestStart;
        if (delay == 0) {
          return 
        }
        
        let after_response = time.domComplete- time.responseEnd;
        let temp = [doc.location.href, before_request, delay, after_response];
        XULSchoolChrome.time_ary.push(temp);
        
        //if (doc.location.href == window.content.location.href) {
        //window.alert(time.responseEnd-time.requestStart);
        //window.alert("page is loaded \n"+doc.location.href)
         aEvent.stopPropagation;
          //XULSchoolChrome.count = 2
        window.alert("page is loaded \n" +doc.location.href);
        
        //save delay information to file
        Components.utils.import("resource://gre/modules/FileUtils.jsm");
	thefile = new FileUtils.File("/Users/siyu/Downloads/1.csv");
	
        try {
	    
	    
	 // --- do something with the file here ---
	    var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
            createInstance(Components.interfaces.nsIFileOutputStream);

	    foStream.init(thefile, 0x02 | 0x08 | 0x20, 0666, 0); 
    
            var d = new Date()
	// if you are sure there will never ever be any non-ascii text in data you can 
	// also call foStream.write(data, data.length) directly
	    var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
            createInstance(Components.interfaces.nsIConverterOutputStream);
	    converter.init(foStream, "UTF-8", 0, 0);
	    let i = 0;
	    var data = "domain_name,pre-processing,network,post-processing,date\n";
	    while (i < XULSchoolChrome.time_ary.length) {
		data += '' + XULSchoolChrome.time_ary[i][0] + ',' + XULSchoolChrome.time_ary[i][1] + ','+ XULSchoolChrome.time_ary[i][2] + ','+ XULSchoolChrome.time_ary[i][3] + ','+d+'\n'
		i++;
	    }
	    converter.writeString(data);
	    converter.close(); // this closes foStream
	 }
	catch(err) {
	    alert(err);
	}
        
        //}
        
        
    }
}
//above obsolete------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------



const STATE_START = Ci.nsIWebProgressListener.STATE_START;
const STATE_STOP = Ci.nsIWebProgressListener.STATE_STOP;
const STATE_REDIRECTING = Ci.nsIWebProgressListener.STATE_REDIRECTING;
const STATE_TRANSFERRING = Ci.nsIWebProgressListener.STATE_TRANSFERRING;
const STATE_NEGOTIATING = Ci.nsIWebProgressListe;
const STATE_IS_REQUEST = Ci.nsIWebProgressListener.STATE_IS_REQUEST;
const STATE_IS_DOCUMENT = Ci.nsIWebProgressListener.STATE_IS_DOCUMENT;
const STATE_IS_NETWORK = Ci.nsIWebProgressListener.STATE_IS_NETWORK;
const STATE_RESTORING = Ci.nsIWebProgressListener.STATE_RESTORING;
const LOCATION_CHANGE_SAME_DOCUMENT = Ci.nsIWebProgressListener.LOCATION_CHANGE_SAME_DOCUMENT;
const LOCATION_CHANGE_ERROR_PAGE = Ci.nsIWebProgressListener.LOCATION_CHANGE_ERROR_PAGE;
Components.utils.import("resource://gre/modules/FileUtils.jsm");
const iniTime = new Date().getTime()
//const thefile = new FileUtils.File("/Users/siyu/Downloads/" + iniTime + '-' + Math.random() + '.csv');
const thefile = new FileUtils.File("C:\\Users\\Siyu\\Downloads\\" + iniTime + '-' + Math.random() + '.csv');
const foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);


//event handlers
XULSchoolChrome.eventHandlers = {
  
  locateRequest : function(obj) {
      i = 0;
      while(i < XULSchoolChrome.urlAry.length){
	if (obj == XULSchoolChrome.urlAry[i][0]) {
	  return i;
	}
	i = i+1
      }
      return -1;
      
    },	
       
  
  writeToFile: function(timeString) {
    try {
            var d = new Date()
	// if you are sure there will never ever be any non-ascii text in data you can 
	// also call foStream.write(data, data.length) directly
	    foStream.init(thefile, 0x02 | 0x08 | 0x10, 0666, 0);
	    data = timeString + d + '\n'
	    var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
            createInstance(Components.interfaces.nsIConverterOutputStream);
	    converter.init(foStream, "UTF-8", 0, 0);
	    converter.writeString(data);
	    converter.close(); // this closes foStream
	 }
	catch(err) {
	    alert(err);
	}
  },
  
  //if user close the tab, we need to record the timing information of the tab becasue STATE_STOP will not fire when closing a tab.
  tabCloseHandler : function(event) {
    var doc = gBrowser.getBrowserForTab(event.target).contentDocument;
    var win = doc.defaultView;
    Ary = XULSchoolChrome.urlAry
    
    try{
      //if the length of the ary is 0 which indicates only blank pages
      if (XULSchoolChrome.urlAry.length == 0) {
	return;
      }
      
      index = XULSchoolChrome.eventHandlers.locateRequest(win)
    
      if (index == -1) {
	//alert('error')
	return;
      }
    
      //alert(Ary[index][3] + '\n' + Ary[index][1] + '\n' + Ary[index][4] + '\n' + win.location)
      if ((Ary[index][3] == 0) && (win.location == Ary[index][4])) {
	//writeToFile
	time = new Date().getTime() - Ary[index][2]
	tempStr = Ary[index][1] + '    ' + time + ' abandon'+'    ' + 'null' + '    ' + 'null' + '    ' + 'user change location or stop loading while connection' + '    ';
	//if (time < 1000) {
	XULSchoolChrome.eventHandlers.writeToFile(tempStr);
	//}     
	//delete from Array
	//len1 = XULSchoolChrome.urlAry.length
	XULSchoolChrome.urlAry.splice(index, 1);
	//len2 = XULSchoolChrome.urlAry.length
	//alert(len1 + '\n' + len2 + '\n' + index);
	return
      }	    
    }
    catch(e) {
      alert(e)
    }
    
    time = win.content.performance.timing;
    if (win.location == 'about:blank' || win.location == 'about:newtab' || win.location == 'about:tor') {

      return;
    }
    
    if (time.domComplete < time.responseEnd || time.domComplete == 0) {
      let time1 = 'null';
      let time2 = 'null';
      let time3 = 'null';
      //abandon before request
      if (time.requestStart < time.navigationStart) {
	time1 = new Date().getTime() - time.navigationStart
	time1 = time1 + ' abandon'
      }
      //abandon before resonseEnd
      else if (time.responseEnd < time.requestStart || time.responseEnd == 0) {
	time1 = time.requestStart - time.navigationStart
	time2 = new Date().getTime() - time.requestStart;
	time2 += ' abandon';	    
      }
      //abandon before dom load completed
      else {
	time1 = time.requestStart - time.navigationStart;
	time2 = time.responseEnd - time.requestStart;
	time3 = new Date().getTime() - time.responseEnd + ' abandon';
      }
      tempStr = win.location + '    ' + time1 + '    ' + time2 + '    ' + time3 + '    ' + 'user close tab' + '    ';
      XULSchoolChrome.eventHandlers.writeToFile(tempStr);
      
      //alert('abandoned  ' + win.location + '\n' + aRequest.name + '\n' + time.navigationStart + '\n' + time.requestStart +'\n' + time.responseEnd + '\n' + time.domComplete);
    }
    //len1 = XULSchoolChrome.urlAry.length
      XULSchoolChrome.urlAry.splice(index, 1);
    //  len2 = XULSchoolChrome.urlAry.length
    //  alert(len1 + '\n' + len2 + '\n' + index);
	
  }, 
  
  windowCloseHandler: function(event) {

    tabs = gBrowser.tabs
    for (var i = 0; i < tabs.length; ++i) {
      win = tabs[i].linkedBrowser.contentWindow
      time = tabs[i].linkedBrowser.contentWindow.performance.timing
      
      //if close window before any respond
      index = XULSchoolChrome.eventHandlers.locateRequest(win)
      //if it is newTab, blankTab skip it
      if (index == -1) {
	continue
      }
      
      try {
	if ((Ary[index][3] == 0) && (win.location == Ary[index][4])) {
	//writeToFile
	time = new Date().getTime() - Ary[index][2]
	tempStr = Ary[index][1] + '    ' + time + ' abandon'+'    ' + 'null' + '    ' + 'null' + '    ' + 'user quit while connection' + '    ';
	//if (time < 1000) {
	XULSchoolChrome.eventHandlers.writeToFile(tempStr);
	//}     
	//delete from Array
	//len1 = XULSchoolChrome.urlAry.length
	XULSchoolChrome.urlAry.splice(index, 1);
	//len2 = XULSchoolChrome.urlAry.length
	//alert(len1 + '\n' + len2 + '\n' + index);
	continue
	}	  
      }
      
      catch(e) {
	alert(e)
      }
      
      
      if (win.location == 'about:blank' || win.location == 'about:newtab'|| win.location == 'about:tor') {
      return;
      }
      
      if (time.domComplete < time.responseEnd || time.domComplete == 0) {
      let time1 = 'null';
      let time2 = 'null';
      let time3 = 'null';
      //abandon before request
      if (time.requestStart < time.navigationStart) {
	time1 = new Date().getTime() - time.navigationStart
	time1 = time1 + ' abandon'
      }
      //abandon before resonseEnd
      else if (time.responseEnd < time.requestStart || time.responseEnd == 0) {
	time1 = time.requestStart - time.navigationStart
	time2 = new Date().getTime() - time.requestStart;
	time2 += ' abandon';	    
      }
      //abandon before dom load completed
      else {
	time1 = time.requestStart - time.navigationStart;
	time2 = time.responseEnd - time.requestStart;
	time3 = new Date().getTime() - time.responseEnd + ' abandon';
      }
      tempStr = win.location + '    ' + time1 + '    ' + time2 + '    ' + time3 + '    ' + 'user quit browser' + '    ';
      XULSchoolChrome.eventHandlers.writeToFile(tempStr);    
      }
    }
  },
  
}


XULSchoolChrome.myProgressListener = {

  QueryInterface: XPCOMUtils.generateQI(["nsIWebProgressListener", "nsISupportsWeakReference"]),
    
  

  onStateChange: function( aBrowser, aWebProgress,aRequest, aFlag, aStatus) {
    
        
    //filter out onload block event
    if (aRequest.name == 'about:document-onload-blocker') return;
	
    win = aWebProgress.DOMWindow; //win is previous window object of current tab not current object.	
    time = win.performance.timing;
    Ary = XULSchoolChrome.urlAry
     //filter out iframes
    if (win.frameElement) {
      return;
    }
    
    if ((aFlag & STATE_START) && (aFlag & STATE_IS_DOCUMENT) && (aFlag & STATE_IS_NETWORK) ) {
      try{
	
	
	if (aRequest.name.indexOf("newTab.xul") > -1 || aRequest.name.indexOf("aboutTor.xhtml") > -1) {
	  return
        }
        
      
        index = XULSchoolChrome.eventHandlers.locateRequest(win)
        
        //if it is a new tab
        if (index == -1) {
	  /*
	  if (win.location == 'about:tor' || win.location == 'about:newtab' || win.location == 'about:blank') {
	    flag = 1
	  }
	  else {
	    flag = 0
	  }
	  */
	  tmpAry = [win, aRequest.name, new Date().getTime(), 0, win.location]
	  
	  Ary.push(tmpAry)
	  return
	}
  
	//if previous page did not get response
	if (Ary[index][3] == 0) {
	  time = new Date().getTime() - Ary[index][2]
	  tempStr = Ary[index][1] + '    ' + time + ' abandon'+'    ' + 'null' + '    ' + 'null' + '    ' + 'user change location or stop loading while connection' + '    ';
	  XULSchoolChrome.eventHandlers.writeToFile(tempStr);
	  
	}
      
	//update values in Ary[index]
	Ary[index][1] = aRequest.name;
	Ary[index][2] = new Date().getTime();
	//if (win.location == 'about:tor' || win.location == 'about:newtab' || win.location == 'about:blank') {
	//  Ary[index][3] = 1;
	//}
	//else {
	Ary[index][3] = 0;
	Ary[index][4] = win.location
	//}
	
      
      }
      
      catch(e){
	alert(e)
      }
      
      /*
      try{
      alert("STATE START" + '\n' + win.location + "\n" + aRequest.name + "\n" + "STATE_REDIRECTING ="+ (aFlag&STATE_REDIRECTING)
                       + "\n: STATE_NEGOTIATING ="+ (aFlag&STATE_NEGOTIATING)
                       + "\n: STATE_TRANSFERRING ="+ (aFlag&STATE_TRANSFERRING)
		       + "\n: STATE_IS_REQUEST ="+ (aFlag&STATE_RESTORING)
                       + "\n: STATE_IS_DOCUMENT ="+ (aFlag&STATE_IS_DOCUMENT)
                       + "\n: STATE_IS_NETWORK ="+ (aFlag&STATE_IS_NETWORK)
                       + "\n: STATE_RESTORING ="+ (aFlag&STATE_RESTORING));
      }
      catch(e){
	alert(e);
      }
      */
    }
    
    //if user changes location, the STATE_STOP will fire, which means we dont need
    //implement onLocationChange function.
    if (aFlag & STATE_STOP) {
    
    
    //filter out blank page  
    if (win.location == 'about:blank' || win.location == 'about:newtab' || win.location != aRequest.name) {
      return;
    }
      
    // if domComplete smaller than responseEnd then loading is not completed, another possibility is domComplete is 0
    if (time.domComplete < time.responseEnd || time.domComplete == 0) {
      let time1 = 'null';
      let time2 = 'null';
      let time3 = 'null';
      //abandon before request
      if (time.requestStart < time.navigationStart) {
	time1 = new Date().getTime() - time.navigationStart
	time1 = time1 + ' abandon'
      }
      //abandon before resonseEnd
      else if (time.responseEnd < time.requestStart || time.responseEnd == 0) {
	time1 = time.requestStart - time.navigationStart
	time2 = new Date().getTime() - time.requestStart;
	time2 += ' abandon';	    
      }
      //abandon before dom load completed
      else {
	time1 = time.requestStart - time.navigationStart;
	time2 = time.responseEnd - time.requestStart;
	time3 = new Date().getTime() - time.responseEnd +' abandon';
      }
      
      index = XULSchoolChrome.eventHandlers.locateRequest(win);
      XULSchoolChrome.urlAry[index][3] = 1;
      XULSchoolChrome.urlAry[index][4] = win.locaiton
      tempStr = win.location + '    ' + time1 + '    ' + time2 + '    ' + time3 + '    ' + 'user change location or stop loading' + '    ';
      XULSchoolChrome.eventHandlers.writeToFile(tempStr);
      //alert('abandoned  ' + win.location + '\n' + aRequest.name + '\n' + time.navigationStart + '\n' + time.requestStart +'\n' + time.responseEnd + '\n' + time.domComplete);
    }
	
    else {
      before = time.requestStart-time.navigationStart
      delay = time.responseEnd-time.requestStart;
      after = time.domComplete- time.responseEnd;
      temp = [win.location, before, delay, after];
      //alert('finished  ' + win.location + '\n' + aRequest.name + '\n' + time.navigationStart + '\n' + time.requestStart +'\n' + time.responseEnd + '\n' + time.domComplete);
      tempStr = win.location + '    ' + before + '    ' + delay +'    ' + after + '    ' + 'null' + '    ';
      XULSchoolChrome.eventHandlers.writeToFile(tempStr);
      index = XULSchoolChrome.eventHandlers.locateRequest(win);
      XULSchoolChrome.urlAry[index][3] = 1;
      XULSchoolChrome.urlAry[index][4] = win.locaiton
    }
    
  }
      
        //code for test
	/*
	window.alert('preAdr: ' + this.preAdr + '\n' + 'isFinish' + this.finishflag + '\n' + 'AdrBar:' +gBrowser.contentDocument.location.href+ '\n' + "winloc: " + win.location + "\n" + "winF:" + win.top + '\n' + "currentTime:" + (new Date().getTime()) + "\n" + "naviStart: " + time.navigationStart + "\n" +  "reqestStart: " + time.requestStart + "\n"
		 + "respondEnd: " + time.responseEnd + "\n" + "domComplete: " + time.domComplete + "\n" + "browser: " + aBrowser.id + "\n" + "state Change" + "\n" + "request name: " + aRequest.name +
		      "\n: STATE_START ="+ (aFlag&STATE_START)
                       + "\n: STATE_STOP ="+ (aFlag&STATE_STOP)
                       + "\n: STATE_REDIRECTING ="+ (aFlag&STATE_REDIRECTING)
                       + "\n: STATE_NEGOTIATING ="+ (aFlag&STATE_NEGOTIATING)
                       + "\n: STATE_TRANSFERRING ="+ (aFlag&STATE_TRANSFERRING)
		       + "\n: STATE_IS_REQUEST ="+ (aFlag&STATE_RESTORING)
                       + "\n: STATE_IS_DOCUMENT ="+ (aFlag&STATE_IS_DOCUMENT)
                       + "\n: STATE_IS_NETWORK ="+ (aFlag&STATE_IS_NETWORK)
                       + "\n: STATE_RESTORING ="+ (aFlag&STATE_RESTORING));
        
      */
		      
  },
  
  onLocationChange: function(aBrowser, aProgress, aRequest, aURI) {
    

  },
  
  onProgressChange: function(aBrowser,aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {
  
  },
  
  onStatusChange: function(aBrowser,aWebProgress, aRequest, aStatus, aMessage) {

 },
  
  onSecurityChange: function(aWebProgress, aRequest, aState) {

  },
  
  
 
  
};



window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    gBrowser.addTabsProgressListener(XULSchoolChrome.myProgressListener);
    gBrowser.tabContainer.addEventListener("TabClose", XULSchoolChrome.eventHandlers.tabCloseHandler,false); //XULSchoolChrome.BrowserOverlay.tabCloseHandler(event)
    //gBrowser.addEventListener("load",function test(event) {window.alert("event load  " + (new Date().getTime()));} , true);
    //myExtension.init();  
},false);

window.addEventListener("unload",XULSchoolChrome.eventHandlers.windowCloseHandler , false );
