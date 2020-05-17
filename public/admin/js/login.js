$(function () {
    /*表单验证*/
    $('#login').bootstrapValidator({
        //
        // message: 'This value is not valid',
        //图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                // message: '用户名验证失败',
                // 配置校验规则, 可以设置多个
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    //校验长度
                    stringLength: {
                        min: 4,
                        max: 16,
                        message: '用户名长度必须在4到16位之间'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9]+$/,
                        message: '用户名只能包含大写、小写、数字'
                    },
                    //校验规则名 : 处理后台所响应回来的数据
                    callback: {
                        message: "用户名不存在"
                    }
                }

            },
            password: {
                validators: {
                    /*非空校验*/
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    /*校验长度*/
                    stringLength: {
                        min: 6,
                        max: 16,
                        message: '密码长度必须在6到16位之间'
                    },
                    /*正则校验*/
                    regexp: {
                        regexp: /^[a-zA-Z0-9_]+$/,
                        message: '密码只能包含大写、小写、数字和下划线'
                    },
                    /*正错校验*/
                    callback :{
                        message: '密码错误'
                    }
                },
            }
        }
    }).on('success.form.bv', function(e) {
        /*阻止默认的事件*/
         e.preventDefault();
        /*拿到我的对象*/
        let $this = $(this);
        /*拿到我的数据*/
        let logObj = {
            username : $('#user').val().trim(),
            password : $('#pass').val().trim(),
        };
        /*请求登录的数据*/
        htLogin(logObj , function (logRes) {
            if (logRes.success){
                /*跳转到首页*/
                location.href = 'index.html'
            }else if(logRes.error === 1000) {
                /*用户名不存在*/
                $this.data('bootstrapValidator').updateStatus('username' , 'INVALID' , 'callback');

            }else if(logRes.error === 1001){
                /*密码不存在*/
                $this.data('bootstrapValidator').updateStatus('password' , 'INVALID' , 'callback');
            }
        })
    });
    
    /*点击重置*/
    $('[type="reset"]').on('click' , function () {
        /*重置整个表单*/
        $('#login').data('bootstrapValidator').resetForm();
    });
});

/*封装我的登录的模块*/
const htLogin = function (logObj , callback) {
    $.ajax({
        url : '/employee/employeeLogin',
        type : 'post',
        data : logObj,
        dataType : 'json',
        success : function (logRes) {
            callback && callback(logRes);
        }
    });
};