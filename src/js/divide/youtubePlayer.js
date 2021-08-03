const youtubePlayer = () => {
    let player;
            
    function youtubeVideo() {
        var youtube = [];
        if ((typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') && !$("script[src='https://www.youtube.com/player_api']").length) {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/player_api";
            
            var firstScriptTag = document.getElementsByTagName('script')[0];
            //firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            $("body").prepend(tag)

            window.onYouTubePlayerAPIReady = function() {
                onLoadYouTubePlayer();
            };

            onYouTubePlayerAPIReady();
        } else {
            window.onYouTubePlayerAPIReady = function() {
                onLoadYouTubePlayer();
            };
        }

        function onLoadYouTubePlayer(){
            console.log("onLoadYouTubePlayer")
           
            var $frame = $(".player");
            
            $frame.each(function (idx, obj) {
                var videoId = $(obj).data("video-id");
                if (videoId == null) return;
                
                $(obj).html('<iframe src="https://www.youtube.com/embed/' + videoId + '?enablejsapi=1&showinfo=0&rel=0&autoplay=1&mute=1" id="video' + idx + '" allowfullscreen></iframe>')
                
                try { 
                    player = new YT.Player("video" + idx, {
                        videoId: videoId,
                        events: {
                            'onReady': onPlayerReady,
                        }
                    });

                    youtube.push(player);

                    function onPlayerReady() {
                        player.seekTo(0, true) 
                        player.playVideo();
                        youtubeSlider();
                    }
                    
                } catch (err) {
                    console.error(err);
                }
            })

        }
    }

    function youtubeSlider () {
        new Swiper(".youtubeSlider", {
            loop: false,
            navigation: {
                prevEl: '.youtubeSlider__nav--prev',
                nextEl: '.youtubeSlider__nav--next',
            },
            on: {
                slideChangeTransitionEnd() {
                    if ($(".swiper-slide-active").data("video") == "yes") {
                        player.playVideo();
                    }
                    else {
                        player.pauseVideo();
                    }

                },
            }
        })
    }

    function init() {
        console.log("player", player);
        youtubeVideo();
    }

    init();

    // 1. 자동재생되지만 음소거상태로!!
    // // 2. This code loads the IFrame Player API code asynchronously.
    // var tag = document.createElement('script');

    // tag.src = "https://www.youtube.com/iframe_api";
    // var firstScriptTag = document.getElementsByTagName('script')[0];
    // firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // // 3. This function creates an <iframe> (and YouTube player)
    // //    after the API code downloads.
    // var player;

    // function onYouTubeIframeAPIReady() {
    //     player = new YT.Player('player', {
    //         videoId: 'M7lc1UVf-VE',
    //         playerVars: { 'autoplay': 1, 'controls': 0 },
    //         events: {
    //             'onReady': onPlayerReady,
    //             'onStateChange': onPlayerStateChange,
    //         }
    //     });
    // }

    // // 4. The API will call this function when the video player is ready.
    // function onPlayerReady(event) {
    //     setTimeout(function () {
    //         player.playVideo();
    //         console.log("ㅋㅋㅋ");
    //     },1000)
    // }

    // // 5. The API calls this function when the player's state changes.
    // //    The function indicates that when playing a video (state=1),
    // //    the player should play for six seconds and then stop.
    // var done = false;
    // function onPlayerStateChange(event) {
    //     if (event.data == YT.PlayerState.PLAYING && !done) {
    //         setTimeout(stopVideo, 6000);
    //         done = true;
    //     }
    // }
    // function stopVideo() {
    //     player.stopVideo();
    // }

    // $(".start").on("click", function () {
    //     player.playVideo();
    // })

    // $(".stop").on("click", function () {
    // player.stopVideo();
    // })

    // // function test () {

    // //     setTimeout(function () {
    // //         // $(document).ready(function () {
    // //             player.playVideo();
    // //         // })
    // //         console.log("tt", player)

    // //     }, 1000)
    // // }
}

export default youtubePlayer;