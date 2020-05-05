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




