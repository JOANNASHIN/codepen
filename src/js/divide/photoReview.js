const photoReview = () => {
    const $document = $(document);
    
    //레이어 관련 이벤트
    const layerEvents = function () {
        const $layer = $(".fb__reviewPop");

        $document
            //팝업열기
            .on("click", ".js__slide__layerOpen", function () {
                const _index = $(this).data("index");

                isLayerShow($layer, true);
                fnPopupPhoto.photoPopupSlider(_index);                
            })
            //팝업닫기
            .on("click", ".fb__reviewPop__close", function () {
                isLayerShow($layer, false);
            })
    }

    //layer show/hide
    const isLayerShow = function ($layer, isShow) {
        if (isShow) $layer.addClass("show");
        else $layer.removeClass("show");
    }

    //슬라이드 실행여부 확인
    const canMakeSlider = function ($slides, minLength) {
        let isPass = true;

        if ($slides.length < minLength) {
            isPass = false;
        }

        return isPass; //슬라이드 만들거면 true / 아니면 false
    }

    //첫번째 슬라이드 만들기 (페이지슬라이드)
    const photoSlider = function () {
        const $area = $(".js__photoSlider__area");
        const $slides = $area.find(".swiper-slide");
        const minLength = 6;

        if (!canMakeSlider($slides, minLength)) return ;

        $area.find(".js__slider__nav").addClass("show");

        new Swiper(".js__photoSlider__area .swiper-container", {
            loop: true,
            slidesPerView: "auto",
            navigation: {
                prevEl: '.reviewPage__button--prev',
                nextEl: '.reviewPage__button--next',
            },
        })
    }

    // 팝업 안 함수 모음 (팝업 슬라이드 포함)
    const fnPopupPhoto = {
        //팝업 슬라이드 객체
        photoPopupSlideObj: null,

        //상단 포토 팝업 슬라이드
        photoPopupSlider(_index) {
            const self = this;
            const $area = $(".js__photoPopupSlider__area");
            const $slides = $area.find(".swiper-slide");
            const minLength = 6;

            //선택한 슬라이드에 active
            self.addActiveClass(_index);
            
            //리뷰상세 api요청
            self.requestphotoPopupDetail(_index);
            
            if (!canMakeSlider($slides, minLength)) return ;

            $area.find(".js__slider__nav").addClass("show");
    
            self.photoPopupSlideObj = new Swiper(".js__photoPopupSlider__area .swiper-container", {
                slidesPerView: "auto",
                centeredSlides: true,
                centeredSlidesBounds: true,
                navigation: {
                    prevEl: '.allReview__button--prev',
                    nextEl: '.allReview__button--next',
                },

                on: {
                    init() {
                        //해당 슬라이드로 이동
                        this.slideToLoop(Number(_index));
                    }
                }
            })
        },

        changeReview() {
            const self = this;

            $document.on("click", ".allReview__slide", function() {
                const slideObj = self.photoPopupSlideObj;
                let _clickedIndex = $(this).data("index");
    
                //갈수있는 슬라이드가 남아있는지 체크
                if (slideObj) {
                    slideObj.slideToLoop(Number(_clickedIndex), 1000, true)
                }
    
                //선택한 슬라이드에 active
                self.addActiveClass(_clickedIndex);
                self.requestphotoPopupDetail(_clickedIndex);
            });
        },

        //클릭한애 active 클래스 주기
        addActiveClass(_index){
            const $area = $(".js__photoPopupSlider__area");
            if (!$area) return ;
    
            $area.find(".swiper-slide").removeClass("active");
            $area.find(".swiper-slide").eq(_index).addClass("active");
        },

        //리뷰상세 포토 슬라이드
        requestphotoPopupDetail(_index) {
            //api연동 필요 
    
            const $area = $(".js__photoDetail__area");
            const $slides = $area.find(".swiper-slide");
            const minLength = 1;
    
            if (!canMakeSlider($slides, minLength)) return ;
    
            $area.find(".js__slider__nav").addClass("show");
            
            new Swiper('.js__photoDetail__area .swiper-container', {
                pagination: {
                    el: '.selectReview__pagination',
                    type: 'fraction',
                },
                navigation: {
                    prevEl: '.selectReview__button--prev',
                    nextEl: '.selectReview__button--next',
                },
            });
        }
    }

    const init = () => {
        photoSlider();
        layerEvents(); //팝업 오픈
        fnPopupPhoto.changeReview();
    }
    
    init();
}

export default photoReview;