define(["parabola", "jquery", "jquery-cookie"], function(parabola, $){
           function download(){
                sc_num();
                sc_msg();
                $.ajax({
                    type: 'get',
                    url: "../data/data.json",
                    success: function (arr) {
                        console.log(arr);
                        var html = ``;
                        for (var i = 0; i < arr.length; i++) {
                            html += `
                                    <li class="goods_item">
                                    <div class="goods_pic">
                                        <img src="${arr[i].img}"
                                            alt="">
                                    </div>
                                    <div class="goods_title">
                                        <p>【京东超市】奥利奥软点小草莓0</p>
                                    </div>
                                    <div class="sc">
                                        <div id="${arr[i].id}" class="sc_btn">加入购物车</div>
                                    </div>
                                </li>`
                        }
                        $(".goods_box ul").html(html);
                    },
                    error: function (err) {
                        console.log(err);

                    }

                })
           }
           //计算购物车中商品的数量
           function sc_num() {
            var cookieStr = $.cookie("goods");
            if (cookieStr) {
                var cookieArr = JSON.parse(cookieStr);
                var sum = 0;
                for (var i = 0; i < cookieArr.length; i++) {
                    sum += cookieArr[i].num;
                }
                $(".sc_right").find(".sc_num").html(sum);
            } else {
                $(".sc_right").find(".sc_num").html(0);
            }
        }
        //加载右侧购物车的数据
        function sc_msg() {
            var cookieStr = $.cookie("goods");
            if (cookieStr) {
            var cookieArr = JSON.parse(cookieStr);
                new Promise(function(resolve,reject){
                    $.ajax({
                            type: "get",
                            url: "../data/data.json",
                            success: function (arr) {
                                resolve(arr)
                            },
                            error:function(err){
                                reject(err)
                            }
                    })
                }).then(arr=>{
                    var newArr = [];
                    for (var i = 0; i < arr.length; i++) {
                            for (var j = 0; j < cookieArr.length; j++) {
                                if (arr[i].id == cookieArr[j].id) {
                                    arr[i].num = cookieArr[j].num;
                                    newArr.push(arr[i]);
                                }
                            }
                        }
                        var html = ``;
                        for (var i = 0; i < newArr.length; i++) {
                            html += `
                                    <li id="${newArr[i].id}">
                                    <div class="sc_goodsPic">
                                        <img src="${newArr[i].img}"
                                            alt="">
                                    </div>
                                    <div class="sc_goodsTitle">
                                        <p>这是商品曲奇饼干</p>
                                    </div>
                                    <div class="sc_goodsBtn">购买</div>
                                    <div class="delete_goodsBtn">删除</div>
                                    <div class="sc_goodsNum">
                                        <div>
                                            <button>+</button>
                                            <button>-</button>
                                            <span>商品数量：${newArr[i].num}</span>
                                        </div>
                                    </div>
                                </li>
                                    `
                        }


                        $(".sc_right ul").html(html);
                }).catch(err=>{
                   console.log(err);
                })
            }
               
            // $.ajax({
            //     type: "get",
            //     url: "../data/data.json",
            //     success: function (arr) {
            //         var cookieStr = $.cookie("goods");
            //         if (cookieStr) {
            //             var cookieArr = JSON.parse(cookieStr);
            //             var newArr = [];
            //             for (var i = 0; i < arr.length; i++) {
            //                 for (var j = 0; j < cookieArr.length; j++) {
            //                     if (arr[i].id == cookieArr[j].id) {
            //                         arr[i].num = cookieArr[j].num;
            //                         newArr.push(arr[i]);
            //                     }
            //                 }
            //             }
            //             console.log(newArr);
            //             var html = ``;
            //             for (var i = 0; i < newArr.length; i++) {
            //                 html += `
            //                         <li id="${newArr[i].id}">
            //                         <div class="sc_goodsPic">
            //                             <img src="${newArr[i].img}"
            //                                 alt="">
            //                         </div>
            //                         <div class="sc_goodsTitle">
            //                             <p>这是商品曲奇饼干</p>
            //                         </div>
            //                         <div class="sc_goodsBtn">购买</div>
            //                         <div class="delete_goodsBtn">删除</div>
            //                         <div class="sc_goodsNum">
            //                             <div>
            //                                 <button>+</button>
            //                                 <button>-</button>
            //                                 <span>商品数量：${newArr[i].num}</span>
            //                             </div>
            //                         </div>
            //                     </li>
            //                         `
            //             }


            //             $(".sc_right ul").html(html);
            //         }


            //     },
            //     error: function (err) {
            //         console.log(err);

            //     }
            // })
        }

        //oBtn 当前点击的加入购物车按钮
    function ballMove(oBtn) {
        $("#ball").css({
            display: "block",
            left: $(oBtn).offset().left,
            top: $(oBtn).offset().top
        })

        //计算偏移的位置
        var X = $(".sc_right .sc_pic").offset().left - $("#ball").offset().left;
        var Y = $(".sc_right .sc_pic").offset().top - $("#ball").offset().top;
        var bool = new Parabola({
            el: "#ball",
            offset: [X, Y], //抛物线运动的偏移位置
            duration: 500,
            curvature: 0.001,
            callback: function () {
                //动画结束的时候调用的回调函数
                $("#ball").hide();
            }
        })

        bool.start(); //开始运动
    }
        //给购物车按钮添加点击
        function goodsBtnClick(){
            $(".goods_box ul").on("click", ".sc_btn", function () {
                var id = this.id;
               // 1、判断是否是第一次添加
                var first = $.cookie("goods") === null ? true : false;
                if (first) {
                    var arr = [{ id: id, num: 1 }];
                    $.cookie("goods", JSON.stringify(arr), {
                        expires: 7
                    })
                } else {
                    //2、判断之前是否添加过
                    var cookieArr = JSON.parse($.cookie("goods"));
                    var same = false;
                    var index=cookieArr.findIndex(item=>item.id==id);
                    if(index!=-1){
                        cookieArr[index].num++;
                    }else{
                        var obj ={ id: id, num: 1 };
                        cookieArr.push(obj);
                    }
                    // for (var i = 0; i < cookieArr.length; i++) {
                    //     if (cookieArr[i].id == id) {
                    //         same = true;
                    //         cookieArr[i].num++;
                    //         break;
                    //     }
                    // }
                    // //3、之前没有添加过
                    // if (!same) {
                    //     var obj = { id: id, num: 1 };
                    //     cookieArr.push(obj);
                    // }
                    $.cookie("goods", JSON.stringify(cookieArr), {
                        expires: 7
                    })
                }
                
                //点击加入购物车以后重新计算商品的数量
                sc_num();
                sc_msg();
                ballMove($(this))
            })
        }

        function clearBtnClick(){
            $("#clearBtn").click(function(){
                // $(".sc_right ul").html("");
                $.cookie("goods", null);
                sc_num();
                $(".sc_right ul").empty("");
            })
        }

        function rightGoodsBtnClick(){
            $(".sc_right ul").on("click",".delete_goodsBtn",function(){
                var id=$(this).closest("li").remove().attr("id");
                var cookieArr=JSON.parse($.cookie("goods"));
                cookieArr=cookieArr.filter(item => item.id!=id);
                if(!cookieArr.length){
                    $.cookie("goods", null);
                }else{
                    $.cookie("goods", JSON.stringify(cookieArr),function(){
                            expires:7
                    });
                    
                }
                sc_num();
            })

            $(".sc_right ul").on("click",".sc_goodsNum button",function(){
                var id=$(this).closest("li").attr("id");
                var cookieArr=JSON.parse($.cookie("goods"));
                var item = cookieArr.find(item => item.id == id);
                for(var i=0;i<cookieArr.length;i++){
                    if(cookieArr[i].id==id){
                        break;
                    }
                }
                if(this.innerHTML=="+"){
                    cookieArr[i].num++;
                }else{
                    cookieArr[i].num==1?alert("数量为一，不能减少了"):cookieArr[i].num--;
                }
                $(this).siblings("span").html(`商品数量为：${cookieArr[i].num}`);
                $.cookie("goods", JSON.stringify(cookieArr),function(){
                            expires:7
                });
                sc_num();
            })
        }

        function rightGoodsHover(){
            $(".sc_right").mouseenter(function () {
                $(".sc_right").stop(true).animate({
                    right: 0
                })
            }).mouseleave(function () {
                $(".sc_right").stop(true).animate({
                    right: -270
                })
            })
        }
    return {
        download:download,
        goodsBtnClick:goodsBtnClick,
        clearBtnClick:clearBtnClick,
        rightGoodsBtnClick:rightGoodsBtnClick,
        rightGoodsHover:rightGoodsHover,
        ballMove:ballMove
    }
})