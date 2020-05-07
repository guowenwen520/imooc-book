# vue-imooc-ebook

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 项目上线流程
```
操作系统 centos_7_02_64_20G_alibase_20170818.vhd
```
### 远程连接服务器
```
第一次连接 ssh root@39.105.60.100(ip地址)
如果之前连接过，中途更换了操作系统，需要将第一次添加的host-key删除 命令：rm -fr ~/.ssh/known_hosts
```
### 免密登录
```
ssh-keygen -t rsa  一路回车 提示overwrite时选择否

ssh-copy-id -i ~/.ssh/id_rsa.pub root@39.105.60.100   期间需要输入 yes 以及目标服务器的密码

输入ssh root@39.105.60.100  即可登录
```
### 通过nvm配置node环境
``` 安装nvm(centos系统)

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

通过ll .nvm/ 检查是否安装成功 
如果找不到nvm命令，说明没有安装成功
  ll .bash
  ll.bash_profile
  vim .bash_profile 这里没有找到nvm
  vim.bashrc 这里找到了nvm
  source .bashrc 将环境变量重新指向bashrc
安装成功后 nvm install node 下载最新版本的node
  node -v查看node版本  查询到了说明安装成功了
```
### 用cnpm代替npm下载 提高下载速度
``` npm install cnpm -g --registry=https://r.npm.taobao.org
```
### 配置nginx服务器
  ### 安装以下两个依赖包
  ```
    yum -y install pcre* 
    yum -y install openssl*
  ```
  ### 创建nginx目录
  ```
    mkdir nginx
    cd nginx/
  ```
  ### 下载并安装nginx包
  ```
    wget http://nginx.org/download/nginx-1.16.1.tar.gz
    命令行中分别输入make gcc  检查make和gcc指令是否存在
    解压：tar -zxvf nginx-1.16.1.tar.gz
    打开安装nginx的地址: cd nginx-1.16.1
    ll: 查看详细文件
    执行可执行文件configure: sh configure
    对源码进行编译:make -j4
    安装: make install
    通过指令检查nginx配置文件是否存在: /usr/local/nginx/sbin/nginx -t
    创建一个nginx快捷方式:指向/usr/local/nginx/sbin/nginx
      cd /usr/bin/
      ln -s /usr/local/nginx/sbin/nginx nginx
      ll nginx 发现nginx -> /usr/local/nginx/sbin/nginx nginx 说明nginx已经成功指向nginx
      启动nginx服务:
        cd
        pwd 显示当前所处的路径 此时回到了根目录 /root
        nginx
        查看是否已经启动:
        ps -ef|grep nginx
      停止nginx服务:
        nginx -s stop
        ps -ef|grep nginx
  ```
  ### nginx远程访问
  ```
    cd /usr/local/nginx
    ll
    cd conf/
    vim nginx.conf 此时看到nginx的详细配置信息
    :q 退出nginx.conf
    cd ../
    cd html/
    ll: 发现有两个文件 50x.html和index.html
    cd ../ 重新回到nginx目录
    nginx启动nginx服务器
    ping 39.105.60.100检查是否能连接上，如果连接不上可能是阿里云服务安全组没有开通80端口需要手动配置一下
  ```
  ### 对nginx配置文件conf进行配置
  ```
    创建nginx/nginx.conf文件
      cd nginx/
      vim nginx.conf
      :q退出
    打开nginx配置文件
      vim /usr/local/nginx/conf/nginx.conf
      修改: user root;
      将root下面所有的配置文件融合到当前的配置文件:include /root/nginx/*.conf;
      :wq退出(保存修改)
    vim nginx.conf 打开新建的配置文件 作以下修改
      server {
        listen 80;
        server_name localhost;
        root /root/nginx/upload;
        autoindex on;
        add_header Cache-Control "no-cache, must-revalidate";
        location / {
          add_header Access-Control-Allow-Origin *;
        }
      }
      :wq保存并退出
    mkdir upload 创建upload目录
    cd upload
    vim index.html 创建了index.html文件随便写入一些内容
    :wq 保存并退出
    cd ../
    nginx -t 检查配置文件哪里有错误
    如果有错误 会提示在哪一行错误，进入配置文件进行修改即可
    vim /usr/local/nginx/conf/nginx.conf
    :set nu 显示行号
    :wq
    nginx -t 发现配置文件成功
    nginx -s reload重启nginx服务
  ```
  ### git部署 + 免密更新
  ```
    cd 
    pwd 回到root根目录
    检查是否已将安装了git: git
    yum install -y git
    git: 检查是否已将成功安装了git
    mkdir imooc-ebook 在本地创建一个imooc-ebook的目录
    git clone https://github.com/guowenwen520/imooc-book.git
    git version 查看git版本 发现版本太旧
    下载最新版本的git:
      先移除旧版本的git yum remove git
    安装依赖:
      yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel
      yum install  gcc perl-ExtUtils-MakeMaker
    在github上下载最新的git源码:
      wget https://github.com/git/git/archive/v2.26.2.tar.gz
    解压:
      tar -zxvf v2.26.2.tar.gz
      cd git-2.26.2/
    编译和安装:
      make prefix=/usr/local/git all
      make prefix=/usr/local/git install
      ll /usr/local/git/bin/
      cd /usr/bin/
    创建一个软连接:
      ln -s /usr/local/git/bin/git git
      git version 查看版本 到此git部署成功
    创建一个ssh公钥，实现免密更新:
      ssh-keygen -t rsa -C "2088756640@qq.com"
      cat ~/.ssh/id_rsa.pub
  ```
  ### 前端项目构建和打包
  ```
    进入到项目对应的目录:
      cd imooc-book/
      cnpm install
      cnpm run build
    将打包好的项目目录复制到nginx服务器下面的upload文件夹
      mv dist/ ~/nginx/upload/book
      cd ~/nginx/upload/ 查看是否移动成功
    进入后端api对应的目录:
      cd imooc-book/node-imooc-book
      cnpm install
      后端服务启动 但是只能在局域网内才能访问到 如果外网想访问，需要在阿里云服务器开放3000端口.
      node app.js & &可以让服务一直在后台启动
      ps -ef|grep node 查看node服务
  ```
  ### 安装mysql
  ```
    1.下载并安装MySQL官方的 Yum Repository:
      wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
    使用上面的命令就直接下载了安装用的Yum Repository，大概25KB的样子，然后就可以直接yum安装了:
      yum -y install mysql57-community-release-el7-10.noarch.rpm
    之后就开始安装MySQL服务器:
      yum -y install mysql-community-server
    2.MySQL数据库设置 
      首先启动MySQL:
        systemctl start  mysqld.service
      查看MySQL运行状态：
        systemctl status mysqld.service
      此时MySQL已经开始正常运行，不过要想进入MySQL还得先找出此时root用户的密码，通过如下命令可以在日志文件中找出密码：
      如下命令进入数据库:
        mysql -uroot -p
      输入初始密码，此时不能做任何事情，因为MySQL默认必须修改密码之后才能操作数据库：
        ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
      这里有个问题，新密码设置的时候如果设置的过于简单会报错：
        set global validate_password_policy=0;
        set global validate_password_length=1;
      再重新设置密码就可以成功了:
        ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
      显示已有的数据库:
        show Databases;
      退出数据库:
        quit;
      使用更新后的密码重新登:
        mysql -uroot -p 然后输入更新后的密码即可
      3.使用sqlyog连接阿里云服务器上面的MySQL
          mysql -uroot -p 然后输入更新后的密码
          use mysql;
          使用mysql_native_password进行远程认证，凡是远程连接这里的localhost一定要换成%
          create user 'root'@'%' identified with mysql_native_password by '123456';
        刷新权限:
          flush privileges;
        连接上后发现只有一个数据库，这是因为权限不够:
          grant all privileges on *.* to 'root'@'%';
        刷新权限:
          flush privileges;
        然后导入事先准备好的sql脚本,创建book数据库，查询，添加数据：
          在服务端:
          show databases;
          use book;
          show tables;
          select count(*) from book;
  ```
  ### 一键部署脚本开发
  ```
    到服务器的root目录:
      cd
      pwd
    创建一个update.sh文件:
      touch update.sh
    添加可执行属性:
      chmod +x update.sh
    查看启动中的node服务:
      ps -ef|grep node
    先停止已经在运行中的node服务:
      查看启动中的node服务的进程号:
        ps -ef|grep node|grep app.js|awk '{print $2}'
    vim update.sh 打开update.sh文件,将下列内容拷贝到update.sh文件中；
      echo "start updating frontend..."
      cd /root/imooc-ebook/imooc-book
      echo "updating source"
      git pull
      echo "building"
      cnpm run build
      echo "frontend publish"
      rm -rf ~/nginx/upload/book
      mv dist ~/nginx/upload/book
      echo "finish updating frontend..."
      echo "start updating backend..."
      cd /root/imooc-ebook/node-imooc-book
      echo "updating source"
      git pull
      echo "stopping service..."
      kill -9 `ps -ef|grep node|grep app.js|awk '{print $2}'`
      echo "restarting service..."
      node app.js &
      echo "finish updating backend..."
    退出并保存update.sh文件:
      Ctrl + C
      :wq
    检查是否启动成功:
      ps -ef|grep node
    运行一键部署脚本:
      ./update.sh

    








