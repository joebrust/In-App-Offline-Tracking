var testing = false;
var networkStatus = window.navigator.onLine;
var offlineImps;
var offlineActivities = [];
var adSettings = {
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

function init(){
	retrieveAllOfflineTracking();
	
    track('imp');
	
	if(networkStatus){
		fireAllOfflineTracking();
	}
	
	window.ononline = function(){
		console.log('user has connected to the internet');
		
		networkStatus = true;
		
		fireAllOfflineTracking();
	}
	
	window.onoffline = function(){
		console.log('user has lost connection to the internet');
		
		networkStatus = false;
	}
	
	//include any 3rd party impression tracking here and/or start animation here
}

function click(string, destination){
	var clickId;
	
    if(!networkStatus){
        return false;
    }

    for(var i = 0; i < adSettings.clicks.length; i++){
        if(string == adSettings.clicks[i].name){
            clickId = adSettings.clicks[i].online;
        }
    }
	
    if(clickId){
		if(!testing){
			if(destination){
        		location.href = 'external-http://ads.pointroll.com/PortalServe/?pid=' + clickId + '&pos=c&r=' + Math.random();
			}else{
				location.href = 'internal-http://ads.pointroll.com/PortalServe/?pid=' + clickId + '&pos=c&r=' + Math.random();
			}
		}else{
			console.log('(click) ' + string);	
		}
    }else{
		console.log('(click) error - no matching click id found for "' + string + '"');
	}
}

function track(string){
	var trackingImage = new Image();
    var onlineActivityId;
    var offlineActivityId;
	
	var offlineActivityCount;

    if(string == 'imp'){
        onlineActivityId = adSettings.imp.online;
        offlineActivityId = adSettings.imp.offline;
    }else{
    	for(var i = 0; i < adSettings.activities.length; i++){
            if(string == adSettings.activities[i].name){
                onlineActivityId = adSettings.activities[i].online;
                offlineActivityId = adSettings.activities[i].offline;
            }
        }
    }
	
	if(onlineActivityId && offlineActivityId){
		if(!testing){
			if(networkStatus){
				trackingImage.src = 'http://ads.pointroll.com/PortalServe/?pid=' + onlineActivityId + '&pos=p&r=' + Math.random();
			}else{
				if(string == 'imp'){
					recordOfflineImpression();
				}else{
					recordOfflineActivity(string, offlineActivityId);
				}
			}
		}else{
			console.log('(activity) ' + string);
		}
	}else{
		console.log('(activity) error - no matching activity id found for "' + string + '"');
	}
}

function retrieveAllOfflineTracking(){
	if(window.localStorage['imp']){
		offlineImps = window.localStorage['imp'];	
	}else{
		offlineImps = 0;	
	}
	
	for(var i = 0; i < adSettings.activities.length; i++){
		if(window.localStorage[adSettings.activities[i].name]){
			offlineActivities.push([adSettings.activities[i].name, window.localStorage[adSettings.activities[i].name], adSettings.activities[i].offline]);
		}
	}
}

function recordOfflineImpression(){
	if(window.localStorage['imp']){
		offlineImps++;
	}else{
		offlineImps = 1;
	}
	
	window.localStorage['imp'] = offlineImps;
	
	console.log('(impression) record offline impression (' + offlineImps + ')');
}

function recordOfflineActivity(string, id){
	var activityIndex = -1;
	
	for(var i = 0; i < offlineActivities.length; i++){
		if(offlineActivities[i][0] == string){
			activityIndex = i;
		}
	}
	
	if(activityIndex != -1){
		offlineActivities[activityIndex] = [string, offlineActivities[activityIndex][1] + 1, id];
		
		window.localStorage[offlineActivities[activityIndex][0]] = offlineActivities[activityIndex][1];
	}else{
		offlineActivities.push([string, 1, id]);
		
		window.localStorage[string] = 1;
	}
	
	console.log('(activity) record offline activity "' + string + ', ' + id + '" (' + window.localStorage[string] + ')');
}

function fireAllOfflineTracking(){
	if(window.localStorage['imp']){
		for(i = 0; i < offlineImps; i++){
			var trackingImage = new Image();
			
			trackingImage.src = 'http://ads.pointroll.com/PortalServe/?pid=' + adSettings.imp.offline + '&pos=p&r=' + Math.random();
		}
	}
	
	for(var i = 0; i < offlineActivities.length; i++){
		for(var j = 0; j < window.localStorage[offlineActivities[i][0]]; j++){
			var trackingImage = new Image();
			
			trackingImage.src = 'http://ads.pointroll.com/PortalServe/?pid=' + offlineActivities[i][2] + '&pos=p&r=' + Math.random();	
		}
	}
	
	offlineImps = 0;
	offlineActivities = [];
	
	window.localStorage.clear();
	
	console.log('all offline tracking has been fired and now flushed from storage');
}

window.onload = init;