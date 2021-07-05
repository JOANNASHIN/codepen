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

    const init = () => {
        // navigationOpenClose();
    }

    init();
}

export default layout;