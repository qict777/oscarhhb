// 联赛球队的各个赛季的盘路信息  2014-02-24

leagueinfo = db.league.find({"league_type":{"$in":[0,1]}},{"_id":1,"name":1});

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

      var total_rr=[], home_rr = [], away_rr = [] , total_rr_half= [], home_rr_half= [], away_rr_half = [];

      for (var id in mn_ids) {

        var team_id = parseInt(id);

// --------------------------------------------------------------------------------------------
// 让球盘路 : 赛 上盘 平盘 下盘 赢 走 输 净 胜% 走% 负%

        var home_w_yp=0,home_g_yp=0,home_l_yp=0,away_w_yp=0,away_g_yp=0,away_l_yp=0;
        var home_w_yp_half=0,home_g_yp_half=0,home_l_yp_half=0;
        var away_w_yp_half=0,away_g_yp_half=0,away_l_yp_half=0;

// --------------------------------------------------------------------------------------------
// home 全场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负%

        matches1 = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"full_yp":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}},{"_id":1,"full_yp":1,"full_home_score":1,"full_away_score":1});
        matches1.forEach(function(item) {
          home_s=item['full_home_score'];
          away_s=item['full_away_score'];
          full_yp=item['full_yp'];
          full_yp_score=box_yp_fuc(full_yp);
          pankou=home_s-full_yp_score-away_s;
          box_pankou=box_pankou();
          function box_pankou(){
              if(pankou>0){
                return home_w_yp++;
              }else if(pankou==0){
                return home_g_yp++;
              }else if(pankou<0){
                return home_l_yp++;
              }
          }
        });

        home_gd_yp=home_w_yp-home_l_yp;
        yp_home_total = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"full_yp":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}}).count();
        yp_home_mid = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"full_yp":"平手","full_home_score":{"$ne":null},"full_away_score":{"$ne":null}}).count();
        yp_home_down = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"full_yp":/^受/,"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}}).count();
        yp_home_up = yp_home_total-yp_home_mid-yp_home_down;

        if(yp_home_total==0){

          home_per_w_yp=0 + "%";
          home_per_g_yp=0 + "%";
          home_per_l_yp=0 + "%";

        }else{

          home_per_w_yp=(Math.round(1000 * (home_w_yp / yp_home_total)) / 10 + "%");
          home_per_g_yp=(Math.round(1000 * (home_g_yp / yp_home_total)) / 10 + "%");
          home_per_l_yp=(Math.round(1000 * (home_l_yp / yp_home_total)) / 10 + "%");

        }

// --------------------------------------------------------------------------------------------
// away 全场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负%    

        matches2 = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"full_yp":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}},{"_id":1,"full_yp":1,"full_home_score":1,"full_away_score":1});
        matches2.forEach(function(item) {
          home_s=item['full_home_score'];
          away_s=item['full_away_score'];
          full_yp=item['full_yp'];
          full_yp_score=box_yp_fuc(full_yp);
          pankou=home_s-full_yp_score-away_s;
          box_pankou=box_pankou();
          function box_pankou(){
              if(pankou<0){
                return away_w_yp++;
              }else if(pankou==0){
                return away_g_yp++;
              }else if(pankou>0){
                return away_l_yp++;
              }
          }
        });

        away_gd_yp=away_w_yp-away_l_yp;
        yp_away_total = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"full_yp":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}}).count();
        yp_away_mid = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"full_yp":"平手","full_home_score":{"$ne":null},"full_away_score":{"$ne":null}}).count();
        yp_away_up = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"full_yp":/^受/,"full_yp":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}}).count();
        yp_away_down = yp_away_total-yp_away_mid-yp_away_up;

        if(yp_away_total==0){

          away_per_w_yp= 0 + "%";
          away_per_g_yp= 0 + "%";
          away_per_l_yp= 0 + "%";

        }else{

          away_per_w_yp=(Math.round(1000 * (away_w_yp / yp_away_total)) / 10 + "%");
          away_per_g_yp=(Math.round(1000 * (away_g_yp / yp_away_total)) / 10 + "%");
          away_per_l_yp=(Math.round(1000 * (away_l_yp / yp_away_total)) / 10 + "%");

        }

