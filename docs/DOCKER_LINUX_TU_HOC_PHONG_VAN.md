# GIÁO TRÌNH LINUX & DOCKER – TỪ NỀN TẢNG ĐẾN PHỎNG VẤN VÀ TRIỂN KHAI

> Tài liệu này dành cho người học Front-end muốn hiểu môi trường Linux, Docker và quy trình triển khai thực tế.
> Ví dụ được liên hệ với dự án React + TypeScript + Vite `nex-chat-fe`.

---

## Mục lục

### Phần I – Nền tảng và Linux

1. [Cách học và bản đồ kiến thức](#1-cách-học-và-bản-đồ-kiến-thức)
2. [Linux là gì?](#2-linux-là-gì)
3. [Terminal, Shell và Command](#3-terminal-shell-và-command)
4. [Cấu trúc filesystem Linux](#4-cấu-trúc-filesystem-linux)
5. [Điều hướng và thao tác file](#5-điều-hướng-và-thao-tác-file)
6. [Đọc, tìm kiếm và xử lý văn bản](#6-đọc-tìm-kiếm-và-xử-lý-văn-bản)
7. [Redirect, Pipe và Exit Code](#7-redirect-pipe-và-exit-code)
8. [User, Group và Permission](#8-user-group-và-permission)
9. [Process, Signal và Job](#9-process-signal-và-job)
10. [Service, systemd và Log](#10-service-systemd-và-log)
11. [Environment variable và Shell profile](#11-environment-variable-và-shell-profile)
12. [Package management](#12-package-management)
13. [Network trên Linux](#13-network-trên-linux)
14. [Disk, filesystem và archive](#14-disk-filesystem-và-archive)
15. [SSH và quản trị server](#15-ssh-và-quản-trị-server)
16. [Bash scripting](#16-bash-scripting)
17. [Bảo mật Linux căn bản](#17-bảo-mật-linux-căn-bản)
18. [Quy trình chẩn đoán lỗi Linux](#18-quy-trình-chẩn-đoán-lỗi-linux)

### Phần II – Docker

19. [Docker giải quyết vấn đề gì?](#19-docker-giải-quyết-vấn-đề-gì)
20. [Container khác Virtual Machine thế nào?](#20-container-khác-virtual-machine-thế-nào)
21. [Kiến trúc Docker](#21-kiến-trúc-docker)
22. [Image, Layer, Container và Registry](#22-image-layer-container-và-registry)
23. [Vòng đời container và câu lệnh nền tảng](#23-vòng-đời-container-và-câu-lệnh-nền-tảng)
24. [Dockerfile chuyên sâu](#24-dockerfile-chuyên-sâu)
25. [Build context, cache và `.dockerignore`](#25-build-context-cache-và-dockerignore)
26. [Volume và dữ liệu bền vững](#26-volume-và-dữ-liệu-bền-vững)
27. [Docker Network](#27-docker-network)
28. [Docker Compose](#28-docker-compose)
29. [Log, healthcheck và restart policy](#29-log-healthcheck-và-restart-policy)
30. [Resource limit và hiệu năng](#30-resource-limit-và-hiệu-năng)
31. [Bảo mật Docker](#31-bảo-mật-docker)
32. [Docker hóa React + Vite](#32-docker-hóa-react--vite)
33. [Nginx cho SPA](#33-nginx-cho-spa)
34. [Biến môi trường build-time và runtime](#34-biến-môi-trường-build-time-và-runtime)
35. [CI/CD với Docker](#35-cicd-với-docker)
36. [Production, registry và versioning](#36-production-registry-và-versioning)
37. [Debug Docker theo quy trình](#37-debug-docker-theo-quy-trình)
38. [Phân tích dự án hiện tại](#38-phân-tích-dự-án-hiện-tại)
39. [Câu hỏi phỏng vấn và trả lời mẫu](#39-câu-hỏi-phỏng-vấn-và-trả-lời-mẫu)
40. [Bài thực hành](#40-bài-thực-hành)
41. [Lộ trình học 8 tuần](#41-lộ-trình-học-8-tuần)
42. [Cheat sheet và flashcard](#42-cheat-sheet-và-flashcard)

---

# PHẦN I – LINUX

## 1. Cách học và bản đồ kiến thức

### 1.1. Công thức học một khái niệm

Với mỗi chủ đề, hãy tự trả lời:

1. Nó là gì?
2. Nó giải quyết vấn đề nào?
3. Nó hoạt động ở tầng nào?
4. Dùng câu lệnh nào để quan sát?
5. Lỗi thường gặp là gì?
6. Cách kiểm tra giả thuyết ra sao?
7. Rủi ro bảo mật hoặc dữ liệu là gì?

DevOps không phải học thuộc thật nhiều lệnh. Điều quan trọng là tạo được mô hình tinh thần và biết quan sát hệ thống.

### 1.2. Chuỗi triển khai cần hình dung

```text
Source code
   ↓ git checkout
Install dependencies
   ↓ npm ci
Build application
   ↓ npm run build
Static assets trong dist/
   ↓ copy vào image
Container chạy web server
   ↓ expose/listen port
Docker network / reverse proxy
   ↓
Browser người dùng
```

### 1.3. Bốn lớp cần phân biệt

| Lớp | Ví dụ | Câu hỏi chính |
|---|---|---|
| Ứng dụng | React, Vite, Nginx | App chạy và phục vụ gì? |
| Process | node, nginx | Process nào đang chạy? PID nào? |
| Container | Docker container | Process bị cô lập và cấu hình ra sao? |
| Host | Linux server/VM | CPU, RAM, disk, network có ổn không? |

Khi lỗi xảy ra, phải xác định lỗi nằm ở lớp nào trước khi sửa.

### 1.4. Công thức trả lời phỏng vấn

> **Định nghĩa → cơ chế → ví dụ → trade-off → cách kiểm tra.**

Ví dụ:

> Docker image là template bất biến gồm các layer để tạo container. Container là instance đang chạy của image và có writable layer riêng. Trong dự án React, em dùng multi-stage build: Node build ra `dist`, sau đó image Nginx chỉ chứa static files. Cách này giảm kích thước và không mang toolchain Node vào runtime. Em kiểm tra image bằng `docker image ls`, lịch sử layer bằng `docker history` và chạy thử bằng `docker run`.

---

## 2. Linux là gì?

### 2.1. Linux và GNU/Linux

Linux chính xác là kernel. Một hệ điều hành người dùng thường gọi là “Linux” gồm:

- Linux kernel;
- GNU tools và các user-space tools khác;
- package manager;
- init system;
- desktop/server packages tùy distribution.

Các distribution phổ biến: Ubuntu, Debian, Fedora, Rocky Linux, Alpine Linux. Chúng có cùng nền tảng Linux nhưng khác package manager, phiên bản package, cấu hình mặc định và triết lý vận hành.

### 2.2. Kernel và user space

**Kernel** quản lý:

- process scheduling;
- memory;
- filesystem;
- device;
- network;
- permission/isolation primitives.

**User space** gồm shell, web server, Node.js, Docker daemon và ứng dụng. Chương trình user space yêu cầu dịch vụ kernel thông qua system call.

### 2.3. Vì sao developer cần Linux?

- Phần lớn web server chạy Linux.
- Container Linux chia sẻ kernel Linux của host/VM.
- CI runner thường là Linux.
- Quyền file, process, port, log và network ảnh hưởng trực tiếp deployment.
- Hiểu Linux giúp debug “chạy máy em nhưng không chạy server”.

### 2.4. Distribution và package manager

| Distro family | Package format | Package manager thường gặp |
|---|---|---|
| Debian/Ubuntu | `.deb` | `apt`, `dpkg` |
| Fedora/RHEL/Rocky | `.rpm` | `dnf`, `rpm` |
| Alpine | `.apk` | `apk` |

Không copy lệnh cài đặt giữa distro mà không kiểm tra base image/hệ điều hành.

---

## 3. Terminal, Shell và Command

### 3.1. Phân biệt

- **Terminal:** giao diện nhập/xem text.
- **Shell:** chương trình đọc và thực thi câu lệnh, ví dụ Bash, Zsh, Fish.
- **Command:** chương trình/builtin được shell thực thi.

Trên Windows, PowerShell có cú pháp khác Bash. Jenkinsfile hiện tại dùng bước `sh`, nên đoạn script remote chủ yếu theo shell Linux.

### 3.2. Prompt

Prompt thường có dạng:

```text
user@host:/current/path$
```

- `$` thường là user thông thường.
- `#` thường biểu thị root.

Đừng chạy lệnh dưới root nếu không cần. Một lỗi gõ lệnh với quyền root có phạm vi thiệt hại lớn hơn.

### 3.3. Command, option và argument

```bash
ls -la /var/log
```

- `ls`: command.
- `-l`, `-a`: option.
- `/var/log`: argument.

Xem trợ giúp:

```bash
command --help
man command
```

### 3.4. Command resolution

Shell tìm command theo alias, function, builtin và các thư mục trong `$PATH` tùy shell/cấu hình.

```bash
type cd
type node
which node
command -v node
```

`command -v` thường phù hợp trong script để kiểm tra command tồn tại.

### 3.5. Quoting

```bash
name="Toan Nguyen"
echo "$name"   # biến được mở rộng
echo '$name'   # in nguyên văn $name
```

- Single quote giữ nội dung gần như nguyên văn.
- Double quote cho phép mở rộng biến và command substitution.
- Không quote biến chứa path/khoảng trắng dễ gây word splitting và globbing.

Trong script, ưu tiên `"$variable"` trừ khi thật sự muốn splitting.

---

## 4. Cấu trúc filesystem Linux

### 4.1. Root filesystem

Linux có cây thư mục bắt đầu từ `/`, không dùng ký tự ổ đĩa như `C:` theo mô hình Windows.

| Path | Ý nghĩa thường gặp |
|---|---|
| `/` | root của cây filesystem |
| `/home` | home của user thông thường |
| `/root` | home của user root |
| `/etc` | cấu hình hệ thống |
| `/var` | dữ liệu biến đổi: log, cache, web data |
| `/var/log` | log hệ thống/dịch vụ |
| `/usr` | chương trình và dữ liệu user-space |
| `/bin`, `/sbin` | command thiết yếu; trên nhiều distro là symlink vào `/usr` |
| `/tmp` | file tạm |
| `/opt` | phần mềm bổ sung |
| `/mnt`, `/media` | mount point |
| `/proc` | filesystem ảo về process/kernel |
| `/sys` | filesystem ảo về kernel/device |
| `/dev` | device file |

Ý nghĩa chi tiết có thể khác theo distro và Filesystem Hierarchy Standard.

### 4.2. Absolute và relative path

- Absolute path bắt đầu bằng `/`: `/var/www/app`.
- Relative path tính từ current directory: `src/main.tsx`.
- `.` là current directory.
- `..` là parent directory.
- `~` thường được shell mở rộng thành home directory.

Trong script deploy, absolute path rõ ràng thường an toàn hơn path phụ thuộc current directory.

### 4.3. Hidden file

Tên bắt đầu bằng dấu chấm thường bị ẩn khỏi `ls` mặc định:

```text
.env
.gitignore
.ssh
```

“Ẩn” không phải “bảo mật”. Permission mới quyết định ai được đọc file.

### 4.4. File descriptor cơ bản

Mỗi process thường có:

- `0`: stdin;
- `1`: stdout;
- `2`: stderr.

Hiểu file descriptor giúp hiểu redirect và log container.

---

## 5. Điều hướng và thao tác file

### 5.1. Điều hướng

```bash
pwd
ls
ls -lah
cd /var/www
cd ..
cd -
```

- `pwd`: current directory.
- `ls -l`: chi tiết.
- `ls -a`: gồm hidden file.
- `ls -h`: kích thước dễ đọc khi kết hợp option phù hợp.
- `cd -`: quay lại directory trước.

### 5.2. Tạo file và thư mục

```bash
mkdir logs
mkdir -p app/config/nginx
touch app.log
```

`mkdir -p` tạo cả parent cần thiết và không lỗi nếu directory đã tồn tại.

### 5.3. Copy và move

```bash
cp source.txt destination.txt
cp -r source-dir destination-dir
mv old-name new-name
```

`mv` vừa đổi tên vừa di chuyển. Hãy kiểm tra destination trước vì ghi đè có thể làm mất dữ liệu.

### 5.4. Xóa dữ liệu

```bash
rm file.txt
rmdir empty-directory
rm -r target-directory
```

`rm` thường không có thùng rác. `rm -rf` rất nguy hiểm vì recursive + force. Trước khi xóa:

1. `pwd`;
2. resolve chính xác path;
3. `ls -la -- target`;
4. tránh biến rỗng/glob rộng;
5. dùng `--` trước path bắt đầu bằng `-`;
6. có backup nếu dữ liệu quan trọng.

### 5.5. Link

**Hard link** là tên khác trỏ đến cùng inode. **Symbolic link** chứa đường dẫn đến target.

```bash
ln source hard-link
ln -s /real/path symbolic-link
```

Symlink có thể trỏ qua filesystem nhưng có thể bị broken nếu target mất. Hard link thường không dùng cho directory và không vượt filesystem boundary.

### 5.6. Metadata

```bash
stat file.txt
file artifact
```

- `stat`: permission, size, timestamp, inode.
- `file`: suy đoán loại file dựa trên nội dung/metadata, không chỉ extension.

---

## 6. Đọc, tìm kiếm và xử lý văn bản

### 6.1. Đọc file

```bash
cat file.txt
less large.log
head -n 20 app.log
tail -n 100 app.log
tail -f app.log
```

- `cat` phù hợp file nhỏ hoặc nối output.
- `less` phù hợp file lớn.
- `tail -f` theo dõi log đang tăng.

Đừng `cat` file cực lớn nếu chỉ cần vài dòng cuối.

### 6.2. Tìm text

```bash
grep -n "ERROR" app.log
grep -R "API_URL" src/
rg "API_URL" src/
```

`rg` – ripgrep – thường nhanh và có default phù hợp code repository. Trên server tối giản có thể chưa được cài, khi đó dùng `grep`.

### 6.3. Tìm file

```bash
find /var/log -type f -name "*.log"
find . -type f -mtime -1
```

`find` rất mạnh. Cẩn thận khi kết hợp với `-delete` hoặc `xargs rm`; hãy in và kiểm tra target trước.

### 6.4. Sort, unique và count

```bash
sort names.txt
sort names.txt | uniq
sort names.txt | uniq -c
wc -l app.log
```

`uniq` chỉ gộp các dòng trùng liền nhau, nên thường dùng sau `sort`.

### 6.5. `cut`, `awk`, `sed`

```bash
cut -d: -f1 /etc/passwd
awk '{print $1}' access.log
sed 's/http:/https:/g' input.txt
```

- `cut`: lấy field đơn giản theo delimiter.
- `awk`: xử lý record/field và tính toán text.
- `sed`: stream editor, thay thế/chỉnh text.

Trước khi dùng in-place edit, chạy thử không ghi để xem output.

### 6.6. JSON với `jq`

```bash
curl -s http://localhost/api/health | jq .
curl -s http://localhost/api/users | jq '.[].name'
```

Không parse JSON bằng grep/sed nếu cần độ chính xác; dùng parser như `jq`.

---

## 7. Redirect, Pipe và Exit Code

### 7.1. Redirect

```bash
command > output.log       # ghi đè stdout
command >> output.log      # nối stdout
command 2> error.log       # redirect stderr
command > all.log 2>&1     # stdout + stderr cùng file
command < input.txt        # stdin từ file
```

Thứ tự redirect có ý nghĩa vì file descriptor được xử lý từ trái sang phải.

### 7.2. Pipe

Pipe đưa stdout của command trước vào stdin của command sau:

```bash
ps aux | grep nginx
```

Một pipeline tốt biến dữ liệu qua nhiều bước nhỏ. Nhưng pipeline quá dài khó debug; hãy kiểm tra từng đoạn.

### 7.3. Exit code

Theo convention:

- `0`: thành công.
- khác `0`: thất bại hoặc trạng thái đặc biệt.

```bash
command
echo "$?"
```

Shell/CI dùng exit code để quyết định bước thành công hay thất bại.

### 7.4. `&&`, `||` và `;`

```bash
build && deploy
check || handle_error
first; second
```

- `&&`: chỉ chạy vế sau nếu vế trước thành công.
- `||`: chạy vế sau nếu vế trước thất bại.
- `;`: chạy tuần tự không phụ thuộc exit code trước.

### 7.5. `set -euo pipefail`

Trong Bash script:

```bash
set -euo pipefail
```

- `-e`: cố gắng dừng khi command thất bại; có ngoại lệ theo ngữ cảnh shell.
- `-u`: lỗi khi dùng biến chưa khai báo.
- `pipefail`: pipeline thất bại nếu một command bên trong thất bại.

Đây là baseline tốt, nhưng không thay thế xử lý lỗi có chủ đích.

---

## 8. User, Group và Permission

### 8.1. User và group

Linux dùng UID/GID để nhận dạng user/group. Tên chỉ là ánh xạ thân thiện.

```bash
whoami
id
groups
```

### 8.2. Permission `rwx`

```text
-rwxr-x--- 1 owner group ... deploy.sh
```

- Ký tự đầu: loại file (`-`, `d`, `l`...).
- Bộ 1: quyền owner.
- Bộ 2: quyền group.
- Bộ 3: quyền others.

Ý nghĩa:

- `r`: read.
- `w`: write.
- `x`: execute; với directory là quyền traverse/access entry.

### 8.3. Octal permission

Giá trị:

- read = 4;
- write = 2;
- execute = 1.

```bash
chmod 755 deploy.sh
chmod 640 .env
```

- `755`: owner `rwx`, group `r-x`, others `r-x`.
- `640`: owner `rw-`, group `r--`, others `---`.

Không dùng `chmod 777` như cách sửa permission mặc định. Nó mở quyền quá rộng và che nguyên nhân thật.

### 8.4. Symbolic mode

```bash
chmod u+x deploy.sh
chmod g-w config.json
chmod o-r secret.txt
```

Symbolic mode thường dễ hiểu ý định hơn octal.

### 8.5. Ownership

```bash
chown appuser:appgroup file
chown -R appuser:appgroup directory
```

Recursive `chown` trên directory lớn hoặc sai target có thể gây sự cố. Luôn kiểm tra path.

### 8.6. `sudo`

`sudo` chạy command với quyền khác, thường là root, theo policy. Chỉ nâng quyền cho command cần thiết; không làm việc cả phiên bằng root nếu tránh được.

### 8.7. `umask`

`umask` loại bỏ quyền mặc định khi tạo file/directory. Nó không đơn giản là permission cuối cùng mà là mask áp lên mode khởi tạo.

```bash
umask
umask 027
```

### 8.8. Permission trong container

Process trong container vẫn có UID/GID. Khi bind mount host directory, ID và permission giữa host/container phải tương thích. “Chạy được khi root” thường không phải kết thúc tốt; hãy chỉnh owner, group hoặc runtime user đúng.

---

## 9. Process, Signal và Job

### 9.1. Process

Process là instance chương trình đang chạy, có PID, memory, file descriptor và environment.

```bash
ps aux
ps -ef
pgrep -a nginx
top
```

`top`/`htop` giúp quan sát CPU, memory và load theo thời gian.

### 9.2. Foreground và background

```bash
long_command &
jobs
fg %1
bg %1
```

- `Ctrl+C`: thường gửi SIGINT.
- `Ctrl+Z`: thường gửi SIGTSTP để tạm dừng.

Background bằng `&` không đồng nghĩa process sống bền sau logout. Service lâu dài nên do systemd/container supervisor quản lý.

### 9.3. Signal

```bash
kill -TERM PID
kill -KILL PID
```

- SIGTERM yêu cầu process kết thúc có trật tự và có thể cleanup.
- SIGKILL buộc kernel dừng process, không cho cleanup/handler.

Ưu tiên TERM trước, chỉ KILL khi process không phản hồi và hiểu hậu quả.

### 9.4. PID 1

PID 1 có vai trò đặc biệt trong Linux và container: xử lý signal và reap orphan/zombie process. Ứng dụng container phải nhận/forward signal đúng để shutdown graceful.

### 9.5. Port và process

```bash
ss -lntp
lsof -i :3000
```

Khi gặp “port already in use”, xác định process đang listen thay vì kill ngẫu nhiên.

### 9.6. Memory và OOM

Nếu hệ thống thiếu memory, kernel có thể kích hoạt OOM killer. Dấu hiệu cần xem log kernel/system, container exit code và memory limit. Không chỉ restart rồi bỏ qua; cần tìm leak, limit hoặc tải bất thường.

---

## 10. Service, systemd và Log

### 10.1. systemd

Nhiều distro dùng systemd làm init/service manager.

```bash
systemctl status nginx
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

- `start`: chạy ngay.
- `enable`: cấu hình khởi động cùng boot.

Hai khái niệm này khác nhau.

### 10.2. Unit file

Service unit thường mô tả:

- command chạy;
- user/group;
- dependency/order;
- restart policy;
- environment;
- working directory.

Sau khi sửa unit file:

```bash
sudo systemctl daemon-reload
```

### 10.3. Journal

```bash
journalctl -u nginx
journalctl -u nginx -f
journalctl -u nginx --since "1 hour ago"
```

`journalctl` xem log do journald quản lý. Quyền đọc log tùy hệ thống.

### 10.4. Log tốt cần gì?

- timestamp;
- severity;
- request/correlation ID;
- message có ngữ cảnh;
- không chứa password/token/secret;
- format nhất quán, tốt hơn nếu structured JSON cho hệ thống thu thập.

### 10.5. Log rotation

Log tăng mãi có thể làm đầy disk. Linux service có thể dùng `logrotate`; Docker logging driver cũng cần rotation/config phù hợp.

---

## 11. Environment variable và Shell profile

### 11.1. Biến shell và biến môi trường

```bash
NAME="Nex"
export API_URL="https://example.com"
```

Biến shell chỉ thuộc shell hiện tại. `export` đưa biến vào environment của process con.

```bash
printenv API_URL
env | sort
```

### 11.2. Phạm vi

Process con kế thừa environment tại thời điểm được tạo. Process con không thể sửa environment của process cha.

```bash
API_URL=https://example.com npm run build
```

Cách trên đặt biến cho riêng command đó.

### 11.3. Profile files

Tùy login/non-login và interactive shell, Bash có thể đọc các file như:

- `/etc/profile`;
- `~/.profile`;
- `~/.bash_profile`;
- `~/.bashrc`.

Không giả định CI, SSH non-interactive và terminal interactive đều load cùng profile. Jenkinsfile hiện phải source `nvm.sh` vì môi trường non-interactive có thể không tự có Node trong PATH.

### 11.4. Secret

Environment variable không tự động là secret vault. Nó có thể xuất hiện trong cấu hình, process inspection, crash dump hoặc log. CI nên dùng secret/credential store và tránh echo.

### 11.5. Vite env

Biến frontend được bundle vào JavaScript có thể bị người dùng xem. Prefix `VITE_` không làm biến bí mật; nó chỉ xác định biến được expose cho code client theo cơ chế Vite.

---

## 12. Package management

### 12.1. Ubuntu/Debian

```bash
sudo apt update
sudo apt install nginx
sudo apt remove nginx
apt list --installed
```

- `apt update`: cập nhật package index.
- `apt upgrade`: nâng package đã cài theo policy.
- `apt install`: cài package.

### 12.2. Trong Dockerfile

Với Debian-based image, thường gộp update/install và xóa cache trong cùng layer:

```dockerfile
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
```

Không nên cài công cụ debug không cần thiết vào production image.

### 12.3. Package OS và package ứng dụng

Phân biệt:

- `apt`: package hệ điều hành.
- `npm`: package JavaScript của dự án.
- NVM: quản lý nhiều phiên bản Node cho user, không phải package manager hệ điều hành.

### 12.4. Reproducible install

Trong CI cho Node project có lockfile, thường ưu tiên:

```bash
npm ci
```

`npm ci` cài theo lockfile, xóa `node_modules` hiện tại và phù hợp build có tính lặp lại. `npm install -f` ép giải quyết một số xung đột nhưng có thể che vấn đề dependency và làm build kém dự đoán hơn.

---

## 13. Network trên Linux

### 13.1. Khái niệm nền tảng

- IP xác định interface/host trong network.
- Port xác định endpoint của process/service.
- DNS ánh xạ domain thành IP/thông tin khác.
- TCP cung cấp byte stream có kết nối, thứ tự và retransmission.
- UDP là datagram không có bảo đảm tương tự TCP.

### 13.2. Quan sát interface và route

```bash
ip addr
ip route
```

`localhost` thường trỏ đến loopback (`127.0.0.1`/`::1`) của chính network namespace đang đứng. Trong container, `localhost` là container đó, không phải host hay container khác.

### 13.3. Kiểm tra DNS

```bash
getent hosts example.com
dig example.com
nslookup example.com
```

`getent` hữu ích vì đi qua name service configuration của hệ thống.

### 13.4. Kiểm tra HTTP

```bash
curl -I https://example.com
curl -v http://localhost:8080/health
curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:8080
```

`curl -v` cho thấy DNS/connect/TLS/header, nhưng cẩn thận vì output có thể chứa credential.

### 13.5. Listening socket

```bash
ss -lntp
```

Phân biệt app listen `127.0.0.1` và `0.0.0.0`:

- `127.0.0.1`: chỉ loopback trong namespace đó.
- `0.0.0.0`: mọi IPv4 interface của namespace.

Container app thường cần listen `0.0.0.0` để nhận traffic qua container network/port publishing.

### 13.6. Firewall

Ubuntu có thể dùng UFW; hệ thống nền dùng netfilter/nftables/iptables tùy distro.

```bash
sudo ufw status
```

Không mở port rộng trước khi hiểu service nào listen và ai cần truy cập. Cloud còn có security group/firewall bên ngoài OS.

### 13.7. TLS cơ bản

HTTPS là HTTP qua TLS, cung cấp mã hóa truyền tải, integrity và xác thực server dựa trên certificate chain. TLS thường kết thúc ở reverse proxy/load balancer như Nginx, Traefik hoặc dịch vụ cloud.

---

## 14. Disk, filesystem và archive

### 14.1. Disk usage

```bash
df -h
du -sh /var/log
du -h --max-depth=1 /var | sort -h
```

- `df`: dung lượng filesystem.
- `du`: dung lượng file/directory.

“No space left on device” có thể do hết block hoặc hết inode:

```bash
df -i
```

### 14.2. Mount

Mount gắn filesystem vào một directory trong cây Linux. Container bind mount/volume cũng dựa trên khái niệm mount do kernel cung cấp.

```bash
mount
findmnt
```

### 14.3. Archive và compression

```bash
tar -czf backup.tar.gz directory/
tar -xzf backup.tar.gz
gzip file.log
gunzip file.log.gz
```

Archive gom nhiều file; compression giảm kích thước. `tar` có thể kết hợp cả hai.

### 14.4. Inode

Inode lưu metadata và trỏ tới data blocks; filename nằm trong directory entry. Hard link là nhiều directory entry cùng trỏ một inode.

---

## 15. SSH và quản trị server

### 15.1. SSH

SSH cung cấp kênh mã hóa để đăng nhập/chạy command từ xa.

```bash
ssh user@server
ssh -p 2222 user@server
```

### 15.2. Key pair

- Private key phải được giữ bí mật.
- Public key có thể đặt vào `~/.ssh/authorized_keys` trên server.
- Nên dùng passphrase và agent phù hợp.

Permission thường cần chặt:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 15.3. Host key verification

SSH host key giúp xác minh server, giảm nguy cơ man-in-the-middle. Tắt `StrictHostKeyChecking` làm mất lớp xác minh quan trọng. Trong CI nên quản lý `known_hosts` có kiểm soát thay vì tắt kiểm tra toàn bộ.

### 15.4. SCP và rsync

```bash
scp artifact.tar.gz user@server:/tmp/
rsync -avz --delete dist/ user@server:/var/www/app/
```

`--delete` có tính phá hủy ở destination; phải kiểm tra path và dry-run trước:

```bash
rsync -avzn --delete source/ destination/
```

### 15.5. SSH trong Jenkins hiện tại

Pipeline hiện SSH trực tiếp vào server và thực thi nhiều bước. Đây là mô hình đơn giản nhưng có trade-off:

- server phải có Git, Node, npm, PM2 và key/credential;
- build phụ thuộc trạng thái máy server;
- rollback khó hơn image immutable;
- tắt host key checking tăng rủi ro;
- `git reset --hard` là thao tác phá hủy với working tree trên server.

Docker image build trong CI rồi deploy artifact bất biến giúp giảm một số vấn đề này.

---

## 16. Bash scripting

### 16.1. Shebang

```bash
#!/usr/bin/env bash
```

Shebang chỉ định interpreter khi chạy file như executable. `bash script.sh` có thể chạy mà không cần executable bit, còn `./script.sh` cần quyền execute và shebang đúng.

### 16.2. Baseline script

```bash
#!/usr/bin/env bash
set -euo pipefail

readonly APP_DIR="/var/www/nex-chat-fe"

main() {
  cd "$APP_DIR"
  npm ci
  npm run build
}

main "$@"
```

### 16.3. Biến và parameter

```bash
name="${1:-default-name}"
required="${API_URL:?API_URL is required}"
```

- `$1`: argument thứ nhất.
- `$@`: toàn bộ arguments, giữ boundary khi quote `"$@"`.
- `${var:-default}`: dùng default nếu unset hoặc empty.
- `${var:?message}`: fail nếu unset hoặc empty.

### 16.4. Điều kiện

```bash
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi
```

Một số test:

- `-f`: regular file.
- `-d`: directory.
- `-n`: string không rỗng.
- `-z`: string rỗng.
- `-x`: executable.

### 16.5. Loop

```bash
for file in *.log; do
  printf '%s\n' "$file"
done
```

Cẩn thận với whitespace và trường hợp glob không match. Với dữ liệu phức tạp, tránh parse `ls`.

### 16.6. Function và return

Shell function `return` trả exit status, không trả string như function JavaScript. Dữ liệu có thể được in ra stdout và nhận bằng command substitution, nhưng phải tách log khỏi output dữ liệu.

### 16.7. Trap và cleanup

```bash
temp_dir="$(mktemp -d)"
trap 'rm -rf -- "$temp_dir"' EXIT
```

`trap` giúp cleanup khi script kết thúc. Với lệnh xóa, target phải được tạo/kiểm soát rõ ràng; không dùng biến mơ hồ.

### 16.8. ShellCheck

ShellCheck phân tích script và phát hiện lỗi quoting, word splitting, portability. Đây là công cụ rất nên dùng trong CI.

---

## 17. Bảo mật Linux căn bản

### 17.1. Least privilege

Mỗi process/user chỉ nên có quyền tối thiểu cần thiết. Web server không cần quyền sửa source hoặc đọc private key.

### 17.2. Patch và dependency

- cập nhật bản vá hệ điều hành có kế hoạch;
- dùng release được hỗ trợ;
- theo dõi vulnerability;
- không cài package thừa;
- xóa credential mặc định.

### 17.3. Secret management

- không commit `.env` chứa secret;
- không echo secret vào log;
- dùng CI credential store hoặc secret manager;
- xoay vòng secret;
- giới hạn ai/process nào được đọc.

### 17.4. Network exposure

- chỉ mở port cần thiết;
- service nội bộ không publish công khai;
- dùng TLS;
- xác thực và rate limit;
- kiểm tra firewall cloud lẫn host.

### 17.5. Audit và log

Log đăng nhập, sudo và thay đổi cấu hình quan trọng cần được giữ/giám sát theo mức độ hệ thống. Nhưng log không được trở thành nơi rò rỉ token/password.

---

## 18. Quy trình chẩn đoán lỗi Linux

### 18.1. Không sửa trước khi quan sát

Quy trình:

1. Xác định triệu chứng chính xác.
2. Xác định phạm vi: một user, một container hay toàn server?
3. Kiểm tra thay đổi gần nhất.
4. Thu thập log/metric/status.
5. Đưa ra giả thuyết nhỏ, có thể kiểm tra.
6. Thử phép kiểm tra ít rủi ro.
7. Sửa nguyên nhân gốc.
8. Xác minh và thêm biện pháp chống tái diễn.

### 18.2. Checklist nhanh

```bash
date
uptime
df -h
free -h
ps aux
ss -lntp
systemctl --failed
journalctl -p err --since "30 minutes ago"
```

Không chạy checklist một cách máy móc trên mọi server; chọn command phù hợp và tránh lộ dữ liệu nhạy cảm.

### 18.3. App không truy cập được

Đi từ trong ra ngoài:

1. Process có chạy không?
2. App có listen đúng port/interface không?
3. `curl localhost:port` có được không?
4. Reverse proxy có route đúng không?
5. Firewall/security group có mở không?
6. DNS có trỏ đúng không?
7. TLS có hợp lệ không?
8. Client cache/CDN có ảnh hưởng không?

---

# PHẦN II – DOCKER

## 19. Docker giải quyết vấn đề gì?

### 19.1. Vấn đề “chạy máy tôi”

Ứng dụng phụ thuộc runtime, system library, cấu hình và filesystem. Nếu setup thủ công trên từng máy, môi trường dễ khác nhau.

Docker đóng gói ứng dụng và phần lớn dependency user-space vào image, rồi chạy thành container có môi trường nhất quán hơn.

### 19.2. Docker không giải quyết mọi thứ

Docker không tự động:

- sửa code lỗi;
- bảo mật ứng dụng;
- quản lý secret hoàn hảo;
- sao lưu database;
- cung cấp HA/orchestration đầy đủ;
- làm image giống mọi CPU/kernel;
- thay thế hiểu biết network/Linux.

### 19.3. Lợi ích

- môi trường có tính lặp lại;
- artifact deploy là image;
- isolation;
- dễ chạy dependency local;
- rollback theo image tag/digest;
- phù hợp CI/CD.

### 19.4. Trade-off

- thêm lớp abstraction;
- cần quản lý image/registry;
- network/storage khó hơn chạy local;
- vấn đề security supply chain;
- log/debug cần tư duy theo container lifecycle.

---

## 20. Container khác Virtual Machine thế nào?

| Tiêu chí | Container | Virtual Machine |
|---|---|---|
| Kernel | Chia sẻ kernel host/VM | Có guest kernel riêng |
| Isolation | Process-level qua kernel primitives | Hardware virtualization mạnh hơn |
| Khởi động | Thường nhanh | Thường chậm hơn |
| Kích thước | Thường nhỏ hơn | Thường lớn hơn |
| OS | User space được đóng gói | Cả guest OS |

Container không phải “VM nhẹ” theo nghĩa tuyệt đối. Nó là process được cô lập bằng primitives như namespaces và cgroups.

Trên Windows/macOS, Docker Desktop thường chạy Linux containers bên trong một Linux VM vì host không trực tiếp cung cấp Linux kernel tương thích.

---

## 21. Kiến trúc Docker

### 21.1. Thành phần

- Docker CLI nhận command.
- Docker daemon quản lý image/container/network/volume.
- Container runtime thực thi container theo OCI stack.
- Registry lưu và phân phối image.

```text
docker CLI
   ↓ Docker API
Docker daemon
   ├─ images
   ├─ containers
   ├─ networks
   └─ volumes
```

### 21.2. Namespace

Linux namespace cô lập góc nhìn về:

- process ID;
- network;
- mount;
- hostname;
- IPC;
- user ID, tùy cấu hình.

### 21.3. cgroups

Control groups theo dõi/giới hạn tài nguyên như CPU và memory. Namespace trả lời “nhìn thấy gì”, cgroup trả lời “được dùng bao nhiêu”.

### 21.4. Union filesystem và layer

Image gồm các read-only layer. Container thêm writable layer. Thay đổi trong writable layer không sửa image gốc và thường mất khi container bị xóa, trừ dữ liệu nằm trên volume/bind mount.

---

## 22. Image, Layer, Container và Registry

### 22.1. Image

Image là template bất biến theo content, gồm filesystem layers và metadata như command, environment, working directory.

### 22.2. Container

Container là runtime instance của image. Có thể tạo nhiều container từ cùng một image, mỗi container có writable layer, process và network identity riêng.

### 22.3. Tag và digest

```text
registry.example.com/team/nex-chat-fe:1.4.2
```

- registry: nơi lưu image.
- repository: `team/nex-chat-fe`.
- tag: `1.4.2`.

Tag là tên có thể được trỏ lại; digest định danh content bất biến hơn:

```text
image@sha256:...
```

Không dựa duy nhất vào `latest` cho production vì không cho biết chính xác version và có thể bị ghi đè.

### 22.4. Registry

Docker Hub là registry công khai/phổ biến. Tổ chức có thể dùng GitHub Container Registry, cloud registry hoặc private registry.

### 22.5. Pull và push

```bash
docker pull nginx:alpine
docker tag local-image registry.example.com/team/app:1.0.0
docker push registry.example.com/team/app:1.0.0
```

Credential registry phải được bảo vệ và phân quyền tối thiểu.

---

## 23. Vòng đời container và câu lệnh nền tảng

### 23.1. Image commands

```bash
docker image ls
docker pull nginx:alpine
docker build -t nex-chat-fe:dev .
docker history nex-chat-fe:dev
docker image inspect nex-chat-fe:dev
```

### 23.2. Container commands

```bash
docker run --name web -p 8080:80 -d nginx:alpine
docker container ls
docker container ls -a
docker logs web
docker stop web
docker start web
docker restart web
docker rm web
```

### 23.3. `run` thực chất làm gì?

`docker run` gần tương đương:

1. lấy image nếu cần;
2. create container;
3. cấu hình network/mount;
4. start process.

`docker start` chạy lại container đã tồn tại, không tạo mới.

### 23.4. Foreground và detached

- Không `-d`: attach output/terminal tùy option.
- `-d`: detached, container chạy nền.

Container vẫn nên ghi log ra stdout/stderr để Docker logging driver thu thập.

### 23.5. `exec`

```bash
docker exec -it web sh
docker exec web nginx -t
```

`exec` chạy process mới trong container đang chạy. Nó không “SSH vào container”; container tối giản thường không cần SSH server.

### 23.6. Inspect

```bash
docker inspect web
docker inspect -f '{{.State.Status}}' web
```

`inspect` cho cấu hình và runtime state. Template Go hữu ích nhưng cần quote đúng theo shell.

### 23.7. Copy

```bash
docker cp web:/var/log/nginx/error.log ./error.log
```

Không dùng `docker cp` như cơ chế deploy/config chính; image và mount nên mô tả trạng thái mong muốn.

### 23.8. Xóa resource

```bash
docker rm stopped-container
docker image rm unused-image
docker system df
```

Các lệnh `prune` có thể xóa nhiều resource. Luôn xem chính xác phạm vi trước, đặc biệt trên host dùng chung/production.

---

## 24. Dockerfile chuyên sâu

### 24.1. Dockerfile là gì?

Dockerfile là tập instruction để tạo image. Mục tiêu là build có tính lặp lại, image nhỏ, an toàn và cache hiệu quả.

### 24.2. `FROM`

```dockerfile
FROM node:22-alpine
```

`FROM` chọn base image. Cân nhắc:

- phiên bản runtime;
- distro/libc compatibility;
- kích thước;
- bản vá;
- công cụ cần thiết;
- provenance của image.

Pin tag cụ thể tốt hơn tag quá rộng; với yêu cầu reproducibility cao có thể pin digest và có quy trình update tự động.

### 24.3. `WORKDIR`

```dockerfile
WORKDIR /app
```

Thiết lập directory cho instruction sau và runtime mặc định. Ưu tiên `WORKDIR` thay vì chuỗi `RUN cd ...`.

### 24.4. `COPY` và `ADD`

```dockerfile
COPY package.json package-lock.json ./
```

Ưu tiên `COPY` cho copy file thông thường. `ADD` có hành vi bổ sung như giải nén local tar và hỗ trợ nguồn khác tùy builder; chỉ dùng khi cần rõ ràng.

### 24.5. `RUN`

```dockerfile
RUN npm ci
```

`RUN` thực thi trong build và tạo layer. Nó không chạy mỗi lần container start.

### 24.6. `CMD` và `ENTRYPOINT`

- `ENTRYPOINT`: executable chính, khó bị thay thế hơn.
- `CMD`: default command/arguments, dễ override.

Exec form:

```dockerfile
CMD ["nginx", "-g", "daemon off;"]
```

Exec form tránh một lớp shell và thường xử lý signal tốt hơn shell form.

Chỉ instruction `CMD` cuối cùng có hiệu lực như default command.

### 24.7. `ENV` và `ARG`

- `ARG`: biến lúc build, không mặc định là runtime env.
- `ENV`: tồn tại trong image/container runtime và có thể dùng khi build sau declaration.

Không dùng `ARG`/`ENV` để nhúng secret; giá trị có thể tồn tại trong metadata/layer/build record.

### 24.8. `EXPOSE`

```dockerfile
EXPOSE 80
```

`EXPOSE` là metadata/documentation về port container dự kiến listen. Nó không tự publish port ra host. `docker run -p 8080:80` mới tạo port mapping.

### 24.9. `USER`

```dockerfile
USER appuser
```

Production process nên chạy non-root khi có thể. Cần chuẩn bị ownership/permission trước khi đổi user.

### 24.10. Multi-stage build

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
```

Stage build chứa compiler/dev dependencies. Stage runtime chỉ lấy artifact, giúp image nhỏ hơn và giảm attack surface.

### 24.11. `HEALTHCHECK`

Healthcheck kiểm tra ứng dụng trong container, không chỉ process còn sống:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
```

Tool trong command phải tồn tại. Healthcheck quá thường xuyên/tốn kém cũng tạo tải.

---

## 25. Build context, cache và `.dockerignore`

### 25.1. Build context

Trong:

```bash
docker build -t app .
```

Dấu `.` là build context. Builder chỉ `COPY` file trong context. Context quá lớn làm build chậm và có thể vô tình gửi secret cho builder.

### 25.2. `.dockerignore`

Ví dụ cho dự án:

```dockerignore
node_modules
dist
.git
.env*
npm-debug.log*
Dockerfile*
compose*.yml
docs
```

Không ignore file thực sự cần build. Cân nhắc giữ một file env mẫu không chứa secret.

### 25.3. Cache layer

Docker cache instruction dựa trên instruction và input. Nếu viết:

```dockerfile
COPY . .
RUN npm ci
```

Bất kỳ source file đổi đều làm invalid cache install. Tốt hơn:

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

Dependency chỉ cài lại khi manifest/lockfile đổi.

### 25.4. Cache không thay tính đúng đắn

Nếu build pass chỉ do cache nhưng clean build fail, Dockerfile chưa reproducible. CI định kỳ nên có clean build hoặc kiểm soát cache rõ ràng.

### 25.5. Build secret và SSH mount

BuildKit hỗ trợ secret/SSH mount để dùng credential trong một build step mà không copy thẳng vào layer. Dù vậy hãy giới hạn quyền, không in secret và kiểm tra artifact không chứa credential.

---

## 26. Volume và dữ liệu bền vững

### 26.1. Writable layer không phải nơi lưu dữ liệu lâu dài

Xóa container sẽ mất writable layer. Dữ liệu cần bền vững dùng volume/bind mount hoặc external storage.

### 26.2. Named volume

```bash
docker volume create app-data
docker run -v app-data:/data image
docker volume ls
docker volume inspect app-data
```

Docker quản lý location của named volume. Phù hợp database/local persistent data hơn bind mount trong nhiều trường hợp.

### 26.3. Bind mount

```bash
docker run --mount type=bind,src="$PWD",dst=/app image
```

Bind mount ánh xạ path host cụ thể. Phù hợp development/source/config, nhưng gắn chặt container với filesystem host và permission.

### 26.4. Read-only mount

```bash
--mount type=bind,src=/host/config,dst=/app/config,readonly
```

Nếu container chỉ cần đọc, mount read-only giúp giảm khả năng sửa nhầm hoặc bị khai thác.

### 26.5. Anonymous volume

Volume không có tên rõ gây khó quản lý và có thể tích lũy. Production nên có naming/lifecycle/backup rõ ràng.

### 26.6. Backup

Volume không tự là backup. Cần:

- lịch backup;
- retention;
- encryption;
- lưu ngoài host;
- kiểm thử restore;
- consistency của application/database.

Frontend static container thường không cần volume dữ liệu. Source `dist` nên nằm trong image.

---

## 27. Docker Network

### 27.1. Network mặc định

Container có network namespace riêng. Docker bridge network cho container giao tiếp qua virtual network.

```bash
docker network ls
docker network create app-network
docker network inspect app-network
```

### 27.2. User-defined bridge

Container trong user-defined bridge có thể tìm nhau bằng service/container name qua DNS nội bộ.

```bash
docker run --network app-network --name api api-image
docker run --network app-network --name web web-image
```

Frontend/proxy có thể gọi `http://api:8080` từ bên trong network nếu service `api` listen đúng.

### 27.3. Port publishing

```bash
docker run -p 8080:80 nginx
```

Format thường là `HOST_PORT:CONTAINER_PORT`. App phải listen container port; mapping không sửa port app đang listen.

Giới hạn interface host:

```bash
docker run -p 127.0.0.1:8080:80 nginx
```

Cách này chỉ bind loopback host, hữu ích khi reverse proxy ngoài Docker là điểm public duy nhất.

### 27.4. `localhost` trong container

Từ container frontend/proxy:

- `localhost` là chính container đó.
- không phải container backend;
- không mặc định là host.

Trong Compose, dùng service name như `http://api:8080`.

### 27.5. Internal và public network

Có thể tách:

- edge/public network cho reverse proxy;
- backend network cho API/database;
- database không publish port ra host nếu không cần.

Network segmentation giảm exposure nhưng không thay authentication/authorization.

---

## 28. Docker Compose

### 28.1. Compose giải quyết gì?

Compose mô tả nhiều container, network, volume và config của một ứng dụng bằng YAML. Phù hợp local development, test và deployment đơn host trong nhiều trường hợp.

### 28.2. Ví dụ cấu trúc

```yaml
services:
  web:
    build:
      context: .
    ports:
      - "8080:80"
    depends_on:
      api:
        condition: service_healthy
    networks:
      - frontend

  api:
    image: example/nex-api:1.0.0
    environment:
      NODE_ENV: production
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - frontend
      - backend

networks:
  frontend:
  backend:
```

Compose Specification hiện đại không cần trường `version` cũ trong nhiều trường hợp.

### 28.3. Commands

```bash
docker compose up
docker compose up -d --build
docker compose ps
docker compose logs -f web
docker compose exec web sh
docker compose down
docker compose config
```

`docker compose config` giúp render/validate cấu hình sau interpolation.

### 28.4. `depends_on`

Thứ tự start không đồng nghĩa service sẵn sàng nhận request. Dùng healthcheck/condition phù hợp hoặc ứng dụng có retry/backoff.

Ngay cả với healthcheck, runtime dependency có thể mất sau khi startup, nên app vẫn phải xử lý reconnect.

### 28.5. Environment interpolation

Compose có thể đọc biến để thay vào YAML. Phân biệt:

- biến dùng để interpolate Compose file;
- biến được truyền vào environment container;
- Vite build arg được bundle lúc build.

Ba thứ này không tự động giống nhau.

### 28.6. Profiles và override

Profiles/override giúp bật tool dev hoặc cấu hình theo môi trường. Tránh một Compose file khổng lồ đầy điều kiện khó hiểu; có thể chia file base và file override rõ ràng.

---

## 29. Log, healthcheck và restart policy

### 29.1. Log container

Ứng dụng nên ghi log ra stdout/stderr:

```bash
docker logs container-name
docker logs -f --tail 100 container-name
```

Production thường chuyển log qua logging driver/agent vào hệ thống tập trung.

### 29.2. Logging rotation

Nếu dùng default JSON log không giới hạn, disk có thể đầy. Cần cấu hình `max-size`, `max-file` hoặc logging stack phù hợp.

### 29.3. Healthcheck

Phân biệt:

- process running;
- container running;
- application healthy;
- application ready nhận traffic.

Docker healthcheck cung cấp health state, nhưng cách hệ thống dùng state đó phụ thuộc Compose/orchestrator/deployment.

### 29.4. Restart policy

```yaml
restart: unless-stopped
```

Restart policy giúp tự khởi động lại trong một số tình huống, nhưng restart loop không chữa lỗi cấu hình. Cần backoff/alert/log và giới hạn tùy hệ thống.

### 29.5. Graceful shutdown

Khi nhận SIGTERM, app nên:

- ngừng nhận request mới;
- hoàn thành/hủy công việc đang xử lý;
- đóng connection;
- flush cần thiết;
- thoát trước timeout.

Nginx/Node process phải là process được signal đúng; tránh shell wrapper nuốt signal.

---

## 30. Resource limit và hiệu năng

### 30.1. Vì sao cần limit?

Không giới hạn, một container lỗi có thể dùng quá nhiều CPU/RAM và ảnh hưởng host/container khác.

```bash
docker run --memory 512m --cpus 1.0 image
```

### 30.2. Theo dõi

```bash
docker stats
```

Quan sát CPU, memory, network I/O, block I/O và process count. Metric production nên được thu thập lâu dài, không chỉ nhìn snapshot.

### 30.3. Memory của Node

Node/V8 có heap behavior riêng ngoài container limit. Container bị OOM có thể thoát mã 137 trong nhiều trường hợp. Cần so sánh app metrics, cgroup limit và host memory.

### 30.4. Image size

Giảm image bằng:

- multi-stage build;
- base image phù hợp;
- `.dockerignore`;
- chỉ cài production runtime cần thiết;
- xóa cache trong cùng layer;
- không copy source/toolchain vào runtime stage.

Image nhỏ không tự động luôn an toàn hơn, nhưng thường giảm transfer time và attack surface.

---

## 31. Bảo mật Docker

### 31.1. Container không phải security boundary tuyệt đối

Container chia sẻ kernel, nên kernel vulnerability hoặc cấu hình đặc quyền có thể phá isolation. Đừng coi container là sandbox hoàn hảo cho code không tin cậy.

### 31.2. Không chạy root nếu không cần

Process root trong container có quyền cao trong namespace và tăng hậu quả khi escape/misconfiguration. Dùng non-root user và filesystem read-only khi có thể.

### 31.3. Tránh privileged

`--privileged`, mount Docker socket hoặc thêm capability rộng trao quyền rất lớn. Docker socket gần như trao quyền điều khiển Docker host cho process có quyền truy cập.

### 31.4. Linux capabilities

Root privilege được chia thành capabilities. Có thể drop mặc định và add đúng capability cần:

```yaml
cap_drop:
  - ALL
```

Chỉ add lại nếu app thật sự cần và đã test.

### 31.5. Read-only filesystem

```yaml
read_only: true
tmpfs:
  - /tmp
```

Giúp hạn chế ghi vào container filesystem. App cần path writable phải được khai báo rõ.

### 31.6. Image supply chain

- dùng official/trusted base image;
- pin version/digest theo policy;
- scan vulnerability;
- tạo SBOM;
- ký/xác minh image khi hệ thống yêu cầu;
- rebuild để nhận bản vá;
- giảm package thừa.

### 31.7. Secret

Không:

- `COPY .env` vào image;
- đặt token trong `ARG` rồi nghĩ đã an toàn;
- commit credential;
- log toàn bộ environment.

Secret nên được inject lúc runtime từ secret manager/orchestrator và chỉ cấp cho workload cần.

### 31.8. Runtime hardening

Cân nhắc:

- non-root;
- drop capabilities;
- no-new-privileges;
- seccomp/AppArmor/SELinux;
- resource limits;
- network segmentation;
- read-only root filesystem;
- patch/scan.

Không copy checklist mù quáng; test vì mỗi app có nhu cầu khác.

---

## 32. Docker hóa React + Vite

### 32.1. Development và production là hai mục tiêu khác nhau

Development container cần:

- Node;
- source mount;
- HMR;
- dev dependencies;
- port Vite.

Production frontend SPA thường chỉ cần:

- static files từ `dist`;
- web server như Nginx/Caddy;
- cấu hình SPA/proxy/cache.

Không dùng Vite dev server làm production server.

### 32.2. Dockerfile production mẫu

Đây là ví dụ để học, chưa phải file đã được thêm vào dự án:

```dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 32.3. Vì sao dùng hai stage?

Build stage cần Node, npm, TypeScript, Vite. Runtime stage chỉ phục vụ file tĩnh, nên không cần source, `node_modules` hay compiler.

### 32.4. `npm ci` và lockfile

Copy cả `package.json` và `package-lock.json`, dùng `npm ci` để install theo lockfile. Nếu lockfile không khớp manifest, build nên fail để phát hiện dependency state sai.

### 32.5. HMR trong container development

Vite trong container thường cần listen `0.0.0.0`. Source bind mount giúp host sửa file. Trên Windows/macOS, filesystem event/performance có thể khác Linux; đôi khi polling cần thiết nhưng tốn tài nguyên.

### 32.6. Không mount `node_modules` host tùy tiện

`node_modules` có thể chứa binary phụ thuộc OS/architecture. Mount từ Windows vào Linux container dễ lỗi. Có thể dùng named volume riêng cho container dependencies.

---

## 33. Nginx cho SPA

### 33.1. Serve static file

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

`try_files ... /index.html` giúp BrowserRouter hoạt động khi truy cập trực tiếp `/home` hoặc `/messages/123`.

### 33.2. Proxy API

```nginx
location /api/ {
    proxy_pass http://api:3000/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Dấu `/` trong `location` và `proxy_pass` ảnh hưởng cách path được rewrite. Phải test URL thực tế, không copy config mà không hiểu.

### 33.3. WebSocket/Socket.IO proxy

```nginx
location /socket.io/ {
    proxy_pass http://api:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

Cấu hình path, transport, timeout và sticky/session behavior phải khớp backend/load balancer.

### 33.4. Cache static assets

Asset có hash trong filename có thể cache lâu:

```nginx
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

`index.html` thường không cache quá lâu vì nó trỏ tới tên asset build mới. Chiến lược cache sai có thể khiến user tải HTML cũ hoặc tham chiếu asset đã bị xóa.

### 33.5. Compression và security header

Nginx có thể cấu hình gzip/Brotli tùy build, CSP/HSTS và các security header. Mỗi header cần hiểu tác động; CSP quá lỏng vô ích, quá chặt có thể làm app hỏng.

### 33.6. Nginx config test

```bash
nginx -t
```

Luôn test syntax trước reload. Trong container:

```bash
docker exec web nginx -t
```

---

## 34. Biến môi trường build-time và runtime

### 34.1. Vấn đề quan trọng của Vite SPA

Vite thay `import.meta.env.VITE_*` trong quá trình build. Sau khi build, giá trị thường đã nằm trong static JavaScript. Đặt environment variable mới vào Nginx container không tự thay đổi bundle.

### 34.2. Build riêng mỗi môi trường

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  -t app:prod .
```

Ưu điểm: đơn giản. Nhược điểm: mỗi môi trường tạo artifact khác, và không dùng cho secret.

Dockerfile minh họa:

```dockerfile
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build
```

Giá trị public API URL không nhất thiết là secret, nhưng vẫn có thể xuất hiện trong image/build metadata.

### 34.3. Runtime config file

Một hướng khác là browser tải `/config.js` hoặc `/config.json` do entrypoint tạo lúc container start:

```js
window.__APP_CONFIG__ = {
  API_BASE_URL: "..."
};
```

App đọc config runtime thay vì compile-time. Lợi ích là một image dùng nhiều environment. Cần:

- validate biến;
- escape đúng khi tạo JavaScript;
- cache config phù hợp;
- không đưa secret vì browser vẫn xem được;
- xử lý app khi config thiếu.

### 34.4. Same-origin proxy

Frontend có thể gọi `/api`, và Nginx route sang backend. Cách này giảm nhu cầu biết public backend URL trong bundle và có thể đơn giản hóa CORS. Nhưng proxy config phải đúng ở mọi môi trường.

### 34.5. Nguyên tắc

Không có secret thật sự trong code chạy browser. Nếu browser cần dùng một giá trị, người dùng có thể quan sát nó.

---

## 35. CI/CD với Docker

### 35.1. CI và CD

- Continuous Integration: thường xuyên merge, build và test tự động.
- Continuous Delivery: artifact luôn ở trạng thái sẵn sàng deploy, production có thể cần phê duyệt.
- Continuous Deployment: thay đổi pass pipeline tự động lên production.

### 35.2. Pipeline điển hình

```text
Checkout
  ↓
Install reproducibly
  ↓
Lint + type-check + test
  ↓
Build Docker image
  ↓
Scan image/SBOM
  ↓
Push registry bằng immutable tag
  ↓
Deploy staging
  ↓
Smoke test
  ↓
Promote cùng image lên production
  ↓
Observe và rollback nếu cần
```

### 35.3. Không build lại khi promote

Lý tưởng là cùng một image digest được test ở staging rồi promote production. Nếu build lại, artifact production có thể khác artifact đã test.

### 35.4. Tag strategy

Có thể dùng đồng thời:

- semantic version: `1.4.2`;
- Git commit SHA: `git-a1b2c3d`;
- environment pointer: `staging` – mutable, chỉ để tiện;
- digest cho deployment chính xác.

Không chỉ dùng `latest`.

### 35.5. Cache CI

BuildKit registry/GHA/Jenkins cache có thể tăng tốc. Cache phải là tối ưu, không phải dependency bắt buộc để build đúng.

### 35.6. Credential

- dùng Jenkins Credentials/secret store;
- scope tối thiểu;
- không hard-code trong Jenkinsfile;
- không in token;
- logout/cleanup khi phù hợp;
- phân quyền push/deploy riêng.

### 35.7. Rollback

Rollback image-based thường là deploy digest/tag trước. Nhưng nếu có migration database không backward-compatible, rollback app không đủ. Frontend static đơn giản hơn nhưng cache/CDN phải được xem xét.

---

## 36. Production, registry và versioning

### 36.1. Immutable infrastructure

Thay vì SSH vào server sửa file trực tiếp, build artifact/image mới và thay workload. Điều này tăng tính lặp lại, audit và rollback.

### 36.2. Deployment đơn host

Với dự án nhỏ, có thể:

1. CI build/push image.
2. Server pull tag/digest mới.
3. `docker compose up -d`.
4. health/smoke test.
5. giữ image cũ để rollback.

Vẫn cần xử lý downtime, cleanup image, log, TLS và backup.

### 36.3. Rolling, blue-green và canary

- Rolling: thay dần instance.
- Blue-green: hai môi trường, switch traffic.
- Canary: đưa phần nhỏ traffic vào version mới.

Docker Engine đơn host không tự cung cấp toàn bộ orchestration cho các chiến lược này; cần proxy/orchestrator/automation phù hợp.

### 36.4. Kubernetes ở đâu?

Kubernetes orchestration container ở quy mô cluster: scheduling, desired state, service discovery, rollout, self-healing và config/secret primitives. Học Docker/Linux trước giúp hiểu Kubernetes tốt hơn.

Không dùng Kubernetes chỉ vì phổ biến; hệ thống nhỏ có thể vận hành tốt với managed platform hoặc Compose đơn host.

### 36.5. Observability

Ba trụ cột thường nhắc:

- logs;
- metrics;
- traces.

Ngoài ra cần alert, dashboard, correlation ID và runbook. “Container running” chưa đồng nghĩa user dùng được ứng dụng.

---

## 37. Debug Docker theo quy trình

### 37.1. Container thoát ngay

```bash
docker ps -a
docker logs container
docker inspect container
```

Kiểm tra:

- exit code;
- command/entrypoint;
- config/env;
- permission;
- file cần thiết;
- architecture;
- OOM.

Container dừng khi process chính kết thúc. Không cần “giữ container sống” bằng process giả; hãy sửa command/service.

### 37.2. Không truy cập được port

1. Container có running?
2. App có listen không?
3. Listen `0.0.0.0` hay chỉ `127.0.0.1`?
4. Container port đúng?
5. `-p` mapping đúng?
6. Host firewall/cloud firewall?
7. Reverse proxy/DNS/TLS?

### 37.3. Hai container không gọi được nhau

1. Cùng network?
2. Dùng service name đúng?
3. Dùng container port, không dùng host port?
4. App backend listen mọi interface?
5. DNS resolution?
6. Backend healthy?

### 37.4. File thay đổi không thấy

- mount có che file trong image không?
- mount source/destination đúng?
- permission/UID?
- HMR watcher?
- cache browser/proxy?
- container/image có thật sự được rebuild/recreate?

### 37.5. Build cache làm nhầm

```bash
docker build --no-cache --progress=plain -t app:test .
```

Chỉ dùng `--no-cache` để chẩn đoán/clean build khi cần; bình thường cache rất hữu ích.

### 37.6. Image đúng nhưng container cũ

Pull/build image mới không tự thay container đã tạo. Cần recreate container. Kiểm tra image ID/digest thực tế của container qua inspect.

### 37.7. Disk đầy

```bash
docker system df
df -h
```

Tìm nguyên nhân: image cũ, build cache, stopped container, volume không dùng, log lớn. Không chạy prune rộng trên production trước khi xác định resource nào còn cần.

---

## 38. Phân tích dự án hiện tại

### 38.1. Hiện trạng

- Chưa có Dockerfile.
- Chưa có `.dockerignore`.
- Chưa có Compose file.
- Vite dev server có proxy `/api`.
- Build command là `tsc -b && vite build`.
- Artifact production nằm trong `dist`.
- Jenkins SSH vào Ubuntu server, checkout/reset branch, cài dependency có điều kiện, build và restart PM2.

### 38.2. Điểm cần hiểu trong pipeline hiện tại

```text
Jenkins agent
   ↓ SSH
Ubuntu server
   ↓ source NVM
Git reset branch developer
   ↓
npm install nếu manifest đổi
   ↓
npm run build
   ↓
PM2 restart nex-chat-fe
```

Server vừa là nơi giữ working tree, vừa build, vừa chạy. Trạng thái server ảnh hưởng kết quả deploy.

### 38.3. Các điểm nên cải thiện khi có kế hoạch Docker hóa

1. CI chạy lint/type-check/test trước deploy.
2. Dùng `npm ci` theo lockfile.
3. Build multi-stage image.
4. Nginx serve `dist` và SPA fallback.
5. Proxy `/api`/Socket.IO nếu kiến trúc yêu cầu.
6. Gắn image tag với commit SHA.
7. Scan rồi push registry.
8. Server pull đúng digest và recreate container.
9. Health/smoke test sau deploy.
10. Có rollback image trước.
11. Quản lý TLS/log/rotation/secret.
12. Không tắt SSH host key verification một cách rộng.

### 38.4. PM2 có cần cho static frontend không?

Nếu frontend chỉ là static files đã build, Nginx có thể serve trực tiếp; PM2 chủ yếu quản lý process Node. Nếu PM2 hiện đang chạy một static server hoặc Vite preview, cần kiểm tra command thực tế trước khi thay đổi.

Không kết luận xóa PM2 khi chưa biết nó đang quản lý process nào và Nginx/reverse proxy hiện có ra sao.

### 38.5. Cấu hình Vite proxy không tự đi production

`server.proxy` chỉ áp dụng Vite dev server. Production Nginx/reverse proxy phải định nghĩa `/api`, hoặc app dùng public API URL phù hợp.

### 38.6. Kế hoạch migration an toàn

```text
1. Tài liệu hóa kiến trúc hiện tại
2. Tạo Dockerfile + Nginx config local
3. Test route SPA và API proxy
4. Chạy song song trên port khác
5. Thêm CI build/scan/push
6. Deploy staging
7. Smoke/load/security test
8. Chuẩn bị rollback
9. Chuyển traffic
10. Theo dõi rồi mới dọn hệ thống cũ
```

---

## 39. Câu hỏi phỏng vấn và trả lời mẫu

### 39.1. Linux là gì?

> Linux là kernel quản lý process, memory, filesystem, device và network. Khi nói hệ điều hành Linux, ta thường nói tới một distribution gồm kernel cùng user-space tools, package manager và service manager. Server web/container phổ biến trên Linux nên em cần hiểu process, permission, network và filesystem để deploy/debug.

### 39.2. Process và thread khác gì?

> Process có không gian địa chỉ và resource riêng; thread là đơn vị thực thi trong process và chia sẻ phần lớn memory/resource của process. Chi tiết triển khai phụ thuộc OS/runtime. Container cô lập process chứ không biến mỗi app thành VM.

### 39.3. `chmod 755` nghĩa là gì?

> Owner có read/write/execute; group và others có read/execute. Các số là tổng read 4, write 2, execute 1. Em không dùng 777 để chữa permission vì nó mở quyền quá rộng; em xác định đúng user/group và quyền cần thiết.

### 39.4. `SIGTERM` và `SIGKILL` khác gì?

> SIGTERM yêu cầu process dừng và cho phép handler cleanup. SIGKILL buộc kernel dừng ngay, không thể bị bắt hoặc cleanup. Em gửi TERM trước và chỉ KILL khi process không phản hồi, đồng thời điều tra nguyên nhân.

### 39.5. Pipe và redirect khác gì?

> Pipe nối stdout command trước vào stdin command sau. Redirect nối stdin/stdout/stderr với file hoặc file descriptor khác. Exit status và `pipefail` quan trọng trong script CI để lỗi bên trong pipeline không bị che.

### 39.6. Docker image và container khác gì?

> Image là template read-only theo layer và metadata. Container là instance của image có process, network namespace và writable layer. Có thể tạo nhiều container từ một image; xóa container không xóa image.

### 39.7. Container khác VM?

> VM có guest kernel riêng trên lớp ảo hóa phần cứng; container chia sẻ kernel host/VM và cô lập process bằng namespace/cgroup. Container thường nhẹ và start nhanh hơn, nhưng isolation model khác và không phải VM thu nhỏ hoàn toàn.

### 39.8. `EXPOSE` có mở port không?

> Không. `EXPOSE` chủ yếu là metadata mô tả port dự kiến. Muốn truy cập từ host thường cần `-p host:container` hoặc cấu hình network/orchestrator. Bản thân app cũng phải listen đúng container port/interface.

### 39.9. `CMD` và `ENTRYPOINT` khác gì?

> ENTRYPOINT thường xác định executable chính; CMD cung cấp command/default arguments dễ override. Em ưu tiên exec form để process nhận signal trực tiếp. Cách kết hợp cụ thể phụ thuộc image muốn hoạt động như executable hay service.

### 39.10. `COPY` và `ADD` khác gì?

> COPY chỉ copy file từ build context và rõ ý định. ADD có thêm hành vi như tự giải nén local archive và một số source behavior. Em dùng COPY mặc định, chỉ dùng ADD khi cần đúng tính năng bổ sung.

### 39.11. Vì sao Docker image có layer?

> Layer cho phép cache và chia sẻ content giữa image/build, giảm việc tải/lưu trùng. Mỗi instruction filesystem có thể tạo layer. Xóa file ở layer sau không nhất thiết làm dữ liệu biến mất khỏi layer trước, nên secret không được copy vào rồi xóa sau.

### 39.12. Multi-stage build là gì?

> Multi-stage build dùng nhiều `FROM`; stage đầu build/compile, stage cuối chỉ copy artifact cần chạy. Với React, Node stage tạo `dist`, Nginx stage serve static files. Runtime image nhỏ hơn và không mang dev tool/source/node_modules.

### 39.13. Volume và bind mount khác gì?

> Named volume do Docker quản lý location và lifecycle, phù hợp persistent data. Bind mount ánh xạ path cụ thể từ host, tiện development/config nhưng phụ thuộc host và permission. Cả hai đều che nội dung có sẵn tại mount destination trong container.

### 39.14. Vì sao container gọi `localhost` không tới backend?

> Vì mỗi container có network namespace; localhost trỏ về chính container đó. Hai service trong Compose nên cùng network và gọi nhau bằng service name cùng container port, ví dụ `http://api:3000`.

### 39.15. `depends_on` có đảm bảo database sẵn sàng không?

> Start order không nhất thiết là readiness. Có thể dùng healthcheck condition tùy Compose, nhưng ứng dụng vẫn phải có retry/backoff vì dependency có thể mất sau startup.

### 39.16. Làm sao giảm image size?

> Dùng multi-stage build, `.dockerignore`, base image phù hợp, chỉ cài runtime dependency, xóa cache trong cùng layer và không copy source/toolchain vào runtime. Em vẫn ưu tiên compatibility, security và maintainability thay vì chỉ chạy theo số MB.

### 39.17. Vì sao không chạy container bằng root?

> Non-root giảm quyền của process khi bị khai thác và hạn chế hậu quả do mount/misconfiguration. Nó không loại bỏ mọi rủi ro, nên kết hợp drop capabilities, read-only filesystem, resource limit và patching.

### 39.18. Dữ liệu container mất khi nào?

> Dữ liệu ở writable layer mất khi container bị xóa. Stop/start cùng container vẫn giữ layer, nhưng không nên coi đó là persistence đáng tin cậy. Dữ liệu bền vững cần volume hoặc external storage và backup.

### 39.19. Docker cache hoạt động thế nào?

> Builder tái sử dụng kết quả instruction khi instruction và input liên quan không đổi. Em copy manifest trước rồi `npm ci`, sau đó mới copy source để source change không làm mất cache dependency. Cache là tối ưu; clean build vẫn phải đúng.

### 39.20. Docker Compose dùng để làm gì?

> Compose mô tả nhiều service, network, volume và config trong YAML rồi quản lý chúng như một application. Nó rất hữu ích local/test và deployment đơn host, nhưng không cung cấp đầy đủ orchestration cluster như Kubernetes.

### 39.21. Làm sao debug container thoát ngay?

> Em xem `docker ps -a`, `docker logs` và `docker inspect`, kiểm tra exit code, command, env, permission, file, architecture và OOM. Container sống theo process chính; em sửa process/config chứ không thêm vòng lặp giả để giữ container sống.

### 39.22. Healthcheck là gì?

> Healthcheck chạy phép kiểm tra định kỳ để xác định app trong container có khỏe, khác với container chỉ đang running. Check phải nhanh, đáng tin, không phụ thuộc tool không tồn tại và không gây tải. Orchestrator/deployment phải dùng health state đúng cách.

### 39.23. Tại sao Vite environment không đổi khi chạy container?

> `VITE_*` thường được thay vào bundle lúc build, nên Nginx runtime env không tự sửa JavaScript đã build. Em chọn build theo môi trường, runtime config file public, hoặc same-origin reverse proxy. Không phương án nào biến frontend env thành secret.

### 39.24. Docker có thay thế CI/CD không?

> Không. Docker tạo và chạy artifact container. CI/CD còn checkout, lint, test, scan, push, deploy, smoke test, approval, monitoring và rollback. Docker chỉ là một phần của pipeline.

### 39.25. Vì sao không dùng tag `latest` cho production?

> `latest` là tag mutable và không thể hiện chính xác version đang chạy. Em tag theo semantic version/commit SHA và deploy theo digest khi cần tính bất biến, đồng thời giữ metadata để rollback.

### 39.26. Bạn sẽ Docker hóa dự án React này thế nào?

> Em dùng Node multi-stage build với `npm ci` và `npm run build`, sau đó copy `dist` vào Nginx runtime image. Nginx có SPA fallback, cache asset hash và proxy `/api`/Socket.IO nếu kiến trúc cần. CI lint/test, build image gắn commit SHA, scan, push registry, deploy cùng digest đã test và smoke test. Runtime image không chứa source, Node toolchain hoặc secret.

---

## 40. Bài thực hành

### Cấp 1 – Linux căn bản

1. Dùng Ubuntu VM/WSL và xác định distro/kernel/shell.
2. Tạo cây thư mục lab bằng `mkdir -p`.
3. Tạo/copy/move file.
4. Dùng `find`, `rg`/`grep`, `sort`, `uniq`, `wc`.
5. Thực hành redirect stdout/stderr và pipeline.
6. Tạo script có executable permission.
7. Giải thích `644`, `640`, `755`, `700`.

### Cấp 2 – Process và network

1. Chạy một HTTP server local.
2. Xác định PID và listening port.
3. Gửi SIGTERM và quan sát.
4. Dùng `curl -v` kiểm tra response.
5. Phân biệt bind `127.0.0.1`/`0.0.0.0`.
6. Xem log bằng `tail -f` hoặc journal.

### Cấp 3 – Docker cơ bản

1. Pull Nginx image.
2. Run và publish port 8080 → 80.
3. Xem logs/inspect/stats.
4. Exec vào container và xem filesystem.
5. Stop/start/recreate để hiểu lifecycle.
6. Tạo named volume và bind mount.
7. Tạo user-defined network cho hai container.

### Cấp 4 – Dockerfile

1. Viết image Node đơn giản.
2. Quan sát layer bằng `docker history`.
3. Đo cache khi source đổi.
4. Thêm `.dockerignore`.
5. Chuyển sang multi-stage build.
6. Chạy non-root nếu app phù hợp.
7. Scan image và đọc kết quả.

### Cấp 5 – Docker hóa `nex-chat-fe`

1. Viết Dockerfile multi-stage.
2. Viết Nginx config có SPA fallback.
3. Build image local.
4. Run trên port 8080.
5. Truy cập trực tiếp một nested route.
6. Kiểm tra cache header.
7. Thiết kế `/api` proxy.
8. Test Socket.IO upgrade nếu backend có.

### Cấp 6 – Compose

1. Compose frontend + mock API.
2. Gọi backend bằng service name.
3. Tách public/internal network.
4. Thêm healthcheck.
5. Thêm resource limit phù hợp môi trường.
6. Thêm log rotation.
7. Kiểm tra graceful shutdown.

### Cấp 7 – CI/CD

1. Pipeline lint + build.
2. Build image tag bằng Git SHA.
3. Scan và push registry test.
4. Deploy staging.
5. Smoke test route và health.
6. Rollback digest cũ.
7. Viết runbook khi deploy fail.

### Tiêu chí tự review

- Clean build có chạy không?
- Image có source/secret thừa không?
- Process runtime có chạy root không?
- App có nhận SIGTERM không?
- Route SPA trực tiếp có hoạt động không?
- API/Socket proxy đúng chưa?
- Log có rotation không?
- Resource có limit/monitoring không?
- Tag/digest có truy ngược commit không?
- Có rollback đã kiểm thử không?

---

## 41. Lộ trình học 8 tuần

### Tuần 1 – Linux filesystem và shell

- terminal/shell;
- path/filesystem;
- file command;
- quoting/globbing;
- redirect/pipe/exit code.

Đầu ra: tự điều hướng và xử lý log mà không phụ thuộc giao diện đồ họa.

### Tuần 2 – Permission, process và service

- user/group/rwx;
- process/signal;
- systemd/journal;
- disk/memory.

Đầu ra: giải thích được vì sao app không start hoặc không đọc được file.

### Tuần 3 – Network, SSH và Bash

- IP/port/DNS/TCP/TLS;
- curl/ss;
- SSH key/host verification;
- Bash script an toàn.

Đầu ra: script health/deploy thử nghiệm có error handling.

### Tuần 4 – Docker core

- image/container/layer;
- CLI/lifecycle;
- namespace/cgroup;
- port/mount/log.

Đầu ra: chạy và debug container không nhìn tutorial.

### Tuần 5 – Dockerfile

- instruction;
- cache/context;
- multi-stage;
- non-root;
- image scan.

Đầu ra: image nhỏ, reproducible và không chứa secret.

### Tuần 6 – Compose và network

- multi-service;
- DNS/service name;
- volume;
- health/restart;
- resource/log.

Đầu ra: local stack frontend + backend chạy bằng một command.

### Tuần 7 – Production frontend

- Nginx SPA;
- proxy API/WebSocket;
- cache;
- Vite build/runtime config;
- TLS/observability.

Đầu ra: Docker hóa hoàn chỉnh dự án trên staging.

### Tuần 8 – CI/CD và phỏng vấn

- build/test/scan/push/deploy;
- tag/digest;
- rollback;
- incident/debug drills;
- mock interview.

Đầu ra: demo pipeline và trả lời câu hỏi theo cơ chế + trade-off.

### Nhịp học mỗi ngày

- 30 phút đọc.
- 60 phút tự gõ command/lab.
- 15 phút phá thử và debug.
- 15 phút nói lại định nghĩa không nhìn tài liệu.
- Ghi runbook thay vì chỉ lưu history command.

---

## 42. Cheat sheet và flashcard

### 42.1. Linux cheat sheet

```bash
# Hệ thống
uname -a
cat /etc/os-release
uptime
free -h
df -h

# File
pwd
ls -lah
find . -type f -name '*.log'
du -sh directory
stat file

# Text/log
rg 'ERROR' .
tail -f app.log
less app.log
sort file | uniq -c

# Process/network
ps aux
pgrep -a nginx
ss -lntp
curl -v http://localhost:8080

# Service
systemctl status service
journalctl -u service -f

# Permission
id
chmod 640 file
chown user:group file
```

### 42.2. Docker cheat sheet

```bash
# Image
docker image ls
docker pull image:tag
docker build -t app:tag .
docker history app:tag

# Container
docker ps
docker ps -a
docker run --name app -p 8080:80 -d app:tag
docker logs -f --tail 100 app
docker exec -it app sh
docker inspect app
docker stop app
docker rm app

# Resource
docker stats
docker system df
docker volume ls
docker network ls

# Compose
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs -f
docker compose down
```

### 42.3. Flashcard

1. **Q:** Linux là OS hay kernel?  
   **A:** Linux chính xác là kernel; distro cung cấp hệ điều hành hoàn chỉnh quanh kernel.

2. **Q:** Exit code thành công?  
   **A:** Theo convention là `0`.

3. **Q:** `777` có nên dùng để sửa permission?  
   **A:** Không; xác định đúng owner/group/quyền tối thiểu.

4. **Q:** SIGKILL có cleanup được không?  
   **A:** Không.

5. **Q:** Image có chạy không?  
   **A:** Image là template; container là instance có process chạy.

6. **Q:** Container có kernel riêng không?  
   **A:** Linux container chia sẻ kernel host/VM.

7. **Q:** `EXPOSE 80` có publish host port không?  
   **A:** Không.

8. **Q:** Xóa container có mất dữ liệu writable layer không?  
   **A:** Có; dùng volume/external storage cho persistence.

9. **Q:** `localhost` trong container là ai?  
   **A:** Chính container/network namespace đó.

10. **Q:** Vì sao multi-stage?  
    **A:** Tách build tool khỏi runtime artifact, giảm image/attack surface.

11. **Q:** `.dockerignore` để làm gì?  
    **A:** Loại file khỏi build context, tăng tốc và giảm nguy cơ gửi file nhạy cảm.

12. **Q:** `depends_on` có thay retry không?  
    **A:** Không.

13. **Q:** Vite env là runtime secret không?  
    **A:** Không; giá trị client có thể bị quan sát và thường được bundle lúc build.

14. **Q:** Tag và digest khác gì?  
    **A:** Tag là pointer có thể đổi; digest định danh content.

15. **Q:** Container running có nghĩa app healthy không?  
    **A:** Không.

### 42.4. Checklist trước phỏng vấn

- [ ] Giải thích kernel/user space/process.
- [ ] Đọc permission dạng chữ và octal.
- [ ] Giải thích pipe, redirect, exit code.
- [ ] Debug port/process/log trên Linux.
- [ ] Giải thích image/container/layer/registry.
- [ ] So sánh container và VM.
- [ ] Viết Dockerfile multi-stage từ trí nhớ.
- [ ] Giải thích cache và `.dockerignore`.
- [ ] Phân biệt volume và bind mount.
- [ ] Giải thích Docker DNS/network/localhost.
- [ ] Viết Compose hai service.
- [ ] Giải thích healthcheck/restart/graceful shutdown.
- [ ] Trình bày bảo mật non-root/secret/capability.
- [ ] Giải thích Vite build-time env.
- [ ] Trình bày pipeline build → scan → push → deploy → rollback.
- [ ] Docker hóa dự án này bằng lời trong 90 giây.

---

## Phụ lục A – Mẫu runbook xử lý sự cố

```md
# Tên sự cố

## Triệu chứng
- Người dùng thấy gì?
- Bắt đầu lúc nào?
- Phạm vi ảnh hưởng?

## Kiểm tra nhanh
- Process/container status:
- Health endpoint:
- Log liên quan:
- CPU/RAM/disk:
- Network/DNS/TLS:
- Thay đổi gần nhất:

## Giả thuyết và bằng chứng
1. Giả thuyết:
   - Cách kiểm tra:
   - Kết quả:

## Mitigation
- Cách giảm ảnh hưởng ngay:
- Rủi ro:
- Cách rollback:

## Root cause
- Nguyên nhân kỹ thuật:
- Vì sao kiểm soát trước đó không phát hiện?

## Prevent recurrence
- Fix:
- Test/alert/runbook cần thêm:
```

## Phụ lục B – Mẫu trình bày Docker hóa dự án

```text
1. Artifact là gì? → Vite dist
2. Build ở đâu? → Node build stage trong CI
3. Runtime là gì? → Nginx non-root hoặc cấu hình an toàn
4. Route SPA ra sao? → try_files fallback index.html
5. API/Socket đi đâu? → reverse proxy/service name
6. Config khi nào? → build-time hoặc public runtime config
7. Secret ở đâu? → không nằm trong frontend/image
8. Health/log/resource? → check, stdout/stderr, limit/metrics
9. Version? → commit SHA + digest
10. Rollback? → redeploy digest trước và kiểm tra cache
```

## Phụ lục C – Những câu tuyệt đối không nên trả lời máy móc

- “Docker là máy ảo nhẹ.” → Thiếu chính xác về shared kernel và isolation.
- “EXPOSE mở port.” → Sai; nó không publish port.
- “Volume là backup.” → Sai; persistence và backup là hai vấn đề khác.
- “Container chạy là app khỏe.” → Sai; cần health/readiness/user-facing check.
- “`latest` là bản mới nhất đáng tin.” → Tag có thể mutable và mơ hồ.
- “Dùng Alpine luôn tốt nhất.” → Còn compatibility, musl, debug, security và maintenance.
- “Chạy root trong container không sao.” → Làm tăng hậu quả khi bị khai thác.
- “Frontend `.env` giữ được secret.” → Browser có thể đọc bundle/request.
- “Compose `depends_on` giải quyết readiness.” → Chỉ start order là chưa đủ.
- “Kubernetes thay Docker.” → Đây là các tầng/vai trò khác nhau; runtime/image/orchestration cần phân biệt.

---

## Kết luận

Hãy ghi nhớ mô hình tổng quát:

```text
Linux host cung cấp kernel
    ↓
Docker dùng namespace + cgroup + filesystem layer
    ↓
Image mô tả artifact bất biến
    ↓
Container chạy một process chính
    ↓
Network đưa traffic vào đúng port
    ↓
Volume giữ dữ liệu cần bền vững
    ↓
Compose/CI/CD điều phối cấu hình và vòng đời
    ↓
Log + metric + healthcheck giúp quan sát và vận hành
```

Bạn thật sự hiểu Docker khi có thể giải thích **process nào đang chạy, file đến từ layer hay mount nào, traffic đi qua network/port nào, config được inject khi nào, dữ liệu sống ở đâu và điều gì xảy ra khi container bị xóa**.

