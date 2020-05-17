$(function () {
    //通过key获取到本地缓存
    const seaList = localStorage.getItem('seaList') || '[]';
    //转化我的获取到的本地缓存的字符串
    const seaArr = JSON.parse(seaList);

    /*函数加载的时候调用*/
    seaJl(seaArr);

    //点击设置缓存
    $('#ltSearch').on('submit' , function (e) {
        //阻止我的默认提交事件
        e.preventDefault();
        /*获取到我的表单的val值*/
        const seaVal = $(this).find('input').val().trim();
        //非空校验
        if (!seaVal) {
            mui.toast('请输入关键字!');
            return;
        }
        /*判断是否有重复的*/
        if (seaArr.length !== 0 ) {
            const cfIndex = seaArr.findIndex(function (item , i) {
                return item.num === seaVal;
            });
            /*删除原来的*/
            console.log(cfIndex);
            if (cfIndex !== -1 ){
                seaArr.splice(cfIndex , 1);
            }
        }
        /*判断是否有10条记录*/
        if (seaArr.length >= 10) {
            seaArr.splice((seaArr.length - 1) , 1);
        }
        //添加到数组
        seaArr.unshift({"num" : seaVal});
        //更新我的本地缓存
        localStorage.setItem('seaList' , JSON.stringify(seaArr));
        //渲染页面
        seaJl(seaArr);
        //跳转到我的搜索列表
        location.href = '/mobile/product.html?num=' + seaVal;
        /*清空我的input值*/
        $(this).find('input').val('');
    });

    //删除
    //添加我的委托事件
    $('.lt_sea_ssJl_bo').on('tap' , 'span' , function () {
        /*拿到我的存的index*/
        const index = $(this).attr('data-index');
        /*删除我数组里面的元素*/
        seaArr.splice(Number(index) , 1);
        /*更新我的本地缓存*/
        localStorage.setItem('seaList' , JSON.stringify(seaArr));
        //渲染页面
        seaJl(seaArr);
    });

    /*清空*/
    $('.lt_sea_ssJl_to a').on('tap' , function () {
        /*清空数组*/
        seaArr.splice(0 , seaArr.length);
        /*更新我的本地缓存*/
        localStorage.removeItem("seaList");
        //渲染页面
        seaJl(seaArr);
    });

    /*点击历史记录跳转*/
    /*注册事件委托*/
    $('.lt_sea_ssJl_bo').on('tap' , 'a' , function () {
        /*拿到我对应的存的num*/
        const num = $(this).attr('data-num');
        //跳转到我的搜索列表
        location.href = '/mobile/product.html?num=' + num;
    });
});

//封装渲染函数
const seaJl = function (data) {
    /*获取到记录容器*/
    const jlBox = $('.lt_sea_ssJl ul');
    /*先清空*/
    jlBox.empty();
    /*使用我的模板引擎*/
    /*添加到我的元素当中*/
    jlBox.append(template('seaTem' , {seaData : data}));
};