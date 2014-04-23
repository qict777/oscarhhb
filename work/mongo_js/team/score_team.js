// 所有联赛球队的各赛季的比赛信息{全场（主客场）+半场(主客场)}  2014-02-24

var total_match_times = 0;
var total_w_num = 0;
var total_d_num = 0;
var total_l_num = 0;
var total_win_score = 0;
var total_lose_score = 0;
var total_gd = 0;
var total_w_per = 0;
var total_d_per = 0;
var total_l_per = 0;
var total_ave_win = 0;
var total_ave_lose = 0;
var total_scores = 0;
var home_match_times = 0;
var home_team_w_num = 0;
var home_team_d_num = 0;
var home_team_l_num = 0;
var home_win_score = 0;
var home_lose_score = 0;
var home_gd = 0;
var home_w_per = 0;
var home_d_per = 0;
var home_l_per = 0;
var home_ave_win = 0;
var home_ave_lose = 0;
var home_scores_total = 0;
var away_match_times = 0;
var away_team_w_num = 0;
var away_team_d_num = 0;
var away_team_l_num = 0;
var away_win_score = 0;
var away_lose_score = 0;
var away_gd = 0;
var away_w_per = 0;
var away_d_per = 0;
var away_l_per = 0;
var away_ave_win = 0;
var away_ave_lose = 0;
var away_scores_total = 0;

leagueinfo = db.league.find({"parent.$id":{"$in":[40,87,143,165,181,194,206,214,223,246,260,272,284,292,299,305,311,323,332,338,348,354,360,368,378,382,387,391,398,408,439,442,449,454,458,462,470,473,477,480,487,491,495,498,505,508,510,514,517,521,557,563,584,590,595,600,603,606,609,613,615,618,620,622,625,628,630,683,706,720,731,753,764,768,774,778,785,791,797,802,807,813,821,825,827,831,836,838,841,845,856,877,881,883,887,891,895,898,114,130]},"league_type":{"$in":[0,1]}},{"_id":1,"name":1});

leagueinfo.forEach(function(item) {

  league_id = item._id;
  league_name = item.name;  
  seasons = db.league.findOne({"_id": league_id,"season.groups": {"$exists": true}}, {"_id": 0,"season.groups": 1,"season.year": 1});

  s = seasons["season"];

  for (var i = 0, len = s.length; i < len; i++) {

    if (!s[i]['groups']) {
      continue;
    }

    season_id = s[i]['year'];

    gs = s[i]['groups'];

    for (var j = 0, jlen = gs.length; j < jlen; j++) {

      groups_id = gs[j];
      m_ids = [];

      a = db.groups.findOne({"_id": gs[j],"rounds": {"$exists": true},"sub_type": 1}, {"_id": 0,"rounds.matches": 1});

      if (!a) {
        continue;
      }

      a.rounds.forEach(function(item1) {
        m_ids = m_ids.concat(item1.matches);
      });

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

      total_rr = [], home_rr = [], away_rr = [];

      for (var id in mn_ids) {

// 主场全场赢平负及比赛次数的数量统计

                var team_id = parseInt(id);

                home_team_w_num = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score>this.full_away_score"},{_id:1}).count();

                home_team_d_num = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score==this.full_away_score"},{_id:1}).count();

                home_team_l_num = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score<this.full_away_score"},{_id:1}).count();

                home_match_times=home_team_w_num+home_team_d_num+home_team_l_num;

// 主场半场赢平负及比赛次数的数量统计

                home_team_w_num_half = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"$where":"this.half_home_score>this.half_away_score"},{_id:1}).count();

                home_team_d_num_half = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"$where":"this.half_home_score==this.half_away_score"},{_id:1}).count();

                home_team_l_num_half = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"$where":"this.half_home_score<this.half_away_score"},{_id:1}).count();

                home_match_times_half=home_team_w_num_half+home_team_d_num_half+home_team_l_num_half;

// 主场全场得分失分及净得分的数量统计

                m = db.match.find({"_id": {"$in":m_ids},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"home_team_id": team_id}, {"_id": 0,"full_home_score":1,"full_away_score":1});

                var A1=[],B1=[];

                var home_win_score=0,home_lose_score=0;

                m.forEach(function(item){

                a=item.full_home_score;

                A1.push(a);

                b=item.full_away_score;

                B1.push(b);

                });

                function box1(x,y){
                  for(var i=0;i<x.length;i++){
                    y+=x[i];
                  }
                  return y;
                }

                home_win_score=box1(A1,home_win_score);
                home_lose_score=box1(B1,home_lose_score);
                home_gd=home_win_score-home_lose_score;

