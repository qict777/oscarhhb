// 西甲、意甲比赛的积分统计 2014-02-24
// 2.先比互相之间战绩，然后顺序以互相间净胜球，互相间进球数，联赛总淨胜球，联赛进球数的顺序决定名次。
// （1）先比较双方直接交锋2场（按积分算，胜3分平1分负0分），积分高的在前
// （2）若直接交锋积分相同，则比较直接交锋的净胜球数（若相同再比进球数）
// （3）比较联赛总净胜球（若相同再比联赛总进球数

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

leagueinfo = db.league.find({"parent.$id":{"$in":[114,130]},"league_type":{"$in":[0,1]}},{"_id":1});

leagueinfo.forEach(function(item) {

  league_id = item._id;

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

              var team_id = parseInt(id);
              teaminfo = db.team.findOne({_id: team_id}, {_id: 0,name: 1});
              teamname = teaminfo.name;

              home_team_w_num = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score>this.full_away_score"},{_id:1}).count();

              home_team_d_num = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score==this.full_away_score"},{_id:1}).count();

              home_team_l_num = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score<this.full_away_score"},{_id:1}).count();

              home_match_times=home_team_w_num+home_team_d_num+home_team_l_num;

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

              away_team_w_num = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score<this.full_away_score"},{_id:1}).count();

              away_team_d_num = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score==this.full_away_score"},{_id:1}).count();

              away_team_l_num = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score>this.full_away_score"},{_id:1}).count();

              away_match_times=away_team_w_num+away_team_d_num+away_team_l_num;

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

              if(away_match_times==0){

                away_w_per = 0+"%";
                away_d_per = 0+"%";
                away_l_per = 0+"%";
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

                total_w_per = 0+"%";
                total_d_per = 0+"%";
                total_l_per = 0+"%";
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

              matches = db.match.find({"_id": {"$in": m_ids},"$or": [{"home_team_id": team_id}, {"away_team_id": team_id}],"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}}, {"home_team_id": 1,"away_team_id": 1,"full_home_score": 1,"full_away_score": 1,"match_time": 1}).sort({"match_time": -1}).limit(6);

              six_result = [];

              matches.forEach(function(item) {

                      var r;
                      hs = item['full_home_score'];
                      as = item['full_away_score'];
        
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

              total_r= Array(NumberInt(team_id), teamname, NumberInt(total_match_times), NumberInt(total_w_num), NumberInt(total_d_num), NumberInt(total_l_num), NumberInt(total_win_score), NumberInt(total_lose_score), NumberInt(total_gd), total_w_per, total_d_per, total_l_per, total_ave_win, total_ave_lose, NumberInt(total_scores), r6, r5, r4, r3, r2, r1);

              home_r = Array(NumberInt(team_id), teamname,NumberInt(home_match_times),NumberInt(home_team_w_num),NumberInt(home_team_d_num),NumberInt(home_team_l_num),NumberInt(home_win_score),NumberInt(home_lose_score),NumberInt(home_gd),home_w_per,home_d_per,home_l_per,home_ave_win,home_ave_lose,NumberInt(home_scores_total));

              away_r = Array(NumberInt(team_id), teamname, NumberInt(away_match_times), NumberInt(away_team_w_num), NumberInt(away_team_d_num), NumberInt(away_team_l_num), NumberInt(away_win_score), NumberInt(away_lose_score), NumberInt(away_gd), away_w_per, away_d_per, away_l_per, away_ave_win, away_ave_lose, NumberInt(away_scores_total));

              total_rr.push(total_r);
              home_rr.push(home_r);
              away_rr.push(away_r);
     
      }

      C=[],A=[],B=[];
      A=box3(total_rr);
      B=box3(home_rr);
      C=box3(away_rr);

      function box3(x){

           result = x.sort(s);
           BB = [];
           for (var i = 0, len = result.length; i < len; i++) {
             BB.push(result[i]);
           }

           return BB;

           //总积分比较
           function s(a, b) {
             if (b[14] - a[14] == 0.0) {
               return f0(a, b);
             } else {
               return b[14] - a[14];
             }
           }

           //双方直接交锋2场（按积分算，胜3分平1分负0分）

           function f0(a, b) {

             teamscore(a[2],b[2]);
             ht1=AA[0];
             at1=A[1];

             teamscore(b[2],a[2]);
             ht2=AA[1];
             at2=AA[0];

             ht=ht1+ht2;
             at=at1+at2;

             if (at - ht == 0.0) {
               return f1(a, b);
             } else {
               return at - ht;
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

           //双方直接交锋2场
           function teamscore(x,y){

               group = db.groups.findOne({"_id":groups_id},{"rounds.matches":1,"_id":0});
               m_ids = [];
               group.rounds.forEach(function(item) {
                 m_ids = m_ids.concat(item.matches);
               });

               home_team_id = x;
               away_team_id = y;

               matches = db.match.find({"_id":{"$in": m_ids},"home_team_id":home_team_id,"away_team_id":away_team_id},{"_id":0,"full_home_score":1,"full_away_score":1,"home_team_id":1,"away_team_id":1});
               
               matches.forEach(function(item) {
           
               //胜3分平1分负0分
               hs=item['full_home_score'];
               as=item['full_away_score'];

               });

               var home_total=0;
               var away_total=0;

               if(hs>as){
                 home_total=3;
               }else if(hs<as){
                 away_total=3;
               }else{
                   home_total=1;
                   away_total=1;
                 }

               AA=[];
               AA[0]=home_total;
               AA[1]=away_total;

               return AA;
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

      db.groups.update({"_id": groups_id}, {"$set": {"score_total": A,"score_home": B,"score_away": C}});

    }

  }

})