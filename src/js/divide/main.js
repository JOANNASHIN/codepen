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
                    
                    const reg = new RegExp([_penname], "ig");
                    // if (_penname.indexOf(_value) != -1) {

                    console.log(reg, _value, _value.match(reg))
                    if (_value.match(reg)) {
                        console.log("매치!!", _penname)
                        $pen.addClass("show");
                    }
                });
            }
        })
    }

    const init = () => {
        autoFindPen();
    }

    init();
}


export default main;