// 主场半场得分失分及净得分的数量统计

                m1 = db.match.find({"_id": {"$in":m_ids},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"home_team_id": team_id}, {"_id": 0,"half_home_score":1,"half_away_score":1});

                var A11=[],B11=[];

                var home_win_score_half=0,home_lose_score_half=0;

                m1.forEach(function(item){

                a1=item.half_home_score;

                A11.push(a1);

                b1=item.half_away_score;

                B11.push(b1);

                });

                home_win_score_half=box1(A11,home_win_score_half);
                home_lose_score_half=box1(B11,home_lose_score_half);
                home_gd_half=home_win_score_half-home_lose_score_half;

// 客场全场赢平负及比赛次数的数量统计

                away_team_w_num = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score<this.full_away_score"},{_id:1}).count();

                away_team_d_num = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score==this.full_away_score"},{_id:1}).count();

                away_team_l_num = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score>this.full_away_score"},{_id:1}).count();

                away_match_times=away_team_w_num+away_team_d_num+away_team_l_num;

                n = db.match.find({"_id": {"$in":m_ids},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"away_team_id": team_id}, {"_id": 0,"full_home_score":1,"full_away_score":1});

// 客场半场赢平负及比赛次数的数量统计

                away_team_w_num_half = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"$where":"this.half_home_score<this.half_away_score"},{_id:1}).count();

                away_team_d_num_half = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"$where":"this.half_home_score==this.half_away_score"},{_id:1}).count();

                away_team_l_num_half = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"$where":"this.half_home_score>this.half_away_score"},{_id:1}).count();

                away_match_times_half=away_team_w_num_half+away_team_d_num_half+away_team_l_num_half;

// 客场全场得分失分及净得分的数量统计

                n = db.match.find({"_id": {"$in":m_ids},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"away_team_id": team_id}, {"_id": 0,"full_home_score":1,"full_away_score":1});

                var A2=[],B2=[];

                var away_win_score=0,away_lose_score=0;

                n.forEach(function(item){

                a=item.full_away_score;

                A2.push(a);

                b=item.full_home_score;

                B2.push(b);

                });

                function box2(x,y){
                  for(var i=0;i<x.length;i++){
                    y+=x[i];
                  }
                  return y;
                }

                away_win_score=box2(A2,away_win_score);
                away_lose_score=box2(B2,away_lose_score);
                away_gd=away_win_score-away_lose_score;

// 客场半场得分失分及净得分的数量统计

                n1 = db.match.find({"_id": {"$in":m_ids},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"away_team_id": team_id}, {"_id": 0,"half_home_score":1,"half_away_score":1});

                var A21=[],B21=[];

                var away_win_score_half=0,away_lose_score_half=0;

                n1.forEach(function(item){

                a3=item.half_away_score;

                A21.push(a3);

                b3=item.half_home_score;

                B21.push(b3);

                });

                away_win_score_half=box2(A21,away_win_score_half);
                away_lose_score_half=box2(B21,away_lose_score_half);
                away_gd_half=away_win_score_half-away_lose_score_half;

