/**
 * 高端 javascript - 懂车帝App项目 - 创建订单去支付页面js
 * @copyright  Copyright (c) 2018 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Cardili.php 2018-01-07 04:56:52
 */

  //** 定义全局变量 **//
    var carObjData = new Object(); //车源列表信息

    /**
     * 过滤html源码 调用eavl去执行脚本代码
     * @param  {[type]} html [第三发支付html脚本程序]
     * @return {[type]}      [description]
     */
    function executeScript(html) {
        var reg = /<script[^>]*>([^\x00]+)$/i;
        //对整段HTML片段按<\/script>拆分
        var htmlBlock = html.split("<\/script>");
        //console.log(htmlBlock);
        for (var i in htmlBlock) {
            var blocks;//匹配正则表达式的内容数组，blocks[1]就是真正的一段脚本内容，因为前面reg定义我们用了括号进行了捕获分组
            if (blocks = htmlBlock[i].match(reg)) {
                //清除可能存在的注释标记，对于注释结尾-->可以忽略处理，eval一样能正常工作
                var code = blocks[1].replace(/<!--/, '');
                try {
                    eval(code) //执行脚本
                } catch (e) {
                    return false;
                }
            }
        }
    }

//*************************** 获取车源列表信息数据 start ***************************//
    function getAllCarSources() {
      $.ajax({
          type: 'get',
          url: initUrl + 'GetAllCarSources',
          async: false,
          data: '',
          dataType:'json',
          success: function(msg) {
            if(msg.code == 1001) {
              carObjData = msg; //进行赋值全局变量
              _getAllCarSources();
            } else {
              alert("获取车型数据错误");
            }
          }
      })
    }
    var Stock;//库存
    /** 车型下拉框赋值事件 **/
    function _getAllCarSources() {
      //车型的列表
      var typehtml = "<option value='0'>车型</option><option value='"+carObjData.data.data[0].CarName+"'>"+carObjData.data.data[0].CarName+"</option><option value='"+carObjData.data.data[1].CarName+"'>"+carObjData.data.data[1].CarName+"</option>";
      var carmatObj,carcolorObj;	//布料 和颜色 的对象暂时储存
      $("#cartype").html(typehtml);
      //车型改变时，颜色改变
      $("#cartype").change(function(e) {
        //车型改变时，后面的颜色和布料清空，避免错乱
          $("#carmat").html("<option value='0'>选择内饰</option>");
          $("#carcolor").html("<option value='0'>选择外观</option>");
          $('#btn-userInfo').removeClass('noStock').addClass('btn-move').html('￥4000|预付款');
        //判断选中的车型，给颜色赋值
        if($("#cartype option:selected").val()==carObjData.data.data[0].CarName){
          carcolorObj = carObjData.data.data[0].AppearanceColor;
            $("#price").html(carcolorObj[0].InnerColor[0].NewCarMarketPrice);
            //console.log(carcolorObj[0].InnerColor[0].NewCarMarketPrice);
        }else{
          carcolorObj = carObjData.data.data[1].AppearanceColor;
            $("#price").html(carcolorObj[1].InnerColor[0].NewCarMarketPrice);
        }
          //console.log(carcolorObj[0].InnerColor[0].NewCarMarketPrice);
        //第一个提示选项
        var colorhtml = "<option value='0'>选择外观</option>";
        for(var i=0;i<carcolorObj.length;i++){
          colorhtml+="<option value='"+carcolorObj[i].AppearanceColor+"'>"+carcolorObj[i].AppearanceColor+"</option>";
        }
        $("#carcolor").html(colorhtml);
      });
      //颜色改变时，布料改变
      $("#carcolor").change(function(e){
        //颜色改变，布料清空
        $("#carmat").html("<option value='0'>选择内饰</option>");
        for(var i=0;i<carcolorObj.length;i++){
          //判断颜色 ，给布料赋值
          if($("#carcolor option:selected").val() == carcolorObj[i].AppearanceColor){
            carmatObj=carcolorObj[i].InnerColor;
            var mathtml = "<option value='0'>请选择内饰</option>";
            for(var n = 0;n<carmatObj.length;n++){
              mathtml += "<option value='"+carmatObj[n].Id+"'>"+carmatObj[n].InnerColor+"</option>";
            }
            $("#carmat").html(mathtml);
          }
        }
      });

      //布料改变时，显示价格
      $("#carmat").change(function(e){
        for( var i = 0; i < carmatObj.length; i ++ ) {
            Stock = carmatObj[i].Stock;
          if(carmatObj[i].Stock <= 0) {//库存不足，禁止提交
              winBombBox("提示","已售罄，请选择其他宝贝","确定");
            //按钮置灰
              $('#btn-userInfo').removeClass('btn-move').addClass('noStock').html('已售罄');
            return false;

          }else{
              $('#btn-userInfo').removeClass('noStock').addClass('btn-move').html('￥4000|预付款');
          }
          //判断颜色 ，给布料赋值
          if($("#carmat option:selected").val() == carmatObj[i].Id){
            $("#price").html(carmatObj[i].NewCarMarketPrice);
          }
        }
      });
      //设置提示选项不可选，也可以用以前的写法
      $("select").on('touchstart',function(e){
        // console.log(e,$(this));
        $(this).find("option[value='0']").attr('disabled',true);
      })
    }
    $('#ddlCity').change(function(e){
        if($("#ddlCity option:selected").val()=='北京市'){
            $("#agency").html('<option value="麟达伟业汽车销售有限公司">麟达伟业汽车销售有限公司</option>').addClass('changed');
        }else{
            $("#agency").html('<option value="上海欧萌汽车销售有限公司">上海欧萌汽车销售有限公司</option>').addClass('changed');
        }
    });

  //*************************** 获取车源列表信息数据 End ***************************//

    /*** 用户开始下订单 以及 支付 ***/
    var SaveInfo = {
        username:null,  //姓名
        phone:null, //电话
        city_name:null, //城市
        carsource_id:0, //车源id
        agency:null, //经销商
        checked:false,
        order_code:null, //订单编号
        user_code:null,  //用户编号
        openid:null,
        init:function(){
            //获取来源渠道
            function GetQueryString(name){
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if(r!=null&&r!=undefined)return  unescape(r[2]); return null;
            }
            SaveInfo.source = GetQueryString('source') == null ? '未知来源' : GetQueryString('source');
            SaveInfo.updateView();
        },
        updateView:function(){
            SaveInfo.inputReg(); //先进行验证表单
            SaveInfo.submit(); //开始触发提交事件

            $('select').on('touchstart',function(){ //触摸事件
                $(this).find('option[value="-1"]').attr('disabled','disabled');
            });
            $('select').change(function(){
                $(this).addClass('changed');
            })
        },
        inputReg:function(){ //字段验证规则
            /** 姓名验证 **/
            $('input[name="username"]').blur(function() {
                var val = $(this).val();
                var reg =/^[a-zA-Z\u4E00-\u9FA5]*$/;
                //console.log(reg.test(val));
                if(val!=""&&val!="test"&&val!="空白"&&val!="Unknown"&&val!="未知"&&val!="未告知"&&this.validity.valid&&reg.test(val)){
                    //$(this).parent().removeClass('red');
                    $(this).attr('placeholder','姓名');
                    //$(this).removeClass('inputerror');
                } else {
                    //$(this).parent().addClass('red');
                    $(this).val('');
                    $(this).attr('placeholder','请您正确输入姓名');
                    //$(this).addClass('inputerror');
                }
            });

            /** 手机号验证 **/
            $('input[name="phone"]').blur(function() {
                var reg = /^1[34578]\d{9}$/;
                var val = $(this).val();
                if(isNaN(parseFloat(val))) {
                    $(this).val('');
                    $(this).attr('placeholder','请您输入手机号');
                } else {
                    if(reg.test(val)) {
                        $(this).attr('placeholder','手机号');
                    } else {
                        $(this).val('');
                        $(this).attr('placeholder','请您正确输入手机号');
                    }
                }
            });
        },
        clickReg:function() { //验证表单是否为空
            var usernameReg = false //用户名
               ,phoneReg = false //手机号
               ,cityNameReg = false //城市
               ,agencyReg = false //经销商
               ,carmatReg = false; //车型内饰

            /** 姓名验证 **/
            var inputUsername = document.getElementById('username');
            if(inputUsername.validity.valid) {
                usernameReg = true;
            } else {
                usernameReg = false;
            }

            /** 手机号验证是否合法 **/
            var reg = /^1[34578]\d{9}$/;
            if(reg.test($('input[name="phone"]').val())) {
                phoneReg = true;
            } else {
                phoneReg = false;
            }

            /** 下拉菜单验证是否选择 **/
            function selectReg(selectName) {
                var val = $('select[name='+selectName+'] option:selected').val();
                var reg;
                if(val && val != 0) {
                    reg = true;
                } else {
                    reg = false;
                }
                return reg;
            }

            cityNameReg = selectReg('ddlCity'); // 城市是否选择
    		agencyReg = selectReg('agency'); //经销商是否选择
            carmatReg = selectReg('carmat'); //车型内饰是否选择
            var total = usernameReg&&phoneReg&&cityNameReg&&agencyReg&&carmatReg;
            //console.log(usernameReg,phoneReg,cityNameReg,agencyReg,carmatReg);
            //console.log(total);
            return total;
            //return true;
        },
        /** 开始提交 **/
        submit:function() {
            /** 1. 先进行创建订单 **/
            $('#btn-userInfo').on('click',function(e){
    		      // e.preventDefault(); //阻止元素发生默认行为
                if(Stock<=0){
                    return false;
                }
              if(SaveInfo.clickReg()){ //再次验证姓名手机号以及下拉框是否为空
                $('.loading').show();
                //先进行赋值全局变量
                SaveInfo.username = $('input[name="username"]').val();
                SaveInfo.phone = $('input[name="phone"]').val();
                SaveInfo.city_name = $('select[name="ddlCity"] option:selected').val();
                SaveInfo.agency = $('select[name="agency"] option:selected').val();
                SaveInfo.carsource_id = $('select[name="carmat"] option:selected').val();
                SaveInfo.cartype = $('select[name="cartype"] option:selected').val()+" , "+$('select[name="carcolor"] option:selected').val()+" , "+$('select[name="carmat"] option:selected').html();
                //拼接参数 调用接口使用
                var xyData = {
                     user_name: SaveInfo.username
                    ,phone: SaveInfo.phone
                    ,carsource_id: SaveInfo.carsource_id
                    ,dealer_name: SaveInfo.agency
                    ,city_name: SaveInfo.city_name
                    ,carType: SaveInfo.cartype
                };


                /** 发起Ajax调用 **/
                $.ajax({
                    type:'get',
                    url: initUrl + 'CreateOrder',
                    data:xyData,
                    dataType:'json',
                    success:function(msg){
                      //console.log(msg);
                      if(msg.code == 1001) { // 请求成功
                            $('.loading').hide();
                           SaveInfo.user_code = msg.data.phone;
                           SaveInfo.order_code = msg.data.order_code;
                            window.location.href="pay.html?pay=1&user_code="+msg.data.phone+"&order_code="+msg.data.order_code;

                        } else {
                          $('.loading').hide();
                          winBombBox("提示","创建订单失败","确定");
                        }
                    },
                    error:function() {
                      winBombBox("提示","网络异常，请稍后重试！","确定");
                    }
                });
             } else {
                $('.loading').hide();
                //  $(".error").show();
                 winBombBox("提示","请完善信息","确定");
             }
          });
    	}
    };

$(function() {
    SaveInfo.init();
    getAllCarSources(); //获取车源信息

});
