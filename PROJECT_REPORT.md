# SRI KRISHNA COLLEGE OF ENGINEERING AND TECHNOLOGY
*(An Autonomous Institution | Approved by AICTE | Affiliated to Anna University | Accredited by NAAC with A++ Grade)*  
**Kuniamuthur, Coimbatore – 641008**  
Phone: (0422)-2678001 (7 Lines) | Email: info@skcet.ac.in | Website: www.skcet.ac.in  

<br><br>

# LIBRARY PORTAL
## A MINI PROJECT REPORT

<br>

*Submitted by*

### **JEEVAN KARTHICK**
**(Reg. No: 2403727710621107)**

<br>

*In partial fulfilment for the award of the degree*  
*of*  
### **BACHELOR OF ENGINEERING**  
*IN*  
### **ELECTRONICS AND COMMUNICATION ENGINEERING**  

<br>

**SRI KRISHNA COLLEGE OF ENGINEERING AND TECHNOLOGY**  
*(An Autonomous Institution | Approved by AICTE | Affiliated to Anna University | Accredited by NAAC with A++ Grade)*  
**Kuniamuthur, Coimbatore – 641008**  

<br>

### **2026**

---

<div style="page-break-after: always;"></div>

## SUSTAINABLE DEVELOPMENT GOALS (SDGs)

The Sustainable Development Goals are a collection of 17 global goals designed as a blueprint to achieve a better and more sustainable future for all. The SDGs, set in 2015 by the United Nations General Assembly, are intended to be achieved by the year 2030. The project is based on these sustainable development goals.

| Question | Answer |
| :--- | :--- |
| **Which SDGs does the project directly address?** | **SDG 4 (Quality Education)**, **SDG 9 (Industry, Innovation and Infrastructure)**, and **SDG 12 (Responsible Consumption and Production)**. |
| **What strategies or actions are being implemented to achieve these goals?** | By providing an open, digital, and streamlined portal for educational resource discovery, automated book lending, inventory tracking, and eliminating manual paper-based library register logs. |
| **How is progress measured and reported in relation to the SDGs?** | Through the number of books digitally indexed, circulation transactions completed, reduction in manual register turnaround time, and 100% elimination of paper loan slips. |
| **How were these goals identified as relevant to the project's objectives?** | Access to educational reading materials directly advances lifelong learning (SDG 4), cloud-based web platforms enhance academic infrastructure (SDG 9), and digital record-keeping prevents paper waste (SDG 12). |
| **Are there any partnerships or collaborations in place to enhance this impact?** | Potential collaboration with central college libraries, departmental book banks, student reading clubs, and inter-library lending initiatives. |

---

<div style="page-break-after: always;"></div>

## BONAFIDE CERTIFICATE

Certified that this mini project report titled **"LIBRARY PORTAL"** is the bonafide work of **JEEVAN KARTHICK** who carried out the mini project under my supervision.

<br><br><br>

**SIGNATURE**

**Dr. K. SHANTHI, M.E., Ph.D.**  
ASSOCIATE PROFESSOR  
Department of Electronics and Communication Engineering  
Sri Krishna College of Engineering and Technology, Coimbatore - 641008.

<br><br>

Submitted for the Project viva-voce examination held on ______________________

<br><br><br>

**INTERNAL EXAMINER** &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **EXTERNAL EXAMINER**

---

<div style="page-break-after: always;"></div>

## ACKNOWLEDGEMENT

At this juncture, I take the opportunity to convey my sincere thanks and gratitude to the management of the college for providing all the facilities to me.

I wish to convey my gratitude to my college Principal, **Dr. K. Porkumaran**, for forwarding me to do this project and offering adequate duration to complete it.

I would like to express my grateful thanks to **Dr. D. Mohana Geetha**, Head of the Department, Department of Electronics and Communication Engineering, for the encouragement and valuable guidance given to this project.

I extend my gratitude to my beloved guide **Dr. K. Shanthi** for the constant support and immense help at all stages of the project.

Finally, I express my deepest appreciation to my faculty members, lab technicians, family, and peers for their continuous motivation and technical suggestions throughout this endeavor.

---

<div style="page-break-after: always;"></div>

## ABSTRACT

With the expanding volume of academic literature, research journals, and student enrollments in institutional campuses, coordinating library inventories, book checkouts, due dates, and patron records through manual register notebooks or disparate spreadsheets leads to record inaccuracies, duplicate entries, lack of transparency, and untracked book losses.

To address these critical operational challenges, this project proposes the development of **Library Portal**, an intuitive, full-stack web-based solution that automates book cataloging, search and filtering, circulation tracking, and member administration. The system is designed following the **MERN stack** (MongoDB, Express.js, React.js, and Node.js) and styled with responsive Bootstrap 5 components.

The platform provides dedicated, role-based workflows for three user classes: **Members** (students and readers who can search books, review availability, and borrow titles), **Librarians** (staff who index inventory, issue books, and process returns), and **Administrators** (who oversee all users, records, and overall system security). A standout technical feature of the portal is an optimized **debounced search** mechanism coupled with real-time category filtering, which minimizes unnecessary server and database queries while typing.

