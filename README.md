# MDD App

## Start the Project

Clone the repository:
```bash
git clone https://github.com/clarabernadou/ClaraBernadou_6_MDD_062024.git
```

### Frontend

Navigate to the frontend directory:
```bash
cd front/
```

Install dependencies:
```bash
npm install
```

Launch the frontend:
```bash
npm run start
```

### Backend

Navigate to the backend directory:
```bash
cd back/
```

Install dependencies:
```bash
mvn clean install
```

Create Maven configuration:
![Backend configuration](backend-config.png)

### Database

Create the MYSQL database in the terminal:
```sql
CREATE DATABASE <NAME>;
USE <NAME>;
```
And run backend to add tables using entities

Edit the `application.properties` file located at `back/src/main/resources/application.properties`:
- Replace `${DB_URL}` with your database URL.
- Replace `${DB_NAME}` with your database username.
- Replace `${DB_PASSWORD}` with your database password.