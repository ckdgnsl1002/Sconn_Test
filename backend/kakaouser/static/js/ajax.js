// ajax용 CSRF토큰
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});



// 좋아요 ajax
$(document).ready(function(){
    $('#like_btn').click( function() {
    var post_pk = document.getElementById("post_pk").value;
    $.ajax({
        url: '/blog/like/',
        dataType:'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        type:'POST',
        data: {
            'post_pk': post_pk,
            'csrfmiddlewaretoken': getCookie('csrftoken')
        }, // post_id 라는 name으로 id 값 전송
        dataType: "json",
        success: function (response) { // ajax 통신이 정상적으로 완료되었을 때
            $('#like_count').html(response.like_count); //id가 like_count의 내용을 전송받은 좋아요 수로 바꾼다
            // $('#message').html(response.message); //id가 message의 내용을 전송받은 message로 바꾼다
            
            if (response.factor === true ) {
                $('#like_deactivated').hide();
                $('#like_activated').show();
                $('#heart_popup_full').fadeIn('200');
                $('#heart_popup_full').fadeOut( '800');
                
                
            } else {
                $('#like_activated').hide();
                $('#like_deactivated').show();
            }
        }
    });
})
});

// 스크랩 ajax
$(document).ready(function(){
$('#scrap_btn').click( function() {
    var post_pk = document.getElementById("post_pk").value;

    $.ajax({
        url: '/blog/scrap/',
        dataType:'json',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        type:'POST',
        data: {
            'post_pk': post_pk,
            'csrfmiddlewaretoken': getCookie('csrftoken')
        }, // post_id 라는 name으로 id 값 전송
        dataType: "json",
        success: function (response) { // ajax 통신이 정상적으로 완료되었을 때
            // $('#scrap_count').html(response.scrap_count); //id가 like_count의 내용을 전송받은 좋아요 수로 바꾼다
            // $('#message').html(response.message); //id가 message의 내용을 전송받은 message로 바꾼다
            
            if (response.scrap_factor === true ) {
                $('#scrap_deactivated').hide();
                $('#scrap_activated').show();
                $('#bookmark_popup_full').fadeIn('200');
                $('#bookmark_popup_full').fadeOut( '800');
                
            } else {
                $('#scrap_activated').hide();
                $('#scrap_deactivated').show();
            }
        }
    });
})
});







