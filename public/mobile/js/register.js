$(function () {

    /*获取到认证码按钮*/
    let regRz = $('.lt_reg_rzm');
    /*点击注册*/
    $('.lt_reg_zc').on('tap' , function () {
        /*获取到我会员协议的复选框的boolean值*/
        let regChe = $('#lt_reg_che').prop('checked');
        /*获取到我的确认密码*/
        let qrMm = $('[name="agPassword"]').val().trim();
        /*获取到各个input的值并且存到对象当中*/
        let regObj = {
          username : $('[name="username"]').val().trim(),
          password : $('[name="password"]').val().trim(),
          mobile : $('[name="mobile"]').val().trim(),
          vCode : $('[name="vCode"]').val().trim()
        };

        /*进行非空校验*/
        /*用户名*/
        if (!regObj.username) return mui.toast('用户名不能为空');
        /*手机号*/
        if (!regObj.mobile) return mui.toast('手机号不能为空');
        /*手机号的规范*/
        if(!/^[1][3456789]\d{9}$/.test(regObj.mobile)) return mui.toast('手机号不合法');
        /*密码*/
        if (!regObj.password) return mui.toast('密码不能为空');
        /*确认密码*/
        if (regObj.password !== qrMm) return mui.toast('两次填写的密码不一样');
        /*认证码*/
        if (!regObj.vCode) return mui.toast('认证码不能为空');
        /*会员协议*/
        if (!regChe) return mui.toast('请同意勾选我的会员服务协议');

        /*发起注册请求*/
        regData(regObj , function (regRes) {
            if (regRes.success){
                /*注册成功友情提示,跳转到我的登录页面*/
                mui.toast('注册成功！');
                setTimeout(function () {
                    location.href = lt.loginUrl;
                } , 600);
            }else {
                /*注册失败友情提示*/
                mui.toast(regRes.message);
            }
        });
    });

    /*点击获取我的认证码*/
    /*获取到认证码按钮*/
    regRz.on('tap' , function () {
        if ($(this).hasClass('a_disabled')){
            return;
        }
        lt.hqRz({
            url : '/user/vCode',
            myVpCode : $('[name="vCode"]'),
            myRz : regRz
        });
    });
});

/*封装我的注册请求*/
const regData = function (regO , callback) {
  $.ajax({
      url : '/user/register',
      type : 'post',
      data : regO,
      dataType : 'json',
      success : function (regRes) {
          callback && callback(regRes);
      }
  });
};