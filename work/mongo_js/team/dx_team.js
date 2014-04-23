// 联赛球队的各个赛季的大小球信息  2014-02-24

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

      mn_ids = {},A = [],B = [];

      b.forEach(function(item) {
        A = item.home_team_id;
        B = item.away_team_id;
        mn_ids[A] = A;
        mn_ids[B] = B;
      });    

      var  total_rr = [], home_rr = [], away_rr = [] ,total_rr_half=[],home_rr_half=[],away_rr_half=[];

      for (var id in mn_ids) {

        var team_id = parseInt(id);
        teaminfo = db.team.findOne({_id: team_id}, {_id: 0,name: 1});
        teamname = teaminfo.name;

// --------------------------------------------------------------------------------------------
// 大小球 赛 大球  走 小球  大球% 走%  小球%  开始计算

        var home_w_dx=0,home_g_dx=0,home_l_dx=0,away_w_dx=0,away_g_dx=0,away_l_dx=0;
        var home_w_dx_half=0,home_g_dx_half=0,home_l_dx_half=0;
        var away_w_dx_half=0,away_g_dx_half=0,away_l_dx_half=0;

// --------------------------------------------------------------------------------------------
// home 全场大小球 赛 大球  走 小球  大球% 走%  小球%

        matches1 = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"full_dx":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}},{"_id":0,"full_dx":1,"full_home_score":1,"full_away_score":1});
        matches1.forEach(function(item) {
          home_s=item['full_home_score'];
          away_s=item['full_away_score'];
          full_dx=item['full_dx'];
          full_dx_score=box_dx_fuc(full_dx);
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

        dx_home_total = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"full_dx":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}}).count();

        if(dx_home_total==0){

          home_per_w_dx=0 + "%";
          home_per_g_dx=0 + "%";
          home_per_l_dx=0 + "%";

        }else{

          home_per_w_dx=(Math.round(1000 * (home_w_dx / dx_home_total)) / 10 + "%");
          home_per_g_dx=(Math.round(1000 * (home_g_dx / dx_home_total)) / 10 + "%");
          home_per_l_dx=(Math.round(1000 * (home_l_dx / dx_home_total)) / 10 + "%");

        }

// --------------------------------------------------------------------------------------------
// away 全场大小球 赛 大球  走 小球  大球% 走%  小球%

        matches2 = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"full_dx":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}},{"_id":0,"full_dx":1,"full_home_score":1,"full_away_score":1});
        matches2.forEach(function(item) {
          home_s=item['full_home_score'];
          away_s=item['full_away_score'];
          full_dx=item['full_dx'];
          full_dx_score=box_dx_fuc(full_dx);
          pankou=home_s+away_s-full_dx_score;
          box_pankou=box_pankou();
          function box_pankou(){
              if(pankou>0){
                return away_w_dx++;
              }else if(pankou==0){
                return away_g_dx++;
              }else if(pankou<0){
                return away_l_dx++;
              }
          }
        });

        dx_away_total = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"full_dx":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}}).count();

        if(dx_away_total==0){

          away_per_w_dx=0 + "%";
          away_per_g_dx=0 + "%";
          away_per_l_dx=0 + "%";

        }else{

          away_per_w_dx=(Math.round(1000 * (away_w_dx / dx_away_total)) / 10 + "%");
          away_per_g_dx=(Math.round(1000 * (away_g_dx / dx_away_total)) / 10 + "%");
          away_per_l_dx=(Math.round(1000 * (away_l_dx / dx_away_total)) / 10 + "%");

        }

// // --------------------------------------------------------------------------------------------
// // total 全场大小球 赛 大球  走 小球  大球% 走%  小球%

        dx_total_total=dx_home_total+dx_away_total;
        total_w_dx=home_w_dx+away_w_dx;
        total_g_dx=home_g_dx+away_g_dx;
        total_l_dx=home_l_dx+away_l_dx;

        if(dx_total_total==0){

          total_per_w_dx= 0 + "%";
          total_per_g_dx= 0 + "%";
          total_per_l_dx= 0 + "%";

        }else{

          total_per_w_dx=(Math.round(1000 * (total_w_dx / dx_total_total)) / 10 + "%");
          total_per_g_dx=(Math.round(1000 * (total_g_dx / dx_total_total)) / 10 + "%");
          total_per_l_dx=(Math.round(1000 * (total_l_dx / dx_total_total)) / 10 + "%");

        }

