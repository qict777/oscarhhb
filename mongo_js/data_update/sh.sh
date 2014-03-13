#!/bin/bash
echo 'start the mongodb update process'
cd `dirname $0`
cd groups/
mongo hhb score_rank1.js score_rank1_half.js score_rank2.js score_rank2_half.js score_rank3.js yp_and_dx.js
cd ../match/
mongo hhb yp_res_match.js
cd ../team/
mongo hhb beisai_team.js score_team.js yp_and_dx_team.js num_team.js
echo 'the update is over'
