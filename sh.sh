#!/bin/bash
# echo 'start the mongodb insert process'
# cd `dirname $0`
# cd groups/
# mongo hhb3 score_rank1.js score_rank1_half.js score_rank2.js score_rank2_half.js score_rank3.js yp.js dx.js
# cd ../match/
# mongo hhb3 yp_res_match.js year_match_history.js
# cd ../team/
# mongo hhb3 score_team.js dx_team.js yp_team.js num_team.js beisai_team.js
# echo 'the history insert is over'


cd ../data_update/groups/
mongo hhb3 score_rank1.js score_rank1_half.js score_rank2.js score_rank2_half.js score_rank3.js yp_and_dx.js
cd ../match/
mongo hhb3 yp_res_match.js year_match_history.js
cd ../team/
mongo hhb3 score_team.js yp_and_dx_team.js num_team.js beisai_team.js
echo 'the update is over'