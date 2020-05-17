$(function () {
    /*默认第一页*/
    let pageT = 1;
    let renderT = function () {
        ejData(pageT , function (ejRes) {
            /*通过模板引擎来渲染数据*/
            $('#ejData').html(template('ejTem' , ejRes));
            initPageT(ejRes);
        });
    };

    let initPageT = function (ejRes) {
        /*操作分页*/
        $('.pagination').bootstrapPaginator({
            /*声明操作的版本*/
            bootstrapMajorVersion : 3,
            /*设置当前页面*/
            currentPage : pageT,
            /*设置页码数*/
            numberOfPages : 2,
            /*设置总页数*/
            totalPages : Math.ceil(ejRes.total / ejRes.size),
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
                pageT = newPage;
                /*再次渲染*/
                renderT();
            }
        });
    };
    /*页面初始化的时候*/
    renderT();

    /*渲染我的一级分类*/
    yjEjData(function (yjEjRes) {
        /*使用模板引擎进行渲染添加*/
        $('.dropdown-menu').html(template('yjEjTem' , yjEjRes)).find('li').on('click' , function () {
            /*拿到对应的内容,且赋值*/
            $('.ht_xz').text($(this).find('a').text());
            /*设置对应的val*/
            $('[name="categoryId"]').val($(this).attr('data-id'));
            /*重置状态*/
            $('#add_ej_form').data('bootstrapValidator').updateStatus('categoryId' , 'VALID');
        });
    });

    /*点击上传图片*/
    $('#fileupload').fileupload({
        url:'/category/addSecondCategoryPic',
        dataType : 'json',
        done : function (e , data) {
            $('.file_img_box img').attr('src',data.result.picAddr);
            /*存对应的val*/
            /*设置对应的val*/
            $('[name="brandLogo"]').val(data.result.picAddr);
            /*重置状态*/
            $('#add_ej_form').data('bootstrapValidator').updateStatus('brandLogo' , 'VALID');
        }
    });

    /*监听模态框消失*/
    $('#addEj-modal-sm').on('hide.bs.modal', function () {
        /*清空我的input*/
        $('#ht_ej_inp').val('');
        /*重置内容*/
        $('.ht_xz').text('请选择');
        /*重置状态*/
        $('#add_ej_form').data('bootstrapValidator').resetForm();
        /*重置图片*/
        $('.file_img_box img').attr('src','./images/none.png');
    });

    /*表单验证*/
    $('#add_ej_form').bootstrapValidator({
        /*使其可以验证我的隐藏域*/
        excluded : [],
        //
        // message: 'This value is not valid',
        //图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryId: {
                // message: '用户名验证失败',
                // 配置校验规则, 可以设置多个
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: '请选择一级分类'
                    },
                }

            },
            brandName: {
                validators: {
                    /*非空校验*/
                    notEmpty: {
                        message: '二级分类不能为空'
                    },
                    /*校验长度*/
                    stringLength: {
                        min: 2,
                        max: 8,
                        message: '二级分类长度必须在2到8位之间'
                    },
                    /*正则校验*/
                    regexp: {
                        regexp: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
                        message: '分类名称只能包含大写、小写、数字，和中文'
                    },
                },
            },
            brandLogo :{
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: '请上传图片'
                    },
                }
            }
        }
    }).on('success.form.bv', function(e) {
        /*阻止默认的事件*/
        e.preventDefault();
        /*拿到我的对象*/
        let $this = $(this);
        /*拿到我的数据*/
        let secObj = {
            categoryId : $('[name="categoryId"]').val().trim(),
            brandName : $('[name="brandName"]').val().trim(),
            brandLogo : $('[name="brandLogo"]').val().trim(),
            hot : $('[name="hot"]').val().trim(),
        };
        console.log(secObj);
        /*请求添加二级分类的数据*/
        ejAdd(secObj , function (ejAddRes) {
            if (ejAddRes.success){
                /*重新渲染我的页面*/
                renderT();
                /*消失模态框*/
                $('#addEj-modal-sm').modal('hide');
            }
        });
    });
});

/*封装我的二级数据渲染*/
const ejData = function (page , callback) {
    $.ajax({
        url : '/category/querySecondCategoryPaging',
        type : 'get',
        data : {
            page : page,
            pageSize : 2
        },
        dataType : 'json',
        success : function (ejRes) {
            callback && callback(ejRes);
        }
    });
};

/*封装我的一级数据渲染*/
const yjEjData = function (callback) {
    $.ajax({
        url : '/category/queryTopCategoryPaging',
        type : 'get',
        data : {
            page : 1,
            pageSize : 88
        },
        dataType : 'json',
        success : function (yjEjRes) {
            callback && callback(yjEjRes);
        }
    });
};

/*封装我的添加二级分类的请求*/
const ejAdd = function (ejObj , callback) {
    $.ajax({
        url : '/category/addSecondCategory',
        type : 'post',
        data : ejObj,
        dataType : 'json',
        success : function (ejAddRes) {
            callback && callback(ejAddRes);
        }
    });
};