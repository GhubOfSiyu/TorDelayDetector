   if ("undefined" == typeof(XULSchoolWindow)) {
  var XULSchoolWindow = {};
};

let ads = new Array();

XULSchoolWindow.alter = {
    
    onLoad: function(aEvent) {
        win = window.opener;
	let time_ary = win.XULSchoolChrome.time_ary;
	let sum_time = 0;
	let i = 0;
	let sum1 = 0;
	let sum2 = 0;
	let sum3 = 0;
	
	let list_box = document.getElementById('delay_list');
	
	
	
	
	while (i < time_ary.length) {
	let child1 = document.createElement('listcell');
	let child2 = document.createElement('listcell');
	let child3 = document.createElement('listcell');
	let child4 = document.createElement('listcell');
	child1.setAttribute('label', time_ary[i][0]);
	child2.setAttribute('label', time_ary[i][1]);
	child3.setAttribute('label', time_ary[i][2]);
	child4.setAttribute('label', time_ary[i][3]);
	
	let item = document.createElement('listitem');
	item.appendChild(child1);
	item.appendChild(child2);
	item.appendChild(child3);
	item.appendChild(child4);
	
	list_box.appendChild(item);
	sum1 += time_ary[i][1];
	sum2 += time_ary[i][2];
	sum3 += time_ary[i][3];
	
	i++;
	}
	
	d1 = document.getElementById("be");
	d2 = document.getElementById("in");
	d3 = document.getElementById("af");
        d1.setAttribute('value', ' The average dealy time of pre-processing is: ' + Math.floor(sum1/i));
	d2.setAttribute('value', ' The average dealy time of network is: ' + Math.floor(sum2/i));
	d3.setAttribute('value', ' The average dealy time of local-processing is: ' + Math.floor(sum3/i));
	
	
      
       
    },
    
    SaveFile: function() {
	let time_ary = win.XULSchoolChrome.time_ary;
	var d = new Date();
	/*
	var nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, "Select a File", nsIFilePicker.modeSave);
	var res = fp.show();
	if (res != nsIFilePicker.returnCancel){
	var thefile = fp.file;
	 */
	Components.utils.import("resource://gre/modules/FileUtils.jsm");

	thefile = new FileUtils.File("/Users/siyu/Downloads/1.csv");
	 
	 try {
	    
	    
	 // --- do something with the file here ---
	    var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
            createInstance(Components.interfaces.nsIFileOutputStream);

	    foStream.init(thefile, 0x02 | 0x08 | 0x20, 0666, 0); 
    

	// if you are sure there will never ever be any non-ascii text in data you can 
	// also call foStream.write(data, data.length) directly
	    var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].
            createInstance(Components.interfaces.nsIConverterOutputStream);
	    converter.init(foStream, "UTF-8", 0, 0);
	    let i = 0;
	    var data = "domain_name,pre-processing,network,post-processing,date\n";
	    while (i < time_ary.length) {
		data += '' + time_ary[i][0] + ',' + time_ary[i][1] + ','+ time_ary[i][2] + ','+ time_ary[i][3] + ','+d+'\n'
		i++;
	    }
	    converter.writeString(data);
	    converter.close(); // this closes foStream
	 }
	catch(err) {
	    d1 = document.getElementById("be");
	    d1.setAttribute('value', ' The average dealy time of pre-processing is:'+err)
	}
	//}
    }
};

window.addEventListener("load", function(aEvent) {XULSchoolWindow.alter.onLoad(aEvent);}, false);
