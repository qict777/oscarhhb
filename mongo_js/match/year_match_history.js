// 从league中得到year的信息，插入到对应match表中 2014-03-15

var start_time = new Date().getTime();

leagueinfo = db.league.find({"league_type":{"$in":[0,1,2]},"season":{"$exists":1}},{"_id":1});

leagueinfo.forEach(function(item) {

  league_id = item._id;

  seasons = db.league.findOne({"_id": league_id,"season.groups": {"$exists": true}}, {"_id": 0,"season.groups": 1,"season.year": 1});

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

      a = db.groups.findOne({"_id": gs[j],"rounds": {"$exists": true}}, {"_id": 0,"rounds.matches": 1});

      if (!a) {
        continue;
      }

      a.rounds.forEach(function(item1) {
        m_ids = m_ids.concat(item1.matches);
      });

      db.match.update({"_id":{"$in":m_ids}},{"$set":{"year":season_id}},false,true);

    }
  
}
  }

})

var end_time = new Date().getTime();
var use_time = end_time - start_time;
print("使用: " + Math.floor(use_time / 60000) + "分钟," + ((use_time % 60000)/1000).toFixed(2) + " 秒 !");