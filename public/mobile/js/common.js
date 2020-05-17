$(function () {
    //初始化区域滚动
    mui('.mui-scroll-wrapper').scroll({
        indicators: false, //不显示滚动条
    });

    //获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
    });

    /*头部的返回按钮*/
    $('.lt_header a.left').on('tap' , function () {
        history.back();
    });
});

var lt = {};

/*登录*/
lt.loginUrl = 'login.html';
/*会员中心*/
lt.personUrl = 'personal.html';
/*购物车*/
lt.cartUrl = 'cart.html';
/*收货地址管理*/
lt.areUrl = 'address.html';

/*封装拿我的路径后面问好数据并且转化为对象格式的数据*/
lt.myLocData = function () {
  let obj = {};
  let sea = decodeURI(location.search);
  if (sea){
      /*去掉我的问号*/
      sea = sea.replace('?' , '');
      /*去掉并且符号*/
      let seaArr = sea.split('&');
      /*遍历 的去分割添加*/
      seaArr.forEach(function (item , index) {
          let itemArr = item.split('=');
          /*添加到对象*/
          obj[itemArr[0]] = itemArr[1];
      });
      return obj;
  }

};

/*封装我的需要登录的请求*/
lt.loginAjax = function (loginObj) {
    $.ajax({
       url : loginObj.url || '#',
       type : loginObj.type || 'get',
       data : loginObj.data || '',
       dataType : loginObj.dataType || 'json',
       success : function (adcRes) {
           if (adcRes.error === 400){
                location.href = lt.loginUrl + '?reUrl=' + location.href;
                return;
           }
           loginObj.success && loginObj.success(adcRes);
       }
    });
};

/*处理我的鞋码，方便我的模板简介语法*/
lt.temSize = function (size) {
    let newArr = [];
    let sizeARR = size.split('-');
    for (let i = 0; i <= (Number(sizeARR[1]) - Number(sizeARR[0])); i++) {
        newArr.push(Number(sizeARR[0]) + i);
    }
    return newArr;
};

/*封装获取我的认证码的请求*/
lt.hqRz = function (rzObj) {
    $.ajax({
        url : rzObj.url || '#',
        type : rzObj.type || 'get',
        data : rzObj.data || '',
        dataType : rzObj.dataType || 'json',
        success : function (upPassRes) {
            /*定义一个变量控制时间*/
            let time = 60;
            /*拿到我vCode*/
            let vCode = upPassRes.vCode;
            /*直接给我的input赋值*/
            rzObj.myVpCode.val(vCode);
            /*改变我的内容*/
            rzObj.myRz.text(time + '秒后再次获取');
            /*改变样式*/
            rzObj.myRz.addClass('a_disabled');
            /*定义定时器改变时间*/
            let timer = setInterval(function () {
                /*时间减少*/
                time--;
                /*改变我的内容*/
                rzObj.myRz.text(time + '秒后再次获取');
                /*判断进行还原*/
                if (time <= 0){
                    clearInterval(timer);
                    /*改变我的内容*/
                    rzObj.myRz.text('获取认证码');
                    /*改变样式*/
                    rzObj.myRz.removeClass('a_disabled');
                }
            } , 1000);
        }
    });
};