/**
* Created by forbiz on 2021-06-18.
*/

const brandIndexer = () => {
    const $document = $(document);
    const $window = $(window);
    const $body = $("body");
    
    const fnSearchBrand = () => { 
        const $alphabetCont = $(".alphabet__section"); //콘텐츠
        const $floatingScroll  = $(".js__floating__scroll"); //인덱스 스크롤
       
        const $start = $(".js__floating__start"); //인덱스 플로팅 시작지점
        const $floating = $(".js__floating__target"); //인덱스
        const $menu = $(".js__alphabet__menu"); //인덱스 안 각각 메뉴
    
        //스크롤 이동중 flag 추가
        let isMoving = false;
    
        //인덱서 스크롤 값 이동 (인덱서가 스크롤 생기는 경우에 발생)
        const makeActiveMenuVisible = ($targetmenu) => {
            const _index = $targetmenu.index(); //메뉴인덱스
            const _menuOffset = Math.floor($menu.outerHeight(true) * _index); //메뉴높이값(FIXED라서 offset().top대신 height로 구함)
    
            //조건
            const _topIsNotVisible = _menuOffset < $floatingScroll.scrollTop(); //위에서 안보이는 경우
            const _bottomIsNotVisible = _menuOffset > ($floatingScroll.scrollTop() + $floatingScroll.height());
    
            //우측 플로팅 메뉴 스크롤값 이동
            if (_topIsNotVisible || _bottomIsNotVisible) { //위에 있어서 안보임
                $floatingScroll.scrollTop(_menuOffset);
            }
        }
    
        //인덱서 active
        const menuActive = ($targetmenu) => {
            $menu.removeClass("active"); //리셋
            $targetmenu.addClass("active"); //타겟 active
        }
    
        //인덱스 번호 가져오기
        const getIndex = ($content) => {
            const ID = $content.length ? $content.attr("id") : 0;
    
            return ID ? ID.replace(/alphabet/, "") : 0;
        }
    
        //몇번째 콘텐츠 안에 있는지 체크
        const getCurrentInsideBoxIndex = (_current) => {
            const _bottomOfScreen = $body.prop("scrollHeight") - window.outerHeight;
    
            //스크롤이 스크린의 제일 아랫쪽에 있을때는 클릭이벤트가 먼저 적용되도록 return ;
            if (_current > _bottomOfScreen) return ;
    
            //몇번째 콘텐츠 안에 있는지 index 구하기
            const _insideIndex = $alphabetCont.map(index => {
                const $each = $alphabetCont.eq(index);
                const $prev = $each.prev();
    
                //조건
                const _isFirstBox = !$prev.length;
                const _isInside = _current < $each.offset().top + $each.outerHeight();
                
                if (_isFirstBox) { //첫번째콘텐츠 안에 있을때
                    if (_isInside) {
                        return getIndex($each);
                    }
                }
    
                else { //첫번째 이 외의 콘텐츠
                    const _isBiggerThanPrev = (_current > $prev.offset().top + $prev.outerHeight());
                    
                    if ( _isBiggerThanPrev && _isInside) {
                        return getIndex($each);
                    }
                }
            })[0];
    
            return _insideIndex;
        }
    
        //인덱서 active
        const scrollMove = () => {
            $window.on("load scroll", function () {
                let _current = $window.scrollTop();
    
                //클릭해서 이동중일때는 false
                if (isMoving) return ;
    
                //현재 위치한 박스 index 가져오기
                const _insideIndex = getCurrentInsideBoxIndex(_current);
    
                if (!!!_insideIndex) return ;
    
                const $targetMenu = $(`[href="#alphabet${_insideIndex}"]`);
    
                menuActive($targetMenu);
                makeActiveMenuVisible($targetMenu);
            })
        }
    
        //인덱서 fixed
        const fixFloatingbar = () => {
            $window.on("load scroll", function () {
                let _current = $window.scrollTop();
    
                if (!$start.length) return ;
    
                if (_current >= $start.offset().top) {
                    $floating.addClass("fixed");
                }
                else {
                    $floating.removeClass("fixed");
                }
            })
        }
    
        //인덱서 메뉴 클릭
        const alphabetMenuClick = () => {
            $document.on("click", ".js__alphabet__menu", function () {
                const $this = $(this);
                const $target = $($this.attr("href"));
    
                if (!$target.length || isMoving) return false;
                
                isMoving = true;
    
                //스크롤 이동
                $("html, body").animate(
                    {
                        "scrollTop": Math.ceil($target.offset().top)
                    },
                    500,
                    "swing",
                    function () {
                        isMoving = false;                    
                    }
                )
    
                menuActive($this);
                $window.off("scroll.test").on("scroll.test");
                
                return false;
            });
        }
    
        const settingIndexer = () => {
            const _firstContentIndex = getIndex($alphabetCont.eq(0)); //첫번째 콘텐츠의 인덱스
            menuActive($(`[href="#alphabet${_firstContentIndex}"]`)); //첫번째 메뉴 active
    
            //데이터 있는지 체크해서 dim제거
            $alphabetCont.map((_index, el) => {
                const _id = $(el).attr("id");
                $(`[href="#${_id}"]`).addClass("noDim");
            })
        }

        const brandInit = () => {
            settingIndexer();
            scrollMove();
            fixFloatingbar();
            alphabetMenuClick();
        }
    
        brandInit();
    }

    const init = () => {
        fnSearchBrand();
    }

    init();
}

export default brandIndexer;