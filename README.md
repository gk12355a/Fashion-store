```markdown
# Dự án Cửa hàng Thời trang (Fashion Store) - Triển khai Kubernetes

Dự án này triển khai một **ứng dụng cửa hàng thời trang đầy đủ** với **backend (Spring Boot)** và **frontend (Node.js + Nginx)**, được **đóng gói trong container (Docker)** và **triển khai trên cụm Kubernetes (K8s)**.

---

## 🏛️ Kiến trúc Tổng quan

Ứng dụng được chia thành **hai thành phần chính**, cả hai đều chạy trong **namespace `online-fashion`**:

### Backend (`online-fashion-backend`)
- **Image**: `gk123a/api-fashionstore:v1`
- **Công nghệ**: Spring Boot (từ `DockerfileBe` và `README.md` gốc)
- **Deployment**: `online-fashion-backend-deployment` (1 replica)
- **Service**: `online-fashion-backend-service` (ClusterIP, port `8080`)
- **Ingress**: `online-fashion-backend-ingress` (nginx Ingress Controller)
- **Endpoint**: [http://api-fashionstore.vn](http://api-fashionstore.vn)

### Frontend (`online-fashion-frontend`)
- **Image**: `gk123a/fashioncmcg:v1`
- **Công nghệ**: Node.js (build static files) + Nginx (serve files) (từ `Dockerfile`)
- **Deployment**: `online-fashion-frontend-deployment` (1 replica)
- **Service**: `online-fashion-frontend-service` (ClusterIP, port `5173` → target `80`)
- **Ingress**: `online-fashion-frontend-ingress` (nginx Ingress Controller)
- **Endpoint**: [http://fashionstore.vn](http://fashionstore.vn)

---

## 📋 Yêu cầu cài đặt (Prerequisites)

Trước khi triển khai, hãy đảm bảo bạn có:

- Một **cụm Kubernetes đang hoạt động**
- Công cụ dòng lệnh **`kubectl`** đã được cấu hình để kết nối với cụm
- Một **Ingress Controller** (ví dụ: **NGINX Ingress Controller**) đã được cài đặt  
  → Các file Ingress sử dụng `ingressClassName: nginx`
- Một **cơ sở dữ liệu MySQL** đang chạy và **có thể truy cập từ bên trong cụm K8s**

---

## ⚙️ Cấu hình (Configuration)

---

## 🚀 Triển khai lên Kubernetes

Thực hiện các lệnh sau để triển khai toàn bộ ứng dụng:

### 1. (Tùy chọn) Tạo Namespace

```bash
kubectl create namespace online-fashion
```

### 2. Triển khai Backend

```bash
kubectl apply -f be.yaml
```

### 3. Triển khai Frontend

```bash
kubectl apply -f fe.yaml
```

### 4. Kiểm tra trạng thái

```bash
kubectl get pods,svc,ingress -n online-fashion
```

**Kết quả mong đợi:**

```plaintext
NAME                                                  READY   STATUS    RESTARTS   AGE
pod/online-fashion-backend-deployment-xxxxx...        1/1     Running   0          ...
pod/online-fashion-frontend-deployment-xxxxx...       1/1     Running   0          ...

NAME                                      TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/online-fashion-backend-service    ClusterIP   10.100.xx.xx    <none>        8080/TCP   ...
service/online-fashion-frontend-service   ClusterIP   10.100.yy.yy    <none>        5173/TCP   ...

NAME                                               CLASS   HOSTS                  ADDRESS        PORTS   AGE
ingress.networking.k8s.io/online-fashion-backend-ingress    nginx   api-fashionstore.vn    [Ingress-IP]   80      ...
ingress.networking.k8s.io/online-fashion-frontend-ingress   nginx   fashionstore.vn        [Ingress-IP]   80      ...
```

---

## 🌐 Truy cập ứng dụng

Sau khi Ingress Controller gán địa chỉ IP (cột `ADDRESS`), bạn cần:

### Cấu hình DNS (hoặc file hosts)

Thêm vào file `/etc/hosts` (trên máy local) nếu `[Ingress-IP]` là `192.168.1.100`:

```hosts
192.168.1.100 fashionstore.vn
192.168.1.100 api-fashionstore.vn
```

### Truy cập

- **Frontend**: [https://fashionstore.vn](http://fashionstore.vn)
- **Backend API**: [https://api-fashionstore.vn](http://api-fashionstore.vn)

---

## 📝 Thông tin (Local Development)

> Phần này được giữ lại từ `README.md` gốc để tham khảo về cách **build và chạy ứng dụng cục bộ (không phải K8s)**.

### Yêu cầu (Local)

- **Java Development Kit (JDK)**: Phiên bản 21 hoặc cao hơn
- **Apache Maven**
- **MySQL Database**

### Chạy Backend (Local)

1. Tạo file `.env` ở thư mục gốc của backend (`Fashion-store/server-side/fashion-store`):

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME="fashion_store"
DB_USER="dtkien5"
DB_PASSWORD="password@gym"
```

2. Chạy các lệnh:

```bash
mvn clean
mvn install -DskipTests=true
java -jar target/fashion-store-0.0.1-SNAPSHOT.jar
```

---

## Tóm tắt file cấu hình

| File | Mô tả |
|------|-------|
| `be.yaml` | Deployment, Service, Ingress cho Backend |
| `fe.yaml` | Deployment, Service, Ingress cho Frontend |

---

**Dự án đã sẵn sàng để triển khai trên Kubernetes!**  
Chúc bạn thành công với cửa hàng thời trang trực tuyến của mình! 🎉
```
```