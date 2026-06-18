---
name: Backend Edit Restrictions
description: Rule to prevent direct modifications to the backend codebase from the frontend project.
---

# Backend Edit Restrictions

When working in this frontend project (`konekdin-fe`), you MUST NOT make direct code modifications to the backend project (`dev-1` or any backend folder). 

## Rules:
1. **Do Not Edit Backend Files:** Do not use tools like `write_to_file`, `replace_file_content`, or `multi_replace_file_content` on files outside of the frontend project, particularly backend API routes, controllers, or services.
2. **Provide Suggestions Only:** If a frontend feature requires a backend change (such as adding a new endpoint or modifying a JSON response), you must provide the suggested backend code to the user as a recommendation.
3. **Wait for User Implementation:** Let the user implement the backend changes themselves or explicitly ask you to do it in the backend context. Do not proactively alter backend files.
