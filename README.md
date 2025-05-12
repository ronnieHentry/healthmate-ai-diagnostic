# healthmate-ai-diagnostic
AI Diagnostic Assistant


Steps to setup backend:
cd to backend directory
Create .env file and add the API key to the variable GROQ_API_KEY (Can get free API key at https://groq.com/)
Run the following commands one by one:
1. python -m venv venv
2. .\venv\Scripts\activate
3. pip install uvicorn fastapi python-dotenv pydantic requests
4. uvicorn app.main:app --reload

Steps to setup backend:
cd to healthmate-ui
1. npm install
2. npm run dev
3. open http://localhost:5173/ in the browser (Ensure backend is running first)