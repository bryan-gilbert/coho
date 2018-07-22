var monthsAsAssoc = 4;
var founders = 11;
var assocToEquityRatio = 3;
var data = {
	inx:-1,
	months: [], cnts: [],
	equity: [],
	assoc:[]};
data.totalEquity = founders;


$(document).ready(function () {
	initMonth(data,"Mar 18","mar18",0);
	initMonth(data,"Apr 18","apr18",0);
	initMonth(data,"May 18","may18",0);
	initMonth(data,"Jun 18","jun18",0);
	initMonth(data,"Jul 18","jul18",1);
	initMonth(data,"Aug 18","aug18",2);
	initMonth(data,"Sep 18","sep18",0);
	initMonth(data,"Oct 18","oct18",0);
	initMonth(data,"Nov 18","nov18",0);
	initMonth(data,"Dec 18","dec18",1);
	initMonth(data,"Jan 19","jan19",1);
	initMonth(data,"Feb 19","feb19",1);
	initMonth(data,"Mar 19","mar19",1);
	initMonth(data,"Apr 19","apr19",2);
	initMonth(data,"May 19","may19",2);
	initMonth(data,"Jun 19","jun19",2);
	initMonth(data,"Jul 19","jul19",0);

	updateAll();
});

function initMonth(data,mTitle, mKey, newEquityCnt) {
	data.inx++;
	data.months.push({
		inx : data.inx,
		mTitle: mTitle,
		mKey: mKey
	});
	data.cnts.push(newEquityCnt);
	/*
	data.totalEquity = data.totalEquity + newEquityCnt;
	data.equity.push({
		newEquityCnt : newEquityCnt,
			equityToDate : data.totalEquity
	});
	data.assoc.push({
		amList: [], newAssocCnt: 0, forMonth: {}
	});
	if(newEquityCnt>0) {
		var neededAMs = newEquityCnt * assocToEquityRatio;
		// step back X months
		var amJoinMonthInx = data.inx - monthsAsAssoc;
		amJoinMonthInx = amJoinMonthInx < 0 ? 0 : amJoinMonthInx;
		var month = data.months[data.inx];
		var mKey = month.mKey;
		// work with the record from X months ago
		var am = data.assoc[amJoinMonthInx];
		am.newAssocCnt = neededAMs;
		am.forMonth = month;
		// add the needed AMs to each month starting from X months ago up to current month less one
		for(var i =amJoinMonthInx; i < data.inx; i++){
			data.assoc[i].amList.push({
				mKey : mKey, cnt: neededAMs
			});
		}
	}
	*/
}

function changeRatio(event) {
	var val = event.target.value;
	assocToEquityRatio = val;
	updateAll();
}

function changeMonthsAsAssociate(event){
	var val = event.target.value;
	monthsAsAssoc = val;
	updateAll();
}
function changeEquities(event) {
	var id = event.target.id;
	var m = id.split("_")[1];
	var val = event.target.value;

	console.log("changeEquities all", m, val);
	data.cnts[m] = val;
	updateAll();
}

function updateAll() {
	$("#monthsAsAssoc").text(monthsAsAssoc);
	$("#assocToEquityRatio").text(assocToEquityRatio);

	$("#input_monthsAsAssoc").val(monthsAsAssoc);
	$("#input_assocToEquityRatio").val(assocToEquityRatio);

	setupData();
	computeBuddlessEquities(data);
	var html=[];
	for(var i=0; i < data.equity.length;i++) {
		oneLadder(html,data,i);
	}
	$("#ladderContainer").html(html.join('\n'));
}


