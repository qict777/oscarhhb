
var team_id = 3277;
var league_id = 721;
var season_id = "2013";

function res_tem(x){

    var m= '{"_id":'+team_id+',"access_total.';

    var n= '.year":"'+season_id+'"';

    var p= ',"access_total.';

    var q= '.league_id":'+league_id+'}';
      
    var c=m+x+n+p+x+q;

	eval('var field='+ c);

    var result_tem = db.team.find(field).count();

    return result_tem;

}

var tem = res_tem("dx_home");

print(tem);

