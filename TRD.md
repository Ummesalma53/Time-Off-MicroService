# Technical Requirements Document (TRD)
## Time-Off Microservice — ExampleHR

---

## 1. Overview

The Time-Off Microservice manages employee time-off requests.
It connects ExampleHR with the HCM system (Workday/SAP).
HCM is always the source of truth for balances.

---

## 2. User Personas

- **Employee**: Wants to see balance and submit requests
- **Manager**: Wants to approve or reject requests

---

## 3. Data Models

### Balance Table
| Field | Type | Description |
|-------|------|-------------|
| id | INT | Primary key |
| employeeId | STRING | Employee ID |
| locationId | STRING | Location ID |
| totalDays | FLOAT | Total days allocated |
| usedDays | FLOAT | Days used |
| pendingDays | FLOAT | Days pending |
| lastSyncedAt | DATE | Last HCM sync time |

### TimeOffRequest Table
| Field | Type | Description |
|-------|------|-------------|
| id | INT | Primary key |
| employeeId | STRING | Employee ID |
| locationId | STRING | Location ID |
| startDate | STRING | Leave start date |
| endDate | STRING | Leave end date |
| daysRequested | FLOAT | Days requested |
| status | ENUM | PENDING/APPROVED/REJECTED/CANCELLED |
| createdAt | DATE | Created time |
| updatedAt | DATE | Updated time |

---

## 4. API Endpoints

### Time-Off
- POST /time-off/request — Submit request
- GET /time-off/request/:id — Get request
- GET /time-off/balance/:employeeId/:locationId — Get balance
- PATCH /time-off/request/:id/approve — Approve
- PATCH /time-off/request/:id/reject — Reject
- DELETE /time-off/request/:id — Cancel

### Sync
- POST /sync/realtime — Single balance update from HCM
- POST /sync/batch — Bulk balance update from HCM

### Mock HCM
- GET /hcm/balance/:employeeId/:locationId
- POST /hcm/deduct
- POST /hcm/anniversary-bonus

---

## 5. Request Flow

---

## 6. Challenges

1. HCM may be unavailable → handled with try/catch
2. Balance may change in HCM independently → handled by sync endpoints
3. Two requests at same time → pendingDays prevents double booking
4. Invalid employee/location → HCM returns error, we catch it

---

## 7. Alternatives Considered

- REST vs GraphQL → chose REST, simpler
- SQLite vs PostgreSQL → chose SQLite as required
- Polling vs Push sync → chose Push, lower latency

---

## 8. Tech Stack

- NestJS — Backend framework
- SQLite — Database
- TypeORM — Database ORM
- Jest — Testing
- Axios — HTTP calls to HCM