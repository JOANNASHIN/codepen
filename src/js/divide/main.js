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
                history.pushState(null, null, `?keyword=${_value}`);
                showSearchTargetPen(_value);
            }
        })
    }

    const showSource = () => {
        $document.on("click", ".js__layer__open", function () {
            const $pen = $(this).closest(".js__pen");
            const _pen = $pen.data("pen");
            const $sourceCont = $(".js__source__cont");

            $("#sourceLayer").addClass("show");
            $sourceCont.removeClass("show");
            $(`#${_pen}`).addClass("show");

        })
    }
    
    const init = () => {
        hasBeforeData();
        pushStateSearch();
        autoFindPen();
        showSource();
    }

    init();
}


export default main;