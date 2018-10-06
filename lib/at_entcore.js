Template.atEntcore.helpers({
    entcoreService: function() {
		return AccountsEntCore.getConfigsArray();
    },
});

Template.atForm.helpers({
    showEntcoreServices: function(next_state){
        var state = next_state || this.state || AccountsTemplates.getState();
        if (!(state === "signIn"))
            return false;
        var nb = AccountsEntCore.getConfigsArray().length;
        if (nb === 0)
            return false;
        return true;
    }
});