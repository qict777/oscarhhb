// 处理联赛球队的比赛成绩在各个赛季里的排名	2014-02-25
// 此脚本须最后被执行

leagueinfo = db.league.find({"league_type":{"$in":[0,1]}},{"_id":1});

leagueinfo.forEach(function(item) {

	league_id = item._id;

	seasons = db.league.findOne({"_id": league_id,"season.groups": {"$exists": true}}, {"_id": 0,"season.groups": 1,"season.year": 1});

	s = seasons["season"];

	for (var i=0,len=s.length;i<len;i++) {

		    if (!s[i]['groups']) {
		      continue;
		    }

		    year = s[i]['year'];

		    gs = s[i]['groups'];

		    for (var j = 0, jlen = gs.length; j < jlen; j++) {

			     groups_id = gs[j];
			     
			     var m_ids = [];

			      a = db.groups.findOne({"_id":groups_id,"rounds": {"$exists": true},"sub_type": 1}, {"_id": 0,"rounds.matches": 1});

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

					function num_team(x){

						 eval('var field1={'+ x +':1,"_id":0}');

						 info = db.groups.findOne({"_id":groups_id},field1);

						 if(info){

							 var home = info[x];

						      for (var id in mn_ids){

							        var team_id = parseInt(id);

									for(var a=0,tlen=home.length;a<tlen;a++){

											if(team_id==home[a][1]){

												num = home[a][0];

											}

									}

									var m= '{"_id":'+team_id+',"access_total.';

									var n= '.year":"'+year+'"}';
										
									var c=m+x+n;

									eval('var field2='+ c);

									var m1= '{"$set":{"access_total.';

									var n1= '.$.num":'+NumberInt(num)+'}}';
										
									var c1=m1+x+n1;

									eval('var field3='+ c1);
								    
									db.team.update(field2,field3);
					    		
					    		}
							
							}						 

					}					

					num_team('score_away');
					num_team('score_home');
					num_team('score_total');
					num_team('dx_away');
					num_team('dx_away_half');
					num_team('dx_home');
					num_team('dx_home_half');
					num_team('dx_total');
					num_team('dx_total_half');
					num_team('yp_away');
					num_team('yp_away_half');
					num_team('yp_home');
					num_team('yp_home_half');
					num_team('yp_total');
					num_team('yp_total_half');

			}

	}

})