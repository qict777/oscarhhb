#!/bin/bash
echo 'start the mongodb update process'
cd `dirname $0`
cd groups/
mongo 192.168.8.158:27800/hhb score_rank1.js score_rank2.js score_rank3.js yp_and_dx.js
cd ../match/
mongo 192.168.8.158:27800/hhb yp_res_match.js
cd ../team/
mongo 192.168.8.158:27800/hhb beisai_team.js score_team.js yp_and_dx_team.js num_team.js
echo 'the update is over'
