const contact = () => {
    const $document = $(document);

    $.fn.serializeObject = function() {
        let result = {};
        const extend = function(i, element) {
            const node = result[element.name]
            if ("undefined" !== typeof node && node !== null) {
                if ($.isArray(node)) {
                    node.push(element.value)
                } 
                else {
                    result[element.name] = [node, element.value]
                }
            } 
            else {
                result[element.name] = element.value
            }
        }
        
        $.each(this.serializeArray(), extend);
        return result;
    }

    const sendEmail = () => {
        $document.on("submit", ".js__contact__form", function () {
            console.log("서브밋")
            const data = $(this).serializeObject();

            for (let value of Object.values(data)) {
                if (!!!value) {
                    alert("필수 입력란을 확인해주세요.");
                    return false;
                }
            }
    
            requestEmailJs(data);

            return false;

        })
    };

    const requestEmailJs = (data) => { 
        const parameter = {
            SERVICE_ID: "service_ewx0f38",
            TEMPLATE_ID: "template_th1s929",
            API_KEY: "user_rd9DdB4KQe2PyiiUTxon5",
        }

        showLoading(true);

        emailjs
            .send (parameter.SERVICE_ID, parameter.TEMPLATE_ID, data, parameter.API_KEY)
            .then (
                function(response) {
                    showLoading(false);
                    alert("이메일을 보냈습니다! \n 곧 연락드리겠습니다. 감사합니다!");
                    window.location.reload();
                },

                function (error) {
                    console.error("Error", error)
                    showLoading(false);
                    alert("오류가 발생하였습니다.\n 잠시 후 다시 시도 부탁드립니다.");
                }
            )
    }

    const init = () => {
        sendEmail();
    }

    init();
}

export default contact;