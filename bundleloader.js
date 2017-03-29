

var MLX = MLX || {};
MLX.coreapiBundleLoaded = false;
MLX.loadBundles = function (options) {
    var bundles = {
        baseUrl: "//localhost:57655/bundles/",
        supported: ["jquery", "jqueryui", "knockout", "mlxlibrary", "webtrends", "coreapi", "learnerapi", "scowrapper", "searchapi"],
        required: ["jquery","knockout","coreapi"],
        supportedBundleUrls : {
                    'jquery-1.0.0.0' : ['http://localhost:57655/bundles/jquery_2017-03-27-1235.js',],
                    'jqueryui-1.0.0.0' : ['http://localhost:57655/bundles/jqueryui_2017-03-27-1235.js',],
                    'knockout-1.0.0.0' : ['http://localhost:57655/bundles/knockout_2017-03-27-1235.js',],
                    'coreapi-1.0.0.0' : ['http://localhost:57655/bundles/coreapi_2017-03-27-1235.js',],                    
                    "mlxlibrary-1.0.0.0" : ['http://localhost:57655/bundles/mlxlibrary_2017-03-27-1235.js',],
                    "webtrends-1.0.0.0" : ['http://localhost:57655/bundles/webtrends_2017-03-27-1235.js',],
                    "learnerapi-1.0.0.0" : ['http://localhost:57655/bundles/learnerapi_2017-03-27-1235.js',],
                    "scowrapper-1.0.0.0" : ['http://localhost:57655/bundles/scowrapper_2017-03-27-1235.js',],
                    "searchapi-1.0.0.0" : ['http://localhost:57655/bundles/searchapi_2017-03-27-1235.js',]
        },
        versions: {
            supported: ["1.0.0.0"],
            current: "1.0.0.0",
            aliases: [{ "1": "1.0.0.0" }, { "1.0": "1.0.0.0" }, { "1.0.0": "1.0.0.0" }]
                    },
                    loadDefaultBundles : true
    };

    var lazyLoader = {
        queue : [],
        pendingScripts : []

    };

    function domReady(callback) {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", callback);
        }
        else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState === "interactive") {
                    callback();
                }
            });
        }
    };

    function isSupportedBundle(bundle) {
        var isSupported = false;

        for (var key in bundles.supported) {
            if (bundle === bundles.supported[key]) {
                isSupported = true;
                break;
            }
        }

        return isSupported;
    };

    function isSupportedVersion(version) {
        var isSupported = false;

        for (var key in bundles.versions.supported) {
            if (version === bundles.versions.supported[key]) {
                isSupported = true;
                break;
            }
        }

        return isSupported;
    };

    function getNormalizedVersion(requestedVersion) {
        var version = bundles.versions.current;

        if (requestedVersion) {
            if (requestedVersion.length < bundles.versions.current.length) {
                for (var i = 0, len = versions.aliases.length; i < len; i++) {
                    for (var alias in bundles.versions.aliases[i]) {
                        if (requestedVersion === alias) {
                            version = bundles.versions.aliases[i][alias];
                        }
                    }
                }
            }
            else if (requestedVersion.length === bundles.versions.current.length) {
                if (requestedVersion < bundles.versions.current) {
                    if (isSupportedVersion(requestedVersion)) {
                        version = requestedVersion;
                    }
                }
            }
            else {
                // We'll give them the current version since they used the
                // wrong version format.
            }
        }
        else {
            // We'll give them the current version since they didn't specify one.
        }

        return version;
    };
    function bundleLoaded() {       
        if (MLX.coreapiBundleLoaded && MLX.learnerapiBundleLoaded) {
            var hid = document.createElement("input");
            hid.type = "hidden";
            hid.Id = "SdkBundleLoaded";
            document.body.appendChild(hid);

            if (options.bundleLoadedCallback){
                options.bundleLoadedCallback ();
            }
        }
        else {
            setTimeout(function () { bundleLoaded(); }, 1000);
        }        
    };
    function checkBundleLoaded() {
        if (document.getElementById('SdkBundleLoaded')) return true;
    };
    function duplicateBundle (chkey){
        for (var i in bundles.required){
            if (bundles.required[i]==chkey) return true;
        }
        return false;
    };
    function loadBundles(scripts) {                   
        var firstScript = document.scripts[0];
                   
        for (i = 0; i < lazyLoader.queue.length; ++i) {
            try {
                // Evaluates if the async property is used by the browser
                if ('async' in firstScript) {                            
                    var element = document.createElement("script");
                    element.type = "text/javascript";                           
                    element.async = false;
                    element.src = lazyLoader.queue[i];
                    document.head.appendChild(element);
                }                         
                else if (firstScript.readyState) {                           
                    // Create an script element
                    var element = document.createElement("script");
                    element.type = "text/javascript"
                    // Add the scripts from the queue to the pending list in order
                    lazyLoader.pendingScripts.push(element)
                    // Set an event listener for the script element
                    element.onreadystatechange = function () {
                        var pending;
                        // When the next script on the pending list has loaded proceed
                        if (lazyLoader.pendingScripts.length > 0 && (lazyLoader.pendingScripts[0].readyState == "loaded" || lazyLoader.pendingScripts[0].readyState == "complete")) {
                            // Remove the script we just loaded from the pending list
                            pending = lazyLoader.pendingScripts.shift()
                            // Clear the listener
                            element.onreadystatechange = null;
                            // Inject the script to the DOM
                            firstScript.parentNode.insertBefore(pending, firstScript);
                        }
                                
                    }
                    // Once we have set the listener we set the script object's src
                    element.src = lazyLoader.queue[i];
                }
            } catch (ex){}
        }
        bundleLoaded();
    };
    domReady(function () {
        if (options && options.bundles) {
            if (checkBundleLoaded()) {
                            throw "Error: SDK is already loaded.";
                        }
                        if (options.loadDefaultBundles != null || typeof(options.loadDefaultBundles) != 'undefined'){
                            bundles.loadDefaultBundles = options.loadDefaultBundles;
            }
                        if (bundles.loadDefaultBundles && bundles.required && bundles.required.length > 0) {
                for (var key in options.bundles) {
                    if (!duplicateBundle(options.bundles[key])){
                        bundles.required.push(options.bundles[key]);
                    }
                }
                options.bundles = bundles.required;
            }
                        lazyLoader.queue = [];
            for (var key in options.bundles) {
                if (isSupportedBundle(options.bundles[key])) {
                    var bundle_version = options.bundles[key] + "-" + getNormalizedVersion(options.version);
                    var bundleuri = bundles.supportedBundleUrls[bundle_version];
                    if (bundleuri && bundleuri.length >= 1){
                        var urlfirst ="", urlrest="";
                        for (var i = 0; i< bundleuri.length; i++){
                           urlfirst = bundleuri[i];
                            if(options.debug){
                                if (bundleuri[i].indexOf("?") > -1) {
                                    urlfirst = bundleuri[i].substr(0,bundleuri[i].indexOf("?"));
                                    urlrest = bundleuri[i].substr(bundleuri[i].indexOf("?"));
                                    bundleuri[i] = urlfirst + "-debug" + urlrest;
                                }
                                else if (bundleuri[i].indexOf(".js") > -1){
                                    bundleuri[i] = urlfirst;
                                }
                                else {
                                    bundleuri[i] = urlfirst + "-debug" + urlrest;
                                }                                
                            }
                            lazyLoader.queue.push(bundleuri[i]);  
                        }
                                                       
                    }
                }
            }
            loadBundles();                        
        }
    });
};