// 世界杯（国际赛事）以及所有其他赛事中 "league_type":2 的杯赛比赛的积分统计 2014-02-24

leagueinfo = db.league.find({"league_type":2},{"_id":1});

leagueinfo.forEach(function(item){

league_id=item._id;

seasons = db.league.findOne({"_id":league_id,"season.groups":{"$exists":true}},{"_id":0,"season.groups":1,"season.year":1});

if(seasons){

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

        a = db.groups.findOne({"_id": gs[j],"rounds": {"$exists": true},"sub_type": 1}, {"_id": 0,"rounds.matches": 1,"rounds.name": 1});

        if (!a) {
          continue;
        }

        a.rounds.forEach(function(item1) {

          m_ids = item1.matches;

          r_name = item1.name;

          b = db.match.find({"_id":{"$in":m_ids}},{"_id":0,"home_team_id":1,"away_team_id":1});

          // b = db.match.find({"_id":{"$in":m_ids},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}},{"_id":0,"home_team_id":1,"away_team_id":1});

          mn_ids = {};
          A = [];
          B = [];

          b.forEach(function(item) {
            A = item.home_team_id;
            B = item.away_team_id;
            mn_ids[A] = A;
            mn_ids[B] = B;
          });

          total_rr = [];

          for (var id in mn_ids) {

              var team_id = parseInt(id);
              teaminfo = db.team.findOne({_id:team_id},{_id:0,name:1});
              teamname = teaminfo.name;

              //计算home team id参加的比赛的胜平负的总数量
              home_team_w_num = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score>this.full_away_score"},{_id:1}).count();

              home_team_d_num = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score==this.full_away_score"},{_id:1}).count();

              home_team_l_num = db.match.find({"_id": {"$in":m_ids},"home_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score<this.full_away_score"},{_id:1}).count();

              //计算away team id参加的比赛的胜平负的总数量
              away_team_w_num = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score<this.full_away_score"},{_id:1}).count();

              away_team_d_num = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score==this.full_away_score"},{_id:1}).count();

              away_team_l_num = db.match.find({"_id": {"$in":m_ids},"away_team_id":team_id,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"$where":"this.full_home_score>this.full_away_score"},{_id:1}).count();

              //计算team id参加的比赛的胜平负的总进球数量、总失球数量、总净球数量、总的比赛数量

              m = db.match.find({"_id": {"$in":m_ids},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"home_team_id": team_id}, {"_id": 0,"full_home_score":1,"full_away_score":1});

              var A1=[],B1=[];

              var home_t1=0,away_t1=0,home_t=0,away_t=0,gd=0;

              m.forEach(function(item){

              a=item.full_home_score;

              A1.push(a);

              b=item.full_away_score;

              B1.push(b);

              });

              function box(x,y){
                for(var i=0;i<x.length;i++){
                  y+=x[i];
                }
                return y;
              }

              home_t1=box(A1,home_t1);
              away_t1=box(B1,away_t1);

              n = db.match.find({"_id": {"$in":m_ids},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null},"away_team_id": team_id}, {"_id": 0,"full_home_score":1,"full_away_score":1});

              var A2=[],B2=[];

              var home_t2=0,away_t2=0;

              n.forEach(function(item){

              a=item.full_away_score;

              A2.push(a);

              b=item.full_home_score;

              B2.push(b);

              });

              function box(x,y){
                for(var i=0;i<x.length;i++){
                  y+=x[i];
                }
                return y;
              }

              home_t2=box(A2,home_t2);
              away_t2=box(B2,away_t2);
              home_t=home_t1+home_t2;
              away_t=away_t1+away_t2;
              gd=home_t-away_t;

              total_w_num = home_team_w_num + away_team_w_num;
              total_d_num = home_team_d_num + away_team_d_num;
              total_l_num = home_team_l_num + away_team_l_num;
              total_match_times = total_w_num + total_d_num +total_l_num;
              total_scores = total_w_num * 3 + total_d_num;

              total_r = Array(NumberInt(team_id),teamname, NumberInt(total_match_times), NumberInt(total_w_num), NumberInt(total_d_num), NumberInt(total_l_num), NumberInt(home_t), NumberInt(away_t), NumberInt(gd), NumberInt(total_scores));
              
              total_rr.push(total_r);
       
          }

          A4=[];
         
          A4=box1(total_rr);

          function box1(x){
      
              result = x.sort(s);

              y = [];

              for (var i = 0, len = result.length; i < len; i++) {
                y.push(result[i]);
              }

              return y;

              //总积分比较
              function s(a, b) {
                if (b[9] - a[9] == 0.0) {
                  return f1(a, b);
                } else {
                  return b[9] - a[9];
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

          for(var ai=0,alen=A4.length;ai<alen;ai++){
            A4[ai].unshift(NumberInt(ai+1));
          }
          
          db.groups.update({"rounds.name":r_name,"_id":groups_id},{"$set":{"rounds.$.score_cup":A4}})

        })
    }
}

}

})