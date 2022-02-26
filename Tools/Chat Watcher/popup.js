let launchButton = document.getElementById('launch');

launchButton.onclick = function (element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {
                code: `
				
let userUrl = window.location.href.split("user/")[1] || "";
let streamerName = userUrl.split("/")[0] || "dobbsworks";

let checkTimes = [];
let chatterData = [];
let flags = ["hide", "highlight", "known"];

function SetUpPage() {
	document.body.innerHTML = '<table><tbody></tbody></table>';
	document.body.innerHTML += '<div class ="help">Shift-click a row to mark "known". Unknown users have a square to the left of their name.</div>'
	document.body.innerHTML += '<div class ="help">Ctrl-click a row to toggle "hidden". Hidden users are dropped to the end of the list and faded out.</div>'
	document.body.innerHTML += '<div class ="help">Alt-click a row to toggle "highlight".</div>'
	let bgColor = "#123038";
	AddStylesheetRules([
		['body',
			['background-color', bgColor],
			['color', '#d0d0d0'],
		],
		['table',
			['border-collapse', 'collapse'],
			['margin-bottom', '10px']
		],
		['tr',
			['position', 'relative'],
		],
		['td:first-child',
			['padding-left', '20px'],
		],
		['td:first-child::after',
			['display', 'block'],
			['content', "' '"],
			['width', '10px'],
			['height', '10px'],
			['background-color', '#00f8ff'],
			['position', 'absolute'],
			['top', '5px'],
			['left', '5px'],
		],
		['help', 
			['opacity', '0.7']
		],
		['.timelineStatus',
			['border', '1px solid ' + bgColor],
			['padding', '1px 0'],
			['width', '3px']
		],
		['.timelineStatus.online',
			['background-color', 'lime']
		],
		['.timelineStatus.offline',
			['background-color', '#DDD']
		],
		['tr.offline',
			['opacity', '0.3']
		],
		['a',
			['color', 'unset']
		],
		['.category-broadcaster',
			['font-weight', 'bold'],
		],
		['.category-vips',
			['color', 'green'],
		],
		['.category-moderators',
			['color', '#8686ff'],
		],
		['.category-staff',
			['color', 'red'],
		],
		['.category-admins',
			['color', 'red'],
		],
		['.category-global_mods',
			['color', 'red'],
		],
		['.flag-hide',
			['opacity', '0.1', true]
		],
		['.flag-highlight',
			['background-color', '#ffff0047'],
		],
		['.flag-known td:first-child::after',
			['display', 'none'],
		],
		['tr:hover',
			['opacity', '1']
		],
		['td:nth-child(5n+6)',
			['filter', 'brightness(0.85)']
		],
		['td:nth-child(15n+16)',
			['filter', 'brightness(0.7)']
		],
		['td:nth-child(60n+61)',
			['filter', 'brightness(0.5)']
		],
		
	]);
}

function RequestChatters() {
	setTimeout(RequestChatters, 1000 * 60);
    let request = new XMLHttpRequest();
	let url = "https://tmi.twitch.tv/group/user/" + streamerName.toLowerCase() + "/chatters";
	request.open("GET", url, true);
	request.onload = () => {
		let response = JSON.parse(request.responseText)
		let chattersObj = response.chatters;
		let categories = Object.keys(chattersObj);
		let onlineNow = [];
		for (let category of categories) {
			let chatters = chattersObj[category];			
			for (let chatter of chatters) {
				onlineNow.push(chatter);
				let chatterRecord = chatterData.find(a => a.username === chatter);
				if (!chatterRecord) {
					chatterRecord = {
						username: chatter, 
						onlineTimeline: [],
						category: category
					};
					chatterData.push(chatterRecord);
				}
				chatterRecord.category = category;
				
			}
		}
			
		for (let chatterRecord of chatterData) {
			let isOnline = onlineNow.indexOf(chatterRecord.username) > -1;
			chatterRecord.onlineTimeline.push(isOnline);
		}
		checkTimes.push(new Date());
		IncrementTable();
	}
	request.send();
}

function IncrementTable() {
	let table = document.getElementsByTagName("table")[0];
	for (let chatterRecord of chatterData) {
		let username = chatterRecord.username;
		let chatterRow = Array.from(table.rows).find(a => a.cells[0].innerText === username);
		if (!chatterRow) {
			chatterRow = table.insertRow();
			if (table.rows[1]) {
				let cellsToBackfill = table.rows[0].cells.length - 2;
				for (let i = 0; i < cellsToBackfill; i++) {
					let oldCell = chatterRow.insertCell();
					oldCell.classList.add("timelineStatus");
					oldCell.classList.add("offline");
					oldCell.dataset.username = username;
				}
			}
			let cell = chatterRow.insertCell(0);
			cell.dataset.username = username;
			cell.innerHTML = '<a href="https://twitch.tv/' + username + '" target="_blank">' + username + '</a>';
			chatterRow.classList.add("category-" + chatterRecord.category);
			chatterRow.onclick = OnClickRow;
		}
		let timeline = chatterRecord.onlineTimeline;
		let isOnline = timeline[timeline.length - 1];
		let newCell = chatterRow.insertCell(1);
		newCell.dataset.username = username;
		newCell.classList.add("timelineStatus");
		newCell.classList.add(isOnline ? "online" : "offline");
		
	}
	RefreshTable();
}

function RefreshTable() {
	let table = document.getElementsByTagName("table")[0];
	for (let chatterRecord of chatterData) {
		let username = chatterRecord.username;
		let chatterRow = Array.from(table.rows).find(a => a.cells[0].innerText === username);
		let timeline = chatterRecord.onlineTimeline;
		let isOnline = timeline[timeline.length - 1];
		
		for (let flag of flags) {
			if (IsUserFlagged(username, flag) ) {
				chatterRow.classList.add("flag-" + flag);
				if (flag === "hide") chatterRow.parentNode.insertBefore(chatterRow, null);
			} else {
				chatterRow.classList.remove("flag-" + flag);
			}
		}
		
		if (isOnline) {
			chatterRow.classList.remove("offline");
			chatterRow.classList.add("online");
		} else {
			chatterRow.classList.remove("online");
			chatterRow.classList.add("offline");
		}
	}
}

function AddStylesheetRules(rules) {
	var styleEl = document.createElement('style');
	document.head.appendChild(styleEl);
	var styleSheet = styleEl.sheet;
	for (var i = 0; i < rules.length; i++) {
		var j = 1,
			rule = rules[i],
			selector = rule[0],
			propStr = '';
		if (Array.isArray(rule[1][0])) {
			rule = rule[1];
			j = 0;
		}
		for (var pl = rule.length; j < pl; j++) {
			var prop = rule[j];
			propStr += prop[0] + ': ' + prop[1] + (prop[2] ? ' !important' : '') + ';\\n';
		}
		styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
	}
}

function IsUserFlagged(username, flag) {
	let flaggedUsers = JSON.parse(localStorage["user-" + flag] || "[]");
	return flaggedUsers.indexOf(username) > -1;
}

function OnClickRow(e) {
	let isShift = e.shiftKey;
	let isAlt = e.altKey;
	let isCtrl = e.ctrlKey;
	if (e.target && (isCtrl || isAlt || isShift)) {
		let el = e.target;
		if (e.target.tagName.toLowerCase() === "a" ) {
			e.preventDefault();
			el = el.parentNode;
		}
		let targetUser = el.dataset.username;
		let flag = "hide"
		if (isAlt) flag = "highlight";
		if (isShift) flag = "known";
		
		let flagged = IsUserFlagged(targetUser, flag);
		
		let confirmMessage = (flagged ? "Clearing" : "Setting") + ' flag "' + flag + '" on user ' + targetUser + '. Proceed?';
		let okToMark = confirm(confirmMessage);
		if (okToMark) ToggleUserFlag(targetUser, flag);
			
	}
	if (isShift) e.preventDefault();
}


function ToggleUserFlag(username, flag) {
	let flaggedUserText = localStorage["user-" + flag];
	let flaggedUsers = JSON.parse(flaggedUserText || "[]");
	if (flaggedUsers.indexOf(username) === -1) {
		flaggedUsers.push(username);
	} else {
		flaggedUsers = flaggedUsers.filter(a => a !== username);
	}
	localStorage["user-" + flag] = JSON.stringify(flaggedUsers);
	RefreshTable();
}

SetUpPage();
RequestChatters();


//var scriptTag = document.createElement('script');
//var cacheBreaker = (+(new Date()));
//scriptTag.src = 'https://dobbsworks.github.io/Tools/Streambot/StreamHelper.js?q=' + cacheBreaker;
//document.body.appendChild(scriptTag);
            ` });
    });
};