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
        return this.server;
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
        if (user && user.services && user.services[this._id]){
            var numServices = _.keys(user.services).length; // including "resume"
            if (numServices === 2)
                return;
            else{
                AccountsTemplates.setDisabled(true);
                Meteor.call("ATRemoveService", this._id, function(error){
                    AccountsTemplates.setDisabled(false);
                });
            }
        } else {
            AccountsTemplates.setDisabled(true);
            var parentData = Template.parentData();
            var state = (parentData && parentData.state) || AccountsTemplates.getState();
            var serviceName = this._id;
            var methodName;
            if (serviceName === 'meteor-developer')
                methodName = "loginWithMeteorDeveloperAccount";
            else
                methodName = "loginWith" + capitalize(serviceName);
            var loginWithService = Meteor[methodName];
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
            loginWithService(options, function(err) {
                AccountsTemplates.setDisabled(false);
                if (err && err instanceof Accounts.LoginCancelledError) {
                    // do nothing
                }
                else if (err && err instanceof ServiceConfiguration.ConfigError) {
                    if (Accounts._loginButtonsSession)
                        return Accounts._loginButtonsSession.configureService(serviceName);
                }
                else
                    AccountsTemplates.submitCallback(err, state);
            });
        }
    },
});