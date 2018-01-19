/**
 * 高端 javascript - 懂车帝App项目 - 用户普通留资js
 * @copyright  Copyright (c) 2018 QIN TEAM (http://www.qlh.com)
 * @license    GUN  General Public License 2.0
 * @version    Id:  Cardili.php 2018-01-06 18:56:52
 */
/*** 用户注册留资 ***/
var SaveInfo = {
    username:null,//name
    sex:null,//sex
    phone:null,//mobile
    cartype:null,//car_type
    buytime:'未选择',//buy_time
    province:null,//province,dealer_name省份，城市，经销商（1,2,3）
    city:null,//city,无
    angency:null,//
    source:'未知来源',//source,source,123
    cartime:null,
    chart:'user_cardili',//必传状态码
    draw_id:0,//活动id，默认为0
    init:function(){
        function GetQueryString(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null&&r!=undefined)return  unescape(r[2]); return null;
        }
        SaveInfo.source = GetQueryString('source')==null?'未知来源':GetQueryString('source');
        SaveInfo.updateView();
    },
    updateView:function(){
        SaveInfo.inputReg();
        SaveInfo.submit();
        $('select').on('touchstart',function(){
            $(this).find('option[value="0"]').attr('disabled','disabled');
        });
        $('select').change(function(){
            $(this).addClass('changed');
        })
    },
    inputReg:function(){
        $('input[name="username"]').blur(function(){
            var val = $(this).val();
            var reg =/^[a-zA-Z\u4E00-\u9FA5]*$/;
            console.log(reg.test(val));
            if(val!=""&&val!="test"&&val!="空白"&&val!="Unknown"&&val!="未知"&&val!="未告知"&&this.validity.valid&&reg.test(val)){
                //$(this).parent().removeClass('red');
                $(this).attr('placeholder','姓名');
                //$(this).removeClass('inputerror');
            }else{
                //$(this).parent().addClass('red');
                $(this).val('');
                $(this).attr('placeholder','请您正确输入姓名');
                //$(this).addClass('inputerror');
            }
        });


        $('input[name="phone"]').blur(function(){
            var reg = /^1[34578]\d{9}$/;
            var val = $(this).val();
            if(isNaN(parseFloat(val))){
                $(this).val('');
                //$(this).parent().addClass('red');
                $(this).attr('placeholder','请您输入手机号');
                //$(this).addClass('inputerror');
            }else{
                if(reg.test(val)){
                    //$(this).parent().removeClass('red');
                    $(this).attr('placeholder','手机号');
                    //$(this).removeClass('inputerror');

                }else{
                    $(this).val('');
                    //$(this).parent().addClass('red');
                    $(this).attr('placeholder','请您正确输入手机号');
                    //$(this).addClass('inputerror');
                }
            }

        });

    },
    clickReg:function(){
//      var usernameReg = false,phoneReg = false,provinceReg = false,cityReg = false,agencyReg = false;
		var usernameReg = false,phoneReg = false,provinceReg = false,cityReg = false,cartypeReg = false;
        var inputUsername = document.getElementById('username');
        if(inputUsername.validity.valid){
            usernameReg = true;
        }else{
            usernameReg = false;
        }
        var reg = /^1[34578]\d{9}$/;
        if(reg.test($('input[name="phone"]').val())){
            phoneReg = true;
        }else{
            phoneReg = false;
        }
        function selectReg(selectName){
            var val = $('select[name='+selectName+'] option:selected').val();
            var reg;
            if(val&&val!=0){
                reg = true;
            }else{
                reg = false;
            }
            return reg;

        }
        provinceReg = selectReg('ddlProvince');
        cityReg = selectReg('ddlCity');
         cartypeReg = selectReg('cartype');
//      agencyReg = selectReg('agency');
//      var total = usernameReg&&phoneReg&&provinceReg&&cityReg&&agencyReg;
        var total = usernameReg&&phoneReg&&provinceReg&&cityReg&&cartypeReg;
//      console.log(usernameReg,phoneReg,provinceReg,cityReg,agencyReg);
        console.log(usernameReg,phoneReg,provinceReg,cityReg,cartypeReg);
        console.log(total);
        return total;
        //return true;
    },
    submit:function(){
        $('#btn-userInfo').on('click',function(e){
            e.preventDefault();
            $(".alert").click(function(){
                $(".alertBox").fadeOut(300);
                $('.btn-userInfo').addClass('btn-move');
            });

            if(SaveInfo.clickReg()) {
                $('.loading').show();
                SaveInfo.username = $('input[name="username"]').val();
                SaveInfo.phone = $('input[name="phone"]').val();
                SaveInfo.cartype = $('select[name="cartype"] option:selected').val();
                SaveInfo.province = $('select[name="ddlProvince"] option:selected').val();

                SaveInfo.city = $('select[name="ddlCity"] option:selected').val();

                SaveInfo.sex = $('input[type=radio]:checked').val();

                // 发起Ajax调用
                var xyData = {
                    name:SaveInfo.username,
                    mobile:SaveInfo.phone,
                    sex:SaveInfo.sex,
//                  dealer_name:SaveInfo.province+','+SaveInfo.city+','+SaveInfo.agency,
					dealer_name:SaveInfo.province+','+SaveInfo.city,
                    car_type:SaveInfo.cartype,
                    buy_time:SaveInfo.buytime,
                    chart:SaveInfo.chart,
                    source:SaveInfo.source,
//                  more_name:SaveInfo.more_name,
//                  more_start:SaveInfo.more_start,
                    draw_id:SaveInfo.draw_id
                };

                $.ajax({
                    type:'post',
                    url:'https://h5api.xingyuanauto.com/userinfo',
                    //url:'http://flow.xingyuanauto.com/portframe_test/public/index.php/userinfo',
                    data:xyData,
                    dataType:'json',
                    success:function(msg) {
                      // console.log(msg);
                      $('.loading').hide();
                        if(msg.code==1001) {
                            $('.loading').hide();
                            winBombBox("提示","提交成功","确定");
							              // $(".success").show();
                            $('.btn-userInfo').removeClass('btn-move');
                            $('#userForm')[0].reset();
                            $('select').removeClass('changed');
                        } else if(msg.code==1003) {//已注册
                            $('.loading').hide();
                            winBombBox("提示","该手机号已经注册","确定");
                            $('.btn-userInfo').removeClass('btn-move');
                            $('#userForm')[0].reset();
                            $('select').removeClass('changed');
                            // $(".repace").show();
                        } else {
                            $('.loading').hide();
                            winBombBox("提示","提交失败","确定");
                            $('.btn-userInfo').removeClass('btn-move');
                            $('#userForm')[0].reset();
                            $('select').removeClass('changed');
                            // $(".error").show();
                        }
                    },
                    error: function(msg) {
                      $('.loading').hide();
                        winBombBox("提示","网络异常","确定");
                      $('.btn-userInfo').removeClass('btn-move');
                      $('#userForm')[0].reset();
                      $('select').removeClass('changed');
                    }
                });
            } else {
                winBombBox("提示","请完善信息","确定");
                $('.btn-userInfo').removeClass('btn-move');
            }

        });
    }
};

$(function(){
    //活动详情
  //ProvinceData.init('ddlProvince','ddlCity','agency');
	ProvinceData.init('ddlProvince','ddlCity');
    SaveInfo.init();

});
