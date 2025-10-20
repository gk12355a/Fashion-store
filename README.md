# README - Fashion Store Backend

Dự án backend cho ứng dụng cửa hàng thời trang, được xây dựng bằng Spring Boot.

## 📋 Yêu cầu cài đặt (Prerequisites)
Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt các công cụ sau trên máy của mình:

- Java Development Kit (JDK): Phiên bản 21 hoặc cao hơn.
- Apache Maven: Để quản lý các gói phụ thuộc và build dự án.
- MySQL Database: Một cơ sở dữ liệu MySQL đang hoạt động để ứng dụng có thể kết nối.

## Các Dependencies chính
Dự án sử dụng các thư viện quan trọng sau (được quản lý bởi Maven):

- Spring Boot Starter Web: Để xây dựng các ứng dụng web và RESTful API.
- Spring Boot Starter Data JPA: Để làm việc với cơ sở dữ liệu quan hệ.
- Spring Boot Starter Validation: Để xác thực dữ liệu đầu vào.
- MySQL Connector/J: Driver để kết nối với cơ sở dữ liệu MySQL.
- Lombok: Giảm thiểu code soạn sẵn (boilerplate code).
- Dotenv Java: Để quản lý các biến môi trường từ file .env.
- MyBatis Spring Boot Starter: Hỗ trợ tích hợp MyBatis.

## ⚙️ Cấu hình (Configuration)
Để ứng dụng có thể kết nối tới cơ sở dữ liệu, bạn cần tạo một file tên là `.env` ở thư mục gốc của dự án.
đường dẫn:
Fashion-store\server-side\fashion-store

- Tạo file `.env` ở cùng cấp với file `pom.xml`.
- Thêm nội dung sau vào file và thay đổi các giá trị cho phù hợp với môi trường của bạn:
```
DB_HOST=192.168.23.12
DB_PORT=3306
DB_NAME="fashion_store"
DB_USER="dtkien5"
DB_PASSWORD="password@gym"
```

## 🚀 Chạy ứng dụng (Running the Application)
Thực hiện các lệnh sau trong terminal hoặc command prompt từ thư mục gốc của dự án:
đường dẫn:
Fashion-store\server-side\fashion-store

- Dọn dẹp dự án (Clean project):

```shell
mvn clean
```

- Build dự án và bỏ qua các bài test (Build project and skip tests):

```shell
mvn install -DskipTests=true
```

- Chạy file JAR đã được build:

```shell
java -jar target/fashion-store-0.0.1-SNAPSHOT.jar
```

Sau khi chạy lệnh cuối cùng, ứng dụng backend sẽ khởi động và lắng nghe các yêu cầu tại http://localhost:8080.

mvn clean
mvn install -DskipTests=true
java -jar target/fashion-store-0.0.1-SNAPSHOT.jar
