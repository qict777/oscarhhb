PS：下文脚本中出现的 'hhb' 为mondodb数据库的库名，可以根据需要修改

一：先执行历史数据的脚本（仅仅需执行一次）

1：进入 groups 目录，执行如下脚本

mongo hhb -quiet dx.js yp.js score_rank1.js score_rank2.js score_rank3.js 

2：进入 match 目录，执行如下脚本

mongo hhb -quiet yp_res_match.js

3：进入 team 目录，执行如下脚本

mongo hhb -quiet beisai_team.js score_team.js dx_team.js yp_team.js

PS：以上1、2、3步可以同时操作

4：进入 team 目录，执行如下脚本

mongo hhb -quiet num_team.js

PS：第4步须在1、2、3步都完成后再操作


二：执行更新数据的脚本（定时执行）

1：进入 data_update\groups 目录，执行如下脚本

mongo hhb -quiet dx.js yp.js score_rank1.js score_rank2.js score_rank3.js 

2：进入 data_update\match 目录，执行如下脚本

mongo hhb -quiet yp_res_match.js

3：进入 data_update\team 目录，执行如下脚本

mongo hhb -quiet beisai_team.js score_team.js dx_team.js yp_team.js

PS：以上1、2、3步可以同时操作

4：进入 data_update\team 目录，执行如下脚本

mongo hhb -quiet num_team.js

PS：第4步须在1、2、3步骤都完成后再操作