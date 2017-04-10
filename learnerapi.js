var microsoft = microsoft || {};
microsoft.learning = microsoft.learning || {};
microsoft.learning.mlx = microsoft.learning.mlx || {};


var __extends, ScoTunnel, CoursePlayerModel, MLX, microsoft;
(function (n) {
    (function (n) {
        (function (n) {
            var t = function () {
                function n() {
                    this.subPubSubscriberTokens = -1;
                    this.subPubEvents = [];
                }
                return n.prototype.notifySubscribers = function (n, t) {
                    var i, r, u;
                    for (i in this.subPubEvents)
                        for (r = 0, u = this.subPubEvents[i].length; r < u; r++)
                            (parseInt(i) & n) == n && this.subPubEvents[i][r].callbackFn(n, t);
                }, n.prototype.subscribe = function (n, t) {
                    this.subPubEvents[n] || (this.subPubEvents[n] = []);
                    var i = ++this.subPubSubscriberTokens;
                    return this.subPubEvents[n].push({ callbackFn: t, token: i }), i;
                }, n.prototype.unsubscribe = function (n) {
                    var t, i, r;
                    for (t in this.subPubEvents)
                        if (this.subPubEvents[t])
                            for (i = 0, r = this.subPubEvents[t].length; i < r; i++)
                                this.subPubEvents[t][i].token === n && this.subPubEvents[t].splice(i, 1);
                }, n;
            }();
            n.PubSubExtender = t;
        })(n.mlx || (n.mlx = {}));
        var t = n.mlx;
    })(n.learning || (n.learning = {}));
    var t = n.learning;
})(microsoft || (microsoft = {}));

