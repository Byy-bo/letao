$(function () {
    /*获取节点*/
    let conBox = $('.lt_con_box');
    /*定义一个当前内部的全局变量来记录的我库存数量*/
    let numS = 0;
    /*定义一个对象来记录我的选择*/
    let proDeObj = {};
    /*拿到我的拼接的id*/
    let pdId = lt.myLocData();
    // console.log(pdId);
    proDeData(pdId.proDeId , function (pdRes) {
        /*更新库存*/
        numS = Number(pdRes.num);
        /*处理我的size鞋码*/
        let newArr = lt.temSize(pdRes.size);
        // console.log(pdRes);
        /*操作模板引擎渲染*/
        $('.lt_con_box .mui-scroll').html(template('proDeTem' , {
            pdR : pdRes,
            newA : newArr
        }));
        //初始化区域滚动
        mui('.mui-scroll-wrapper').scroll({
            indicators: false, //不显示滚动条
        });

        //获得slider插件对象
        mui('.mui-slider').slider({
            interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
        });
    });

    /*尺码的选择*/
    conBox.on('tap' , '.cmDj' , function (e) {
        /*对应的a添加我的样式*/
        if ($(this).hasClass('cmActive')){
            $(this).removeClass('cmActive');
        }else {
            $(this).addClass('cmActive').siblings().removeClass('cmActive');
        }
    });

    /*数量的加减*/
    /*加*/
    conBox.on('click' , '.add_num' , function () {
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
    conBox.on('tap' , '.del_num' , function () {
        /*获取到文本框的数量*/
        let del = Number($(this).next().val());
        /*增加数量*/
        if (del <= 0){
            mui.toast('亲，你要给我送货吗？');
            return;
        }
        del--;
        $(this).next().val(del);
    });

    /*加入购物车*/
    $('.go_cart').on('tap' , function () {
        /*判断是否选择了尺码*/
        if (!$('.cmDj').hasClass('cmActive')){
            mui.toast('亲，请选择尺码！');
            return;
        }
        if (Number($('.go_num').val()) === 0){
            mui.toast('亲，请选择数量！');
            return;
        }
        /*拿到我的产品的id*/
        proDeObj.productId = lt.myLocData().proDeId;
        /*获取到我的尺码*/
        proDeObj.size = $('.lt_con_box .cmDj.cmActive').text();
        /*获取我的数量*/
        proDeObj.num = $('.lt_con_box .go_num').val();
        lt.loginAjax({
            url : '/cart/addCart',
            type : 'post',
            data : proDeObj,
            dataType : 'json',
            success : function (adcRes) {
                mui.confirm('亲,已经添加到购物车,去看看？', '友情提示', ['是', '否'], function(e) {
                    if (e.index === 0) {
                        location.href = lt.cartUrl;
                        return;
                    } else {
                        /*还原默认样式*/
                        $('.lt_con_box .cmDj').removeClass('cmActive');
                        $('.lt_con_box .go_num').val('0');
                        mui.toast('好的呢！');
                    }
                })
            }
        })
    });

});

/*封装请求我数据的函数*/
const proDeData = function (pDid , callback) {
    $.ajax({
        url : '/product/queryProductDetail',
        type : 'get',
        dataType : 'json',
        data : {
            id : pDid
        },
        success : function (pdRes) {
            callback && callback(pdRes);
        }
    });
};