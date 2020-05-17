$(function () {
    let pageY = 1;
    let yhId = 0;
    let isDelete = 1;
    let yhIndex = 0;
    /*获取节点*/
    let yhModel = $('#tog-modal-sm');
    let ht_isText = $('.ht_isText');

    /*封装调用*/
    const renderY = function() {
        yhData(pageY , function (yhRes) {
            console.log(yhRes);
            /*通过模板引擎来渲染数据*/
            $('#yhData').html(template('yhTem' , yhRes));
            /*判断的去添加类*/
            initPageY(yhRes);
        });
    };

    let initPageY = function (yhRes) {
        /*操作分页*/
        $('.pagination').bootstrapPaginator({
            /*声明操作的版本*/
            bootstrapMajorVersion : 3,
            /*设置当前页面*/
            currentPage : pageY,
            /*设置页码数*/
            numberOfPages : 2,
            /*设置总页数*/
            totalPages : Math.ceil(yhRes.total / yhRes.size),
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
                pageY = newPage;
                /*再次渲染*/
                renderY();
            }
        });
    };

    /*页面初始化*/
    renderY();

    /*点击显示我的模态框，，判断的去看显示我什么内容*/
    $('#yhData').on('click' , '.toggleModel' , function () {
        /*存我的对象*/
        let $this = $(this);
        /*拿到我的存的自定义属性*/
        yhId = Number($(this).attr('data-id'));
        isDelete = Number($(this).attr('data-isDelete'));
        /*显示我的模态框*/
        yhModel.modal('show');
        $('#ht_tog').on('click' , function () {
            upYh(yhId , isDelete , function (upYhRes) {
                if (upYhRes.success){
                    if (isDelete === 1) {
                        /*更新我存的值和页面*/
                        $this.text('启用').attr('data-isDelete' , 0).addClass('btn-primary').removeClass('btn-danger').prev('已禁用');
                    }else {
                        /*更新我存的值和页面*/
                        $this.text('禁用').attr('data-isDelete' , 1).addClass('btn-danger').removeClass('btn-primary').prev('正常');
                    }
                }
                /*消失模态框*/
                yhModel.modal('hide');
            });
        });
    });

    /*监听我的更新用户模态框的显示*/
    yhModel.on('show.bs.modal', function (e) {
        if (isDelete === 1) {
            ht_isText.text('禁用');
        }else {
            ht_isText.text('启用');
        }
    });


});

/*封装我的用户管理请求*/
const yhData = function (page , callback) {
    $.ajax({
        url : '/user/queryUser',
        type : 'get',
        data : {
            page : page,
            pageSize :2
        },
        dataType : 'json',
        success : function (yhRes) {
            callback && callback(yhRes);
        }
    });
};

/*封装我的更新请求*/
const upYh = function (id , isDelete , callback) {
  $.ajax({
      url : '/user/updateUser',
      type : 'post',
      data : {
          id : id,
          isDelete : isDelete
      },
      dataType:'json',
      success : function (upYhRes) {
          callback && callback(upYhRes);
      }
  });
};