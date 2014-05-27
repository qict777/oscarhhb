// 英超、德甲+及下方其他所有球队各个最新赛事比赛的积分统计统计更新 2014-03-05
// 1.积分相同的球队由净胜球和总进球数等来决定排名。
// 净胜球高的在前，如果净胜球数相同，则进球数高的在前

var start_time = new Date().getTime();

// 英格兰、德国及其他赛事的league id

var type1=[40,87,143,165,181,194,206,214,223,246,260,272,284,292,299,305,311,323,332,338,348,354,360,368,378,382,387,391,398,408,439,442,449,454,458,462,470,473,477,480,487,491,495,498,505,508,510,514,517,521,557,563,584,590,595,600,603,606,609,613,615,618,620,622,625,628,630,683,706,720,731,753,764,768,774,778,785,791,797,802,807,813,821,825,827,831,836,838,841,845,856,877,881,883,887,891,895,898];

var ids_type1=[];

cgs=db.current_groups.find({},{"_id":1});

cgs.forEach(function(item) {

  league=db.league.findOne({"_id":item['_id']},{"parent.$id":1});

  pid=league['parent']['$id'];

  if(type1.indexOf(pid)>-1){

    ids_type1.push(item['_id']);

  }

})

league_info = db.current_groups.find({"_id":{"$in":ids_type1},"league_type":{"$in":[0,1]}},{"_id":1,"league_name":1});

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

              b = db.match.find({"_id": {"$in": m_ids},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}, {"_id": 0,"home_team_id": 1,"away_team_id": 1});

              mn_ids = {};
              A = [];
              B = [];

              b.forEach(function(item) {
                A = item.home_team_id;
                B = item.away_team_id;
                mn_ids[A] = A;
                mn_ids[B] = B;
              });      

              var total_rr = [], home_rr = [], away_rr = [];

              for (var id in mn_ids) {

                var team_id = parseInt(id);

                teaminfo = db.team.findOne({_id: team_id}, {_id: 0,name: 1});

                teamname = teaminfo.name;


  // 计算半场主队积分

                score_count("home_team_id");

                home_r = Array(NumberInt(team_id), teamname,NumberInt(home_match_times),NumberInt(home_team_w_num),NumberInt(home_team_d_num),NumberInt(home_team_l_num),NumberInt(home_win_score),NumberInt(home_lose_score),NumberInt(home_gd),home_w_per,home_d_per,home_l_per,home_ave_win,home_ave_lose,NumberInt(home_scores_total));
                
                home_rr.push(home_r);

                var v11 = home_match_times ;
                var v12 = home_team_w_num ;
                var v13 = home_team_d_num ;
                var v14 = home_team_l_num ;
                var v15 = home_win_score ;
                var v16 = home_lose_score ;
                var v17 = home_gd ;

  // 计算半场客队积分

                score_count("away_team_id");

                away_r = Array(NumberInt(team_id), teamname,NumberInt(home_match_times),NumberInt(home_team_w_num),NumberInt(home_team_d_num),NumberInt(home_team_l_num),NumberInt(home_win_score),NumberInt(home_lose_score),NumberInt(home_gd),home_w_per,home_d_per,home_l_per,home_ave_win,home_ave_lose,NumberInt(home_scores_total));

                away_rr.push(away_r);

                var v1 = v11 + home_match_times ;
                var v2 = v12 + home_team_w_num ;
                var v3 = v13 + home_team_d_num ;
                var v4 = v14 + home_team_l_num ;
                var v5 = v15 + home_win_score ;
                var v6 = v16 + home_lose_score ;
                var v7 = v17 + home_gd ;

  // 计算半场(主+客)队积分

                    if(v1 ==0){

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

// 计算半场(主队+客队)近六轮比赛结果

                matches = db.match.find({"_id": {"$in": m_ids},"$or": [{"home_team_id": team_id}, {"away_team_id": team_id}],"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}, {"home_team_id": 1,"away_team_id": 1,"half_home_score": 1,"half_away_score": 1,"match_time": 1}).sort({"match_time": -1}).limit(6);

                var six_result = [];

                matches.forEach(function(item) {

                      var r = "";
                      hs = item['half_home_score'];
                      as = item['half_away_score'];
        
                      if (item['home_team_id'] == team_id) {
                        if (hs > as) {
                          r = "W";
                        } else if (hs < as) {
                          r = "L";
                        } else {
                          r = "D";
                        }
                      } else {
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

                if(six_result[0]==null){
                  six_result[0]="-";
                } 

                if(six_result[1]==null){
                  six_result[1]="-";
                } 

                if(six_result[2]==null){
                  six_result[2]="-";
                } 

                if(six_result[3]==null){
                  six_result[3]="-";
                } 

                if(six_result[4]==null){
                  six_result[4]="-";
                } 

                if(six_result[5]==null){
                  six_result[5]="-";
                }

                var r1 = 0,r2 = 0,r3 = 0,r4 = 0,r5 = 0,r6 = 0;

                r1 = six_result[0];
                r2 = six_result[1];
                r3 = six_result[2];
                r4 = six_result[3];
                r5 = six_result[4];
                r6 = six_result[5];

                total_r= Array(NumberInt(team_id),teamname,NumberInt(v1),NumberInt(v2),NumberInt(v3),NumberInt(v4),NumberInt(v5),NumberInt(v6),NumberInt(v7),v8,v9,v10,v11,v12,NumberInt(v13),r6,r5,r4,r3,r2,r1);

                total_rr.push(total_r);

// 积分统计函数开始

                function score_count(xx){

                    eval('var field1={"_id":1}');

                    eval('var field2={'+ xx +':team_id,"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"$where":"this.half_home_score>this.half_away_score","_id":{"$in": m_ids}}');

                    eval('var field3={'+ xx +':team_id,"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"$where":"this.half_home_score==this.half_away_score","_id":{"$in": m_ids}}');

                    eval('var field4={'+ xx +':team_id,"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"$where":"this.half_home_score<this.half_away_score","_id":{"$in": m_ids}}');

                    if(xx == "home_team_id"){

                        home_team_w_num = db.match.find(field2,field1).count();

                        home_team_l_num = db.match.find(field4,field1).count();

                    }else if(xx == "away_team_id"){

                        home_team_l_num = db.match.find(field2,field1).count();

                        home_team_w_num = db.match.find(field4,field1).count();

                    }

                    home_team_d_num = db.match.find(field3,field1).count();

                    home_match_times=home_team_w_num+home_team_d_num+home_team_l_num;

                    eval('var field5={'+ xx +':team_id,"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"_id":{"$in": m_ids}}');

                    eval('var field6={"half_away_score":1,"half_home_score":1,"_id":0}');

                    m = db.match.find(field5,field6);

                    var A1=[],B1=[];

                    m.forEach(function(item){

                    a=item.half_home_score;

                    A1.push(a);

                    b=item.half_away_score;

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

// 积分统计函数结束
   
      }

// 结果排序

      var A=[],B=[],C=[];
      A=box3(total_rr);
      B=box3(home_rr);
      C=box3(away_rr);

      function box3(x){
    
            result = x.sort(s);

            y = [];

            for (var i = 0, len = result.length; i < len; i++) {
              y.push(result[i]);
            }

            return y;

            //总积分比较
            function s(a, b) {
              if (b[14] - a[14] == 0.0) {
                return f1(a, b);
              } else {
                return b[14] - a[14];
              }
            }

            //总净胜球比较
            function f1(a, b) {
              if (b[8] - a[8] == 0.0) {
                return f2(a, b);
              } else {
                return b[8] - a[8];
              }
            }

            //总进球数比较
            function f2(a, b) {
              return b[6] - a[6];
            }

       }

// 在已经排序好的数组前，加上排名编号

      for(var ai=0,alen=A.length;ai<alen;ai++){
        A[ai].unshift(NumberInt(ai+1));
      }
      for(var bi=0,blen=B.length;bi<blen;bi++){
        B[bi].unshift(NumberInt(bi+1));
      }
      for(var ci=0,clen=C.length;ci<clen;ci++){
        C[ci].unshift(NumberInt(ci+1));
      }

      db.groups.update({"_id": groups_id}, {"$set": {"score_total_half": A,"score_home_half": B,"score_away_half": C}});

    }

  }

})

var end_time = new Date().getTime();
var use_time = end_time - start_time;
print("使用: " + Math.floor(use_time / 60000) + "分钟," + ((use_time % 60000)/1000).toFixed(2) + " 秒 !");