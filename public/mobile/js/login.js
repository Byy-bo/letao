$(function () {
    /*定义一个对象接收我的用户名和密码*/
    let logObj = {};
    /*点击确认进行登录请求*/
    $('.lt_login .mui-btn-primary').on('tap' , function () {
        /*获取到我输入的用户名和密码*/
        let username = $('.lt_login .mui-input-clear').val().trim();
        let password = $('.lt_login .mui-input-password').val().trim();
        /*非空校验*/
        if (!username || !password) {
            mui.toast('用户名或者密码不能为空!');
            return;
        }
        logObj.username = username;
        logObj.password = password;
        /*调用请求*/
        loginData(logObj , function (logRes) {
            if (logRes.success){
                let url = location.search.replace('?reUrl=' , '');
                if (url){
                    location.href = url;
                    return;
                }else {
                    location.href = lt.personUrl;
                }
            } else {
                //登录失败
                mui.toast(logRes.message);
            }

        });
    });
});

/*封装我的登录请求*/
const loginData = function (logObj , callback) {
    $.ajax({
        url : '/user/login',
        type : 'post',
        dataType : 'json',
        data : logObj,
        success : function (logRes) {
            callback && callback(logRes);
        }
    });
};