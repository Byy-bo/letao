$(function () {
    /*获取到各个input*/
    let recipients = $('[name="recipients"]');
    let postcode = $('[name="postcode"]');
    let address = $('[name="address"]');
    let addressDetail = $('[name="addressDetail"]');


    /*初始化popPicker组件*/
    let city = new mui.PopPicker({
        /*显示列表数*/
        layer : 3
    });

    /*设置数据*/
    city.setData(cityData);

    /*点击显示*/
    address.on('tap' , function () {
        city.show(function (item) {
            // console.log(item);
            /*判断是否是直辖市避免字段重复*/
            if (item[0].text === item[1].text) {
                item[1].text = '';
            }
            /*赋值*/
            $(this).val(item[0].text + item[1].text + item[2].text);
        }.bind(this));
    });

    /*判断是否有我的id传过来，从而判断是否是我的修改收货地址*/
    if (location.href.indexOf('?id=') !== -1) {
        /*拿到我的id*/
        let addAreId = lt.myLocData().id;
        /*修改我的标题*/
        $('.lt_header h3').text('管理收货地址');
        /*拿数据渲染页面*/
        lt.loginAjax({
            url : '/address/queryAddress',
            success : function (cxAreRes) {
                let newArr = cxAreRes.find(function (item , i) {
                    return item.id = addAreId;
                });
                recipients.val(newArr.recipients);
                postcode.val(newArr.postCode);
                address.val(newArr.address);
                addressDetail.val(newArr.addressDetail);
                /*点击确认*/
                areQr('/address/updateAddress' , '修改成功' , addAreId);
            }
        });
    }else{
        /*修改我的标题*/
        $('.lt_header h3').text('添加收货地址');
        /*点击确认*/
        areQr('/address/addAddress' , '添加成功');
    }
});

/*封装点击确认*/
const areQr = function (url , text , addAreId) {
    /*点击确认*/
    $('.lt_addAdr_qr a').on('tap' , function () {
        /*获取到各个input的值并且存到对象当中*/
        let addAdrObj = {
            id : addAreId || '',
            recipients : $('[name="recipients"]').val().trim(),
            postcode : $('[name="postcode"]').val().trim(),
            address : $('[name="address"]').val().trim(),
            addressDetail : $('[name="addressDetail"]').val().trim()
        };

        /*进行非空校验*/
        /*收货人*/
        if (!addAdrObj.recipients) return mui.toast('收货人不能为空');
        /*邮编*/
        if (!addAdrObj.postcode) return mui.toast('邮编不能为空');
        /*省市区*/
        if (!addAdrObj.address) return mui.toast('省市区不能为空');
        /*详细地址*/
        if (!addAdrObj.addressDetail) return mui.toast('详细地址不能为空');

        /*发起添加收货地址请求*/
        lt.loginAjax({
            url : url,
            type : 'post',
            data : addAdrObj,
            success : function (adAreRes) {
                if (adAreRes.success){
                    mui.toast(text);
                    /*跳转到收货地址管理*/
                    setTimeout(function () {
                        location.href = lt.areUrl;
                    } , 600);
                }else {
                    mui.toast('服务器繁忙！');
                }
            }
        });
    });
};

