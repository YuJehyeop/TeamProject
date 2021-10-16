//변수 추가
let sel_files2 = [];

function clickPlaceMarker(_title, _address, _lat, _lng) {
    console.log("클릭마커 동작")
    $.ajax({
        type: "GET",
        url: `/api/place?title=${_title}`,
        data: {},
        success: function (response) {
            let place_info = response['place-info']
            console.dir(place_info)

            $('#info-place-name').text(_title)
            $('#info-place-address').text(_address)
            $('#info-place-rating').text(`${place_info['rating']} 점 / 5.0 점`)
            $('#info-place-review-count').text(`리뷰 ${place_info['review_count']}건`)
            $('#info-place-enter-amount').text(`리뷰어 ${place_info['enter_amount']}%가 이 가게에 출입함`)


            $('#info-place-lat').val(_lat)
            $('#info-place-lng').val(_lng)

            $('#place-info').show()
            $('#place-list').hide()

            showReview()
            loadReview(_title, _address, 1)
            loadPhoto(_title, _address)

        }
    })

}

function loadReview(_title, _address, _currentPage) {
    user_id = "manijang3"
    $.ajax({
        type: "GET",
        url: `/api/review/pagination?title=${_title}&address=${_address}&page=${_currentPage}&user_id=${user_id}`,
        data: {},
        success: function (response) {
            $('#review-list').empty()
            $('#review-pagination-ul').empty()

            let temp_html = ''
            let review_list = response['review-list']
            for (let i = 0; i < review_list.length; i++) {
                if (review_list[i]['user_id'] == user_id) {
                    temp_html = `<hr/>
                            <div class="row">
                                <div class="col-sm-3">${review_list[i]['user_id']}</div>
                                <div class="col-sm-8">
                                    ${review_list[i]['review']} <i class="fas fa-trash-alt" onclick="deleteReview('${_title}', '${_address}', '${user_id}')"></i>
                                </div>
                            </div>`
                } else {
                    temp_html = `<hr/>
                            <div class="row">
                                <div class="col-sm-3">${review_list[i]['user_id']}</div>
                                <div class="col-sm-8">
                                    ${review_list[i]['review']}
                                </div>
                            </div>`
                }

                $('#review-list').append(temp_html)
            }


            ////////////////////////////////////////////////////////////////////////////////////////////////////////


            // 한 화면에 보여줄 페이지 수
            const pageBlock = 3;
            // 한 페이지에 보여줄 리뷰 수
            const pageSize = 3;
            const review_tot = response['count']

            if (review_tot > 0) {
                let pageTotCount = 0
                if (review_tot % pageSize == 0) {
                    pageTotCount = review_tot / pageSize
                } else {
                    pageTotCount = review_tot / pageSize + 1
                }

                const startPage = parseInt((_currentPage - 1) / pageBlock) * pageBlock + 1
                let endPage = startPage + pageBlock - 1;
                if (endPage > pageTotCount) {
                    endPage = pageTotCount;
                }

                if (startPage > pageBlock) {
                    $('#review-pagination-ul').append(`<li class="page-item"><a class="page-link" style="cursor:pointer; color: #5cb85c; font-weight: normal;" onclick="loadReview('${_title}', '${_address}', '${startPage - pageBlock}')">Previous</a></li>`)
                    // <a href="list.jsp?pageNum=<%=startPage - 10%>">[이전]</a>
                }

                for (let i = startPage; i <= endPage; i++) {
                    if (i == _currentPage) {
                        $('#review-pagination-ul').append(`<li class="page-item"><a class="page-link" style="cursor:pointer; color: #5cb85c; font-weight: normal;">${i}</a></li>`)
                    } else {
                        $('#review-pagination-ul').append(`<li class="page-item"><a class="page-link" style="cursor:pointer; color: #5cb85c; font-weight: normal;" onclick="loadReview('${_title}', '${_address}', '${i}')">${i}</a></li>`)
                    }
                }

                if (endPage < pageTotCount) { // 현재 블록의 마지막 페이지보다 페이지 전체 블록수가 클경우 다음 링크 생성
                    // <a href="list.jsp?pageNum=<%=startPage + 10 %>">[다음]</a>
                    $('#review-pagination-ul').append(`<li class="page-item"><a class="page-link" style="cursor:pointer; color: #5cb85c; font-weight: normal;" onclick="loadReview('${_title}', '${_address}', '${startPage + pageBlock}')">Next</a></li>`)
                }
            }
        }
    })
}

