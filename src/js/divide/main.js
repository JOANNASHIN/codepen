// import findAddress from "./findAddress";
// import text from "../../../views/filter/filter.html";
// console.log(text)

const main = () => {
    const $document = $(document);

    const autoFindPen = () => {
        $document.on("keyup", ".js__pen__search", function () {
            const $this = $(this);
            const _value = $this.val();
            const penList = ["brandIndexer", "searchKeyword", "filter"];

            if (!_value) {
                $(".js__pen").addClass("show");    
            }
            else {
                $(".js__pen").removeClass("show");
    
                penList.forEach(pen => {
                    const $pen = $(`[data-pen=${pen}]`);
                    const _penname = $(`[data-pen=${pen}]`).find(".js__pen__name").text();
                    const reg = new RegExp(`[${_penname}]`, "ig");

                    if (_value.match(reg)) {
                        $pen.addClass("show");
                    }
                });
            }
        })
    }

    const requestSource = async (url) => {
        const $sourceLayer = $(".js__source__layer");
        const $sourceCont = $(".js__source__cont");
        let _html = await requestHtmlData(url);

        if (_html) {
            const _start = _html.indexOf("<body");
            const _end = _html.indexOf("</body>") + 7;
            _html = _html.slice(_start, _end);
            console.log(_start, _end, _html);
            $sourceCont.text(_html);

            $sourceLayer.addClass("show");
        }
    }

    const showSource = () => {
        $document.on("click", ".js__source__show", function () {
            const _url = $(this).closest("li").find("a").attr("href");
            requestSource(_url);
        })
    }
    
    const init = () => {
        autoFindPen();
        showSource();
    }

    init();
}


export default main;