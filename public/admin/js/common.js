$(function () {
    /*对应的添加类*/
    $('.ht_flGl').on('click' , function () {
        /*对应的父亲添加类*/
        $(this).parent().toggleClass('activeOne').siblings().removeClass('activeOne');
    });

    /*左侧的导航显示隐藏*/
    $('.ht_nav_flag').click(function () {
        /*隐藏导航*/
        $('.ht_index_le').toggleClass('nWidth');
        /*添加类*/
        $('.ht_index_ri').toggleClass('mpWidth');
    });

    /*退出操作*/
    $('#ht_logOut').click(function () {
        /*发起退出请求*/
        htLogOut(function (logOutRes) {
            if (logOutRes.success) {
                /*退出成功跳转到登录页面*/
                location.href = 'login.html';
            }else {
                alert('服务器繁忙，请稍后再试！')
            }
        });
    });

    /*分类子菜单的点击效果*/
});

/*封装我的退出请求*/
const htLogOut = function (callback) {
    $.ajax({
        url : '/employee/employeeLogout',
        type : 'get',
        dataType : 'json',
        success : function (logOutRes) {
            callback && callback(logOutRes);
        }
    });
};



// /*封装操作分页*/
// let htInitPageT = function (Res , htPage , callback) {
//     /*操作分页*/
//     $('.pagination').bootstrapPaginator({
//         /*声明操作的版本*/
//         bootstrapMajorVersion : 3,
//         /*设置当前页面*/
//         currentPage : htPage,
//         /*设置页码数*/
//         numberOfPages : 2,
//         /*设置总页数*/
//         totalPages : Math.ceil(Res.total / Res.size),
//         /*控制按钮的显示文字*/
//         itemTexts : function (type , page , current) {
//             switch (type) {
//                 case 'next' :
//                     return '下一页';
//                     break;
//                 case 'prev' :
//                     return '上一页';
//                     break;
//                 case 'first' :
//                     return '首页';
//                     break;
//                 case 'last' :
//                     return '尾页';
//                     break;
//                 case 'page' :
//                     return page;
//                     break;
//             }
//         },
//         //显示提示信息
//         tooltipTitles: function (type, page, current) {
//             switch (type) {
//                 case 'next' :
//                     return '下一页';
//                     break;
//                 case 'prev' :
//                     return '上一页';
//                     break;
//                 case 'first' :
//                     return '首页';
//                     break;
//                 case 'last' :
//                     return '尾页';
//                     break;
//                 case 'page' :
//                     return page;
//                     break;
//             }
//         },
//         /*改变页码的时候*/
//         onPageChanged : function (event, oldPage, newPage) {
//             /*改变page*/
//             htPage = newPage;
//             /*再次渲染*/
//             callback();
//         }
//     });
// };