// 处理联赛球队的比赛成绩在各个赛季里的排名	2014-02-25
// 此脚本须最后被执行

var start_time = new Date().getTime();

league_info = db.current_groups.find({"league_type":{"$in":[0,1]}},{"_id":1,"league_name":1});

league_info.forEach(function(item){

  league_id = item._id;

  league_name = item.league_name;  

  groups_info = db.current_groups.findOne({"_id":league_id,"groups":{"$exists":true}},{"groups":1,"_id":0,"year":1});

  year = groups_info['year'];

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
            num_team('score_away_half');
            num_team('score_home');
            num_team('score_home_half');
            num_team('score_total');
            num_team('score_total_half');
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

var end_time = new Date().getTime();
var use_time = end_time - start_time;
print("使用: " + Math.floor(use_time / 60000) + "分钟," + ((use_time % 60000)/1000).toFixed(2) + " 秒 !");