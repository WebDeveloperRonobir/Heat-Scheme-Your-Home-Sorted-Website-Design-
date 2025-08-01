/*========== Youtube Video Background ==========*/
/*
 _ jquery.mb.components                                                                                                                             
 _                                                                                                                                                  
 _ file: jquery.mb.YTPlayer.src.js                                                                                                                  
 _ last modified: 05/01/16 17.43                                                                                                                    
 _                                                                                                                                                  
 _ Open Lab s.r.l., Florence - Italy                                                                                                                
 _                                                                                                                                                  
 _ email: matteo@open-lab.com                                                                                                                       
 _ site: http://pupunzi.com                                                                                                                         
 _       http://open-lab.com                                                                                                                        
 _ blog: http://pupunzi.open-lab.com                                                                                                                
 _ Q&A:  http://jquery.pupunzi.com                                                                                                                  
 _                                                                                                                                                  
 _ Licences: MIT, GPL                                                                                                                               
 _    http://www.opensource.org/licenses/mit-license.php                                                                                           
 _    http://www.gnu.org/licenses/gpl.html                                                                                                         
 _                                                                                                                                                  
 _ Copyright (c) 2001-2016. Matteo Bicocchi (Pupunzi);                                                                                              
*/
var ytp = ytp || {};

function onYouTubeIframeAPIReady() {
    ytp.YTAPIReady || (ytp.YTAPIReady = !0, jQuery(document).trigger("YTAPIReady"))
}
var getYTPVideoID = function(e) {
    var r, t;
    return e.indexOf("youtu.be") > 0 ? r = (t = (r = e.substr(e.lastIndexOf("/") + 1, e.length)).indexOf("?list=") > 0 ? r.substr(r.lastIndexOf("="), r.length) : null) ? r.substr(0, r.lastIndexOf("?")) : r : e.indexOf("http") > -1 ? (r = e.match(/[\\?&]v=([^&#]*)/)[1], t = e.indexOf("list=") > 0 ? e.match(/[\\?&]list=([^&#]*)/)[1] : null) : t = (r = e.length > 15 ? null : e) ? null : e, {
        videoID: r,
        playlistID: t
    }
};
! function(jQuery, ytp) {
    jQuery.mbYTPlayer = {
        name: "jquery.mb.YTPlayer",
        version: "3.0.8",
        build: "5878",
        author: "Matteo Bicocchi",
        apiKey: "",
        defaults: {
            containment: "body",
            ratio: "auto",
            videoURL: null,
            playlistURL: null,
            startAt: 0,
            stopAt: 0,
            autoPlay: !0,
            vol: 50,
            addRaster: !1,
            mask: !1,
            opacity: 1,
            quality: "default",
            mute: !1,
            loop: !0,
            showControls: !0,
            showAnnotations: !1,
            showYTLogo: !0,
            stopMovieOnBlur: !0,
            realfullscreen: !0,
            mobileFallbackImage: null,
            gaTrack: !0,
            optimizeDisplay: !0,
            align: "center,center",
            onReady: function(e) {}
        },
        controls: {
            play: "P",
            pause: "p",
            mute: "M",
            unmute: "A",
            onlyYT: "O",
            showSite: "R",
            ytLogo: "Y"
        },
        controlBar: null,
        loading: null,
        locationProtocol: "https:",
        filters: {
            grayscale: {
                value: 0,
                unit: "%"
            },
            hue_rotate: {
                value: 0,
                unit: "deg"
            },
            invert: {
                value: 0,
                unit: "%"
            },
            opacity: {
                value: 0,
                unit: "%"
            },
            saturate: {
                value: 0,
                unit: "%"
            },
            sepia: {
                value: 0,
                unit: "%"
            },
            brightness: {
                value: 0,
                unit: "%"
            },
            contrast: {
                value: 0,
                unit: "%"
            },
            blur: {
                value: 0,
                unit: "px"
            }
        },
        buildPlayer: function(options) {
            return this.each(function() {
                var YTPlayer = this,
                    $YTPlayer = jQuery(YTPlayer);
                YTPlayer.loop = 0, YTPlayer.opt = {}, YTPlayer.state = {}, YTPlayer.filters = jQuery.mbYTPlayer.filters, YTPlayer.filtersEnabled = !0, YTPlayer.id = YTPlayer.id || "YTP_" + (new Date).getTime(), $YTPlayer.addClass("mb_YTPlayer");
                var property = $YTPlayer.data("property") && "string" == typeof $YTPlayer.data("property") ? eval("(" + $YTPlayer.data("property") + ")") : $YTPlayer.data("property");
                void 0 !== property && void 0 !== property.vol && (property.vol = 0 === property.vol ? property.vol = 1 : property.vol), jQuery.extend(YTPlayer.opt, jQuery.mbYTPlayer.defaults, options, property), YTPlayer.hasChanged || (YTPlayer.defaultOpt = {}, jQuery.extend(YTPlayer.defaultOpt, jQuery.mbYTPlayer.defaults, options)), "true" == YTPlayer.opt.loop && (YTPlayer.opt.loop = 9999), YTPlayer.isRetina = window.retina || window.devicePixelRatio > 1;
                var isIframe = function() {
                    var e = !1;
                    try {
                        self.location.href != top.location.href && (e = !0)
                    } catch (r) {
                        e = !0
                    }
                    return e
                };
                YTPlayer.canGoFullScreen = !(jQuery.browser.msie || jQuery.browser.opera || isIframe()), YTPlayer.canGoFullScreen || (YTPlayer.opt.realfullscreen = !1), $YTPlayer.attr("id") || $YTPlayer.attr("id", "video_" + (new Date).getTime());
                var playerID = "mbYTP_" + YTPlayer.id;
                YTPlayer.isAlone = !1, YTPlayer.hasFocus = !0;
                var videoID = this.opt.videoURL ? getYTPVideoID(this.opt.videoURL).videoID : !!$YTPlayer.attr("href") && getYTPVideoID($YTPlayer.attr("href")).videoID,
                    playlistID = this.opt.videoURL ? getYTPVideoID(this.opt.videoURL).playlistID : !!$YTPlayer.attr("href") && getYTPVideoID($YTPlayer.attr("href")).playlistID;
                YTPlayer.videoID = videoID, YTPlayer.playlistID = playlistID, YTPlayer.opt.showAnnotations = YTPlayer.opt.showAnnotations ? "0" : "3";
                var playerVars = {
                    modestbranding: 1,
                    autoplay: 0,
                    controls: 0,
                    showinfo: 0,
                    rel: 0,
                    enablejsapi: 1,
                    version: 3,
                    playerapiid: playerID,
                    origin: "*",
                    allowfullscreen: !0,
                    wmode: "transparent",
                    iv_load_policy: YTPlayer.opt.showAnnotations
                };
                if (document.createElement("video").canPlayType && jQuery.extend(playerVars, {
                        html5: 1
                    }), jQuery.browser.msie && jQuery.browser.version < 9 && (this.opt.opacity = 1), YTPlayer.isSelf = "self" == YTPlayer.opt.containment, YTPlayer.defaultOpt.containment = YTPlayer.opt.containment = "self" == YTPlayer.opt.containment ? jQuery(this) : jQuery(YTPlayer.opt.containment), YTPlayer.isBackground = YTPlayer.opt.containment.is("body"), !YTPlayer.isBackground || !ytp.backgroundIsInited) {
                    var isPlayer = YTPlayer.opt.containment.is(jQuery(this));
                    YTPlayer.canPlayOnMobile = isPlayer && 0 === jQuery(this).children().length, YTPlayer.isPlayer = !1, isPlayer ? YTPlayer.isPlayer = !0 : $YTPlayer.hide();
                    var overlay = jQuery("<div/>").css({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%"
                    }).addClass("YTPOverlay");
                    YTPlayer.isPlayer && overlay.on("click", function() {
                        $YTPlayer.YTPTogglePlay()
                    });
                    var wrapper = jQuery("<div/>").addClass("mbYTP_wrapper").attr("id", "wrapper_" + playerID);
                    wrapper.css({
                        position: "absolute",
                        zIndex: 0,
                        minWidth: "100%",
                        minHeight: "100%",
                        left: 0,
                        top: 0,
                        overflow: "hidden",
                        opacity: 0
                    });
                    var playerBox = jQuery("<div/>").attr("id", playerID).addClass("playerBox");
                    if (playerBox.css({
                            position: "absolute",
                            zIndex: 0,
                            width: "100%",
                            height: "100%",
                            top: 0,
                            left: 0,
                            overflow: "hidden"
                        }), wrapper.append(playerBox), YTPlayer.opt.containment.children().not("script, style").each(function() {
                            "static" == jQuery(this).css("position") && jQuery(this).css("position", "relative")
                        }), YTPlayer.isBackground ? (jQuery("body").css({
                            boxSizing: "border-box"
                        }), wrapper.css({
                            position: "fixed",
                            top: 0,
                            left: 0,
                            zIndex: 0
                        }), $YTPlayer.hide()) : "static" == YTPlayer.opt.containment.css("position") && YTPlayer.opt.containment.css({
                            position: "relative"
                        }), YTPlayer.opt.containment.prepend(wrapper), YTPlayer.wrapper = wrapper, playerBox.css({
                            opacity: 1
                        }), jQuery.browser.mobile || (playerBox.after(overlay), YTPlayer.overlay = overlay), YTPlayer.isBackground || overlay.on("mouseenter", function() {
                            YTPlayer.controlBar.length && YTPlayer.controlBar.addClass("visible")
                        }).on("mouseleave", function() {
                            YTPlayer.controlBar.length && YTPlayer.controlBar.removeClass("visible")
                        }), ytp.YTAPIReady) setTimeout(function() {
                        jQuery(document).trigger("YTAPIReady")
                    }, 100);
                    else {
                        jQuery("#YTAPI").remove();
                        var tag = jQuery("<script><\/script>").attr({
                            src: jQuery.mbYTPlayer.locationProtocol + "//www.youtube.com/iframe_api?v=" + jQuery.mbYTPlayer.version,
                            id: "YTAPI"
                        });
                        jQuery("head").prepend(tag)
                    }
                    if (jQuery.browser.mobile && !YTPlayer.canPlayOnMobile) return YTPlayer.opt.mobileFallbackImage && YTPlayer.opt.containment.css({
                        backgroundImage: "url(" + YTPlayer.opt.mobileFallbackImage + ")",
                        backgroundPosition: "center center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat"
                    }), $YTPlayer.remove(), void jQuery(document).trigger("YTPUnavailable");
                    jQuery(document).on("YTAPIReady", function() {
                        YTPlayer.isBackground && ytp.backgroundIsInited || YTPlayer.isInit || (YTPlayer.isBackground && (ytp.backgroundIsInited = !0), YTPlayer.opt.autoPlay = void 0 === YTPlayer.opt.autoPlay ? !!YTPlayer.isBackground : YTPlayer.opt.autoPlay, YTPlayer.opt.vol = YTPlayer.opt.vol ? YTPlayer.opt.vol : 100, jQuery.mbYTPlayer.getDataFromAPI(YTPlayer), jQuery(YTPlayer).on("YTPChanged", function() {
                            if (!YTPlayer.isInit)
                                if (YTPlayer.isInit = !0, jQuery.browser.mobile && YTPlayer.canPlayOnMobile) {
                                    if (YTPlayer.opt.containment.outerWidth() > jQuery(window).width()) {
                                        YTPlayer.opt.containment.css({
                                            maxWidth: "100%"
                                        });
                                        var h = .563 * YTPlayer.opt.containment.outerWidth();
                                        YTPlayer.opt.containment.css({
                                            maxHeight: h
                                        })
                                    }
                                    new YT.Player(playerID, {
                                        videoId: YTPlayer.videoID.toString(),
                                        width: "100%",
                                        height: h,
                                        playerVars: playerVars,
                                        events: {
                                            onReady: function(e) {
                                                YTPlayer.player = e.target, playerBox.css({
                                                    opacity: 1
                                                }), YTPlayer.wrapper.css({
                                                    opacity: 1
                                                })
                                            }
                                        }
                                    })
                                } else new YT.Player(playerID, {
                                    videoId: YTPlayer.videoID.toString(),
                                    playerVars: playerVars,
                                    events: {
                                        onReady: function(e) {
                                            YTPlayer.player = e.target, YTPlayer.isReady || (YTPlayer.isReady = !(YTPlayer.isPlayer && !YTPlayer.opt.autoPlay), YTPlayer.playerEl = YTPlayer.player.getIframe(), jQuery(YTPlayer.playerEl).unselectable(), $YTPlayer.optimizeDisplay(), YTPlayer.videoID = videoID, jQuery(window).off("resize.YTP_" + YTPlayer.id).on("resize.YTP_" + YTPlayer.id, function() {
                                                $YTPlayer.optimizeDisplay()
                                            }), jQuery.mbYTPlayer.checkForState(YTPlayer))
                                        },
                                        onStateChange: function(event) {
                                            if ("function" == typeof event.target.getPlayerState) {
                                                var state = event.target.getPlayerState();
                                                if (YTPlayer.preventTrigger) YTPlayer.preventTrigger = !1;
                                                else {
                                                    var eventType;
                                                    switch (YTPlayer.state = state, state) {
                                                        case -1:
                                                            eventType = "YTPUnstarted";
                                                            break;
                                                        case 0:
                                                            eventType = "YTPEnd";
                                                            break;
                                                        case 1:
                                                            eventType = "YTPPlay", YTPlayer.controlBar.length && YTPlayer.controlBar.find(".mb_YTPPlaypause").html(jQuery.mbYTPlayer.controls.pause), "undefined" != typeof _gaq && eval(YTPlayer.opt.gaTrack) && _gaq.push(["_trackEvent", "YTPlayer", "Play", YTPlayer.hasData ? YTPlayer.videoData.title : YTPlayer.videoID.toString()]), "undefined" != typeof ga && eval(YTPlayer.opt.gaTrack) && ga("send", "event", "YTPlayer", "play", YTPlayer.hasData ? YTPlayer.videoData.title : YTPlayer.videoID.toString());
                                                            break;
                                                        case 2:
                                                            eventType = "YTPPause", YTPlayer.controlBar.length && YTPlayer.controlBar.find(".mb_YTPPlaypause").html(jQuery.mbYTPlayer.controls.play);
                                                            break;
                                                        case 3:
                                                            YTPlayer.player.setPlaybackQuality(YTPlayer.opt.quality), eventType = "YTPBuffering", YTPlayer.controlBar.length && YTPlayer.controlBar.find(".mb_YTPPlaypause").html(jQuery.mbYTPlayer.controls.play);
                                                            break;
                                                        case 5:
                                                            eventType = "YTPCued"
                                                    }
                                                    var YTPEvent = jQuery.Event(eventType);
                                                    YTPEvent.time = YTPlayer.currentTime, YTPlayer.canTrigger && jQuery(YTPlayer).trigger(YTPEvent)
                                                }
                                            }
                                        },
                                        onPlaybackQualityChange: function(e) {
                                            var r = e.target.getPlaybackQuality(),
                                                t = jQuery.Event("YTPQualityChange");
                                            t.quality = r, jQuery(YTPlayer).trigger(t)
                                        },
                                        onError: function(e) {
                                            150 == e.data && (console.log("Embedding this video is restricted by Youtube."), YTPlayer.isPlayList && jQuery(YTPlayer).playNext()), 2 == e.data && YTPlayer.isPlayList && jQuery(YTPlayer).playNext(), "function" == typeof YTPlayer.opt.onError && YTPlayer.opt.onError($YTPlayer, e)
                                        }
                                    }
                                })
                        }))
                    }), $YTPlayer.off("YTPTime.mask"), jQuery.mbYTPlayer.applyMask(YTPlayer)
                }
            })
        },
        getDataFromAPI: function(e) {
            if (e.videoData = jQuery.mbStorage.get("YTPlayer_data_" + e.videoID), jQuery(e).off("YTPData.YTPlayer").on("YTPData.YTPlayer", function() {
                    if (e.hasData && e.isPlayer && !e.opt.autoPlay) {
                        var r = e.videoData.thumb_max || e.videoData.thumb_high || e.videoData.thumb_medium;
                        e.opt.containment.css({
                            background: "rgba(0,0,0,0.5) url(" + r + ") center center",
                            backgroundSize: "cover"
                        }), e.opt.backgroundUrl = r
                    }
                }), e.videoData) setTimeout(function() {
                e.opt.ratio = "auto" == e.opt.ratio ? "16/9" : e.opt.ratio, e.dataReceived = !0, jQuery(e).trigger("YTPChanged");
                var r = jQuery.Event("YTPData");
                r.prop = {};
                for (var t in e.videoData) r.prop[t] = e.videoData[t];
                jQuery(e).trigger(r)
            }, 500), e.hasData = !0;
            else if (jQuery.mbYTPlayer.apiKey) jQuery.getJSON(jQuery.mbYTPlayer.locationProtocol + "//www.googleapis.com/youtube/v3/videos?id=" + e.videoID + "&key=" + jQuery.mbYTPlayer.apiKey + "&part=snippet", function(r) {
                var t;
                e.dataReceived = !0, jQuery(e).trigger("YTPChanged"), t = r.items[0].snippet, e.videoData = {}, e.videoData.id = e.videoID, e.videoData.channelTitle = t.channelTitle, e.videoData.title = t.title, e.videoData.description = t.description.length < 400 ? t.description : t.description.substring(0, 400) + " ...", e.videoData.aspectratio = "auto" == e.opt.ratio ? "16/9" : e.opt.ratio, e.opt.ratio = e.videoData.aspectratio, e.videoData.thumb_max = t.thumbnails.maxres ? t.thumbnails.maxres.url : null, e.videoData.thumb_high = t.thumbnails.high ? t.thumbnails.high.url : null, e.videoData.thumb_medium = t.thumbnails.medium ? t.thumbnails.medium.url : null, jQuery.mbStorage.set("YTPlayer_data_" + e.videoID, e.videoData), e.hasData = !0;
                var a = jQuery.Event("YTPData");
                a.prop = {};
                for (var l in e.videoData) a.prop[l] = e.videoData[l];
                jQuery(e).trigger(a)
            });
            else {
                if (setTimeout(function() {
                        jQuery(e).trigger("YTPChanged")
                    }, 50), e.isPlayer && !e.opt.autoPlay) {
                    var r = jQuery.mbYTPlayer.locationProtocol + "//i.ytimg.com/vi/" + e.videoID + "/hqdefault.jpg";
                    e.opt.containment.css({
                        background: "rgba(0,0,0,0.5) url(" + r + ") center center",
                        backgroundSize: "cover"
                    }), e.opt.backgroundUrl = r
                }
                e.videoData = null, e.opt.ratio = "auto" == e.opt.ratio ? "16/9" : e.opt.ratio
            }!e.isPlayer || e.opt.autoPlay || jQuery.browser.mobile || (e.loading = jQuery("<div/>").addClass("loading").html("Loading").hide(), jQuery(e).append(e.loading), e.loading.fadeIn())
        },
        removeStoredData: function() {
            jQuery.mbStorage.remove()
        },
        getVideoData: function() {
            return this.get(0).videoData
        },
        getVideoID: function() {
            return this.get(0).videoID || !1
        },
        setVideoQuality: function(e) {
            this.get(0).player.setPlaybackQuality(e)
        },
        playlist: function(e, r, t, a) {
            var l = this.get(0);
            return l.isPlayList = !0, r && (e = jQuery.shuffle(e)), l.videoID || (l.videos = e, l.videoCounter = 0, l.videoLength = e.length, jQuery(l).data("property", e[0]), jQuery(l).mb_YTPlayer()), "function" == typeof t && jQuery(l).one("YTPChanged", function() {
                t(l)
            }), jQuery(l).on("YTPEnd", function() {
                a = void 0 === a || a, jQuery(l).playNext(a)
            }), this
        },
        playNext: function(e) {
            var r = this.get(0);
            return r.checkForStartAt && (clearTimeout(r.checkForStartAt), clearInterval(r.getState)), r.videoCounter++, r.videoCounter >= r.videoLength && e && (r.videoCounter = 0), r.videoCounter < r.videoLength ? jQuery(r).changeMovie(r.videos[r.videoCounter]) : r.videoCounter--, this
        },
        playPrev: function() {
            var e = this.get(0);
            return e.checkForStartAt && (clearInterval(e.checkForStartAt), clearInterval(e.getState)), e.videoCounter--, e.videoCounter < 0 && (e.videoCounter = e.videoLength - 1), jQuery(e).changeMovie(e.videos[e.videoCounter]), this
        },
        playIndex: function(e) {
            var r = this.get(0);
            return e -= 1, r.checkForStartAt && (clearInterval(r.checkForStartAt), clearInterval(r.getState)), r.videoCounter = e, r.videoCounter >= r.videoLength - 1 && (r.videoCounter = r.videoLength - 1), jQuery(r).changeMovie(r.videos[r.videoCounter]), this
        },
        changeMovie: function(e) {
            var r = this.get(0);
            r.opt.startAt = 0, r.opt.stopAt = 0, r.opt.mask = !1, r.opt.mute = !0, r.hasData = !1, r.hasChanged = !0, r.player.loopTime = void 0, e && jQuery.extend(r.opt, e), r.videoID = getYTPVideoID(r.opt.videoURL).videoID, "true" == r.opt.loop && (r.opt.loop = 9999), jQuery(r.playerEl).CSSAnimate({
                opacity: 0
            }, 200, function() {
                var e = jQuery.Event("YTPChangeMovie");
                e.time = r.currentTime, e.videoId = r.videoID, jQuery(r).trigger(e), jQuery(r).YTPGetPlayer().cueVideoByUrl(encodeURI(jQuery.mbYTPlayer.locationProtocol + "//www.youtube.com/v/" + r.videoID), 1, r.opt.quality), jQuery(r).optimizeDisplay(), jQuery.mbYTPlayer.checkForState(r), jQuery.mbYTPlayer.getDataFromAPI(r)
            }), jQuery.mbYTPlayer.applyMask(r)
        },
        getPlayer: function() {
            return jQuery(this).get(0).player
        },
        playerDestroy: function() {
            var e = this.get(0);
            return ytp.YTAPIReady = !0, ytp.backgroundIsInited = !1, e.isInit = !1, e.videoID = null, e.wrapper.remove(), jQuery("#controlBar_" + e.id).remove(), clearInterval(e.checkForStartAt), clearInterval(e.getState), this
        },
        fullscreen: function(real) {
            var YTPlayer = this.get(0);
            void 0 === real && (real = YTPlayer.opt.realfullscreen), real = eval(real);
            var controls = jQuery("#controlBar_" + YTPlayer.id),
                fullScreenBtn = controls.find(".mb_OnlyYT"),
                videoWrapper = YTPlayer.isSelf ? YTPlayer.opt.containment : YTPlayer.wrapper;
            if (real) {
                var fullscreenchange = jQuery.browser.mozilla ? "mozfullscreenchange" : jQuery.browser.webkit ? "webkitfullscreenchange" : "fullscreenchange";
                jQuery(document).off(fullscreenchange).on(fullscreenchange, function() {
                    RunPrefixMethod(document, "IsFullScreen") || RunPrefixMethod(document, "FullScreen") ? (jQuery(YTPlayer).YTPSetVideoQuality("default"), jQuery(YTPlayer).trigger("YTPFullScreenStart")) : (YTPlayer.isAlone = !1, fullScreenBtn.html(jQuery.mbYTPlayer.controls.onlyYT), jQuery(YTPlayer).YTPSetVideoQuality(YTPlayer.opt.quality), videoWrapper.removeClass("YTPFullscreen"), videoWrapper.CSSAnimate({
                        opacity: YTPlayer.opt.opacity
                    }, 500), videoWrapper.css({
                        zIndex: 0
                    }), YTPlayer.isBackground ? jQuery("body").after(controls) : YTPlayer.wrapper.before(controls), jQuery(window).resize(), jQuery(YTPlayer).trigger("YTPFullScreenEnd"))
                })
            }
            if (YTPlayer.isAlone) jQuery(document).off("mousemove.YTPlayer"), clearTimeout(YTPlayer.hideCursor), YTPlayer.overlay.css({
                cursor: "auto"
            }), real ? cancelFullscreen() : (videoWrapper.CSSAnimate({
                opacity: YTPlayer.opt.opacity
            }, 500), videoWrapper.css({
                zIndex: 0
            })), fullScreenBtn.html(jQuery.mbYTPlayer.controls.onlyYT), YTPlayer.isAlone = !1;
            else {
                function hideMouse() {
                    YTPlayer.overlay.css({
                        cursor: "none"
                    })
                }
                jQuery(document).on("mousemove.YTPlayer", function(e) {
                    YTPlayer.overlay.css({
                        cursor: "auto"
                    }), clearTimeout(YTPlayer.hideCursor), jQuery(e.target).parents().is(".mb_YTPBar") || (YTPlayer.hideCursor = setTimeout(hideMouse, 3e3))
                }), hideMouse(), real ? (videoWrapper.css({
                    opacity: 0
                }), videoWrapper.addClass("YTPFullscreen"), launchFullscreen(videoWrapper.get(0)), setTimeout(function() {
                    videoWrapper.CSSAnimate({
                        opacity: 1
                    }, 1e3), YTPlayer.wrapper.append(controls), jQuery(YTPlayer).optimizeDisplay(), YTPlayer.player.seekTo(YTPlayer.player.getCurrentTime() + .1, !0)
                }, 500)) : videoWrapper.css({
                    zIndex: 1e4
                }).CSSAnimate({
                    opacity: 1
                }, 1e3), fullScreenBtn.html(jQuery.mbYTPlayer.controls.showSite), YTPlayer.isAlone = !0
            }

            function RunPrefixMethod(e, r) {
                for (var t, a, l = ["webkit", "moz", "ms", "o", ""], o = 0; o < l.length && !e[t];) {
                    if (t = r, "" == l[o] && (t = t.substr(0, 1).toLowerCase() + t.substr(1)), "undefined" != (a = typeof e[t = l[o] + t])) return l = [l[o]], "function" == a ? e[t]() : e[t];
                    o++
                }
            }

            function launchFullscreen(e) {
                RunPrefixMethod(e, "RequestFullScreen")
            }

            function cancelFullscreen() {
                (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) && RunPrefixMethod(document, "CancelFullScreen")
            }
            return this
        },
        toggleLoops: function() {
            var e = this.get(0),
                r = e.opt;
            return 1 == r.loop ? r.loop = 0 : (r.startAt ? e.player.seekTo(r.startAt) : e.player.playVideo(), r.loop = 1), this
        },
        play: function() {
            var e = this.get(0);
            return e.isReady ? (e.player.playVideo(), e.wrapper.CSSAnimate({
                opacity: e.isAlone ? 1 : e.opt.opacity
            }, 2e3), jQuery(e.playerEl).CSSAnimate({
                opacity: 1
            }, 1e3), jQuery("#controlBar_" + e.id).find(".mb_YTPPlaypause").html(jQuery.mbYTPlayer.controls.pause), e.state = 1, jQuery(e).css("background-image", "none"), this) : this
        },
        togglePlay: function(e) {
            var r = this.get(0);
            return 1 == r.state ? this.YTPPause() : this.YTPPlay(), "function" == typeof e && e(r.state), this
        },
        stop: function() {
            var e = this.get(0);
            return jQuery("#controlBar_" + e.id).find(".mb_YTPPlaypause").html(jQuery.mbYTPlayer.controls.play), e.player.stopVideo(), this
        },
        pause: function() {
            var e = this.get(0);
            return e.player.pauseVideo(), e.state = 2, this
        },
        seekTo: function(e) {
            return this.get(0).player.seekTo(e, !0), this
        },
        setVolume: function(e) {
            var r = this.get(0);
            return e || r.opt.vol || 0 != r.player.getVolume() ? !e && r.player.getVolume() > 0 || e && r.opt.vol == e ? r.isMute ? jQuery(r).YTPUnmute() : jQuery(r).YTPMute() : (r.opt.vol = e, r.player.setVolume(r.opt.vol), r.volumeBar && r.volumeBar.length && r.volumeBar.updateSliderVal(e)) : jQuery(r).YTPUnmute(), this
        },
        toggleVolume: function() {
            var e = this.get(0);
            if (e) return e.player.isMuted() ? (jQuery(e).YTPUnmute(), !0) : (jQuery(e).YTPMute(), !1)
        },
        mute: function() {
            var e = this.get(0);
            if (!e.isMute) {
                e.player.mute(), e.isMute = !0, e.player.setVolume(0), e.volumeBar && e.volumeBar.length && e.volumeBar.width() > 10 && e.volumeBar.updateSliderVal(0), jQuery("#controlBar_" + e.id).find(".mb_YTPMuteUnmute").html(jQuery.mbYTPlayer.controls.unmute), jQuery(e).addClass("isMuted"), e.volumeBar && e.volumeBar.length && e.volumeBar.addClass("muted");
                var r = jQuery.Event("YTPMuted");
                return r.time = e.currentTime, e.canTrigger && jQuery(e).trigger(r), this
            }
        },
        unmute: function() {
            var e = this.get(0);
            if (e.isMute) {
                e.player.unMute(), e.isMute = !1, e.player.setVolume(e.opt.vol), e.volumeBar && e.volumeBar.length && e.volumeBar.updateSliderVal(e.opt.vol > 10 ? e.opt.vol : 10), jQuery("#controlBar_" + e.id).find(".mb_YTPMuteUnmute").html(jQuery.mbYTPlayer.controls.mute), jQuery(e).removeClass("isMuted"), e.volumeBar && e.volumeBar.length && e.volumeBar.removeClass("muted");
                var r = jQuery.Event("YTPUnmuted");
                return r.time = e.currentTime, e.canTrigger && jQuery(e).trigger(r), this
            }
        },
        applyFilter: function(e, r) {
            return this.each(function() {
                this.filters[e].value = r, this.filtersEnabled && jQuery(this).YTPEnableFilters()
            })
        },
        applyFilters: function(e) {
            return this.each(function() {
                var r = this;
                if (r.isReady) {
                    for (var t in e) jQuery(r).YTPApplyFilter(t, e[t]);
                    jQuery(r).trigger("YTPFiltersApplied")
                } else jQuery(r).on("YTPReady", function() {
                    jQuery(r).YTPApplyFilters(e)
                })
            })
        },
        toggleFilter: function(e, r) {
            return this.each(function() {
                this.filters[e].value ? this.filters[e].value = 0 : this.filters[e].value = r, this.filtersEnabled && jQuery(this).YTPEnableFilters()
            })
        },
        toggleFilters: function(e) {
            return this.each(function() {
                var r = this;
                r.filtersEnabled ? (jQuery(r).trigger("YTPDisableFilters"), jQuery(r).YTPDisableFilters()) : (jQuery(r).YTPEnableFilters(), jQuery(r).trigger("YTPEnableFilters")), "function" == typeof e && e(r.filtersEnabled)
            })
        },
        disableFilters: function() {
            return this.each(function() {
                var e = jQuery(this.playerEl);
                e.css("-webkit-filter", ""), e.css("filter", ""), this.filtersEnabled = !1
            })
        },
        enableFilters: function() {
            return this.each(function() {
                var e = this,
                    r = jQuery(e.playerEl),
                    t = "";
                for (var a in e.filters) e.filters[a].value && (t += a.replace("_", "-") + "(" + e.filters[a].value + e.filters[a].unit + ") ");
                r.css("-webkit-filter", t), r.css("filter", t), e.filtersEnabled = !0
            })
        },
        removeFilter: function(e, r) {
            return this.each(function() {
                if ("function" == typeof e && (r = e, e = null), e) jQuery(this).YTPApplyFilter(e, 0), "function" == typeof r && r(e);
                else
                    for (var t in this.filters) jQuery(this).YTPApplyFilter(t, 0), "function" == typeof r && r(t)
            })
        },
        getFilters: function() {
            return this.get(0).filters
        },
        addMask: function(e) {
            var r = this.get(0),
                t = r.overlay;
            e || (e = r.actualMask);
            var a = jQuery("<img/>").attr("src", e).on("load", function() {
                t.CSSAnimate({
                    opacity: 0
                }, 500, function() {
                    r.hasMask = !0, a.remove(), t.css({
                        backgroundImage: "url(" + e + ")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundSize: "cover"
                    }), t.CSSAnimate({
                        opacity: 1
                    }, 500)
                })
            });
            return this
        },
        removeMask: function() {
            var e = this.get(0),
                r = e.overlay;
            return r.CSSAnimate({
                opacity: 0
            }, 500, function() {
                e.hasMask = !1, r.css({
                    backgroundImage: "",
                    backgroundRepeat: "",
                    backgroundPosition: "",
                    backgroundSize: ""
                }), r.CSSAnimate({
                    opacity: 1
                }, 500)
            }), this
        },
        applyMask: function(e) {
            var r = jQuery(e);
            if (r.off("YTPTime.mask"), e.opt.mask)
                if ("string" == typeof e.opt.mask) r.YTPAddMask(e.opt.mask), e.actualMask = e.opt.mask;
                else if ("object" == typeof e.opt.mask) {
                for (var t in e.opt.mask)
                    if (e.opt.mask[t]) jQuery("<img/>").attr("src", e.opt.mask[t]);
                e.opt.mask[0] && r.YTPAddMask(e.opt.mask[0]), r.on("YTPTime.mask", function(t) {
                    for (var a in e.opt.mask) t.time == a && (e.opt.mask[a] ? (r.YTPAddMask(e.opt.mask[a]), e.actualMask = e.opt.mask[a]) : r.YTPRemoveMask())
                })
            }
        },
        toggleMask: function() {
            var e = this.get(0),
                r = $(e);
            return e.hasMask ? r.YTPRemoveMask() : r.YTPAddMask(), this
        },
        manageProgress: function() {
            var e = this.get(0),
                r = jQuery("#controlBar_" + e.id),
                t = r.find(".mb_YTPProgress"),
                a = r.find(".mb_YTPLoaded"),
                l = r.find(".mb_YTPseekbar"),
                o = t.outerWidth(),
                i = Math.floor(e.player.getCurrentTime()),
                n = Math.floor(e.player.getDuration()),
                y = i * o / n,
                u = 100 * e.player.getVideoLoadedFraction();
            return a.css({
                left: 0,
                width: u + "%"
            }), l.css({
                left: 0,
                width: y
            }), {
                totalTime: n,
                currentTime: i
            }
        },
        buildControls: function(YTPlayer) {
            var data = YTPlayer.opt;
            if (data.showYTLogo = data.showYTLogo || data.printUrl, !jQuery("#controlBar_" + YTPlayer.id).length) {
                YTPlayer.controlBar = jQuery("<span/>").attr("id", "controlBar_" + YTPlayer.id).addClass("mb_YTPBar").css({
                    whiteSpace: "noWrap",
                    position: YTPlayer.isBackground ? "fixed" : "absolute",
                    zIndex: YTPlayer.isBackground ? 1e4 : 1e3
                }).hide();
                var buttonBar = jQuery("<div/>").addClass("buttonBar"),
                    playpause = jQuery("<span>" + jQuery.mbYTPlayer.controls.play + "</span>").addClass("mb_YTPPlaypause ytpicon").click(function() {
                        1 == YTPlayer.player.getPlayerState() ? jQuery(YTPlayer).YTPPause() : jQuery(YTPlayer).YTPPlay()
                    }),
                    MuteUnmute = jQuery("<span>" + jQuery.mbYTPlayer.controls.mute + "</span>").addClass("mb_YTPMuteUnmute ytpicon").click(function() {
                        0 == YTPlayer.player.getVolume() ? jQuery(YTPlayer).YTPUnmute() : jQuery(YTPlayer).YTPMute()
                    }),
                    volumeBar = jQuery("<div/>").addClass("mb_YTPVolumeBar").css({
                        display: "inline-block"
                    });
                YTPlayer.volumeBar = volumeBar;
                var idx = jQuery("<span/>").addClass("mb_YTPTime"),
                    vURL = data.videoURL ? data.videoURL : "";
                vURL.indexOf("http") < 0 && (vURL = jQuery.mbYTPlayer.locationProtocol + "//www.youtube.com/watch?v=" + data.videoURL);
                var movieUrl = jQuery("<span/>").html(jQuery.mbYTPlayer.controls.ytLogo).addClass("mb_YTPUrl ytpicon").attr("title", "view on YouTube").on("click", function() {
                        window.open(vURL, "viewOnYT")
                    }),
                    onlyVideo = jQuery("<span/>").html(jQuery.mbYTPlayer.controls.onlyYT).addClass("mb_OnlyYT ytpicon").on("click", function() {
                        jQuery(YTPlayer).YTPFullscreen(data.realfullscreen)
                    }),
                    progressBar = jQuery("<div/>").addClass("mb_YTPProgress").css("position", "absolute").click(function(e) {
                        timeBar.css({
                            width: e.clientX - timeBar.offset().left
                        }), YTPlayer.timeW = e.clientX - timeBar.offset().left, YTPlayer.controlBar.find(".mb_YTPLoaded").css({
                            width: 0
                        });
                        var r = Math.floor(YTPlayer.player.getDuration());
                        YTPlayer.goto = timeBar.outerWidth() * r / progressBar.outerWidth(), YTPlayer.player.seekTo(parseFloat(YTPlayer.goto), !0), YTPlayer.controlBar.find(".mb_YTPLoaded").css({
                            width: 0
                        })
                    }),
                    loadedBar = jQuery("<div/>").addClass("mb_YTPLoaded").css("position", "absolute"),
                    timeBar = jQuery("<div/>").addClass("mb_YTPseekbar").css("position", "absolute");
                progressBar.append(loadedBar).append(timeBar), buttonBar.append(playpause).append(MuteUnmute).append(volumeBar).append(idx), data.showYTLogo && buttonBar.append(movieUrl), (YTPlayer.isBackground || eval(YTPlayer.opt.realfullscreen) && !YTPlayer.isBackground) && buttonBar.append(onlyVideo), YTPlayer.controlBar.append(buttonBar).append(progressBar), YTPlayer.isBackground ? jQuery("body").after(YTPlayer.controlBar) : (YTPlayer.controlBar.addClass("inlinePlayer"), YTPlayer.wrapper.before(YTPlayer.controlBar)), volumeBar.simpleSlider({
                    initialval: YTPlayer.opt.vol,
                    scale: 100,
                    orientation: "h",
                    callback: function(e) {
                        0 == e.value ? jQuery(YTPlayer).YTPMute() : jQuery(YTPlayer).YTPUnmute(), YTPlayer.player.setVolume(e.value), YTPlayer.isMute || (YTPlayer.opt.vol = e.value)
                    }
                })
            }
        },
        checkForState: function(YTPlayer) {
            var interval = YTPlayer.opt.showControls ? 100 : 400;
            if (clearInterval(YTPlayer.getState), !jQuery.contains(document, YTPlayer)) return jQuery(YTPlayer).YTPPlayerDestroy(), clearInterval(YTPlayer.getState), void clearInterval(YTPlayer.checkForStartAt);
            jQuery.mbYTPlayer.checkForStart(YTPlayer), YTPlayer.getState = setInterval(function() {
                var prog = jQuery(YTPlayer).YTPManageProgress(),
                    $YTPlayer = jQuery(YTPlayer),
                    data = YTPlayer.opt,
                    startAt = YTPlayer.opt.startAt ? YTPlayer.opt.startAt : 1,
                    stopAt = YTPlayer.opt.stopAt > YTPlayer.opt.startAt ? YTPlayer.opt.stopAt : 0;
                if (stopAt = stopAt < YTPlayer.player.getDuration() ? stopAt : 0, YTPlayer.currentTime != prog.currentTime) {
                    var YTPEvent = jQuery.Event("YTPTime");
                    YTPEvent.time = YTPlayer.currentTime, jQuery(YTPlayer).trigger(YTPEvent)
                }
                if (YTPlayer.currentTime = prog.currentTime, YTPlayer.totalTime = YTPlayer.player.getDuration(), 0 == YTPlayer.player.getVolume() ? $YTPlayer.addClass("isMuted") : $YTPlayer.removeClass("isMuted"), YTPlayer.opt.showControls && (prog.totalTime ? YTPlayer.controlBar.find(".mb_YTPTime").html(jQuery.mbYTPlayer.formatTime(prog.currentTime) + " / " + jQuery.mbYTPlayer.formatTime(prog.totalTime)) : YTPlayer.controlBar.find(".mb_YTPTime").html("-- : -- / -- : --")), eval(YTPlayer.opt.stopMovieOnBlur) && (document.hasFocus() ? document.hasFocus() && !YTPlayer.hasFocus && -1 != YTPlayer.state && 0 != YTPlayer.state && (YTPlayer.hasFocus = !0, $YTPlayer.YTPPlay()) : 1 == YTPlayer.state && (YTPlayer.hasFocus = !1, $YTPlayer.YTPPause())), YTPlayer.controlBar.length && YTPlayer.controlBar.outerWidth() <= 400 && !YTPlayer.isCompact ? (YTPlayer.controlBar.addClass("compact"), YTPlayer.isCompact = !0, !YTPlayer.isMute && YTPlayer.volumeBar && YTPlayer.volumeBar.updateSliderVal(YTPlayer.opt.vol)) : YTPlayer.controlBar.length && YTPlayer.controlBar.outerWidth() > 400 && YTPlayer.isCompact && (YTPlayer.controlBar.removeClass("compact"), YTPlayer.isCompact = !1, !YTPlayer.isMute && YTPlayer.volumeBar && YTPlayer.volumeBar.updateSliderVal(YTPlayer.opt.vol)), 1 == YTPlayer.player.getPlayerState() && (parseFloat(YTPlayer.player.getDuration() - 1.5) < YTPlayer.player.getCurrentTime() || stopAt > 0 && parseFloat(YTPlayer.player.getCurrentTime()) > stopAt)) {
                    if (YTPlayer.isEnded) return;
                    if (YTPlayer.isEnded = !0, setTimeout(function() {
                            YTPlayer.isEnded = !1
                        }, 1e3), YTPlayer.isPlayList) {
                        if (!data.loop || data.loop > 0 && YTPlayer.player.loopTime === data.loop - 1) {
                            YTPlayer.player.loopTime = void 0, clearInterval(YTPlayer.getState);
                            var YTPEnd = jQuery.Event("YTPEnd");
                            return YTPEnd.time = YTPlayer.currentTime, void jQuery(YTPlayer).trigger(YTPEnd)
                        }
                    } else if (!data.loop || data.loop > 0 && YTPlayer.player.loopTime === data.loop - 1) return YTPlayer.player.loopTime = void 0, YTPlayer.preventTrigger = !0, YTPlayer.state = 2, jQuery(YTPlayer).YTPPause(), void YTPlayer.wrapper.CSSAnimate({
                        opacity: 0
                    }, 500, function() {
                        YTPlayer.controlBar.length && YTPlayer.controlBar.find(".mb_YTPPlaypause").html(jQuery.mbYTPlayer.controls.play);
                        var e = jQuery.Event("YTPEnd");
                        e.time = YTPlayer.currentTime, jQuery(YTPlayer).trigger(e), YTPlayer.player.seekTo(startAt, !0), YTPlayer.isBackground || YTPlayer.opt.containment.css({
                            background: "rgba(0,0,0,0.5) url(" + YTPlayer.opt.backgroundUrl + ") center center",
                            backgroundSize: "cover"
                        })
                    });
                    YTPlayer.player.loopTime = YTPlayer.player.loopTime ? ++YTPlayer.player.loopTime : 1, startAt = startAt || 1, YTPlayer.preventTrigger = !0, YTPlayer.state = 2, jQuery(YTPlayer).YTPPause(), YTPlayer.player.seekTo(startAt, !0), $YTPlayer.YTPPlay()
                }
            }, interval)
        },
        getTime: function() {
            var e = this.get(0);
            return jQuery.mbYTPlayer.formatTime(e.currentTime)
        },
        getTotalTime: function() {
            var e = this.get(0);
            return jQuery.mbYTPlayer.formatTime(e.totalTime)
        },
        checkForStart: function(e) {
            var r = jQuery(e);
            if (jQuery.contains(document, e)) {
                if (e.preventTrigger = !0, e.state = 2, jQuery(e).YTPPause(), jQuery(e).muteYTPVolume(), jQuery("#controlBar_" + e.id).remove(), e.controlBar = !1, e.opt.showControls && jQuery.mbYTPlayer.buildControls(e), e.opt.addRaster) {
                    var t = "dot" == e.opt.addRaster ? "raster-dot" : "raster";
                    e.overlay.addClass(e.isRetina ? t + " retina" : t)
                } else e.overlay.removeClass(function(e, r) {
                    var t = r.split(" "),
                        a = [];
                    return jQuery.each(t, function(e, r) {
                        /raster.*/.test(r) && a.push(r)
                    }), a.push("retina"), a.join(" ")
                });
                var a = e.opt.startAt ? e.opt.startAt : 1;
                e.player.playVideo(), e.player.seekTo(a, !0), e.checkForStartAt = setInterval(function() {
                    jQuery(e).YTPMute();
                    var t = e.player.getVideoLoadedFraction() >= a / e.player.getDuration();
                    if (e.player.getDuration() > 0 && e.player.getCurrentTime() >= a && t) {
                        clearInterval(e.checkForStartAt), "function" == typeof e.opt.onReady && e.opt.onReady(e), e.isReady = !0;
                        var l = jQuery.Event("YTPReady");
                        if (l.time = e.currentTime, jQuery(e).trigger(l), e.preventTrigger = !0, e.state = 2, jQuery(e).YTPPause(), e.opt.mute || jQuery(e).YTPUnmute(), e.canTrigger = !0, e.opt.autoPlay) {
                            var o = jQuery.Event("YTPStart");
                            o.time = e.currentTime, jQuery(e).trigger(o), r.css("background-image", "none"), jQuery(e.playerEl).CSSAnimate({
                                opacity: 1
                            }, 1e3), r.YTPPlay(), e.wrapper.CSSAnimate({
                                opacity: e.isAlone ? 1 : e.opt.opacity
                            }, 1e3), jQuery.browser.safari && (e.safariPlay = setInterval(function() {
                                1 != e.state ? r.YTPPlay() : clearInterval(e.safariPlay)
                            }, 10)), r.on("YTPReady", function() {
                                r.YTPPlay()
                            })
                        } else e.player.pauseVideo(), e.isPlayer || (jQuery(e.playerEl).CSSAnimate({
                            opacity: 1
                        }, 500), e.wrapper.CSSAnimate({
                            opacity: e.isAlone ? 1 : e.opt.opacity
                        }, 500)), e.controlBar.length && e.controlBar.find(".mb_YTPPlaypause").html(jQuery.mbYTPlayer.controls.play);
                        e.isPlayer && !e.opt.autoPlay && e.loading && e.loading.length && (e.loading.html("Ready"), setTimeout(function() {
                            e.loading.fadeOut()
                        }, 100)), e.controlBar && e.controlBar.length && e.controlBar.slideDown(1e3)
                    } else jQuery.browser.safari && (e.player.playVideo(), a >= 0 && e.player.seekTo(a, !0))
                }, 1)
            } else jQuery(e).YTPPlayerDestroy()
        },
        setAlign: function(e) {
            this.optimizeDisplay(e)
        },
        getAlign: function() {
            return this.get(0).opt.align
        },
        formatTime: function(e) {
            var r = Math.floor(e / 60),
                t = Math.floor(e - 60 * r);
            return (r <= 9 ? "0" + r : r) + " : " + (t <= 9 ? "0" + t : t)
        }
    }, jQuery.fn.optimizeDisplay = function(e) {
        var r = this.get(0),
            t = jQuery(r.playerEl),
            a = {};
        r.opt.align = e || r.opt.align, r.opt.align = "undefined " != typeof r.opt.align ? r.opt.align : "center,center";
        var l = r.opt.align.split(",");
        if (r.opt.optimizeDisplay) {
            var o = {},
                i = r.wrapper;
            o.width = i.outerWidth(), o.height = i.outerHeight(), a.width = o.width, a.height = "16/9" == r.opt.ratio ? Math.ceil(o.width * (9 / 16)) : Math.ceil(.75 * o.width), a.width = o.width, a.height = "16/9" == r.opt.ratio ? Math.ceil(o.width * (9 / 16)) : Math.ceil(.75 * o.width), a.marginTop = -(a.height - o.height) / 2, a.marginLeft = 0;
            var n = a.height < o.height;
            n && (a.height = o.height, a.width = "16/9" == r.opt.ratio ? Math.floor(o.height * (16 / 9)) : Math.floor(o.height * (4 / 3)), a.marginTop = 0, a.marginLeft = -(a.width - o.width) / 2);
            for (var y in l) {
                switch (l[y].trim()) {
                    case "top":
                        a.marginTop = n ? -(a.height - o.height) / 2 : 0;
                        break;
                    case "bottom":
                        a.marginTop = n ? 0 : -(a.height - o.height);
                        break;
                    case "left":
                        a.marginLeft = 0;
                        break;
                    case "right":
                        a.marginLeft = n ? -(a.width - o.width) : 0
                }
            }
        } else a.width = "100%", a.height = "100%", a.marginTop = 0, a.marginLeft = 0;
        t.css({
            width: a.width,
            height: a.height,
            marginTop: a.marginTop,
            marginLeft: a.marginLeft
        })
    }, jQuery.shuffle = function(e) {
        for (var r = e.slice(), t = r.length, a = t; a--;) {
            var l = parseInt(Math.random() * t),
                o = r[a];
            r[a] = r[l], r[l] = o
        }
        return r
    }, jQuery.fn.unselectable = function() {
        return this.each(function() {
            jQuery(this).css({
                "-moz-user-select": "none",
                "-webkit-user-select": "none",
                "user-select": "none"
            }).attr("unselectable", "on")
        })
    }, jQuery.fn.YTPlayer = jQuery.mbYTPlayer.buildPlayer, jQuery.fn.YTPGetPlayer = jQuery.mbYTPlayer.getPlayer, jQuery.fn.YTPGetVideoID = jQuery.mbYTPlayer.getVideoID, jQuery.fn.YTPChangeMovie = jQuery.mbYTPlayer.changeMovie, jQuery.fn.YTPPlayerDestroy = jQuery.mbYTPlayer.playerDestroy, jQuery.fn.YTPPlay = jQuery.mbYTPlayer.play, jQuery.fn.YTPTogglePlay = jQuery.mbYTPlayer.togglePlay, jQuery.fn.YTPStop = jQuery.mbYTPlayer.stop, jQuery.fn.YTPPause = jQuery.mbYTPlayer.pause, jQuery.fn.YTPSeekTo = jQuery.mbYTPlayer.seekTo, jQuery.fn.YTPlaylist = jQuery.mbYTPlayer.playlist, jQuery.fn.YTPPlayNext = jQuery.mbYTPlayer.playNext, jQuery.fn.YTPPlayPrev = jQuery.mbYTPlayer.playPrev, jQuery.fn.YTPPlayIndex = jQuery.mbYTPlayer.playIndex, jQuery.fn.YTPMute = jQuery.mbYTPlayer.mute, jQuery.fn.YTPUnmute = jQuery.mbYTPlayer.unmute, jQuery.fn.YTPToggleVolume = jQuery.mbYTPlayer.toggleVolume, jQuery.fn.YTPSetVolume = jQuery.mbYTPlayer.setVolume, jQuery.fn.YTPGetVideoData = jQuery.mbYTPlayer.getVideoData, jQuery.fn.YTPFullscreen = jQuery.mbYTPlayer.fullscreen, jQuery.fn.YTPToggleLoops = jQuery.mbYTPlayer.toggleLoops, jQuery.fn.YTPSetVideoQuality = jQuery.mbYTPlayer.setVideoQuality, jQuery.fn.YTPManageProgress = jQuery.mbYTPlayer.manageProgress, jQuery.fn.YTPApplyFilter = jQuery.mbYTPlayer.applyFilter, jQuery.fn.YTPApplyFilters = jQuery.mbYTPlayer.applyFilters, jQuery.fn.YTPToggleFilter = jQuery.mbYTPlayer.toggleFilter, jQuery.fn.YTPToggleFilters = jQuery.mbYTPlayer.toggleFilters, jQuery.fn.YTPRemoveFilter = jQuery.mbYTPlayer.removeFilter, jQuery.fn.YTPDisableFilters = jQuery.mbYTPlayer.disableFilters, jQuery.fn.YTPEnableFilters = jQuery.mbYTPlayer.enableFilters, jQuery.fn.YTPGetFilters = jQuery.mbYTPlayer.getFilters, jQuery.fn.YTPGetTime = jQuery.mbYTPlayer.getTime, jQuery.fn.YTPGetTotalTime = jQuery.mbYTPlayer.getTotalTime, jQuery.fn.YTPAddMask = jQuery.mbYTPlayer.addMask, jQuery.fn.YTPRemoveMask = jQuery.mbYTPlayer.removeMask, jQuery.fn.YTPToggleMask = jQuery.mbYTPlayer.toggleMask, jQuery.fn.YTPSetAlign = jQuery.mbYTPlayer.setAlign, jQuery.fn.YTPGetAlign = jQuery.mbYTPlayer.getAlign, jQuery.fn.mb_YTPlayer = jQuery.mbYTPlayer.buildPlayer, jQuery.fn.playNext = jQuery.mbYTPlayer.playNext, jQuery.fn.playPrev = jQuery.mbYTPlayer.playPrev, jQuery.fn.changeMovie = jQuery.mbYTPlayer.changeMovie, jQuery.fn.getVideoID = jQuery.mbYTPlayer.getVideoID, jQuery.fn.getPlayer = jQuery.mbYTPlayer.getPlayer, jQuery.fn.playerDestroy = jQuery.mbYTPlayer.playerDestroy, jQuery.fn.fullscreen = jQuery.mbYTPlayer.fullscreen, jQuery.fn.buildYTPControls = jQuery.mbYTPlayer.buildControls, jQuery.fn.playYTP = jQuery.mbYTPlayer.play, jQuery.fn.toggleLoops = jQuery.mbYTPlayer.toggleLoops, jQuery.fn.stopYTP = jQuery.mbYTPlayer.stop, jQuery.fn.pauseYTP = jQuery.mbYTPlayer.pause, jQuery.fn.seekToYTP = jQuery.mbYTPlayer.seekTo, jQuery.fn.muteYTPVolume = jQuery.mbYTPlayer.mute, jQuery.fn.unmuteYTPVolume = jQuery.mbYTPlayer.unmute, jQuery.fn.setYTPVolume = jQuery.mbYTPlayer.setVolume, jQuery.fn.setVideoQuality = jQuery.mbYTPlayer.setVideoQuality, jQuery.fn.manageYTPProgress = jQuery.mbYTPlayer.manageProgress, jQuery.fn.YTPGetDataFromFeed = jQuery.mbYTPlayer.getVideoData
}(jQuery, ytp);



/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.CSSAnimate.min.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 26/03/14 21.40
 *  *****************************************************************************
 */

function uncamel(e) {
    return e.replace(/([A-Z])/g, function(e) {
        return "-" + e.toLowerCase()
    })
}

function setUnit(e, t) {
    return "string" != typeof e || e.match(/^[\-0-9\.]+jQuery/) ? "" + e + t : e
}

function setFilter(e, t, r) {
    var i = uncamel(t),
        n = jQuery.browser.mozilla ? "" : jQuery.CSS.sfx;
    e[n + "filter"] = e[n + "filter"] || "", r = setUnit(r > jQuery.CSS.filters[t].max ? jQuery.CSS.filters[t].max : r, jQuery.CSS.filters[t].unit), e[n + "filter"] += i + "(" + r + ") ", delete e[t]
}
jQuery.support.CSStransition = function() {
    var e = document.body || document.documentElement,
        t = e.style;
    return void 0 !== t.transition || void 0 !== t.WebkitTransition || void 0 !== t.MozTransition || void 0 !== t.MsTransition || void 0 !== t.OTransition
}(), jQuery.CSS = {
    name: "mb.CSSAnimate",
    author: "Matteo Bicocchi",
    version: "2.0.0",
    transitionEnd: "transitionEnd",
    sfx: "",
    filters: {
        blur: {
            min: 0,
            max: 100,
            unit: "px"
        },
        brightness: {
            min: 0,
            max: 400,
            unit: "%"
        },
        contrast: {
            min: 0,
            max: 400,
            unit: "%"
        },
        grayscale: {
            min: 0,
            max: 100,
            unit: "%"
        },
        hueRotate: {
            min: 0,
            max: 360,
            unit: "deg"
        },
        invert: {
            min: 0,
            max: 100,
            unit: "%"
        },
        saturate: {
            min: 0,
            max: 400,
            unit: "%"
        },
        sepia: {
            min: 0,
            max: 100,
            unit: "%"
        }
    },
    normalizeCss: function(e) {
        var t = jQuery.extend(!0, {}, e);
        jQuery.browser.webkit || jQuery.browser.opera ? jQuery.CSS.sfx = "-webkit-" : jQuery.browser.mozilla ? jQuery.CSS.sfx = "-moz-" : jQuery.browser.msie && (jQuery.CSS.sfx = "-ms-");
        for (var r in t) {
            "transform" === r && (t[jQuery.CSS.sfx + "transform"] = t[r], delete t[r]), "transform-origin" === r && (t[jQuery.CSS.sfx + "transform-origin"] = e[r], delete t[r]), "filter" !== r || jQuery.browser.mozilla || (t[jQuery.CSS.sfx + "filter"] = e[r], delete t[r]), "blur" === r && setFilter(t, "blur", e[r]), "brightness" === r && setFilter(t, "brightness", e[r]), "contrast" === r && setFilter(t, "contrast", e[r]), "grayscale" === r && setFilter(t, "grayscale", e[r]), "hueRotate" === r && setFilter(t, "hueRotate", e[r]), "invert" === r && setFilter(t, "invert", e[r]), "saturate" === r && setFilter(t, "saturate", e[r]), "sepia" === r && setFilter(t, "sepia", e[r]);
            var i = "";
            "x" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " translateX(" + setUnit(e[r], "px") + ")", delete t[r]), "y" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " translateY(" + setUnit(e[r], "px") + ")", delete t[r]), "z" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " translateZ(" + setUnit(e[r], "px") + ")", delete t[r]), "rotate" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " rotate(" + setUnit(e[r], "deg") + ")", delete t[r]), "rotateX" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " rotateX(" + setUnit(e[r], "deg") + ")", delete t[r]), "rotateY" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " rotateY(" + setUnit(e[r], "deg") + ")", delete t[r]), "rotateZ" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " rotateZ(" + setUnit(e[r], "deg") + ")", delete t[r]), "scale" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " scale(" + setUnit(e[r], "") + ")", delete t[r]), "scaleX" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " scaleX(" + setUnit(e[r], "") + ")", delete t[r]), "scaleY" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " scaleY(" + setUnit(e[r], "") + ")", delete t[r]), "scaleZ" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " scaleZ(" + setUnit(e[r], "") + ")", delete t[r]), "skew" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " skew(" + setUnit(e[r], "deg") + ")", delete t[r]), "skewX" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " skewX(" + setUnit(e[r], "deg") + ")", delete t[r]), "skewY" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " skewY(" + setUnit(e[r], "deg") + ")", delete t[r]), "perspective" === r && (i = jQuery.CSS.sfx + "transform", t[i] = t[i] || "", t[i] += " perspective(" + setUnit(e[r], "px") + ")", delete t[r])
        }
        return t
    },
    getProp: function(e) {
        var t = [];
        for (var r in e) t.indexOf(r) < 0 && t.push(uncamel(r));
        return t.join(",")
    },
    animate: function(e, t, r, i, n) {
        return this.each(function() {
            function s() {
                u.called = !0, u.CSSAIsRunning = !1, a.off(jQuery.CSS.transitionEnd + "." + u.id), clearTimeout(u.timeout), a.css(jQuery.CSS.sfx + "transition", ""), "function" == typeof n && n.apply(u), "function" == typeof u.CSSqueue && (u.CSSqueue(), u.CSSqueue = null)
            }
            var u = this,
                a = jQuery(this);
            u.id = u.id || "CSSA_" + (new Date).getTime();
            var o = o || {
                type: "noEvent"
            };
            if (u.CSSAIsRunning && u.eventType == o.type && !jQuery.browser.msie && jQuery.browser.version <= 9) return void(u.CSSqueue = function() {
                a.CSSAnimate(e, t, r, i, n)
            });
            if (u.CSSqueue = null, u.eventType = o.type, 0 !== a.length && e) {
                if (e = jQuery.normalizeCss(e), u.CSSAIsRunning = !0, "function" == typeof t && (n = t, t = jQuery.fx.speeds._default), "function" == typeof r && (i = r, r = 0), "string" == typeof r && (n = r, r = 0), "function" == typeof i && (n = i, i = "cubic-bezier(0.65,0.03,0.36,0.72)"), "string" == typeof t)
                    for (var f in jQuery.fx.speeds) {
                        if (t == f) {
                            t = jQuery.fx.speeds[f];
                            break
                        }
                        t = jQuery.fx.speeds._default
                    }
                if (t || (t = jQuery.fx.speeds._default), "string" == typeof n && (i = n, n = null), !jQuery.support.CSStransition) {
                    for (var c in e) {
                        if ("transform" === c && delete e[c], "filter" === c && delete e[c], "transform-origin" === c && delete e[c], "auto" === e[c] && delete e[c], "x" === c) {
                            var S = e[c],
                                l = "left";
                            e[l] = S, delete e[c]
                        }
                        if ("y" === c) {
                            var S = e[c],
                                l = "top";
                            e[l] = S, delete e[c]
                        }("-ms-transform" === c || "-ms-filter" === c) && delete e[c]
                    }
                    return void a.delay(r).animate(e, t, n)
                }
                var y = {
                    "default": "ease",
                    "in": "ease-in",
                    out: "ease-out",
                    "in-out": "ease-in-out",
                    snap: "cubic-bezier(0,1,.5,1)",
                    easeOutCubic: "cubic-bezier(.215,.61,.355,1)",
                    easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",
                    easeInCirc: "cubic-bezier(.6,.04,.98,.335)",
                    easeOutCirc: "cubic-bezier(.075,.82,.165,1)",
                    easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",
                    easeInExpo: "cubic-bezier(.95,.05,.795,.035)",
                    easeOutExpo: "cubic-bezier(.19,1,.22,1)",
                    easeInOutExpo: "cubic-bezier(1,0,0,1)",
                    easeInQuad: "cubic-bezier(.55,.085,.68,.53)",
                    easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",
                    easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",
                    easeInQuart: "cubic-bezier(.895,.03,.685,.22)",
                    easeOutQuart: "cubic-bezier(.165,.84,.44,1)",
                    easeInOutQuart: "cubic-bezier(.77,0,.175,1)",
                    easeInQuint: "cubic-bezier(.755,.05,.855,.06)",
                    easeOutQuint: "cubic-bezier(.23,1,.32,1)",
                    easeInOutQuint: "cubic-bezier(.86,0,.07,1)",
                    easeInSine: "cubic-bezier(.47,0,.745,.715)",
                    easeOutSine: "cubic-bezier(.39,.575,.565,1)",
                    easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",
                    easeInBack: "cubic-bezier(.6,-.28,.735,.045)",
                    easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",
                    easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"
                };
                y[i] && (i = y[i]), a.off(jQuery.CSS.transitionEnd + "." + u.id);
                var m = jQuery.CSS.getProp(e),
                    d = {};
                jQuery.extend(d, e), d[jQuery.CSS.sfx + "transition-property"] = m, d[jQuery.CSS.sfx + "transition-duration"] = t + "ms", d[jQuery.CSS.sfx + "transition-delay"] = r + "ms", d[jQuery.CSS.sfx + "transition-timing-function"] = i, setTimeout(function() {
                    a.one(jQuery.CSS.transitionEnd + "." + u.id, s), a.css(d)
                }, 1), u.timeout = setTimeout(function() {
                    return u.called || !n ? (u.called = !1, void(u.CSSAIsRunning = !1)) : (a.css(jQuery.CSS.sfx + "transition", ""), n.apply(u), u.CSSAIsRunning = !1, void("function" == typeof u.CSSqueue && (u.CSSqueue(), u.CSSqueue = null)))
                }, t + r + 10)
            }
        })
    }
}, jQuery.fn.CSSAnimate = jQuery.CSS.animate, jQuery.normalizeCss = jQuery.CSS.normalizeCss, jQuery.fn.css3 = function(e) {
    return this.each(function() {
        var t = jQuery(this),
            r = jQuery.normalizeCss(e);
        t.css(r)
    })
};;
/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.browser.min.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 26/03/14 21.43
 *  *****************************************************************************
 */

