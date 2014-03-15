// 从league中得到year的信息，插入到对应match表中 2014-03-15

var start_time = new Date().getTime();

league_info = db.current_groups.find({},{"_id":1});

league_info.forEach(function(item){

  league_id = item._id;

  groups_info = db.current_groups.findOne({"_id":league_id,"groups":{"$exists":true}},{"groups":1,"_id":0,"year":1});

    if(groups_info){

        data1 = groups_info['groups'];
        year = groups_info['year'];

        for(var g=0,g_len=data1.length;g<g_len;g++){

          rounds_info = db.groups.findOne({"_id":data1[g],"rounds.matches":{"$exists":true}},{"rounds.matches":1,"_id":0});

          var match_ids=[];

          if(rounds_info){

              for(var r=0,r_len=rounds_info['rounds'].length;r<r_len;r++){

                match_ids = match_ids.concat(rounds_info['rounds'][r]['matches']);

              }

          }

        db.match.update({"_id":{"$in":match_ids}},{"$set":{"year":year}},false,true);      

        }

    }

})

var end_time = new Date().getTime();
var use_time = end_time - start_time;
print("使用: " + Math.floor(use_time / 60000) + "分钟," + ((use_time % 60000)/1000).toFixed(2) + " 秒 !");