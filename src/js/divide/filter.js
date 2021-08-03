const popup_filter = () => {
    const $document = $(document);

    /**
     * 상세 필터 함수 (데이터 넘기기 및 이벤트)
     */
    // 선택한 filter 데이터 (초기화때문에 let 선언)
    let filterData = {
        "price": {},
        "categoryList": [],
        "brand": []
    };

    //uuid 찾기
    const getUuid = ($target) => {
        // return $target.attr("name") + $target.next().text() + $target.val();
        return $target.attr("name") + $target.val();
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

    // ajax 통신할 필터 데이터 가공
    const getFilterData = () => {
        return filterData;
    }

    // ajax 통신할 필터 데이터 가공
    const getSearchProductParameter = () => {
        const {brand, categoryList, price} = filterData;

        const brandParameter = [];
        const categoryParameter = [];

        //브랜드
        if (brand && brand.length) {
            brand.map(value => {
                brandParameter.push(value.id);
            })
        }

        //카테고리
        if (categoryList && categoryList.length) {
            categoryList.map(value => {
                categoryParameter.push(value.id);
            })
        }

        //최종 넘길 데이터 파라미터
        const returnCustomFilterData = {
            filterBrands: brandParameter.join(','),
            filterCid: categoryParameter.join(','),
            filterText: "",
            hPrice: price.hprice ? price.hprice : 0,
            lPrice: price.lprice ? price.lprice : 0,
            filterEqual: $("#filterEqual").val(),
            filterNonEqual: $("#filterNonEqual").val()
        };

        return returnCustomFilterData;
    }

    //API연동
    const requestSearchProduct = () => {
        const parameter = getSearchProductParameter();
        
        return ;
        $.ajax(
            common.util.getApiControllerUrl('getProductList', 'diquest'),
            parameter,
            function ($form1) {
                return true;
            },
            function (response) {
                if (response) {
                    $('#devSearchTotal').text(response.total);
                }
            }
        );
    }

    // chip추가 및 데이터 추가
    const addToChipList = (type, data, _isPriceAll, _forWebDebugging) => {
        const $selectedList = $(`.js__chip__${type}`);
        
        const _template = `
            <div class="selected__tag js__selected__tag" data-type="${type}" data-uuid="${data.uuid}">
                <span class="selected__tag__name js__selected__tagName">${data.name}</span>
                <button class="selected__tag__delete js__selected__delete">삭제</button>
            </div>
        `;

        if (type === "filterPrice") {
                     
            filterData.price = data;

            //전체 선택시
            if (_isPriceAll) $selectedList.html("");
            //값 선택 시
            else $selectedList.html(_template);
        }

        else if (type === "filterCategory") {
            const categoryData = filterData.categoryList;

            // 1뎁스 선택 시 서브 카테고리 개별 추가
            if (data.depth == "01") {
                const $subCategoryList = $(`[data-parent-cid=${data.id}]`);

                //선택된 1뎁스의 서브 카테고리들
                $subCategoryList.each((idx, el) => {
                    const $sub = $(el);
                    
                    const subdata = {
                        depth: $sub.data("depth"),
                        parentCid: $sub.data("parent-cid"),
                        name: $sub.next().text(),
                        id: $sub.val(),
                        uuid: getUuid($sub)
                    };

                    const _isSubAlreadyAdded = categoryData.filter(v => {
                        return v.uuid == subdata.uuid;
                    });

                    if (_isSubAlreadyAdded.length == 0) {
                        addToChipList("filterCategory", subdata);
                    }
                })
            }

            const _isAlreadyAdded = categoryData.filter(v => v.uuid === data.uuid); //이미 추가된 데이터인지 확인

            if (_isAlreadyAdded.length == 0) {
                categoryData.push(data);

                if (data.depth != "01") $selectedList.append(_template);
            }

            //웹 디버깅용
            if (_forWebDebugging) {
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

    // 하단 칩 삭제클릭 (실제 데이터와 칩 삭제는 removeChipData)
    const removeChip = () => {
        $document.on("click", ".js__selected__delete", function () {
            const $this = $(this);
            const $tag = $this.closest(".js__selected__tag");

            const tagData = {
                type: $tag.data("type"),
                label: $tag.find(".js__selected__tagName").text(),
                uuid: $tag.data("uuid")
            }
            
            //칩 삭제
            removeChipData($tag, tagData);

            //api 재 요청
            requestSearchProduct();
        });
    }

    // 필터 선택 (CHANGE)
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

            //가격 선택
            if (thisData.type === "filterPrice") {
                //직접입력은 직접입력적용버튼 누를 때 처리
                if ( thisData.value == "self") return ;

                const _isPriceAll = thisData.value == "all" ? true : false;

                sendData = {
                    type: thisData.value,
                    lprice: $this.data("hprice"),
                    hprice: $this.data("lprice"),
                    name: thisData.label,
                    uuid: thisData.uuid
                };

                addToChipList(thisData.type, sendData, _isPriceAll);
            }
            
            //카테고리 선택
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

            //브랜드 선택
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

            //api요청
            requestSearchProduct();
        })
    }

    // 필터 적용버튼
    const filterApply = () => {
        $document.on("click", ".js__filter__apply", function () {
            window.localStorage.removeItem("filterData");
            window.localStorage.setItem("filterData", JSON.stringify(filterData));
    
            console.log("filterData::", filterData);
        });
    }

    // 가격 직접입력 적용
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

                //칩 추가
                addToChipList("filterPrice", data);

                //api요청
                requestSearchProduct();
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

            requestSearchProduct();
            return false;
        });
    }

    // 이전 데이터 있을 시 (* chip, 데이터 추가는 addToChipList에서 넣어줌 *)
    const importBeforeData = (beforeDataString, _forWebDebugging) => {
        const beforeData = JSON.parse(window.localStorage.getItem("filterData"));
        if (!beforeData) return ;
        
        const {price, categoryList, brand} = beforeData;

        const $priceArea = $(".js__filter__price");
        const $categoryArea = $(".js__filter__category");
        const $brandArea = $(".js__filter__brand");
        const $self = $(".js__filter__self");
        
        //가격데이터 insert
        if (price && Object.keys(price).length) {
            $priceArea.find(`[value=${price.type}]`).prop("checked", true);

            if (price.type == "self") {
                $self.addClass("show");

                $("[name=filterPriceFrom]").val(price.lprice);
                $("[name=filterPriceTo]").val(price.hprice);
            }

            //uuid 생성
            Object.assign(price, {
                uuid: `filterPrice${price.type}`
            })

            addToChipList("filterPrice", price)
        }

        //카테고리데이터 insert
        if (categoryList && categoryList.length) {

            categoryList.forEach(category => {
                const _cid = category.id;
                //해당 카테고리 찾아서 체크 TRUE
                const $selectedCategory = $categoryArea.find(`[value=${_cid}]`);
                $selectedCategory.prop("checked", true);
                
                // 2뎁스 선택시 1뎁스 메뉴 열기
                // $selectedCategory.closest(".js__custom__details").attr("open", true);
                
                //추가로 필요한 데이터 생성
                Object.assign(category, {
                    depth: /(0){9}$/.test(_cid) ? "01" : "02", // 0이 9개면 뎁스 1, 아니면 뎁스 2
                    uuid: `filterCategory${_cid}`
                })

                addToChipList("filterCategory", category, "", _forWebDebugging)
            })
        }

        //브랜드데이터 insert
        if (brand && brand.length) {
            brand.forEach(v => {
                $brandArea.find(`[value=${v.id}]`).prop("checked", true);
                
                //uuid 생성
                Object.assign(v, {
                    uuid: `filterBrand${v.id}`
                })

                addToChipList("filterBrand", v)
            })
        }
    }

    // 직접입력 버튼 클릭 시 (아래 영역 활성화)
    const selfWritePrice = () => {
        $document.on("change.self", "[name=filterPrice]", function () {
            const _value = $(this).val();
            const $self = $(".js__filter__self");

            if (_value == "self") $self.addClass("show");
            else $self.removeClass("show");
        })
    }

    // 가격 직접 입력 시 콤마 단위 적용
    const LocaleString = () => {
        $document
            .on("input", ".js__input__price", function () {
                const $this = $(this);
                const _value = $this.val();
                
                let _customValue = _value.replace(/[^0-9]/g, "");
                $this.val(Number(_customValue).toLocaleString('ko-KR'));
            })
    }

    // 브랜드 탭, 슬라이드 관련
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

    // 카테고리 더보기 이벤트
    const categoryMore = () => {
        $document.on("click", ".js__category__more", function () {
            const $this = $(this);
            const _pageCount = $this.data("page-count") ? $this.data("page-count") : 5; //한번에 불러올 페이지 수 (디폴트 5개)
            const $categorys = $(".js__category__list"); //전체 카테고리
            const _lastIndex = $(".js__category__list.show").length; //현재 보여지는 카테고리 개수
            
            //5개씩 불러오기 (한번에 불러올 개수는 html에서 수정하도록 처리 data-page-count)
            for (let i = _lastIndex; i < _lastIndex + _pageCount; i++) {
                $categorys.eq(i).addClass("show");
            }
            
            //마지막일때 더보기버튼 비노출 처리
            if ($categorys.length <= _lastIndex + _pageCount) {
                $this.addClass("hide");
            }
        })
    }

    const init = () => {
        window.addToChipList = addToChipList;
        window.getFilterData = getFilterData;
        window.importBeforeData = importBeforeData;
        window.requestSearchProduct = requestSearchProduct;
        
        /**
         * 필터 관련함수 실행
         * 
         * searchText와 beforeFilterData는 filter.htm에서 개발에서 넣어줌
         */
        selectFilter(); //필터 선택시
        removeChip(); //칩 삭제
        priceSelfApply(); //가격 직접입력
        filterReset(); //필터초기화
        filterApply(); //필터 적용

        //ajax 연동관련
        importBeforeData(); //이전 데이터 있을 경우
        requestSearchProduct(); //적용 옆 숫자

        //기타
        selfWritePrice();
        LocaleString();
        filterBrand();
        categoryMore();
    }

    init();
}

export default popup_filter;