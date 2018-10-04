Template.atEntcore.helpers({
    entcoreService: function() {
    	if (Package['tjaisson:accounts-entcore']) {
    		var l = Package['tjaisson:accounts-entcore'].AccountsEntCore.configs();
    		return l;
    	} else {
    		return [];
    	}
    },
});