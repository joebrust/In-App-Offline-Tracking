var PR_TESTING = true;
var PR_NETWORK_STATUS = window.navigator.onLine;
var PR_OFFLINE_IMPRESSIONS;
var PR_OFFLINE_ACTIVITIES = [];
var PR_AD = {
    'settings': {
        'portrait': function(){
            //
        },
        'landscape': function(){
            //
        },
        'handleDisplay': function(){
			//
        },
        'handleHidden': function(){
			//
        },
		'brandtime' : [
			//
		]
    },
    'imp': {
        'online': '1976201N35020130213173349',
        'offline': '1976200O21520130213173349'
    },
	'clicks': [{
		'name': 'LandingPage',
		'online': '1976199X49420130213173349'
	}],
	'activities': [{
		'name': 'PortraitView',
		'online': '1976196O53720130213173349',
		'offline': '1976198R62920130213173349'	
	},{
		'name': 'LandscapeView',
		'online': '1976195W29320130213173349',
		'offline': '1976197J79820130213173349'	
	},{
		'name': 'Video1Start',
		'online': '1976187W14920130213173349',
		'offline': '1976187W14920130213173349'	
	},{
		'name': 'Video1Complete',
		'online': '1976188V87020130213173349',
		'offline': '1976188V87020130213173349'
	},{
		'name': 'Video2Start',
		'online': '1976190C44220130213173349',
		'offline': '1976190C44220130213173349'	
	},{
		'name': 'Video2Complete',
		'online': '1976189V07220130213173349',
		'offline': '1976189V07220130213173349'	
	},{
		'name': 'Video3Start',
		'online': '1976191T12420130213173349',
		'offline': '1976191T12420130213173349'	
	},{
		'name': 'Video3Complete',
		'online': '1976192D45320130213173349',
		'offline': '1976192D45320130213173349'	
	},{
		'name': 'Video4Start',
		'online': '1976194C09420130213173349',
		'offline': '1976194C09420130213173349'	
	},{
		'name': 'Video4Complete',
		'online': '1976193P05820130213173349',
		'offline': '1976193P05820130213173349'	
	}]
}

function ecoStart(){
	prRetrieveAllOfflineTracking();
	
    prTrack('imp');
	
	if(PR_NETWORK_STATUS){
		prFireAllOfflineTracking();
	}
	
	window.ononline = function(){
		console.log('pr log: user has connected to the internet');
		
		PR_NETWORK_STATUS = true;
		
		prFireAllOfflineTracking();
	}
	
	window.onoffline = function(){
		console.log('pr log: user has lost connection to the internet');
		
		PR_NETWORK_STATUS = false;
	}
	
	prInitAd();
	
	//include any 3rd party impression tracking here and/or start animation here
}

function prClick(string, destination){
	var PR_CLICK_ID;
	
    if(!PR_NETWORK_STATUS){
        return false;
    }

    for(var i = 0; i < PR_AD.clicks.length; i++){
        if(string == PR_AD.clicks[i].name){
            PR_CLICK_ID = PR_AD.clicks[i].online;
        }
    }
	
    if(PR_CLICK_ID){
		if(!PR_TESTING){
			if(destination){
        		location.href = 'external-http://ads.pointroll.com/PortalServe/?pid=' + PR_CLICK_ID + '&pos=c&r=' + Math.random();
			}else{
				location.href = 'internal-http://ads.pointroll.com/PortalServe/?pid=' + PR_CLICK_ID + '&pos=c&r=' + Math.random();
			}
		}else{
			console.log('pr log: (click) ' + string);	
		}
    }else{
		console.log('pr log: (click) error - no matching click id found for "' + string + '"');
	}
}

