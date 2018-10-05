Template.atEntcore.helpers({
    entcoreService: function() {
    	if (Package['tjaisson:accounts-entcore']) {
    		var l = Package['tjaisson:accounts-entcore'].AccountsEntCore.getConfigsArray();
    		return l;
    	} else {
    		return [];
    	}
    },
});