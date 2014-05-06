#! /usr/bin/env sh
# 差异打包

cur_path=`dirname $0`
cd $cur_path

update_dir="update"
src_dir="web"

#LAST_VERSION='HEAD^'

if [ x$1 != x ];then
	LAST_VERSION=$1
else
	echo "请添加起始版本tag或cached参数!"
	exit
fi

if [ x$2 != x ]; then
	NEW_VERSION=$2
else
	echo "请添加结束版本tag或HEAD参数!"
	exit
fi

if [ -d $update_dir ];then
	rm -rf ${update_dir}
fi
mkdir ${update_dir}

cd $src_dir

# 复制差异文件
if [ ${LAST_VERSION} != 'cached' ];then
	buf="git diff --name-only ${LAST_VERSION} ${NEW_VERSION}"
else
	buf="git diff --name-only --${LAST_VERSION}"
fi

for line in `$buf`
do
	if [ -f $line ];then
		echo $line
		`cp -r --parents ${line} ../${update_dir}`
	fi
done

cd ..

# 加了第三个参数，就上传到服务器
if [ x$3 == x ];then
	echo "差异文件已生成完成，但未上传到服务器！"
	exit
fi

exit
