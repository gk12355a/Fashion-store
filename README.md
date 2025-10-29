Tuyệt vời! Bạn đã có **một server Nginx làm Load Balancer (LB)** tại `192.168.23.110` và đã **tự ký SSL (self-signed certificates)** cho 2 domain:

- `fashionstore.vn`
- `api-fashionstore.vn`

Dưới đây là **phiên bản cập nhật `README.md`** tích hợp **Nginx Load Balancer + SSL tự ký**, thay vì dùng trực tiếp Ingress Controller (phù hợp với môi trường **on-premise / private cluster**).

---

```markdown
# Dự án Cửa hàng Thời trang (Fashion Store) - Triển khai Kubernetes + Nginx LB + SSL Tự Ký

Dự án triển khai **ứng dụng cửa hàng thời trang** với **backend (Spring Boot)** và **frontend (Node.js + Nginx)**, chạy trên **Kubernetes**, truy cập qua **Nginx Load Balancer (192.168.23.110)** với **SSL tự ký**.

---

## 🏛️ Kiến trúc Tổng quan

```
[Client] 
   └── HTTPS → fashionstore.vn (443) 
   └── HTTPS → api-fashionstore.vn (443)
               ↓
         [Nginx LB: 192.168.23.110]
               ↓ (HTTP)
   [Kubernetes Cluster - Ingress Controller (nginx)]
               ↓
   ┌───────────────────────────────┐
   │ Namespace: online-fashion       │
   │                                 │
   │  ┌─────────────────┐          │
   │  │ Backend Service  │ 8080      │
   │  └─────────────────┘          │
   │                                 │
   │  ┌─────────────────┐          │
   │  │ Frontend Service │ 5173 → 80 │
   │  └─────────────────┘          │
   └───────────────────────────────┘
```

---

## 🌐 Thông tin truy cập

| Thành phần       | URL                                      | Giao thức |
|------------------|------------------------------------------|-----------|
| **Frontend**     | `https://fashionstore.vn`                | HTTPS     |
| **Backend API**  | `https://api-fashionstore.vn`            | HTTPS     |
| **Nginx LB IP**  | `192.168.23.110`                         | -         |

> **SSL tự ký**: Trình duyệt sẽ cảnh báo "Not Secure". Dùng `curl -k` hoặc thêm cert vào trusted store.

---

## 📋 Yêu cầu cài đặt (Prerequisites)

- Cụm Kubernetes đang hoạt động
- `kubectl` đã cấu hình
- **NGINX Ingress Controller** đã cài trong cluster
- **MySQL** có thể truy cập từ K8s
- **Nginx Load Balancer** tại `192.168.23.110` đã cấu hình SSL + proxy tới Ingress

---

## ⚙️ Cấu hình Nginx Load Balancer (192.168.23.110)

Tạo file cấu hình `/etc/nginx/sites-available/fashionstore.conf`:

```nginx
# fashionstore.vn - Frontend
server {
    listen 443 ssl;
    server_name fashionstore.vn;

    ssl_certificate     /etc/ssl/certs/fashionstore.vn.crt;
    ssl_certificate_key /etc/ssl/private/fashionstore.vn.key;

    location / {
        proxy_pass http://<INGRESS_IP>;  # IP của NGINX Ingress Controller
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# api-fashionstore.vn - Backend API
server {
    listen 443 ssl;
    server_name api-fashionstore.vn;

    ssl_certificate     /etc/ssl/certs/api-fashionstore.vn.crt;
    ssl_certificate_key /etc/ssl/private/api-fashionstore.vn.key;

    location / {
        proxy_pass http://<INGRESS_IP>;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP → HTTPS (tùy chọn)
server {
    listen 80;
    server_name fashionstore.vn api-fashionstore.vn;
    return 301 https://$host$request_uri;
}
```

### Thay thế `<INGRESS_IP>`

```bash
kubectl get ingress -n ingress-nginx  # hoặc namespace của bạn
# Lấy EXTERNAL-IP của ingress-nginx-controller
```

### Kích hoạt site

```bash
ln -s /etc/nginx/sites-available/fashionstore.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 🚀 Triển khai lên Kubernetes

### 1. Tạo Namespace (nếu chưa có)

```bash
kubectl create namespace online-fashion
```

### 2. Áp dụng cấu hình

```bash
kubectl apply -f be.yaml
kubectl apply -f fe.yaml
```



---

## Kiểm tra trạng thái

```bash
kubectl get pods,svc -n online-fashion
```

---

## Truy cập ứng dụng

### Dùng trình duyệt (chấp nhận cảnh báo SSL)

- Frontend: `https://fashionstore.vn`
- API: `https://api-fashionstore.vn`

### Dùng `curl` (bỏ qua SSL)

```bash
curl -k https://fashionstore.vn
curl -k https://api-fashionstore.vn/health
```

---

## Cấu hình DNS / Hosts

Thêm vào `/etc/hosts` (máy local):

```hosts
192.168.23.110 fashionstore.vn
192.168.23.110 api-fashionstore.vn
```

---



## Tóm tắt

| Thành phần | Địa chỉ | Ghi chú |
|----------|--------|-------|
| Nginx LB | `192.168.23.110` | SSL + Proxy |
| Backend Service | `ClusterIP` | Port 8080 |
| Frontend Service | `ClusterIP` | Port 5173 → 80 |
| Truy cập | `https://fashionstore.vn` | Qua LB |

---

**Ứng dụng đã sẵn sàng với HTTPS + Load Balancing!**  
Chúc bạn triển khai thành công!
```

---

**Gợi ý thêm**: Nếu bạn muốn, tôi có thể sinh luôn **script tự động cấu hình Nginx LB** hoặc **file SSL mẫu**. Bạn cần không?
```