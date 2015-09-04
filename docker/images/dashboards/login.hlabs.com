server {
    listen 0.0.0.0:80;
    root /usr/share/nginx/html/login;
    index index.html;
    server_name login.hlabs.com;

    location / {
        try_files $uri $uri/ =404;
    }
}
