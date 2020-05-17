$(function () {
    /*获取到认证码按钮*/
    let upPassRz = $('.lt_upPass_rzm');
    /*获取到我的确认密码*/
    /*点击确认修改*/
    $('.lt_upPass_qrXg a').on('tap' , function () {
        /*获取到我的确认密码*/
        let qrMm = $('[name="agnPassword"]').val().trim();
        /*获取到各个input的值并且存到对象当中*/
        let upPassObj = {
            oldPassword : $('[name="oldPassword"]').val().trim(),
            newPassword : $('[name="newPassword"]').val().trim(),
            vCode : $('[name="vCode"]').val().trim()
        };

        /*进行非空校验*/
        /*旧密码*/
        if (!upPassObj.oldPassword) return mui.toast('旧密码不能为空');
        /*新密码*/
        if (!upPassObj.newPassword) return mui.toast('新密码不能为空');
        /*确认密码*/
        if (upPassObj.newPassword !== qrMm) return mui.toast('两次填写的密码不一样');
        /*认证码*/
        if (!upPassObj.vCode) return mui.toast('认证码不能为空');

        /*发起修改请求*/
        upPassData(upPassObj , function (upPassRes) {
            if (upPassRes.success){
                /*修改成功友情提示,跳转到我的登录页面*/
                mui.toast('修改成功！');
                setTimeout(function () {
                    location.href = lt.loginUrl;
                } , 600);
            }else {
                /*修改失败友情提示*/
                mui.toast(upPassRes.message);
            }
        });
    });

    /*点击获取我的认证码*/
    /*获取到认证码按钮*/
    upPassRz.on('tap' , function () {
        if ($(this).hasClass('a_disabled')){
            return;
        }
        lt.hqRz({
            url : '/user/vCodeForUpdatePassword',
            myVpCode : $('[name="vCode"]'),
            myRz : upPassRz
        });
    });
});

/*封装修改密码的请求*/
const upPassData = function (upPassO , callback) {
  $.ajax({
      url : '/user/updatePassword',
      type : 'post' ,
      data : upPassO,
      dataType : 'json',
      success : function (upPassRes) {
          callback && callback(upPassRes);
      }
  });
};