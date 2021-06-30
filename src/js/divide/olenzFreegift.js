/**
 * validation 체크
 * 1. 사은품 선택 했는데 도수 선택 안했을 때
 * 2. 사은품 개수가 2개 초과시
 * 3. 옵션선택 안했을 시
 * 
 * 이벤트
 * 1. checkbox클릭 시 수량 1
 * 2. checkbox해제 시 수량 0
 * 3. 수량 조절 시 0되면 checkbox 해제
 * 4. 수량 조절 시 1이상 되면 checkbox 클릭
 * 
 * 5. 선택할때마다 상단 카운트 올라가기
 * 6. 선택된 개수가 2개 이상시 alert (마지막으로 클릭한애만 초기화)
 * 7. 선택된건 기억해서 레이어팝업 다시 열어도 체크되기
 * 
 * 
 * 확인필요
 * DEFAULT는 한개 선택된 상태인지 아무것도 안선택된건지 > 아무것도 ㄴㄴㄴ
 * 이것저것 선택 후 Not for this time 누르면 체크 모두 해제 (확인필요) ㅇ
 * Not for this time 클릭 시 아무 confirm 없이 그냥 닫으면 되는지 ㅇ
 * 가운데 숫자는 readonly로 처리해도될지 ㅇ
 * 
 * 
 * 
 * 
 * **complete 누를때 두개이하로 선택했는지 확인하기
 * not this time 할때 다 noselect하는지 확인하기
 * 선택한거 나오게 하기
 * complete 선택 시 eyepow 값 선택했는지 확인해보기
*/
const olenzFreegift = () => {
    const $document = $(document);
    const $body = $("body");
    let isSelected = false;

    const freegift = {
        changeCount() {
            const _this = this;

            $document
                //체크박스 이벤트
                .on("change", ".js__selectgift__checkbox", function () {
                    const $this = $(this);
                    const _isChecked = $this.is(":checked");
                    const $targetBox = $this.closest(".js__selectgift__each");
                    const $count = $targetBox.find(".js__selectgift__count");
                    const $eyepowSelect = $targetBox.find(".js__selectgift__eye");
                    
                    if (_isChecked) { //체크
                        if ($count.val() == 0) {
                            $targetBox.find(".js__selectgift__count").val(1);
                        } 
                    }
                    else { //체크해제
                        $eyepowSelect.val("")
                        $targetBox.find(".js__selectgift__count").val(0);
                    }

                    _this.checkCountValidate($count);
                })

                //수량조절 버튼 이벤트
                .on("click", ".js__selectgift__spinner", function () {
                    const $this = $(this);
                    const $targetBox = $this.closest(".js__selectgift__each");
                    const $count = $targetBox.find(".js__selectgift__count");
                    const _count = Number($count.val());

                    if ($this.data("action") == "minus") {
                        $count.val(_count > 0 ? (_count - 1) : 0);
                    } 
                    else {
                        $count.val(_count + 1);
                    }

                    // 수량에 따라 체크박스 컨트롤
                    if ($count.val() > 0) $targetBox.find(".js__selectgift__checkbox").prop("checked", true);
                    else $targetBox.find(".js__selectgift__checkbox").prop("checked", false);

                    _this.checkCountValidate($count);
                })
        },

        checkCountValidate($count) {
            let total = this.calculateCount();
            const $targetBox = $count.closest(".js__selectgift__each");

            if (total > 2) {
                total = 2;
                alert("2개 이상 고르셨습니다.")
                $count.val(Number($count.val() - 1));

                if ($count.val() == 0) $targetBox.find(".js__selectgift__checkbox").prop("checked", false);
            }

            $(".js__selectgift__selected").html(total);
        },

        calculateCount() {
            let total = 0;

            $(".js__selectgift__count").each(function (idx, obj) {
                total += Number($(obj).val());
            })

            return total;
        },

        selectDone() {
            const _this = this;
            $document
                //선택안함
                .on("click", ".js__selectgift__noselect", function () {
                    isSelected = "nothing";
                    const $allCheckbox = $(".js__selectgift__checkbox");
                    
                    $allCheckbox.each(function (idx, obj) {
                        $(obj).prop("checked", false);
                    })

                    $allCheckbox.trigger("change")

                    _this.selectLayerClose();
                })
                //선택완료
                .on("click", ".js__selectgift__complete", function () {
                    // isSelected = "selected";
                    if (_this.checkValidation()) _this.selectLayerClose();
                })
        },

        checkValidation() {
            let total = 0;

            $(".js__selectgift__checkbox").each(function (idx, obj) {
                const $this = $(obj);

                if ($this.is(":checked") 
                    && $this.closest(".js__selectgift__each").find(".js__selectgift__eye").val() == ""
                ) {
                    alert("선택한 옵션의 도수를 선택하여주세요.")
                    return false;
                }

                total += Number($(obj).val());
            })

             if (total > 2) {
                return false;
            }

            return true;
        },

        selectLayerClose() {
            const $layer = $("#js__selectgift");
            const $selectYet = $(".js__selectgift__yet");
            const $selectNothing = $(".js__selectgift__nothing");
    
            $layer.removeClass("show");
            $body.removeClass("scroll--lock");
     
            if (isSelected == "nothing") {
                $selectYet.removeClass("show");
                $selectNothing.addClass("show");
            }
            else if (isSelected == "selected") {
                $selectYet.removeClass("show");
                $selectNothing.removeClass("show");
            }
        },

        run() {
            this.changeCount();
            this.selectDone();
        }
    };

    const test = () => {
        const aList = [1, 4, 8, 10];
        const bList = [5, 5, 5, 5];
        const cList = [10, 10, 10, 10];
        const dList = [10, 10, 10, 20];
        let height = 3;
        
        cList.filter(a => {
            dList.filter(b => {
                console.log("a, b",a, b, Math.abs(a - b))
                if (Math.abs(a - b) <= height) {
                    console.log("넘어갈수있다")
                }
            })
        })
    }

    const init = () => {
        freegift.run();
        test();
    }

    init();
}

export default olenzFreegift;