__extends = this.__extends || function (n, t) {
    function r() {
        this.constructor = n;
    }
    for (var i in t)
        t.hasOwnProperty(i) && (n[i] = t[i]);
    r.prototype = t.prototype;
    n.prototype = new r;
}, function (n) {
    (function (t) {
        (function (t) {
            var l = function () {
                function t(n) {
                    this.scoTunnel = n || ScoTunnel;
                }
                return t.prototype.initialize = function (n, t, i) {
                    var u = this, r = $.Deferred();
                    return this.courseId = n, this.baseUrl = i, u.scoTunnel.ajax({ url: i + "/imsmanifestlite.json", dataType: "json", cache: !1 }).done($.proxy(function (n) {
                        n && (u.manifestJSON = n);
                        r.resolve();
                    }, this)).fail(function () {
                        r.reject();
                    }), r.promise();
                }, t.prototype.initializeManifestJson = function (n, t, i) {
                    var u = this, r = $.Deferred();
                    return this.courseId = n, this.baseUrl = i, u.scoTunnel.ajax({ url: i + "/imsmanifest.json", dataType: "json", cache: !1 }).done($.proxy(function (n) {
                        n && (u.manifestJSON = n);
                        r.resolve();
                    }, this)).fail(function () {
                        r.reject();
                    }), r.promise();
                }, t.prototype.getCourseTitle = function () {
                    return this.manifestJSON && this.manifestJSON.manifest && this.manifestJSON.manifest.metadata && this.manifestJSON.manifest.metadata.title ? this.manifestJSON.manifest.metadata.title : "";
                }, t.prototype.getRootActivity = function () {
                    var f = this, i = null, r, t, n, u;
                    if (this.manifestJSON && this.manifestJSON.manifest && this.manifestJSON.manifest.organizations && this.manifestJSON.manifest.organizations.organization)
                        for (r = this.manifestJSON.manifest.organizations, t = this.manifestJSON.manifest.organizations.organization, n = 0, u = t.length; n < u; n++)
                            if (t[n]["@identifier"] == r["@default"]) {
                                i = t[n];
                                break;
                            }
                    return i;
                }, t.prototype.getActivityNode = function (n) {
                    var t = this.getRootActivity();
                    return this.getActivityNodeHelper(this, t.item, n);
                }, t.prototype.getActivityNodeHelper = function (n, t, i) {
                    for (var f, u = "", r = 0, e = t.length; r < e; r++) {
                        if (t[r] && t[r]["@identifier"] == i) {
                            u = t[r];
                            break;
                        }
                        if (f = t[r].item, f && f.length > 0 && (u = this.getActivityNodeHelper(n, f, i), u))
                            break;
                    }
                    return u;
                }, t.prototype.getActivityLineage = function (n) {
                    var t = this.getRootActivity();
                    return this.getActivityLineageHelper(this, null, t.item, n);
                }, t.prototype.getActivityLineageHelper = function (n, t, i, r) {
                    for (var e, o, u, f = 0, s = i.length; f < s; f++) {
                        if (i[f] && i[f]["@identifier"] == r) {
                            u = $.extend({}, t);
                            u.item = [];
                            u.item.push(i[f]);
                            break;
                        }
                        if (e = i[f].item, e && e.length > 0 && (o = this.getActivityLineageHelper(n, i[f], e, r), o)) {
                            t ? (u = $.extend({}, t), u.item = [], u.item.push(o)) : u = o;
                            break;
                        }
                    }
                    return u;
                }, t.prototype.getResourceNode = function (n) {
                    return n && n.resource ? n.resource : undefined;
                }, t.prototype.getActivityId = function (n) {
                    return n["@identifier"];
                }, t.prototype.getActivityTitle = function (n) {
                    return n.title;
                }, t.prototype.getActivityDeleted = function (n) {
                    return n && n["@isdeleted"] && n["@isdeleted"] === "true" ? !0 : !1;
                }, t.prototype.getActivityDescription = function (n) {
                    return n && n.metadata && n.metadata.description ? n.metadata.description : "";
                }, t.prototype.getActivityParameters = function (n) {
                    return n && n["@parameters"] ? n["@parameters"] : "";
                }, t.prototype.getActivityChildren = function (n, t, i) {
                    var u, o, e, y;
                    if (typeof t == "undefined" && (t = {}), typeof i == "undefined" && (i = !1), u = [], o = 0, n && n.item) {
                        var c = n.item, r = undefined, l = undefined, a = undefined, f = undefined, s = undefined, h = undefined, v = !1;
                        for (Object.keys(t).length > 0 && (f = t.global, s = f && typeof f.courseVersion != "undefined" ? f.courseVersion : ""), e = 0, y = c.length; e < y; e++)
                            r = c[e], v = r && r.item ? r.item.length > 0 : !1, r && (r.resource || v) && (l = r["@isvisible"] ? r["@isvisible"] : "true", a = r["@isdeleted"] ? r["@isdeleted"] : "false", l == "true" && a == "false" ? u[o++] = $.extend(!0, {}, r) : i && (h = r.deletedVersion ? r.deletedVersion : "", (s === "" && h !== "" || h > s) && (u[o++] = $.extend(!0, {}, r))));
                    }
                    return u;
                }, t.prototype.getResourceHRef = function (n) {
                    return n && n["@href"] ? n["@href"] : "";
                }, t.prototype.getResourceScormType = function (n) {
                    return n && n["@scormtype"] ? n["@scormtype"] : "sco";
                }, t.prototype.getResourceAuthor = function (n) {
                    return n && n.metadata && n.metadata.copyright ? n.metadata.copyright : "";
                }, t.prototype.getResourceDuration = function (n) {
                    return n && n.metadata && n.metadata.duration ? n.metadata.duration : "";
                }, t.prototype.getResourceDescription = function (n) {
                    return n && n.metadata && n.metadata.description ? n.metadata.description : "";
                }, t.prototype.getLearningResourceType = function (n) {
                    return n && n.metadata && n.metadata.learningresourcetype ? n.metadata.learningresourcetype : "";
                }, t.prototype.getPrerequisites = function (n) {
                    return n && n.prerequisites ? n.prerequisites : "";
                }, t.prototype.getAssessmentsCount = function () {
                    var n = this.getRootActivity();
                    return this.getLearningResourceTypeCountHelper(this, n.item, i.Assessment);
                }, t.prototype.getKnowledgeCheckCount = function () {
                    var n = this.getRootActivity();
                    return this.getLearningResourceTypeCountHelper(this, n.item, i.KnowledgeCheck);
                }, t.prototype.getLearningResourceTypeCount = function (n) {
                    var t = this.getRootActivity();
                    return this.getLearningResourceTypeCountHelper(this, t.item, n);
                }, t.prototype.getLearningResourceTypeCountHelper = function (n, t, i) {
                    for (var u, f = 0, r = 0, e = t.length; r < e; r++)
                        t[r] && (!t[r]["@isvisible"] || t[r]["@isvisible"] && t[r]["@isvisible"] == "true") && (!t[r]["@isdeleted"] || t[r]["@isdeleted"] && t[r]["@isdeleted"] == "false") && (t[r].resource && t[r].resource.metadata && t[r].resource.metadata.learningresourcetype && t[r].resource.metadata.learningresourcetype.toLowerCase() == i.toLowerCase() && f++, t[r].item && (u = t[r].item, u && u.length > 0 && (f += this.getLearningResourceTypeCountHelper(n, u, i))));
                    return f;
                }, t.prototype.getModulesCount = function () {
                    for (var u = this.getRootActivity(), t = u.item, r = 0, n = 0, f = t.length; n < f; n++)
                        (!t[n]["@isvisible"] || t[n]["@isvisible"] && t[n]["@isvisible"] == "true") && (!t[n]["@isdeleted"] || t[n]["@isdeleted"] && t[n]["@isdeleted"] == "false") && (!t[n].resource || t[n].resource && t[n].resource.metadata && t[n].resource.metadata.learningresourcetype && t[n].resource.metadata.learningresourcetype != i.Assessment) && r++;
                    return r;
                }, t.prototype.getTotalVideoDuration = function () {
                    var t = this.getRootActivity(), r = this.getTotalSecondsForContentType(t.item, i.Video);
                    return n.learning.mlx.utility.convertSecondsToHHMMSS(r);
                }, t.prototype.getDurationTimeRollupForActivity = function (t) {
                    var r = 0;
                    return t && (t.resource && t.resource.metadata && t.resource.metadata.duration && (r = n.learning.mlx.utility.convertHHMMSSToSeconds(t.resource.metadata.duration)), t.item && (r += this.getTotalSecondsForContentType(t.item, i.Any))), n.learning.mlx.utility.convertSecondsToHHMMSS(r);
                }, t.prototype.getTotalSecondsForContentType = function (t, r) {
                    for (var e, o, f = 0, u = 0, s = t.length; u < s; u++)
                        t[u] && (!t[u]["@isvisible"] || t[u]["@isvisible"] && t[u]["@isvisible"] == "true") && (!t[u]["@isdeleted"] || t[u]["@isdeleted"] && t[u]["@isdeleted"] == "false") && (t[u].resource && t[u].resource.metadata && t[u].resource.metadata.learningresourcetype && (e = t[u].resource.metadata.duration, e && (r != i.Any ? t[u].resource.metadata.learningresourcetype == r && (f += n.learning.mlx.utility.convertHHMMSSToSeconds(e)) : f += n.learning.mlx.utility.convertHHMMSSToSeconds(e))), t[u].item && (o = t[u].item, o && o.length > 0 && (f += this.getTotalSecondsForContentType(o, r))));
                    return f;
                }, t.prototype.getAssessmentIdentifiers = function (n) {
                    var t = this.getRootActivity();
                    return this.getIdentifiers(this, t.item, n, i.Assessment);
                }, t.prototype.getVideoIdentifiers = function (n) {
                    var t = this.getRootActivity();
                    return this.getIdentifiers(this, t.item, n, i.Video);
                }, t.prototype.activityHasVisibility = function (n, t) {
                    var i = !1;
                    return (t == r.Hidden || t == r.Any) && n["@isvisible"] && n["@isvisible"] == "false" ? i = !0 : (t == r.Visible || t == r.Any) && (!n["@isvisible"] || n["@isvisible"] && n["@isvisible"] == "true") ? i = !0 : (t == r.SoftDeleted || t == r.Any) && n["@isdeleted"] && n["@isdeleted"] == "true" ? i = !0 : (t == r.VisibleNotSoftDeleted || t == r.Any) && (!n["@isdeleted"] || n["@isdeleted"] && n["@isdeleted"] == "false") && (!n["@isvisible"] || n["@isvisible"] && n["@isvisible"] == "true") && (i = !0), i;
                }, t.prototype.getIdentifiers = function (n, t, r, u) {
                    var e, f, s, h, o, c;
                    for (typeof u == "undefined" && (u = i.Any), e = [], f = 0, s = t.length; f < s; f++)
                        t[f] && (t[f].resource && t[f].resource.metadata && t[f].resource.metadata.learningresourcetype && (t[f].resource.metadata.learningresourcetype === u || u === i.Any) && this.activityHasVisibility(t[f], r) && (h = t[f]["@identifier"], e.push(h)), t[f].item && (o = t[f].item, o && o.length > 0 && (c = this.getIdentifiers(n, o, r, u), e = e.concat(c))));
                    return e;
                }, t.prototype.getLessonIdentifiers = function (n, t) {
                    typeof n == "undefined" && (n = r.Visible);
                    typeof t == "undefined" && (t = f.SCO);
                    var i = this.getRootActivity();
                    return this.getLessonIdentifiersHelper(this, i.item, n, t);
                }, t.prototype.getLessonIdentifiersHelper = function (n, t, i, r) {
                    for (var s, h, o, c, e = [], u = 0, l = t.length; u < l; u++)
                        t[u] && (t[u].resource && (s = t[u].resource["@scormtype"] ? t[u].resource["@scormtype"] : "sco", (s === r || r === f.Any) && this.activityHasVisibility(t[u], i) && (h = t[u]["@identifier"], e.push(h))), t[u].item && (o = t[u].item, o && o.length > 0 && (c = this.getLessonIdentifiersHelper(n, o, i, r), e = e.concat(c))));
                    return e;
                }, t.prototype.getResourceVersion = function (n) {
                    return n && n.metadata && n.metadata.version ? n.metadata.version : "";
                }, t.prototype.getResourceUpdatedDate = function (n) {
                    return n && n.metadata && n.metadata.updateddate ? n.metadata.updateddate : "";
                }, t.prototype.getResourceCreatedVersion = function (n) {
                    return n && n.metadata && n.metadata.createdVersion ? n.metadata.createdVersion : "";
                }, t.prototype.getDurations = function (n) {
                    var t = this.getRootActivity();
                    return $.extend({}, this.getDurationsHelper(this, t.item, n));
                }, t.prototype.getDurationsHelper = function (t, i, u) {
                    var e, f, s, h, o, c;
                    for (typeof u == "undefined" && (u = r.VisibleNotSoftDeleted), e = [], f = 0, s = i.length; f < s; f++)
                        i[f] && (i[f].resource && i[f].resource.metadata && i[f].resource.metadata.duration && this.activityHasVisibility(i[f], u) && (h = i[f]["@identifier"], e[h] = n.learning.mlx.utility.convertHHMMSSToSeconds(i[f].resource.metadata.duration)), i[f].item && (o = i[f].item, o && o.length > 0 && (c = this.getDurationsHelper(t, o, u), $.extend(!0, e, c))));
                    return e;
                }, t.prototype.isDurationAvailable = function () {
                    var n = this.getRootActivity();
                    return this.isDurationAvailableHelper(this, n.item);
                }, t.prototype.isDurationAvailableHelper = function (n, t) {
                    for (var u, r = !1, i = 0, f = t.length; i < f; i++) {
                        if (t[i].resource && t[i].resource.metadata && t[i].resource.metadata.duration) {
                            r = !0;
                            break;
                        }
                        if (u = n.getActivityChildren(t[i]), u && u.length > 0 && (r = this.isDurationAvailableHelper(n, u), r))
                            break;
                    }
                    return r;
                }, t.prototype.getActivityMarkers = function (n) {
                    var r, u, f, t, i;
                    if (n && n.markers && (u = n.markers, f = u.length, f))
                        for (r = [], i = 0; i < f; i++)
                            t = u[i], r.push({ id: ko.observable(t["@id"]), type: ko.observable(t["@type"]), location: ko.observable(t.location), title: ko.observable(t.title) });
                    return r;
                }, t;
            }(), r, i, f, h, a, e, c, s, v, y, p, w, b, k, u, d, o;
            t.Scorm12ManifestReader = l;
            r = function () {
                function n() {
                }
                return n.Hidden = 0, n.Visible = 1, n.SoftDeleted = 2, n.VisibleNotSoftDeleted = 3, n.Any = 4, n;
            }();
            t.ManifestItemVisibility = r;
            i = function () {
                function n() {
                }
                return n.Video = "Video", n.Demo = "Demonstration", n.Simulation = "Simulation", n.Lab = "Lab", n.Assessment = "Exam", n.KnowledgeCheck = "Self Assessment", n.Word = "Microsoft Word", n.Excel = "Microsoft Excel", n.PowerPoint = "Microsoft PowerPoint", n.PDF = "PDF", n.Zip = "Zip", n.Embed = "Embed", n.HtmlCode = "HTML Code", n.DocumentDownload = "Document Download", n.Any = "", n;
            }();
            t.ManifestLearningResourceType = i;
            f = function () {
                function n() {
                }
                return n.Asset = "asset", n.SCO = "sco", n.Any = "", n;
            }();
            t.ManifestResourceScormType = f;
            h = function () {
                function n(n) {
                    this.sequencer = n;
                }
                return n.prototype.createPrerequistesExpression = function (n) {
                    var t = "";
                    return n.length > 0 && (t = n.length == 1 ? n[0] : n.join("&")), t;
                }, n.prototype.isValidPrerequistesExpression = function (n) {
                    return /^\w*(&{1}\w{1,})*/g.test(n);
                }, n.prototype.getItemIdentifiersFromPrerequistes = function (n) {
                    return n != "" ? n.split("&") : [];
                }, n.prototype.prerequisitesSatisfied = function (n) {
                    var u = n ? this.getItemIdentifiersFromPrerequistes(n) : [], e = !0, t, f, o, r, s;
                    if (u.length > 0)
                        for (r = 0, s = u.length; r < s; r++)
                            if (t = this.sequencer.getSpecifiedActivity(u[r], !1), f = t && t.resource(), o = f ? f.learningResourceType : "", t && o !== i.Assessment && !t.completed()) {
                                e = !1;
                                break;
                            }
                    return e;
                }, n;
            }();
            t.AiccScriptProcessor = h;
            a = function () {
                function n() {
                }
                return n.prototype.initialize = function (n, t, i) {
                    this.coursePlayerModel = n;
                    this.activityState = t;
                    this.aiccScriptProcessor = i;
                }, n.prototype.getNextActivity = function () {
                    var n = this.coursePlayerModel.activeResource().parent;
                    return this.getNextActivityHelper(n);
                }, n.prototype.getNextActivityById = function (n) {
                    var t = this.getSpecifiedActivity(n);
                    return this.getNextActivityHelper(t);
                }, n.prototype.getNextActivityHelper = function (n) {
                    var t = n;
                    do {
                        if (n && n.activities().length > 0)
                            n = n.activities()[0];
                        else if (n && n.parent && n.activityIndex() < n.parent.activities().length - 1)
                            n = n.parent.activities()[n.activityIndex() + 1];
                        else if (n && n.parent && n.parent.parent && n.parent.activityIndex() <= n.parent.parent.activities().length - 1) {
                            do
                                if (n = n.parent, n && n.parent && n.activityIndex() < n.parent.activities().length - 1) {
                                    n = n.parent.activities()[n.activityIndex() + 1];
                                    break;
                                } while (n);
                        } else if (n && n.parent && n.activityIndex() == n.parent.activities().length - 1) {
                            n = null;
                            break;
                        }
                        if (!n || n instanceof s) {
                            n = null;
                            break;
                        }
                    } while (n && (!n.resource() || !this.aiccScriptProcessor.prerequisitesSatisfied(n.mlxPrerequisites())));
                    return n;
                }, n.prototype.getPrevActivity = function () {
                    var n = this.coursePlayerModel.activeResource().parent;
                    return this.getPrevActivityHelper(n);
                }, n.prototype.getPrevActivityById = function (n) {
                    var t = this.getSpecifiedActivity(n);
                    return this.getPrevActivityHelper(t);
                }, n.prototype.getPrevActivityHelper = function (n) {
                    var t = n;
                    do {
                        if (n && n.parent && n.activityIndex() - 1 < 0)
                            n = n.parent;
                        else if (n.parent && n.activityIndex() - 1 >= 0)
                            for (n = n.parent.activities()[n.activityIndex() - 1]; n && n.activities().length > 0;)
                                n = n.activities()[n.activities().length - 1];
                        if (!n || n instanceof s) {
                            n = null;
                            break;
                        }
                    } while (n && (!n.resource() || !this.aiccScriptProcessor.prerequisitesSatisfied(n.mlxPrerequisites())));
                    return n;
                }, n.prototype.getStartingActivity = function () {
                    var t = this, n = $.Deferred(), i = ko.utils.unwrapObservable(this.coursePlayerModel.activities());
                    return this.activityState.getValue("mlx.start_location", !0).done(function (r) {
                        var f = null, u;
                        r != "" && (u = t.getSpecifiedActivityHelper(i, r), u && t.aiccScriptProcessor.prerequisitesSatisfied(u.mlxPrerequisites()) && (f = u));
                        n.resolve(f);
                    }).fail(function () {
                        n.reject();
                    }), n.promise();
                }, n.prototype.getSpecifiedActivity = function (n, t) {
                    var u, r, i, f;
                    return typeof t == "undefined" && (t = !0), u = ko.utils.unwrapObservable(this.coursePlayerModel.activities()), r = null, n != "" && (i = this.getSpecifiedActivityHelper(u, n), f = t && i != null ? this.aiccScriptProcessor.prerequisitesSatisfied(i.mlxPrerequisites()) : !0, i && f && (r = i)), r;
                }, n.prototype.getSpecifiedActivityHelper = function (n, t) {
                    for (var r = null, i = 0, u = n.length; i < u; i++)
                        if (n[i].id() == t) {
                            r = n[i];
                            break;
                        } else if (ko.utils.unwrapObservable(n[i].activities()).length > 0 && (r = this.getSpecifiedActivityHelper(ko.utils.unwrapObservable(n[i].activities()), t), r))
                            break;
                    return r;
                }, n;
            }();
            t.Scorm12Sequencer = a;
            e = function () {
                function t() {
                    var n = this;
                    this.activities = ko.observableArray([]);
                    this.id = ko.observable("");
                    this.title = ko.observable("");
                    this.fullTitle = ko.observable("");
                    this.activityIndex = ko.observable(-1);
                    this.resource = ko.observable(null);
                    this.prerequisites = ko.observable("");
                    this.mlxPrerequisites = ko.observable("");
                    this.childrenVisible = ko.observable(!0);
                    this.contentLevel = ko.observable(-1);
                    this.completed = ko.observable(!1);
                    this.completedWithChildren = !1;
                    this.duration = ko.observable(0);
                    this.expectedDurationTime = ko.observable("00:00:00");
                    this.progressTime = ko.observable("00:00:00");
                    this.progressPercentage = ko.observable(0);
                    this.assessmentQuestionsCount = ko.observable(0);
                    this.assessmentQuestionsCorrectCount = ko.observable(0);
                    this.firstAccessed = ko.observable();
                    this.lastAccessed = ko.observable();
                    this.completedDate = ko.observable();
                    this.descendantsAndSelfActivityCount = 0;
                    this.progress = ko.observable(0);
                    this.versionChanged = ko.observable(!1);
                    this.updatedContentAvailable = ko.observable(!1);
                    this.newContentAvailable = ko.observable(!1);
                    this.newContentAvailableSinceUserLastAccessed = ko.observable(!1);
                    this.description = ko.observable("");
                    this.activityMarkedForDelete = !1;
                    this.userLaunchVersion = "";
                    this.requiredForCourseCompletion = !1;
                    this.markers = ko.observableArray([]);
                    this.isActive = ko.computed(function () {
                        var i = n.resource(), t, e;
                        if (i && i.isActive())
                            return !0;
                        var r = !1, u = n.activities(), f = undefined;
                        for (t = 0, e = u.length; t < e; t++)
                            f = u[t], f.isActive() && (r = !0);
                        return r;
                    }, this);
                    this.prerequisitesSatisified = ko.computed(function () {
                        var t = ko.utils.unwrapObservable(n.mlxPrerequisites);
                        return t ? n.coursePlayerModel.prerequisitesSatisfied(t) : !0;
                    }, this);
                }
                return t.prototype.getDurationRollup = function (t) {
                    var f = 0, e = "", u, i, r, o;
                    if (t.activities().length > 0) {
                        for (u = t.activities(), i = undefined, r = 0, o = u.length; r < o; r++)
                            i = u[r], i.completed() && (f += i.duration());
                        e = n.learning.mlx.utility.convertSecondsToHHMMSS(f);
                    }
                    return e;
                }, t.prototype.init = function (r, u, f, e, o, s, h, l, a, v) {
                    var y, d, nt, g, et, it, w, b, f, k, rt, ut, ot;
                    if (typeof v == "undefined" && (v = !1), o) {
                        this.id(o.getActivityId(u));
                        y = this;
                        d = this.id();
                        this.coursePlayerModel = l;
                        this.title(o.getActivityTitle(u));
                        this.fullTitle(h === 1 ? "Module " + (e + 1) + ": " + this.title() : this.title());
                        this.activityIndex(e);
                        this.parent = f;
                        this.prerequisites(o.getPrerequisites(u));
                        this.contentLevel(h);
                        this.activityState = s;
                        this.markers(o.getActivityMarkers(u));
                        this.description(o.getActivityDescription(u));
                        this.activityMarkedForDelete = o.getActivityDeleted(u);
                        nt = a.global;
                        this.userLaunchVersion = nt && typeof nt.courseVersion != "undefined" ? nt.courseVersion : "";
                        var p = a[d], tt = this.activities(), ft = o.getActivityChildren(u, a, v);
                        for (g = 0, et = ft.length; g < et; g++)
                            y.activities.push((new t).init(r, ft[g], y, g, o, s, h + 1, l, a, v));
                        h == 1 && y.expectedDurationTime(o.getDurationTimeRollupForActivity(u));
                        v || (l.activityArray[d] = y);
                        l.isCourseContentDeletedSinceUserLastLaunch || this.activityMarkedForDelete && u.deletedVersion > this.userLaunchVersion && (l.isCourseContentDeletedSinceUserLastLaunch = !0);
                        it = o.getResourceNode(u);
                        it ? (w = !1, y.resource(new c(it, u, y, o, r)), y.duration(y.resource().duration()), y.requiredForCourseCompletion = y.resource().scormType === "sco", y.description() || y.description(y.resource().description()), b = p != undefined && p.lessonStatus != undefined ? p.lessonStatus : "not attempted", (b == "completed" || b == "passed" || b == "failed") && (w = !0), w && tt.length && !y.completedWithChildren && (y.completedWithChildren = !0), w && (!tt.length || tt.length && y.childrenAreCompleted() && y.completedWithChildren) || (w = !1), f = y.parent, f instanceof t && !(w && !f.completed() && f.completedWithChildren && f.childrenAreCompleted()) && y.parent.completed(!1), k = y.resource(), y.resourceVersionHasChanged(p) && (y.versionChanged(!0), y.updatedContentAvailable(!0), b == "incomplete" && (y.activityState.resetActivityProgress(d), b = "not attempted", w = !1)), k.createdVersion != "" && b == "not attempted" && (y.newContentAvailable(!0), k.createdVersion > this.userLaunchVersion && y.newContentAvailableSinceUserLastAccessed(!0)), y.lessonStatus = b, y.completed(w), w && (k.learningResourceType === i.Assessment || k.learningResourceType.toLowerCase() === i.KnowledgeCheck.toLowerCase()) && y.activityState.getCompletedAssessmentQuestionsInfo(d).done(function (n) {
                            y.assessmentQuestionsCount(n.totalQuestionsCount);
                            y.assessmentQuestionsCorrectCount(n.correctQuestionsCount);
                        }), p != undefined && (y.firstAccessed(p.firstAccessed), y.lastAccessed(p.lastAccessed), y.completedDate(p.completedDate)), k.learningResourceType === i.Video && p != undefined && p.lessonLocation !== undefined && (rt = Math.round(p.lessonLocation), ut = rt ? parseFloat(rt.toString()) : 0, ot = n.learning.mlx.utility.convertSecondsToHHMMSS(Math.round(ut)), y.progressTime(ot), y.progressPercentage(Math.round(ut / y.duration() * 100))), p != undefined && p.mlxPrerequisites !== undefined && y.mlxPrerequisites(p.mlxPrerequisites)) : tt.length && (y.completedWithChildren = !0);
                    }
                    return this;
                }, t.prototype.childrenAreCompleted = function () {
                    for (var r = !1, u = 0, t = this.activities(), n = undefined, f = undefined, i = 0, e = t.length; i < e; i++)
                        n = t[i], f = n && n.resource(), (n.completed() || !n.requiredForCourseCompletion || n.newContentAvailable() && n.activityMarkedForDelete && f.createdVersion > n.userLaunchVersion) && u++;
                    return u == t.length && (r = !0), r;
                }, t.prototype.childrenAreStarted = function () {
                    for (var n = !1, i = this.activities(), u = [], r = $.Deferred(), t = 0, f = i.length; t < f; t++) {
                        if (i[t].completed()) {
                            n = !0;
                            break;
                        }
                        u.push(i[t].id());
                    }
                    return n ? r.resolve(n) : this.activityState.getScopedValues("cmi.core.lesson_status", u, !0).done(function (t) {
                        for (var i = 0, u = t.length; i < u; i++)
                            if (t[i].status !== "not attempted") {
                                n = !0;
                                break;
                            }
                        r.resolve(n);
                    }), r.promise();
                }, t.prototype.resourceVersionHasChanged = function (n) {
                    var t = !1, i = this.resource() ? this.resource().version : "", r = n != undefined ? n.version : "1.0.0.0";
                    return i > r && (t = !0), t;
                }, t.buildActivityTree = function (n, i, r, u, f, e) {
                    var s = n.getRootActivity(), o = $.Deferred();
                    return r.getInitialActivityTreeData().done(function (h) {
                        for (var a, v = n.getActivityChildren(s, h, !0), c = 0, l = v.length; c < l; c++)
                            f.push((new t).init(e, v[c], i, c, n, r, 1, i, h, !0));
                        for (a = n.getActivityChildren(s), c = 0, l = a.length; c < l; c++)
                            u.push((new t).init(e, a[c], i, c, n, r, 1, i, h));
                        o.resolve(u);
                    }).fail(function () {
                        o.reject();
                    }), o.promise();
                }, t.buildActivitySubtreeById = function (n, i, r, u, f, e) {
                    var s = i.getActivityLineage(n), o = $.Deferred();
                    return s ? u.getInitialActivityTreeData().done(function (n) {
                        f.push((new t).init(e, s, r, 0, i, u, 1, r, n));
                        o.resolve(f);
                    }).fail(function () {
                        o.reject();
                    }) : o.reject(), o.promise();
                }, t.createActivityById = function (n, i, r, u, f) {
                    var o = i.getActivityNode(n), s = undefined, e = $.Deferred();
                    return o && !i.getActivityDeleted(o) ? u.getInitialActivityTreeData().done(function (n) {
                        s = new t;
                        s.init(f, o, r, 1, i, u, 1, r, n);
                        e.resolve(s);
                    }).fail(function () {
                        e.reject();
                    }) : e.reject(), e.promise();
                }, t;
            }();
            t.Activity = e;
            c = function () {
                function t(t, i, r, u, f) {
                    this.content = ko.observable("");
                    this.isActive = ko.observable(!1);
                    this.resRef = u.getResourceHRef(t) + u.getActivityParameters(i);
                    this.parent = r;
                    this.content = ko.observable("");
                    this.isActive = ko.observable(!1);
                    this.durationText = ko.observable(u.getResourceDuration(t));
                    this.duration = ko.observable(this.durationText() ? n.learning.mlx.utility.convertHHMMSSToSeconds(this.durationText()) : 0);
                    this.learningResourceType = u.getLearningResourceType(t);
                    this.mediaType = ko.observable(this.parent.coursePlayerModel.getMediaType(this.learningResourceType));
                    this.version = u.getResourceVersion(t);
                    this.updateDate = u.getResourceUpdatedDate(t);
                    this.createdVersion = u.getResourceCreatedVersion(t);
                    this.description = ko.observable(u.getResourceDescription(t));
                    this.baseUrl = u.baseUrl;
                    this.platformBuildVersion = f;
                    this.scormType = u.getResourceScormType(t);
                }
                return t.prototype.activateResource = function (t, r) {
                    var u, f = this.learningResourceType, e, o, s, h, c, l;
                    this.isActive() ? u = this.content() : (u = this.platformBuildVersion && this.resRef.toLowerCase().startsWith("../../common/") ? this.baseUrl + "/../../" + this.platformBuildVersion + "/common/" + this.resRef.slice(13, this.resRef.length) : this.baseUrl + "/" + this.resRef, f && (f == i.Assessment || f.toLowerCase() == i.KnowledgeCheck.toLowerCase() || f == i.Video || f == i.Word || f == i.Excel || f == i.PowerPoint || f == i.PDF || f == i.Zip || f == i.Embed || f == i.HtmlCode || f == i.DocumentDownload) && (e = {}, o = /https?:\/\/([^\/]*)\/([0-9]+-[0-9]+\/[a-z]+-[a-z]+)/i.exec(u), o || (o = /https?:\/\/([^\/]*)\/r([0-9]+)\/([0-9]+-[0-9]+\/[a-z]+-[a-z]+)/i.exec(u)), o && o.length > 2 && (e.courseIdAndLang = o[o.length - 1]), s = n.learning.mlx.utility.getQueryStringParamValue("preview"), s && s !== "" && (e.preview = s), f === i.Video && (e.serverDateTime = r, e.apiHost = MLX.context.apiHost), this.isVersionedResourceType() && (e.v = platformVersion), u = n.learning.mlx.utility.addQueryStringParams(u, e, !1)));
                    t ? (h = t.split("="), h.length === 2 && (u = n.learning.mlx.utility.updateUrlHashParamValue(u, h[0], h[1]))) : (c = u.lastIndexOf("?"), l = u.lastIndexOf("#"), c > 0 && l > c && (u = u.substring(0, l)));
                    f === i.Video && (u = n.learning.mlx.utility.updateUrlHashParamValue(u, "play", this.parent.coursePlayerModel.startVideoPlayback));
                    this.content(u);
                    this.isActive(!0);
                }, t.prototype.deactivateResource = function () {
                    var n = this;
                    return ScoTunnel.proxy({ target: "SCO_Wrapper_API.reloadFrame", data: [MLX.context.scheme + "://" + MLX.context.apiHost + "/blank.html?" + Math.random().toString(20).substring(3)] }).done(function () {
                        n.isActive(!1);
                    });
                }, t.prototype.updateUrlHashParamValue = function (t, i) {
                    var r = this, u = n.learning.mlx.utility.updateUrlHashParamValue(r.content(), t, i);
                    r.content(u);
                }, t.prototype.isVersionedResourceType = function () {
                    var n = this.learningResourceType;
                    return n === i.Lab || n === i.Assessment || n.toLowerCase() === i.KnowledgeCheck.toLowerCase() || n === i.Video ? !0 : !1;
                }, t;
            }();
            t.Resource = c;
            s = function (t) {
                function s(i, r, u, f, e) {
                    t.call(this);
                    this.activities = ko.observableArray([]);
                    this.previousActivities = ko.observableArray([]);
                    this.durationCompleted = 0;
                    this.courseCompleted = !1;
                    this.activeResource = ko.observable(null);
                    this.courseLoaded = ko.observable(!1);
                    this.courseTitle = ko.observable("");
                    this.isDurationAvailable = ko.observable(!1);
                    this.isCourseContentDeletedSinceUserLastLaunch = !1;
                    this.autoPlay = ko.observable(!1);
                    this.launchFirstActivityOnCourseLoad = ko.observable(!1);
                    this.moduleCount = 0;
                    this.assessmentCount = 0;
                    this.knowledgeCheckCount = 0;
                    this.expectedCourseDuration = "00:00:00";
                    this.startVideoPlayback = !1;
                    this.uiMode = 0;
                    this.courseHasPreviouslyStarted = !1;
                    this.rollupParentCompletion = !0;
                    this.manifestReader = r != undefined ? r : new l(null);
                    this.sequencer = u != undefined ? u : new n.learning.mlx.Scorm12Sequencer;
                    this.webTrendsHelper = e != undefined ? e : new n.learning.mlx.WebTrendsHelper;
                    this.aiccScriptProcessor = new h(this.sequencer);
                    this.platformBuildVersion = i;
                    this.globalSettings = f;
                }
                return __extends(s, t), s.prototype.initialize = function (t, i, u, o, s, h) {
                    this.activityState = i;
                    this.userId = h;
                    this.isAnonymousRequest = !MLX.context.currentUser.isAuthenticated && MLX.context.isAnonymousTenant ? !0 : !1;
                    var c = this, l = $.Deferred();
                    return c.rollupParentCompletion = !0, c.autoPlay(c.globalSettings.getValue("AutoPlay")), c.startVideoPlayback = !1, c.autoPlay.subscribe(function () {
                        c.globalSettings.setValue("AutoPlay", c.autoPlay());
                        c.globalSettings.saveSettings(c.userId, c.isAnonymousRequest);
                    }), c.courseIdentifier = t, c.courseVersion = u, c.courseLanguageCode = s, c.activities.removeAll(), c.previousActivities.removeAll(), c.activityArray = [], c.isDurationAvailable(c.manifestReader.isDurationAvailable()), c.activityState.getDurationCompleted().done(function (n) {
                        c.durationCompleted = parseInt(n) || 0;
                        c.courseCompleted = c.durationCompleted === 100;
                    }), c.courseTitle(c.manifestReader.getCourseTitle()), c.sequencer.initialize(c, i, c.aiccScriptProcessor), c.courseLevel = o, c.moduleCount = c.manifestReader.getModulesCount(), c.assessmentCount = c.manifestReader.getAssessmentsCount(), c.expectedCourseDuration = c.manifestReader.getTotalVideoDuration(), c.activityState.activityStateDataExists().done(function (n) {
                        c.courseHasPreviouslyStarted = n;
                    }), c.isCourseContentDeletedSinceUserLastLaunch = !1, e.buildActivityTree(c.manifestReader, c, c.activityState, c.activities, c.previousActivities, c.platformBuildVersion).done(function () {
                        c.activityState.initializeTopicAndAssessmentValues(c.getTopicsTotal(), c.manifestReader.getAssessmentsCount(), c.manifestReader.getAssessmentIdentifiers(r.Visible), c.manifestReader.getAssessmentIdentifiers(r.Hidden), c.manifestReader.getDurations(r.VisibleNotSoftDeleted), c.manifestReader.getLessonIdentifiers(r.SoftDeleted, f.Any), c.manifestReader.getLessonIdentifiers(r.VisibleNotSoftDeleted, f.Asset)).done(function () {
                            for (var r = c.activities(), e = c.previousActivities(), t, u, o = !1, s = !1, i = !1, f = 0, h = r.length; f < h; f++)
                                t = r[f], u = ko.utils.arrayFirst(e, function (n) {
                                    return n.id() == t.id();
                                }), t.updatedContentAvailable(c.subtreeHasPropertyValueSetToTrue(t, "versionChanged")), t.updatedContentAvailable() && (o = !0), t.newContentAvailable(c.subtreeHasPropertyValueSetToTrue(t, "newContentAvailable")), t.newContentAvailableSinceUserLastAccessed(c.subtreeHasPropertyValueSetToTrue(t, "newContentAvailableSinceUserLastAccessed")), t.newContentAvailableSinceUserLastAccessed() && (s = !0), t.descendantsAndSelfActivityCount = c.getDescendantsAndSelfActivityCount(t), c.updateProgress(t), t.parent instanceof n.learning.mlx.CoursePlayerModel && !t.resource() && t.activities().length && t.childrenAreCompleted() && (u && !u.childrenAreCompleted() && (c.setCompleted(t.id()), i = !0), t.completed(!0));
                            i || (i = c.handleCourseCompletionEvent(e, r));
                            MLX.context.currentUser.isAuthenticated && MLX.context.currentUser.isActive && (o || s || i) && c.activityState.save(!0);
                            c.courseLoaded(!0);
                            l.resolve();
                        }).fail(function () {
                            l.reject();
                        });
                    }).fail(function () {
                        l.reject();
                    }), l.promise();
                }, s.prototype.initializeActivity = function (n, t, i, u, o, s, h) {
                    this.activityState = i;
                    this.userId = h;
                    var c = this, l = $.Deferred();
                    return c.rollupParentCompletion = !1, c.autoPlay(!1), c.startVideoPlayback = !1, c.courseIdentifier = t, c.courseVersion = u, c.courseLanguageCode = s, c.activities.removeAll(), c.previousActivities.removeAll(), c.activityArray = [], c.isDurationAvailable(c.manifestReader.isDurationAvailable()), c.activityState.getDurationCompleted().done(function (n) {
                        c.durationCompleted = parseInt(n) || 0;
                        c.courseCompleted = c.durationCompleted === 100;
                    }), c.courseTitle(c.manifestReader.getCourseTitle()), c.sequencer.initialize(c, i, c.aiccScriptProcessor), c.courseLevel = o, c.moduleCount = c.manifestReader.getModulesCount(), c.assessmentCount = c.manifestReader.getAssessmentsCount(), c.expectedCourseDuration = c.manifestReader.getTotalVideoDuration(), c.activityState.activityStateDataExists().done(function (n) {
                        c.courseHasPreviouslyStarted = n;
                    }), e.buildActivitySubtreeById(n, c.manifestReader, c, c.activityState, c.activities, c.platformBuildVersion).done(function () {
                        c.activityState.initializeTopicAndAssessmentValues(c.getTopicsTotal(), c.manifestReader.getAssessmentsCount(), c.manifestReader.getAssessmentIdentifiers(r.Visible), c.manifestReader.getAssessmentIdentifiers(r.Hidden), c.manifestReader.getDurations(r.VisibleNotSoftDeleted), c.manifestReader.getLessonIdentifiers(r.SoftDeleted, f.Any), c.manifestReader.getLessonIdentifiers(r.VisibleNotSoftDeleted, f.Asset)).done(function () {
                            for (var i = c.activities(), n, r = !1, u = !1, t = 0, f = i.length; t < f; t++)
                                n = i[t], n.updatedContentAvailable(c.subtreeHasPropertyValueSetToTrue(n, "versionChanged")), n.updatedContentAvailable() && (r = !0), n.newContentAvailable(c.subtreeHasPropertyValueSetToTrue(n, "newContentAvailable")), n.newContentAvailableSinceUserLastAccessed(c.subtreeHasPropertyValueSetToTrue(n, "newContentAvailableSinceUserLastAccessed")), n.newContentAvailableSinceUserLastAccessed() && (u = !0);
                            MLX.context.currentUser.isAuthenticated && MLX.context.currentUser.isActive && (r || u || !1) && c.activityState.save(!0);
                            c.courseLoaded(!0);
                            l.resolve();
                        }).fail(function () {
                            l.reject();
                        });
                    }).fail(function () {
                        l.reject();
                    }), l.promise();
                }, s.prototype.handleCourseCompletionEvent = function (n, t) {
                    for (var r, s = this, u = !1, f = !1, i = 0, o = n.length; i < o; i++)
                        if (r = n[i], r && r.activities().length)
                            if (r.childrenAreCompleted())
                                u = !0;
                            else {
                                u = !1;
                                break;
                            }
                        else
                            u = s.determineAssessmentCompletion(r);
                    for (i = 0, o = t.length; i < o; i++)
                        if (r = t[i], r.childrenAreCompleted())
                            f = !0;
                        else {
                            f = !1;
                            break;
                        }
                    return !u && f ? (s.raiseCompletionEvent(new e), !0) : !1;
                }, s.prototype.determineAssessmentCompletion = function (n) {
                    var t = !1, i;
                    return n && !n.activities().length && (i = n.resource(), t = n.completed() || n.newContentAvailableSinceUserLastAccessed() && n.activityMarkedForDelete), t;
                }, s.prototype.getMediaType = function (n) {
                    var t = "";
                    return n && (t = n.toLowerCase().replace(" ", "-")), t;
                }, s.prototype.setCompleted = function (n) {
                    return this.rollupActivityCompletion(n), this.durationCompleted;
                }, s.prototype.setCompletedActivities = function (n) {
                    var t = this;
                    return $.each(n, function (n, i) {
                        t.rollupActivityCompletion(i);
                    }), t.durationCompleted;
                }, s.prototype.attemptAutoNavigation = function () {
                    var t = this, n = $.Deferred();
                    return t.autoPlay() && t.getNextResource().done(function () {
                        n.resolve();
                    }).fail(function () {
                        n.reject();
                    }), n.promise();
                }, s.prototype.rollupActivityCompletion = function (n) {
                    var t = this.activityArray[n], i;
                    if (!t.completed()) {
                        if (t.activities().length && !t.completedWithChildren && (t.completedWithChildren = !0), (!t.activities().length || t.activities().length && t.childrenAreCompleted() && t.completedWithChildren) && (t.requiredForCourseCompletion && (this.durationCompleted = this.durationCompleted + t.duration()), t.completed(!0)), this.rollupParentCompletion && (i = t.parent, i && i.completed))
                            do
                                if (!i.completed() && i.completedWithChildren) {
                                    if (i.childrenAreCompleted())
                                        this.durationCompleted = this.durationCompleted + i.duration(), i.completed(!0), this.raiseCompletionEvent(i);
                                    else
                                        break;
                                    i = i.parent ? i.parent : null;
                                } else
                                    break; while (i && !(i instanceof s));
                        this.updateProgress(t);
                        this.raiseCompletionEvent(t);
                    }
                    this.webTrendsHelper.logLearningResourceEnd(this.courseTitle(), this.courseIdentifier, t.resource() ? t.resource().learningResourceType : "", t.contentLevel(), t.title());
                }, s.prototype.raiseCompletionEvent = function (n) {
                    var t = this;
                    n && $.when(t.activityState.getCompletionStats()).done(function (r) {
                        var f = { course: { id: t.courseIdentifier, languageCode: t.courseLanguageCode, title: t.courseTitle(), version: t.courseVersion } }, u, e, o, s;
                        $.extend(f.course, r);
                        u = n && n.resource();
                        (!u || u && u.learningResourceType !== i.Assessment) && (n.contentLevel() === 1 ? (e = { module: { id: n.id(), title: n.title() } }, u && (e.module.learningResourceType = u.learningResourceType), $.extend(f, e), t.notifySubscribers(32, f)) : n.contentLevel() === 2 ? (o = { module: { id: n.parent.id(), title: n.parent.title() }, lesson: { id: n.id(), title: n.title() } }, u && (o.lesson.learningResourceType = u.learningResourceType), $.extend(f, o), t.notifySubscribers(8, f)) : n.contentLevel() === 3 && (s = { module: { id: n.parent.parent.id(), title: n.parent.parent.title() }, lesson: { id: n.parent.id(), title: n.parent.title() }, topic: { id: n.id(), title: n.title(), learningResourceType: u.learningResourceType } }, $.extend(f, s), t.notifySubscribers(2, f)));
                        t.courseCompleted || r.percentCompleted !== 100 || (t.courseCompleted = !0, t.notifySubscribers(512, f));
                    });
                }, s.prototype.raiseStartedEvent = function (n) {
                    var t = { course: { id: this.courseIdentifier, title: this.courseTitle() } }, r = n && n.resource(), e, u, f, o;
                    n.contentLevel() === 2 && (e = this, u = n && n.parent, u.childrenAreStarted().done(function (n) {
                        if (!n) {
                            var i = { module: { id: u.id(), title: u.title() } };
                            $.extend(t, i);
                            e.notifySubscribers(16, t);
                        }
                    }));
                    (!r || r && r.learningResourceType !== i.Assessment) && (n.contentLevel() === 2 ? (f = { module: { id: n.parent.id(), title: n.parent.title() }, lesson: { id: n.id(), title: n.title() } }, r && (f.lesson.learningResourceType = r.learningResourceType), $.extend(t, f), this.notifySubscribers(4, t)) : n.contentLevel() === 3 && (o = { module: { id: n.parent.parent.id(), title: n.parent.parent.title() }, lesson: { id: n.parent.id(), title: n.parent.title() }, topic: { id: n.id(), title: n.title(), learningResourceType: r.learningResourceType } }, $.extend(t, o), this.notifySubscribers(1, t)));
                }, s.prototype.raiseAssessmentStartedEvent = function (n) {
                    var t = this.activeResource().parent, u = t && t.resource(), r, f, e;
                    t && u && u.learningResourceType === i.Assessment && (r = { course: { id: this.courseIdentifier, title: this.courseTitle() } }, t.contentLevel() === 1 ? (f = { assessment: { id: t.id(), title: t.title(), attempts: n } }, $.extend(r, f)) : t.contentLevel() === 2 && (e = { module: { id: t.parent.id(), title: t.parent.title() }, assessment: { id: t.id(), title: t.title(), attempts: n } }, $.extend(r, e)), this.notifySubscribers(64, r));
                }, s.prototype.raiseAssessmentCompletedEvent = function (n) {
                    var t = this.activeResource().parent;
                    this.raiseAssessmentCompletedEventForActivity(t, n);
                }, s.prototype.raiseAssessmentCompletedEventForActivity = function (n, t) {
                    var r = this, u = n && n.resource();
                    n && u && u.learningResourceType === i.Assessment && $.when(r.activityState.getCompletionStats()).done(function (i) {
                        var u = { course: { id: r.courseIdentifier, title: r.courseTitle() } }, f, e;
                        $.extend(u.course, i);
                        n.contentLevel() === 1 ? (f = { assessment: { id: n.id(), title: n.title(), result: t } }, $.extend(u, f)) : n.contentLevel() === 2 && (e = { module: { id: n.parent.id(), title: n.parent.title() }, assessment: { id: n.id(), title: n.title(), result: t } }, $.extend(u, e));
                        r.notifySubscribers(128, u);
                    });
                }, s.prototype.raiseAssessmentCompletedEventsForTestout = function (n, t) {
                    for (var i, r = 0, u = n.length; r < u; r++)
                        i = this.sequencer.getSpecifiedActivity(n[r]), i && this.raiseAssessmentCompletedEventForActivity(i, t);
                }, s.prototype.getCurrentActivityTitle = function () {
                    var n = this.activeResource().parent;
                    return n.title();
                }, s.prototype.getCurrentResourceVersion = function () {
                    return this.activeResource().version || this.activeResource().createdVersion || "";
                }, s.prototype.raiseDisplayContentRequestEvent = function (n) {
                    var t = this.activeResource().parent, i = { course: { id: this.courseIdentifier, languageCode: this.courseLanguageCode, title: this.courseTitle(), version: this.courseVersion }, module: { id: t.parent.id(), title: t.parent.title() }, lesson: { id: t.id(), title: t.title(), learningresourcetype: t.resource().learningResourceType }, resource: { url: n } };
                    this.notifySubscribers(4194304, i);
                }, s.prototype.raiseCourseStartedEvent = function () {
                    var n = { course: { id: this.courseIdentifier, title: this.courseTitle() } };
                    this.notifySubscribers(256, n);
                }, s.prototype.raiseVideoPlayerEvent = function (n, t) {
                    var r = this.activeResource().parent, i, f, e;
                    r.contentLevel() === 2 ? (f = { module: { id: r.parent.id(), title: r.parent.title() }, lesson: { id: r.id(), title: r.title() } }, $.extend(t, f)) : r.contentLevel() === 3 && (e = { module: { id: r.parent.parent.id(), title: r.parent.parent.title() }, lesson: { id: r.parent.id(), title: r.parent.title() }, topic: { id: r.id(), title: r.title() } }, $.extend(t, e));
                    switch (n) {
                        case u.Play:
                            i = 1024;
                            break;
                        case u.Stop:
                        case u.VideoEnded:
                        case u.Exit:
                            i = 2048;
                            break;
                        case u.Pause:
                            i = 4096;
                            break;
                        case u.Skip:
                        case u.Scrub:
                        case u.Bookmark:
                            i = 8192;
                            break;
                        case u.Milestone:
                            i = 16384;
                            break;
                        case u.Volume:
                            i = 65536;
                            break;
                        case u.ClosedCaption:
                            i = 32768;
                            break;
                        case u.Resolution:
                            i = 131072;
                            break;
                        case u.Speed:
                            i = 262144;
                            break;
                        case u.Download:
                            i = 524288;
                            break;
                        case u.Fullscreen:
                            i = 1048576;
                            break;
                        case u.AccumulatedPlaybackTime:
                            i = 2097152;
                            break;
                        case u.TextTrackLoad:
                            i = 8388608;
                    }
                    i && this.notifySubscribers(i, t);
                }, s.prototype.updateVideoProgress = function (t, i) {
                    var r = this.activityArray[t], u, f;
                    r && (u = n.learning.mlx.utility.convertSecondsToHHMMSS(Math.round(i)), r.progressTime(u), f = Math.round(i / r.duration() * 100), r.progressPercentage(f));
                }, s.prototype.updateAssessmentProgress = function (n, t, i) {
                    var r = this.activityArray[n];
                    r && (r.assessmentQuestionsCount(t), r.assessmentQuestionsCorrectCount(i));
                }, s.prototype.updateActivityDateStamps = function (n, t) {
                    var i = this.activityArray[n];
                    i.firstAccessed(t.firstAccessed);
                    i.lastAccessed(t.lastAccessed);
                    i.completedDate(t.completedDate);
                }, s.prototype.getPrevResource = function () {
                    var n = this.sequencer.getPrevActivity();
                    return this.activateResource(n, null);
                }, s.prototype.getNextResource = function () {
                    var n = this.sequencer.getNextActivity();
                    return this.activateResource(n, null);
                }, s.prototype.getSelectedResource = function (n, t) {
                    return this.activateResource(n, t);
                }, s.prototype.getSpecifiedResource = function (n, t) {
                    var i = this.sequencer.getSpecifiedActivity(n);
                    return this.activateResource(i, t);
                }, s.prototype.startCourse = function (n) {
                    var t = this, i = $.Deferred();
                    return n ? t.activateResource(n, null).done(function () {
                        i.resolve();
                    }).fail(function () {
                        i.reject();
                    }) : t.sequencer.getStartingActivity().done(function (n) {
                        if (t.webTrendsHelper.logCourseStart(t.courseTitle(), t.courseIdentifier), n)
                            t.activateResource(n, null).done(function () {
                                i.resolve();
                            }).fail(function () {
                                i.reject();
                            });
                        else {
                            var r = ko.utils.unwrapObservable(t.activities());
                            t.activateFirstResource(r[0]).done(function () {
                                i.resolve();
                            }).fail(function () {
                                i.reject();
                            });
                        }
                    }).fail(function () {
                        i.reject();
                    }), i.promise();
                }, s.prototype.endCourse = function () {
                    var n = this, t = $.Deferred();
                    return this.courseLoaded() ? this.activeResource() ? this.doDeactivation().done(function () {
                        n.courseLoaded(!1);
                        n.activities.removeAll();
                        n.webTrendsHelper.logCourseEnd(n.courseTitle(), n.courseIdentifier);
                        var i = function () {
                            n.activityState.isSaveCompleted().done(function (n) {
                                n !== !0 ? window.setTimeout(i, 200) : t.resolve();
                            }).fail(function () {
                                t.reject();
                            });
                        };
                        window.setTimeout(i, 500);
                    }).fail(function () {
                        t.reject();
                    }) : t.resolve() : t.resolve(), t.promise();
                }, s.prototype.sendCoursePlayerEventToBIService = function (n, t) {
                    return MLX.ajax({ url: "/sdk/bievents/v1.0/" + n, type: "POST", dataType: "json", data: JSON.stringify(t), contentType: "application/json" }).fail(function (n) {
                        console.log("Failed to send BI event data to the MLX Platform. " + n.statusCode + " " + n.statusMessage + " " + n.responseText);
                    });
                }, s.prototype.sendEmbeddedPlayerEventToBIService = function (n, t) {
                    return MLX.ajax({ url: "/sdk/bievents/v1.0/embedded/" + n, type: "POST", dataType: "json", data: JSON.stringify(t), contentType: "application/json" }).fail(function (n) {
                        console.log("Failed to send BI event data to the MLX Platform. " + n.statusCode + " " + n.statusMessage + " " + n.responseText);
                    });
                }, s.prototype.activateFirstResource = function (n) {
                    while (n.activities().length > 0)
                        n = n.activities()[0];
                    return this.activateResource(n, null);
                }, s.prototype.activateLastResource = function (n) {
                    while (n.activities().length > 0)
                        n = n.activities()[n.activities().length - 1];
                    return this.activateResource(n, null);
                }, s.prototype.activateResource = function (n, t) {
                    var f = this, i = $.Deferred(), r = n && n.resource(), u;
                    return r && !r.isActive() ? (u = this.aiccScriptProcessor.prerequisitesSatisfied(n.mlxPrerequisites()), u ? this.activeResource() ? this.doDeactivation().done(function () {
                        f.doActivation(n, t).done(function () {
                            i.resolve();
                        });
                    }).fail(function () {
                        i.reject();
                    }) : this.doActivation(n, t).done(function () {
                        i.resolve();
                    }).fail(function () {
                        i.reject();
                    }) : i.reject()) : r && r.isActive() ? (this.startVideoPlayback || (this.startVideoPlayback = !0), r.activateResource(t), i.resolve()) : i.reject(), i.promise();
                }, s.prototype.doActivation = function (t, r) {
                    var e = this, u = this, f = $.Deferred();
                    return MLX.ajax({ url: MLX.context.scheme + "://" + MLX.context.apiHost + "/services/learners/courseactivities/ping", dataType: "json" }).done(function (o) {
                        var h = t.id(), s = t.resource(), c = s.version || s.createdVersion || "";
                        u.activityState.initializeCurrentActivity(h, s.learningResourceType, c).done(function () {
                            var c, h;
                            s.activateResource(r, o);
                            u.webTrendsHelper.logLearningResourceStart(u.courseTitle(), u.courseIdentifier, s.learningResourceType, t.contentLevel(), t.title());
                            u.activeResource(s);
                            u.courseHasPreviouslyStarted || (u.courseHasPreviouslyStarted = !0, u.raiseCourseStartedEvent());
                            u.raiseStartedEvent(t);
                            s.learningResourceType == i.Embed && (c = n.learning.mlx.utility.getQueryStringParamValueFromUrl(s.content(), "embedSourceJSON"), c && (h = JSON.parse(c), h && h.Urls && h.Urls.length && h.Urls[0].Url && e.raiseDisplayContentRequestEvent(h.Urls[0].Url)));
                            f.resolve();
                        }).fail(function () {
                            f.reject();
                        });
                    }).fail(function () {
                        f.reject();
                    }), f.promise();
                }, s.prototype.doDeactivation = function () {
                    var n = this.activeResource();
                    return n && !this.startVideoPlayback && (this.startVideoPlayback = !0), n ? n.deactivateResource() : $.Deferred().resolve();
                }, s.prototype.getTopicsTotal = function () {
                    var n = this.manifestReader.getLessonIdentifiers(r.VisibleNotSoftDeleted);
                    return n.length;
                }, s.prototype.getDescendantsAndSelfActivityCount = function (n) {
                    var t = 0;
                    return n && n.requiredForCourseCompletion && n.resource() && t++, t + this.getDescendantsAndSelfActivityCountHelper(n.activities);
                }, s.prototype.getDescendantsAndSelfActivityCountHelper = function (n) {
                    for (var i = 0, u = n(), t, r = 0, f = u.length; r < f; r++)
                        t = u[r], t.requiredForCourseCompletion && t.resource() && i++, t.activities().length > 0 && (i += this.getDescendantsAndSelfActivityCountHelper(t.activities));
                    return i;
                }, s.prototype.getRootActivity = function (n) {
                    while (n && !(n.parent instanceof s))
                        n = n.parent;
                    return n;
                }, s.prototype.updateProgress = function (n) {
                    var i = 0, r = 0, t = this.getRootActivity(n);
                    t && t.descendantsAndSelfActivityCount > 0 && (r = this.getDescendantsAndSelfCompletedCount(t), i = Math.round(r / t.descendantsAndSelfActivityCount * 100));
                    t.progress(i);
                }, s.prototype.setCurrentUiMode = function (n) {
                    this.uiMode = n;
                    var t = n === 1;
                    return this.sendScoWrapperMessage(i.Video, o.UpdateUrlHashParamValue, [u.Fullscreen, t]);
                }, s.prototype.getDescendantsAndSelfCompletedCount = function (n) {
                    var t = 0;
                    return n && n.requiredForCourseCompletion && n.resource() && n.completed() && t++, t + this.getCompletedActivitiesCount(n.activities);
                }, s.prototype.getCompletedActivitiesCount = function (n) {
                    var i = this, t = 0;
                    return ko.utils.arrayForEach(n(), function (n) {
                        n && n.requiredForCourseCompletion && n.resource() && n.completed() && t++;
                        n.activities().length > 0 && (t += i.getCompletedActivitiesCount(n.activities));
                    }), t;
                }, s.prototype.subtreeHasPropertyValueSetToTrue = function (n, t) {
                    return n && n.resource() && n[t]() ? !0 : n && n.activities().length > 0 ? this.descendantsHavePropertyValueSetToTrue(n.activities(), t) : !1;
                }, s.prototype.descendantsHavePropertyValueSetToTrue = function (n, t) {
                    for (var i = 0, r = n.length; i < r; i++) {
                        if (n[i].resource() && n[i][t]())
                            return !0;
                        if (n[i].activities().length > 0)
                            return this.descendantsHavePropertyValueSetToTrue(n[i].activities(), t);
                    }
                    return !1;
                }, s.prototype.getAssessmentPrerequisites = function (n, t, i, r) {
                    var u = this.sequencer.getSpecifiedActivity(n);
                    return this.getSiblingAndDescendantIdentifiers(u, t, i, r, 1);
                }, s.prototype.getAssessmentPrerequisitesExpression = function (n) {
                    var t = this.getAssessmentPrerequisites(n, 0, 2, 2);
                    return this.aiccScriptProcessor.createPrerequistesExpression(t);
                }, s.prototype.setPrerequisites = function (n, t) {
                    if (t && this.aiccScriptProcessor.isValidPrerequistesExpression(t)) {
                        var i = this.sequencer.getSpecifiedActivity(n);
                        i && i.mlxPrerequisites(t);
                    }
                }, s.prototype.prerequisitesSatisfied = function (n) {
                    return this.aiccScriptProcessor.prerequisitesSatisfied(n);
                }, s.prototype.getSiblingAndDescendantIdentifiers = function (n, t, i, r, u) {
                    var o, e, f, s;
                    if (typeof u == "undefined" && (u = 2), o = [], n && n.parent)
                        for (e = n.parent.activities(), f = 0, s = e.length; f < s; f++)
                            e[f].id() !== n.id() && $.merge(o, this.getSelfAndDescendantIds(e[f], e[f].activities, t, i, r, u));
                    return o;
                }, s.prototype.getSelfAndDescendantIds = function (n, t, i, r, u, f) {
                    var s = this, e, o;
                    return typeof f == "undefined" && (f = 2), e = [], ((r === 0 || r === 2) && n.resource() && (f === 2 || f === 1 && n.resource() && n.resource().scormType === "sco") || (r === 1 || r === 2) && !n.resource() && (u === 0 && n.completed() || u === 1 && !n.completed() || u === 2)) && e.push(n.id()), i === 1 && ko.utils.arrayForEach(t(), function (n) {
                        o = s.getSelfAndDescendantIds(n, n.activities, i, r, u, f);
                        $.merge(e, o);
                    }), e;
                }, s.prototype.getPercentCompleted = function () {
                    return this.activityState.getPercentCompleted();
                }, s.prototype.getCompletionStats = function () {
                    return this.activityState.getCompletionStats();
                }, s.prototype.createActivityById = function (n) {
                    return e.createActivityById(n, this.manifestReader, this, this.activityState, this.platformBuildVersion);
                }, s.prototype.requestVideoPause = function () {
                    return this.sendScoWrapperMessage(i.Video, o.RequestVideoPlayerAction, u.Pause);
                }, s.prototype.requestVideoPlay = function () {
                    return this.sendScoWrapperMessage(i.Video, o.RequestVideoPlayerAction, u.Play);
                }, s.prototype.requestGoToVideoPosition = function (n) {
                    return this.sendScoWrapperMessage(i.Video, o.RequestVideoPlayerAction, [u.GoToPosition, n]);
                }, s.prototype.getCourseCumulativeVideoPlaybackTime = function () {
                    var n = this.manifestReader.getVideoIdentifiers(r.VisibleNotSoftDeleted);
                    return this.activityState.getAggregatedTotalTime(n);
                }, s.prototype.sendScoWrapperMessage = function (n, t, i) {
                    var r = $.Deferred().reject().promise(), u = this.activeResource();
                    return u && u.learningResourceType === n && (r = ScoTunnel.proxy({ target: t, data: Array.isArray(i) ? i : [i] })), r;
                }, s;
            }(t.PubSubExtender);
            t.CoursePlayerModel = s, function (n) {
                n[n.Normal = 0] = "Normal";
                n[n.Fullscreen = 1] = "Fullscreen";
            }(t.CoursePlayerUiMode || (t.CoursePlayerUiMode = {}));
            v = t.CoursePlayerUiMode, function (n) {
                n[n.Siblings = 0] = "Siblings";
                n[n.SiblingsAndDescendants = 1] = "SiblingsAndDescendants";
            }(t.PrerequisiteRelationType || (t.PrerequisiteRelationType = {}));
            y = t.PrerequisiteRelationType, function (n) {
                n[n.Present = 0] = "Present";
                n[n.NotPresent = 1] = "NotPresent";
                n[n.Any = 2] = "Any";
            }(t.ActivityResourceAvailability || (t.ActivityResourceAvailability = {}));
            p = t.ActivityResourceAvailability, function (n) {
                n[n.Completed = 0] = "Completed";
                n[n.NotCompleted = 1] = "NotCompleted";
                n[n.Any = 2] = "Any";
            }(t.ActivityCompletionStatus || (t.ActivityCompletionStatus = {}));
            w = t.ActivityCompletionStatus, function (n) {
                n[n.Asset = 0] = "Asset";
                n[n.SCO = 1] = "SCO";
                n[n.Any = 2] = "Any";
            }(t.ScormType || (t.ScormType = {}));
            b = t.ScormType, function (n) {
                n[n.TopicStarted = 1] = "TopicStarted";
                n[n.TopicCompleted = 2] = "TopicCompleted";
                n[n.LessonStarted = 4] = "LessonStarted";
                n[n.LessonCompleted = 8] = "LessonCompleted";
                n[n.ModuleStarted = 16] = "ModuleStarted";
                n[n.ModuleCompleted = 32] = "ModuleCompleted";
                n[n.AssessmentStarted = 64] = "AssessmentStarted";
                n[n.AssessmentCompleted = 128] = "AssessmentCompleted";
                n[n.CourseStarted = 256] = "CourseStarted";
                n[n.CourseCompleted = 512] = "CourseCompleted";
                n[n.VideoPlaybackStarted = 1024] = "VideoPlaybackStarted";
                n[n.VideoPlaybackStopped = 2048] = "VideoPlaybackStopped";
                n[n.VideoPlaybackPaused = 4096] = "VideoPlaybackPaused";
                n[n.VideoPlaybackSkipped = 8192] = "VideoPlaybackSkipped";
                n[n.VideoPlaybackMilestone = 16384] = "VideoPlaybackMilestone";
                n[n.VideoCaptionStateChanged = 32768] = "VideoCaptionStateChanged";
                n[n.VideoVolumeChanged = 65536] = "VideoVolumeChanged";
                n[n.VideoResolutionChanged = 131072] = "VideoResolutionChanged";
                n[n.VideoSpeedChanged = 262144] = "VideoSpeedChanged";
                n[n.VideoDownloaded = 524288] = "VideoDownloaded";
                n[n.VideoFullscreenChanged = 1048576] = "VideoFullscreenChanged";
                n[n.VideoPlaybackAccumulatedTime = 2097152] = "VideoPlaybackAccumulatedTime";
                n[n.DisplayContentRequest = 4194304] = "DisplayContentRequest";
                n[n.TranscriptLoaded = 8388608] = "TranscriptLoaded";
                n[n.All = n.TopicStarted | n.TopicCompleted | n.LessonStarted | n.LessonCompleted | n.ModuleStarted | n.ModuleCompleted | n.AssessmentStarted | n.AssessmentCompleted | n.CourseStarted | n.CourseCompleted | n.VideoPlaybackStarted | n.VideoPlaybackStopped | n.VideoPlaybackPaused | n.VideoPlaybackSkipped | n.VideoPlaybackMilestone | n.VideoCaptionStateChanged | n.VideoVolumeChanged | n.VideoResolutionChanged | n.VideoSpeedChanged | n.VideoDownloaded | n.VideoFullscreenChanged | n.VideoPlaybackAccumulatedTime | n.DisplayContentRequest | n.TranscriptLoaded] = "All";
            }(t.CoursePlayerEvent || (t.CoursePlayerEvent = {}));
            k = t.CoursePlayerEvent;
            u = function () {
                function n() {
                }
                return n.Play = "play", n.Pause = "pause", n.Skip = "skip", n.Scrub = "scrub", n.Stop = "stop", n.Exit = "exit", n.VideoEnded = "ended", n.Bookmark = "bookmark", n.Resolution = "resolution", n.Download = "download", n.Speed = "playbackspeed", n.Volume = "volume", n.ClosedCaption = "closedcaption", n.Fullscreen = "fullscreen", n.Milestone = "milestone", n.AccumulatedPlaybackTime = "accumulatedvideoplayback", n.TextTrackLoad = "texttrackload", n.GoToPosition = "gotoposition", n;
            }(), function (n) {
                n[n.Module = 1] = "Module";
                n[n.Lesson = 2] = "Lesson";
                n[n.Topic = 3] = "Topic";
            }(t.ActivityContentLevel || (t.ActivityContentLevel = {}));
            d = t.ActivityContentLevel;
            o = function () {
                function n() {
                }
                return n.UpdateUrlHashParamValue = "SCO_Wrapper_API.updateUrlHashParamValue", n.RequestVideoPlayerAction = "SCO_Wrapper_API.requestVideoPlayerAction", n;
            }();
        })(t.mlx || (t.mlx = {}));
        var i = t.mlx;
    })(n.learning || (n.learning = {}));
    var t = n.learning;
}(microsoft || (microsoft = {}));
MLX = MLX || {};
MLX.PubSubExtender = microsoft.learning.mlx.PubSubExtender;
MLX.Scorm12ManifestReader = microsoft.learning.mlx.Scorm12ManifestReader;
MLX.Scorm12Sequencer = microsoft.learning.mlx.Scorm12Sequencer;
MLX.Activity = microsoft.learning.mlx.Activity;
MLX.Resource = microsoft.learning.mlx.Resource;
MLX.CoursePlayerModel = microsoft.learning.mlx.CoursePlayerModel;
MLX.ManifestItemVisibility = microsoft.learning.mlx.ManifestItemVisibility;
MLX.ManifestLearningResourceType = microsoft.learning.mlx.ManifestLearningResourceType;
MLX.ManifestResourceScormType = microsoft.learning.mlx.ManifestResourceScormType;
MLX.CoursePlayerUiMode = microsoft.learning.mlx.CoursePlayerUiMode;
MLX.CoursePlayerEvent = microsoft.learning.mlx.CoursePlayerEvent, function (n) {
    (function (n) {
        (function (n) {
            var t = function () {
                function n(n) {
                    this.tunnel = n;
                }
                return n.prototype.initialize = function (n, t, i, r, u, f) {
                    return typeof f == "undefined" && (f = 0), this.currentActivityId = "", this.tunnel.proxy({ target: "ActivityState.initialize", data: arguments });
                }, n.prototype.initializeCurrentActivity = function (n) {
                    var t = this;
                    return this.tunnel.proxy({ target: "ActivityState.initializeCurrentActivity", data: arguments }).done(function () {
                        t.currentActivityId = n;
                    });
                }, n.prototype.initializeTopicAndAssessmentValues = function () {
                    return this.tunnel.proxy({ target: "ActivityState.initializeTopicAndAssessmentValues", data: arguments });
                }, n.prototype.getPercentCompleted = function () {
                    return this.tunnel.proxy({ target: "ActivityState.getPercentCompleted", data: arguments });
                }, n.prototype.getTotalTopics = function () {
                    return this.tunnel.proxy({ target: "ActivityState.getTotalTopics", data: arguments });
                }, n.prototype.getDurationCompleted = function () {
                    return this.tunnel.proxy({ target: "ActivityState.getDurationCompleted", data: arguments });
                }, n.prototype.getCompletionStats = function () {
                    return this.tunnel.proxy({ target: "ActivityState.getCompletionStats", data: arguments });
                }, n.prototype.getValue = function (n, t) {
                    return this.getScopedValue(n, this.currentActivityId, t);
                }, n.prototype.getScopedValue = function () {
                    return this.tunnel.proxy({ target: "ActivityState.getScopedValue", data: arguments });
                }, n.prototype.getCompletedAssessmentQuestionsInfo = function () {
                    return this.tunnel.proxy({ target: "ActivityState.getCompletedAssessmentQuestionsInfo", data: arguments });
                }, n.prototype.resetActivityProgress = function () {
                    return this.tunnel.proxy({ target: "ActivityState.resetActivityProgress", data: arguments });
                }, n.prototype.getInitialActivityTreeData = function () {
                    return this.tunnel.proxy({ target: "ActivityState.getInitialActivityTreeData", data: arguments });
                }, n.prototype.isSaveCompleted = function () {
                    return this.tunnel.proxy({ target: "ActivityState.isSaveCompleted", data: arguments });
                }, n.prototype.save = function () {
                    return this.tunnel.proxy({ target: "ActivityState.save", data: arguments });
                }, n.prototype.getScopedValues = function () {
                    return this.tunnel.proxy({ target: "ActivityState.getScopedValues", data: arguments });
                }, n.prototype.activityStateDataExists = function () {
                    return this.tunnel.proxy({ target: "ActivityState.activityStateDataExists", data: arguments });
                }, n.prototype.getAggregatedTotalTime = function () {
                    return this.tunnel.proxy({ target: "ActivityState.getAggregatedTotalTime", data: arguments });
                }, n;
            }();
            n.CourseActivityStateProxy = t;
        })(n.mlx || (n.mlx = {}));
        var t = n.mlx;
    })(n.learning || (n.learning = {}));
    var t = n.learning;
}(microsoft || (microsoft = {}));
MLX = MLX || {};
MLX.CourseActivityStateProxy = microsoft.learning.mlx.CourseActivityStateProxy, function (n) {
    (function (n) {
        (function (n) {
            var i = function () {
                function n(n) {
                    this.hasChanged = !1;
                    this.settingsContext = n;
                    switch (n) {
                        case t.Client:
                            this.settings = { AutoPlayState: !1 };
                            break;
                        case t.Content:
                            this.settings = { ClosedCaptionState: -1, VolumeState: 0 };
                    }
                }
                return n.prototype.getValue = function (n) {
                    var t = "";
                    if (this.settings)
                        switch (n) {
                            case "ClosedCaptioning":
                                t = this.settings.ClosedCaptionState;
                                break;
                            case "AutoPlay":
                                t = this.settings.AutoPlayState;
                                break;
                            case "Volume":
                                t = this.settings.VolumeState;
                        }
                    return t;
                }, n.prototype.setValue = function (n, t) {
                    if (this.settings)
                        switch (n) {
                            case "ClosedCaptioning":
                                this.settings.ClosedCaptionState !== t && (this.settings.ClosedCaptionState = t, this.hasChanged = !0);
                                break;
                            case "AutoPlay":
                                this.settings.AutoPlayState !== t && (this.settings.AutoPlayState = t, this.hasChanged = !0);
                                break;
                            case "Volume":
                                this.settings.VolumeState !== t && (this.settings.VolumeState = t, this.hasChanged = !0);
                        }
                }, n.prototype.loadSettings = function (n, t) {
                    return typeof t == "undefined" && (t = !1), null;
                }, n.prototype.saveSettings = function (n, t) {
                    return typeof t == "undefined" && (t = !1), null;
                }, n;
            }(), t;
            n.SettingsModelBase = i;
            t = function () {
                function n() {
                }
                return n.Client = "clientSettings", n.Content = "contentSettings", n;
            }();
            n.SettingsContext = t;
        })(n.mlx || (n.mlx = {}));
        var t = n.mlx;
    })(n.learning || (n.learning = {}));
    var t = n.learning;
}(microsoft || (microsoft = {}));
__extends = this.__extends || function (n, t) {
    function r() {
        this.constructor = n;
    }
    for (var i in t)
        t.hasOwnProperty(i) && (n[i] = t[i]);
    r.prototype = t.prototype;
    n.prototype = new r;
}, function (n) {
    (function (n) {
        (function (n) {
            var t = function (n) {
                function t(t) {
                    n.call(this, t);
                }
                return __extends(t, n), t.prototype.loadSettings = function (n, t) {
                    typeof t == "undefined" && (t = !1);
                    var r = this, i = $.Deferred(), u;
                    return n || t ? (u = t ? "/services/settings/anonymous/settingtype/" : "/services/settings/learner/settingtype/", typeof LmsTunnel != "undefined" ? LmsTunnel.proxy({ target: "MLX.ajax", data: [{ url: u + r.settingsContext, dataType: "json", cache: !1 }] }).done(function (n) {
                        $.isEmptyObject(n) || (r.settings = n);
                        i.resolve();
                    }).fail(function () {
                        i.reject();
                    }) : MLX.ajax({ url: u + r.settingsContext, dataType: "json", cache: !1 }).done(function (n) {
                        $.isEmptyObject(n) || (r.settings = n);
                        i.resolve();
                    }).fail(function () {
                        i.reject();
                    })) : i.resolve(), i.promise();
                }, t.prototype.saveSettings = function (n, t) {
                    typeof t == "undefined" && (t = !1);
                    var i = this, r, u;
                    return this.settings ? this.hasChanged ? (u = t ? "/services/settings/anonymous" : "/services/settings/learner", r = typeof LmsTunnel != "undefined" ? LmsTunnel.proxy({ target: "MLX.ajax", data: [{ type: "PUT", contentType: "application/json", url: u, data: JSON.stringify(i.settings), dataType: "json" }] }).done(function () {
                        i.hasChanged = !1;
                    }) : MLX.ajax({ type: "PUT", contentType: "application/json", url: u, data: JSON.stringify(i.settings), dataType: "json" }).done(function () {
                        i.hasChanged = !1;
                    })) : r = $.Deferred().resolve() : r = $.Deferred().reject(), r;
                }, t;
            }(n.SettingsModelBase);
            n.settingsModel = t;
        })(n.mlx || (n.mlx = {}));
        var t = n.mlx;
    })(n.learning || (n.learning = {}));
    var t = n.learning;
}(microsoft || (microsoft = {}));
__extends = this.__extends || function (n, t) {
    function r() {
        this.constructor = n;
    }
    for (var i in t)
        t.hasOwnProperty(i) && (n[i] = t[i]);
    r.prototype = t.prototype;
    n.prototype = new r;
}, function (n) {
    (function (n) {
        (function (n) {
            var t = function (n) {
                function t(t, i, r) {
                    n.call(this, t);
                    this.mvaApiTargetHostname = i;
                    this.scheme = r;
                }
                return __extends(t, n), t.prototype.loadSettings = function (n, t) {
                    typeof t == "undefined" && (t = !1);
                    var r = this, i = $.Deferred();
                    return n ? MvaApiTunnel.ajax({ type: "GET", url: r.scheme + "://" + r.mvaApiTargetHostname + "/api/usersettings/" + n, cache: !1 }).done(function (n) {
                        n && $.extend(r.settings, JSON.parse(n));
                        i.resolve();
                    }).fail(function () {
                        console.log("Failure getting user settings JSON");
                        i.reject();
                    }) : i.reject(), i.promise();
                }, t.prototype.saveSettings = function (n, t) {
                    typeof t == "undefined" && (t = !1);
                    var i = this;
                    return n && this.settings ? this.hasChanged ? MvaApiTunnel.ajax({ type: "PUT", contentType: "application/json", url: this.scheme + "://" + this.mvaApiTargetHostname + "/api/usersettings/" + n, data: JSON.stringify(this.settings) }).done(function () {
                        i.hasChanged = !1;
                    }) : $.Deferred().resolve() : $.Deferred().reject();
                }, t;
            }(n.SettingsModelBase);
            n.MvaSettingsModel = t;
        })(n.mlx || (n.mlx = {}));
        var t = n.mlx;
    })(n.learning || (n.learning = {}));
    var t = n.learning;
}(microsoft || (microsoft = {}));
__extends = this.__extends || function (n, t) {
    function r() {
        this.constructor = n;
    }
    for (var i in t)
        t.hasOwnProperty(i) && (n[i] = t[i]);
    r.prototype = t.prototype;
    n.prototype = new r;
}, function (n) {
    (function (t) {
        (function (t) {
            var i = function (i) {
                function r(r, u, f, e, o, s) {
                    var h = this, c, l;
                    i.call(this);
                    this.isTranscript = !1;
                    this.isPreview = !1;
                    this.isAnonymousRequest = !1;
                    this.activities = ko.observableArray([]);
                    this.currentActivity = ko.computed(function () {
                        return h.coursePlayerModel && h.coursePlayerModel.activeResource() ? h.coursePlayerModel.activeResource().parent : null;
                    }, this, { deferEvaluation: !0 });
                    this.currentActivityTitle = ko.computed(function () {
                        var n = "";
                        return h.coursePlayerModel && h.coursePlayerModel.activeResource() && (n = h.coursePlayerModel.activeResource().parent.title()), n;
                    }, this, { deferEvaluation: !0 });
                    this.previousActivityTitle = ko.computed(function () {
                        var t = "", i, n;
                        return h.coursePlayerModel && (i = h.coursePlayerModel && h.coursePlayerModel.activeResource(), i && (n = h.sequencer.getPrevActivity(), n && n.title && (t = n.title()))), t;
                    }, this, { deferEvaluation: !0 });
                    this.previousActivityParentTitle = ko.computed(function () {
                        var t = "", i, n;
                        return h.coursePlayerModel && (i = h.coursePlayerModel && h.coursePlayerModel.activeResource(), i && (n = h.sequencer.getPrevActivity(), n && n.title && (t = n.parent.title()))), t;
                    }, this, { deferEvaluation: !0 });
                    this.nextActivityTitle = ko.computed(function () {
                        var t = "", i, n;
                        return h.coursePlayerModel && (i = h.coursePlayerModel.activeResource(), i && (n = h.sequencer.getNextActivity(), n && n.title && (t = n.title()))), t;
                    }, this, { deferEvaluation: !0 });
                    this.nextActivityParentTitle = ko.computed(function () {
                        var t = "", i, n;
                        return h.coursePlayerModel && (i = h.coursePlayerModel.activeResource(), i && (n = h.sequencer.getNextActivity(), n && n.title && (t = n.parent.title()))), t;
                    }, this, { deferEvaluation: !0 });
                    this.autoPlay = ko.computed({
                        read: function () {
                            return h.coursePlayerModel ? h.coursePlayerModel.autoPlay() : !1;
                        }, write: function (n) {
                            h.coursePlayerModel && h.coursePlayerModel.autoPlay(n);
                        }, owner: this, deferEvaluation: !0
                    });
                    c = this;
                    l = $.Deferred();
                    this.initDeferred = $.Deferred();
                    this.scoTunnel = r != undefined ? r : ScoTunnel;
                    this.courseDetailsModel = f != undefined ? f : new n.learning.mlx.CourseDetailsModel;
                    this.manifestReader = new n.learning.mlx.Scorm12ManifestReader(r);
                    this.sequencer = new n.learning.mlx.Scorm12Sequencer;
                    o != undefined ? (this.globalSettings = o, l.resolve()) : MLX.context.appChannel !== "5" || typeof Configurations == "undefined" || !Configurations.mvaApiTargetHostname || MLX.context.isMVAMigrationCompleted || MLX.context.currentUser.isMVAMigratedUser ? (this.globalSettings = new n.learning.mlx.settingsModel(t.SettingsContext.Client), l.resolve()) : MLX.initializeMvaApiTunnel(Configurations.mvaApiTargetHostname, "https").done(function () {
                        c.globalSettings = new n.learning.mlx.MvaSettingsModel(t.SettingsContext.Client, Configurations.mvaApiTargetHostname, "https");
                        l.resolve();
                    });
                    $.when(l).done(function () {
                        c.webTrendsHelper = s != undefined ? s : new n.learning.mlx.WebTrendsHelper;
                        c.coursePlayerModel = u != undefined ? u : new n.learning.mlx.CoursePlayerModel(MLX.context.platformBuildVersion, c.manifestReader, c.sequencer, c.globalSettings, c.webTrendsHelper);
                        window.CoursePlayerModel = c.coursePlayerModel;
                        c.coursePlayerModel.subscribe(t.CoursePlayerEvent.All, function (n, t) {
                            c.notifySubscribers(n, t);
                        });
                        c.initDeferred.resolve();
                    });
                    this.activityState = e != undefined ? e : new n.learning.mlx.CourseActivityStateProxy(this.scoTunnel);
                }
                return __extends(r, i), r.prototype.startCourse = function (n) {
                    return this.coursePlayerModel ? this.coursePlayerModel.startCourse(n) : $.Deferred().reject();
                }, r.prototype.loadCourse = function (n, t, i, r, u, f, e, o, s) {
                    typeof i == "undefined" && (i = 0);
                    typeof r == "undefined" && (r = "");
                    var h = this, c = $.Deferred();
                    return this.courseId = n, this.organizationId = t, this.languageId = isNaN(i) ? 0 : i, this.userId = u ? u : MLX.context.currentUser.currentUserId, this.isTranscript = f === !0, this.isPreview = e === !0, this.activities = ko.observableArray([]), this.courseDetails = null, this.courseVersion = r, this.userLanguage = o, this.countryId = s, this.userLanguage && MLX.sendCustomMessage(this.userLanguage, "", "SetUserLanguage"), $.when(h.initDeferred).done(function () {
                        var n = h.doLoadingInitialization();
                        $.when(n).done(function () {
                            h.coursePlayerModel.initialize(h.courseId, h.activityState, h.courseVersion, h.courseDetailsModel.overview.details.level(), h.courseDetailsModel.courseLanguageCode, h.userId).done(function () {
                                h.activities = h.coursePlayerModel.activities;
                                var n = { moduleCount: h.coursePlayerModel.moduleCount, assessmentCount: h.coursePlayerModel.assessmentCount, estimatedCourseDuration: h.coursePlayerModel.expectedCourseDuration, isDurationAvailable: h.coursePlayerModel.isDurationAvailable(), isCourseContentDeletedSinceUserLastLaunch: h.coursePlayerModel.isCourseContentDeletedSinceUserLastLaunch };
                                $.extend(h.courseDetails, n);
                                c.resolve();
                            }).fail(function () {
                                c.reject();
                            });
                        }).fail(function () {
                            c.reject();
                        });
                    }).fail(function () {
                        c.reject();
                    }), c.promise();
                }, r.prototype.loadActivityById = function (n, t, i, r, u, f, e, o) {
                    typeof r == "undefined" && (r = 0);
                    typeof u == "undefined" && (u = "");
                    var s = this, h = $.Deferred();
                    return this.courseId = t, this.organizationId = i, this.languageId = isNaN(r) ? 0 : r, this.userId = f ? f : MLX.context.currentUser.currentUserId, this.isTranscript = !1, this.isPreview = !1, this.activities = ko.observableArray([]), this.courseDetails = null, this.courseVersion = u, this.userLanguage = e, this.countryId = o, this.userLanguage && MLX.sendCustomMessage(this.userLanguage, "", "SetUserLanguage"), $.when(s.initDeferred).done(function () {
                        var t = s.doLoadingInitialization();
                        $.when(t).done(function () {
                            s.coursePlayerModel.initializeActivity(n, s.courseId, s.activityState, s.courseVersion, s.courseDetailsModel.overview.details.level(), s.courseDetailsModel.courseLanguageCode, s.userId).done(function () {
                                s.activities = s.coursePlayerModel.activities;
                                var n = { moduleCount: s.coursePlayerModel.moduleCount, assessmentCount: s.coursePlayerModel.assessmentCount, estimatedCourseDuration: s.coursePlayerModel.expectedCourseDuration, isDurationAvailable: s.coursePlayerModel.isDurationAvailable() };
                                $.extend(s.courseDetails, n);
                                h.resolve();
                            }).fail(function () {
                                h.reject();
                            });
                        }).fail(function () {
                            h.reject();
                        });
                    }).fail(function () {
                        h.reject();
                    }), h.promise();
                }, r.prototype.doLoadingInitialization = function () {
                    var t = this, i = $.Deferred(), r;
                    return MLX.sendCustomMessage(t.courseId, "", "SetCurrentCourseId"), t.isAnonymousRequest = !MLX.context.currentUser.isAuthenticated && MLX.context.isAnonymousTenant ? !0 : !1, r = t.globalSettings.loadSettings(t.userId, t.isAnonymousRequest), MLX.getCourseBaseUrl(this.courseId, this.courseVersion, this.languageId, this.isTranscript, this.isPreview).done(function (u) {
                        t.baseUrl = u;
                        t.courseVersion || (t.courseVersion = n.learning.mlx.utility.getVersionFromBaseUrl(u));
                        t.courseDetailsModel.initialize(t.courseId, t.courseVersion, t.baseUrl, t.isPreview).done(function () {
                            if (t.courseDetails = { overview: t.courseDetailsModel.overview, requirements: t.courseDetailsModel.requirements, assessment: t.courseDetailsModel.assessment, courseTitle: t.courseDetailsModel.courseTitle, courseNumber: t.courseDetailsModel.courseNumber(), courseLanguageCode: t.courseDetailsModel.courseLanguageCode, courseImageUrl: t.courseDetailsModel.baseUrl + "/thumbnail.png", isLiveEvent: t.courseDetailsModel.overview.liveEvent != undefined ? !0 : !1, isRegisteredForLiveEvent: t.courseDetailsModel.isRegisteredForLiveEvent, percentageCourseCompleted: t.courseDetailsModel.percentageCourseCompleted, doesUserHaveAccessToCourse: t.courseDetailsModel.doesUserHaveAccessToCourse, publishedDate: t.courseDetailsModel.publishedDate, expiryDate: t.courseDetailsModel.expirationDate, retirementDate: t.courseDetailsModel.retirementDate, lastAccessedDate: t.courseDetailsModel.lastAccessedDate, isVersionModified: t.courseDetailsModel.isVersionModified, getLearnerCourseDetails: t.courseDetailsModel.getLearnerCourseDetails, courseVersion: t.courseVersion, isRetired: t.courseDetailsModel.isRetired, replacementCourseId: t.courseDetailsModel.replacementCourseId, replacementCourseTitle: t.courseDetailsModel.replacementCourseTitle, replacementCourseLanguageCode: t.courseDetailsModel.replacementCourseLanguageCode, replacementCourseImageUrl: t.courseDetailsModel.replacementCourseImageUrl, replacementCourseLevel: t.courseDetailsModel.replacementCourseLevel, replacementCoursePublishedDate: t.courseDetailsModel.replacementCoursePublishedDate, replacementCourseShortDescription: t.courseDetailsModel.replacementCourseShortDescription, replacementCourseInstructors: t.courseDetailsModel.replacementCourseInstructors }, t.courseDetails.isLiveEvent)
                                i.resolve();
                            else {
                                t.organizationChannel = MLX.context.appChannel;
                                var n = t.activityState.initialize(t.courseId, t.organizationId, t.courseVersion, t.courseDetailsModel.courseLanguageCode, MLX.context.currentUser.PreferredLanguage, t.languageId, t.userId, t.countryId, t.isAnonymousRequest, t.organizationChannel, MLX.context.currentUser.isActive), u = t.manifestReader.initialize(t.courseId, t.courseVersion, t.baseUrl);
                                $.when(t.initDeferred, r, n, u).done(function () {
                                    i.resolve();
                                }).fail(function () {
                                    i.reject();
                                });
                            }
                        }).fail(function () {
                            i.reject();
                        });
                    }).fail(function () {
                        i.reject();
                    }), i.promise();
                }, r.prototype.endCourse = function () {
                    return this.coursePlayerModel ? this.coursePlayerModel.endCourse() : $.Deferred().reject();
                }, r.prototype.launchPreviousActivity = function () {
                    return this.coursePlayerModel ? this.coursePlayerModel.getPrevResource() : $.Deferred().reject();
                }, r.prototype.launchNextActivity = function () {
                    return this.coursePlayerModel ? this.coursePlayerModel.getNextResource() : $.Deferred().reject();
                }, r.prototype.getActivityById = function (n) {
                    return this.sequencer.getSpecifiedActivity(n);
                }, r.prototype.launchActivityById = function (n, t) {
                    return this.coursePlayerModel ? this.coursePlayerModel.getSpecifiedResource(n, t) : $.Deferred().reject();
                }, r.prototype.launchActivity = function (n, t) {
                    return this.coursePlayerModel ? this.coursePlayerModel.getSelectedResource(n, t) : $.Deferred().reject();
                }, r.prototype.endCurrentActivity = function () {
                    return this.coursePlayerModel ? this.coursePlayerModel.doDeactivation() : $.Deferred().reject();
                }, r.prototype.setCurrentUiMode = function (n) {
                    this.coursePlayerModel && this.coursePlayerModel.setCurrentUiMode(n);
                }, r.prototype.getPercentCompleted = function () {
                    return this.coursePlayerModel ? this.coursePlayerModel.getPercentCompleted() : $.Deferred().reject();
                }, r.prototype.getCompletionStats = function () {
                    return this.coursePlayerModel ? this.coursePlayerModel.getCompletionStats() : $.Deferred().reject();
                }, r.prototype.createActivityById = function (n) {
                    return this.coursePlayerModel ? this.coursePlayerModel.createActivityById(n) : $.Deferred().reject();
                }, r.prototype.getPreviousActivityById = function (n) {
                    var t = null;
                    return n && (t = this.sequencer.getPrevActivityById(n)), t;
                }, r.prototype.getPreviousActivityIdById = function (n) {
                    var t = this.getPreviousActivityById(n);
                    return t ? t.id() : "";
                }, r.prototype.getNextActivityById = function (n) {
                    var t = null;
                    return n && (t = this.sequencer.getNextActivityById(n)), t;
                }, r.prototype.getNextActivityIdById = function (n) {
                    var t = this.getNextActivityById(n);
                    return t ? t.id() : "";
                }, r.prototype.getCurrentModuleIndex = function () {
                    if (this.coursePlayerModel && this.coursePlayerModel.activeResource()) {
                        var t = this.coursePlayerModel.activeResource().parent, i = this.coursePlayerModel.getRootActivity(t), n = $.inArray(i, this.activities());
                        return n > 0 ? n : 0;
                    }
                    return 0;
                }, r.prototype.requestVideoPause = function () {
                    return this.coursePlayerModel ? this.coursePlayerModel.requestVideoPause() : $.Deferred().reject();
                }, r.prototype.requestVideoPlay = function () {
                    return this.coursePlayerModel ? this.coursePlayerModel.requestVideoPlay() : $.Deferred().reject();
                }, r.prototype.requestGoToVideoPosition = function (n) {
                    return this.coursePlayerModel ? this.coursePlayerModel.requestGoToVideoPosition(n) : $.Deferred().reject();
                }, r.prototype.getCourseCumulativeVideoPlaybackTime = function () {
                    return this.coursePlayerModel ? this.coursePlayerModel.getCourseCumulativeVideoPlaybackTime() : $.Deferred().reject();
                }, r;
            }(t.PubSubExtender);
            t.CoursePlayer = i;
        })(t.mlx || (t.mlx = {}));
        var i = t.mlx;
    })(n.learning || (n.learning = {}));
    var t = n.learning;
}(microsoft || (microsoft = {}));
MLX = MLX || {};
MLX.CoursePlayer = microsoft.learning.mlx.CoursePlayer;
microsoft.learning.mlx.learnerDashboardModel = function () {
    var n = undefined, t = function (t) {
        n = this;
        this.orgId = t;
        this.learningPlanInitialized = ko.observable(!1);
        this.courseReferencesById = [];
        this.myCourses = undefined;
        n.numInProgressCourses = ko.observable(MLX.context.currentUser.myCoursesCount);
        n.numCompletedCourses = ko.computed(function () {
            var t = 0;
            return n.learnerCourses().length > 0 ? ko.utils.arrayForEach(n.learnerCourses(), function (n) {
                t = t + n.completedCourses().length;
            }) : t = MLX.context.currentUser.achievementsCount, t;
        });
    };
    return t.prototype.learningPlansList = ko.observableArray([]), t.prototype.learnerCourses = ko.observableArray([]), t.prototype.updateCourseCount = function () {
        var n = this, t = 0;
        ko.utils.arrayForEach(n.learnerCourses(), function (n) {
            ko.utils.arrayForEach(n.ChildProducts(), function (n) {
                n.PercentModulesComplete() != 100 && t++;
            });
        });
        n.numInProgressCourses(t);
    }, t.prototype.initializeLearnerCourses = function () {
        var n = this, t = MLX.ajax({ url: "/services/learners/dashboard/courses?organizationId=" + n.orgId, type: "get" });
        return t.done(function (t) {
            var i = {
                create: function (t) {
                    var i = ko.mapping.fromJS(t.data);
                    return i.completedCourses = ko.computed(function () {
                        return ko.utils.arrayFilter(i.ChildProducts(), function (n) {
                            return n.PercentModulesComplete() == 100;
                        });
                    }), ko.utils.arrayForEach(i.ChildProducts(), function (t) {
                        n.courseReferencesById[t.Id()] || (n.courseReferencesById[t.Id()] = []);
                        n.courseReferencesById[t.Id()][i.Id()] = t;
                    }), i.PercentComplete = ko.computed(function () {
                        return Math.round(i.completedCourses().length / i.ChildProducts().length * 100);
                    }), i;
                }
            };
            ko.mapping.fromJS(t, i, n.learnerCourses);
            ko.utils.arrayForEach(n.learnerCourses(), function (t) {
                t.Id() == 0 && (n.myCourses = t);
            });
            n.updateCourseCount();
        }), t;
    }, t;
}();


