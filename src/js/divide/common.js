const common = () => {
    const $document = $(document);
    const $body = $("body");

    /**
     * localStorage 사용한 쿠키 함수
     * 오늘하루 보지않기 등에 사용
     */
    const localCookie = {
        /**
         * 쿠키값 localStorage 있는지 확인
         * @param {string} cookieName - 쿠키이름
         */
        get(cookieName) {
            return window.localStorage.getItem(cookieName) || "";
        },
        /**
         * 쿠키 이름값으로 localStorage에 현재 시간 저장 (millisecond 기준)
         * @param {string} cookieName - 쿠키이름
         */
        make(cookieName) {
            window.localStorage.setItem(cookieName, new Date().getTime());
        },
        /**
         * localStorage에 있는 시간과 현재 시간 비교
         * calc(현재시간 - localStorage) 시간을 초 단위로 변경 후 시간 비교하여 체크
         * 
         * @param {string} cookieName - 쿠키이름, 
         * @param {number} time - 초단위의 시간
         */
        isEnd(cookieName, time) {
            const _session = Number(localCookie.get(cookieName));

            if (_session){ 
                let _result = false;
                const _current = Number(new Date().getTime());
                
                if ((_current - _session)/1000 < time) {
                    _result = true; //쿠키 굽는중
                }
                else {
                    _result = false; //쿠키 시간 지남
                    localCookie.remove(cookieName);
                }
                
                return _result;

            } else {
                return false;
            }
        },
        /**
         * localStorage 값 제거 (쿠키 제거)
         * @param {string} cookieName - 쿠키이름
         */
        remove(cookieName) {
            window.localStorage.removeItem(cookieName);
        }
    };

    /**
     *   슬라이드 실행여부 판단 함수
     *   $target 은 swiper-container 나 그보다 부모 (슬라이드버튼, 슬라이드 컨테이너 모두 감싼 element로)
     *   슬라이드 버튼은 js__slider__nav 로 통일
     * */
    const canMakeSlider = ($target, minLength) => {
        var isPass = true;
        const $slides = $target.find(".swiper-slide");

        if ($slides.length <= minLength) {
            isPass = false;
        }

        if (isPass) $target.find(".js__slider__nav").addClass("show");
        else $target.find(".js__slider__nav").removeClass("show");

        return isPass; //슬라이드 만들거면 true / 아니면 false
    };

    //공통 비동기 통신
    const requestApi = (object) => {
        if (!object.url) return ;
        
        return new Promise((resolve, reject) => {
            try {
                $.ajax({
                    type: object.type ? object.type : "POST",
                    url: object.url,
                    data: object.data ? object.data : "",
                    success (result) {
                        resolve(result);
                    },
        
                    error(error) {
                        reject(error)
                    }
                });
            }
        
            catch(error) {
                reject(error)
            }
        })
    }

    /**
    * 레이어 js__layer
    * 열기버튼 js__layer__open
    * 닫기버튼 js__layer__close
    */
    const fn_layer = () => {
        /**
        * 레이어 열기
        *   1. 동작이 일어나는 버튼에 js__layer__open 클래스 추가
        *   2. 동작이 일어나는 버튼에 data-layer="레이어 아이디값" 속성 추가
        */
        $document.on("click", ".js__layer__open", function () {
            const _layer = $(this).data("layer");
            const $layer = $("#" + _layer);

            console.log($layer);

            layer_show($layer, true);
        });

        /**
        * 레이어 닫기
        *   1. 닫기버튼에 js__layer__close 클래스 추가
        *   2. 해당 레이어 최상위에 js__layer 클래스 추가
        */
        $document.on("click", ".js__layer__close", function () {
            const _this = $(this);
            const $layer = _this.closest(".js__layer");
            layer_show($layer, false);
        });
    };

   /**
    * 레이어 열고 닫기
    * @param {element} $layer - 레이어 선택자(필수)
    * @param {boolean} Boolean - open(true) / close(false)
    */
   const layer_show = ($layer, Boolean, callback) => {
       if (!$layer) return ;

       if (Boolean) {
           $layer.addClass("show");
           $body.addClass("scroll--lock");
       }
       else{
           $layer.removeClass("show");
           $body.removeClass("scroll--lock");
       }

       if (callback) callback();
   };

   /**
         * 전체선택
         * js__check__wrapper - 전체 체크박스 감싼 영역
         * js__check__all     - 전체선택 체크박스 input
         * js__check__each    - 체크박스 각각
         * 
         * 회원가입 약관동의에서 케이스 추가(전체체크박스 안 또다른 전체체크 영역)
         * js__another__wrapper - 전체 체크박스 안 또다른 체크박스 영역 (마케팅 활용동의 - sms/이메일)
         * js__another__all    - 또다른 체크박스 영역의 전체선택
         * data-another-target="true" - 또다른 체크박스 영역의 각각
         */
    const allSelectCheckbox = () => {
        //전체선택 이벤트
        const allCheckEvent = ($this, $btnEach) => {
            if ( $this.is(":checked") ) {
                $this.add($btnEach).prop("checked", true);
            }
            else {
                $this.add($btnEach).prop("checked", false);
            }
        }

        //개별선택 이벤트
        const eachCheckEvent = ($btnAll, $btnEach) => {
            let checkFlag = true;   // 모두 체크 상태 체크

            $btnEach.map(idx => {
                if( !$btnEach.eq(idx).is(":checked")) {
                    checkFlag = false;

                    return false;
                }
            });

            $btnAll.prop("checked",checkFlag).attr("checked",checkFlag);
        }

        // 클릭 이벤트 바인딩
        const bindEvents = () => {
            $document
                //전체선택 체크박스 클릭 시
                .on("click", ".js__check__all", function() {
                    const $this = $(this);
                    const $btnEach = $this.closest(".js__check__wrapper").find(".js__check__each");
                    
                    allCheckEvent($this, $btnEach);
                })

                //체크박스 안 또다른 영역이 있는 경우 (회원가입 약관동의 참고)
                .on("click", ".js__another__all", function () {

                    const $this = $(this);
                    const $btnEach = $this.closest(".js__another__wrapper").find(".js__check__each:not(.js__another__all)");
                    
                    allCheckEvent($this, $btnEach);

                })

                //개별 체크박스 클릭 시
                .on("click", ".js__check__each", function() {
                    const $this = $(this);
                    const $area = $this.closest(".js__check__wrapper");
                    const $btnAll = $area.find(".js__check__all");
                    const $btnEach = $area.find(".js__check__each");

                    //안에 한개 더 체크해야할 경우가 있는지 체크 (회원가입 약관동의 참고)
                    const isAnotherTarget = $this.data("another-target");

                    // 안에 한개 더 체크해야할 경우 한번 더 체크
                    if (isAnotherTarget) {
                        const $anotherArea = $this.closest(".js__another__wrapper");
                        const $anotherAll = $anotherArea.find(".js__another__all");
                        const $anotherEach = $anotherArea.find(".js__check__each:not(.js__another__all)");

                        eachCheckEvent($anotherAll, $anotherEach);
                    }

                    // 기본 체크
                    eachCheckEvent($btnAll, $btnEach);
                });
        }

        //이미 전체 선택되어있는지 체크
        const initEvents = () => {
            const $all = $(".js__check__all");
            const $each = $(".js__check__each");

            //선택된 개수가 전체선택된 개수라면 전체선택에 checked
            if ($all.length && $each.length) eachCheckEvent($all, $each);
        }

        const init = () => {
            initEvents();
            bindEvents();
        }

        init();
    }

    /**
     *  details 태그 아코디언 케이스 추가
     *  모두 감싼 부모네 js__details__accordian 추가하면 됨.
     *  ie에서 동작안하는것 대비하여 직접 open attribute 컨트롤.
     */
    const detailsTagAction = () => {
        $document.on("click", "summary", function () {
            const $this = $(this);
            const $details = $this.closest("details");
            const $isAccordian = $this.closest(".js__details__accordian");

            if (!$details.attr("open")) {
                //아코디언
                if ($isAccordian.length) {
                    $isAccordian.find("details").removeAttr("open");
                }
                $details.attr("open", true);
            }
            else {
                $details.removeAttr("open");
            }

            return false;
        })
        
        //summary 안에 체크박스, 라디오 안먹는 경우가 있어서 추가
        .on("click", "summary [class^=fb__comm]", function (e) {
            e.stopPropagation();

            const $this = $(this);
            const $input = $this.find("input");

            if ($input.is(":checked")) $input.prop("checked", false);
            else $input.prop("checked", true);

            return false;
        });
    }
    
    /**
     * js__custom__details
     * js__custom__summary
     * details summary 안에서 또 이벤트 필요한경우 ios 에서 안돼서 추가
     */
    const customDetailsTag = () => {
        $document.on("click", ".js__custom__summary", function () {
            const $this = $(this);
            const $details = $this.closest(".js__custom__details");
            const $isAccordian = $this.closest(".js__details__accordian");

            if (!$details.attr("open")) {
                //아코디언
                if ($isAccordian.length) {
                    $isAccordian.find("details").removeAttr("open");
                }
                $details.attr("open", true);
            }
            else {
                $details.removeAttr("open");
            }
        })
        
    }

    /**
     * 커스텀 셀렉트 (기본 OS 셀렉트지만 우측 정렬 이슈때문에 추가)
     * js__custom__wrapper 감싼 부모
     * js__custom__value  바뀐 값 넣을 엘리먼트
     * js__custom__select select 태그
     */
    const customSelect = () => {
        $document.on("change", ".js__custom__select", function () {
            const $this = $(this);
            const $customValue = $this.closest(".js__custom__wrapper").find(".js__custom__value");
            const _sortName = $this.find("option:checked").text();

            if (!$customValue.length) return ;

            $customValue.html(_sortName);
        })
    }

    /**
     * js__textcount__area        textarea 를 감싼 부모
     * js__textCount__textarea    textarea 엘리먼트 (textarea에 maxlength 속성 주기)
     * js__textCount__current     현재 글자수 엘리먼트
     * js__textCount__maxLength   글자수 최댓값 엘리먼트
    */
    const countTextLength = () => {

        const $parents = $(".js__textcount__area");
        const $textarea = $parents.find(".js__textCount__textarea");
        const $currentCount = $parents.find(".js__textCount__current")
        const $maxLength = $parents.find(".js__textCount__maxLength");
        
        if (!$textarea.length || !$currentCount.length) return ;
        
        const _maxLength = $textarea.attr("maxlength");
        const _defaultLength = $textarea.val().length;

        // 최댓값 체크
        $maxLength.text(_maxLength);

        //수정인 경우 기존 값 체크
        $currentCount.text(_defaultLength);

        //새로 쓸 때마다 체크
        $textarea.on("keyup", function(e) {
            $currentCount.text($textarea.val().length);
        });

    };

    const inputValidation = () => {
        const onlyNumber = () => {
            $document
                .on("input", ".js__input--onlyNumber", function() {
                    const $this = $(this);

                    $this.val($this.val().replace(/[^0-9]/gi, ""));
                });
        };

        const inputValidationInit = () => {
            onlyNumber();
        };
        
        inputValidationInit();
    };

    /**
     * 공통 tab
     * 감싼 부모  :: js__tab__wrapper
     * 탭 메뉴    :: js__tab__menu
     * 탭 콘텐츠(있으면 추가)  :: 탭메뉴에 data-tab-content 속성 추가 (아이디면 #content 클래스면 .content)
     */
    const tabEvents = () => {
        $document.on("click", ".js__tab__menu", function () {
            const $this = $(this);
            const _tabContent = $this.attr("data-tab-content"); 
            const $area = $this.closest(".js__tab__wrapper"); //탭 영역
            const $tabContent = $(`${_tabContent}`); //탭 콘텐츠

            if (!$area.length) return ;

            //메뉴 active
            $area.find(".js__tab__menu").removeClass("active");
            $this.addClass("active");

            //콘텐츠 show
            if (!$tabContent.length) return ;

            //타겟 이 외의 콘텐츠 hide
            $area.find(".js__tab__content").removeClass("show");
            //해당 콘텐츠 show
            $tabContent.addClass("show");
        })
    }

    /* 
        눈아이콘 클릭하여 password 보기
        input 에 js__pw__input 클래스 부여
        input 과 형제 위치에 <span class="js__pw-show__btn">눈아이콘</span> 추가
    */ 
    const showPassword = () => {

        if( !$(".js__pw-show__btn").length ) return;

        $document.on("click", ".js__pw-show__btn", function(e) {
            e.stopPropagation();
            
            const $this = $(this);
            const $target = $this.parent().find(".js__pw__input");

            if ($target.attr("type") == "password") {
                $target.attr("type", "text");
            } 
            else if (
                $target.attr("type") == "text"
            ) {
               $target.attr("type", "password");
            }

            return false;
        });
    }

    //input 버튼 관련 함수
    const inputCommonEvents = () => {

        const getTargetElement = ($this) => {
            return {
                $input: $this.closest(".js__input__wrapper").find(".js__input"),
                $clear: $this.closest(".js__input__wrapper").find(".js__input__clear"),
                _valueLength: $this.val().length
            }
        }

        const keyupEvent = () => {
            $document.on("keyup", ".js__input", function() {
                const {$clear, _valueLength} = getTargetElement($(this));

                if (!$clear.length) return ;
                
                if (_valueLength) $clear.addClass("show");
                else $clear.removeClass("show");

                return false;
            })
        }

        const focusBlurEvent = function () {
            $document
                .on("focus", ".js__input", function() {
                    const {$clear, _valueLength} = getTargetElement($(this));
                    
                    if (!$clear.length) return ;
                    
                    if (_valueLength) $clear.addClass("show");
                    else $clear.removeClass("show");

                    return false;
                })

                .on("blur", ".js__input", function() {
                    const {$clear} = getTargetElement($(this));

                    $clear.removeClass("show");
                    return false;
                });
        }

        const clearEvent = () => {
            $document.on("click", ".js__input__clear", function (e) {
                e.stopPropagation();

                const {$input, $clear} = getTargetElement($(this));
    
                if (!$input.length || !$clear.length) return ;

                $input.val("");
                $clear.removeClass("show");

                return false;
            })
        }

        const bindEvents = function () {
            keyupEvent();
            focusBlurEvent();
            clearEvent();
        }

        bindEvents();
    }

    const removeFilterData = () => {
        window.localStorage.removeItem("filterData")
    }

    const requestHtmlData = (_url) => {
        if (!_url) return ;
        return new Promise((resolve, reject) => {
            try {
                $.ajax({
                    type: "GET",
                    url: _url,
                    
                    success(data) {
                        resolve(data);
                    },

                    error (error) {
                        reject(error)
                    }
                });
            }

            catch (error){
                console.error("getHtmlData has exception...", error);
                reject(error)
            }
        })

    }

    const init = () => {
        window.localCookie = localCookie;
        window.canMakeSlider = canMakeSlider;
        window.requestApi = requestApi;
        window.layer_show = layer_show;
        window.countTextLength = countTextLength;
        window.showPassword = showPassword;
        window.removeFilterData = removeFilterData;
        window.requestHtmlData = requestHtmlData;

        fn_layer();
        allSelectCheckbox();
        detailsTagAction();
        tabEvents();
        showPassword();
        inputCommonEvents();
        customDetailsTag();
        customSelect();
    }

    init();
}

export default common;