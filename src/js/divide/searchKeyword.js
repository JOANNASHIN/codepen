const searchKeyword = () => {
    const $document = $(document);
    const $input = $(".js__search__input");
    const $autocomplete = $(".js__search__autocomplete");
    
    //상단 검색 - input관련
    const inputSearch = () => {
        //자동완성 데이터 연결
        const requestAutocomplete = function (keyword) {
            const $autocompleteList = $(".js__autocomplete__list"); //자동완성 리스트
            // @todo 개발: api연결
        }

        //자동완성 레이어 보이기
        const keyupInput = () => {
            $document.on("keyup", ".js__search__input", function() {
                const $this = $(this);
                const _valueLength = $this.val().length;
    
                if (_valueLength) {
                    requestAutocomplete($this.val());
                    $autocomplete.addClass("show");
                }
                else {
                    $autocomplete.removeClass("show");
                }
            })
        }
    
        //input clear할때 자동완성 레이어 숨기기
        const clearInput = () => {
            $document.on("click", ".js__input__clear", function (e) {
                e.stopPropagation();
                $autocomplete.removeClass("show");
    
                return false;
            })
        }

        //브랜드, 카테고리 제외한 단어 클릭 시 input value값 변경하기
        const wordChange = () => {
            $document.on("click", ".js__autocomplete__change", function() {
                const _word = $(this).find(".js__autocomplete__word").text();
                $input.val(_word);
                requestAutocomplete(_word);
            });
        }
       
        const init = () => {
            keyupInput();
            clearInput();
            wordChange();
        }

        init();
    }

    // 인기 키워드
    const hotKeyword = () => {
        let rollingSlideObj = null;
        let keywordSlideObj = null;

        //자동롤링
        const hotKeywordRolling = () => {
            const $area = $(".js__hotRolling");

            if (!$area.length || !canMakeSlider($area, 1)) return ;
            
            rollingSlideObj = new Swiper(".js__hotRolling.swiper-container", {
                speed: 1000,
                loop: true,
                effect: "slide",
                direction: "vertical",
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: true,
                }
            })
        }

        //인기키워드 슬라이드
        const hotKeywordSlider = () => {
            const $area = $(".js__hotKeyword");

            if (!$area.length || $(".js__hot__item").length <= 5) return ;

            keywordSlideObj = new Swiper(".js__hotKeyword .swiper-container", {
                loop: false,
                initSlide: 0,
                pagination: {
                    type: "bullets",
                    el: ".js__hotKeyword__page",
                }
            })
        }

        //details / summary
        const hotKeywordOpen = () => {
            $document.on("click", ".js__hot__summary", function () {
                const $this = $(this);
                const $details = $this.closest(".js__hot__details");
                const _isOpen = $details.attr("open");

                // 열렸을때
                if (_isOpen) {
                    //하단 영역 슬라이드 실행
                    if (!keywordSlideObj) {
                        hotKeywordSlider();
                    }
                    else {
                        //열었을때 다시 첫 슬라이드로
                        keywordSlideObj.slideTo(0);
                    }
                }
                //닫았을때
                else {
                    //롤링 슬라이드 리셋 후 재실행
                    if (rollingSlideObj) rollingSlideObj.destroy();
                    hotKeywordRolling();
                }
            })
        }

        const hotKeywordInit = () => {
            hotKeywordRolling();
            hotKeywordOpen();
        }
        
        hotKeywordInit();
    }

    // 추천 검색어
    const recommendTab = () => {
        $document.on("change", "[name=recommendAge]", function () {
            const $this = $(this);
            const _value = $this.val();

            $(`#${_value}`).addClass("show").siblings().removeClass("show");
        })
    }

    //최근검색어 리스트 (empty / 태그)
    const drawRecentKeyword = () => {
        const $recentKeyword = $(".js__recentKeyword");
        const $tag = $(".js__recentKeyword__tag");
        const _storage = window.localStorage.getItem("recentWord");

        // 최근검색어가 있는 경우
        if (_storage != null) {
            const recentWordList = String(_storage).split(",");

            $recentKeyword.removeClass("empty");
            $tag.empty(); //태그 리셋
            
            recentWordList.forEach(tag => {
                $tag.append(`
                    <li class="tag__list">
                        <a class="tag__link" href="#">${tag}</a>
                    </li>
                `)
            })
        }
        // 최근검색어가 없는 경우
        else {
            $recentKeyword.addClass("empty");
        }
    }

    //최근검색어 전체삭제
    const removeRecentKeyword = () => {
        $document.on('click', ".js__recentKeyword__removeAll", function () {
            window.localStorage.removeItem("recentWord");

            drawRecentKeyword();
        });
    }

    // 검색 실행관련 (검색 레이어, 검색페이지)
    const trySearch =  () => {
        const $input = $(".js__search__input");

        //검색 유효성 검사
        const isPossibleSearch = function(_searchText) {
            let isPass = true;
        
            if ( _searchText == '' ) {
                alert('검색어는 1글자 이상 입력해 주세요.');
                $input.focus();
    
                isPass = false;
            }
    
            return isPass;
        }

        //검색 시작
        const searchInit = function () {
            const _searchText = $input.val();
            const isPass = isPossibleSearch(_searchText);

            if (!isPass) return ;

            // 스토리지에 저장한 키워드 가져오기
            const _storage = window.localStorage.getItem("recentWord");

            // 기존에 저장한 값이 있으면 추가하여 저장
            if (_storage != null) {
                const recentWordList = String(_storage).split(",");
                recentWordList.push(_searchText);

                window.localStorage.setItem("recentWord", recentWordList);
            }
            // 처음 저장하는 경우
            else {
                window.localStorage.setItem("recentWord", [_searchText]);
            }

            $input.val("");
            $autocomplete.removeClass("show");

            //최근 검색어 그리기
            drawRecentKeyword();
        }

        const bindEvents = function () {
            $document
                .on("submit", ".js__search__form", function () {
                    searchInit();

                    return false;
                })
    
                .on("keyup", ".js__search__input", function (e) {
                    if (e.keyCode == 13) searchInit();
                })
        }

        bindEvents();
    }
   
    const init = () => {
        inputSearch();
        hotKeyword();
        recommendTab();
        drawRecentKeyword();
        removeRecentKeyword();
        trySearch();
    }

    init();
}

export default searchKeyword;