function setupData() {
	data.totalEquity=founders;
	data.equity = [];
	data.assoc = [];
	for(var m=0;m<data.months.length;m++) {
		var month = data.months[m];
		var newEquityCnt = 1* data.cnts[m];
		data.totalEquity = data.totalEquity + newEquityCnt;
		var newE = {
			newEquityCnt : newEquityCnt,
			equityToDate : data.totalEquity
		};
		data.equity.push(newE);
		console.log("setup e", m, newE);
		data.assoc.push({
			amList: [], newAssocCnt: 0, forMonth: {}
		});
		if(newEquityCnt>0) {
			var neededAMs = newEquityCnt * assocToEquityRatio;
			// step back X months
			var amJoinMonthInx = m - monthsAsAssoc;
			amJoinMonthInx = amJoinMonthInx < 0 ? 0 : amJoinMonthInx;
			var amMonth = data.months[m];
			var mKey = amMonth.mKey;
			// work with the record from X months ago
			var am = data.assoc[amJoinMonthInx];
			am.newAssocCnt = neededAMs;
			am.forMonth = amMonth;
			// add the needed AMs to each month starting from X months ago up to current month less one
			for(var i =amJoinMonthInx; i < m; i++){
				data.assoc[i].amList.push({
					mKey : mKey, cnt: neededAMs
				});
			}
		}
	}
}


function computeBuddlessEquities(data) {
	var months = data.months;
	for(var i = 0; i< months.length; i++ ) {
		var equity = data.equity[i];
		var assoc = data.assoc[i];
		var ams= 0;
		for(var j=0; j< assoc.amList.length; j++) {
			ams += assoc.amList[j].cnt;
		}
		var available = equity.equityToDate - ams;
		equity.available = available;
		console.log("available", i, available);
	}
}

function oneLadder(html,data,inx) {
	var month = data.months[inx];
	var equity = data.equity[inx];
	var am = data.assoc[inx];
	var monthTitle = month.mTitle.split(" ")[0];
	var monthKey = month.mKey;
	var eCnt = equity.newEquityCnt;
	var amCnt = am.newAssocCnt;
	var amMonth = am.forMonth.mTitle ? am.forMonth.mTitle.split(" ")[0] : '&nbsp;';
	var amMonthKey = am.forMonth.mKey ? am.forMonth.mKey : '';

	html.push('<div class="member_ladder">');


	html.push('<div class="month_ladder">');
	html.push('<div id="am_' + monthKey + '" class="am_ladder ladder_level">');
	addAssocHtml(html,data,inx);
	html.push('</div>');
	html.push('<div id="em_' +monthKey + '" class="equity_ladder ladder_level">');
	addEquityHtml(html,data,inx);
	html.push('</div>');
	html.push('</div>');

	html.push('<div class="month_header">');
	html.push('<div class="'+monthKey+'">'+monthTitle + '</div>');
	var eInput = '<input id="input_'+inx+'" onchange="changeEquities(event);" type="number" name="ems" min="0" max="5" value="'+eCnt+'">'
	html.push('<div class="'+monthKey+'">EM: '+ eInput+'</div>');
	html.push('<div  class="'+amMonthKey+'">'+ 'AM: '+ amCnt+'</div>');
	html.push('<div  class="'+amMonthKey+'">'+ amMonth+'</div>');
	html.push('</div>');

	html.push('</div>');
}

function addAssocHtml(html,data,inx){
	var cnt = 0;
	var month = data.months[inx];
	var am = data.assoc[inx];
	var equity = data.equity[inx];
	var available = equity.available;
	var warning = available < 0 ? 'warning' :'';
	for(var k=0; k< available; k++){
		html.push("<div class='ass_member empty'>" + (k+1) + "</div>");
	}
	for (var j=0; j< am.amList.length; j++){
		var amMonth = am.amList[j];
		var monthKey = amMonth.mKey;
		var cnt = amMonth.cnt;
		var css = warning + " " + monthKey;
		for(var k=0; k< cnt; k++){
			html.push("<div class='ass_member "+ css + "'>" + (k+1) + "</div>");
		}
	}
}


function addEquityHtml(html,data,inx){
	var cnt = founders;
	var holder=[];
	for (var k=1; k <= inx; k++) {
		var month = data.months[k];
		var equity = data.equity[k];
		//console.log("addEquityHtml",inx, month);
		var monthKey = month.mKey;
		for (var j=0; j< equity.newEquityCnt;j++){
			cnt++;
			holder.push("<div class='e_member " +monthKey + "'>" + cnt + "</div>");
		}
	}
	for (var i = holder.length-1; i >= 0; i--) {
		html.push(holder[i]);
	}
	for (var i = founders; i > 0; i--) {
		html.push("<div class='e_member founder'>" + i + "</div>");
	}
}