function loadPhoto(title, address){
    console.log("사진 업로드 동작")
    $.ajax({
        type: "GET",
        url: `/fileUpload/photo?title=${title}&address=${address}`,
        data: {},
        success: function (response) {
            console.log("사진 가져오기 동작1")
            $('#post_photo2').empty()
            let photo = response['latlng_photos2']
            for (let i=0; i < photo.length; i++) {
                console.log("사진 가져오기 동작2")
                let filename = photo[i]['filenames']
                let temp_html = `<div class="col-md-4">
                                        <div class="thumbnail">
                                            <a href="">
                                                <img src="../static/load_img/${filename}" alt="Lights" style="width:100%">
                                            </a>
                                        </div>
                                    </div>`
                $('#post_photo2').append(temp_html)
            }
        }
    });
}



function showReview() {
    $('#place-review-info').show();
    $('#place-photo-info').hide();
}

function showPhoto() {
    $('#place-review-info').hide();
    $('#place-photo-info').show();
}

function registerReview() {
    let _enter_with_check = $('#enter-with-check').is(':checked')
    let _rating = $("#review-rating-radio option:selected").val()
    let _review_content = $('#review-content').val()
    let _lat = $('#info-place-lat').val();
    let _lng = $('#info-place-lng').val();
    let _user_id = 'manijang2'
    let _title = $('#info-place-name').text()
    let _address = $('#info-place-address').text()

    $.ajax({
        type: "POST",
        url: `/api/review`,
        data: {
            user_id: _user_id,
            enter_with_check: _enter_with_check,
            rating: _rating,
            review: _review_content,
            lat: _lat,
            lng: _lng,
            title: _title,
            address: _address
        },
        success: function (response) {
            alert(response['msg'])
            window.location.reload() // 새로고침
        }
    })
}

function deleteReview(_title, _address, _user_id) {
    $.ajax({
        type: "DELETE",
        url: `/api/review`,
        data: {
            user_id: _user_id,
            title: _title,
            address: _address
        },
        success: function (response) {
            alert(response['msg'])
            window.location.reload() // 새로고침
        }
    })
}

// 추가
//선택 이미지 미리보기
function handleImgsFilesSelect2(e){
    sel_files2 = [];
    $(".row2").empty();

    let files = e.target.files;
    let filesArr = Array.prototype.slice.call(files);

    let index = 0;
    filesArr.forEach(function (f){
        if(!f.type.match("image.*")) {
            alert("확장자는 이미지 확장자만 가능합니다.")
            return;
        }
        sel_files2.push(f);

        let reader = new FileReader();
        reader.onload = function(e){
            let html = "<div class=\"col-md-4\"  id=\"img2_id_"+index+"\">\n" +
                "          <div class=\"thumbnail\">\n" +
                "              <a href=\"javascript:void(0);\" data-toggle=\"modal\" data-target=\"#exampleModalLong\" >\n" +
                "                   <img src=\""+e.target.result + "\" data-file='"+f.name+"'  class=\"imgaa\" style=\"width:130px; height: 80px; \">\n" +
                "              </a>\n" +
                "              <button class=\"delete-box\" onclick=\"deleteImageAction2("+index+")\"><a>삭제</a></button>\n" +
                "          </div>\n" +
                "       </div>"
            // let html = "<a href=\"javascript:void(0);\" onclick=\"deleteImageAction2("+index+")\" id=\"img2_id_"+index+"\"><span class=\"image-card\"><img src=\""+e.target.result + "\" data-file='"+f.name+"' class='sleProductFile' title='Click to remove'></span>";
            $(".row2").append(html);
            index++;
        }
        reader.readAsDataURL(f);
    })
}

// 미리보기 클릭시 삭제
function deleteImageAction2(index){
    sel_files2.splice(index,1);
    let img2_id = "#img2_id_"+ index;
    $(img2_id).remove();
}

// 수정전
// function aa() {
//     alert('123')
//     let formData = new FormData($('#fileForm')[0]);
//
//     title = $('#info-place-name').text()
//     address = $('#info-place-address').text()
//
//     formData.append("title", title)
//     formData.append("address", address)
//
//     $.ajax({
//         type: "POST",
//         enctype: 'multipart/form-data',
//         url: `/fileUpload`,
//         data: formData,
//         processData: false,
//         contentType: false,
//         cache: false,
//         success: function (result) {
//             console.dir(result)
//             alert(result['msg'])
//         },
//         error: function (e) {
//             alert(e)
//         }
//     });
// }

// 수정중
function aa() {
    let formData = new FormData();
    // let formData = new FormData($('#fileForm')[0]);

    let title = $('#info-place-name').text()
    let address = $('#info-place-address').text()

    formData.append("title", title)
    formData.append("address", address)

    console.log("파일 업로드 동작")

    for (let i=0; i < sel_files2.length; i++) {
        formData.append("file_give", sel_files2[i])
    }

    $.ajax({
        type: "POST",
        url: `/fileUpload`,
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}


function search_place() {
    $("#hello").hide() // 추천목록 숨기기
}