// // --------------------------------------------------------------------------------------------
// // home 半场大小球 赛 大球  走 小球  大球% 走%  小球%

        matches3 = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"half_dx":{"$ne":""},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}},{"_id":0,"half_dx":1,"half_home_score":1,"half_away_score":1});
        matches3.forEach(function(item) {
          home_s_half=item['half_home_score'];
          away_s_half=item['half_away_score'];
          half_dx_half=item['half_dx'];
          half_dx_score_half=box_dx_fuc(half_dx_half);
          pankou_half=home_s_half+away_s_half-half_dx_score_half;
          box_pankou_half=box_pankou_half();
          function box_pankou_half(){
              if(pankou_half>0){
                return home_w_dx_half++;
              }else if(pankou_half==0){
                return home_g_dx_half++;
              }else if(pankou_half<0){
                return home_l_dx_half++;
              }
          }
        });

        dx_home_total_half = db.match.find({"_id":{"$in": m_ids},"home_team_id":team_id,"half_dx":{"$ne":""},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}).count();

        if(dx_home_total_half==0){

          home_per_w_dx_half= 0 + "%";
          home_per_g_dx_half= 0 + "%";
          home_per_l_dx_half= 0 + "%";

        }else{

          home_per_w_dx_half=(Math.round(1000 * (home_w_dx_half / dx_home_total_half)) / 10 + "%");
          home_per_g_dx_half=(Math.round(1000 * (home_g_dx_half / dx_home_total_half)) / 10 + "%");
          home_per_l_dx_half=(Math.round(1000 * (home_l_dx_half / dx_home_total_half)) / 10 + "%");

        }

// // --------------------------------------------------------------------------------------------
// // away 半场大小球 赛 大球  走 小球  大球% 走%  小球%

        matches4 = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"half_dx":{"$ne":""},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}},{"_id":0,"half_dx":1,"half_home_score":1,"half_away_score":1});
        matches4.forEach(function(item) {
          home_s_half=item['half_home_score'];
          away_s_half=item['half_away_score'];
          half_dx_half=item['half_dx'];
          half_dx_score_half=box_dx_fuc(half_dx_half);
          pankou_half=home_s_half+away_s_half-half_dx_score_half;
          box_pankou_half=box_pankou_half();
          function box_pankou_half(){
              if(pankou_half>0){
                return away_w_dx_half++;
              }else if(pankou_half==0){
                return away_g_dx_half++;
              }else if(pankou_half<0){
                return away_l_dx_half++;
              }
          }
        });

        dx_away_total_half = db.match.find({"_id":{"$in": m_ids},"away_team_id":team_id,"half_dx":{"$ne":""},"half_home_score":{"$ne":null},"half_away_score":{"$ne":null}}).count();

        if(dx_away_total_half==0){

          away_per_w_dx_half= 0 + "%";
          away_per_g_dx_half= 0 + "%";
          away_per_l_dx_half= 0 + "%";

        }else{

          away_per_w_dx_half=(Math.round(1000 * (away_w_dx_half / dx_away_total_half)) / 10 + "%");
          away_per_g_dx_half=(Math.round(1000 * (away_g_dx_half / dx_away_total_half)) / 10 + "%");
          away_per_l_dx_half=(Math.round(1000 * (away_l_dx_half / dx_away_total_half)) / 10 + "%");

        }

// // --------------------------------------------------------------------------------------------
// // total 半场大小球 赛 大球  走 小球  大球% 走%  小球%

        dx_total_total_half=dx_home_total_half+dx_away_total_half;
        total_w_dx_half=home_w_dx_half+away_w_dx_half;
        total_g_dx_half=home_g_dx_half+away_g_dx_half;
        total_l_dx_half=home_l_dx_half+away_l_dx_half;

        if(dx_total_total_half==0){

          total_per_w_dx_half=0 + "%";
          total_per_g_dx_half=0 + "%";
          total_per_l_dx_half=0 + "%";

        }else{

          total_per_w_dx_half=(Math.round(1000 * (total_w_dx_half / dx_total_total_half)) / 10 + "%");
          total_per_g_dx_half=(Math.round(1000 * (total_g_dx_half / dx_total_total_half)) / 10 + "%");
          total_per_l_dx_half=(Math.round(1000 * (total_l_dx_half / dx_total_total_half)) / 10 + "%");

        }

  // // 全场大小球计算---------------------------------------------------------------------------------
  // // 球队名称  赛 大球  走 小球  大球% 走%  小球%

      var data_total_r = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(dx_total_total), NumberInt(total_w_dx), NumberInt(total_g_dx), NumberInt(total_l_dx), total_per_w_dx, total_per_g_dx, total_per_l_dx]

      }

       var data_home_r = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(dx_home_total), NumberInt(home_w_dx), NumberInt(home_g_dx), NumberInt(home_l_dx), home_per_w_dx, home_per_g_dx, home_per_l_dx]

      }

       var data_away_r = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(dx_away_total), NumberInt(away_w_dx), NumberInt(away_g_dx), NumberInt(away_l_dx), away_per_w_dx, away_per_g_dx, away_per_l_dx]

      }

