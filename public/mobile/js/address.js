$(function () {
    /*获取节点*/
    let taskOne = $('#OA_task_1');
    /*地址的渲染*/
    lt.loginAjax({
        url : '/address/queryAddress',
        success : function (areRes) {
            /*通过模板引擎渲染*/
            /*并且添加到元素*/
            // console.log(areRes);
            taskOne.html(template('addressTem' , {
                areR : areRes
            }));
        }
    });

    /*点击删除*/
    taskOne.on('tap' , '.mui-btn-red' , function () {
        /*拿到我对应的id*/
        let scId = $(this).attr('data-id');
        let $this = $(this);
        lt.loginAjax({
            url : '/address/deleteAddress',
            type : 'post',
            data : {
                id :scId
            },
            success : function (adrScRes) {
                // console.log(adrScRes);
                if (adrScRes.success){
                    /*删除成功*/
                    mui.toast('删除成功');
                    /*删除dom*/
                    $this.parents('.mui-table-view-cell').remove();
                }else {
                    /*删除失败*/
                    mui.toast('服务器错误');
                }
            }
        });
    });
});