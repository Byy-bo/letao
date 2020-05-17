$(function () {
    /*请求一级分类数据*/
    yjData(function (yjRes) {
        /*使用我的模板引擎*/
        /*添加到我的元素当中*/
        $('.cate_le ul').append(template('yjTem' , yjRes));
        /*拿到我存的id*/
        const yjId = $('.cate_le ul li.yj_active').find('a').attr('data-id');
        /*请求我的二级分类的数据*/
        ejData(yjId , function (ejRes) {
            /*使用我的模板引擎*/
            /*添加到我的元素当中*/
            $('.cate_ri ul').append(template('ejTem' , ejRes));
        });
    });

    /*点击切换内容*/
    $('.cate_le ul').on('tap' , 'a' , function () {
        /*优化如果有类了不在进行请求*/
        if ($(this).parent().hasClass('yj_active')) return;
        /*先清空我的子元素*/
        $('.cate_ri ul').empty();
        /*切换类*/
        /*清空所有的类*/
        $('.cate_le ul li').removeClass('yj_active');
        /*对应的添加类*/
        $(this).parent().addClass('yj_active');
        /*拿到我对应的Id*/
        const yjId = $(this).attr('data-id');
        /*请求我的二级分类的数据*/
        ejData(yjId , function (ejRes) {
            /*使用我的模板引擎*/
            /*添加到我的元素当中*/
            $('.cate_ri ul').append(template('ejTem' , ejRes));
        });
    });
});

/*封装请求我的一级分类的数据*/
const yjData = function (callback) {
  $.ajax({
      url : '/category/queryTopCategory',
      type : 'get',
      dataType : 'json',
      success : function (yjRes) {
          callback && callback(yjRes);
      }
  });
};

/*封装请求我的二级分类的数据*/
const ejData = function (ejId , callback) {
    $.ajax({
        url : '/category/querySecondCategory',
        type : 'get',
        dataType : 'json',
        data : {
          id :   ejId
        },
        success : function (ejRes) {
            callback && callback(ejRes);
        }
    });
};