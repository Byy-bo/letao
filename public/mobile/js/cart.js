$(function () {
    /*获取节点*/
    let task = $('#OA_task_2');
    let body = $('body');
    /*下拉刷新*/
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                callback : function () {
                    setTimeout(function () {
                        cartData(function (cartRes) {
                            /*使用模板引擎渲染*/
                            /*并且添加到我的元素当中*/
                            $('#OA_task_2').html(template('cartTem' , {cartR : cartRes}));
                            cartMoney();
                            /*释放刷新*/
                            this.endPulldownToRefresh();
                        }.bind(this));
                    }.bind(this) , 500);

                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });

    /*点击刷新*/
    $('.lt_header .right').on('tap' , function () {
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    });
    
    /*点击删除*/
    task.on('tap' , '.mui-btn-red' , function () {
        let $this = $(this);
        /*拿到我存的id*/
        let scId = $(this).attr('data-id');
        /*发起删除请求*/
        lt.loginAjax({
            url : '/cart/deleteCart',
            data : {
                id : scId
            },
            success : function (scRes) {
                if (scRes.success){
                    /*后台数据删除，，删除前面的dom元素*/
                    /*先弹框*/
                    mui.confirm('亲,你真的要抛弃我吗？', '商品删除', ['是', '否'], function(e) {
                        if (e.index === 0) {
                            /*删除对应的dom*/
                            $this.parents('.mui-table-view-cell').remove();
                            cartMoney();
                            /*温馨提示*/
                            mui.toast('删除成功!');
                        } else {
                            /*温馨提示*/
                            mui.toast('感谢亲的手下留情，mum!');
                            /*还原滑块*/
                            mui.swipeoutClose($this.parents('.mui-table-view-cell')[0]);
                        }
                    })
                }
            }
        });
    });

    /*点击编辑*/
    task.on('tap' , '.mui-btn-blue' , function () {
        /*拿到我点击对象的对应li对象*/
        let xgLi = $(this).parents('.mui-table-view-cell');
        /*先去存，然后拿到我存的自定义属性*/
        let xgData = this.dataset;
        console.log(xgData);
        /*要通过模板引擎渲染出我的修改框*/
        let xgHtml = template('xgTem' , {
            newA : lt.temSize(xgData.productsize),
            num : xgData.num,
            productNum : xgData.productnum,
            size : xgData.size
        });
        /*获取到我复选框里面的num属性*/
        let cheNum = xgLi.find('.lt_cart_check')[0].dataset;
        /*弹出我的修改框*/
        mui.confirm(xgHtml.replace(/\n/g , ''), '商品修改', ['是', '否'], function(e) {
            if (e.index === 0) {
                /*获取到我修改的尺码和我的数量*/
                let xgSize = $('.cmDj.cmActive').text();
                let xgNum = $('.go_num').val();
                    /*发起我的更新请求*/
                lt.loginAjax({
                    url : '/cart/updateCart',
                    type : 'post',
                    data : {
                        id : xgData.id ,
                        size : xgSize,
                        num : xgNum
                    },
                    success : function (xgRes) {
                        if (xgRes.success){
                            /*修改我的dom上的数据*/
                            xgLi.find('.lt_cart_num').text('✖ ' + xgNum + '双');
                            xgLi.find('.lt_cart_size').text('鞋码：' + xgSize);
                            /*修改我存的自定义属性*/
                            xgData.num = xgNum;
                            xgData.size = xgSize;
                            /*修改我的input里面的数量*/
                            cheNum.num = xgNum;
                            cartMoney();
                            mui.toast("编辑成功");
                            /*还原滑块*/
                            mui.swipeoutClose(xgLi[0]);
                        }
                    }
                });
            } else {
                /*温馨提示*/
                mui.toast('亲，思考好在选哦!');
                /*还原滑块*/
                mui.swipeoutClose(xgLi[0]);
            }
        })
    });

    /*尺码的选择*/
    body.on('tap' , '.cmDj' , function (e) {
        /*对应的a添加我的样式*/
            $(this).addClass('cmActive').siblings().removeClass('cmActive');
    });

    /*数量的加减*/
    /*加*/
    body.on('click' , '.add_num' , function () {
        /*拿到我存的数量*/
        let numS = $(this).attr('data-productNum');
        /*获取到文本框的数量*/
        let add = Number($(this).prev().val());
        /*增加数量*/
        if (add >= numS) {
            mui.toast('亲，没用更多的库存了哦！');
            return;
        }
        add++;
        $(this).prev().val(add);
    });

    /*减*/
    body.on('tap' , '.del_num' , function () {
        /*获取到文本框的数量*/
        let del = Number($(this).next().val());
        /*增加数量*/
        if (del <= 1){
            mui.toast('亲，不能在减了哦？');
            return;
        }
        del--;
        $(this).next().val(del);
    });
    
    /*点击复选框的时候计算*/
    body.on('click' , '.lt_cart_check' , function () {
        cartMoney();
    });
});

/*封装我的初始化页面的数据*/
const cartData = function (callback) {
    lt.loginAjax({
        url : '/cart/queryCart',
        success : function (cartRes) {
            callback && callback(cartRes);
        }
    });
};

/*封装我的计算总额.not('.lt_cart_check:checked')*/
const cartMoney = function () {
    let zoNum = 0;
    /*获取的选中的复选框*/
    let che = $('.lt_cart_check:checked');
    // console.log(che);
    $(che).each(function (index , item) {
            /*获取我存的值*/
            let itObj = item.dataset;
            zoNum += (Number(itObj.num) * Number(itObj.price));
    });
    $('.lt_cart_zoMoney').text(zoNum.toFixed(2));
};