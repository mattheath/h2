FROM nginx

ADD hshell.hlabs.com /etc/nginx/conf.d/hshell.hlabs.com.conf
ADD login.hlabs.com /etc/nginx/conf.d/login.hlabs.com.conf
ADD homescreen.hlabs.com /etc/nginx/conf.d/homescreen.hlabs.com.conf
ADD dev-config.hlabs.com /etc/nginx/conf.d/dev-config.hlabs.com.conf
ADD users.hlabs.com /etc/nginx/conf.d/users.hlabs.com.conf

COPY hshell/site /usr/share/nginx/html/hshell
COPY login/site /usr/share/nginx/html/login
COPY homescreen/site /usr/share/nginx/html/homescreen
COPY dev-config/site /usr/share/nginx/html/dev-config
COPY users/site /usr/share/nginx/html/users
