'use strict';
function ResourceFaction(appId, appKey, baseurl) {
	var baseurl = baseurl || "https://d.apicloud.com/mcm/api";
	var now = Date.now();
	var appCode = SHA1(appId + "UZ" + appKey + "UZ" + now) + "." + now;
	var defaultactions = {
		'get' : {
			method : 'GET',
			params : ["_id", "_relation"]
		}, //_relationid 后续支持
		'save' : {
			method : 'POST',
			params : ["_id", "_relation"]
		}, //_relationid 后续支持
		'query' : {
			method : 'GET',
			params : ["filter"]
		},
		'delete' : {
			method : 'DELETE',
			params : ["_id", "_relation"]
		}, //_relationid 后续支持
		'login' : {
			method : "POST",
			params : ["username", "passwordd"]
		},
		'logout' : {
			method : "POST",
			params : ["token"]
		},
		'count' : {
			method : "GET",
			params : ["_id", "_relation"]
		},
		'exists' : {
			method : "GET",
			params : ["_id"]
		},
		'findOne' : {
			method : 'GET',
			params : ["filter"]
		},
		'verify' : {
			method : "POST",
			params : ["email", "language", "username"],
			alias : "verifyEmail"
		},
		'reset' : {
			method : "POST",
			params : ["email", "language", "username"],
			alias : "resetRequest"
		}
	};

	function extend(target) {
		if (arguments.length < 2)
			return;

		var otherSource = [].slice.call(arguments, 1);
		for (var i = 0, len = otherSource.length; i < len; i++) {
			var source = otherSource[i];
			for (var p in source) {
				if (source.hasOwnProperty(p)) {
					target[p] = source[p];
				}
			}
		}
		return target;
	}

	function copy(obj) {
		if (obj == null || typeof (obj) != 'object')
			return obj;

		var temp = obj.constructor();
		// changed

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				temp[key] = copy(obj[key]);
			}
		}
		return temp;
	}

	function isType(type) {
		return function(obj) {
			return {}.toString.call(obj) == "[object " + type + "]"
		}
	}

	var isFunction = isType("Function");

	function upload(isFilter, filepath, updateid, callback) {
		if ( typeof updateid == "function") {
			callback = updateid;
			updateid = undefined;
		}
		var fileUrl = baseurl + "/file" + ( updateid ? ("/" + updateid) : "");
		var filename = filepath.substr(filepath.lastIndexOf("/") + 1, filepath.length);
		api.ajax({
			url : fileUrl,
			method : updateid ? "PUT" : "POST",
			headers : {
				"X-APICloud-AppId" : appId,
				"X-APICloud-AppKey" : appCode
			},
			data : {
				values : {
					filename : filename
				},
				files : {
					file : filepath
				}
			}
		}, function(ret, err) {
			if (ret && ret.id && !err) {
				var newobj = {};
				if (isFilter) {
					newobj["id"] = ret["id"];
					newobj["name"] = ret["name"];
					newobj["url"] = ret["url"];
					callback(null, newobj)
				} else {
					callback(null, ret);
				}
			} else {
				callback(ret || err, null)
			}
		});
	}

	function Route(template) {
		this.template = template;
		this.urlParams = {};
	}


	Route.prototype = {
		setUrlParams : function(config, params) {
			var self = this;
			var url = "/:_class/:_id/:_relation/:_custom/:_relationid";
			url = url.replace(":_class", self.template);
			var parArr = [];
			Object.keys(params).forEach(function(ckey) {
				if (ckey.charAt(0) == '_') {
					url = url.replace(":" + ckey, params[ckey]);
					delete params[ckey];
				} else {
					if (ckey == "filter") {
						parArr.push(ckey + "=" + JSON.stringify(params[ckey]));
					}
				}
			})
			url = url.replace(/:[^/]+/ig, '/');
			if (parArr.length > 0) {
				url += ("?" + parArr.join("&"));
			}
			url = url.replace(/\/+/g, '/');
			config.url = baseurl + url;
		}
	};
	this.resourceFactory = function(modelName) {
		var route = new Route(modelName);
		var actions = extend({}, defaultactions);
		var Resource = new Object();
		for (var xname in actions) {
			if (modelName != "user" && ["login", "logout", "verify", "reset"].indexOf(name) != -1)
				continue;
			var xaction = actions[xname];
			var xhasBody = /^(POST|PUT|PATCH)$/i.test(xaction.method); ! function(xaction, hasBody, name) {

				Resource[name] = function(a1, a2, a3) {
					var action = copy(xaction);
					var params = {}, data, callback;
					switch (arguments.length) {
						case 3:
							params = a1;
							data = a2;
							callback = a3;
							break;
						case 2:
							if (hasBody)
								data = a1;
							else
								params = a1;
							callback = a2;
							break;
						case 1:
							if (isFunction(a1))
								callback = a1;
							else if (hasBody)
								data = a1;
							else
								params = a1;
							break;
						case 0:
							break;
						default:
							throw new Error("参数最多为3个");
					}
					if (hasBody) {
						var fileCount = 0;
						for (var key in data) {
							var item = data[key];
							if (item && item.isFile) {
								var updateid, isFilter = true;
								if (modelName == "file") {
									updateid = params["_id"];
									isFilter = false;
								}

								fileCount++; ! function(xkey) {
									upload(isFilter, item.path, updateid, function(err, returnData) {
										if (err) {
											return err;
										} else {
											if (modelName == "file")
												return callback(returnData, null);
											data[xkey] = returnData;
											fileCount--;
											if (fileCount == 0) {
												next();
											}
										}
									})
								}(key)
							}
						}
						if (fileCount == 0) {
							next();
						}
					} else {
						next();
					}
					function next() {
						var httpConfig = {};
						httpConfig["headers"] = {};
						httpConfig["headers"]["X-APICloud-AppId"] = appId;
						httpConfig["headers"]["X-APICloud-AppKey"] = appCode;
						httpConfig["headers"]["Content-Type"] = "application/json;";
						if (name === "logout") {
							httpConfig["headers"]["authorization"] = data["token"];
						} else {
							if (hasBody)
								httpConfig.data = {
									body : JSON.stringify(data)
								};
						}
						if (params && (name == "save") && params["_id"] && (!params["_relation"]) && (!params["_relationid"])) {
							action.method = "PUT";
						}
						if (params && (name == "save") && params["_id"] && params["_relation"] && params["_relationid"]) {
							action.method = "PUT";
						}
						for (var key in action) {

							if (key != 'params' && key != "alias") {

								httpConfig[key] = copy(action[key]);
							}
						}

						var curparams = {};
						action.params = action.params || [];
						for (var k = 0, len = action.params.length; k < len; k++) {
							var tempkey = action.params[k];
							if (params[tempkey]) {
								curparams[tempkey] = copy(params[tempkey]);
							}
						}
						if (["login", "logout", "count", "exists", "verify", "reset", "findOne"].indexOf(name) != -1) {
							curparams["_custom"] = action.alias || name;
						}
						route.setUrlParams(httpConfig, curparams);
						//                      console.log(httpConfig.method+ "\t"+httpConfig.url);
						api.ajax(httpConfig, function(ret, err) {
							return callback(ret, err);
						})
					}

				};
			}(xaction, xhasBody, xname);
		}

		return Resource;
	}
}