Furthermore, the system incorporates automated circulation stock updates—decrementing available copies upon checkout and incrementing them upon return—while auditing overdue items and computing late return fines. Secure JSON Web Token (JWT) authentication and bcrypt password hashing safeguard data privacy. Overall, the Library Portal enhances accessibility to educational resources, improves administrative efficiency, and ensures transparent, auditable library governance.

---

<div style="page-break-after: always;"></div>

## TABLE OF CONTENTS

| Chapter | Title | Page No. |
| :--- | :--- | :---: |
| &nbsp; | **ACKNOWLEDGEMENT** | **iii** |
| &nbsp; | **ABSTRACT** | **iv** |
| &nbsp; | **LIST OF TABLES** | **vii** |
| &nbsp; | **LIST OF FIGURES** | **viii** |
| &nbsp; | **LIST OF ABBREVIATIONS** | **ix** |
| **1** | **INTRODUCTION** | **1** |
| &nbsp; | 1.1 Overview | 1 |
| &nbsp; | 1.2 Components of System | 2 |
| &nbsp; | 1.3 Advanced Technologies | 3 |
| &nbsp; | 1.4 Global Perspectives | 4 |
| **2** | **SYSTEM ANALYSIS** | **5** |
| &nbsp; | 2.1 Existing System | 5 |
| &nbsp; | &emsp;2.1.1 Drawbacks | 6 |
| &nbsp; | 2.2 Problem Definition | 7 |
| &nbsp; | 2.3 Proposed System | 8 |
| &nbsp; | &emsp;2.3.1 Advantages | 8 |
| **3** | **SYSTEM REQUIREMENTS** | **9** |
| &nbsp; | 3.1 Hardware Requirements | 9 |
| &nbsp; | 3.2 Software Requirements | 9 |
| &nbsp; | 3.3 Software Description | 9 |
| &nbsp; | &emsp;3.3.1 Frontend — React JS & Bootstrap | 10 |
| &nbsp; | &emsp;3.3.2 Backend — Node.js, Express & MongoDB | 12 |
| **4** | **SYSTEM DESIGN** | **14** |
| &nbsp; | 4.1 Module Description | 14 |
| &nbsp; | &emsp;4.1.1 User Management | 14 |
| &nbsp; | &emsp;4.1.2 Book Inventory Management | 15 |
| &nbsp; | &emsp;4.1.3 Loan / Lending Management | 16 |
| &nbsp; | &emsp;4.1.4 Member Directory Management | 17 |
| &nbsp; | &emsp;4.1.5 Notification Management | 18 |
| &nbsp; | 4.2 Use Case Diagram | 20 |
| &nbsp; | 4.3 Sequence Diagram | 21 |
| &nbsp; | 4.4 Class Diagram / Schema Architecture | 22 |
| **5** | **TESTING** | **23** |
| &nbsp; | 5.1 Unit Testing | 23 |
| &nbsp; | 5.2 Integration Testing | 23 |
| &nbsp; | 5.3 Security and Authentication | 23 |
| &nbsp; | 5.4 Test Cases | 25 |
| &nbsp; | &emsp;5.4.1 Test Case I — Authentication Failure | 26 |
| &nbsp; | &emsp;5.4.2 Test Case II — Book Circulation & Stock Decrement | 26 |
| &nbsp; | &emsp;5.4.3 Test Case III — Role Authorization Guard | 26 |
| **6** | **CONCLUSION AND FUTURE WORK** | **27** |
| &nbsp; | 6.1 Conclusion | 27 |
| &nbsp; | 6.2 Future Work | 27 |
| **7** | **APPENDICES** | **28** |
| &nbsp; | Appendix I – Key Source Code | 28 |
| &nbsp; | Appendix II – User Interface Screenshots | 31 |
| &nbsp; | **REFERENCES** | **36** |

---

<div style="page-break-after: always;"></div>

## LIST OF TABLES

| Table No. | Title | Page No. |
| :--- | :--- | :---: |
| 4.1 | User Management Schema | 14 |
| 4.2 | Book Management Schema | 15 |
| 4.3 | Loan / Lending Management Schema | 16 |
| 4.4 | Member Profile Schema | 17 |
| 4.5 | Notification Management Schema | 18 |
| 5.1 | Test Case Matrix & Validation | 25 |

---

<div style="page-break-after: always;"></div>

## LIST OF FIGURES

| Figure No. | Title | Page No. |
| :--- | :--- | :---: |
| 4.1 | Use Case Diagram | 20 |
| 4.2 | Sequence Diagram (Book Checkout / Issue Flow) | 21 |
| 4.3 | Class Diagram / Entity Relationship Architecture | 22 |
| A.2.1 | Home Landing Page | 31 |
| A.2.2 | Portal Login Page with 1-Click Demo Buttons | 32 |
| A.2.3 | Book Directory with Debounced Search & Category Pills | 33 |
| A.2.4 | Book Details & Checkout Page | 33 |
| A.2.5 | Role-Aware Operations Dashboard | 34 |
| A.2.6 | Loan Circulation & Overdue Management Page | 35 |