// --------------------------------------------------------------------------------------------
// total 全场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负%    

        yp_total_total=yp_home_total+yp_away_total;
        yp_total_up   =yp_home_up+yp_away_up;
        yp_total_mid  =yp_home_mid+yp_away_mid;
        yp_total_down =yp_home_down+yp_away_down;
        total_w_yp=home_w_yp+away_w_yp;
        total_g_yp=home_g_yp+away_g_yp;
        total_l_yp=home_l_yp+away_l_yp;
        total_gd_yp=home_gd_yp+away_gd_yp;

        if(yp_total_total==0){

          total_per_w_yp= 0 + "%";
          total_per_g_yp= 0 + "%";
          total_per_l_yp= 0 + "%";

        }else{

          total_per_w_yp=(Math.round(1000 * (total_w_yp / yp_total_total)) / 10 + "%");
          total_per_g_yp=(Math.round(1000 * (total_g_yp / yp_total_total)) / 10 + "%");
          total_per_l_yp=(Math.round(1000 * (total_l_yp / yp_total_total)) / 10 + "%");

        }

// --------------------------------------------------------------------------------------------
// home 半场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负%     ,"half_yp":{"$ne":""}

        matches3 = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"half_yp":{"$ne":""},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}},{"_id":1,"half_yp":1,"half_home_score":1,"half_away_score":1});
        matches3.forEach(function(item) {
          home_s_half=item['half_home_score'];
          away_s_half=item['half_away_score'];
          half_yp=item['half_yp'];
          half_yp_score=box_yp_fuc(half_yp);
          pankou_half=home_s_half-half_yp_score-away_s_half;
          box_pankou_half=box_pankou_half();
          function box_pankou_half(){
              if(pankou_half>0){
                return home_w_yp_half++;
              }else if(pankou_half==0){
                return home_g_yp_half++;
              }else if(pankou_half<0){
                return home_l_yp_half++;
              }
          }
        });

        home_gd_yp_half=home_w_yp_half-home_l_yp_half;
        yp_home_total_half = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"half_yp":{"$ne":""},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}).count();
        yp_home_mid_half = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"half_yp":"平手","half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}).count();
        yp_home_down_half = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"half_yp":/^受/,"half_yp":{"$ne":""},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}).count();
        yp_home_up_half = yp_home_total_half-yp_home_mid_half-yp_home_down_half;

        if(yp_home_total_half==0){

          home_per_w_yp_half= 0 + "%";
          home_per_g_yp_half= 0 + "%";
          home_per_l_yp_half= 0 + "%";

        }else{

          home_per_w_yp_half=(Math.round(1000 * (home_w_yp_half / yp_home_total_half)) / 10 + "%");
          home_per_g_yp_half=(Math.round(1000 * (home_g_yp_half / yp_home_total_half)) / 10 + "%");
          home_per_l_yp_half=(Math.round(1000 * (home_l_yp_half / yp_home_total_half)) / 10 + "%");

        }

// --------------------------------------------------------------------------------------------
// away 半场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负%    

        matches4 = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"half_yp":{"$ne":""},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}},{"_id":1,"half_yp":1,"half_home_score":1,"half_away_score":1});
        matches4.forEach(function(item) {
          home_s_half=item['half_home_score'];
          away_s_half=item['half_away_score'];
          half_yp=item['half_yp'];
          half_yp_score=box_yp_fuc(half_yp);
          pankou_half=home_s_half-half_yp_score-away_s_half;
          box_pankou_half=box_pankou_half();
          function box_pankou_half(){
              if(pankou_half<0){
                return away_w_yp_half++;
              }else if(pankou_half==0){
                return away_g_yp_half++;
              }else if(pankou_half>0){
                return away_l_yp_half++;
              }
          }
        });

        away_gd_yp_half=away_w_yp_half-away_l_yp_half;
        yp_away_total_half = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"half_yp":{"$ne":""},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}).count();
        yp_away_mid_half = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"half_yp":"平手","half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}).count();
        yp_away_up_half = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"half_yp":/^受/,"half_yp":{"$ne":""},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}).count();
        yp_away_down_half = yp_away_total_half-yp_away_mid_half-yp_away_up_half;

        if(yp_away_total_half==0){

          away_per_w_yp_half= 0 + "%";
          away_per_g_yp_half= 0 + "%";
          away_per_l_yp_half= 0 + "%";

        }else{

          away_per_w_yp_half=(Math.round(1000 * (away_w_yp_half / yp_away_total_half)) / 10 + "%");
          away_per_g_yp_half=(Math.round(1000 * (away_g_yp_half / yp_away_total_half)) / 10 + "%");
          away_per_l_yp_half=(Math.round(1000 * (away_l_yp_half / yp_away_total_half)) / 10 + "%");

        }

