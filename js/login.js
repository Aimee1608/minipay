    $(function(){
        var SaveInfo = {
            phone: null,
            phoneCode: null,
            phoneReg: false,
            phoneCodeReg: false,
            getCodeReg: false,
            timeReg: false,
            init: function () {
                SaveInfo.inputReg();
                $('#getCode').on('click', SaveInfo.getCodeFun);
                SaveInfo.submiteFun();
            },
            inputReg: function () { // 手机号验证
                $('input[name="phone"]').blur(function () {
                    var reg = /^1[34578]\d{9}$/;
                    var val = $(this).val();
                    if (isNaN(parseFloat(val))) {
                        //$(this).val('');
                        $(this).attr('placeholder', '请您正确输入手机号');
                        SaveInfo.phoneReg = false;
                    } else {
                        if (reg.test(val)) {
                            SaveInfo.phoneReg = true;

                        } else {
                            //$(this).val('');
                            //$(this).parent().addClass('red');
                            $(this).attr('placeholder', '请您正确输入手机号');
                            SaveInfo.phoneReg = false;
                        }
                    }

                });
                $('input[name="phoneCode"]').blur(function () {
                    var reg = /^\d{6}$/;
                    var val = $(this).val();
                    if (reg.test(val)) {
                        SaveInfo.phoneCodeReg = true;
                    } else {
                        SaveInfo.phoneCodeReg = false;
                    }
                })
            },
            getCodeFun: function () { //发送验证码
                if (SaveInfo.phoneReg) {
                    SaveInfo.timeReg = true;
                    SaveInfo.getCodeReg = true;
                    SaveInfo.phone=$("#phone").val();
                    $.ajax({
                        type: 'GET',
                        url: initUrl + 'sendSmsCode',
                        data: {
                            phone:SaveInfo.phone
                        },
                        dataType: 'json',
                        success: function (mag) {
                            console.log(mag);
                            if(mag.code === 1001) {
                                SaveInfo.phoneCode = mag.data;
                                var num = 60;
                                $('#getCode').off('click');
                                $('#getCode').html(num + '秒');
                                var codeTimer = setInterval(function () {
                                    num--;
                                    $('#getCode').html(num + '秒');
                                    if (num < 0) {
                                        $('#getCode').html('重新获取');
                                        $('#getCode').on('click', SaveInfo.getCodeFun);
                                        SaveInfo.timeReg = false;
                                        clearInterval(codeTimer);
                                    }
                                }, 1000)
                            }else{
                                winBombBox("提示","获取验证码失败","确定");
                            }
                        },
                        error: function(msg){
                            winBombBox("提示","获取验证码失败","确定");
                        }
                    });

                }else{
                    winBombBox("提示","请先输入手机号","确定");
                }
            },
            submiteFun: function () {
                $('.goOrder').click(function () { //开始验证
                    if(SaveInfo.phoneCode == null) {
                        // showalert("请先获取验证码!");
                        winBombBox("提示","请先获取验证码","确定");
                        return false;
                    }
                    if (SaveInfo.phoneCode != null && $("#phoneCode").val() == ""){
                        // showalert("请输入验证码!");
                        winBombBox("提示","请输入验证码","确定");
                        return false;
                    }
                    $.ajax({
                        type: 'GET',
                        url: initUrl + 'verifySmsCode',
                        data: {
                            phone:SaveInfo.phone,
                            code:$("#phoneCode").val()
                        },
                        dataType: 'json',
                        success: function (msg) {
                            // console.log(s,"8748548548")
                            if(msg.code == 1001) {
                                //console.log(msg);
                                localStorage.setItem('token',msg.token);
                                window.location.href = 'orderInfo.html?user_code=' + msg.data;
                            } else {
                                // showalert("验证码有误!")
                                winBombBox("提示","验证码有误","确定");
                            }
                        }
                    });
                });
            }
        };
        SaveInfo.init();
    });
