exports.main = function(options) {
var Request = require("sdk/request").Request;
var data = require("sdk/self").data;

    // Create a panel whose content is defined in "text-entry.html".
	var panel = require("sdk/panel").Panel({
		width: 700,
		height: 350,
		contentURL: data.url("index.html"),
    });

    // Send the page script a message called "show" when the panel is shown.
	panel.on("show", function() {
		panel.port.emit("show");
	});
    
    // create toolbarbutton
    var toolbarbutton = require("toolbarbutton").ToolbarButton({
      id: "TBB-TEST",
      label: "TBB TEST",
      image: data.url("favicon.ico"),
      panel: panel
    });

    if (data.loadReason == "install") {
        toolbarbutton.moveTo({
            toolbarID: "nav-bar",
            forceMove: false // only move from palette
    });
}

   
panel.port.on("getUser", function(message) {
    if(message!="")
        var getUser=[ { "names": [message] } ];
    else
        var getUser=[ { "names": ["tiziana.sel@gmail.com"] } ];
      
      //Bugzilla Request getUser
      var paramUser= {"method" : "User.get", "params": JSON.stringify(getUser)};
        var user = Request({
           url: "https://bugzilla.mozilla.org/jsonrpc.cgi",
           content: paramUser,
            onComplete: function (response) {
                 panel.port.emit("user",response.json );
            }
        }).get();
});



panel.port.on("getUserBugs", function(message) {
    if(message!="")
        var getBugByCreator=[ { "creator": [message] } ];
    else
        var getBugByCreator=[ { "creator": ["tiziana.sel@gmail.com"] } ];

    var paramBugs= {"method" : "Bug.search", "params": JSON.stringify(getBugByCreator)};
    //https://bugzilla.mozilla.org/jsonrpc.cgi?method=Bug.search&params=%20[{%20%20%22creator%22:%22tiziana.sel@gmail.com%22%20},%20%20%20%20{%20%22exclude_fields%22%20:%20[%22bugs.flags%22]%20%20}]
    var userBugs = Request({
        url: "https://bugzilla.mozilla.org/jsonrpc.cgi",
        content: paramBugs,
        onComplete: function (response) {
          panel.port.emit("userBugs",response.json );
        }
    }).get();
});
}