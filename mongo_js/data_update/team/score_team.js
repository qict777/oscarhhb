// 所有联赛球队的各赛季的最新比赛信息更新{全场（主客场）+半场(主客场)}  2014-03-07

var start_time = new Date().getTime();

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

              b = db.match.find({"_id": {"$in": m_ids}}, {"_id": 0,"home_team_id": 1,"away_team_id": 1});

              mn_ids = {};
              A = [];
              B = [];

              b.forEach(function(item) {
                A = item.home_team_id;
                B = item.away_team_id;
                mn_ids[A] = A;
                mn_ids[B] = B;
              });      

              for (var id in mn_ids) {

                    var team_id = parseInt(id);

//  积分统计函数开始

                    function score_count(xx,yy,zz){

                        eval('var field1={"_id":1}');

                        eval('var field2={'+ xx +':team_id,'+ yy +':{"$ne":null},'+ zz +':{"$ne":null},"$where":"this.'+ yy +'>this.'+ zz +'","_id":{"$in": m_ids}}');

                        eval('var field3={'+ xx +':team_id,'+ yy +':{"$ne":null},'+ zz +':{"$ne":null},"$where":"this.'+ yy +'==this.'+ zz +'","_id":{"$in": m_ids}}');

                        eval('var field4={'+ xx +':team_id,'+ yy +':{"$ne":null},'+ zz +':{"$ne":null},"$where":"this.'+ yy +'<this.'+ zz +'","_id":{"$in": m_ids}}');

                        if(xx == "home_team_id"){

                            home_team_w_num = db.match.find(field2,field1).count();

                            home_team_l_num = db.match.find(field4,field1).count();

                        }else if(xx == "away_team_id"){

                            home_team_l_num = db.match.find(field2,field1).count();

                            home_team_w_num = db.match.find(field4,field1).count();

                        }

                        home_team_d_num = db.match.find(field3,field1).count();

                        home_match_times=home_team_w_num+home_team_d_num+home_team_l_num;

                        eval('var field5={'+ xx +':team_id,'+ yy +':{"$ne":null},'+ zz +':{"$ne":null},"_id":{"$in": m_ids}}');

                        eval('var field6={'+ zz +':1,'+ yy +':1,"_id":0}');

                        m = db.match.find(field5,field6);

                        var A1=[],B1=[];

                        m.forEach(function(item){

                            a=item[yy];

                            A1.push(a);

                            b=item[zz];

                            B1.push(b);

                        });

                        var home_win_score_num = 0 ,home_lose_score_num = 0 ;

                        if(xx == "home_team_id"){

                            home_win_score = box1(A1,home_win_score_num);
                            home_lose_score = box1(B1,home_lose_score_num);
                            home_gd = home_win_score-home_lose_score;

                        }else if(xx == "away_team_id"){

                            home_lose_score = box1(A1,home_win_score_num);
                            home_win_score = box1(B1,home_lose_score_num);
                            home_gd = home_win_score-home_lose_score;

                        }

                        function box1(x,y){
                          for(var i=0;i<x.length;i++){
                            y+=x[i];
                          }
                          return y;
                        }

                        if(home_match_times==0){

                            home_w_per = 0+"%";
                            home_d_per = 0+"%";
                            home_l_per = 0+"%";
                            home_ave_win = 0;
                            home_ave_lose = 0;

                        }else{

                            home_w_per = (Math.round(1000 * (home_team_w_num / home_match_times)) / 10 + "%");
                            home_d_per = (Math.round(1000 * (home_team_d_num / home_match_times)) / 10 + "%");
                            home_l_per = (Math.round(1000 * (home_team_l_num / home_match_times)) / 10 + "%");
                            home_ave_win = (Math.round(100 * (home_win_score / home_match_times)) / 100);
                            home_ave_lose = (Math.round(100 * (home_lose_score / home_match_times)) / 100);

                        }

                        home_scores_total = home_team_w_num * 3 + home_team_d_num;

                    }

//  积分统计函数结束             

//  近六场比赛积分统计开始

                    function box_six(yy,zz){

                            eval('var field71 ={"$or":[{"home_team_id":team_id},{"away_team_id":team_id}],'+ yy +':{"$ne":null},'+ zz +':{"$ne":null},"_id":{"$in": m_ids}}');

                            eval('var field72 ={'+ yy +':1,'+ zz +':1,"match_time":1,"home_team_id":1,"away_team_id":1,"_id":0}');

                            eval('var field73 ={"match_time":-1}');

                            // matches = db.match.find(field71,field72).limit(6);
                            matches = db.match.find(field71,field72).sort(field73).limit(6);

                            six_result = [];

                            var team_six_w_socre = 0 ,team_l_six_socre = 0 ,team_six_gd_socre = 0 ; 

                            matches.forEach(function(item) {

                                var r="";
                                hs = item[yy];
                                as = item[zz];
                  
                                if (item['home_team_id'] == team_id) {
                                  team_six_w_socre=team_six_w_socre+hs;
                                  team_l_six_socre=team_l_six_socre+as;
                                  if (hs > as) {
                                    r = "W";
                                  } else if (hs < as) {
                                    r = "L";
                                  } else {
                                    r = "D";
                                  }
                                } else {
                                  team_six_w_socre=team_six_w_socre+as;
                                  team_l_six_socre=team_l_six_socre+hs;                        
                                  if (hs > as) {
                                    r = "L";
                                  } else if (hs < as) {
                                    r = "W";
                                  } else {
                                    r = "D";
                                  }
                                }

                                six_result.push(r);
                            
                            });

                            team_six_gd_socre=team_six_w_socre-team_l_six_socre;

                            var total_six_w=0,total_six_d=0,total_six_l=0,total_six_total=0,total_six_score=0;

                            var j=six_result.length;

                            for(var i=0;i<j;i++){

                              if(six_result[i]=="W"){
                                total_six_w = total_six_w+1;
                              }else if(six_result[i]=="D"){
                                total_six_d = total_six_d+1;
                              }else if(six_result[i]=="L"){
                                total_six_l = total_six_l+1;
                              }

                            }              

                            total_six_total=total_six_w+total_six_d+total_six_l;
                            total_six_score=total_six_w*3+total_six_d;
                            if(total_six_total==0){
                              total_six_per_w = 0 + "%";
                            }else{
                              total_six_per_w = (Math.round(1000 * (total_six_w / total_six_total)) / 10 + "%");
                            }

                            six_info = Array(total_six_total,total_six_w,total_six_d,total_six_l,team_six_w_socre,team_l_six_socre,team_six_gd_socre,total_six_score,total_six_per_w);

                            return six_info;

                    }

//  近六场比赛积分统计结束

        // 主场--全场 赛 胜 平 负 得 失 净 胜%  平%  负%  均得  均失  积分

                score_count("home_team_id","full_home_score","full_away_score");
                
                var data_home_r = [NumberInt(home_match_times), NumberInt(home_team_w_num), NumberInt(home_team_d_num), NumberInt(home_team_l_num), NumberInt(home_win_score), NumberInt(home_lose_score), NumberInt(home_gd), home_w_per, home_d_per, home_l_per, home_ave_win, home_ave_lose, NumberInt(home_scores_total)];

                db.team.update({"_id": team_id, "access_total.score_home.league_id" : league_id, "access_total.score_home.year" : season_id}, {"$set":{"access_total.score_home.$.data":data_home_r}});

                var v11 = home_match_times ;
                var v12 = home_team_w_num ;
                var v13 = home_team_d_num ;
                var v14 = home_team_l_num ;
                var v15 = home_win_score ;
                var v16 = home_lose_score ;
                var v17 = home_gd ;

        // 客场--全场 赛 胜 平 负 得 失 净 胜%  平%  负%  均得  均失  积分

                score_count("away_team_id","full_home_score","full_away_score");

                var data_away_r = [NumberInt(home_match_times), NumberInt(home_team_w_num), NumberInt(home_team_d_num), NumberInt(home_team_l_num), NumberInt(home_win_score), NumberInt(home_lose_score), NumberInt(home_gd), home_w_per, home_d_per, home_l_per, home_ave_win, home_ave_lose, NumberInt(home_scores_total)];

                db.team.update({"_id": team_id, "access_total.score_away.league_id" : league_id, "access_total.score_away.year" : season_id}, {"$set":{"access_total.score_away.$.data":data_away_r}});

        // 主场+客场--全场 赛 胜 平 负 得 失 净 胜%  平%  负%  均得  均失  积分

                var v1 = v11 + home_match_times ;
                var v2 = v12 + home_team_w_num ;
                var v3 = v13 + home_team_d_num ;
                var v4 = v14 + home_team_l_num ;
                var v5 = v15 + home_win_score ;
                var v6 = v16 + home_lose_score ;
                var v7 = v17 + home_gd ;

                if(v1 == 0){

                  var v8 = 0+"%";
                  var v9 = 0+"%";
                  var v10 = 0+"%";
                  var v11 = 0;
                  var v12 = 0;

                }else{

                  var v8 = (Math.round(1000 * ( v2 / v1 )) / 10 + "%");
                  var v9 = (Math.round(1000 * ( v3 / v1 )) / 10 + "%");
                  var v10 = (Math.round(1000 * ( v4 / v1 )) / 10 + "%");
                  var v11 = (Math.round(100 * ( v5 / v1 )) / 100);
                  var v12 = (Math.round(100 * ( v6 / v1 )) / 100);

                }

                var v13 = v2 * 3 + v3;

                box_six("full_home_score","full_away_score");

                var data_total_r = [NumberInt(v1),NumberInt(v2),NumberInt(v3),NumberInt(v4),NumberInt(v5),NumberInt(v6),NumberInt(v7),v8,v9,v10,v11,v12,NumberInt(v13),NumberInt(six_info[0]),NumberInt(six_info[1]),NumberInt(six_info[2]),NumberInt(six_info[3]),NumberInt(six_info[4]),NumberInt(six_info[5]),NumberInt(six_info[6]),NumberInt(six_info[7]),six_info[8]];

                db.team.update({"_id": team_id, "access_total.score_total.league_id" : league_id, "access_total.score_total.year" : season_id}, {"$set":{"access_total.score_total.$.data":data_total_r}});

        // // 主场--半场 赛 胜 平 负 得 失 净 胜%  平%  负%  均得  均失  积分

               score_count("home_team_id","half_home_score","half_away_score");

               var data_home_r_half = [NumberInt(home_match_times), NumberInt(home_team_w_num), NumberInt(home_team_d_num), NumberInt(home_team_l_num), NumberInt(home_win_score), NumberInt(home_lose_score), NumberInt(home_gd), home_w_per, home_d_per, home_l_per, home_ave_win, home_ave_lose, NumberInt(home_scores_total)];

               db.team.update({"_id": team_id, "access_total.score_home_half.league_id" : league_id, "access_total.score_home_half.year" : season_id}, {"$set":{"access_total.score_home_half.$.data":data_home_r_half}});

                var k11 = home_match_times ;
                var k12 = home_team_w_num ;
                var k13 = home_team_d_num ;
                var k14 = home_team_l_num ;
                var k15 = home_win_score ;
                var k16 = home_lose_score ;
                var k17 = home_gd ;

        // // 客场--半场 赛 胜 平 负 得 失 净 胜%  平%  负%  均得  均失  积分

                score_count("away_team_id","half_home_score","half_away_score");

                var data_away_r_half = [NumberInt(home_match_times), NumberInt(home_team_w_num), NumberInt(home_team_d_num), NumberInt(home_team_l_num), NumberInt(home_win_score), NumberInt(home_lose_score), NumberInt(home_gd), home_w_per, home_d_per, home_l_per, home_ave_win, home_ave_lose, NumberInt(home_scores_total)];

                db.team.update({"_id": team_id, "access_total.score_away_half.league_id" : league_id, "access_total.score_away_half.year" : season_id}, {"$set":{"access_total.score_away_half.$.data":data_away_r_half}});

        // // 主场+客场--半场 赛 胜 平 负 得 失 净 胜%  平%  负%  均得  均失  积分

                var k1 = k11 + home_match_times ;
                var k2 = k12 + home_team_w_num ;
                var k3 = k13 + home_team_d_num ;
                var k4 = k14 + home_team_l_num ;
                var k5 = k15 + home_win_score ;
                var k6 = k16 + home_lose_score ;
                var k7 = k17 + home_gd ;

                if(k1 == 0){

                  var k8 = 0+"%";
                  var k9 = 0+"%";
                  var k10 = 0+"%";
                  var k11 = 0;
                  var k12 = 0;

                }else{

                  var k8 = (Math.round(1000 * ( k2 / k1 )) / 10 + "%");
                  var k9 = (Math.round(1000 * ( k3 / k1 )) / 10 + "%");
                  var k10 = (Math.round(1000 * ( k4 / k1 )) / 10 + "%");
                  var k11 = (Math.round(100 * ( k5 / k1 )) / 100);
                  var k12 = (Math.round(100 * ( k6 / k1 )) / 100);

                }

                var k13 = k2 * 3 + k3;

                box_six("half_home_score","half_away_score");

                var data_total_r_half = [NumberInt(k1),NumberInt(k2),NumberInt(k3),NumberInt(k4),NumberInt(k5),NumberInt(k6),NumberInt(k7),k8,k9,k10,k11,k12,NumberInt(k13),NumberInt(six_info[0]),NumberInt(six_info[1]),NumberInt(six_info[2]),NumberInt(six_info[3]),NumberInt(six_info[4]),NumberInt(six_info[5]),NumberInt(six_info[6]),NumberInt(six_info[7]),six_info[8]];
           
                db.team.update({"_id": team_id, "access_total.score_total_half.league_id" : league_id, "access_total.score_total_half.year" : season_id}, {"$set":{"access_total.score_total_half.$.data":data_total_r_half}});

              }

        }

    }

})

var end_time = new Date().getTime();
var use_time = end_time - start_time;
print("使用: " + Math.floor(use_time / 60000) + "分钟," + ((use_time % 60000)/1000).toFixed(2) + " 秒 !");