// --------------------------------------------------------------------------------------------
// total 半场盘路 赛     上盘     平盘     下盘     赢     走     输     净     胜%     走%     负%    

        yp_total_total_half=yp_home_total_half+yp_away_total_half;
        yp_total_up_half   =yp_home_up_half+yp_away_up_half;
        yp_total_mid_half  =yp_home_mid_half+yp_away_mid_half;
        yp_total_down_half =yp_home_down_half+yp_away_down_half;
        total_w_yp_half=home_w_yp_half+away_w_yp_half;
        total_g_yp_half=home_g_yp_half+away_g_yp_half;
        total_l_yp_half=home_l_yp_half+away_l_yp_half;
        total_gd_yp_half=home_gd_yp_half+away_gd_yp_half;

        if(yp_total_total_half==0){

          total_per_w_yp_half= 0 + "%";
          total_per_g_yp_half= 0 + "%";
          total_per_l_yp_half= 0 + "%";

        }else{

          total_per_w_yp_half=(Math.round(1000 * (total_w_yp_half / yp_total_total_half)) / 10 + "%");
          total_per_g_yp_half=(Math.round(1000 * (total_g_yp_half / yp_total_total_half)) / 10 + "%");
          total_per_l_yp_half=(Math.round(1000 * (total_l_yp_half / yp_total_total_half)) / 10 + "%");

        }

// // 全场盘路计算---------------------------------------------------------------------------------

      var data_total_r = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(yp_total_total),NumberInt(yp_total_up), NumberInt(yp_total_mid), NumberInt(yp_total_down), NumberInt(total_w_yp), NumberInt(total_g_yp), NumberInt(total_l_yp), NumberInt(total_gd_yp), total_per_w_yp, total_per_g_yp, total_per_l_yp]

      }

       var data_home_r = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(yp_home_total),NumberInt(yp_home_up), NumberInt(yp_home_mid), NumberInt(yp_home_down), NumberInt(home_w_yp), NumberInt(home_g_yp), NumberInt(home_l_yp), NumberInt(home_gd_yp), home_per_w_yp, home_per_g_yp, home_per_l_yp]

      }

       var data_away_r = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(yp_away_total),NumberInt(yp_away_up), NumberInt(yp_away_mid), NumberInt(yp_away_down), NumberInt(away_w_yp), NumberInt(away_g_yp), NumberInt(away_l_yp), NumberInt(away_gd_yp), away_per_w_yp, away_per_g_yp, away_per_l_yp]

      }

// // 半场盘路计算----------------------------------------------------------------------------------

       var data_total_r_half = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(yp_total_total_half), NumberInt(yp_total_up_half), NumberInt(yp_total_mid_half), NumberInt(yp_total_down_half), NumberInt(total_w_yp_half), NumberInt(total_g_yp_half), NumberInt(total_l_yp_half), NumberInt(total_gd_yp_half), total_per_w_yp_half, total_per_g_yp_half, total_per_l_yp_half]

      }

       var data_home_r_half = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(yp_home_total_half), NumberInt(yp_home_up_half), NumberInt(yp_home_mid_half), NumberInt(yp_home_down_half), NumberInt(home_w_yp_half), NumberInt(home_g_yp_half), NumberInt(home_l_yp_half), NumberInt(home_gd_yp_half), home_per_w_yp_half, home_per_g_yp_half, home_per_l_yp_half]

      }

       var data_away_r_half = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(yp_away_total_half), NumberInt(yp_away_up_half), NumberInt(yp_away_mid_half), NumberInt(yp_away_down_half), NumberInt(away_w_yp_half), NumberInt(away_g_yp_half), NumberInt(away_l_yp_half), NumberInt(away_gd_yp_half), away_per_w_yp_half, away_per_g_yp_half, away_per_l_yp_half]

      }

      db.team.update({"_id": team_id}, {"$push":{"access_total.yp_total":data_total_r,"access_total.yp_home":data_home_r,"access_total.yp_away":data_away_r,"access_total.yp_total_half":data_total_r_half,"access_total.yp_home_half":data_home_r_half,"access_total.yp_away_half":data_away_r_half}});

