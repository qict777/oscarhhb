// 从match里拿到比赛的盘路数据 ，得出赢走输的结果，插入到新字段 yp_res 中   2014-02-24

matches = db.match.find({"full_yp":{"$ne":""},"full_home_score":{"$ne":null},"full_away_score":{"$ne":null}},{"_id":1,"full_yp":1,"full_home_score":1,"full_away_score":1});

matches.forEach(function(item) {
  match_id=item['_id'];
  hs=item['full_home_score'];
  as=item['full_away_score'];
  yp=item['full_yp'];
  yp_score=box_yp_fuc(yp);
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