// 검색페이지 ajax
$(document).ready(function(){
    // 필요한 전역변수 정의
    // var post_list = document.getElementById("post_list").value;
    var genre_list = [];
    var city_list = [];
    var input_value = '';

    $('#category-select').click( function(){

        selected_category = $('#category-select option:selected').val();

        $.ajax({
            url: '/blog/searching_ajax/',
            dataType:'json',
            type:'GET',
            data: {
                // 'post_list': post_list,
                'selected_genre_list': genre_list,
                'selected_city_list' : city_list,
                'selected_category' : selected_category,
                'input_value': input_value,
                'see-all-genre-btn':false,
                'see-all-city-btn':false,
                'csrfmiddlewaretoken': getCookie('csrftoken'),
            },
            success: function (data) {
                context = $.parseJSON(data)
                var txt = '';
                $('#list_area').empty()
                $.each(context, function(index,item){
                    txt += '<div class="col-lg-4 col-md-6">'
                    txt += '<div class="card mb-4 border-dark" style="background-color: black;">'
                    if(item.head_image_url){
                        txt += '<a href="' + item.post_url + '"><img class="card-img-top" id="post-head-image" src="'+item.head_image_url+'" alt="head_image"/></a>'
                    }
                    txt+= '<div class="card-body">'
                    txt+= '<span class="float-right text-white">'
                    if (item.like_factor){
                        txt+='<i class="fas fa-heart" style="color: #FF0000;"></i>'
                    }
                    else {
                        txt+= '<i class="far fa-heart"></i>'
                    }
                    txt+=item.like_cnt + '&nbsp;'
                    txt+='<i class="fas fa-comment" style="color: whitesmoke;"></i>'
                    txt+=item.comment_cnt
                    txt+='&nbsp;'
                    txt+= '</span>'
                    txt+='<h4 class="card-title h4 text-white id="post-title">'+item.title+'</h2>'
                    txt+='<div class="small text-white" id="post-create-at">'+item.create_at+'<div class="float-right"> by <a href="'+item.profile_url+ '">' +item.author+ '</a></div></div>'
                    txt+='<p class="card-text mt-1 text-white" id="post-content">'+ item.content.slice(undefined, 40) +'... </p>'
                    // txt+='<hr style="background-color: #D5D5D5;">'
                    if(item.genre_list){
                        for (var i=0; i<item.genre_list.length; i++) {
                            txt+= '<span class="badge rounded-pill badge-warning float-left mr-1">' + item.genre_list[i] + '</span>'
                        }
                    }

                    if(item.city_list){
                        for (var i=0; i<item.city_list.length; i++){
                            txt+= '<span class="badge rounded-pill badge-secondary float-left mr-1 mb-2">' + item.city_list[i] + '</span>'
                        }
                    }

                    if (item.user_is_authenticated){
                        txt+='<a class="btn btn-dark float-right" href="'+ item.post_url +'">더보기 →</a>'
                    }
                    else{
                        txt+='<a class="btn btn-dark float-right" href="/account/signin/?next='+window.location.href+'">더보기 →</a>'
                    }
                            
                    txt+='</div></div></div>'




                });
                
                $('#list_area').append(txt)
                $('#result_cnt').html(context.length)
            }
        });
    });

    // 검색어가 입력될 때 마다 값을 불러오기
    $('#search-input').keyup( function() {
        // post_list = document.getElementById("post_list").value;
        input_value = document.getElementById('search-input').value;

        selected_category = $('#category-select option:selected').val();
        
        $.ajax({
            url: '/blog/searching_ajax/',
            dataType:'json',
            type:'GET',
            data: {
                // 'post_list': post_list,
                'selected_genre_list': genre_list,
                'selected_city_list' : city_list,
                'selected_category' : selected_category,
                'input_value': input_value,
                'see-all-genre-btn':false,
                'see-all-city-btn':false,
                'csrfmiddlewaretoken': getCookie('csrftoken'),
            },
            success: function (data) {
                context = $.parseJSON(data)
                var txt = '';
                $('#list_area').empty()
                $.each(context, function(index,item){
                    txt += '<div class="col-lg-4 col-md-6">'
                    txt += '<div class="card mb-4 border-dark" style="background-color: black;">'
                    if(item.head_image_url){
                        txt += '<a href="' + item.post_url + '"><img class="card-img-top" id="post-head-image" src="'+item.head_image_url+'" alt="head_image"/></a>'
                    }
                    txt+= '<div class="card-body">'
                    txt+= '<span class="float-right text-white">'
                    if (item.like_factor){
                        txt+='<i class="fas fa-heart" style="color: #FF0000;"></i>'
                    }
                    else {
                        txt+= '<i class="far fa-heart"></i>'
                    }
                    txt+=item.like_cnt + '&nbsp;'
                    txt+='<i class="fas fa-comment" style="color: whitesmoke;"></i>'
                    txt+=item.comment_cnt
                    txt+='&nbsp;'
                    txt+= '</span>'
                    txt+='<h4 class="card-title h4 text-white id="post-title">'+item.title+'</h2>'
                    txt+='<div class="small text-white" id="post-create-at">'+item.create_at+'<div class="float-right"> by <a href="'+item.profile_url+ '">' +item.author+ '</a></div></div>'
                    txt+='<p class="card-text mt-1 text-white" id="post-content">'+ item.content.slice(undefined, 40) +'... </p>'
                    if(item.genre_list){
                        for (var i=0; i<item.genre_list.length; i++) {
                            txt+= '<span class="badge rounded-pill badge-warning float-left mr-1">' + item.genre_list[i] + '</span>'
                        }
                    }
                    if(item.city_list){
                        for (var i=0; i<item.city_list.length; i++){
                            txt+= '<span class="badge rounded-pill badge-secondary float-left mr-1 mb-2">' + item.city_list[i] + '</span>'
                        }
                    }
                    if (item.user_is_authenticated){
                        txt+='<a class="btn btn-dark float-right" href="'+ item.post_url +'">더보기 →</a>'
                    }
                    else{
                        txt+='<a class="btn btn-dark float-right" href="/account/signin/?next='+window.location.href+'">더보기 →</a>'
                    }
                            
                    txt+='</div></div></div>'




                });
                
                $('#list_area').append(txt)
                $('#result_cnt').html(context.length)
            }
        });
    });



    // 장르 전체보기 선택시 체크박스 모두 해제
    $('#see-all-genre-btn').click( function(){   

        genre_list.length = 0;

        selected_category = $('#category-select option:selected').val();

        $.ajax({
            url: '/blog/searching_ajax/',
            dataType:'json',
            type:'GET',
            data: {
                // 'post_list': post_list,
                'selected_genre_list': genre_list,
                'selected_city_list' : city_list,
                'selected_category':selected_category,
                'input_value': input_value,
                'see-all-genre-btn': true,
                'see-all-city-btn':false,
                'csrfmiddlewaretoken': getCookie('csrftoken'),
            },
            success: function (data) { // ajax 통신이 정상적으로 완료되었을 때
                $(".genre-checkbox").each(function() {
                    $(this).prop("checked", false);;
                });

                $('#selected_genre_count').hide();

                context = $.parseJSON(data)
                var txt = '';
                $('#list_area').empty()
                $.each(context, function(index,item){
                    txt += '<div class="col-lg-4 col-md-6">'
                    txt += '<div class="card mb-4 border-dark" style="background-color: black;">'
                    if(item.head_image_url){
                        txt += '<a href="' + item.post_url + '"><img class="card-img-top" id="post-head-image" src="'+item.head_image_url+'" alt="head_image"/></a>'
                    }
                    txt+= '<div class="card-body">'
                    txt+= '<span class="float-right text-white">'
                    if (item.like_factor){
                        txt+='<i class="fas fa-heart" style="color: #FF0000;"></i>'
                    }
                    else {
                        txt+= '<i class="far fa-heart"></i>'
                    }
                    txt+=item.like_cnt + '&nbsp;'
                    txt+='<i class="fas fa-comment" style="color: whitesmoke;"></i>'
                    txt+=item.comment_cnt
                    txt+='&nbsp;'
                    txt+= '</span>'
                    txt+='<h4 class="card-title h4 text-white id="post-title">'+item.title+'</h2>'
                    txt+='<div class="small text-white" id="post-create-at">'+item.create_at+'<div class="float-right"> by <a href="'+item.profile_url+ '">' +item.author+ '</a></div></div>'
                    txt+='<p class="card-text mt-1 text-white" id="post-content">'+ item.content.slice(undefined, 40) +'... </p>'
                    if(item.genre_list){
                        for (var i=0; i<item.genre_list.length; i++) {
                            txt+= '<span class="badge rounded-pill badge-warning float-left mr-1">' + item.genre_list[i] + '</span>'
                        }
                    }
                    if(item.city_list){
                        for (var i=0; i<item.city_list.length; i++){
                            txt+= '<span class="badge rounded-pill badge-secondary float-left mr-1 mb-2">' + item.city_list[i] + '</span>'
                        }
                    }
                    if (item.user_is_authenticated){
                        txt+='<a class="btn btn-dark float-right" href="'+ item.post_url +'">더보기 →</a>'
                    }
                    else{
                        txt+='<a class="btn btn-dark float-right" href="/account/signin/?next='+window.location.href+'">더보기 →</a>'
                    }
                            
                    txt+='</div></div></div>'




                });
                
                $('#list_area').append(txt)
                $('#result_cnt').html(context.length)
            }
        });

    });


    // 장르 체크박스 선택시
    $('.genre-checkbox').click( function() {
        // 리스트를 초기화 한다
        genre_list.length = 0;

        selected_category = $('#category-select option:selected').val();

        // 현재 선택되어있는 장르 가져오기
        $(".genre-checkbox:checked").each(function() {
            if ($(this).val() === 'no-genre'){
                genre_list.length = 0;
                genre_list.push($(this).val());
                //장르 없음을 선택했을 경우 다른 장르는 모두 체크 해제한다.
                $('.genre-checkbox').prop('checked', false)
                $("input:checkbox[value='no-genre']").prop('checked', true)
                return false
            }
            else{
                genre_list.push($(this).val());
            }
            
        });
        

        $.ajax({
            url: '/blog/searching_ajax/',
            dataType:'json',
            type:'GET',
            data: {
                // 'post_list': post_list,
                'selected_genre_list': genre_list,
                'selected_category': selected_category,
                'selected_city_list' : city_list,
                'input_value': input_value,
                'see-all-genre-btn':false,
                'see-all-city-btn':false,
                'csrfmiddlewaretoken': getCookie('csrftoken'),
            },
            success: function (data) { // ajax 통신이 정상적으로 완료되었을 때
                if (genre_list.length === 0 ) { // 아무것도 선택 안했으면 숫자뜨는 배지 제거
                    $('#selected_genre_count').hide();
                    
                } else {
                    $('#selected_genre_count').show();
                }

                $('#selected_genre_count').html(genre_list.length); //id가 like_count의 내용을 전송받은 좋아요 수로 바꾼다
                
                context = $.parseJSON(data)
                var txt = '';
                $('#list_area').empty()
                $.each(context, function(index,item){
                    txt += '<div class="col-lg-4 col-md-6">'
                    txt += '<div class="card mb-4 border-dark" style="background-color: black;">'
                    if(item.head_image_url){
                        txt += '<a href="' + item.post_url + '"><img class="card-img-top" id="post-head-image" src="'+item.head_image_url+'" alt="head_image"/></a>'
                    }
                    txt+= '<div class="card-body">'
                    txt+= '<span class="float-right text-white">'
                    if (item.like_factor){
                        txt+='<i class="fas fa-heart" style="color: #FF0000;"></i>'
                    }
                    else {
                        txt+= '<i class="far fa-heart"></i>'
                    }
                    txt+=item.like_cnt + '&nbsp;'
                    txt+='<i class="fas fa-comment" style="color: whitesmoke;"></i>'
                    txt+=item.comment_cnt
                    txt+='&nbsp;'
                    txt+= '</span>'
                    txt+='<h4 class="card-title h4 text-white id="post-title">'+item.title+'</h2>'
                    txt+='<div class="small text-white" id="post-create-at">'+item.create_at+'<div class="float-right"> by <a href="'+item.profile_url+ '">' +item.author+ '</a></div></div>'
                    txt+='<p class="card-text mt-1 text-white" id="post-content">'+ item.content.slice(undefined, 40) +'... </p>'
                    if(item.genre_list){
                        for (var i=0; i<item.genre_list.length; i++) {
                            txt+= '<span class="badge rounded-pill badge-warning float-left mr-1">' + item.genre_list[i] + '</span>'
                        }
                    }
                    if(item.city_list){
                        for (var i=0; i<item.city_list.length; i++){
                            txt+= '<span class="badge rounded-pill badge-secondary float-left mr-1 mb-2">' + item.city_list[i] + '</span>'
                        }
                    }
                    if (item.user_is_authenticated){
                        txt+='<a class="btn btn-dark float-right" href="'+ item.post_url +'">더보기 →</a>'
                    }
                    else{
                        txt+='<a class="btn btn-dark float-right" href="/account/signin/?next='+window.location.href+'">더보기 →</a>'
                    }
                            
                    txt+='</div></div></div>'




                });
                
                $('#list_area').append(txt)
                $('#result_cnt').html(context.length)
            }
        });
    })



// 지역 전체보기 선택시 체크박스 모두 해제
$('#see-all-city-btn').click( function(){   

    city_list.length = 0;

    selected_category = $('#category-select option:selected').val();

    $.ajax({
        url: '/blog/searching_ajax/',
        dataType:'json',
        type:'GET',
        data: {
            // 'post_list': post_list,
            'selected_genre_list': genre_list,
            'selected_city_list' : city_list,
            'selected_category':selected_category,
            'input_value': input_value,
            'see-all-genre-btn': false,
            'see-all-city-btn':true,
            'csrfmiddlewaretoken': getCookie('csrftoken'),
        },
        success: function (data) { // ajax 통신이 정상적으로 완료되었을 때
            $(".city-checkbox").each(function() {
                $(this).prop("checked", false);;
            });

            $('#selected_city_count').hide();

            context = $.parseJSON(data)
            var txt = '';
            $('#list_area').empty()
            $.each(context, function(index,item){
                txt += '<div class="col-lg-4 col-md-6">'
                    txt += '<div class="card mb-4 border-dark" style="background-color: black;">'
                    if(item.head_image_url){
                        txt += '<a href="' + item.post_url + '"><img class="card-img-top" id="post-head-image" src="'+item.head_image_url+'" alt="head_image"/></a>'
                    }
                    txt+= '<div class="card-body">'
                    txt+= '<span class="float-right text-white">'
                    if (item.like_factor){
                        txt+='<i class="fas fa-heart" style="color: #FF0000;"></i>'
                    }
                    else {
                        txt+= '<i class="far fa-heart"></i>'
                    }
                    txt+=item.like_cnt + '&nbsp;'
                    txt+='<i class="fas fa-comment" style="color: whitesmoke;"></i>'
                    txt+=item.comment_cnt
                    txt+='&nbsp;'
                    txt+= '</span>'
                    txt+='<h4 class="card-title h4 text-white id="post-title">'+item.title+'</h2>'
                    txt+='<div class="small text-white" id="post-create-at">'+item.create_at+'<div class="float-right"> by <a href="'+item.profile_url+ '">' +item.author+ '</a></div></div>'
                    txt+='<p class="card-text mt-1 text-white" id="post-content">'+ item.content.slice(undefined, 40) +'... </p>'
                if(item.genre_list){
                    for (var i=0; i<item.genre_list.length; i++) {
                        txt+= '<span class="badge rounded-pill badge-warning float-left mr-1">' + item.genre_list[i] + '</span>'
                    }
                }
                if(item.city_list){
                    for (var i=0; i<item.city_list.length; i++){
                        txt+= '<span class="badge rounded-pill badge-secondary float-left mr-1 mb-2">' + item.city_list[i] + '</span>'
                    }
                }
                if (item.user_is_authenticated){
                    txt+='<a class="btn btn-dark float-right" href="'+ item.post_url +'">더보기 →</a>'
                }
                else{
                    txt+='<a class="btn btn-dark float-right" href="/account/signin/?next='+window.location.href+'">더보기 →</a>'
                }
                        
                txt+='</div></div></div>'




            });
            
            $('#list_area').append(txt)
            $('#result_cnt').html(context.length)
        }
    });

});




    // 지역 체크박스 선택시
    $('.city-checkbox').click( function() {
        // 리스트를 초기화 한다
        city_list.length = 0;

        selected_category = $('#category-select option:selected').val();

        // 현재 선택되어있는 지역 가져오기
        $(".city-checkbox:checked").each(function() {
            if ($(this).val() === 'no-city'){
                city_list.length = 0;
                city_list.push($(this).val());
                //장르 없음을 선택했을 경우 다른 장르는 모두 체크 해제한다.
                $('.city-checkbox').prop('checked', false)
                $("input:checkbox[value='no-city']").prop('checked', true)
                return false
            }
            else{
                city_list.push($(this).val());
            }
        });

        $.ajax({
            url: '/blog/searching_ajax/',
            dataType:'json',
            type:'GET',
            data: {
                // 'post_list': post_list,
                'selected_genre_list': genre_list,
                'selected_category': selected_category,
                'selected_city_list' : city_list,
                'input_value': input_value,
                'see-all-genre-btn':false,
                'see-all-btn-city-btn':false,
                'csrfmiddlewaretoken': getCookie('csrftoken'),
            },
            success: function (data) { // ajax 통신이 정상적으로 완료되었을 때
                if (city_list.length === 0 ) { // 아무것도 선택 안했으면 숫자뜨는 배지 제거
                    $('#selected_city_count').hide();
                    
                } else {
                    $('#selected_city_count').show();
                }

                $('#selected_city_count').html(city_list.length); //id가 like_count의 내용을 전송받은 좋아요 수로 바꾼다
                
                context = $.parseJSON(data)
                var txt = '';
                $('#list_area').empty()
                $.each(context, function(index,item){
                    txt += '<div class="col-lg-4 col-md-6">'
                    txt += '<div class="card mb-4 border-dark" style="background-color: black;">'
                    if(item.head_image_url){
                        txt += '<a href="' + item.post_url + '"><img class="card-img-top" id="post-head-image" src="'+item.head_image_url+'" alt="head_image"/></a>'
                    }
                    txt+= '<div class="card-body">'
                    txt+= '<span class="float-right text-white">'
                    if (item.like_factor){
                        txt+='<i class="fas fa-heart" style="color: #FF0000;"></i>'
                    }
                    else {
                        txt+= '<i class="far fa-heart"></i>'
                    }
                    txt+=item.like_cnt + '&nbsp;'
                    txt+='<i class="fas fa-comment" style="color: whitesmoke;"></i>'
                    txt+=item.comment_cnt
                    txt+='&nbsp;'
                    txt+= '</span>'
                    txt+='<h4 class="card-title h4 text-white id="post-title">'+item.title+'</h2>'
                    txt+='<div class="small text-white" id="post-create-at">'+item.create_at+'<div class="float-right"> by <a href="'+item.profile_url+ '">' +item.author+ '</a></div></div>'
                    txt+='<p class="card-text mt-1 text-white" id="post-content">'+ item.content.slice(undefined, 40) +'... </p>'
                    if(item.genre_list){
                        for (var i=0; i<item.genre_list.length; i++) {
                            txt+= '<span class="badge rounded-pill badge-warning float-left mr-1">' + item.genre_list[i] + '</span>'
                        }
                    }
                    if(item.city_list){
                        for (var i=0; i<item.city_list.length; i++){
                            txt+= '<span class="badge rounded-pill badge-secondary float-left mr-1 mb-2">' + item.city_list[i] + '</span>'
                        }
                    }
                    if (item.user_is_authenticated){
                        txt+='<a class="btn btn-dark float-right" href="'+ item.post_url +'">더보기 →</a>'
                    }
                    else{
                        txt+='<a class="btn btn-dark float-right" href="/account/signin/?next='+window.location.href+'">더보기 →</a>'
                    }
                            
                    txt+='</div></div></div>'




                });
                
                $('#list_area').append(txt)
                $('#result_cnt').html(context.length)
            }
        });
    })

    // $('#search-input').keyup( function() {
        // var post_list = document.getElementById("post_list").value;
    //     var input_value = document.getElementById('search-input').value;


    //     $.ajax({
    //         url: '/blog/search_test/',
    //         dataType:'json',
    //         type:'GET',
    //         data: {
    //             'post_list': post_list,
    //             'input_value': input_value,
    //             'see-all-btn':false,
    //             'csrfmiddlewaretoken': getCookie('csrftoken'),
    //         },
    //         success: function (response) { // ajax 통신이 정상적으로 완료되었을 때
    //             if (response.selected_genre_count === 0 ) { // 아무것도 선택 안했으면 숫자뜨는 배지 제거
    //                 $('#selected_genre_count').hide();
                    
    //             } else {
    //                 $('#selected_genre_count').show();
    //             }

    //             $('#selected_genre_count').html(response.selected_genre_count); //id가 like_count의 내용을 전송받은 좋아요 수로 바꾼다
            
    //         }
    //     });
    // });



});