		//torrent hash = e4a99faf39871cb5567cf83661a7d6415d1396a2
		//default btc address = 1DhDyqB4xgDWjZzfbYGeutqdqBhSF7tGt4


		var CONFIG = {
			magnetBase: 'magnet:?dn=index.html&tr=udp%3A%2F%2Fexodus.desync.com%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.internetwarriors.net%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&xt=urn:btih:'
			,bitcoin: "" //if null will get the torrent directly
			,torrent: "d1b337a3ad172cc0537233634ad6afa9b6fd68c3"//will be used only if bitcoin = NULL
		}





		var getPath = function(){


			var plocation = window.location.href.split("?page=")[1];//address #page.htm;

			if(plocation == null){

				plocation = "index.html";

			}
			return plocation;

		}

		var getTorrentHash = function(btcAddress){
			$.get('https://blockexplorer.com/api/txs/?address=' + btcAddress).then(function(data) {
			for (var i = 0; i < data.txs.length; i++) {
				if (data.txs[i].vin.length > 0 && data.txs[i].vin[0].addr === btcAddress) {
					for (var j = 0; j < data.txs[i].vout.length; j++) {
						var scriptPubKey = data.txs[i].vout[j].scriptPubKey.asm
						if (scriptPubKey.indexOf('OP_RETURN') !== -1) {
							// extract webpage torrent info hash
							return scriptPubKey.split(' ').slice(-1)[0];
						}
					}
				}
			}

			})

		}
		var findTorrent = function(ttorrent,pathh){

			for (i=0;i<= ttorrent.files.length;i++){

				if (ttorrent.files[i].name == pathh){
				return ttorrent.files[i];

			}
		}

		}
		var getMagnet = function(CONFIG){

			if(!CONFIG.bitcoin){
				return CONFIG.magnetBase + CONFIG.torrent;
			}
			else{
				return CONFIG.magnetBase + getTorrentHash(CONFIG.bitcoin);
			}
		}

		var magnet = getMagnet(CONFIG);


		var getPage = function(){

			var path = getPath();


			var client = new WebTorrent()
			client.add(magnet, function(torrent) {

			var file = findTorrent(torrent,path);


				file.getBuffer(function(err, buffer) {
					// overwrite current page with new HTML
					document.open()
					document.write(buffer.toString())
					document.close()
				})
			})

		}

		var getItem = function(id,imagePath){
			//ex getImage("#pic","logo.png");


			var client = new WebTorrent()
			client.add(magnet, function(torrent) {
			var file = findTorrent(torrent,imagePath);

			file.appendTo(id, function (err, elem) {
 				 if (err) throw err // file failed to download or display in the DOM
			})

			})

		}



		var getCss = function(path){
			//ex getImage("#pic","logo.png");


			var client = new WebTorrent()
			client.add(magnet, function(torrent) {

			var file = findTorrent(torrent,path);

				file.getBlobURL(function (err, url) {
  				if (err) throw err
  				// <link rel="stylesheet" type="text/css" href="mystyle.css">

    			var head  = document.getElementsByTagName('head')[0];
    			var link  = document.createElement('link');
   				 link.rel  = 'stylesheet';
   				 link.type = 'text/css';
   				 link.href = url;
   				 head.appendChild(link);


				})


			})

		}

		var getJs = function(path){
			//ex getImage("#pic","logo.png");


			var client = new WebTorrent()
			client.add(magnet, function(torrent) {

			var file = findTorrent(torrent,path);

				file.getBlobURL(function (err, url) {
  				if (err) throw err
  				// <link rel="stylesheet" type="text/css" href="mystyle.css">

    			var body  = document.getElementsByTagName('body')[0];
    			var script  = document.createElement('script');
   			    script.src = url;
   				body.prependChild(script);


				})


			})

		}
	$(document).ready(function() {


		getPage();

	})
