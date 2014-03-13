// 联赛各个最新赛事比赛的让球盘路和大小盘路统计更新 2014-03-04

var start_time = new Date().getTime();

// 让球盘路判断函数
var box_yp_fuc = {

          '平手':0,
          '平手/半球':0.25,
          '半球':0.5,
          '半球/一球':0.75,
          '一球':1,
          '一球/球半':1.25,
          '球半':1.5,
          '球半/两球':1.75,
          '两球':2,
          '两球/两球半':2.25,
          '两球半':2.5,
          '两球半/三球':2.75,
          '三球':3,
          '三球/三球半':3.25,
          '三球半':3.5,
          '三球半/四球':3.75,
          '四球':4,
          '四球/四球半':4.25,
          '四球半':4.5,
          '四球半/五球':4.75,
          '五球':5,
          '五球/五球半':5.25,
          '五球半':5.5,
          '五球半/六球':5.75,
          '六球':6,
          '六球/六球半':6.25,
          '六球半':6.5,
          '六球半/七球':6.75,
          '受平手/半球':-0.25,
          '受半球':-0.5,
          '受半球/一球':-0.75,
          '受一球':-1,
          '受一球/球半':-1.25,
          '受球半':-1.5,
          '受球半/两球':-1.75,
          '受两球':-2,
          '受两球/两球半':-2.25,
          '受两球半':-2.5,
          '受两球半/三球':-2.75,
          '受三球':-3,
          '受三球/三球半':-3.25,
          '受三球半':-3.5,
          '受三球半/四球':-3.75,
          '受四球':-4,
          '受四球/四球半':-4.25,
          '受四球半':-4.5,
          '受四球半/五球':-4.75,
          '受五球':-5,
          '受五球/五球半':-5.25,
          '受五球半':-5.5,
          '受五球半/六球':-5.75,
          '受六球':-6,
          '受六球/六球半':-6.25,
          '受六球半':-6.5,
          '受六球半/七球':-6.75

}

// 大小盘路判断函数
var box_dx_fuc = {

      '0/0.5':0.25,
      '0.5':0.5,
      '0.5/1':0.75,
      '1':1,
      '1/1.5':1.25,
      '1.5':1.5,
      '1.5/2':1.75,
      '2':2,
      '2/2.5':2.25,
      '2.5':2.5,
      '2.5/3':2.75,
      '3':3,
      '3/3.5':3.25,
      '3.5':3.5,
      '3.5/4':3.75,
      '4':4,
      '4/4.5':4.25,
      '4.5':4.5,
      '4.5/5':4.75,
      '5':5,
      '5/5.5':5.25,
      '5.5':5.5,
      '5.5/6':5.75,
      '6':6,
      '6/6.5':6.25,
      '6.5':6.5,
      '6.5/7':6.75,
      '7':7,
      '7/7.5':7.25,
      '7.5':7.5,
      '7.5/8':7.75,
      '8':8,
      '8/8.5':8.25,
      '8.5':8.5,
      '8.5/9':8.75,
      '9':9,
      '9/9.5':9.25,
      '9.5':9.5,
      '9.5/10':9.75,
      '10':10,
      '10/10.5':10.25,
      '10.5':10.5,
      '10.5/11':10.75,
      '11':11,
      '11/11.5':11.25,
      '11.5':11.5,
      '11.5/12':11.75,
      '12':12,
      '12/12.5':12.25,
      '12.5':12.5,
      '12.5/13':12.75,
      '13':13,
      '13/13.5':13.25,
      '13.5':13.5,
      '13.5/14':13.75,
      '14':14,
      '14/14.5':14.25,
      '14.5':14.5,
      '14.5/15':14.75,
      '15':15,
      '15/15.5':15.25,
      '15.5':15.5,
      '15.5/16':15.75,
      '16':16
}

league_info = db.current_groups.find({"league_type":{"$in":[0,1]}},{"_id":1});

