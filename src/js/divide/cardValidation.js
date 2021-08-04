const cardValidation = () => {
    const $document = $(document);
    const isCheckBigger = (num) => {
        let count = 0;

        if (num < 10) {
            count += Number(num);
        } 
        else {
            const eachNum = String(num).split("");
            count += Number(eachNum[0]) + Number(eachNum[1]);
        }

        return count;
    }

    /**
     * 카드번호 유효성 검사
     * 카드번호는 꼭 String으로 넘어와야합니다.
     * @param {String} cardNum
     */
    const isPassSimpleCard = (cardNum) => {
        const cardNumber = cardNum.replace(/-/gi, "");
        const numArray = cardNumber.split("").reverse();
        let total = 0;
        let code = 0;

        // 마지막 숫자를 제외하고 거꾸로 2 1 순서로 곱하기
        numArray.forEach((n, idx) => {
            if (idx != 0) {

                if ( idx % 2 == 1) {
                    let doubleNumber = n * 2;
                    total += isCheckBigger(doubleNumber);
                } 
                else {
                    total += isCheckBigger(n);
                }
            }
        });

        //마지막 숫자
        const lastNum = String(total).split("")[String(total).length - 1];
        
        //검증코드
        code = lastNum == 0 ? 0 : code = 10 - lastNum;

        //검증결과 반환
        if (code == numArray[0]) return true;
        else return false;
    }

    const checkCard = () =>{ 
        $document.on("click", ".js__card__validation", function () {
            let cardNumber = "";
            let isNull = false;

            //cardNumber 로 시작하는 input값 가져와서 합치기
            $("input[name^=no]").each(function (idx, obj) {
                if (!$(obj).val()) {
                    isNull = true;
                    return false;
                }

                cardNumber += String($(obj).val());
            })

            if (isNull) {
                alert("카드번호를 정확하게 입력하여 주세요.");
                return ;
            }
            // 여기에 스트링 타입의 카드번호를 넣어주세요.
            const isPass = isPassSimpleCard(cardNumber);

            if (isPass) {
                alert("유효한 카드입니다.")
            }
            else {
                alert("유효하지 않은 카드번호입니다. 카드번호를 확인해주세요.")
            }
        })
    }

    const onlyNumber = () => {
        $document.on("input", "input[name^=no]", function () {
            const $this = $(this);
            const _value = $this.val();
            const numberReg = /[^0-9]/g;

            $this.val(_value.replace(numberReg, ""));
        })
    }

    const autoFocusToNext = () => {
        $document.on("keyup", "input[name^=no]", function () {
            const $this = $(this);
            const _value = $this.val();

            if (_value.length == 4) {
                const $next = $this.next();
                if ($next.length) $next.focus();
            }
        })
    }

    const init = () => {
        checkCard();
        onlyNumber();
        autoFocusToNext();
    }

    init();
}

export default cardValidation;