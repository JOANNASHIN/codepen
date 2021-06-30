const popup_filter = () => {
    const $document = $(document);

    const filter = () => {
        // filter 데이터
        let filterData = {
            "price": {},
            "categoryList": [],
            "brand": []
        };

        //uuid 찾기
        const getUuid = ($target) => {
            return $target.attr("name") + $target.next().text() + $target.val();
        }

        // 하단에 맞는 칩 찾기
        const getMatchChip = (type, uuid) => {
            const $chipList = $(`.js__chip__${type}`).find(".js__selected__tag");
            
            
            let $chip = null;
            
            //해당 태그 찾기
            $chipList.each((idx, el) => {
                const $this = $(el);
                const _uuid = $this.data("uuid");

                if (_uuid == uuid) {
                    $chip = $this;

                    return false;
                }
            })
            
            return $chip;
        }

        // chip추가 및 데이터 추가
        const addToChipList = (type, data) => {
            const $selectedList = $(`.js__chip__${type}`);
            
            const _template = `
                <div class="selected__tag js__selected__tag" data-type="${type}" data-uuid="${data.uuid}">
                    <span class="selected__tag__name js__selected__tagName">${data.name}</span>
                    <button class="selected__tag__delete js__selected__delete">삭제</button>
                </div>
            `;

            if (type === "filterPrice") {
                const _isEmptyObj = Object.keys(data).length;
                
                filterData.price = data;

                //전체 선택시
                if (_isEmptyObj === 0) $selectedList.html("");
                //값 선택 시
                else $selectedList.html(_template);
            }

            else if (type === "filterCategory") {
                // 1뎁스 선택 시 서브 카테고리 개별 추가
                if (data.depth == "01") {
                    const $subCategoryList = $(`[data-parent-cid=${data.id}]`);

                    //선택된 1뎁스의 서브 카테고리들
                    $subCategoryList.each((idx, el) => {
                        const $sub = $(el);
                        
                        const _subtype = $sub.attr("name");
                        
                        const subdata = {
                            depth: $sub.data("depth"),
                            parentCid: $sub.data("parent-cid"),
                            name: $sub.next().text(),
                            id: $sub.val(),
                            uuid: getUuid($sub)
                        };

                        const _isSubAlreadyAdded = filterData.categoryList.filter(v => {
                            return v.uuid == subdata.uuid;
                        });

                        if (_isSubAlreadyAdded.length == 0) {
                            addToChipList(_subtype, subdata);
                        }
                    })
                }

                const categoryData = filterData.categoryList;
                const _isAlreadyAdded = categoryData.filter(v => v.uuid === data.uuid); //이미 추가된 데이터인지 확인

                if (_isAlreadyAdded.length == 0) {
                    categoryData.push(data);

                    if (data.depth != "01") $selectedList.append(_template);
                }
            }

            else if (type === "filterBrand") {
                const brandData = filterData.brand;
                const _isAlreadyAdded = brandData.filter(v => v.uuid == data.uuid);

                if (!_isAlreadyAdded.length) {
                    brandData.push(data);
                    $selectedList.append(_template);
                }
            }
            
            // console.log("추가된 filter:::::::::", filterData);
        }

        // 칩 삭제 및 데이터 삭제
        const removeChipData = ($chip, tagData) => {
            
            //칩 삭제
            if ($chip != null && $chip.length) $chip.remove();

            //가격 데이터 삭제
            if (tagData.type == "filterPrice") {
                const $self = $(".js__filter__self");

                filterData.price = {};

                $("[name=filterPrice]").eq(0).prop("checked", true);
                $self.removeClass("show");
            }

            //카테고리 데이터 삭제
            else if (tagData.type == "filterCategory") {
                const categoryData = filterData.categoryList;
                let _index = null;
                let _parentindex = null;
                let _isSubCategory = false;
                let _parentCid = null;

                //해당 카테고리 인덱스 도출
                categoryData.forEach((v, idx) => {
                    if (v.uuid == tagData.uuid) {
                        _index = idx;
                        _isSubCategory = v.depth == "01" ? false : true;
                        _parentCid = v.parentCid;

                        return false;
                    }
                });

                //해당 카테고리 데이터 삭제
                if (_index != null) categoryData.splice(_index, 1);

                //해당 카테고리 체크 해제 (x버튼으로 접근 시에)
                $("[name=filterCategory]").each((idx, el) => {
                    const $category = $(el);
                    const _uuid =  getUuid($category);

                    if (_uuid == tagData.uuid) {
                        $category.prop("checked", false);

                        return false;
                    }
                })

                // 부모 카테고리 체크 해제
                if (_isSubCategory) {
                    const $parentCategory = $(`input[value=${_parentCid}]`);
                    $parentCategory.prop("checked", false);
 
                    //부모 카테고리 데이터 삭제
                    categoryData.forEach((v, idx) => {
                        if (v.id == _parentCid) {
                            _parentindex = idx;

                            return false;
                        }
                    });

                    if (_parentindex != null) categoryData.splice(_parentindex, 1);
                }
            }

            //브랜드 데이터 삭제
            else if (tagData.type == "filterBrand") {
                const brandData = filterData.brand;
                let _index = null;
                
                //해당 브랜드 인덱스 도출
                brandData.forEach((v, idx) => {
                    if (v.uuid == tagData.uuid) {
                        _index = idx;

                        return false;
                    }
                });

                //해당 브랜드 데이터 삭제
                brandData.splice(_index, 1);

                //해당 브랜드 체크 해제
                $("[name=filterBrand]").each((idx, el) => {
                    const $brand = $(el);
                    const _uuid =  getUuid($brand);
                    
                    if (_uuid == tagData.uuid) {
                        $brand.prop("checked", false);

                        return false;
                    }
                })
            }

            // console.log("remove 후:::::::", filterData);
        }

        // 필터 선택
        const selectFilter = () => {
            $document.on("change", ".js__filter__form input", function () {
                const $this = $(this);
                const thisData = {
                    type: $this.attr("name"),
                    value: $this.val(),
                    label: $this.next().text(),
                    uuid: getUuid($this)
                }
                
                let sendData = null;

                //가격
                if (thisData.type === "filterPrice") {
                    if ( thisData.value == "self") return ;

                    if (thisData.value == "all") {
                        sendData = {};
                    }
                    else {
                        sendData = {
                            type: thisData.value,
                            lprice: null,
                            hprice: null,
                            name: thisData.label,
                            uuid: thisData.uuid
                        };
                    }

                    addToChipList(thisData.type, sendData);
                }
                
                //카테고리
                else if (thisData.type === "filterCategory") {
                    const _depth = $this.data("depth");

                    sendData = {
                        depth: _depth,
                        id: thisData.value,
                        name: thisData.label,
                        uuid: thisData.uuid,
                    };

                    
                    if ($this.is(":checked")) { //체크박스 선택 시
                        addToChipList(thisData.type, sendData);
                    }

                    else { //체크박스 선택 해제 시
                        if (_depth == "01") {
                            const $subCategoryList = $(`[data-parent-cid=${thisData.value}]`);
                            const $chip = getMatchChip(thisData.type, thisData.uuid);
                            
                            removeChipData($chip, sendData);

                            //2뎁스 모두 해제
                            $subCategoryList.each((idx, el) => {
                                const $sub = $(el);
                                const _subtype = $sub.attr("name");
                                const _subname = $sub.next().text();
                                const _subuuid = getUuid($sub);

                                const $chip = getMatchChip(_subtype, _subuuid);

                                if ($chip && $chip.length) {
                                    const tagData = {
                                        depth: _depth,
                                        parentCid: $chip.data("parent-cid"),
                                        type: _subtype,
                                        label: _subname,
                                        uuid: _subuuid
                                    }

                                    removeChipData($chip, tagData);
                                }
                            })
                        }

                        else {
                            const $chip = getMatchChip(thisData.type, thisData.uuid);
                            
                            //chip삭제 및 데이터 삭제
                            if ($chip && $chip.length) {
                                const tagData = {
                                    depth: _depth,
                                    type: thisData.type,
                                    label: thisData.label,
                                    uuid: thisData.uuid
                                }

                                removeChipData($chip, tagData);
                            }
                        }
                    }
                }   

                //브랜드
                else if (thisData.type === "filterBrand") {
                    sendData = {
                        id: thisData.value,
                        name: thisData.label,
                        uuid: thisData.uuid,
                    };

                    if ($this.is(":checked")) { //체크박스 선택 시
                        addToChipList(thisData.type, sendData);
                    }
                    else { //체크박스 선택 해제 시
                        const $tag = getMatchChip(thisData.type, thisData.uuid);
                            
                        //chip삭제 및 데이터 삭제
                        if ($tag && $tag.length) {
                            const tagData = {
                                type: thisData.type,
                                label: thisData.label,
                                uuid: thisData.uuid
                            }

                            removeChipData($tag, tagData);
                        }
                    }
                }
            })
        }

        // 하단 태그 삭제
        const removeChip = () => {
            $document.on("click", ".js__selected__delete", function () {
                const $this = $(this);
                const $tag = $this.closest(".js__selected__tag");

                const tagData = {
                    type: $tag.data("type"),
                    label: $tag.find(".js__selected__tagName").text(),
                    uuid: $tag.data("uuid")
                }
                
                removeChipData($tag, tagData);
            });
        }
        
        // 가격 직접입력
        const priceSelfApply = () => {
            $document.on("click", ".js__self__apply", function () {
                    const _from = $("[name=filterPriceFrom]").val();
                    const _to = $("[name=filterPriceTo]").val();
                    const _fromNumber = Number(_from.replace(/[,]/g, ""));
                    const _toNumber = Number(_to.replace(/[,]/g, ""));
                    let data = null;

                    if (_toNumber - _fromNumber < 0) {
                        alert("입력하신 가격을 확인해주세요.");
                        return ;
                    }
                    
                    data = {
                        type: "self", //직접입력
                        lprice: _fromNumber,
                        hprice: _toNumber,
                        name: `${_from}원 ~ ${_to}원`
                    };

                    addToChipList("filterPrice", data);
            })
        }

        // 필터 초기화
        const filterReset = () => {
            $document.on("click", ".js__filter__reset", function () {
                const $self = $(".js__filter__self");
                const $brandMenu = $(".js__brand__menu");

                filterData = {
                    "price": {},
                    "categoryList": [],
                    "brand": []
                };

                //가격
                $(".js__chip__filterPrice").empty();
                $("[name=filterPrice]").prop("checked", false)
                $("[name=filterPrice]").eq(0).prop("checked", true);
                $self.removeClass("show").find("input").val("");
                
                //카테고리
                $(".js__chip__filterCategory").empty();
                $("[name=filterCategory]").prop("checked", false);
                $(".js__custom__details").removeAttr("open");
                
                //브랜드
                $(".js__chip__filterBrand").empty();
                $("[name=filterBrand]").prop("checked", false);
                $brandMenu.eq(0).trigger("click.brandTab");


                return false;
            });
        }

        // 필터 적용버튼
        const filterApply = () => {
            $document.on("click", ".js__filter__apply", function () {
                console.log("선택된 filterData", filterData);
                
                window.localStorage.removeItem("filterData");
                window.localStorage.setItem("filterData", JSON.stringify(filterData));
            });
        }

        const importBeforeData = () => {
            // @todo removeItem 해줘야함 (개별페이지에서 히스토리백이 아닌 새로들어왔을경우에만!!)
            const beforeData = JSON.parse(window.localStorage.getItem("filterData"));
            if (!beforeData) return ;

            console.log("beforedata...", beforeData)    

            const $priceArea = $(".js__filter__price");
            const $categoryArea = $(".js__filter__category");
            const $brandArea = $(".js__filter__brand");
            const $self = $(".js__filter__self");
            

            if (Object.keys(beforeData.price).length) {
                $priceArea.find(`[value=${beforeData.price.type}]`).prop("checked", true);

                if (beforeData.price.type == "self") {
                    $self.addClass("show");
                }

                $("[name=filterPriceFrom]").val(beforeData.price.lprice);
                $("[name=filterPriceTo]").val(beforeData.price.hprice);

                addToChipList("filterPrice", beforeData.price)
            }

            if (beforeData.categoryList && beforeData.categoryList.length) {
                beforeData.categoryList.forEach(v => {
                    const $selectedCategory = $categoryArea.find(`[value=${v.id}]`);
                    $selectedCategory.prop("checked", true);
                    $selectedCategory.closest(".js__custom__details").attr("open", true);

                    addToChipList("filterCategory", v)
                })

            }

            if (beforeData.brand && beforeData.brand.length) {
                beforeData.brand.forEach(v => {
                    $brandArea.find(`[value=${v.id}]`).prop("checked", true);
                    addToChipList("filterBrand", v)
                })
            }
        }

        const filterInit = () => {
            selectFilter();
            removeChip();
            priceSelfApply();
            filterReset();
            filterApply();
            importBeforeData();
        }
     
        filterInit();
    }

    const selfWritePrice = () => {
        $document.on("change.self", "[name=filterPrice]", function () {
            const _value = $(this).val();
            const $self = $(".js__filter__self");

            if (_value == "self") $self.addClass("show");
            else $self.removeClass("show");
        })
    }

    const LocaleString = () => {
        $document
            .on("input", ".js__input__price", function () {
                const $this = $(this);
                const _value = $this.val();
                
                let _customValue = _value.replace(/[^0-9]/g, "");
                $this.val(Number(_customValue).toLocaleString('ko-KR'));
            })
    }

    const filterBrand = () => {
        let brandSliderObj = null;

        const brandListTab = () => {
            $document.on("click.brandTab", ".js__brand__menu", function () {
                const $this = $(this);
                const _index = $this.index();
                const $cont = $(".js__brand__cont");
                const $targetCont = $cont.eq(_index);
    
                $this.addClass("active").siblings().removeClass("active");
    
                $cont.removeClass("show");
                $targetCont.addClass("show");

                if ($targetCont.length) {
                    brandListSlider($targetCont);
                }
    
                return false;
            })
        }
        
        const brandListSlider = ($area) => {
            if (!$area.length || !canMakeSlider($area, 1)) return ;
    
            if (brandSliderObj) brandSliderObj.destroy();
    
            brandSliderObj = new Swiper(".js__brand__cont.show .swiper-container", {
                loop: false,
                pagination: {
                    type: "bullets",
                    el: ".js__brand__cont.show .js__slider__nav",
                }
            })
        }

        const filterBrandInit = () => {
            const $area = $(".js__brand__cont.show");

            brandListSlider($area);
            brandListTab();
        }

        filterBrandInit();
    }

    const init = () => {
        filter();
        selfWritePrice();
        LocaleString();
        filterBrand();
    }

    init();
}

export default popup_filter;