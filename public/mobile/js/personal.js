$(function () {
    /*获取节点*/
    let name = $('.lt_per_name');
    let mobile = $('.lt_per_mobile');
   /*发起用户个人信息请求*/
   lt.loginAjax({
       url : '/user/queryUserMessage',
       success : function (perRes) {
           /*获取节点，更改信息*/
           name.text(perRes.username);
           mobile.text('绑定手机：' + perRes.mobile);
       }
   });

   /*点击退出*/
    $('.lt_per_loginOut').on('tap' , function () {
        loginOut(function (logOutRes) {
            if (logOutRes.success){
                /*获取节点，更改信息*/
                name.text('加载中...');
                mobile.text('绑定手机：加载中...');
                /*跳转到登录页面*/
                location.href = lt.loginUrl;
            }else {
                /*友好提示*/
                mui.toast('服务器错误，请稍后在试一试');
            }
        });
    });
});

/*封装登出的请求*/
const loginOut = function (callback) {
    $.ajax({
        url : '/user/logout',
        type : 'get',
        dataType : 'json',
        success : function (logOutRes) {
            callback && callback(logOutRes);
        }
    });
};