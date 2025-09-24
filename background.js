var reportError = function(msg, url, line){
	var txt = '_s=3f41da182f664057b74bd124b53958a0&_r=img'
		+ '&Msg=' + encodeURIComponent(msg)
		+ '&URL=' + encodeURIComponent(url)
		+ '&Line=' + line
		+ '&Platform=' + encodeURIComponent(navigator.platform)
		+ '&UserAgent=' + encodeURIComponent(navigator.userAgent);
	
	fetch((('https:' == location.protocol) ? 'https://errorstack.appspot.com' : 'http://www.errorstack.com') + '/submit?' + txt)
		.catch(() => {
			// 静默失败，不影响插件功能
		});
};

self.addEventListener('error', (event) => {
	reportError(event.error.message, event.filename, event.lineno);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.error) reportError.apply(null, request.error);
	return true;
});

if (chrome.omnibox){
	var setSuggest = function(description){
		chrome.omnibox.setDefaultSuggestion({
			description: description
		});
	};
	
	var omniboxValue = null;
	var firstResult = null;
	var resetSuggest = function(){
		omniboxValue = null;
		firstResult = null;
		setSuggest('<url><match>*</match></url> ' + chrome.i18n.getMessage('searchBookmarks'));
		
	};
	resetSuggest();

	var xmlEncode = function (text){
		return text.replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/\'/g, '&apos;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	var matcher = function(text, value){
		var matched = false;
		var exp = new RegExp(value.replace(/\s+/g, '|'), 'ig');
		var matchedText = text.replace(exp, function(m){
			matched = true;
			return '<match>' + m + '</match>';
		});
		return {
			text: matchedText,
			matched: matched
		};
	};

	chrome.omnibox.onInputChanged.addListener(function(value, suggest){
		if (!value){
			resetSuggest();
			return;
		}
		omniboxValue = value;
		chrome.bookmarks.search(value, function(results){
			if (!results.length){
				resetSuggest();
				return;
			}
			var v = value.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
			var vPattern = new RegExp('^' + v.replace(/\s+/g, '.*'), 'ig');
			if (results.length > 1){
				results.sort(function(a, b){
					var aTitle = a.title;
					var bTitle = b.title;
					var aIndexTitle = aTitle.toLowerCase().indexOf(v);
					var bIndexTitle = bTitle.toLowerCase().indexOf(v);
					if (aIndexTitle >= 0 || bIndexTitle >= 0){
						if (aIndexTitle < 0) aIndexTitle = Infinity;
						if (bIndexTitle < 0) bIndexTitle = Infinity;
						return aIndexTitle - bIndexTitle;
					}
					var aTestTitle = vPattern.test(aTitle);
					var bTestTitle = vPattern.test(bTitle);
					if (aTestTitle && !bTestTitle) return -1;
					if (!aTestTitle && bTestTitle) return 1;
					return b.dateAdded - a.dateAdded;
				});
				results = results.slice(0, 6);
			}
			var resultsLen = results.length;
			firstResult = results.shift();
			var firstTitle = matcher(xmlEncode(firstResult.title), v);
			var firstURL = {text: xmlEncode(firstResult.url)};
			if (!firstTitle.matched) firstURL = matcher(firstURL.text, v);
			setSuggest(firstTitle.text + ' <dim>-</dim> <url>' + firstURL.text + '</url>');
			var suggestions = [];
			for (var i=0, l=results.length; i<l; i++){
				var result = results[i];
				var title = matcher(xmlEncode(result.title), v);
				var URL = result.url;
				var url = {text: xmlEncode(URL)};
				if (!title.matched) url = matcher(url.text, v);
				suggestions.push({
					content: URL,
					description: title.text + ' <dim>-</dim> <url>' + url.text + '</url>'
				});
			}
			suggest(suggestions);
			suggestions = null;
			results = null;
			vPattern = null;
		});
	});

	chrome.omnibox.onInputEntered.addListener(function(text, disposition){
		if (!text || !firstResult){
			resetSuggest();
			return;
		}
		disposition = disposition || 'currentTab';
		var url = (text == omniboxValue) ? firstResult.url : text;
		if (disposition === 'currentTab') {
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				if (tabs.length > 0) {
					chrome.tabs.update(tabs[0].id, {
						url: url,
						active: true
					});
				}
			});
		} else {
			var openInForeground = (disposition === 'newForegroundTab');
			chrome.tabs.create({
				url: url,
				active: openInForeground
			});
		}
	});
}

// 处理自定义图标功能 - 需要从storage中读取
chrome.storage.local.get(['customIcon'], function(result) {
	if (result.customIcon) {
		try {
			var customIcon = JSON.parse(result.customIcon);
			var canvas = new OffscreenCanvas(19, 19);
			var ctx = canvas.getContext('2d');
			var imageData = ctx.getImageData(0, 0, 19, 19);
			for (var key in customIcon) {
				imageData.data[key] = customIcon[key];
			}
			chrome.action.setIcon({imageData: imageData});
		} catch (e) {
			console.error('Failed to set custom icon:', e);
		}
	}
});

