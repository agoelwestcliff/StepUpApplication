# StepUp — Requirements

**Repo:** https://github.com/agoelwestcliff/StepUpApplication
**Course:** DEV640 — Social Networking Team Project
**Team (Group 3):** Arpitha Nagaraj Hegde, Akash Goel, Ashni Walia, I Ganbold

## 1. Overview

StepUp is an internal social networking platform for employees within a company. Employees sign up with their company email, build profiles, connect with colleagues, share posts on a feed, and message each other. The app fosters workplace community, cross-team visibility, and informal communication.

## 2. Core Features

| # | Feature                      | Description                                      | Owner     |
|---|------------------------------|--------------------------------------------------|-----------|
| 1 | Signup process               | Employee registration with company email         | Arpitha   |
| 2 | Login                        | Authenticated login form                         | Arpitha   |  
| 3 | Logout                       | Session teardown                                 | Arpitha   |
| 4 | Session control              | Persistent sessions across pages                 | Arpitha   |
| 5 | Profiles with thumbnails     | Employee profile with photo, bio, department     |           |
| 6 | Employee directory           | Browse and search all members                    |           |
| 7 | Connections                  | Add colleagues as connections (mutual acceptance)|           |
| 8 | Messaging                    | Public wall posts and private direct messages    |           |
| 9 | Styling                      | Responsive design with custom CSS                |           |

## 3. Extended Features

Beyond the core social networking elements:

- **Employee directory with search** — find colleagues by name, department, or role.
- **Post feed** — employees share updates, announcements, or questions visible to connections.
- **Department/team tags** — profiles show team affiliation; feed can be filtered by team.
- **Connection requests** — colleague connections require mutual acceptance (not one-sided).
- **Onboarding flow** — guided first-run experience that prompts profile completion.

## 4. Tech Stack

- **Frontend:** HTML, CSS/CSS3, and vanilla JavaScript.
- **Libraries/frameworks:** None. The project does not use React, jQuery, PHP,
  MySQL, or a JavaScript build tool.
- **Data storage for prototype:** Browser `localStorage` for sample employee
  accounts and session state.

## 5. Out of Scope

- Email verification, OAuth.
- Native mobile apps.
- Push notifications.
- Admin panel / moderation tools.
