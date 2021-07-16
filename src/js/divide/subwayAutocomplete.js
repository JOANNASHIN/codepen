function fnSelectStore (param, shopName) {
    $('#selectShopName').addClass('point').html(shopName);
    $('#PICKUP_COMPANY_ID').val(param);
    $(document).trigger('close.facebox');
    $('.select-shop-name').find('.btn-del').show();
    $(".selectDate").show();
}
function minicartPopupMap () {
    var $document = $(document);
    var listO2OShop = null;
    var listStationOfSeoul = [];
    var listStationOfBusan = [];
    var listStationOfDaegu = [];
    var listStationOfGwangju = [];
    var listStationOfDaejeon = [];
    var stationList = listStationOfSeoul; //기본값 수도권 설정

    //팝업 첫 로드시 지도 보이기
    function initShowMap () {
        var mapContainer = document.getElementById('mapPopup'), // 지도를 표시할 div
            mapOption = {
                center: new daum.maps.LatLng(37.506829, 127.065187),
                level: 6 // 지도의 확대 레벨
            };
        var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
        // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
        var zoomControl = new daum.maps.ZoomControl();
        map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
        //지도 확대축소
        map.setZoomable(true);
        //마우스 드래그
        map.setDraggable(false);
    }

    // 초기에 모든 매장픽업 가능 매장 정보를 가져온다.
    function initO2OShopList () {
        var params = {O2O_YN : 'Y'};
        fnAjax({
            url: "/biz/event/getO2OShopList",
            params: params,
            success: function(data){
                for ( var i in data.rows) {
                    if(data.rows[i].OPEN_TIME == '' ){
                        data.rows[i].OPEN_TIME = '10시 ~ 20시';
                    }
                }
                listO2OShop = data.rows;
            }
        });
    }

    //초기에 모든 지하철역 정보를 가져온다.
    function initSubwayStationList () {
        var params = {area: ''};
        fnAjax({
            url: "/biz/event/getListOfStation",
            params: params,
            success: function(data){

                $.each(data.stations, function() {
                    if (this.area == "수도권") {
                        listStationOfSeoul.push(this);
                    }
                    else if (this.area == "부산") {
                        listStationOfBusan.push(this);
                    }
                    else if (this.area == "대구") {
                        listStationOfDaegu.push(this);
                    }
                    else if (this.area == "광주") {
                        listStationOfGwangju.push(this);
                    }
                    else if (this.area == "대전") {
                        listStationOfDaejeon.push(this);
                    }
                });
            }
        });
    }

    //라디오 탭
    function radioSelect () {
        $document.on("change", ".jung__map input:checked", function () {
            var clicked = $(this).val();
            $(".radio__cont").removeClass("js--show");
            $("#"+clicked).addClass("js--show");
        })
    }

    function getStationList (areaVal) { //지하철역으로 찾기 - 지역 선택 값 받기
        if (areaVal == "sudo") {
            stationList = listStationOfSeoul;
        }
        else if (areaVal == "busan") {
            stationList = listStationOfBusan;
        }
        else if (areaVal == "daegu") {
            stationList = listStationOfDaegu;
        }
        else if (areaVal == "guangju") {
            stationList = listStationOfGwangju;
        }
        else if (areaVal == "daejeon") {
            stationList = listStationOfDaejeon;
        }
    }

    //자동완성
    function getAutoComplete () {
        var $popup = $(".js__popSubway");
        //지역선택 변경 시
        $document.on("change", ".js__popSubway .js__subwayArea", function () {
            var areaVal = $(this).val();
            $popup.find(".js__subwayLine").val("");
            getStationList(areaVal);
        });

        //키워드 입력 시 자동완성
        $document.on("keyup click", ".js__popSubway .js__subwayLine", function () {
            var data = stationList;
            var autoCompleteList = [];
            for (var i=0; i< data.length; i++) {
                if (data[i].area == "수도권" ) {
                    data[i].area = "sudo"
                }
                else if(data[i].area == "부산" ) {
                    data[i].area = "busan"
                }
                else if(data[i].area == "대구" ) {
                    data[i].area = "daegu"
                }
                else if(data[i].area == "광주" ) {
                    data[i].area = "guangju"
                }
                else if(data[i].area == "대전" ) {
                    data[i].area = "daejeon"
                }

                if (data[i].line == "1호선") {
                    data[i].line = 1;
                } else if (data[i].line == "2호선") {
                    data[i].line = 2;
                } else if (data[i].line == "3호선") {
                    data[i].line = 3;
                } else if (data[i].line == "4호선") {
                    data[i].line = 4;
                } else if (data[i].line == "5호선") {
                    data[i].line = 5;
                } else if (data[i].line == "6호선") {
                    data[i].line = 6;
                } else if (data[i].line == "7호선") {
                    data[i].line = 7;
                } else if (data[i].line == "8호선") {
                    data[i].line = 8;
                } else if (data[i].line == "9호선") {
                    data[i].line = 9;
                } else if (data[i].line == "인천1호선") {
                    data[i].line = "inch1";
                } else if (data[i].line == "인천2호선") {
                    data[i].line = "inch2";
                } else if (data[i].line == "분당선") {
                    data[i].line = "bundang";
                } else if (data[i].line == "신분당선") {
                    data[i].line = "sinbundang";
                } else if (data[i].line == "경의중앙선") {
                    data[i].line = "center";
                } else if (data[i].line == "공항철도") {
                    data[i].line = "airline";
                } else if (data[i].line == "의정부경전철") {
                    data[i].line = "eijungbu";
                } else if (data[i].line == "수인선") {
                    data[i].line = "suin";
                } else if (data[i].line == "에버라인") {
                    data[i].line = "everline";
                } else if (data[i].line == "자기부상") {
                    data[i].line = "jagibusang";
                } else if (data[i].line == "김포골드") {
                    data[i].line = "kimpogold";
                } else if (data[i].line == "경춘선") {
                    data[i].line = "gyeongcun";
                } else if (data[i].line == "경강선") {
                    data[i].line = "gyeonggang";
                } else if (data[i].line == "우이신설선") {
                    data[i].line = "uisinseol";
                } else if (data[i].line == "서해선") {
                    data[i].line = "seohae";
                } else if (data[i].line == "동해선") {
                    data[i].line = "donghae";
                } else if (data[i].line == "부산김해경전철") {
                    data[i].line = "kimhae";
                }

                autoCompleteList[i] = "<span class='lineimg " + data[i].area + data[i].line + "'></span>" + data[i].stationName;
            }

            //자동완성 추가
            $popup.find(".js__subwayLine").autocomplete({
                create: function(event){
                    $(this).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                        $(".ui-menu").addClass("popup-ui-menu");
                        return $( "<li class='subwayMatchingResultPopup'></li>" )
                            .data( "item.autocomplete", item )
                            .append(item.value)
                            .appendTo( ul );
                    };

                },
                //리셋하기
                search: function() {
                    var parentTag = $popup.find(".js__autocomplete");
                    if(parentTag.attr('data-type') ) {
                        parentTag.removeClass(parentTag.attr('data-type')).removeAttr('data-type');
                    }
                },
                source: autoCompleteList,
                select: function( event, ui ){
                    var addlineClass = new RegExp(/lineimg (.*)\'/).exec(ui.item.value)[1];  //ex sudo1
                    var addlineValue = new RegExp(/\<\/span\>(.*)/).exec(ui.item.value)[1];  //ex 청라도시
                    ui.item.value = addlineValue;

                    var $input = $popup.find(".js__autocomplete");
                    $popup.find(".js__subwayLine").attr("data-value",addlineValue);


                    if($input.attr('data-type')) {
                        $input.removeClass($input.attr('data-type'));
                    }
                    $input.attr('data-type',addlineClass).addClass(addlineClass);

                },
                focus: function(event, ui) {
                    return false;
                }
            })
        })
    }

    //검색클릭시
    function searchClick () {
        $document
            .on("click", ".js__popupMap__search--subway", function () {
                searchStart.subway();
            })
            .on("click", ".js__popupMap__search--map", function () {
                //지도 (주소)로 검색
                searchStart.map();
            })
    }

    //검색 시작 (디테일)
    var searchStart = {
        subway: function () {
            //지하철역 검색
            var stationName = $(".js__popSubway").find(".js__subwayLine").attr("data-value");

            if (stationName == ''){
                fnAlert('지하철 역 이름을 입력해주세요.');

            } else {
                var targetIdx = 0;
                $.each(stationList, function(i) {
                    if (stationList[i].stationName == stationName) {
                        targetIdx = i;
                    }
                });
                stationId = stationList[targetIdx].stationId;
                stationLatitude = stationList[targetIdx].stationLatitude;
                stationLongitude = stationList[targetIdx].stationLongitude;

                searchStart.showMap(listO2OShop, stationLatitude, stationLongitude);
            }
        },
        map: function () {
            var temp = $('#inputAddrPopup').val();
            if (temp == ''){
                fnAlert('장소, 주소를 입력해주세요.');

            } else {
                var geocoder = new daum.maps.services.Geocoder();

                var tempArray = new Array();
                var tempObject = new Object();

                geocoder.addressSearch(temp, function (result, status) {
                    // 정상적으로 검색이 완료됐으면
                    if (status === kakao.maps.services.Status.OK) {

                        searchStart.showMap(listO2OShop, result[0].y, result[0].x);
                    }

                    else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                        var ps = new kakao.maps.services.Places();
                        ps.keywordSearch(temp, function (data, status, pagination) {
                            // 정상적으로 검색이 완료됐으면
                            if (status === kakao.maps.services.Status.OK) {

                                searchStart.showMap(listO2OShop, data[0].y, data[0].x);
                            }
                        });
                    }
                });
            }
        },
        showMap: function (data, loc1, loc2) {
            var locList1 = [];
            var locList2 = [];
            var chkMapping = false;
            //마커, 위치
            var marker;
            var latlng;
            //중심 좌표
            var mainLat = loc1;
            var mainLng = loc2;
            //꽂을 매장 좌표값 얻기
            $.each(data, function(idx){

                if(data[idx].LATITUDE != null && data[idx].LONGITUDE != null ){
                    chkMapping = true;
                    locList1.push(data[idx].LATITUDE);
                    locList2.push(data[idx].LONGITUDE);
                }
            });

            if(!chkMapping){
                return;
            }
            var NORMAL_IMG = '/mobile/images/map_icon_sub.png',
                SELECT_IMG = '/mobile/images/map_icon.png';

            var selectImage = new daum.maps.MarkerImage(
                SELECT_IMG, new daum.maps.Size(28, 38)
            );
            var markerImage = new daum.maps.MarkerImage(
                NORMAL_IMG, new daum.maps.Size(28, 38)
            );
            var	selectedMarker = null; // 클릭한 마커를 담을 변수
            var overlay =null;
            var mapContainer = document.getElementById('mapPopup'), // 지도를 표시할 div
                mapOption = {
                    center: new daum.maps.LatLng(mainLat, mainLng),
                    level: 6 // 지도의 확대 레벨
                };
            var map = new daum.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
            // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
            var zoomControl = new daum.maps.ZoomControl();
            map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
            //지도 확대축소 막기
            //map.setZoomable(false);
            //마우스 드래그 막기
            map.setDraggable(false);

            // 지하철역 주변 매장 꽂기
            $.each(locList1, function(idx){
                latlng = new daum.maps.LatLng(locList1[idx], locList2[idx]);
                // 마커를 생성하고 이미지는 기본 마커 이미지를 사용합니다
                marker = new daum.maps.Marker({
                    map: map,
                    position: latlng,
                    image: markerImage
                });
                addMarker(marker, idx);
            });

            // 마커를 생성하고 지도 위에 표시하고, 마커에 mouseover, mouseout, click 이벤트를 등록하는 함수입니다
            function addMarker(marker, idx) {

                var openTime =data[idx].OPEN_TIME;
                var content =
                    '<div class="wrap-shop-info">'+
                    '<div class="shop-info-top">'+
                    '<div class="shop-name">'+
                    ''+data[idx].SHOP_NAME+''+ //매장명
                    '<div class="ico-shop">'+
                    // str2+
                    '</div>'+
                    '</div>'+
                    '<div class="shop-info-area">'+
                    '<p><span>주소</span>'+data[idx].ADDR1+' '+data[idx].ADDR2+' </p> '+
                    '<p><span>방문가능한 시간</span>'+ data[idx].OPEN_TIME + ' </p> '+
                    '<p><span>연락처</span>'+data[idx].TEL+' </p> '+
                    '</div>'+
                    '<a href="tel:'+data[idx].TEL+'" class="btn-tel">'+data[idx].TEL+'</a> '+
                    '</div>'+
                    '<button id="12select" type="button" onclick="fnSelectStore('+data[idx].CS_SHOP_MNG_ID+ ' ,' +"'"+data[idx].SHOP_NAME+"'"+');">매장선택</button>' +
                    '</div>';

                // 마커에 click 이벤트를 등록합니다
                daum.maps.event.addListener(marker, 'click', function() {
                    //확인필요** 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면 마커의 이미지를 클릭 이미지로 변경합니다
                    if (!selectedMarker || selectedMarker !== marker) {
                        // 클릭된 마커 객체가 null이 아니면 클릭된 마커의 이미지를 기본 이미지로 변경하고
                        !!selectedMarker && selectedMarker.setImage(markerImage);
                    }
                    // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
                    marker.setImage(selectImage);
                    // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
                    selectedMarker = marker;

                    if(overlay != null){
                        overlay.setMap(null);
                    }
                    $('#textBoxPopup').show().html(content);
                    $('#openTime').text("(방문 가능시간 : "+openTime+")");
                    $('#openTime2').text("(방문 가능시간 : "+openTime+")");
                });
            }
        }
    };

    //순서
    var ajaxMap = {
        init: function () {
            initShowMap();
            initO2OShopList();
            initSubwayStationList();
        },
        radioTab: function () {
            radioSelect();
        },
        autoComplete: function () {
            getAutoComplete();
        },
        search: function () {
            searchClick();
        },
        run: function () {
            this.init();
            this.radioTab();
            this.autoComplete();
            this.search();
        }
    };

    //셀렉트 박스 효과
    function selectBox () {
        $('.jq-select').selectbox({
            effect: "slide"
        });
    }
    function popup_init () {
        ajaxMap.run();
        selectBox();
    }
    popup_init();
};


$(function () {
    minicartPopupMap();
});