---

<div style="page-break-after: always;"></div>

## LIST OF ABBREVIATIONS

| S.No | Abbreviation | Expansion |
| :---: | :--- | :--- |
| 1 | **API** | Application Programming Interface |
| 2 | **CRUD** | Create, Read, Update, Delete |
| 3 | **HTTP** | Hypertext Transfer Protocol |
| 4 | **JWT** | JSON Web Token |
| 5 | **UI** | User Interface |
| 6 | **UX** | User Experience |
| 7 | **JSX** | JavaScript XML |
| 8 | **REST** | Representational State Transfer |
| 9 | **DOM** | Document Object Model |
| 10 | **UML** | Unified Modelling Language |
| 11 | **DFD** | Data Flow Diagram |
| 12 | **RAM** | Random Access Memory |
| 13 | **GB** | Giga Bytes |
| 14 | **OS** | Operating System |
| 15 | **DB** | Database |
| 16 | **RBAC** | Role-Based Access Control |
| 17 | **MERN** | MongoDB, Express.js, React.js, Node.js |
| 18 | **ODM** | Object Data Modeling |

---

<div style="page-break-after: always;"></div>

# CHAPTER 1
## INTRODUCTION

### 1.1 OVERVIEW
In modern educational and research institutions, academic libraries serve as pivotal knowledge centers. As the variety and number of cataloged books, reference encyclopedias, and technical monographs expand alongside growing student enrollments, traditional library tracking methods—such as paper registers, card catalog files, and standalone spreadsheets—struggle to provide accurate and real-time oversight. Such legacy practices are prone to human clerical errors, misplaced book copies, untracked overdue returns, and an absence of verifiable transaction histories.

The **Library Portal** addresses these challenges by delivering a centralized, modern, full-stack web platform designed to streamline book cataloging, catalog searching, circulation lending, overdue tracking, and member administration. Built on the **MERN** stack (MongoDB, Express.js, React.js, Node.js) and styled using responsive **Bootstrap 5**, the platform ensures an intuitive experience across desktop, laptop, and mobile devices.

A key technical differentiator of the platform is its **debounced search mechanism and category filtering**. Rather than generating a server request on every individual keystroke, the custom React hook (`useDebounce`) delays query execution by 400 milliseconds, allowing patrons to type freely without overloading the server or database.

Furthermore, the system maintains strict **Role-Based Access Control (RBAC)** across three distinct user categories: **Members** (students/patrons), **Librarians** (desk staff), and **Administrators**. With automated inventory synchronization (incrementing and decrementing available copies upon returns and checkouts), automated due date calculations with late fine assessment, and secure JWT authentication, the platform establishes an efficient, transparent, and paperless operational environment.

---

### 1.2 COMPONENTS OF SYSTEM

- **System Landing Page (Home)**:  
  Acts as the primary entry gateway. Presents an overview of the library system, featured titles, key operational statistics, and quick navigation routes to catalog discovery or authentication.

- **Member Dashboard**:  
  Serves as the personal command hub for student members. Displays actively borrowed books, due date alerts, overdue warnings, borrowing history, and unread notifications.

- **Staff & Admin Dashboard**:  
  Offers a comprehensive bird's-eye view for librarians and administrators, aggregating total book titles, circulating copies, available stock, active loans, overdue counts, total members, and recent circulation transactions.

- **Book Catalog Directory & Search Module**:  
  Allows all users to explore the library inventory using debounced search (by Title, Author, or ISBN) and one-click category filtering pills.

- **Book Details & Checkout Page**:  
  Presents comprehensive metadata for each title—including cover imagery, ISBN, publisher, publication year, total copies, available stock, and synopsis—along with one-click checkout.

- **Loan & Circulation Management Module**:  
  Enables library staff to issue books to registered members, process book returns, calculate overdue fines, and manage loan lifecycles.

- **Member Directory Management Module**:  
  Allows authorized staff to register new patrons, update member profiles, assign roles, monitor membership statuses (Active/Suspended), and track individual loan accounts.

- **Notification Module**:  
  Dispatches in-app alerts regarding book checkouts, approaching due dates, overdue notices, and system announcements.

---

### 1.3 ADVANCED TECHNOLOGIES

- **Debounced Search Optimization**:  
  By implementing a custom React `useDebounce` hook, input keystrokes in the catalog search bar are held for 400ms before triggering an API request. This prevents request flooding and conserves server bandwidth.

- **Automated Copy Tracking**:  
  Every loan creation dynamically decrements the `availableCopies` counter in the corresponding MongoDB Book document, and every return restores the count, guaranteeing data integrity.

- **Role-Based Dashboards & Protected Routes**:  
  React Router DOM utilizes an intelligent `ProtectedRoute` wrapper to verify authentication state and role permissions, rendering tailored user interfaces for Members, Librarians, and Admins.

- **RESTful CRUD Architecture**:  
  The backend strictly adheres to REST principles across `/api/books`, `/api/loans`, `/api/members`, `/api/auth`, `/api/dashboard`, and `/api/notifications`, separating concerns for high maintainability.

