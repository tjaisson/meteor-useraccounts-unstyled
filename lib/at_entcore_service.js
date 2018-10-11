Template.atEntcoreService.helpers({
    disabled: function() {
        if (AccountsTemplates.disabled())
            return "disabled";
        var user = Meteor.user();
        if (user){
            var numServices = 0;
            if (user.services)
                numServices = _.keys(user.services).length; // including "resume"
            if (numServices === 2 && user.services[this._id])
                return "disabled";
        }
    },
    name: function(){
        return this.service;
    },
    iconClass: function() {
        return "fa fa-" + this.service;
    },
    buttonText: function() {
        return this.name;
    },
});


Template.atEntcoreService.events({
    "click button": function(event, t) {
        event.preventDefault();
        event.currentTarget.blur();
        if (AccountsTemplates.disabled())
            return;
        var user = Meteor.user();
        var serviceName = this.service;
        if (user && user.services && user.services[serviceName]){
            var numServices = _.keys(user.services).length; // including "resume"
            if (numServices === 2)
                return;
            else{
                AccountsTemplates.setDisabled(true);
                Meteor.call("ATRemoveService", serviceName, function(error){
                    AccountsTemplates.setDisabled(false);
                });
            }
        } else {
            AccountsTemplates.setDisabled(true);
            var parentData = Template.parentData();
            var state = (parentData && parentData.state) || AccountsTemplates.getState();

            options = {
                loginStyle: AccountsTemplates.options.socialLoginStyle,
            };
            if (Accounts.ui) {
                if (Accounts.ui._options.requestPermissions[serviceName]) {
                    options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
                }
                if (Accounts.ui._options.requestOfflineToken[serviceName]) {
                    options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
                }
            }
            this.applyLogin(options, function(err) {
                AccountsTemplates.setDisabled(false);
                if (err && err instanceof Accounts.LoginCancelledError) {
                    // do nothing
                }
                else if (err && (err instanceof Error) && (err.error === "Entcore.Multi.NoAccount")) {
                	EntcoreMulti.handleNewAccount(err.details);
                }
                else
                    AccountsTemplates.submitCallback(err, state);
            });
        }
    },
});