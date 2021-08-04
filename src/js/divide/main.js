const main = () => {
    const $document = $(document);

    const showSearchTargetPen = (_value) => {
        $(".js__pen").removeClass("show");

        $("[data-pen]").each((idx, obj) => {
            const $this = $(obj);
            const _penname = $this.find(".js__pen__name").text();
            
            if (_penname.indexOf(_value) != -1) {
                $this.addClass("show");
            }

            // const reg = new RegExp(`[${_penname}]`, "ig");

            // if (_value.match(reg)) {
            //     $this.addClass("show");
            // }
        })
    }
    
    const hasBeforeData = () => {
        const _getParameter = getParameter("keyword");

        if (_getParameter) {
            $(".js__pen__autoComplete").val(_getParameter).trigger("keyup");
            showSearchTargetPen(_getParameter);
        }
    }
 
    const pushStateSearch = () => {
        $document.on("click", ".js__pen__submit", function () {
            const _value = $(this).prev().val();
            history.pushState(null, null, `?keyword=${_value}`);

            return false;
        });
    }

    const autoFindPen = () => {
        $document.on("keyup", ".js__pen__autoComplete", function () {
            const $this = $(this);
            const _value = $this.val();

            if (!_value) {
                $(".js__pen").addClass("show");    
            }
            else {
                showSearchTargetPen(_value);
            }

            history.pushState(null, null, `?keyword=${_value}`);
        })
    }

    const showSource = () => {
        $document.on("click", ".js__pen .js__layer__open", function () {
            const $pen = $(this).closest(".js__pen");
            const _pen = $pen.data("pen");
            const $sourceCont = $(".js__source__cont");

            $("#sourceLayer").addClass("show");
            $sourceCont.removeClass("show");
            $(`#${_pen}`).addClass("show");

            return false;
        })
    }

    const checkIsMobilePen = () => {
        $document.on("click", ".pens__link", function () {
            const $this = $(this);
            console.log($(window).width(), $document.width())

            if ( $(window).width() > 750 
                 && $this.find(".js__pen__name").text().indexOf("모바일") != -1
            ) {
                // alert("개발자 도구(F12)를 누르고 'Ctrl + Shift + M'을 눌러 모바일 모드로 확인해주세요.");
                alert("모바일 모드로 확인해주세요.\n Please check it on mobile mode.");
            }
        })
    }
    
    const moveToLink = () => {
        $document.on("click", ".js__link", function () {
            const $this = $(this);
            const _link = $this.data("link");

            window.open(_link);

            return false;
        })
    }

    const init = () => {
        hasBeforeData();
        pushStateSearch();
        autoFindPen();
        showSource();
        checkIsMobilePen();
        moveToLink();
    }

    init();
}

export default main;