- **Stateless JWT Authentication & Password Hashing**:  
  User credentials are protected using `bcryptjs` one-way hashing with 10 salt rounds. Sessions are verified statelessly via signed JSON Web Tokens (JWT) attached to HTTP request headers.

---

### 1.4 GLOBAL PERSPECTIVES

- **Digital Transformation of Academic Libraries**:  
  Educational institutions across the world are accelerating the digitization of their physical resource management to provide instant transparency and remote accessibility.
- **Paperless & Eco-Friendly Administration**:  
  Eliminating physical paper ledger registers, printed borrow slips, and manual identity cards drastically reduces environmental waste and operational overhead.
- **Ubiquitous Cloud Accessibility**:  
  MERN-based architectures deployed on cloud platforms enable students and faculty to check book availability from anywhere on campus or at home before visiting the physical library desk.

---

<div style="page-break-after: always;"></div>

# CHAPTER 2
## SYSTEM ANALYSIS

### 2.1 EXISTING SYSTEM
In many conventional libraries, operational workflows still depend heavily on manual methods: paper ledger books, index cards, or disconnected spreadsheets. When a patron wishes to borrow a title, staff locate the physical card or record the transaction manually in a register.

Return tracking is similarly handled by reviewing ledger rows, which makes identifying overdue books cumbersome and dependent on human vigilance. Real-time availability cannot be verified remotely, meaning patrons must physically visit shelves to discover if a title is checked out.

### 2.1.1 DRAWBACKS

- **Inaccurate Inventory & Stock Mismatches**: Manual record-keeping frequently causes discrepancies between ledger entries and physical shelf counts.
- **No Real-Time Remote Search**: Patrons have no mechanism to check book availability or filter by category without physically browsing library aisles.
- **Lack of Overdue Tracking & Fine Calculation**: Late returns often slip through unnoticed, resulting in uncollected fines and delayed return of high-demand volumes.
- **High Paper Consumption**: Thousands of paper slips, borrower cards, and ledger notebooks are used and discarded annually.
- **Security Vulnerabilities**: Shared spreadsheets and paper registers lack granular role protection, exposing patron contact information and lending records.

---

### 2.2 PROBLEM DEFINITION

- **Operational Inefficiency**: Manual check-in/check-out processes create bottlenecks at the library service desk during peak hours.
- **Absence of Role Separation**: Conventional file systems allow any user with access to alter, delete, or view sensitive member data.
- **Performance Overhead**: Naive digital search interfaces query backend servers on every keystroke, resulting in database lockups and high latency.
- **Untracked Circulation History**: Inability to reconstruct an auditable historical log of who borrowed which book, when it was returned, and what fines were levied.

---

### 2.3 PROPOSED SYSTEM
The proposed **Library Portal** provides an integrated, full-stack digital solution addressing every limitation of the legacy approach:

- **Intuitive Web Interface**: A clean, responsive Bootstrap 5 interface enabling fast browsing, book discovery, and personal account monitoring.
- **Debounced Search & Category Filtering**: Patrons can instantly search by title, author, or ISBN, and click category pills with optimized performance.
- **Automated Inventory Synchrony**: Available copies decrease automatically when a book is borrowed and increase when it is returned.
- **Role-Based Workflows**: Discrete operational portals for Members, Librarians, and Administrators secured by JWT tokens.
- **Comprehensive Circulation Auditing**: Real-time due date tracking, overdue detection, automatic fine computation, and in-app member alerts.

### 2.3.1 ADVANTAGES

- Eliminates clerical errors and eliminates 100% of paper checkout slips.
- Enables instant, remote catalog discovery with debounced search performance.
- Automates overdue tracking and fines, encouraging prompt book returns.
- Provides secure, role-guarded access with hashed passwords and signed tokens.
- Highly scalable, maintainable, and cost-effective using standard open-source MERN technologies.

---

<div style="page-break-after: always;"></div>

# CHAPTER 3
## SYSTEM REQUIREMENTS

### 3.1 HARDWARE REQUIREMENTS

| S.No | Component | Specification |
| :---: | :--- | :--- |
| 1 | **Processor Type** | Intel Core i3 / i5 / AMD Ryzen 5 or equivalent |
| 2 | **RAM** | 8 GB RAM (Minimum 4 GB) |
| 3 | **Hard Disk Space** | 256 GB SSD / HDD (Minimum 10 GB free space) |
| 4 | **Network** | Broadband / LAN connection for API communication |

### 3.2 SOFTWARE REQUIREMENTS

| S.No | Component | Specification |
| :---: | :--- | :--- |
| a | **Operating System** | Windows 10 / 11, macOS, or Linux |
| b | **Development Environment** | Visual Studio Code (VS Code) |
| c | **Runtime Environment** | Node.js (v18.x or v20.x+) |
| d | **Package Manager** | npm (Node Package Manager) |
| e | **Database** | MongoDB (v7.x+ Community Edition or Atlas) |
| f | **Frontend Framework** | React.js 18 with Vite build tool |
| g | **UI Library** | Bootstrap 5.3 & Bootstrap Icons |
| h | **Web Browser** | Google Chrome, Mozilla Firefox, or Microsoft Edge |

