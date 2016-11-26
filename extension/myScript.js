
/**
 * @file myScript.js
 * Script to analyze Facebook feed and make connection with the server ;
 *
 * @author Mark Craft, Qinglin Chen
 * @date Fall 2016
 */

var feeds = new Set();

(function(document) {

/**
 * Http request to fbserve.herokuapp.com.
 *
 * @param the text or url to send to the server.
 */
function httpGet(input, type, data) {

//	var server = "https://fbserve.herokuapp.com/";
    var server = "http://localhost:5000";
	var contents = "?content=";
	
	var page;
	console.log("GET TYPE -> " + type + " RAW INPUT -> " + input)
	if((type == "url" || type == "image") && input != undefined) {
	    page = decode(input);
//	else page = input;

	//page.replace("http:", "http://");

    //debugger;
        console.log(page);

        var theUrl = server + contents + page;
        theUrl = theUrl.replace("&", "^");

        fetch(theUrl)
            .then(function(res)
            { return res.text(); })
            .then(function(text)
            {
                    var div = document.createElement('div'),
                        button = Ladda.create(div);

                    btn.style = "front-weight:bold; padding: 3px; position:absolute; top: 4px; right: 30px;background: #3b5998; font-size: 15px;";

                    if(text=="verified") {
                        div.innerHTML = "verified";
                        btn.style.color = "#D5F5E3";
                    }
                    else {
                        div.innerHTML = "not verified";
                        btn.style.color = "#E74C3C";
                    }

                    data.appendChild(div);
            });
    }
}

/*
 * Parse through Facebook's encoded url for the actual url
 *
 */
function decode(code) {

	var res = "" + code;
	res = res
		.replace("http://l.facebook.com/l.php?u=", "")
		.replace(/%3A/gi, ":")
		.replace(/%F/gi, "/")
		.replace(/%2F/gi, "/");

	var end = res.substr(res.indexOf("^h"), res.length);
	res = res.replace(end, "");
	var end2 = res.substr(res.indexOf("&"), res.length);
	res = res.replace(end2, "");

	//console.log(res);

	return res;
}  

/**
 * Receive each Facebook post and analyze texts, urls, pics for validity.
 * Refreshes every second.
 *
 */
setInterval(function() {
	
	var test = document.getElementsByClassName('_4-u2 mbm _5v3q _4-u8');

	for(var i=0; i<test.length; i++) {

		var data = test[i];

		// Check if feed needs to be modified

		if(!feeds.has(data)) {
			feeds.add(data);

			// Send server requests

			var statement = "";

			var processed = false;

			
			var linked = test[i].querySelector('._6ks');
			if(!processed && linked != null && linked.querySelector('a')!=undefined) {
				//console.log(linked.querySelector('a'));
				processed = true;
				httpGet(linked.querySelector('a').href, "url", data);
			}

	
			var link = test[i].querySelector('._5pbx.userContent');
			if(!processed && link != null && link.querySelector('a') != null && link.querySelector('a').href!=undefined) {
				//console.log(link);
				processed = true;
				httpGet(link.href, "url", data);
			}
            

			var picComment = test[i].querySelector('.uiScaledImageContainer._4-ep');

			if(!processed && picComment != null && picComment.querySelector('img') != undefined && picComment.querySelector('img').src!=undefined) {

				//console.log(picComment);
				processed = true;
				httpGet(picComment.querySelector('img').src, "image", data);
			}

			var picPost = test[i].querySelector('._46-h._517g');
			if(!processed && picPost != null  &&  picPost.querySelector('img') != undefined && picPost.querySelector('img').src!=undefined) {
				//console.log(picPost);
				processed = true;
				httpGet(picPost.querySelector('img').src, "image", data);
			}

			var picTagged = test[i].querySelector('._4-eo._2t9n');
 			if(!processed && picTagged != null && picTagged.querySelector('._46-h._4-ep') != undefined && picTagged.querySelector('._46-h._4-ep').querySelector('img') != undefined) {
 				processed = true;
 				httpGet(picTagged.querySelector('._46-h._4-ep').querySelector('img').src, "image", data);
 			}
			
			var text = test[i].querySelector('._5pbx.userContent');
			if(!processed && text != null && text.textContent!=undefined) {
				//console.log(text);
				processed = true;
				httpGet(text.textContent, "text", data);
			}
	
		} else {
			//console.log("have feed");
		}
	}

}, 1000);
	
})(document);
