// // 联赛球队各个最新赛事比赛的大小盘路和走球盘路统计更新 2014-03-05

var start_time = new Date().getTime();

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

};

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
};

league_info = db.current_groups.find({"league_type":{"$in":[0,1]}},{"_id":1,"league_name":1});

league_info.forEach(function(item){

  league_id = item._id;

  league_name = item.league_name;  

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

              mn_ids = {},A = [],B = [];

              b.forEach(function(item) {
                A = item.home_team_id;
                B = item.away_team_id;
                mn_ids[A] = A;
                mn_ids[B] = B;
              });    

              for (var id in mn_ids) {

                  var team_id = parseInt(id);

// home 全场大小球 赛 大球  走 小球  大球% 走%  小球%

                  var home_w_dx=0,home_g_dx=0,home_l_dx=0;
   
                  dx_count_team("home_team_id","full_dx","full_home_score","full_away_score");

                  var data_home_r = [NumberInt(dx_home_total), NumberInt(home_w_dx), NumberInt(home_g_dx), NumberInt(home_l_dx), home_per_w_dx, home_per_g_dx, home_per_l_dx];

                  db.team.update({"_id": team_id, "access_total.dx_home.league_id" : league_id, "access_total.dx_home.year" : season_id}, {"$set":{"access_total.dx_home.$.data":data_home_r}});

                  var v11 = dx_home_total ;
                  var v12 = home_w_dx ;
                  var v13 = home_g_dx ;
                  var v14 = home_l_dx ;        

// away 全场大小球 赛 大球  走 小球  大球% 走%  小球%

                  var home_w_dx=0,home_g_dx=0,home_l_dx=0;
   
                  dx_count_team("away_team_id","full_dx","full_home_score","full_away_score");

                  var data_away_r = [NumberInt(dx_home_total), NumberInt(home_w_dx), NumberInt(home_g_dx), NumberInt(home_l_dx), home_per_w_dx, home_per_g_dx, home_per_l_dx];

                  db.team.update({"_id": team_id, "access_total.dx_away.league_id" : league_id, "access_total.dx_away.year" : season_id}, {"$set":{"access_total.dx_away.$.data":data_away_r}});

// total 全场大小球 赛 大球  走 小球  大球% 走%  小球%

                  var v1 = v11 + dx_home_total ;
                  var v2 = v12 + home_w_dx ;
                  var v3 = v13 + home_g_dx ;
                  var v4 = v14 + home_l_dx ;        

                  if(v1 == 0){

                    var v5= 0 + "%";
                    var v6= 0 + "%";
                    var v7= 0 + "%";

                  }else{

                    var v5 =(Math.round(1000 * ( v2 / v1 )) / 10 + "%");
                    var v6 =(Math.round(1000 * ( v3 / v1 )) / 10 + "%");
                    var v7 =(Math.round(1000 * ( v4 / v1 )) / 10 + "%");
                  
                  }

                  var data_total_r = [NumberInt(v1),NumberInt(v2),NumberInt(v3),NumberInt(v4),v5,v6,v7];

                  db.team.update({"_id": team_id, "access_total.dx_total.league_id" : league_id, "access_total.dx_total.year" : season_id}, {"$set":{"access_total.dx_total.$.data":data_total_r}});

// home 半场大小球 赛 大球  走 小球  大球% 走%  小球%

                  var home_w_dx=0,home_g_dx=0,home_l_dx=0;
                  dx_count_team("home_team_id","half_dx","half_home_score","half_away_score");

                  var data_home_r_half = [NumberInt(dx_home_total), NumberInt(home_w_dx), NumberInt(home_g_dx), NumberInt(home_l_dx), home_per_w_dx, home_per_g_dx, home_per_l_dx];

                  db.team.update({"_id": team_id, "access_total.dx_home_half.league_id" : league_id, "access_total.dx_home_half.year" : season_id}, {"$set":{"access_total.dx_home_half.$.data":data_home_r_half}});

                  var v11 = dx_home_total ;
                  var v12 = home_w_dx ;
                  var v13 = home_g_dx ;
                  var v14 = home_l_dx ;   

// away 半场大小球 赛 大球  走 小球  大球% 走%  小球%

                  var home_w_dx=0,home_g_dx=0,home_l_dx=0;
                  dx_count_team("away_team_id","half_dx","half_home_score","half_away_score");

                  var data_away_r_half = [NumberInt(dx_home_total), NumberInt(home_w_dx), NumberInt(home_g_dx), NumberInt(home_l_dx), home_per_w_dx, home_per_g_dx, home_per_l_dx];

                  db.team.update({"_id": team_id, "access_total.dx_away_half.league_id" : league_id, "access_total.dx_away_half.year" : season_id}, {"$set":{"access_total.dx_away_half.$.data":data_away_r_half}});

// total 半场大小球 赛 大球  走 小球  大球% 走%  小球%

                  var v1 = v11 + dx_home_total ;
                  var v2 = v12 + home_w_dx ;
                  var v3 = v13 + home_g_dx ;
                  var v4 = v14 + home_l_dx ;        

                  if(v1 == 0){

                    var v5= 0 + "%";
                    var v6= 0 + "%";
                    var v7= 0 + "%";

                  }else{

                    var v5 =(Math.round(1000 * ( v2 / v1 )) / 10 + "%");
                    var v6 =(Math.round(1000 * ( v3 / v1 )) / 10 + "%");
                    var v7 =(Math.round(1000 * ( v4 / v1 )) / 10 + "%");
                  
                  }

                  var data_total_r_half = [NumberInt(v1),NumberInt(v2),NumberInt(v3),NumberInt(v4),v5,v6,v7];

                  db.team.update({"_id": team_id, "access_total.dx_total_half.league_id" : league_id, "access_total.dx_total_half.year" : season_id}, {"$set":{"access_total.dx_total_half.$.data":data_total_r_half}});

// 大小盘路函数计算开始

                  function dx_count_team(xxx,yyy,zzz,www){

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

                      dx_home_total = db.match.find(field1).count();

                      if(dx_home_total==0){

                            home_per_w_dx=0 + "%";
                            home_per_g_dx=0 + "%";
                            home_per_l_dx=0 + "%";

                      }else{

                            home_per_w_dx=(Math.round(1000 * (home_w_dx / dx_home_total)) / 10 + "%");
                            home_per_g_dx=(Math.round(1000 * (home_g_dx / dx_home_total)) / 10 + "%");
                            home_per_l_dx=(Math.round(1000 * (home_l_dx / dx_home_total)) / 10 + "%");

                      }

                  }

// 大小盘路函数计算结束

// --------------------------------------------------------------------------------------------

// home 全场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负%

                  var home_w_yp = 0 , home_g_yp = 0 , home_l_yp = 0 ;

                  yp_count_team("home_team_id","full_yp","full_home_score","full_away_score");

                  var data_home_r = [NumberInt(yp_home_total),NumberInt(yp_home_up), NumberInt(yp_home_mid), NumberInt(yp_home_down), NumberInt(home_w_yp), NumberInt(home_g_yp), NumberInt(home_l_yp), NumberInt(home_gd_yp), home_per_w_yp, home_per_g_yp, home_per_l_yp];

                  db.team.update({"_id": team_id, "access_total.yp_home.league_id" : league_id, "access_total.yp_home.year" : season_id}, {"$set":{"access_total.yp_home.$.data":data_home_r}});

                  var v81 = yp_home_total ;
                  var v82 = yp_home_up ;
                  var v83 = yp_home_mid ;
                  var v84 = yp_home_down ;
                  var v85 = home_w_yp ;
                  var v86 = home_g_yp ;
                  var v87 = home_l_yp ;
                  var v88 = home_gd_yp ;

// --------------------------------------------------------------------------------------------
// away 全场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负%  

                  var home_w_yp = 0 , home_g_yp = 0 , home_l_yp = 0 ;

                  yp_count_team("away_team_id","full_yp","full_home_score","full_away_score");

                  var data_away_r = [NumberInt(yp_home_total),NumberInt(yp_home_up), NumberInt(yp_home_mid), NumberInt(yp_home_down), NumberInt(home_w_yp), NumberInt(home_g_yp), NumberInt(home_l_yp), NumberInt(home_gd_yp), home_per_w_yp, home_per_g_yp, home_per_l_yp];

                  db.team.update({"_id": team_id, "access_total.yp_away.league_id" : league_id, "access_total.yp_away.year" : season_id}, {"$set":{"access_total.yp_away.$.data":data_away_r}});

                  var v91 = v81 + yp_home_total ;
                  var v92 = v82 + yp_home_up ;
                  var v93 = v83 + yp_home_mid ;
                  var v94 = v84 + yp_home_down ;
                  var v95 = v85 + home_w_yp ;
                  var v96 = v86 + home_g_yp ;
                  var v97 = v87 + home_l_yp ;
                  var v98 = v88 + home_gd_yp ;

// --------------------------------------------------------------------------------------------
// total 全场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负%    

                  if(v91 == 0){

                      home_per_w_yp = 0 + "%";
                      home_per_g_yp = 0 + "%";
                      home_per_l_yp = 0 + "%";

                  }else{

                      home_per_w_yp = (Math.round(1000 * ( v95 / v91 ))  / 10 + "%");
                      home_per_g_yp = (Math.round(1000 * ( v96 / v91 ))  / 10 + "%");
                      home_per_l_yp = (Math.round(1000 * ( v97 / v91 ))  / 10 + "%");

                  }

                  var data_total_r = [NumberInt(v91),NumberInt(v92), NumberInt(v93), NumberInt(v94), NumberInt(v95), NumberInt(v96), NumberInt(v97), NumberInt(v98), home_per_w_yp, home_per_g_yp, home_per_l_yp];
      
                  db.team.update({"_id": team_id, "access_total.yp_total.league_id" : league_id, "access_total.yp_total.year" : season_id}, {"$set":{"access_total.yp_total.$.data":data_total_r}});

// --------------------------------------------------------------------------------------------
// home 半场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负%

                  var home_w_yp = 0 , home_g_yp = 0 , home_l_yp = 0 ;

                  yp_count_team("home_team_id","half_yp","half_home_score","half_away_score");

                  var data_home_r_half = [NumberInt(yp_home_total),NumberInt(yp_home_up), NumberInt(yp_home_mid), NumberInt(yp_home_down), NumberInt(home_w_yp), NumberInt(home_g_yp), NumberInt(home_l_yp), NumberInt(home_gd_yp), home_per_w_yp, home_per_g_yp, home_per_l_yp];

                  db.team.update({"_id": team_id, "access_total.yp_home_half.league_id" : league_id, "access_total.yp_home_half.year" : season_id}, {"$set":{"access_total.yp_home_half.$.data":data_home_r_half}});

                  var v71 = yp_home_total ;
                  var v72 = yp_home_up ;
                  var v73 = yp_home_mid ;
                  var v74 = yp_home_down ;
                  var v75 = home_w_yp ;
                  var v76 = home_g_yp ;
                  var v77 = home_l_yp ;
                  var v78 = home_gd_yp ;

// --------------------------------------------------------------------------------------------
// away 半场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负% 

                  var home_w_yp = 0 , home_g_yp = 0 , home_l_yp = 0 ;

                  yp_count_team("away_team_id","half_yp","half_home_score","half_away_score");

                 var data_away_r_half = [NumberInt(yp_home_total),NumberInt(yp_home_up), NumberInt(yp_home_mid), NumberInt(yp_home_down), NumberInt(home_w_yp), NumberInt(home_g_yp), NumberInt(home_l_yp), NumberInt(home_gd_yp), home_per_w_yp, home_per_g_yp, home_per_l_yp];

                 db.team.update({"_id": team_id, "access_total.yp_away_half.league_id" : league_id, "access_total.yp_away_half.year" : season_id}, {"$set":{"access_total.yp_away_half.$.data":data_away_r_half}});

                  var v61 = v71 + yp_home_total ;
                  var v62 = v72 + yp_home_up ;
                  var v63 = v73 + yp_home_mid ;
                  var v64 = v74 + yp_home_down ;
                  var v65 = v75 + home_w_yp ;
                  var v66 = v76 + home_g_yp ;
                  var v67 = v77 + home_l_yp ;
                  var v68 = v78 + home_gd_yp ;

// --------------------------------------------------------------------------------------------
// total 半场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负% 

                  if(v61 == 0){

                      home_per_w_yp = 0 + "%";
                      home_per_g_yp = 0 + "%";
                      home_per_l_yp = 0 + "%";

                  }else{

                      home_per_w_yp = (Math.round(1000 * ( v65 / v61 ))  / 10 + "%");
                      home_per_g_yp = (Math.round(1000 * ( v66 / v61 ))  / 10 + "%");
                      home_per_l_yp = (Math.round(1000 * ( v67 / v61 ))  / 10 + "%");

                  }

                  var data_total_r_half = [NumberInt(v61), NumberInt(v62), NumberInt(v63), NumberInt(v64), NumberInt(v65), NumberInt(v66), NumberInt(v67), NumberInt(v68), home_per_w_yp, home_per_g_yp, home_per_l_yp];

                  db.team.update({"_id": team_id, "access_total.yp_total_half.league_id" : league_id, "access_total.yp_total_half.year" : season_id}, {"$set":{"access_total.yp_total_half.$.data":data_total_r_half}});

// 走球盘路函数计算开始

                  function yp_count_team(xx,yy,zz,ww){

                      eval('var field11={'+ xx +':team_id,'+ yy +':{"$ne":""},'+ zz +':{"$ne":null},'+ ww +':{"$ne":null},"_id":{"$in": m_ids}}');

                      eval('var field21={'+ yy +':1,'+ zz +':1,'+ ww +':1,"_id":0}');

                      matches1 = db.match.find(field11,field21);

                      matches1.forEach(function(item) {

                        home_s=item[zz];
                        away_s=item[ww];
                        full_yp=item[yy];

                        full_yp_score=box_yp_fuc[full_yp];

                        pankou=home_s-full_yp_score-away_s;

                        box_pankou=box_pankou_yp();

                          function box_pankou_yp(){

                              if(xx == "home_team_id"){

                                  if(pankou>0){
                                    return home_w_yp++;
                                  }else if(pankou==0){
                                    return home_g_yp++;
                                  }else if(pankou<0){
                                    return home_l_yp++;
                                  }
                                
                              }else if(xx == "away_team_id"){

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

                      home_gd_yp = home_w_yp - home_l_yp;

                      yp_home_total = db.match.find(field11).count();

                      eval('var field31={'+ xx +':team_id,'+ yy +':"平手",'+ zz +':{"$ne":null},'+ ww +':{"$ne":null},"_id":{"$in": m_ids}}');

                      yp_home_mid = db.match.find(field31).count();

                      if(xx == "home_team_id"){

                          eval('var field41={'+ xx +':team_id,'+ yy +':/^受/,'+ zz +':{"$ne":null},'+ ww +':{"$ne":null},"_id":{"$in": m_ids}}');

                          yp_home_down = db.match.find(field41).count();

                          yp_home_up = yp_home_total-yp_home_mid-yp_home_down;

                      }else if(xx == "away_team_id"){

                          eval('var field41={'+ xx +':team_id,'+ yy +':/^受/,'+ zz +':{"$ne":null},'+ ww +':{"$ne":null},"_id":{"$in": m_ids}}');

                          yp_home_up = db.match.find(field41).count();

                          yp_home_down = yp_home_total-yp_home_mid-yp_home_up;

                      }

                      if(yp_home_total==0){

                          home_per_w_yp=0 + "%";
                          home_per_g_yp=0 + "%";
                          home_per_l_yp=0 + "%";

                      }else{

                          home_per_w_yp=(Math.round(1000 * (home_w_yp / yp_home_total)) / 10 + "%");
                          home_per_g_yp=(Math.round(1000 * (home_g_yp / yp_home_total)) / 10 + "%");
                          home_per_l_yp=(Math.round(1000 * (home_l_yp / yp_home_total)) / 10 + "%");

                      }
                    
                  }

// 走球盘路函数计算结束

      }

        }

    }

})

var end_time = new Date().getTime();
var use_time = end_time - start_time;
print("使用: " + Math.floor(use_time / 60000) + "分钟," + ((use_time % 60000)/1000).toFixed(2) + " 秒 !");