---

### 3.3 SOFTWARE DESCRIPTION

#### 3.3.1 FRONTEND — React JS & Bootstrap 5
React JS is a widely adopted open-source JavaScript library developed by Meta for constructing interactive single-page user interfaces. React's **component-based architecture** facilitates breaking down the user interface into modular, encapsulated components (e.g., `Navbar`, `BookCard`, `StatCard`, `ProtectedRoute`).

- **Virtual DOM**: React constructs an in-memory representation of the real DOM. When data changes, React performs a diffing algorithm and updates only the altered DOM elements, delivering high rendering speed.
- **Hooks Architecture**:
  - `useState`: Manages local component states (such as form inputs, filter selections, and active modals).
  - `useEffect`: Triggers asynchronous side effects, such as querying books or statistics upon component mount.
  - `useContext`: Houses `AuthContext`, providing global access to user state, login credentials, and role status across the entire component tree.
  - `useDebounce`: A custom hook that delays processing fast keystrokes to optimize search efficiency.
- **React Router DOM**: Orchestrates client-side routing across `/`, `/books`, `/books/:id`, `/dashboard`, `/loans`, `/members`, `/login`, `/register`, and `/profile`.
- **Axios**: Handles asynchronous HTTP communication with the backend REST API, utilizing request interceptors to automatically attach the `Bearer <token>` authorization header.
- **Bootstrap 5**: Delivers responsive grid layouts, modals, alerts, badges, and modern utility classes.

#### 3.3.2 BACKEND — Node.js, Express & MongoDB
- **Node.js**: An asynchronous, event-driven JavaScript runtime built on Google Chrome's V8 engine that executes backend code efficiently without thread blocking.
- **Express.js**: A flexible Node.js web application framework that structures RESTful endpoints, handles HTTP methods (GET, POST, PUT, DELETE), parses JSON payloads, and manages middleware execution.
- **MongoDB**: A leading NoSQL, document-oriented database that persists records as flexible, JSON-like BSON documents. It accommodates complex metadata structures without requiring rigid table joins.
- **Mongoose ODM**: An Object Data Modeling library providing schema validation, type casting, default values, pre-save middleware hooks, and the `.populate()` method for resolving document references.
- **JSON Web Token (JWT)**: Used for stateless session tokens signed by a secret server key.
- **bcryptjs**: Generates cryptographic hashes for user passwords with 10 salt rounds to secure authentication.

---

<div style="page-break-after: always;"></div>

# CHAPTER 4
## SYSTEM DESIGN

### 4.1 MODULE DESCRIPTION

The Library Portal is structured into five core functional modules:
1. **User Management Module**
2. **Book Inventory Management Module**
3. **Loan / Lending Management Module**
4. **Member Directory Management Module**
5. **Notification Management Module**

---

#### 4.1.1 USER MANAGEMENT MODULE
Manages authentication, session lifecycle, and role assignment for Members, Librarians, and Administrators.

**Table 4.1 User Management Schema**

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier generated by MongoDB |
| `name` | String | Full name of the user / member |
| `email` | String | Unique email address used for portal login |
| `password` | String | Cryptographically hashed password (via bcrypt) |
| `role` | String (Enum) | User privilege level: `'Member'`, `'Librarian'`, or `'Admin'` |
| `memberCode` | String | Formatted unique member card code (e.g., `LIB-M0001`) |
| `phone` | String | Contact telephone number |
| `address` | String | Residential address or campus department |
| `membershipStatus`| String (Enum) | Current account state: `'Active'`, `'Suspended'`, or `'Expired'` |
| `createdAt` | Date | Timestamp of account registration |

---

#### 4.1.2 BOOK INVENTORY MANAGEMENT MODULE
Oversees cataloging, stock availability, category indexing, and book details.

**Table 4.2 Book Management Schema**

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for each book volume |
| `title` | String | Title of the publication |
| `author` | String | Author(s) of the book |
| `isbn` | String | Unique International Standard Book Number |
| `category` | String | Literary or academic genre (e.g., Computer Science) |
| `totalCopies` | Number | Total physical copies owned by the library |
| `availableCopies`| Number | Copies currently on shelves available for lending |
| `description` | String | Comprehensive synopsis or summary |
| `publisher` | String | Publishing press or company |
| `publishedYear` | Number | Year of release |
| `coverImage` | String | URL of the book cover photograph |

---

#### 4.1.3 LOAN / LENDING MANAGEMENT MODULE
Manages book circulation, checkouts, returns, due dates, and fine calculations.

**Table 4.3 Loan / Lending Management Schema**

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for each loan record |
| `book` | ObjectId (Ref: Book) | Reference to the borrowed book |
| `member` | ObjectId (Ref: User) | Reference to the borrowing member |
| `issueDate` | Date | Date and time the book was checked out |
| `dueDate` | Date | Scheduled deadline for return (Issue Date + 14 Days) |
| `returnDate` | Date | Actual date of return (null while active) |
| `status` | String (Enum) | Circulation state: `'borrowed'`, `'returned'`, or `'overdue'` |
| `fineAmount` | Number | Computed late fine based on overdue days |
| `notes` | String | Internal remarks from the librarian |

