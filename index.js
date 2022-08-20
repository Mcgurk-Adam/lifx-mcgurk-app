var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var urlSearchParams = new URLSearchParams(window.location.search);
var authToken = null;
if (urlSearchParams.has("auth-token")) {
    authToken = urlSearchParams.get("auth-token");
    localStorage.setItem("auth-token", authToken);
}
else {
    var retrievedToken = localStorage.getItem("auth-token");
    if (retrievedToken) {
        authToken = retrievedToken;
    }
}
if (authToken != null) {
    window.history.pushState({}, "", "/");
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var appScreen, refreshedState, groupElement, _loop_1, _i, refreshedState_1, group;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appScreen = document.getElementById("app");
                    appScreen.style.display = "flex";
                    return [4, refreshState()];
                case 1:
                    refreshedState = _a.sent();
                    groupElement = document.querySelector(".group-section").cloneNode(true);
                    _loop_1 = function (group) {
                        var groupElementClone = groupElement.cloneNode(true);
                        groupElementClone.style.display = "block";
                        groupElementClone.querySelector(".group-switch [data-name]").innerText = group.name;
                        var groupCheckbox = groupElementClone.querySelector(".group-switch input[type=checkbox]");
                        groupCheckbox.checked = group.on;
                        groupCheckbox.onchange = function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var newPowerState;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        newPowerState = groupCheckbox.checked ? "on" : "off";
                                        return [4, changeState(buildSelector("group", group.id), newPowerState)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); };
                        var lightGroup = groupElementClone.querySelector(".light-group").cloneNode(true);
                        for (var _b = 0, _c = group.lights; _b < _c.length; _b++) {
                            var light = _c[_b];
                            var lightGroupClone = lightGroup.cloneNode(true);
                            lightGroupClone.querySelector("label [data-name]").innerText = light.name;
                            var lightCheckbox = lightGroupClone.querySelector("label input[type=checkbox]");
                            lightCheckbox.checked = light.power === "on";
                            groupElementClone.insertAdjacentElement("beforeend", lightGroupClone);
                        }
                        groupElementClone.querySelector(".light-group").remove();
                        appScreen.insertAdjacentElement("beforeend", groupElementClone);
                    };
                    for (_i = 0, refreshedState_1 = refreshedState; _i < refreshedState_1.length; _i++) {
                        group = refreshedState_1[_i];
                        _loop_1(group);
                    }
                    document.querySelector(".group-section").remove();
                    return [2];
            }
        });
    }); })();
}
else {
}
function http(path, method, data) {
    if (method === void 0) { method = "GET"; }
    if (data === void 0) { data = null; }
    return __awaiter(this, void 0, void 0, function () {
        var authToken, baseUrl, fetchOptions, fetchRequest, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authToken = localStorage.getItem("auth-token");
                    baseUrl = "https://api.lifx.com/v1";
                    fetchOptions = {
                        method: method,
                        headers: {
                            "Authorization": "Bearer ".concat(authToken),
                            "Content-Type": "application/json",
                        },
                        body: data,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4, fetch(baseUrl + path, fetchOptions)];
                case 2:
                    fetchRequest = _a.sent();
                    return [4, fetchRequest.json()];
                case 3: return [2, _a.sent()];
                case 4:
                    e_1 = _a.sent();
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
function changeState(selector, powerStatus) {
    return __awaiter(this, void 0, void 0, function () {
        var httpReturn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(selector, powerStatus);
                    return [4, http("/lights/".concat(selector, "/state"), "PUT", JSON.stringify({
                            "power": powerStatus,
                            "brightness": powerStatus === "on" ? 1.0 : 0.0,
                            "duration": 0.0,
                        }))];
                case 1:
                    httpReturn = _a.sent();
                    return [2];
            }
        });
    });
}
function refreshState() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var lights, lightGroups, _loop_2, _i, lights_1, light;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, http("/lights/all")];
                case 1:
                    lights = _b.sent();
                    document.getElementById("locationTitle").innerText = (_a = lights[0]) === null || _a === void 0 ? void 0 : _a.location.name;
                    lightGroups = [];
                    _loop_2 = function (light) {
                        var lightObject = {
                            id: light.id,
                            uuid: light.uuid,
                            name: light.label,
                            power: light.power,
                            connected: light.connected,
                            groupId: light === null || light === void 0 ? void 0 : light.group.id,
                        };
                        var group = void 0;
                        var foundGroup = lightGroups.find(function (group) { return group.id === light.group.id; });
                        if (foundGroup == undefined) {
                            group = {
                                id: light.group.id,
                                name: light.group.name,
                                lights: [lightObject],
                                on: light.power === "on",
                            };
                            lightGroups.push(group);
                        }
                        else {
                            if (light.power === "on") {
                                foundGroup.on = true;
                            }
                            foundGroup.lights.push(lightObject);
                        }
                    };
                    for (_i = 0, lights_1 = lights; _i < lights_1.length; _i++) {
                        light = lights_1[_i];
                        _loop_2(light);
                    }
                    return [2, lightGroups];
            }
        });
    });
}
function buildSelector(type, id) {
    return type === "light" ? "id:".concat(id) : "group_id:".concat(id);
}
