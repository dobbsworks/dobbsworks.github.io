


/////////////////////////////////////////////////
// MARQUEE PANEL
/////////////////////////////////////////////////
function CreateMarqueeWindow() {
	let w = window.open("", "Marquee", "width=850,height=53,top=1000");
	
	let request = new XMLHttpRequest();
	let url = "https://dobbsworks.github.io/Tools/Streambot/marquee.html?q=" + (+(new Date()));
	request.open("GET", url, true);
	request.onload = () => {
		w.document.write(request.responseText);
		setTimeout(() => {
			w.window.init();
			w.window.SetScrollItems(StorageHandler.ticker.values);
		}, 500);
	}
	request.send();
	return w;
}

function CommandTickerAdd(user, args) {
	let newText = args.join(' ');
	StorageHandler.ticker.push(newText);
	UpdateTickerItems();
	return "Ticker item registered.";
}
function CommandTickerList(user, args) {
	let itemList = StorageHandler.ticker.values;
	let requestedIndex = +(args[0]);
	if (requestedIndex)  {
		let item = itemList[requestedIndex-1];
		return "Ticker item text: " + item;
	} else {
		return "Run this command with a number from 1 to " + itemList.length.toString() + " to get that item's text.";
	}
}
function CommandTickerRemove(user, args) {
	if (isNaN(+(args[0]))) return "Usage: !tickerRemove itemNum"
	let itemList = StorageHandler.ticker.values;
	let itemNum = +(args[0]) - 1;
	itemList.splice(itemNum, 1);
	StorageHandler.ticker = itemList;
	UpdateTickerItems();
	return "Item removed.";
}
function UpdateTickerItems() {
	marqueeWindow.window.SetScrollItems(StorageHandler.ticker.values);
}