//全场主客场总计 赛  胜 平 负 得 失 净 胜% 平%  负%  均得  均失  积分  的信息统计

                if(home_match_times==0){

                  home_w_per = 0 + "%";
                  home_d_per = 0 + "%";
                  home_l_per = 0 + "%";
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

                if(away_match_times==0){

                  away_w_per = 0 + "%";
                  away_d_per = 0 + "%";
                  away_l_per = 0 + "%";
                  away_ave_win = 0;
                  away_ave_lose = 0;

                }else{

                  away_w_per = (Math.round(1000 * (away_team_w_num / away_match_times)) / 10 + "%");
                  away_d_per = (Math.round(1000 * (away_team_d_num / away_match_times)) / 10 + "%");
                  away_l_per = (Math.round(1000 * (away_team_l_num / away_match_times)) / 10 + "%");
                  away_ave_win = (Math.round(100 * (away_win_score / away_match_times)) / 100);
                  away_ave_lose = (Math.round(100 * (away_lose_score / away_match_times)) / 100);
                
                }                

                away_scores_total = away_team_w_num * 3 + away_team_d_num;

                total_match_times = home_match_times + away_match_times;
                total_w_num = home_team_w_num + away_team_w_num;
                total_d_num = home_team_d_num + away_team_d_num;
                total_l_num = home_team_l_num + away_team_l_num;
                total_win_score = home_win_score + away_win_score;
                total_lose_score = home_lose_score + away_lose_score;
                total_gd = home_gd + away_gd;

                if(total_match_times==0){
                
                total_w_per = 0 + "%";
                total_d_per = 0 + "%";
                total_l_per = 0 + "%";
                total_ave_win = 0;
                total_ave_lose = 0;

                }else{
                
                total_w_per = (Math.round(1000 * (total_w_num / total_match_times)) / 10 + "%");
                total_d_per = (Math.round(1000 * (total_d_num / total_match_times)) / 10 + "%");
                total_l_per = (Math.round(1000 * (total_l_num / total_match_times)) / 10 + "%");
                total_ave_win = (Math.round(100 * (total_win_score / total_match_times)) / 100);
                total_ave_lose = (Math.round(100 * (total_lose_score / total_match_times)) / 100);

                }

                total_scores = total_w_num * 3 + total_d_num;

//半场主客场总计 赛  胜 平 负 得 失 净 胜% 平%  负%  均得  均失  积分  的信息统计

                if(home_match_times_half==0){

                  home_w_per_half = 0 + "%";
                  home_d_per_half = 0 + "%";
                  home_l_per_half = 0 + "%";
                  home_ave_win_half = 0;
                  home_ave_lose_half = 0;

                }else{
                
                  home_w_per_half = (Math.round(1000 * (home_team_w_num_half / home_match_times_half)) / 10 + "%");
                  home_d_per_half = (Math.round(1000 * (home_team_d_num_half / home_match_times_half)) / 10 + "%");
                  home_l_per_half = (Math.round(1000 * (home_team_l_num_half / home_match_times_half)) / 10 + "%");
                  home_ave_win_half = (Math.round(100 * (home_win_score_half / home_match_times_half)) / 100);
                  home_ave_lose_half = (Math.round(100 * (home_lose_score_half / home_match_times_half)) / 100);

                }

                home_scores_total_half = home_team_w_num_half * 3 + home_team_d_num_half;

                if(away_match_times_half==0){

                  away_w_per_half = 0 + "%";
                  away_d_per_half = 0 + "%";
                  away_l_per_half = 0 + "%";
                  away_ave_win_half = 0;
                  away_ave_lose_half = 0;

                }else{

                  away_w_per_half = (Math.round(1000 * (away_team_w_num_half / away_match_times_half)) / 10 + "%");
                  away_d_per_half = (Math.round(1000 * (away_team_d_num_half / away_match_times_half)) / 10 + "%");
                  away_l_per_half = (Math.round(1000 * (away_team_l_num_half / away_match_times_half)) / 10 + "%");
                  away_ave_win_half = (Math.round(100 * (away_win_score_half / away_match_times_half)) / 100);
                  away_ave_lose_half = (Math.round(100 * (away_lose_score_half / away_match_times_half)) / 100);
                
                }                

                away_scores_total_half = away_team_w_num_half * 3 + away_team_d_num_half;

                total_match_times_half = home_match_times_half + away_match_times_half;
                total_w_num_half = home_team_w_num_half + away_team_w_num_half;
                total_d_num_half = home_team_d_num_half + away_team_d_num_half;
                total_l_num_half = home_team_l_num_half + away_team_l_num_half;
                total_win_score_half = home_win_score_half + away_win_score_half;
                total_lose_score_half = home_lose_score_half + away_lose_score_half;
                total_gd_half = home_gd_half + away_gd_half;

                if(total_match_times_half==0){
                
                total_w_per_half = 0 + "%";
                total_d_per_half = 0 + "%";
                total_l_per_half = 0 + "%";
                total_ave_win_half = 0;
                total_ave_lose_half = 0;

                }else{
                
                total_w_per_half = (Math.round(1000 * (total_w_num_half / total_match_times_half)) / 10 + "%");
                total_d_per_half = (Math.round(1000 * (total_d_num_half / total_match_times_half)) / 10 + "%");
                total_l_per_half = (Math.round(1000 * (total_l_num_half / total_match_times_half)) / 10 + "%");
                total_ave_win_half = (Math.round(100 * (total_win_score_half / total_match_times_half)) / 100);
                total_ave_lose_half = (Math.round(100 * (total_lose_score_half / total_match_times_half)) / 100);

                }

                total_scores_half = total_w_num_half * 3 + total_d_num_half;

// // 全场近六场统计  赛 胜 平 负 得 失 净 得分  胜%

              function box_six(){

                    matches = db.match.find({"_id": {"$in": m_ids},"$or": [{"home_team_id": team_id}, {"away_team_id": team_id}],"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}}, {"home_team_id": 1,"away_team_id": 1,"full_home_score": 1,"full_away_score": 1,"match_time": 1}).sort({"match_time": -1}).limit(6);

                    six_result = [];

                    var team_six_w_socre = 0 ,team_l_six_socre = 0 ,team_six_gd_socre = 0 ; 

                    matches.forEach(function(item) {

                            var r;
                            hs = item['full_home_score'];
                            as = item['full_away_score'];
              
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

              box_six();

// // 半场近六场统计  赛 胜 平 负 得 失 净 得分  胜%

              function box_six_half(){

                    matches111 = db.match.find({"_id": {"$in": m_ids},"$or": [{"home_team_id": team_id}, {"away_team_id": team_id}],"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}, {"home_team_id": 1,"away_team_id": 1,"half_home_score": 1,"half_away_score": 1,"match_time": 1}).sort({"match_time": -1}).limit(6);

                    six_result = [];

                    var team_six_w_socre = 0 ,team_l_six_socre = 0 ,team_six_gd_socre = 0 ; 

                    matches111.forEach(function(item) {

                            var r;
                            hs = item['half_home_score'];
                            as = item['half_away_score'];
              
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

                      six_info_half = Array(total_six_total,total_six_w,total_six_d,total_six_l,team_six_w_socre,team_l_six_socre,team_six_gd_socre,total_six_score,total_six_per_w);

                      return six_info_half;

              }

              box_six_half();

// 将统计后的信息更新插入到集合中

// 全场积分计算

      var data_total_r = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(total_match_times), NumberInt(total_w_num), NumberInt(total_d_num), NumberInt(total_l_num), NumberInt(total_win_score), NumberInt(total_lose_score), NumberInt(total_gd), total_w_per, total_d_per, total_l_per, total_ave_win, total_ave_lose, NumberInt(total_scores), NumberInt(six_info[0]), NumberInt(six_info[1]), NumberInt(six_info[2]), NumberInt(six_info[3]), NumberInt(six_info[4]), NumberInt(six_info[5]), NumberInt(six_info[6]), NumberInt(six_info[7]), six_info[8]]

      }

       var data_home_r = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(home_match_times), NumberInt(home_team_w_num), NumberInt(home_team_d_num), NumberInt(home_team_l_num), NumberInt(home_win_score), NumberInt(home_lose_score), NumberInt(home_gd), home_w_per, home_d_per, home_l_per, home_ave_win, home_ave_lose, NumberInt(home_scores_total)]

      }

       var data_away_r = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(away_match_times), NumberInt(away_team_w_num), NumberInt(away_team_d_num), NumberInt(away_team_l_num), NumberInt(away_win_score), NumberInt(away_lose_score), NumberInt(away_gd), away_w_per, away_d_per, away_l_per, away_ave_win, away_ave_lose, NumberInt(away_scores_total)]

      }

// // 半场积分计算

       var data_total_r_half = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(total_match_times_half), NumberInt(total_w_num_half), NumberInt(total_d_num_half), NumberInt(total_l_num_half), NumberInt(total_win_score_half), NumberInt(total_lose_score_half), NumberInt(total_gd_half), total_w_per_half, total_d_per_half, total_l_per_half, total_ave_win_half, total_ave_lose_half, NumberInt(total_scores_half), NumberInt(six_info_half[0]), NumberInt(six_info_half[1]), NumberInt(six_info_half[2]), NumberInt(six_info_half[3]), NumberInt(six_info_half[4]), NumberInt(six_info_half[5]), NumberInt(six_info_half[6]), NumberInt(six_info_half[7]), six_info_half[8]]

      }

       var data_home_r_half = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(home_match_times_half), NumberInt(home_team_w_num_half), NumberInt(home_team_d_num_half), NumberInt(home_team_l_num_half), NumberInt(home_win_score_half), NumberInt(home_lose_score_half), NumberInt(home_gd_half), home_w_per_half, home_d_per_half, home_l_per_half, home_ave_win_half, home_ave_lose_half, NumberInt(home_scores_total_half)]

      }

       var data_away_r_half = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(away_match_times_half), NumberInt(away_team_w_num_half), NumberInt(away_team_d_num_half), NumberInt(away_team_l_num_half), NumberInt(away_win_score_half), NumberInt(away_lose_score_half), NumberInt(away_gd_half), away_w_per_half, away_d_per_half, away_l_per_half, away_ave_win_half, away_ave_lose_half, NumberInt(away_scores_total_half)]

      }

      db.team.update({"_id": team_id}, {"$push":{"access_total.score_total":data_total_r,"access_total.score_home":data_home_r,"access_total.score_away":data_away_r,"access_total.score_total_half":data_total_r_half,"access_total.score_home_half":data_home_r_half,"access_total.score_away_half":data_away_r_half}});
     
      }

    }

  }

})