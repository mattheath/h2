server {
    listen 0.0.0.0:80;
    root /usr/share/nginx/html/hshell;
    index index.html;
    server_name hshell.hlabs.com;

    location / {
        try_files $uri $uri/ =404;
    }
}
