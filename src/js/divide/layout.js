const layout = () => {
    const $document = $(document);
    const $window = $(window);

    const navigationOpenClose = () => {
        $document
            .on("click", ".js__navigation__open", function () {
                const $nav = $(".js__navigation");
                $nav.addClass("show");
            });
    }

    const showLoading = (_show) => {
        if (_show) {
            $(".js__loading").addClass("show");
        }
        else {
            $(".js__loading").removeClass("show");
        }
    }

    const init = () => {
        // navigationOpenClose();
        window.showLoading = showLoading;
    }

    init();
}

export default layout;