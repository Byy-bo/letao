$(function () {
    /*此地方用于我后面的下拉加载功能*/
    window.page = 0;

    /*拿到对应的num*/
    let objNum = lt.myLocData();
    /*设置对应的input的val值*/
    $('#ltSearch input').val(objNum.num);

    // /*请求数据*/
    proData({
        proName : objNum.num,
        page : 1,
        pageSize : 4
    } , function (proRes) {
        // console.log(proRes);
        /*使用模板引擎渲染*/
        /*添加到元素当中*/
        $('.lt_ydSh_goods').html(template('proTem' , proRes));
    });

    /*点击搜索渲染请求*/
    $('#ltSearch button').on('tap' , function () {
        // /*获取到我的表单的val值*/
        // const seaVal = $(this).prev().val().trim();
        // //非空校验
        // if (seaVal.length === 0) {
        //     mui.toast('请输入关键字!');
        //     return;
        // }
        // /*拿到之后调用我封装好的函数进行渲染*/
        // proData({
        //     proName : seaVal,
        //     page : 1,
        //     pageSize : 4
        // } , function (proRes) {
        //     console.log(proRes);
        //     /*使用模板引擎渲染*/
        //     /*添加到元素当中*/
        //     $('.lt_ydSh_goods').html(template('proTem' , proRes));
        // });

        /*重置我的下拉刷新也就是我在调用一次下拉刷新里面的回调函数*/
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    });

    /*点击升序降序*/
    $('.lt_pro_sjSj a').on('tap' , function () {
        /*先完成样式和箭头的切换*/
        /*判断是否有选中的样式*/
        if ($(this).parent().hasClass('sj_active')) {
            /*我就可以调整我的上下箭头*/
            let spanS = $(this).find('span');
            if (spanS.hasClass('fa-angle-down')){
                spanS.removeClass('fa-angle-down').addClass('fa-angle-up');
            }else {
                spanS.removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }else {
            /*对应的添加类*/
            $(this).parent().addClass('sj_active').siblings().removeClass('sj_active').find('span')
                .removeClass('fa-angle-up').addClass('fa-angle-down');
        }

        /*然后在进行升序降序的排列*/
        /*拿到我存的自定义属性*/
        // let type = $(this).attr('data-type');
        // // console.log(type);
        // /*判断去看是升序还是降序*/
        // let mySj = $(this).find('span').hasClass('fa-angle-down') ? 2 : 1;
        // let sjData = {
        //     proName : $('#ltSearch input').val().trim(),
        //     page : 1,
        //     pageSize : 4
        // };
        // /*添加升降*/
        // sjData[type] = mySj;
        // /*请求渲染*/
        // proData(sjData , function (proRes) {
        //     console.log(proRes);
        //     /*使用模板引擎渲染*/
        //     /*添加到元素当中*/
        //     $('.lt_ydSh_goods').html(template('proTem' , proRes));
        // });
        /*重置我的下拉刷新也就是我在调用一次下拉刷新里面的回调函数*/
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    });

    /*下拉刷新 ， 上拉加载*/
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            /*下拉刷新*/
            down : {
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                callback : function () {
                    setTimeout(function () {
                        /*刷新完成渲染我的数据*/
                        /*拿到我存的自定义属性*/
                        let type = $('.lt_pro_sjSj li.sj_active a').attr('data-type');
                        // console.log(type);
                        /*判断去看是升序还是降序*/
                        let mySj = $('.lt_pro_sjSj li.sj_active').find('span').hasClass('fa-angle-down') ? 2 : 1;
                        /*获取到我的表单的val值*/
                        const seaVal = $('#ltSearch input').val().trim();
                        //非空校验
                        if (seaVal.length === 0) {
                            mui.toast('请输入关键字!');
                            $('.lt_ydSh_goods').html('');
                            /*释放下拉刷新*/
                            this.endPulldownToRefresh();
                            return;
                        }
                        let sjData = {
                            proName : seaVal,
                            page : 1,
                            pageSize : 4
                        };
                        /*添加升降*/
                        sjData[type] = mySj;
                        /*拿到之后调用我封装好的函数进行渲染*/
                        proData(sjData , function (proRes) {
                            console.log(proRes);
                            /*使用模板引擎渲染*/
                            /*添加到元素当中*/
                            $('.lt_ydSh_goods').html(template('proTem' , proRes));
                        });
                        /*释放下拉刷新*/
                        this.endPulldownToRefresh();
                        // 重置我的上拉加载
                        this.refresh(true);
                    }.bind(this) , 600)
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            /*上拉加载*/
            up : {
                callback : function () {
                    let that = this;
                    setTimeout(function () {
                        window.page++;
                        /*拿到我存的自定义属性*/
                        let type = $('.lt_pro_sjSj li.sj_active a').attr('data-type');
                        // console.log(type);
                        /*判断去看是升序还是降序*/
                        let mySj = $('.lt_pro_sjSj li.sj_active').hasClass('fa-angle-down') ? 2 : 1;
                        let sjData = {
                            proName : $('#ltSearch input').val().trim(),
                            page : window.page,
                            pageSize : 4
                        };
                        /*添加升降*/
                        sjData[type] = mySj;
                        /*请求渲染*/
                        proData(sjData , function (proRes) {
                            console.log(proRes);
                            /*判断是否继续的加载*/
                            if (proRes.data.length){
                                /*默认false，表示还可以继续加载*/
                                that.endPullupToRefresh();
                            }else {
                                that.endPullupToRefresh(true);
                            }
                            /*使用模板引擎渲染*/
                            /*添加到元素当中*/
                            $('.lt_ydSh_goods').append(template('proTem' , proRes));
                        });
                    } , 500)
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });

    $('.lt_ydSh_goods').on('tap' , 'a' , function () {
        /*拿到我存的id值*/
        /*跳转*/
        location.href ='proDetail.html?proDeId=' + $(this).attr('data-id');
    });
});

/*封装获取请求数据*/
const proData = function (objNum , callback) {
    $.ajax({
        url : '/product/queryProduct',
        type : 'get',
        dataType : 'json',
        data : objNum,
        success : function (proRes) {
            window.page = proRes.page;
            callback && callback(proRes);
        }
    });
};