// // // 半场大小球计算----------------------------------------------------------------------------------

       var data_total_r_half = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(dx_total_total_half), NumberInt(total_w_dx_half), NumberInt(total_g_dx_half), NumberInt(total_l_dx_half), total_per_w_dx_half, total_per_g_dx_half, total_per_l_dx_half]

      }

       var data_home_r_half = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(dx_home_total_half), NumberInt(home_w_dx_half), NumberInt(home_g_dx_half), NumberInt(home_l_dx_half), home_per_w_dx_half, home_per_g_dx_half, home_per_l_dx_half]

      }

       var data_away_r_half = {

        "league_id":NumberInt(league_id),"league_name":league_name,"year":season_id,"data":[NumberInt(dx_away_total_half), NumberInt(away_w_dx_half), NumberInt(away_g_dx_half), NumberInt(away_l_dx_half), away_per_w_dx_half, away_per_g_dx_half, away_per_l_dx_half]

      }

      db.team.update({"_id": team_id}, {"$push":{"access_total.dx_total":data_total_r,"access_total.dx_home":data_home_r,"access_total.dx_away":data_away_r,"access_total.dx_total_half":data_total_r_half,"access_total.dx_home_half":data_home_r_half,"access_total.dx_away_half":data_away_r_half}});

// --------------------------------------------------------------------------------------------
// 大小球判断函数

        function box_dx_fuc(x){

          if(x=="0/0.5"){
            return y=0.25;
          }else if(x=="0.5"){
            return y=0.5;
          }else if(x=="0.5/1"){
            return y=0.75;
          }else if(x=="1"){
            return y=1;
          }else if(x=="1/1.5"){
            return y=1.25;
          }else if(x=="1.5"){
            return y=1.5;
          }else if(x=="1.5/2"){
            return y=1.75;
          }else if(x=="2"){
            return y=2;
          }else if(x=="2/2.5"){
            return y=2.25;
          }else if(x=="2.5"){
            return y=2.5;
          }else if(x=="2.5/3"){
            return y=2.75;
          }else if(x=="3"){
            return y=3;
          }else if(x=="3/3.5"){
            return y=3.25;
          }else if(x=="3.5"){
            return y=3.5;
          }else if(x=="3.5/4"){
            return y=3.75;
          }else if(x=="4"){
            return y=4;
          }else if(x=="4/4.5"){
            return y=4.25;
          }else if(x=="4.5"){
            return y=4.5;
          }else if(x=="4.5/5"){
            return y=4.75;
          }else if(x=="5"){
            return y=5;
          }else if(x=="5/5.5"){
            return y=5.25;
          }else if(x=="5.5"){
            return y=5.5;
          }else if(x=="5.5/6"){
            return y=5.75;
          }else if(x=="6"){
            return y=6;
          }else if(x=="6/6.5"){
            return y=6.25;
          }else if(x=="6.5"){
            return y=6.5;
          }else if(x=="6.5/7"){
            return y=6.75;
          }else if(x=="7"){
            return y=7;
          }else if(x=="7/7.5"){
            return y=7.25;
          }else if(x=="7.5"){
            return y=7.5;
          }else if(x=="7.5/8"){
            return y=7.75;
          }else if(x=="8"){
            return y=8;
          }else if(x=="8/8.5"){
            return y=8.25;
          }else if(x=="8.5"){
            return y=8.5;
          }else if(x=="8.5/9"){
            return y=8.75;
          }else if(x=="9"){
            return y=9;
          }else if(x=="9/9.5"){
            return y=9.25;
          }else if(x=="9.5"){
            return y=9.5;
          }else if(x=="9.5/10"){
            return y=9.75;
          }else if(x=="10"){
            return y=10;
          }else if(x=="10/10.5"){
            return y=10.25;
          }else if(x=="10.5"){
            return y=10.5;
          }else if(x=="10.5/11"){
            return y=10.75;
          }else if(x=="11"){
            return y=11;
          }else if(x=="11/11.5"){
            return y=11.25;
          }else if(x=="11.5"){
            return y=11.5;
          }else if(x=="11.5/12"){
            return y=11.75;
          }else if(x=="12"){
            return y=12;
          }else if(x=="12/12.5"){
            return y=12.25;
          }else if(x=="12.5"){
            return y=12.5;
          }else if(x=="12.5/13"){
            return y=12.75;
          }else if(x=="13"){
            return y=13;
          }else if(x=="13/13.5"){
            return y=13.25;
          }else if(x=="13.5"){
            return y=13.5;
          }else if(x=="13.5/14"){
            return y=13.75;
          }else if(x=="14"){
            return y=14;
          }else if(x=="14/14.5"){
            return y=14.25;
          }else if(x=="14.5"){
            return y=14.5;
          }else if(x=="14.5/15"){
            return y=14.75;
          }else if(x=="15"){
            return y=15;
          }else if(x=="15/15.5"){
            return y=15.25;
          }else if(x=="15.5"){
            return y=15.5;
          }else if(x=="15.5/16"){
            return y=15.75;
          }else if(x=="16"){
            return y=16;
          }

        }

      }

    }

  }

})