---

#### 4.1.4 MEMBER DIRECTORY MANAGEMENT MODULE
Enables library staff to oversee patron accounts, membership status, and circulation history.

**Table 4.4 Member Profile Schema**

| Field | Type | Description |
| :--- | :--- | :--- |
| `MemberID` | ObjectId | System identifier referencing User model |
| `MemberCode` | String | Library card identifier |
| `FullName` | String | Name of the patron |
| `Role` | String | Role designation |
| `ActiveLoansCount`| Number | Number of books currently held |
| `MembershipStatus`| String | Active / Suspended account flag |
| `JoinDate` | Date | Date membership was initiated |

---

#### 4.1.5 NOTIFICATION MANAGEMENT MODULE
Generates contextual alerts and reminders for system events.

**Table 4.5 Notification Management Schema**

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier for each notification |
| `user` | ObjectId (Ref: User) | Recipient patron ID |
| `title` | String | Notification subject header |
| `message` | String | Informational message body |
| `type` | String (Enum) | Alert category: `'info'`, `'warning'`, `'success'`, `'danger'` |
| `isRead` | Boolean | Read status flag |
| `createdAt` | Date | Timestamp of notification dispatch |

---

### 4.2 USE CASE DIAGRAM

The Use Case Diagram illustrates interactions between the three primary actors (**Member**, **Librarian**, **Admin**) and the core services of the **Library Portal**.

```text
               +-------------------------------------------------------------+
               |                       LIBRARY PORTAL                        |
               |                                                             |
   (Actor)     |   (( Register / Login ))  <-------------------+             |     (Actor)
   Member      |                                               |             |    Librarian
    o/         |   (( Browse Catalog & Debounced Search )) ----+             |       \o
   /|          |                                               |             |       |\
   / \         |   (( Filter by Categories )) -----------------+             |       / \
    |          |                                               |             |        |
    +--------> |   (( Borrow Book / Self-Checkout ))           |             | <------+
    |          |                                               |             |        |
    +--------> |   (( View Dashboard & Active Loans ))         |             | <------+
    |          |                                               |             |        |
    +--------> |   (( Return Borrowed Book ))                  |             | <------+
    |          |                                               |             |        |
    +--------> |   (( View Profile & Notifications ))          |             | <------+
               |                                               |             |        |
               |   (( Add / Edit Book Inventory )) <-----------+-------------+ <------+
               |                                                             |        |
               |   (( Manage Members & Profiles )) <-------------------------+ <------+
               |                                                             |        |
               |   (( Delete Books & Remove Records )) <---------------------+        |
               |                                                                      |
               +----------------------------------------------------------------------+
                                                                                      ^
                                                                                      |
                                                                                    (Actor)
                                                                                     Admin
                                                                                      o/
                                                                                     /|
                                                                                     / \
```

**Fig. 4.1. Use Case Diagram**

---

### 4.3 SEQUENCE DIAGRAM

The Sequence Diagram illustrates the step-by-step communication across the **React Frontend**, **Express REST API**, and **MongoDB Database** when a member borrows a book.

```text
 Member                React Frontend               Express API              MongoDB
   |                         |                           |                      |
   |-- 1. Click "Borrow" --->|                           |                      |
   |                         |-- 2. POST /api/loans ---->|                      |
   |                         |   (BookID, Bearer JWT)    |                      |
   |                         |                           |-- 3. Verify JWT ---->|
   |                         |                           |   & Find Book        |
   |                         |                           |                      |
   |                         |                           |<-- 4. Book Available-|
   |                         |                           |                      |
   |                         |                           |-- 5. Decrement Stock |
   |                         |                           |   availableCopies - 1|
   |                         |                           |-- 6. Insert Loan Doc |
   |                         |                           |   (Status: borrowed) |
   |                         |                           |-- 7. Insert Notif -->|
   |                         |                           |                      |
   |                         |                           |<-- 8. Write Success -|
   |                         |<-- 9. HTTP 201 Created ---|                      |
   |                         |    (Populated Loan Data)  |                      |
   |<-- 10. Show Success & --|                           |                      |
   |    Update Stock UI      |                           |                      |
```

**Fig. 4.2. Sequence Diagram (Book Checkout Flow)**

---

### 4.4 CLASS DIAGRAM / SCHEMA ARCHITECTURE

The Class Diagram highlights the entity relationships and attribute signatures of the system.