function prTrack(string){
	var PR_TRACKING_IMAGE = new Image();
    var PR_ACTIVITY_ONLINE_ID;
    var PR_ACTIVITY_OFFLINE_ID;
	
	var PR_ACTIVITY_OFFLINE_COUNT;

    if(string == 'imp'){
        PR_ACTIVITY_ONLINE_ID = PR_AD.imp.online;
        PR_ACTIVITY_OFFLINE_ID = PR_AD.imp.offline;
    }else{
    	for(var i = 0; i < PR_AD.activities.length; i++){
            if(string == PR_AD.activities[i].name){
                PR_ACTIVITY_ONLINE_ID = PR_AD.activities[i].online;
                PR_ACTIVITY_OFFLINE_ID = PR_AD.activities[i].offline;
            }
        }
    }
	
	if(PR_ACTIVITY_ONLINE_ID && PR_ACTIVITY_OFFLINE_ID){
		if(!PR_TESTING){
			if(PR_NETWORK_STATUS){
				PR_TRACKING_IMAGE.src = 'http://ads.pointroll.com/PortalServe/?pid=' + PR_ACTIVITY_ONLINE_ID + '&pos=p&r=' + Math.random();
			}else{
				if(string == 'imp'){
					prRecordOfflineImpression();
				}else{
					prRecordOfflineActivity(string, PR_ACTIVITY_OFFLINE_ID);
				}
			}
		}else{
			console.log('pr log: (activity) ' + string);
		}
	}else{
		console.log('pr log: (activity) error - no matching activity id found for "' + string + '"');
	}
}

function prRetrieveAllOfflineTracking(){
	if(window.localStorage['imp']){
		PR_OFFLINE_IMPRESSIONS = window.localStorage['imp'];	
	}else{
		PR_OFFLINE_IMPRESSIONS = 0;	
	}
	
	for(var i = 0; i < PR_AD.activities.length; i++){
		if(window.localStorage[PR_AD.activities[i].name]){
			PR_OFFLINE_ACTIVITIES.push([PR_AD.activities[i].name, window.localStorage[PR_AD.activities[i].name], PR_AD.activities[i].offline]);
		}
	}
}

function prRecordOfflineImpression(){
	if(window.localStorage['imp']){
		PR_OFFLINE_IMPRESSIONS++;
	}else{
		PR_OFFLINE_IMPRESSIONS = 1;
	}
	
	window.localStorage['imp'] = PR_OFFLINE_IMPRESSIONS;
	
	console.log('pr log: (impression) record offline impression (' + PR_OFFLINE_IMPRESSIONS + ')');
}

function prRecordOfflineActivity(string, id){
	var PR_ACTIVITY_INDEX = -1;
	
	for(var i = 0; i < PR_OFFLINE_ACTIVITIES.length; i++){
		if(PR_OFFLINE_ACTIVITIES[i][0] == string){
			PR_ACTIVITY_INDEX = i;
		}
	}
	
	if(PR_ACTIVITY_INDEX != -1){
		PR_OFFLINE_ACTIVITIES[PR_ACTIVITY_INDEX] = [string, PR_OFFLINE_ACTIVITIES[PR_ACTIVITY_INDEX][1] + 1, id];
		
		window.localStorage[PR_OFFLINE_ACTIVITIES[PR_ACTIVITY_INDEX][0]] = PR_OFFLINE_ACTIVITIES[PR_ACTIVITY_INDEX][1];
	}else{
		PR_OFFLINE_ACTIVITIES.push([string, 1, id]);
		
		window.localStorage[string] = 1;
	}
	
	console.log('pr log: (activity) record offline activity "' + string + ', ' + id + '" (' + window.localStorage[string] + ')');
}

function prFireAllOfflineTracking(){
	if(window.localStorage['imp']){
		for(i = 0; i < PR_OFFLINE_IMPRESSIONS; i++){
			var PR_TRACKING_IMAGE = new Image();
			
			PR_TRACKING_IMAGE.src = 'http://ads.pointroll.com/PortalServe/?pid=' + PR_AD.imp.offline + '&pos=p&r=' + Math.random();
		}
	}
	
	for(var i = 0; i < PR_OFFLINE_ACTIVITIES.length; i++){
		for(var j = 0; j < window.localStorage[PR_OFFLINE_ACTIVITIES[i][0]]; j++){
			var PR_TRACKING_IMAGE = new Image();
			
			PR_TRACKING_IMAGE.src = 'http://ads.pointroll.com/PortalServe/?pid=' + PR_OFFLINE_ACTIVITIES[i][2] + '&pos=p&r=' + Math.random();	
		}
	}
	
	PR_OFFLINE_IMPRESSIONS = 0;
	PR_OFFLINE_ACTIVITIES = [];
	
	window.localStorage.clear();
	
	console.log('pr log: all offline tracking has been fired and now flushed from storage');
}

//comment out the code below before sending to the economist
window.onload = ecoStart;