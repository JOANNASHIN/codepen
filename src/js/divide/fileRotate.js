const fileRotate = () => {
    const $document = $(document);

    const rotateBase64Image = (base64ImageSrc) => {
        let canvas = document.createElement("canvas");
        let img = new Image();
        img.src = base64ImageSrc;
        canvas.width = img.width;
        canvas.height = img.width; //img.height;
        var context = canvas.getContext("2d");
        context.translate(img.width * 0.5, img.height * 0.5);
        context.rotate(0.5 * Math.PI);
        context.translate(-img.height * 0.5, -img.width * 0.5);
        context.drawImage(img, 0, 0); 

        // canvas.toDataURL();

        return canvas.toDataURL();
    }

    const imaegRotate = () => {
        $document.on("click", ".form__file__rotate", function () {
            const $this = $(this);
            const $image = $this.closest(".js__file__area").find(".js__file__image");
            const _src = $image.attr("src");

            const rotateSrc = rotateBase64Image(_src);
            $image.attr("src", rotateSrc);

            return false;
        })
    }

    const fileRead = (input) => {
		if (input.files && input.files[0]) {
			const reader = new FileReader();
            const $image = $(input).closest(".js__file__area").find(".js__file__image");
		
			reader.onload = function(e) {
				$image.attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
	}

    const fileUpload = () => {
        $document.on("change", ".js__file__input", function () {
            const $this = $(this);
			const $image = $this.closest(".js__file__area").find(".js__file__preview");
			const _fileType = this.files[0].type.toLowerCase().match("jpg|jpeg|gif|png");
			
			// 파일형식 맞지 않을 때
			if ( _fileType == null ) {
				alert("This is not image file format(only gif, png, jpg, jpeg available to upload)");
				$image.removeClass("show");
				$this.val("");
			} 
			// 성공
			else {
				$image.addClass("show");
				fileRead(this);
			}
        })
    }

    const fileRemove = () => {
        $document.on("click", ".js__file__remove", function () {
            const $this = $(this);
            const $fileBox = $this.closest(".js__file__area");

            $fileBox.find("input[type=file]").val();
            $fileBox.find(".js__file__preview").removeClass("show");

            return false;
        })
    }
  
    const init = () => {
        fileUpload();
        fileRemove();
        imaegRotate();
    }

    init();
}

export default fileRotate;