// --------------------------------------------------------------------------------------------
// 盘路判断函数

          function box_yp_fuc(x){

            if(x=="平手"){
              return y=0;
            }else if(x=="平手/半球"){
              return y=0.25;
            }else if(x=="半球"){
              return y=0.5;
            }else if(x=="半球/一球"){
              return y=0.75;
            }else if(x=="一球"){
              return y=1;
            }else if(x=="一球/球半"){
              return y=1.25;
            }else if(x=="球半"){
              return y=1.5;
            }else if(x=="球半/两球"){
              return y=1.75;
            }else if(x=="两球"){
              return y=2;
            }else if(x=="两球/两球半"){
              return y=2.25;
            }else if(x=="两球半"){
              return y=2.5;
            }else if(x=="两球半/三球"){
              return y=2.75;
            }else if(x=="三球"){
              return y=3;
            }else if(x=="三球/三球半"){
              return y=3.25;
            }else if(x=="三球半"){
              return y=3.5;
            }else if(x=="三球半/四球"){
              return y=3.75;
            }else if(x=="四球"){
              return y=4;
            }else if(x=="四球/四球半"){
              return y=4.25;
            }else if(x=="四球半"){
              return y=4.5;
            }else if(x=="四球半/五球"){
              return y=4.75;
            }else if(x=="五球"){
              return y=5;
            }else if(x=="五球/五球半"){
              return y=5.25;
            }else if(x=="五球半"){
              return y=5.5;
            }else if(x=="五球半/六球"){
              return y=5.75;
            }else if(x=="六球"){
              return y=6;
            }else if(x=="六球/六球半"){
              return y=6.25;
            }else if(x=="六球半"){
              return y=6.5;
            }else if(x=="六球半/七球"){
              return y=6.75;
            }else if(x=="受平手/半球"){
              return y=-0.25;
            }else if(x=="受半球"){
              return y=-0.5;
            }else if(x=="受半球/一球"){
              return y=-0.75;
            }else if(x=="受一球"){
              return y=-1;
            }else if(x=="受一球/球半"){
              return y=-1.25;
            }else if(x=="受球半"){
              return y=-1.5;
            }else if(x=="受球半/两球"){
              return y=-1.75;
            }else if(x=="受两球"){
              return y=-2;
            }else if(x=="受两球/两球半"){
              return y=-2.25;
            }else if(x=="受两球半"){
              return y=-2.5;
            }else if(x=="受两球半/三球"){
              return y=-2.75;
            }else if(x=="受三球"){
              return y=-3;
            }else if(x=="受三球/三球半"){
              return y=-3.25;
            }else if(x=="受三球半"){
              return y=-3.5;
            }else if(x=="受三球半/四球"){
              return y=-3.75;
            }else if(x=="受四球"){
              return y=-4;
            }else if(x=="受四球/四球半"){
              return y=-4.25;
            }else if(x=="受四球半"){
              return y=-4.5;
            }else if(x=="受四球半/五球"){
              return y=-4.75;
            }else if(x=="受五球"){
              return y=-5;
            }else if(x=="受五球/五球半"){
              return y=-5.25;
            }else if(x=="受五球半"){
              return y=-5.5;
            }else if(x=="受五球半/六球"){
              return y=-5.75;
            }else if(x=="受六球"){
              return y=-6;
            }else if(x=="受六球/六球半"){
              return y=-6.25;
            }else if(x=="受六球半"){
              return y=-6.5;
            }else if(x=="受六球半/七球"){
              return y=-6.75;
            }

          }
  
      }

    }

  }

})