/**
 * 高端 javascript - 懂车帝App项目 - 订单列表页面js
 * @copyright  Copyright (c) 2018 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Cardili.php 2018-01-07 04:56:52
 */



$(function(){
    $('.loading').show();
  var user_code = GetQueryString("user_code");
  var regToken = localStorage.getItem('token');
     //alert(user_code+"  777777  "+regToken);
  $.ajax({
    type: 'post',
    url: initUrl + 'getUsersOrder',
    data: {user_code:user_code,token:regToken},
    dataType: 'json',
    success: function(msg) {
      console.log(msg,"dsadsad");
      if(msg.code==1001){
        if(msg.data.length > 0) {
          var list = msg.data;
          var html = '';
          for(var i=0;i<list.length;i++) {
            html += '<ul>\
                <li>姓名：<span id="">'+list[i]['name']+'</span></li>\
                <li>电话：<span>'+list[i]['phone']+'</span></li>\
                <li>选择省份：<span id="">'+list[i]['city_name']+'</span></li>\
                <li>经销商：<span id="">'+list[i]['dealer_name']+'</span></li>\
                <li>车型：<span id="">'+list[i]['car_type']+'</span></li>\
                <li>外观颜色：<span id="">'+list[i]['apper_color']+'</span></li>\
                <li>内饰：<span id="">'+list[i]['interior']+'</span></li>\
                <li>订单号：<span>'+list[i]['order_code']+'</span></li>\
                <li>兑换码：<span>'+(list[i]['write_code']?list[i]['write_code']:0)+'</span></li>\
                <li>支付状态：<span>'+list[i]['pay_start_name']+'</span></li>\
                <li class="tip">交易状态：<span>'+list[i]['trade_start_name']+'</span></li>\
                <li>热线电话：<span>010-83020166 转 8417</span></li>\
                '+isPay(list[i]['trade_start']+'.'+list[i]['pay_start'],list[i]['phone'],list[i]['order_code'],list[i]['stock'],list[i]['lock_stock'])+'\
              </ul>';
          }
          //console.log(html);
          $('#beforeList').html(html);
        } else {
          var html = '<ul><li style="text-align:center;"><sapn>您当前没有订单</sapn></li></ul>';
          $('#beforeList').html(html);
        }
          $('.loading').hide();
      }else if(msg.code==1003){
          $('.loading').hide();
        winBombBox("提示","网络异常","确定");
      }else{
          $('.loading').hide();
          winBombBox("提示","网络异常","确定");
      }
    },
    error: function(msg) {
        $('.loading').hide();
      winBombBox("提示","网络异常","确定");
    }
  });



    /**
   * [isPay 判断状态]
   * @param  {[number]}  trade_start [交易状态]
   * @param  {[number]}  pay_start   [支付状态]
   * @return {Boolean} [标签]
   */
   function isPay(start,userCode,orderCode,stock,lock_stock) {
  // 	console.log(userCode);
  //    if(start==3.2){//订单进行中 已经支付,可退款
  //        return '<div class="goRefund getRefund"  data-user="'+userCode+'" data-order="'+orderCode+'">退款</div>';
  //    }else if(start==1.1||start==1.3){//订单已创建但是未支付
  //        if(stock==0){//库存不足无法继续支付
  //            return '<div class="goRefund " style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">库存不足</div>';
  //        }else{//还有库存可以继续支付
  //            return '<div class="goRefund goRefund-move getPay"  data-user="'+userCode+'" data-order="'+orderCode+'">去支付</div>';
  //        }
  //    }else if(start==5.2){//订单已创建但是未支付
  //        return '<div class="goRefund" style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">退款申请中</div>';
  //    }else if(start==6.2){//订单已创建但是未支付
  //        return '<div class="goRefund" style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">退款中</div>';
  //    }else if(start==7.2){//订单已创建但是未支付
  //        return '<div class="goRefund" style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">已退款</div>';
  //    }else if(start==8.2){//订单已创建但是未支付
  //        return '<div class="goRefund" style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">已发车</div>';
  //    }else if(start==4.2){//订单已创建但是未支付
  //        return '<div class="goRefund" style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">已完成</div>';
  //    }
        switch (start)
        {
            case "3.2":
                return '<div class="goRefund getRefund"  data-user="'+userCode+'" data-order="'+orderCode+'">退款</div>';
                break;
            case "5.2"://退款申请中
                return '<div class="goRefund" style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">退款申请中</div>';
                break;
            case "6.2"://退款中
                return '<div class="goRefund" style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">退款中</div>';
                break;
            case "7.2"://已退款
                return '<div class="goRefund" style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">已退款</div>';
                break;
            case "8.2"://已发车
                return '<div class="goRefund getRefund"   data-user="'+userCode+'" data-order="'+orderCode+'">退款</div>';
                break;
            case "4.2"://已完成
                return '<div class="goRefund getRefund"   data-user="'+userCode+'" data-order="'+orderCode+'">退款</div>';
                break;
            case "1.1":
            case "1.3":
                switch(stock)
                {
                    case 0://库存不足
                        switch (lock_stock)
                        {
                            case true:
                                return '<div class="goRefund goRefund-move getPay"  data-user="'+userCode+'" data-order="'+orderCode+'">去支付</div>';
                                break;
                            default:
                                return '<div class="goRefund " style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">已售罄</div>';
                        }
                        break;
                    default://去支付
                        return '<div class="goRefund goRefund-move getPay"  data-user="'+userCode+'" data-order="'+orderCode+'">去支付</div>';
                }
                break;
            default://订单错误
                return '<div class="goRefund " style="background:#C9C9C9;pointer-events: none;cursor: default;opacity: 0.6;"  data-user="'+userCode+'" data-order="'+orderCode+'">订单错误</div>';
        }
  }

    /** 发起退款 **/
    $(document).on('click','ul .getRefund',function(e){
        var _this = $(this);
        // confirm('确定退款吗');
        var user_code = $(this).data('user');
        var order_code =$(this).data('order');

        $(this).openWindow("提示","确定退款吗",['取消','确定'],function(result){
            //console.log(result);
            if(result=='确定'){

                $.ajax({
                    type:'post',
                    url: initUrl + 'CreateRefundApplication',
                    data:{user_code:user_code,order_code:order_code},
                    dataType:'json',
                    success:function(msg){
                        if(msg.code == 1001) {
                            //winBombBox("提示","申请退款成功","确定");
                            $(this).openWindow("提示","申请退款成功",['确定'],function(result){
                                //console.log(result);
                                if(result=='确定'){
                                    //_this.css("display","none");

                                    window.location.reload();
                                }
                            })

                        } else {
                            winBombBox("提示","申请退款失败","确定");
                        }
                    },
                    error:function() {
                        winBombBox("提示","网络异常，请稍后重试！","确定");
                    }
                })
            }else{
                winBombBox("提示","您已取消退款","确定");
                //window.location.back(); //刷新上一页
                //window.history.go(-1);
                //window.history.go(-1);location.reload(); //刷新上一页

                //location.reload();
            }
        })

    });

    /** 发起支付请求 **/
    $(document).on('click','ul .getPay',function(e) {
        // var _this = $(this)
        var user_code = $(this).data('user');
        var order_code = $(this).data('order');
        window.location.href="pay.html?user_code="+user_code+"&order_code="+order_code; //跳转到订单确认页面去支付
    });


  // 回到首页
  $('.gofirst').on('click',function(){
    window.location.href = "index.html?hmsr=mini10data";
  })
});
