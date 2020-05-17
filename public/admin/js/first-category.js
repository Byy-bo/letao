$(function () {
    /*定义一个动态page*/
    let wPage = 1;
    /*封装调用*/
    const render = function() {
        yjData(wPage , function (yjRes) {
            console.log(yjRes);
            /*通过模板引擎来渲染数据*/
            $('#yjData').html(template('yjTem' , yjRes));
            initPage(yjRes);
        });
    };

    let initPage = function (yjRes) {
        /*操作分页*/
        $('.pagination').bootstrapPaginator({
            /*声明操作的版本*/
            bootstrapMajorVersion : 3,
            /*设置当前页面*/
            currentPage : wPage,
            /*设置页码数*/
            numberOfPages : 2,
            /*设置总页数*/
            totalPages : Math.ceil(yjRes.total / yjRes.size),
            /*控制按钮的显示文字*/
            itemTexts : function (type , page , current) {
                switch (type) {
                    case 'next' :
                        return '下一页';
                        break;
                    case 'prev' :
                        return '上一页';
                        break;
                    case 'first' :
                        return '首页';
                        break;
                    case 'last' :
                        return '尾页';
                        break;
                    case 'page' :
                        return page;
                        break;
                }
            },
            //显示提示信息
            tooltipTitles: function (type, page, current) {
                switch (type) {
                    case 'next' :
                        return '下一页';
                        break;
                    case 'prev' :
                        return '上一页';
                        break;
                    case 'first' :
                        return '首页';
                        break;
                    case 'last' :
                        return '尾页';
                        break;
                    case 'page' :
                        return page;
                        break;
                }
            },
            /*改变页码的时候*/
            onPageChanged : function (event, oldPage, newPage) {
                /*改变page*/
                wPage = newPage;
                /*再次渲染*/
                render();
            }
        });
    };

    /*页面初始化*/
    render();

    /*表单验证*/
    $('#add_yj_form').bootstrapValidator({
        //
        // message: 'This value is not valid',
        //图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryName: {
                // message: '用户名验证失败',
                // 配置校验规则, 可以设置多个
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: '分类名称不能为空'
                    },
                    //校验长度
                    stringLength: {
                        min: 3,
                        max: 6,
                        message: '分类名称长度必须在3到6位之间'
                    },
                    regexp: {
                        regexp: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
                        message: '分类名称只能包含大写、小写、数字，和中文'
                    },
                }
            }
        }
    }).on('success.form.bv', function(e) {
        /*阻止默认的事件*/
        e.preventDefault();
        /*拿到我的数据*/
        let yjObj = {
            categoryName : $('#ht_yj_inp').val().trim()
        };
        /*请求添加一级分类的数据的数据*/
        yjAdd(yjObj , function (yjAddRes) {
            if (yjAddRes.success){
                /*改变page*/
                wPage = 1;
                /*再次渲染*/
                render();
                /*使模态款消失*/
                $('#addYj-modal-sm').modal('hide');
            }else {
                alert('服务器繁忙,请稍后再试!');
            }
        });
    });

    $('#addYj-modal-sm').on('hide.bs.modal', function () {
        /*清空我的input*/
        $('#ht_yj_inp').val('');
        /*重置状态*/
        $('#add_yj_form').data('bootstrapValidator').resetForm();
    })


});


/*封装我的添加一级分类*/
const yjAdd = function (yjObj , callback) {
    $.ajax({
        url : '/category/addTopCategory',
        type : 'post',
        data : yjObj,
        dataType : 'json',
        success : function (yjAddRes) {
            callback && callback(yjAddRes);
        }
    });
};

/*封装我的一级数据渲染*/
const yjData = function (page , callback) {
    $.ajax({
        url : '/category/queryTopCategoryPaging',
        type : 'get',
        data : {
            page : page,
            pageSize : 3
        },
        dataType : 'json',
        success : function (yjRes) {
            callback && callback(yjRes);
        }
    });
};