var nAgt = navigator.userAgent;
if (!jQuery.browser) {
    jQuery.browser = {}, jQuery.browser.mozilla = !1, jQuery.browser.webkit = !1, jQuery.browser.opera = !1, jQuery.browser.safari = !1, jQuery.browser.chrome = !1, jQuery.browser.androidStock = !1, jQuery.browser.msie = !1, jQuery.browser.ua = nAgt, jQuery.browser.name = navigator.appName, jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;
    if (-1 != (verOffset = nAgt.indexOf("Opera"))) jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 6), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8));
    else if (-1 != (verOffset = nAgt.indexOf("OPR"))) jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 4);
    else if (-1 != (verOffset = nAgt.indexOf("MSIE"))) jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer", jQuery.browser.fullVersion = nAgt.substring(verOffset + 5);
    else if (-1 != nAgt.indexOf("Trident") || -1 != nAgt.indexOf("Edge")) {
        jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer";
        var start = nAgt.indexOf("rv:") + 3,
            end = start + 4;
        jQuery.browser.fullVersion = nAgt.substring(start, end)
    } else -1 != (verOffset = nAgt.indexOf("Chrome")) ? (jQuery.browser.webkit = !0, jQuery.browser.chrome = !0, jQuery.browser.name = "Chrome", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : nAgt.indexOf("mozilla/5.0") > -1 && nAgt.indexOf("android ") > -1 && nAgt.indexOf("applewebkit") > -1 && !(nAgt.indexOf("chrome") > -1) ? (verOffset = nAgt.indexOf("Chrome"), jQuery.browser.webkit = !0, jQuery.browser.androidStock = !0, jQuery.browser.name = "androidStock", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 != (verOffset = nAgt.indexOf("Safari")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("AppleWebkit")) ? (jQuery.browser.webkit = !0, jQuery.browser.safari = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("Firefox")) ? (jQuery.browser.mozilla = !0, jQuery.browser.name = "Firefox", jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)) : (nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")) && (jQuery.browser.name = nAgt.substring(nameOffset, verOffset), jQuery.browser.fullVersion = nAgt.substring(verOffset + 1), jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase() && (jQuery.browser.name = navigator.appName)); - 1 != (ix = jQuery.browser.fullVersion.indexOf(";")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)), -1 != (ix = jQuery.browser.fullVersion.indexOf(" ")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix)), jQuery.browser.majorVersion = parseInt("" + jQuery.browser.fullVersion, 10), isNaN(jQuery.browser.majorVersion) && (jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10)), jQuery.browser.version = jQuery.browser.majorVersion
}
jQuery.browser.android = /Android/i.test(nAgt), jQuery.browser.blackberry = /BlackBerry|BB|PlayBook/i.test(nAgt), jQuery.browser.ios = /iPhone|iPad|iPod|webOS/i.test(nAgt), jQuery.browser.operaMobile = /Opera Mini/i.test(nAgt), jQuery.browser.windowsMobile = /IEMobile|Windows Phone/i.test(nAgt), jQuery.browser.kindle = /Kindle|Silk/i.test(nAgt), jQuery.browser.mobile = jQuery.browser.android || jQuery.browser.blackberry || jQuery.browser.ios || jQuery.browser.windowsMobile || jQuery.browser.operaMobile || jQuery.browser.kindle, jQuery.isMobile = jQuery.browser.mobile, jQuery.isTablet = jQuery.browser.mobile && jQuery(window).width() > 765, jQuery.isAndroidDefault = jQuery.browser.android && !/chrome/i.test(nAgt);;
/*___________________________________________________________________________________________________________________________________________________
  _ jquery.mb.components                                                                                                                             _
  _                                                                                                                                                  _
  _ file: jquery.mb.simpleSlider.min.js                                                                                                              _
  _ last modified: 16/05/15 23.45                                                                                                                    _
  _                                                                                                                                                  _
  _ Open Lab s.r.l., Florence - Italy                                                                                                                _
  _                                                                                                                                                  _
  _ email: matteo@open-lab.com                                                                                                                       _
  _ site: http://pupunzi.com                                                                                                                         _
  _       http://open-lab.com                                                                                                                        _
  _ blog: http://pupunzi.open-lab.com                                                                                                                _
  _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
  _                                                                                                                                                  _
  _ Licences: MIT, GPL                                                                                                                               _
  _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
  _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
  _                                                                                                                                                  _
  _ Copyright (c) 2001-2015. Matteo Bicocchi (Pupunzi);                                                                                              _
  ___________________________________________________________________________________________________________________________________________________*/

! function(e) {
    var t = (/iphone|ipod|ipad|android|ie|blackberry|fennec/.test(navigator.userAgent.toLowerCase()), "ontouchstart" in window || window.navigator && window.navigator.msPointerEnabled && window.MSGesture || window.DocumentTouch && document instanceof DocumentTouch || !1);
    e.simpleSlider = {
        defaults: {
            initialval: 0,
            scale: 100,
            orientation: "h",
            readonly: !1,
            callback: !1
        },
        events: {
            start: t ? "touchstart" : "mousedown",
            end: t ? "touchend" : "mouseup",
            move: t ? "touchmove" : "mousemove"
        },
        init: function(o) {
            return this.each(function() {
                var a = this,
                    l = e(a);
                l.addClass("simpleSlider"), a.opt = {}, e.extend(a.opt, e.simpleSlider.defaults, o), e.extend(a.opt, l.data());
                var i = "h" == a.opt.orientation ? "horizontal" : "vertical",
                    n = e("<div/>").addClass("level").addClass(i);
                l.prepend(n), a.level = n, l.css({
                    cursor: "default"
                }), "auto" == a.opt.scale && (a.opt.scale = e(a).outerWidth()), l.updateSliderVal(), a.opt.readonly || (l.on(e.simpleSlider.events.start, function(e) {
                    t && (e = e.changedTouches[0]), a.canSlide = !0, l.updateSliderVal(e), l.css({
                        cursor: "col-resize"
                    }), e.preventDefault(), e.stopPropagation()
                }), e(document).on(e.simpleSlider.events.move, function(o) {
                    t && (o = o.changedTouches[0]), a.canSlide && (e(document).css({
                        cursor: "default"
                    }), l.updateSliderVal(o), o.preventDefault(), o.stopPropagation())
                }).on(e.simpleSlider.events.end, function() {
                    e(document).css({
                        cursor: "auto"
                    }), a.canSlide = !1, l.css({
                        cursor: "auto"
                    })
                }))
            })
        },
        updateSliderVal: function(t) {
            function o(e, t) {
                return Math.floor(100 * e / t)
            }
            var a = this,
                l = a.get(0);
            if (l.opt) {
                l.opt.initialval = "number" == typeof l.opt.initialval ? l.opt.initialval : l.opt.initialval(l);
                var i = e(l).outerWidth(),
                    n = e(l).outerHeight();
                l.x = "object" == typeof t ? t.clientX + document.body.scrollLeft - a.offset().left : "number" == typeof t ? t * i / l.opt.scale : l.opt.initialval * i / l.opt.scale, l.y = "object" == typeof t ? t.clientY + document.body.scrollTop - a.offset().top : "number" == typeof t ? (l.opt.scale - l.opt.initialval - t) * n / l.opt.scale : l.opt.initialval * n / l.opt.scale, l.y = a.outerHeight() - l.y, l.scaleX = l.x * l.opt.scale / i, l.scaleY = l.y * l.opt.scale / n, l.outOfRangeX = l.scaleX > l.opt.scale ? l.scaleX - l.opt.scale : l.scaleX < 0 ? l.scaleX : 0, l.outOfRangeY = l.scaleY > l.opt.scale ? l.scaleY - l.opt.scale : l.scaleY < 0 ? l.scaleY : 0, l.outOfRange = "h" == l.opt.orientation ? l.outOfRangeX : l.outOfRangeY, "undefined" != typeof t ? l.value = "h" == l.opt.orientation ? l.x >= a.outerWidth() ? l.opt.scale : l.x <= 0 ? 0 : l.scaleX : l.y >= a.outerHeight() ? l.opt.scale : l.y <= 0 ? 0 : l.scaleY : l.value = "h" == l.opt.orientation ? l.scaleX : l.scaleY, "h" == l.opt.orientation ? l.level.width(o(l.x, i) + "%") : l.level.height(o(l.y, n)), "function" == typeof l.opt.callback && l.opt.callback(l)
            }
        }
    }, e.fn.simpleSlider = e.simpleSlider.init, e.fn.updateSliderVal = e.simpleSlider.updateSliderVal
}(jQuery);;
/*___________________________________________________________________________________________________________________________________________________
  _ jquery.mb.components                                                                                                                             _
  _                                                                                                                                                  _
  _ file: jquery.mb.storage.min.js                                                                                                                   _
  _ last modified: 24/05/15 16.08                                                                                                                    _
  _                                                                                                                                                  _
  _ Open Lab s.r.l., Florence - Italy                                                                                                                _
  _                                                                                                                                                  _
  _ email: matteo@open-lab.com                                                                                                                       _
  _ site: http://pupunzi.com                                                                                                                         _
  _       http://open-lab.com                                                                                                                        _
  _ blog: http://pupunzi.open-lab.com                                                                                                                _
  _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
  _                                                                                                                                                  _
  _ Licences: MIT, GPL                                                                                                                               _
  _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
  _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
  _                                                                                                                                                  _
  _ Copyright (c) 2001-2015. Matteo Bicocchi (Pupunzi);                                                                                              _
  ___________________________________________________________________________________________________________________________________________________*/

! function(a) {
    a.mbCookie = {
        set: function(a, b, c, d) {
            b = JSON.stringify(b), c || (c = 7), d = d ? "; domain=" + d : "";
            var f, e = new Date;
            e.setTime(e.getTime() + 1e3 * 60 * 60 * 24 * c), f = "; expires=" + e.toGMTString(), document.cookie = a + "=" + b + f + "; path=/" + d
        },
        get: function(a) {
            for (var b = a + "=", c = document.cookie.split(";"), d = 0; d < c.length; d++) {
                for (var e = c[d];
                    " " == e.charAt(0);) e = e.substring(1, e.length);
                if (0 == e.indexOf(b)) return JSON.parse(e.substring(b.length, e.length))
            }
            return null
        },
        remove: function(b) {
            a.mbCookie.set(b, "", -1)
        }
    }, a.mbStorage = {
        set: function(a, b) {
            b = JSON.stringify(b), localStorage.setItem(a, b)
        },
        get: function(a) {
            return localStorage[a] ? JSON.parse(localStorage[a]) : null
        },
        remove: function(a) {
            a ? localStorage.removeItem(a) : localStorage.clear()
        }
    }
}(jQuery);