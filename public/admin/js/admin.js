$(function () {
    /*封装初始化我的进度条*/
    /*ajax请求的开始时候*/
    $(window).ajaxStart(function () {
        NProgress.start();
    });

    /*ajax请求的完成时候*/
    $(window).ajaxComplete(function () {
        // NProgress.done();
    });

    /*禁用我的小圈圈*/
    NProgress.configure({
        showSpinner : false
    });
});