```text
+-----------------------+              +-----------------------+
|         User          | 1          * |         Loan          |
+-----------------------+--------------+-----------------------+
| - _id: ObjectId       | borrows      | - _id: ObjectId       |
| - name: String        |              | - book: ObjectId (FK) |
| - email: String       |              | - member: ObjectId(FK)|
| - password: String    |              | - issueDate: Date     |
| - role: Enum          |              | - dueDate: Date       |
| - memberCode: String  |              | - returnDate: Date    |
| - phone: String       |              | - status: Enum        |
| - status: Enum        |              | - fineAmount: Number  |
| + matchPassword()     |              +-----------------------+
+-----------------------+                          * |
            | 1                                      | 1 references
            |                                        v
            | generates                +-----------------------+
            v *                        |         Book          |
+-----------------------+              +-----------------------+
|     Notification      |              | - _id: ObjectId       |
+-----------------------+              | - title: String       |
| - _id: ObjectId       |              | - author: String      |
| - user: ObjectId (FK) |              | - isbn: String        |
| - title: String       |              | - category: String    |
| - message: String     |              | - totalCopies: Number |
| - isRead: Boolean     |              | - availableCopies: Num|
| - type: Enum          |              | - coverImage: String  |
+-----------------------+              +-----------------------+
```

**Fig. 4.3. Class Diagram / Entity Architecture**

---

<div style="page-break-after: always;"></div>

# CHAPTER 5
## TESTING

### 5.1 UNIT TESTING
Unit testing validates that individual software units and methods perform as designed:
- **Password Hashing**: Verified that the Mongoose `pre('save')` hook properly encrypts passwords into bcrypt hashes before storage.
- **Match Password Method**: Confirmed that `user.matchPassword(enteredPassword)` correctly returns `true` for valid passwords and `false` for mismatches.
- **Debounce Custom Hook**: Verified that `useDebounce` suppresses intermediate search values until the timer exceeds 400ms.
- **Fine Calculation Algorithm**: Confirmed that overdue return calculations compute the difference between `returnDate` and `dueDate` and correctly apply the late fee per day.

---

### 5.2 INTEGRATION TESTING
Integration testing verifies that the React client, Express server, and MongoDB database interact seamlessly:
- **API Endpoint Connectivity**: Confirmed that all endpoints (`/api/books`, `/api/loans`, `/api/members`, `/api/dashboard`, `/api/notifications`) respond with standardized JSON formats.
- **Cross-Origin Resource Sharing (CORS)**: Verified that HTTP requests originating from the Vite frontend (`http://localhost:5173`) are accepted and processed by the backend on port 5000.
- **Mongoose Population**: Verified that `.populate('book member')` successfully resolves relational references into embedded object data for loan records.

---

### 5.3 SECURITY AND AUTHENTICATION
- **JWT Protection**: Protected routes intercept requests lacking a valid token or carrying a malformed signature, rejecting them with an `HTTP 401 Unauthorized` status.
- **Role-Based Guards**: The `authorize('Librarian', 'Admin')` middleware successfully denies access to restricted actions (such as adding or deleting books) when invoked by a standard Member account (`HTTP 403 Forbidden`).
- **Token Expiration**: Tokens carry a predefined expiration window (30 days), preventing indefinite use of intercepted tokens.

---

### 5.4 TEST CASES

**Table 5.1 Test Case Matrix & Validation**

| Test Case | Module | Scenario | Expected Result | Actual Result | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Authentication | Login with wrong password | System denies access with "Invalid email or password" error | Access denied; error message displayed | **PASS** |
| **TC-02** | Authentication | Valid login with demo credentials | System generates JWT token and redirects to Dashboard | Token stored in localStorage; redirected | **PASS** |
| **TC-03** | Catalog Search | Rapid typing in search input | Debounce delays query by 400ms and returns filtered book list | Single query sent after typing pauses; matches displayed | **PASS** |
| **TC-04** | Circulation | Borrow book when stock > 0 | Loan created; `availableCopies` decremented by 1 | Loan created (`borrowed`); stock reduced | **PASS** |
| **TC-05** | Circulation | Return borrowed book | Return date logged; `availableCopies` incremented back by 1 | Return date saved; stock restored; fine calculated if late | **PASS** |
| **TC-06** | Authorization | Member attempts to add new book | Access denied (`HTTP 403`); redirected or blocked by UI | Request rejected; unauthorized message displayed | **PASS** |

#### 5.4.1 TEST CASE I — Authentication Failure
- **Scenario**: User submits an incorrect password on the Login form.
- **Expected Output**: Authentication fails; server returns `HTTP 401 Unauthorized` with message `"Invalid email or password"`.
- **Actual Output**: Error banner rendered on UI prompting re-entry; access denied.

#### 5.4.2 TEST CASE II — Book Circulation & Stock Decrement
- **Scenario**: Member Alex Turner borrows "Eloquent JavaScript" (Initial available copies: 6).
- **Expected Output**: A new Loan document is created with status `'borrowed'`, and the book's `availableCopies` drops to 5.
- **Actual Output**: Loan created with ID `6aaa3f...`, available stock reduced to 5 immediately.

#### 5.4.3 TEST CASE III — Role Authorization Guard
- **Scenario**: Standard Member attempts to access the book creation endpoint `POST /api/books`.
- **Expected Output**: The `authorize('Librarian', 'Admin')` middleware rejects the request with `HTTP 403 Forbidden`.
- **Actual Output**: Server responds with error message: `"User role 'Member' is not authorized to access this resource"`.

---

<div style="page-break-after: always;"></div>

# CHAPTER 6
## CONCLUSION AND FUTURE WORK

