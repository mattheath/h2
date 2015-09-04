server {
    listen 0.0.0.0:80;
    root /usr/share/nginx/html/homescreen;
    index index.html;
    server_name homescreen.hlabs.com;

    location / {
        try_files $uri $uri/ =404;
    }
}
