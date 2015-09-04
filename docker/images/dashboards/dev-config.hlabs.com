server {
    listen 0.0.0.0:80;
    root /usr/share/nginx/html/dev-config;
    index index.html;
    server_name dev-config.hlabs.com;

    location / {
        try_files $uri $uri/ =404;
    }
}