### 6.1 CONCLUSION
The **Library Portal** successfully implements a robust, full-stack web solution for managing institutional library operations. By leveraging the **MERN** stack and responsive **Bootstrap 5**, the platform provides a unified environment for catalog discovery, circulation lending, inventory monitoring, and member administration.

The introduction of **debounced search** significantly elevates search responsiveness while conserving backend computing resources. Role-based access control guarantees appropriate security boundaries between Members, Librarians, and Administrators, while automated inventory synchronization ensures zero discrepancy between recorded availability and physical shelf stock. By replacing slow, error-prone paper ledgers with an auditable digital platform, the system accomplishes its primary goals of boosting productivity, eliminating paper waste, and broadening access to educational materials.

---

### 6.2 FUTURE WORK

1. **Barcode and RFID Scanner Integration**:  
   Enabling USB barcode/RFID scanners at the circulation desk for instantaneous check-in and check-out without manual searching.
2. **Digital eBook and PDF Viewer**:  
   Embedding an in-browser PDF reader allowing patrons to read open-access research papers and digital books directly within the portal.
3. **Automated SMS & Email Notifications**:  
   Integrating Twilio or Nodemailer to deliver automated text and email alerts to members 48 hours prior to loan due dates.
4. **Online Fine Payment Gateway**:  
   Integrating Razorpay or Stripe to allow students to settle overdue library penalties digitally through UPI, cards, or net banking.
5. **Machine Learning Recommendation Engine**:  
   Analyzing reading habits and borrowing trends to recommend relevant titles to patrons on their home dashboard.

---

<div style="page-break-after: always;"></div>

# CHAPTER 7
## APPENDICES

### APPENDIX I — KEY SOURCE CODE

#### 1. Custom Debounce Hook (`client/src/hooks/useDebounce.js`)
```javascript
import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce fast-changing input values (e.g. search input).
 * Delays API requests until the user pauses typing for specified delay.
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel timer if value updates before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

#### 2. Book Lending Controller (`server/controllers/loanController.js`)
```javascript
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Notification = require('../models/Notification');

// Issue a book to a member
const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, durationDays = 14 } = req.body;
    const targetMemberId = req.user.role === 'Member' ? req.user._id : memberId;

    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for loan' });
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + Number(durationDays));

    const loan = await Loan.create({
      book: book._id,
      member: targetMemberId,
      issueDate,
      dueDate,
      status: 'borrowed',
    });

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

<div style="page-break-after: always;"></div>

### APPENDIX II — USER INTERFACE SCREENSHOTS & DESIGN

#### Fig. A.2.1. Home Landing Page
*Features an engaging hero banner, search bar shortcut, core highlights (Debounced Search, Loan Lifecycle, Role-Based Access), and a live showcase of top-rated available books.*

#### Fig. A.2.2. Portal Login Page
*Includes standard email/password authentication accompanied by 1-Click Quick Demo Login buttons for Admin, Librarian, and Member accounts.*

#### Fig. A.2.3. Books Directory with Debounced Search & Category Pills
*Displays the comprehensive catalog with dynamic category filtering buttons (Computer Science, Literature, Science, Business), real-time debounced search, availability badges, and details modals.*

#### Fig. A.2.4. Book Details & Checkout Page
*Presents complete book metadata, publisher information, ISBN, available versus total copies, narrative synopsis, and one-click borrow action.*

#### Fig. A.2.5. Role-Aware Operations Dashboard
*Renders tailored metrics: for Staff, total titles, available stock, active circulations, and overdue counts; for Members, active loans, countdown due dates, and return buttons.*

#### Fig. A.2.6. Loan Circulation & Overdue Management Page
*A dedicated circulation ledger for library staff to review all checkouts, filter by status (borrowed, overdue, returned), process returns, and track fine assessments.*

---

<div style="page-break-after: always;"></div>

## REFERENCES

### Web References
1. React Official Documentation: https://react.dev/learn  
2. React Router Documentation: https://reactrouter.com/  
3. Node.js Official Documentation: https://nodejs.org/en/docs  
4. Express.js Official Documentation: https://expressjs.com/  
5. MongoDB Official Documentation: https://www.mongodb.com/docs/  
6. Mongoose Official Documentation: https://mongoosejs.com/docs/  
7. JSON Web Token (JWT) Standards: https://jwt.io/introduction/  
8. Axios HTTP Client Documentation: https://axios-http.com/docs/intro  
9. Bootstrap 5 Official Framework: https://getbootstrap.com/docs/5.3/  

### Book References
1. Robert C. Martin (2008), *Clean Code: A Handbook of Agile Software Craftsmanship*, Prentice Hall.  
2. Kyle Simpson (2015), *You Don't Know JS (Book Series)*, O'Reilly Media.  
3. Ethan Brown (2019), *Web Development with Node and Express*, O'Reilly Media.  
4. Stoyan Stefanov (2013), *React: Up and Running: Building Web Applications*, O'Reilly Media.  
5. Kristina Chodorow (2013), *MongoDB: The Definitive Guide*, O'Reilly Media.  
