// 从current_groups里拿到最新比赛的match信息，得出赢走输的结果，更新字段 yp_res 的值 2014-03-05

var start_time = new Date().getTime();

// --------------------------------------------------------------------------------------------
// 让球盘路判断函数
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

}

league_info = db.current_groups.find({},{"_id":1});

league_info.forEach(function(item){

  league_id = item._id;

  groups_info = db.current_groups.findOne({"_id":league_id,"groups":{"$exists":true}},{"groups":1,"_id":0});

    if(groups_info){

        data1 = groups_info['groups'];

        for(var g=0,g_len=data1.length;g<g_len;g++){

          rounds_info = db.groups.findOne({"_id":data1[g],"rounds.matches":{"$exists":true}},{"rounds.matches":1,"_id":0});

          var match_ids=[];

          if(rounds_info){

              for(var r=0,r_len=rounds_info['rounds'].length;r<r_len;r++){

                match_ids = match_ids.concat(rounds_info['rounds'][r]['matches']);

              }

          }

          matches = db.match.find({"_id":{"$in":match_ids},"full_yp":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}},{"_id":1,"full_yp":1,"full_home_score":1,"full_away_score":1});

          matches.forEach(function(item) {
            match_id=item['_id'];
            hs=item['full_home_score'];
            as=item['full_away_score'];
            yp=item['full_yp'];
            yp_score=box_yp_fuc[yp];
            pankou=hs-as-yp_score;
            result=box();
            function box(){
                if(pankou>0){
                  return "赢";
                }else if(pankou==0){
                  return "走";
                }else if(pankou<0){
                  return "输";
                }
            }

            db.match.update({"_id":match_id,"full_yp":{"$ne":""}},{"$set":{"yp_res":result}});

          });

        }

    }

})

var end_time = new Date().getTime();
var use_time = end_time - start_time;
print("使用: " + Math.floor(use_time / 60000) + "分钟," + ((use_time % 60000)/1000).toFixed(2) + " 秒 !");