league_info.forEach(function(item){

  league_id = item._id;

  groups_info = db.current_groups.findOne({"_id":league_id,"groups":{"$exists":true}},{"groups":1,"_id":0,"year":1});

  season_id = groups_info['year'];

    if(groups_info){

        data1 = groups_info['groups'];

        for(var g=0,g_len=data1.length;g<g_len;g++){

              groups_id = data1[g];

              rounds_info = db.groups.findOne({"_id":groups_id,"rounds.matches":{"$exists":true},"sub_type": 1},{"rounds.matches":1,"_id":0});

              var m_ids=[];

              if(rounds_info){

                  for(var r=0,r_len=rounds_info['rounds'].length;r<r_len;r++){

                      m_ids = m_ids.concat(rounds_info['rounds'][r]['matches']);

                  }

              }

                    b = db.match.find({"_id": {"$in": m_ids},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}, {"_id": 0,"home_team_id": 1,"away_team_id": 1});

                    mn_ids = {};
                    A = [];
                    B = [];

                    b.forEach(function(item) {
                      A = item.home_team_id;
                      B = item.away_team_id;
                      mn_ids[A] = A;
                      mn_ids[B] = B;
                    });    

                    var yp_total_rr=[],yp_home_rr=[],yp_away_rr=[];
                    var yp_total_rr_half=[],yp_home_rr_half=[],yp_away_rr_half=[];
                    var dx_total_rr=[],dx_home_rr=[],dx_away_rr=[];
                    var dx_total_rr_half=[],dx_home_rr_half=[],dx_away_rr_half=[];

                    for (var id in mn_ids) {

                      var team_id = parseInt(id);
                      teaminfo = db.team.findOne({_id: team_id});
                      teamname = teaminfo.name;


// 让球盘路计算开始
                      //让球全场主队盘路计算
                      var home_w_yp=0,home_g_yp=0,home_l_yp=0;
                      yp_home_func("home_team_id","full_yp","full_home_score","full_away_score");

                      var v1 =yp_home_total;
                      var v2 =yp_home_up;
                      var v3 =yp_home_mid;
                      var v4 =yp_home_down;
                      var v5 =home_w_yp;
                      var v6 =home_g_yp;
                      var v7 =home_l_yp;
                      var v8 =home_gd_yp;
                      
                      yp_home_r = Array(NumberInt(team_id),teamname, NumberInt(yp_home_total),NumberInt(yp_home_up), NumberInt(yp_home_mid), NumberInt(yp_home_down), NumberInt(home_w_yp), NumberInt(home_g_yp), NumberInt(home_l_yp), NumberInt(home_gd_yp), home_per_w_yp, home_per_g_yp, home_per_l_yp);

                      yp_home_rr.push(yp_home_r);

                      //让球全场客队盘路计算
                      var home_w_yp=0,home_g_yp=0,home_l_yp=0;
                      yp_home_func("away_team_id","full_yp","full_home_score","full_away_score");

                      yp_away_r = Array(NumberInt(team_id),teamname,NumberInt(yp_home_total),NumberInt(yp_home_up),NumberInt(yp_home_mid),NumberInt(yp_home_down),NumberInt(home_w_yp),NumberInt(home_g_yp),NumberInt(home_l_yp),NumberInt(home_gd_yp),home_per_w_yp,home_per_g_yp,home_per_l_yp);

                      yp_away_rr.push(yp_away_r);

                      //让球全场(主+客)队盘路计算
                      var v11 = v1 + yp_home_total;
                      var v21 = v2 + yp_home_up;
                      var v31 = v3 + yp_home_mid;
                      var v41 = v4 + yp_home_down;
                      var v51 = v5 + home_w_yp;
                      var v61 = v6 + home_g_yp;
                      var v71 = v7 + home_l_yp;
                      var v81 = v8 + home_gd_yp;

                      if(v11==0){

                        v91= 0+"%";
                        v91= 0+"%";
                        v91= 0+"%";

                      }else{

                        v91 =(Math.round(1000 * (v51 / v11)) / 10 + "%");
                        v101 =(Math.round(1000 * (v61 / v11)) / 10 + "%");
                        v111 =(Math.round(1000 * (v71 / v11)) / 10 + "%");

                      }

                      yp_total_r= Array(NumberInt(team_id),teamname,NumberInt(v11),NumberInt(v21),NumberInt(v31),NumberInt(v41),NumberInt(v51),NumberInt(v61),NumberInt(v71),NumberInt(v81),v91,v101,v111);

                      yp_total_rr.push(yp_total_r);

                      //让球半场主队盘路计算
                      var home_w_yp=0,home_g_yp=0,home_l_yp=0;
                      yp_home_func("home_team_id","half_yp","half_home_score","half_away_score");

                      var v1 =yp_home_total;
                      var v2 =yp_home_up;
                      var v3 =yp_home_mid;
                      var v4 =yp_home_down;
                      var v5 =home_w_yp;
                      var v6 =home_g_yp;
                      var v7 =home_l_yp;
                      var v8 =home_gd_yp;

                      yp_home_r_half = Array(NumberInt(team_id),teamname,NumberInt(yp_home_total),NumberInt(yp_home_up),NumberInt(yp_home_mid),NumberInt(yp_home_down),NumberInt(home_w_yp),NumberInt(home_g_yp),NumberInt(home_l_yp),NumberInt(home_gd_yp),home_per_w_yp,home_per_g_yp,home_per_l_yp);

                      yp_home_rr_half.push(yp_home_r_half);

                      //让球半场客队盘路计算
                      var home_w_yp=0,home_g_yp=0,home_l_yp=0;
                      yp_home_func("away_team_id","half_yp","half_home_score","half_away_score");

                      yp_away_r_half = Array(NumberInt(team_id),teamname,NumberInt(yp_home_total),NumberInt(yp_home_up),NumberInt(yp_home_mid),NumberInt(yp_home_down),NumberInt(home_w_yp),NumberInt(home_g_yp),NumberInt(home_l_yp),NumberInt(home_gd_yp),home_per_w_yp,home_per_g_yp,home_per_l_yp);

                      yp_away_rr_half.push(yp_away_r_half);

                      //让球半场(主+客)队盘路计算        
                      var v11 = v1 + yp_home_total;
                      var v21 = v2 + yp_home_up;
                      var v31 = v3 + yp_home_mid;
                      var v41 = v4 + yp_home_down;
                      var v51 = v5 + home_w_yp;
                      var v61 = v6 + home_g_yp;
                      var v71 = v7 + home_l_yp;
                      var v81 = v8 + home_gd_yp;

                      if(v11==0){

                        v91 = 0+"%";
                        v101 = 0+"%";
                        v111 = 0+"%";

                      }else{

                        v91 = (Math.round(1000 * (v51 / v11)) / 10 + "%");
                        v101 = (Math.round(1000 * (v61 / v11)) / 10 + "%");
                        v111 = (Math.round(1000 * (v71 / v11)) / 10 + "%");

                      }

                      yp_total_r_half = Array(NumberInt(team_id),teamname,NumberInt(v11),NumberInt(v21),NumberInt(v31),NumberInt(v41),NumberInt(v51),NumberInt(v61),NumberInt(v71),NumberInt(v81),v91,v101,v111);

                      yp_total_rr_half.push(yp_total_r_half);

                      function yp_home_func(xxx,yyy,zzz,www){

                            eval('var field1={'+ xxx +':team_id,'+ yyy +':{"$ne":""},'+ zzz +':{"$ne":null},'+ www +':{"$ne":null},"_id":{"$in": m_ids}}');

                            eval('var field2={'+ yyy +':1,'+ zzz +':1,'+ www +':1,"_id":0}');

                            matches1 = db.match.find(field1,field2);

                            matches1.forEach(function(item) {

                              home_s=item[zzz];
                              away_s=item[www];
                              full_yp=item[yyy];
                              full_yp_score=box_yp_fuc[full_yp];
                              pankou=home_s-full_yp_score-away_s;
                              box_pankou=box_pankou();

                              function box_pankou(){

                                  if(xxx == "home_team_id"){

                                      if(pankou>0){
                                        return home_w_yp++;
                                      }else if(pankou==0){
                                        return home_g_yp++;
                                      }else if(pankou<0){
                                        return home_l_yp++;
                                      }

                                  }else if(xxx == "away_team_id"){

                                      if(pankou<0){
                                        return home_w_yp++;
                                      }else if(pankou==0){
                                        return home_g_yp++;
                                      }else if(pankou>0){
                                        return home_l_yp++;
                                      }

                                  }
                              }

                            });

                            home_gd_yp=home_w_yp-home_l_yp;

                            eval('var field3={'+ xxx +':team_id,'+ zzz +':{"$ne":null},'+ www +':{"$ne":null},"_id":{"$in": m_ids}}');

                            yp_home_total = db.match.find(field3).count();

                            eval('var field4={'+ xxx +':team_id,'+ yyy +':"平手",'+ zzz +':{"$ne":null},'+ www +':{"$ne":null},"_id":{"$in": m_ids}}');

                            yp_home_mid  = db.match.find(field4).count();

                            if(xxx == "home_team_id"){

                                eval('var field5={'+ xxx +':team_id,'+ yyy +':/^受/,'+ zzz +':{"$ne":null},'+ www +':{"$ne":null},"_id":{"$in": m_ids}}');

                                yp_home_down = db.match.find(field5).count();
                            
                                yp_home_up = yp_home_total-yp_home_mid-yp_home_down;

                            }else if(xxx == "away_team_id"){

                                eval('var field6={'+ xxx +':team_id,'+ yyy +':/^受/,'+ zzz +':{"$ne":null},'+ www +':{"$ne":null},"_id":{"$in": m_ids}}');

                                yp_home_up = db.match.find(field6).count();
                            
                                yp_home_down = yp_home_total-yp_home_mid-yp_home_up;

                              }

                            if(yp_home_total==0){

                                home_per_w_yp = 0+"%";
                                home_per_g_yp = 0+"%";
                                home_per_l_yp = 0+"%";

                            }else{

                                home_per_w_yp = (Math.round(1000 * (home_w_yp / yp_home_total)) / 10 + "%");
                                home_per_g_yp = (Math.round(1000 * (home_g_yp / yp_home_total)) / 10 + "%");
                                home_per_l_yp = (Math.round(1000 * (home_l_yp / yp_home_total)) / 10 + "%");

                              }

                       }

// 让球盘路计算结束

// 大小盘路计算开始

          // --------------------------------------------------------------------------------------------
          // home 全场大小球 赛 大球  走 小球  大球% 走%  小球%
                      var home_w_dx=0,home_g_dx=0,home_l_dx=0;
                      dx_home_func("home_team_id","full_dx","full_home_score","full_away_score");

                      dx_home_r =  Array(NumberInt(team_id),teamname, NumberInt(dx_home_total), NumberInt(home_w_dx), NumberInt(home_g_dx), NumberInt(home_l_dx), home_per_w_dx, home_per_g_dx, home_per_l_dx);
              
                      dx_home_rr.push(dx_home_r);

                      var v11 = dx_home_total;
                      var v12 = home_w_dx;
                      var v13 = home_g_dx;
                      var v14 = home_l_dx;

          // --------------------------------------------------------------------------------------------
          // // away 全场大小球 赛 大球  走 小球  大球% 走%  小球%
                      var home_w_dx=0,home_g_dx=0,home_l_dx=0;
                      dx_home_func("away_team_id","full_dx","full_home_score","full_away_score");
                      
                      dx_away_r =  Array(NumberInt(team_id),teamname, NumberInt(dx_home_total), NumberInt(home_w_dx), NumberInt(home_g_dx), NumberInt(home_l_dx), home_per_w_dx, home_per_g_dx, home_per_l_dx);

                      dx_away_rr.push(dx_away_r);

          // // // --------------------------------------------------------------------------------------------
          // // // total 全场大小球 赛 大球  走 小球  大球% 走%  小球%

                      var v112 = v11 + dx_home_total;
                      var v122 = v12 + home_w_dx;
                      var v132 = v13 + home_g_dx;
                      var v142 = v14 + home_l_dx;                     

                      if(v112 == 0){

                        total_per_w_dx = 0 + "%";
                        total_per_g_dx = 0 + "%";
                        total_per_l_dx = 0 + "%";

                      }else{

                        total_per_w_dx=(Math.round(1000 * (v122 / v112)) / 10 + "%");
                        total_per_g_dx=(Math.round(1000 * (v132 / v112)) / 10 + "%");
                        total_per_l_dx=(Math.round(1000 * (v142 / v112)) / 10 + "%");

                      }  

                      dx_total_r = Array(NumberInt(team_id),teamname, NumberInt(v112), NumberInt(v122), NumberInt(v132), NumberInt(v142), total_per_w_dx, total_per_g_dx, total_per_l_dx);
                      
                      dx_total_rr.push(dx_total_r);
 
          // --------------------------------------------------------------------------------------------
          // home 半场大小球 赛 大球  走 小球  大球% 走%  小球%
                      var home_w_dx=0,home_g_dx=0,home_l_dx=0;
                      dx_home_func("home_team_id","half_dx","half_home_score","half_away_score");

                      dx_home_r_half = Array(NumberInt(team_id),teamname, NumberInt(dx_home_total), NumberInt(home_w_dx), NumberInt(home_g_dx), NumberInt(home_l_dx), home_per_w_dx, home_per_g_dx, home_per_l_dx);

                      dx_home_rr_half.push(dx_home_r_half);  

                      var v11 = dx_home_total;
                      var v12 = home_w_dx;
                      var v13 = home_g_dx;
                      var v14 = home_l_dx;

          // --------------------------------------------------------------------------------------------
          // // away 半场大小球 赛 大球  走 小球  大球% 走%  小球%
                      var home_w_dx=0,home_g_dx=0,home_l_dx=0;
                      dx_home_func("away_team_id","half_dx","half_home_score","half_away_score");

                      dx_away_r_half = Array(NumberInt(team_id),teamname, NumberInt(dx_home_total), NumberInt(home_w_dx), NumberInt(home_g_dx), NumberInt(home_l_dx), home_per_w_dx, home_per_g_dx, home_per_l_dx);

                      dx_away_rr_half.push(dx_away_r_half);    

          // // // --------------------------------------------------------------------------------------------
          // // // total 半场大小球 赛 大球  走 小球  大球% 走%  小球%

                      var v111 = v11 + dx_home_total;
                      var v121 = v12 + home_w_dx;
                      var v131 = v13 + home_g_dx;
                      var v141 = v14 + home_l_dx;                     

                      if(v111 == 0){

                        total_per_w_dx = 0 + "%";
                        total_per_g_dx = 0 + "%";
                        total_per_l_dx = 0 + "%";

                      }else{

                        total_per_w_dx=(Math.round(1000 * (v121 / v111)) / 10 + "%");
                        total_per_g_dx=(Math.round(1000 * (v131 / v111)) / 10 + "%");
                        total_per_l_dx=(Math.round(1000 * (v141 / v111)) / 10 + "%");

                      }  

                      dx_total_r_half = Array(NumberInt(team_id),teamname, NumberInt(v111), NumberInt(v121), NumberInt(v131), NumberInt(v141), total_per_w_dx, total_per_g_dx, total_per_l_dx);

                      dx_total_rr_half.push(dx_total_r_half);

                      function dx_home_func(xxx,yyy,zzz,www){

                            eval('var field1={'+ xxx +':team_id,'+ yyy +':{"$ne":""},'+ zzz +':{"$ne":null},'+ www +':{"$ne":null},"_id":{"$in": m_ids}}');

                            eval('var field2={'+ yyy +':1,'+ zzz +':1,'+ www +':1,"_id":0}');

                            matches1 = db.match.find(field1,field2);

                            matches1.forEach(function(item) {

                              home_s=item[zzz];
                              away_s=item[www];
                              full_dx=item[yyy];
                              full_dx_score=box_dx_fuc[full_dx];
                              pankou=home_s+away_s-full_dx_score;
                              box_pankou=box_pankou();

                              function box_pankou(){

                                      if(pankou>0){
                                        return home_w_dx++;
                                      }else if(pankou==0){
                                        return home_g_dx++;
                                      }else if(pankou<0){
                                        return home_l_dx++;
                                      }
                              }

                            });

                            eval('var field1={'+ xxx +':team_id,'+ yyy +':{"$ne":""},'+ zzz +':{"$ne":null},'+ www +':{"$ne":null},"_id":{"$in": m_ids}}');
                  
                            dx_home_total = db.match.find(field1).count();

                            if(dx_home_total==0){

                                home_per_w_dx = 0+"%";
                                home_per_g_dx = 0+"%";
                                home_per_l_dx = 0+"%";

                            }else{

                                home_per_w_dx = (Math.round(1000 * (home_w_dx / dx_home_total)) / 10 + "%");
                                home_per_g_dx = (Math.round(1000 * (home_g_dx / dx_home_total)) / 10 + "%");
                                home_per_l_dx = (Math.round(1000 * (home_l_dx / dx_home_total)) / 10 + "%");

                              }

                       }

// 让球盘路计算结束
                
                    }

          // // 对让球盘路数组里的数组元素进行排序----------------------------------------------------------------------------------

                    var A=[],B=[],C=[],D=[],E=[],F=[];
                    A=box3_yp(yp_total_rr);
                    B=box3_yp(yp_home_rr);
                    C=box3_yp(yp_away_rr);
                    D=box3_yp(yp_total_rr_half);
                    E=box3_yp(yp_home_rr_half);
                    F=box3_yp(yp_away_rr_half);

                    function box3_yp(x){
                
                          result = x.sort(s);

                          var y = [];

                          for (var i = 0, len = result.length; i < len; i++) {
                            y.push(result[i]);
                          }

                          return y;

                          //胜%比较
                          function s(a, b) {
                            if (parseInt(b[10]) - parseInt(a[10]) == 0.0) {
                              return f2(a, b);
                            } else {
                              return parseInt(b[10]) - parseInt(a[10]);
                            }
                          }

                          //负%比较
                          function f2(a, b) {
                            return parseInt(a[12]) - parseInt(b[12]);
                          }

                    }

                    for(var ai=0,alen=A.length;ai<alen;ai++){
                      A[ai].unshift(NumberInt(ai+1));
                    }
                    for(var bi=0,blen=B.length;bi<blen;bi++){
                      B[bi].unshift(NumberInt(bi+1));
                    }
                    for(var ci=0,clen=C.length;ci<clen;ci++){
                      C[ci].unshift(NumberInt(ci+1));
                    }
                    for(var di=0,dlen=D.length;di<dlen;di++){
                      D[di].unshift(NumberInt(di+1));
                    }
                    for(var ei=0,elen=E.length;ei<elen;ei++){
                      E[ei].unshift(NumberInt(ei+1));
                    }
                    for(var fi=0,flen=F.length;fi<flen;fi++){
                      F[fi].unshift(NumberInt(fi+1));
                    }

          // // 对大小盘路数组里的数组元素进行排序----------------------------------------------------------------------------------

                    var AA=[],BB=[],CC=[],DD=[],EE=[],FF=[];
                    AA=box3_dx(dx_total_rr);
                    BB=box3_dx(dx_home_rr);
                    CC=box3_dx(dx_away_rr);
                    DD=box3_dx(dx_total_rr_half);
                    EE=box3_dx(dx_home_rr_half);
                    FF=box3_dx(dx_away_rr_half);

                    function box3_dx(x){
                
                          result = x.sort(s);
                          y = [];

                          for (var i = 0, len = result.length; i < len; i++) {
                            y.push(result[i]);
                          }

                          return y;

                          //大球%比较
                          function s(a, b) {
                            if (parseInt(b[6]) - parseInt(a[6]) == 0.0) {
                              return f2(a, b);
                            } else {
                              return parseInt(b[6]) - parseInt(a[6]);
                            }
                          }

                          //小球%比较
                          function f2(a, b) {
                            return parseInt(a[8]) - parseInt(b[8]);
                          }
                     }

                for(var ai=0,alen=AA.length;ai<alen;ai++){
                  AA[ai].unshift(NumberInt(ai+1));
                }
                for(var bi=0,blen=BB.length;bi<blen;bi++){
                  BB[bi].unshift(NumberInt(bi+1));
                }
                for(var ci=0,clen=CC.length;ci<clen;ci++){
                  CC[ci].unshift(NumberInt(ci+1));
                }
                for(var di=0,dlen=DD.length;di<dlen;di++){
                  DD[di].unshift(NumberInt(di+1));
                }
                for(var ei=0,elen=EE.length;ei<elen;ei++){
                  EE[ei].unshift(NumberInt(ei+1));
                }
                for(var fi=0,flen=FF.length;fi<flen;fi++){
                  FF[fi].unshift(NumberInt(fi+1));
                }

          // // 更新统计的数据到集合中----------------------------------------------------------------------------------

                db.groups.update({"_id": groups_id}, {"$set": {"dx_total": AA,"dx_home": BB,"dx_away": CC,"dx_total_half": DD,"dx_home_half": EE,"dx_away_half": FF,"yp_total": A,"yp_home": B,"yp_away": C,"yp_total_half": D,"yp_home_half": E,"yp_away_half": F}});

        }

    }

})

var end_time = new Date().getTime();
var use_time = end_time - start_time;
print("使用: " + Math.floor(use_time / 60000) + "分钟," + ((use_time % 60000)/1000).toFixed(2) + " 秒 !");