microsoft.learning.mlx.LearnerPlayListModel = function () {
    var t = undefined, n = function () {
        t = this;
    };
    return n.prototype.CreateUserLearningPlan = function (n) {
        var t = this;
        return MLX.ajax({ url: "/sdk/userLearningPlans/v1.0/create", type: "PUT", data: JSON.stringify(n), contentType: "application/json", dataType: "json" });
    }, n.prototype.UpdateUserLearningPlan = function (n) {
        var t = this;
        return MLX.ajax({ url: "/sdk/userLearningPlans/v1.0/update", type: "PUT", data: JSON.stringify(n), contentType: "application/json", dataType: "json" });
    }, n.prototype.GetUserLearningPlansForUser = function (n) {
        var t = this;
        return MLX.ajax({ url: "/sdk/userLearningPlans/v1.0/User/" + n, type: "GET" });
    }, n.prototype.GetTotalUserLearningPlansCount = function (n) {
        var t = this;
        return MLX.ajax({ url: "/sdk/userLearningPlans/v1.0/Count/User/" + n, type: "GET" });
    }, n.prototype.GetCoursesForUser = function (n, t, i, r) {
        var f = this, u = "/sdk/learnercourse/v1.0/user/" + n;
        return t >= 0 && i > 0 ? u = u + "?$skip=" + t + "&$top=" + i + "&$filter=IsCompleted eq " + r : t >= 0 ? u = u + "?$skip=" + t + "&$filter=IsCompleted eq " + r : i > 0 ? u = u + "?$top=" + i + "&$filter=IsCompleted eq " + r : r != undefined && r != null && (u = u + "?$filter=IsCompleted eq " + r), MLX.ajax({ url: u, type: "GET" });
    }, n.prototype.DeleteUserLearningPlan = function (n) {
        var t = this;
        return MLX.ajax({ url: "/sdk/userLearningPlans/v1.0/delete", type: "DELETE", data: JSON.stringify(n), contentType: "application/json", dataType: "json" });
    }, n.prototype.DeleteCoursesFromUserLearningPlans = function (n, t, i) {
        var r = this;
        return MLX.ajax({ url: "/sdk/userLearningPlans/v1.0/courses/remove", type: "DELETE", data: JSON.stringify({ DestinationLearningPlanIds: t, CourseIds: n, LanguageCode: i }), contentType: "application/json", dataType: "json" });
    }, n.prototype.AddCoursesToUserLearningPlans = function (n, t, i) {
        var r = this;
        return MLX.ajax({ url: "/sdk/userLearningPlans/v1.0/courses/add", type: "POST", data: JSON.stringify({ DestinationLearningPlanIds: t, CourseIds: n, LanguageCode: i }), contentType: "application/json", dataType: "json" });
    }, n.prototype.addCourseToMyCourses = function (n, t) {
        var i = this;
        return MLX.ajax({ url: "/sdk/learnercourse/v1.0/" + n + "/add/" + t, type: "POST", contentType: "application/json", dataType: "json" });
    }, n.prototype.removeCourseFromMyCourses = function (n, t) {
        var i = this;
        return MLX.ajax({ url: "/sdk/learnercourse/v1.0/" + n + "/remove/" + t, type: "DELETE", contentType: "application/json", dataType: "json" });
    }, n.prototype.GetUserCourseProgressDetails = function (n, t, i) {
        return MLX.ajax({ url: "/sdk/learnercourse/v1.0/courseProgress/" + n + "/" + t + "/" + i, type: "GET" });
    }, n.prototype.GetRecommendedCourses = function (n, t, i) {
        return MLX.ajax({ url: "/sdk/search/v1.0/" + n + "/recommendedcourses/" + t + "/languageId/" + i, type: "GET" });
    }, n;
}();
microsoft.learning.mlx.LearningPathModel = function () {
    var t = undefined, n = function () {
        t = this;
    };
    return n.prototype.getLearningProgramByChannel = function (n) {
        return MLX.ajax({ url: "/sdk/learningpaths/v1.0/anonymous/" + n + "/learningprogram", type: "GET" });
    }, n.prototype.getLearningProgram = function () {
        return MLX.ajax({ url: "/sdk/learningpaths/v1.0/learningprograms", type: "GET" });
    }, n.prototype.registerLearningPath = function (n) {
        return MLX.ajax({ url: "/sdk/learningpaths/v1.0/enroll/" + n, type: "PUT" });
    }, n.prototype.removeLearningPath = function (n) {
        return MLX.ajax({ url: "/sdk/learningpaths/v1.0/remove/" + n, type: "DELETE" });
    }, n.prototype.getUserEnrolledLearningPrograms = function () {
        return MLX.ajax({ url: "/sdk/learningpaths/v1.0/enrolled/learningprograms", type: "GET" });
    }, n.prototype.hasUserEnrolledLearningPath = function () {
        return MLX.ajax({ url: "/sdk/learningpaths/v1.0/enrolled", type: "GET" });
    }, n.prototype.getLearningPathById = function (n, t, i) {
        var r = "/sdk/learningpaths/v1.0/anonymous/" + n + "/learningpath/" + t;
        return i || (r = "/sdk/learningpaths/v1.0/" + n + "/learningpath/" + t), MLX.ajax({ url: r, type: "GET" });
    }, n.prototype.getLearningTracksByChannel = function (n, t) {
        return MLX.ajax({ url: "/sdk/learningpaths/v1.0/anonymous/" + n + "/learningtrack/" + t, type: "GET" });
    }, n.prototype.getUserLearningRewards = function () {
        return MLX.ajax({ url: "/sdk/learningpaths/v1.0/userrewards", type: "GET" });
    }, n.prototype.getUserLearningPaths = function (n, t) {
        var i = "/sdk/learningpaths/v1.0/userlearningpaths/" + n;
        return t != undefined && t != null && t && (i = i + "?$filter=Progress lt 100 or Progress eq null"), MLX.ajax({ url: i, type: "GET" });
    }, n;
}();
microsoft.learning.mlx.learnerCourseActivityModel = function () {
    var n = function (n) {
        var t = this;
        this.organizationId = n;
    };
    return n.prototype.saveUpdateNotifiedVersion = function (n, t, i) {
        var r = this, u = { version: t, language: i };
        return (i == undefined || i == null) && (i = 0), MLX.ajax({ url: "/services/learners/courseactivities/" + n + "/progress/updateversion?organizationId=" + r.organizationId + "&languageId=" + i, type: "PUT", data: JSON.stringify(u), contentType: "application/json" });
    }, n;
}();
microsoft.learning.mlx.examRegistrationDataModel = function () {
    var t = undefined, n = function () {
        t = this;
        t.ErrorMessage = ko.observable();
    };
    return n.prototype.getAllCountries = function () {
        var n = undefined, t = this;
        return n = MLX.ajax({ url: "/services/users/profile/countries", type: "GET", dataType: "json", contentType: "application/json" }), n.done(function (n) {
            t.result = n;
        }), n;
    }, n.prototype.getStates = function (n) {
        var t = undefined, i = this;
        return t = MLX.ajax({ url: "/services/domaindata/stateprovincelist/" + n, type: "GET", dataType: "json", contentType: "application/json" }), t.done(function (n) {
            i.result = n;
        }), t;
    }, n.prototype.getNamePrefix = function () {
        var n = undefined, t = this;
        return n = MLX.ajax({ url: "/services/domaindata/nameprefix", type: "GET", dataType: "json", contentType: "application/json" }), n.done(function (n) {
            t.result = n;
        }), n;
    }, n.prototype.getAllLanguages = function () {
        var n = undefined, t = this;
        return t.languages ? (n = $.Deferred(), n.resolve(t.languages)) : (n = MLX.ajax({ url: "/services/users/profile/languages", type: "GET", dataType: "json", contentType: "application/json" }), n.done(function (n) {
            t.result = t.languages = n;
        })), n;
    }, n.prototype.getJobFunctions = function (n) {
        var t = undefined, i = this;
        return i.jobFunctions ? (t = $.Deferred(), t.resolve(i.jobFunctions)) : (t = MLX.ajax({ url: "/services/users/profile/jobfunctions/" + n, type: "GET", dataType: "json", contentType: "application/json" }), t.done(function (n) {
            i.result = i.jobfunctions = n;
        })), t;
    }, n.prototype.getUserProfile = function () {
        var n = this, t = undefined;
        return t = MLX.ajax({ url: "/services/users/profile", type: "GET", dataType: "json", contentType: "application/json" }), t.done(function (t) {
            n.result = t;
            n.basicProfileExists = t ? !0 : !1;
        }), t;
    }, n.prototype.getCandidateProfile = function (n) {
        var i = this, t = undefined;
        return t = MLX.ajax({ url: "/services/users/GetUserMasterProfile", type: "POST", dataType: "json", data: JSON.stringify(n), contentType: "application/json" }), t.done(function (n) {
            i.result = n;
        }), t;
    }, n.prototype.registerUser = function (n) {
        var i = this, t = undefined;
        return t = MLX.ajax({ url: "/services/users/RegisterMasterUser", type: "PUT", dataType: "json", data: n, contentType: "application/json" }), t.done(function (n) {
            i.result = n;
        }), t;
    }, n.prototype.saveUser = function (n) {
        var i = this, t = undefined;
        return t = MLX.ajax({ url: "/services/users/SaveUserMasterProfile", type: "POST", dataType: "json", data: n, contentType: "application/json" }), t.done(function (n) {
            i.result = n;
        }), t;
    }, n.prototype.validateCandidate = function (n) {
        var i = this, t = new $.Deferred;
        return t = MLX.ajax({ type: "POST", contentType: "application/json", data: JSON.stringify(n), url: "/ExamRegistration/v1.0/Candidate/Validation" }), t.done(function (n) {
            i.result = n;
        }), t;
    }, n.prototype.Initialize = function () {
        var n = this;
    }, n;
}();
microsoft.learning.mlx.candidateMasterProfileModel = function () {
    function t() {
        return { BasicProfile: { FirstName: ko.observable(), MiddleName: ko.observable(), LastName: ko.observable(), ContactEmailAddress: ko.observable(), CountryCode: ko.observable(), PostalCode: ko.observable(), JobTitle: ko.observable(), JobFunctionId: ko.observable(), PreferredLanguage: ko.observable(), MSMarketingEmailOption: ko.observable(), MSPartnersMarketingEmailOption: ko.observable(), AcceptedTermsOfUse: ko.observable(!1) }, LegalProfile: { Salutation: ko.observable(), LegalFirstName: ko.observable(), LegalMiddleName: ko.observable(), LegalLastName: ko.observable() }, Addresses: ko.observableArray([]), Phones: ko.observableArray([]), EdpProfile: { LastTimeProfileSentToVue: null }, PrivacyPreferences: { MSMarketingEmailOptin: ko.observable(!1), MSPartnersMarketingEmailOptin: ko.observable(!1) } };
    }
    function i() {
        return { AddressType: ko.observable(), AddressLine1: ko.observable(), AddressLine2: ko.observable(), AddressLine3: ko.observable(), City: ko.observable(), Country: ko.observable(), PostalCode: ko.observable(), StateProvinceCode: ko.observable(), CountryCode: ko.observable() };
    }
    function r() {
        return { PhoneType: ko.observable(), CountryCode: ko.observable(), AreaCode: ko.observable(), PhoneNumber: ko.observable(), Extension: ko.observable() };
    }
    function u() {
        return { ExamCode: ko.observable(), ExamName: ko.observable(), Locale: ko.observable(), Action: ko.observable(), ReturnUrl: ko.observable() };
    }
    var n = undefined;
    return function (f) {
        function e(n) {
            return n == undefined || n == null ? "" : n;
        }
        n = this;
        n.parent = f;
        n.getCandidateUserProfile = function () {
            var u = new t, f, e;
            return u.BasicProfile.FirstName(n.parent.firstName), u.BasicProfile.LastName(n.parent.lastName), u.BasicProfile.JobFunctionId(n.parent.selectedJobFunction), u.BasicProfile.ContactEmailAddress(n.parent.contactEmailAddress), u.BasicProfile.PreferredLanguage(n.parent.selectedLanguage), u.BasicProfile.CountryCode(n.parent.selectedCountry), u.BasicProfile.PostalCode(n.parent.postalCode), u.BasicProfile.AcceptedTermsOfUse(ko.computed(function () {
                return n.parent.termAccepted() == !0 ? 1 : 0;
            })), n.parent.legalFirstName() != "" && n.parent.legalLastName() != "" ? (u.LegalProfile.Salutation(n.parent.selectedTitle), u.LegalProfile.LegalFirstName(n.parent.legalFirstName), u.LegalProfile.LegalMiddleName(n.parent.legalMiddleName), u.LegalProfile.LegalLastName(n.parent.legalLastName)) : u.LegalProfile = null, f = new i, f.AddressLine1(n.parent.address1), f.AddressLine2(n.parent.address2), f.AddressLine3(n.parent.address3), f.City(n.parent.city), f.CountryCode(n.parent.selectedExtendedCountry), f.StateProvinceCode(n.parent.selectedStateRegion), f.PostalCode(n.parent.extendedPostalCode), u.Addresses.push(f), e = new r, e.AreaCode(n.parent.phonAreaCode), e.CountryCode(n.parent.phoneCountryCode), e.PhoneNumber(n.parent.phoneNumber), e.Extension(n.parent.phoneExtension), u.Phones.push(e), u.PrivacyPreferences.MSMarketingEmailOptin(n.parent.msEmailOption), u.PrivacyPreferences.MSPartnersMarketingEmailOptin(n.parent.msPartnerEmailOption), u.EdpProfile = {}, u.EdpProfile.LastTimeProfileSentToVue = n.parent.LastTimeProfileSentToVue, u;
        };
        n.getCandidateUserProfileToJSON = function () {
            return ko.toJSON(n.getCandidateUserProfile());
        };
        n.setCandidateUserProfileOnKO = function (t) {
            t.BasicProfile && (n.parent.firstName(e(t.BasicProfile.FirstName)), n.parent.lastName(e(t.BasicProfile.LastName)), n.parent.selectedJobFunction(t.BasicProfile.JobFunctionId), n.parent.contactEmailAddress(e(t.BasicProfile.ContactEmailAddress)), n.parent.selectedLanguage(t.BasicProfile.PreferredLanguage), n.parent.postalCode(e(t.BasicProfile.PostalCode)), n.parent.selectedCountry(t.BasicProfile.CountryCode), n.parent.termAccepted(e(t.BasicProfile.AcceptedTermsOfUse)));
            t.LegalProfile && (n.parent.selectedTitle(e(t.LegalProfile.Salutation)), n.parent.legalFirstName(e(t.LegalProfile.LegalFirstName)), n.parent.legalMiddleName(e(t.LegalProfile.LegalMiddleName)), n.parent.legalLastName(e(t.LegalProfile.LegalLastName)));
            t.Addresses && t.Addresses[0] && (n.parent.address1(e(t.Addresses[0].AddressLine1)), n.parent.address2(e(t.Addresses[0].AddressLine2)), n.parent.address3(e(t.Addresses[0].AddressLine3)), n.parent.city(e(t.Addresses[0].City)), n.parent.selectedExtendedCountry(e(t.Addresses[0].CountryCode)), n.parent.selectedStateRegion(e(t.Addresses[0].StateProvinceCode)), n.parent.extendedPostalCode(e(t.Addresses[0].PostalCode)));
            t.Phones && t.Phones[0] && (n.parent.phonAreaCode(e(t.Phones[0].AreaCode)), n.parent.phoneCountryCode(e(t.Phones[0].CountryCode)), n.parent.phoneNumber(e(t.Phones[0].PhoneNumber)), n.parent.phoneExtension(e(t.Phones[0].Extension)));
            t.PrivacyPreferences && (n.parent.msEmailOption(e(t.PrivacyPreferences.MSMarketingEmailOptin)), n.parent.msPartnerEmailOption(e(t.PrivacyPreferences.MSPartnersMarketingEmailOptin)));
            t.EdpProfile && (n.parent.LastTimeProfileSentToVue = t.EdpProfile.LastTimeProfileSentToVue);
        };
        n.setExamProfile = function (n, t, i, r, f) {
            var e = new u;
            return e.ExamCode(n), e.ExamName(t), e.Locale(i), e.Action(r), e.ReturnUrl(f), e;
        };
    };
}();
window.inviteUsersCount || (window.inviteUsersCount = 0);
microsoft.learning.mlx.usersModel = function () {
    var n = undefined, t = function (t) {
        n = this;
        this.orgId = t;
        this.currentUser = {
            FirstName: ko.observable(), LastName: ko.observable(), EmailAddress: ko.observable(), ClassDepartment: ko.observable(), IsActive: ko.observable(!0), Id: ko.observable(-1), IsEnrolled: ko.observable(!1), UserRoles: ko.observableArray([]), UniqueID: ko.observable(), CourseActivityReports: ko.observableArray([]), AssessmentActivityReports: ko.observableArray([]), save: function () {
                var t = this, r = t.Id() == -1, i;
                return t.Roles = ko.observableArray(), t.Roles.push("AnonymousAuthenticatedUser"), t.Roles.push("Learner"), t.Groups = "", $.each(t.UserRoles(), function (n, i) {
                    i.Selected() == !0 && t.Roles.push(i.Name());
                }), i = r ? "/services/users/?organizationId=" + n.orgId : "/services/users/" + t.Id() + "?organizationId=" + n.orgId, i = MLX.context.appChannel == 2 && this.isLearnerOnly() ? i + "&sendEnrollmentLink=false" : i + "&sendEnrollmentLink=" + (t.IsEnrolled() ? "false" : "true"), i = i + "&whr=" + microsoft.learning.mlx.utility.getQueryStringParamValue("whr") + "&applicationDomain=" + encodeURIComponent(window.location.href), MLX.ajax({ type: r ? "POST" : "PUT", url: i, dataType: "json", contentType: "application/json", data: JSON.stringify(ko.toJS(t)) }).done(function (i) {
                    t.Id() != -1 ? ko.mapping.fromJS(i, n.userMapping, n.userToUpdateOnSave) : (t.Id(i.Id), n.userToUpdateOnSave = ko.mapping.fromJS(i, n.userMapping));
                    n.usersList.remove(n.userToUpdateOnSave);
                    n.usersList.unshift(n.userToUpdateOnSave);
                });
            }, isValid: function (n) {
                return n.validateAll(), this.FirstName.errorCode() <= 0 && this.LastName.errorCode() <= 0 && this.EmailAddress.errorCode() <= 0 && this.ClassDepartment.errorCode() <= 0 && this.UniqueID.errorCode() <= 0;
            }, isLearnerOnly: function () {
                var n = this, t = !1;
                return n.Roles.indexOf("Learner") > -1 && (t = !0), (n.Roles.indexOf("Instructor") > -1 || n.Roles.indexOf("Administrator") > -1 || n.Roles.indexOf("ReportsAdministrator") > -1) && (t = !1), t;
            }, loadActivityReport: function () {
                var t = this, i = MLX.ajax({ url: "/services/reports/users/" + t.Id() + "?organizationId=" + n.orgId });
                return i.done(function (n) {
                    microsoft.learning.mlx.utility.addBIRefreshDate(n);
                    ko.mapping.fromJS(n, {}, t.CourseActivityReports);
                }), i;
            }, loadAssessmentReport: function () {
                var t = this, i = MLX.ajax({ url: "/services/reports/users/" + t.Id() + "/assessments?organizationId=" + n.orgId });
                return i.done(function (n) {
                    microsoft.learning.mlx.utility.addBIRefreshDate(n);
                    ko.mapping.fromJS(n, {}, t.AssessmentActivityReports);
                }), i;
            }
        };
        this.currentBulkAccessCode = { NumberOfCodes: ko.observable(50).extend({ required: "" }).extend({ maxValue: inviteUsersCount || 2e4 }), SendCodeInEmail: ko.observable(!1) };
    };
    return t.prototype.usersList = ko.observableArray([]), t.prototype.allRoles = undefined, t.prototype.bulkAccessCodes = ko.observableArray([]), t.prototype.uploadResults = { createdRows: ko.observableArray(), duplicateRows: ko.observableArray(), invalidRows: ko.observableArray(), failedRows: ko.observableArray(), totalRecords: ko.observable(0), uploadError: ko.observable("") }, t.prototype.loadAllRoles = function () {
        if (n.allRoles)
            return $.Deferred().resolve();
        var t = MLX.ajax({ url: "/services/organizations/Roles" });
        return t.done(function (t) {
            n.allRoles = t;
        }), t;
    }, t.prototype.showBulkUploadControl = function (n) {
        var t = $("#" + n), i = t.width(), r = t.height();
        t.html('<iframe scrolling="no" id="bulkUploadUsers" frameBorder="0" allowtransparency="true" src="https://' + MLX.context.apiHost + "/administration/UploadUserImportFile?channelId=" + MLX.context.appChannel + '"  style="height:' + r + "px;width:" + i + 'px;"><\/iframe>');
    }, t.prototype.submitBulkUpload = function () {
        var i = MLX.ajax({ url: "/Administration/NewUploadToken", type: "GET" }), t = i.pipe(function (n) {
            var t = microsoft.learning.mlx.utility.getQueryStringParamValue("whr");
            return MLX.sendCustomMessage({ token: n.token, formName: "form-upload-users", whr: t }, "bulkUploadUsers");
        });
        return t.done(function (t) {
            ko.mapping.fromJS(t, {}, n.uploadResults);
        }).fail(function (n) {
            var t = n;
        }), t;
    }, t.prototype.mapCurrentUserRoles = function () {
        var t = {
            create: function (t) {
                var i = { Name: ko.observable(t.data), DisplayName: ko.observable(""), Description: ko.observable(""), IsVisible: ko.observable(!1) }, r = !1;
                return n.currentUser.Roles && $.each(n.currentUser.Roles(), function (n, t) {
                    t == i.Name() && (r = !0);
                }), i.Selected = r ? ko.observable(!0) : ko.observable(!1), arguments[0].data == "Learner" ? (i.Selected = ko.observable(!0), i.Disabled = ko.observable(!0)) : i.Disabled = ko.observable(!1), i;
            }
        };
        ko.mapping.fromJS(n.allRoles, t, n.currentUser.UserRoles);
    }, t.prototype.newUser = function () {
        n.currentUser.FirstName("");
        n.currentUser.LastName("");
        n.currentUser.EmailAddress("");
        n.currentUser.ClassDepartment("");
        n.currentUser.IsActive(!0);
        n.currentUser.Id(-1);
        n.currentUser.IsEnrolled(!1);
        n.currentUser.UniqueID("");
        n.currentUser.Roles && n.currentUser.Roles.removeAll();
        var t = n.loadAllRoles();
        return t.done(function () {
            n.mapCurrentUserRoles();
        }), t;
    }, t.prototype.prepareUserForEdit = function (t) {
        n.userToUpdateOnSave = t;
        ko.mapping.fromJS(ko.mapping.toJS(t), {}, this.currentUser);
        var i = n.loadAllRoles();
        return i.done(function () {
            n.mapCurrentUserRoles();
        }), i;
    }, t.prototype.loadUsers = function (t, i, r, u, f) {
        var e = MLX.ajax({ url: "/services/organizations/" + n.orgId + "/Users?pageIndex=" + i + "&usersPerPage=" + r + "&searchcriteria=" + encodeURIComponent(u) });
        return n.userMapping = {
            create: function (i) {
                var r = t.create(i);
                return r.AssignedCoursesCount = ko.observable(), r.UserAddedCoursesCount = ko.observable(), r.LearningPlansCount = ko.observable(), r.UserGroups = ko.observableArray([]), r.loadAdditionalDetails = function () {
                    var t = this;
                    return MLX.ajax({ url: "/Services/users/" + t.Id() + "/Details?organizationId=" + n.orgId }).done(function (n) {
                        t.AssignedCoursesCount(n.AssignedCoursesCount);
                        t.UserAddedCoursesCount(n.UserAddedCoursesCount);
                        t.LearningPlansCount(n.LearningPlansCount);
                        ko.mapping.fromJS(n.UserGroups, {}, t.UserGroups);
                    });
                }, r;
            }, update: function (n) {
                return t.update(n);
            }
        }, e.done(function (t) {
            var r = ko.mapping.fromJS(t, n.userMapping)(), i = n.usersList();
            f && i.splice(0, i.length);
            ko.utils.arrayPushAll(i, r);
            n.usersList.valueHasMutated();
        }), e;
    }, t.prototype.loadOrganizationUsers = function (n, t, i) {
        var r = this, u = MLX.ajax({ url: "/services/organizations/Users", type: "POST", data: JSON.stringify(t), contentType: "application/json" });
        return r.userMapping = {
            create: function (t) {
                var i = n.create(t);
                return i.AssignedCoursesCount = ko.observable(), i.UserAddedCoursesCount = ko.observable(), i.LearningPlansCount = ko.observable(), i.UserGroups = ko.observableArray([]), i.loadAdditionalDetails = function () {
                    var n = this;
                    return MLX.ajax({ url: "/Services/users/" + n.Id() + "/Details?organizationId=" + r.orgId }).done(function (t) {
                        n.AssignedCoursesCount(t.AssignedCoursesCount);
                        n.UserAddedCoursesCount(t.UserAddedCoursesCount);
                        n.LearningPlansCount(t.LearningPlansCount);
                        ko.mapping.fromJS(t.UserGroups, {}, n.UserGroups);
                    });
                }, i;
            }, update: function (t) {
                return n.update(t);
            }
        }, u.done(function (t) {
            var f = ko.mapping.fromJS(t.Users, n), u = r.usersList();
            i || u.splice(0, u.length);
            ko.utils.arrayPushAll(u, f());
            r.usersList.valueHasMutated();
        }), u;
    }, t.prototype.EditUsersStatus = function (n) {
        return MLX.ajax({ url: "/services/users/EditUserStatus?whr=" + microsoft.learning.mlx.utility.getQueryStringParamValue("whr") + "&applicationDomain=" + encodeURIComponent(window.location.href) + "&sendEnrollmentLink=true", type: "PUT", data: JSON.stringify(n), contentType: "application/json" });
    }, t.prototype.EditUserRoles = function (n) {
        n.Roles.push("AnonymousAuthenticatedUser");
        return MLX.ajax({ url: "/services/users/EditUserRoles?whr=" + microsoft.learning.mlx.utility.getQueryStringParamValue("whr") + "&applicationDomain=" + encodeURIComponent(window.location.href) + "&sendEnrollmentLink=true", type: "PUT", data: JSON.stringify(n), contentType: "application/json" });
    }, t.prototype.EditOrganizationUserRoles = function (n) {
        return MLX.ajax({ url: "/services/users/EditUserOrganizationRole?sendMailNotification=false", type: "PUT", data: JSON.stringify(n), contentType: "application/json" });
    }, t.prototype.GetUserOrganizations = function (n, t) {
        return MLX.ajax({ url: "/services/users/UserOrganizations?isActive=" + n + "&isAdmin=" + t, type: "GET", contentType: "application/json" });
    }, t.prototype.getBulkAccessCodes = function () {
        return MLX.ajax({ url: "/Services/organizations/" + n.orgId + "/UserAccessCodes" }).done(function (t) {
            ko.mapping.fromJS(t, {}, n.bulkAccessCodes);
        });
    }, t.prototype.newBulkAccessCode = function () {
        this.currentBulkAccessCode.NumberOfCodes("");
        this.currentBulkAccessCode.SendCodeInEmail(!0);
    }, t.prototype.sendBulkAccessCodeEmail = function (t) {
        return MLX.ajax({ url: "/services/organizations/" + n.orgId + "/AccessCode/" + t + "?whr=" + microsoft.learning.mlx.utility.getQueryStringParamValue("whr") + "&applicationDomain=" + encodeURIComponent(window.location.href.split(":")[0] + "://" + window.location.host), type: "POST" });
    }, t.prototype.sendInviteUserEnrollCodeEmail = function (n) {
        return MLX.ajax({ url: "/services/organizations/InviteUserEnrollmentCode/" + n + "?whr=" + microsoft.learning.mlx.utility.getQueryStringParamValue("whr") + "&applicationDomain=" + encodeURIComponent(window.location.href.split(":")[0] + "://" + window.location.host), type: "POST" });
    }, t.prototype.generateBulkAccessCode = function (t, i) {
        return t <= 0 ? !1 : MLX.ajax({ url: "/Services/organizations/" + n.orgId + "/UserAccessCodes?numberOfUsages=" + t + "&roleNumber=" + i, type: "POST" }).pipe(function (t) {
            return (n.bulkAccessCodes.unshift(t), n.currentBulkAccessCode.SendCodeInEmail()) ? n.sendInviteUserEnrollCodeEmail(t.Id) : $.Deferred().resolve();
        });
    }, t.prototype.deactivateBulkAccessCodes = function (t) {
        var i = JSON.stringify(t);
        return MLX.ajax({ type: "POST", url: "/services/organizations/" + n.orgId + "/DeactivateBulkUseAccessCodes?whr=" + microsoft.learning.mlx.utility.getQueryStringParamValue("whr") + "&applicationDomain=" + encodeURIComponent(window.location.href), data: i, contentType: "application/json; charset=utf-8", dataType: "json" }).pipe(function () {
            return $.each(n.bulkAccessCodes(), function (n, i) {
                var r;
                r = typeof i.Id == "function" ? i.Id().toString() : i.Id.toString();
                t.indexOf(r) >= 0 && (i.UsagesRemaining = 0);
            }), $.Deferred().resolve();
        });
    }, t.prototype.savePrivacySetting = function (n) {
        return MLX.ajax({ url: "/services/organizations/OrganizationPrivacySettings", type: "PUT", data: JSON.stringify(n), contentType: "application/json" });
    }, t;
}(), function (n) {
    (function (n) {
        (function (n) {
            var t = function () {
                function n() {
                    this.clickEventId = "1";
                    this.tabDivToWebTrendsEventMapper = { "learning-plan-container": "Switch tab: Learning Plans", "list-learning-plans": "View Learning Plans List", "learning-plan-create-treeview": "Create Learning Plans", "learning-plan-edit-treeview": "Edit Learning Plans", "learning-plan-users": "Assign Learning Plan to User", "learning-plan-accesscode": "Assign Learning Plan by Access Code", "users-container": "Switch tab: Users", "list-users-container": "View Users List", "createuser-container": "Create or Edit Users", "upload-users-container": "Batch Create Users", "reports-container": "View Progress Report" };
                }
                return n.prototype.logTabChange = function (n) {
                    var t = n;
                    this.tabDivToWebTrendsEventMapper[n] && (t = this.tabDivToWebTrendsEventMapper[n]);
                    dcsMultiTrack("WT.dl", this.clickEventId, "WT.ev", t);
                }, n.prototype.logCourseStart = function (n, t) {
                    this.logCourseActivity("Launch a Course", n, n, t, "", "Course");
                }, n.prototype.logCourseEnd = function (n, t) {
                    this.logCourseActivity("Finish a Course", n, n, t, "", "Course");
                }, n.prototype.logLearningResourceStart = function (n, t, i, r, u) {
                    this.logCourseActivity("Start a " + i, u, n, t, r, i);
                }, n.prototype.logLearningResourceEnd = function (n, t, i, r, u) {
                    this.logCourseActivity("Finish a " + i, u, n, t, r, i);
                }, n.prototype.logCourseActivity = function (n, t, i, r, u, f) {
                    dcsMultiTrack("WT.dl", this.clickEventId, "WT.ev", n, "WT.ti", f + " - " + t, "WT.cg_n", r + " - " + i);
                }, n;
            }();
            n.WebTrendsHelper = t;
        })(n.mlx || (n.mlx = {}));
        var t = n.mlx;
    })(n.learning || (n.learning = {}));
    var t = n.learning;
}(microsoft || (microsoft = {}));
MLX.learnerapiBundleLoaded = !0;
