# Tahfidz Tracking - Sosio Informatika dan Professionalisme

## Anggota

- Irwanto Danang Bahtiar (1217050070)

## Explanation

This is a backend RESTfulApi for Tahfidz Tracking web app.

This project was used to fulfill an Assignment on a course "Social Infomatics and Professionalism"

## Usage

BASE_URL = `""`

## Endpoint

### 1. General (username refer to user NIM (studentId) or NIP (mentorId))

**```BASE_URL/register (POST)```**

**Description**: This endpoint is used to register a new user (either student or mentor) to the app.

**req.body**:

- ref (a role reference. This must be 'student' or 'mentor')
- username (this should be either NIM for Student and NIP for Mentor and should be unique)
- password
- example for student:
    ```json
    req.body = {
        username: '1217050070',
        password: 'myPassword',
        ref: 'student'
    }
    ```
- example for mentor:
    ```json
    req.body = {
        username: '001278799937784',
        password: 'myPassword',
        ref: 'mentor'
    }
    ```
**Output**:
- success:
    ```json
    {
        message: "Account successfully created!",
    }
    ```
- wrong ref:
    ```json
        {
            message: "Invalid reference type! Must be 'student' or 'mentor'."
        }
    ```
- account already exist:
    ```json
        {
            message: "... account already exist!"
        }
    ```

**`BASE_URL/login (POST)`**

**Description**: This endpoint is used to login an existing user (either student or mentor) to the app.

**req.body**:

- ref (a role reference. This must be 'student' or 'mentor')
- username (this should be either NIM for Student and NIP for Mentor and should be unique)
- password
- example for student:
    ```json
    req.body = {
        username: '1217050070',
        password: 'myPassword',
        ref: 'student'
    }
    ```
- example for mentor:
    ```json
    req.body = {
        username: '001278799937784',
        password: 'myPassword',
        ref: 'mentor'
    }
    ```
**Output**:
- success: (aside from _id and password, mentor have infix "mentor" while student have infix "student".)
    ```json
    {
        message: "Login successful!",
        user: {
            _id: <ObjectID>,
            password: <string>,
            studentId or mentorId: <string>,
            studentName or mentorName: <string>,
            studentContact or mentorContact: <string>,
            studentMentor: <string>
            studentMajor: <string>
        },
    }
    ```
- wrong ref:
    ```json
        {
            message: "Invalid reference type! Must be 'student' or 'mentor'."
        }
    ```
- account not found:
    ```json
        {
            message: "... account not found!"
        }
    ```
- wrong password:
    ```json
        {
            message: "Invalid Password!"
        }
    ```

**`BASE_URL/recite/:id (GET)`**

**Description** Endpoint to view a detail of one recite (can be used by both mentor and student).

**req.params.id**: is _id (mongoDB ObjectID) of the recite

**Output**:
- success:
    ```json
    {
        message: "Recite Successfully fetched."
        recite: {
            _id: <ObjectID>,
            reciteSurah: <string>,
            reciteAyat: <string>,
            reciteLink: <string>,
            reciteScore: <number>,
            reciteReview: <string>,
            reciteStatus: <string>,
            reciteStudent: {
                studentName: <string>
            },
            reciteMentor: {
                mentorName: <string>
            }
        }
    }
    ```

### 2. Student
**`BASE_URL/student/ (GET)`**

**Description** Endpoint to get all list of students

**`BASE_URL/student/uploadRecite (POST)`**

**Description** Endpoint to upload a recite by student

**req.body**:
- id (ObjectID - mongoDB id of the student)
- data (Object - data of the recite)
- example req.body:
    ```json
    {
        id: "5f8f8c44b54764421b716f57",
        data: {
            reciteSurah: "Al-Alaq",
            reciteAyat: "1-5",
            reciteLink: "https://www.youtube.com/live/VNAmTWNMJJ4?si=qm8CFvTvRtPZcuD-"
        }
    }
    ```
**Output**:
- success:
    ```json
    {
        message: "Recite successfully uploaded!",
        recite: {
            reciteSurah: "Al-Alaq",
            reciteAyat: "1-5",
            reciteLink: "https://www.youtube.com/live/VNAmTWNMJJ4?si=qm8CFvTvRtPZcuD-"
            reciteStudent: "1217050070",
            reciteMentor: "14324455564334455653",
            reciteScore: 0
            reciteReview: ""
            reciteStatus: "PENDING"
        }
    }
    ```

**`BASE_URL/student/:id/recite (GET)`**

**Description** Endpoint to get all list of Student's recite.

**req.params.id**: is _id (mongoDB ObjectID) of the student

**`BASE_URL/student/:id (PUT)`**

**Description** Endpoint for student to update/edit their profile.

**req.params.id**: is _id (mongoDB ObjectID) of the student

**req.body**:
- studentName,
- studentContact,
- password,
- studentMajor
- example req.body: (all field optional)
    ```json
    {
        studentName: "Dan",
        studentContact: "dankoyuki398@gmail.com",
        studentMajor: "Informatics",
        password: "#admin123"
    }
    ```
**Output**:
- success:
    ```json
    {
        message: "Student profile updated successfully!",
        student: {<StudentObject>}
    }
    ```

### 3. Mentor
**`BASE_URL/mentor/:id (PUT)`**

**Description** Endpoint to edit Mentor Profile

**req.params.id**: is _id (mongoDB ObjectID) of the mentor

**req.body**:
- mentorName,
- mentorContact,
- password
- example req.body: (all field optional)
    ```json
    {
        mentorName: "Dan",
        mentorContact: "dankoyuki398@gmail.com",
        password: "#admin123"
    }
    ```
- Output:
    - success:
        ```json
        {
            message: "Mentor profile updated successfully!",
            mentor: {<MentorObject>}
        }
        ```
**`BASE_URL/mentor/:id/recites (GET)`**

**Description** Endpoint to get all recites of student that was taken care by the mentor.

**req.params.id**: mongoDB id of the mentor

**`BASE_URL/mentor/:id/students (GET)`**

**Description** Endpoint to get all students that was taken care by the mentor.

**req.params.id**: mongoDB id of the mentor

**`BASE_URL/mentor/:id/review (POST)`**

**Description** Endpoint to review recite.

**req.params.id**: mongoDB id of the recite

**req.body**:
- reciteScore,
- reciteReview,
- reciteStatus
- example:
    ```json
    {
        reciteScore: 5,
        reciteReview: "Good",
        reciteStatus: "ACCEPTED"
    }
    ```
**Output**:
    ```json
    {
        message: "Recite Updated!",
        recite: <ReciteObject>,
    }
    ```

**`BASE_URL/mentor/ (GET)`**

**Description** Endpoint to get all mentors