# AI Language Translator

## 1. Project Title
AI Language Translation Tool

## 2. Project Description
A complete, modern, and responsive web application that allows users to seamlessly translate text between multiple languages. The application is built with a Python/Flask backend and a visually appealing, interactive frontend using HTML, CSS, and Vanilla JavaScript. It uses the free `deep-translator` package to provide reliable translations without requiring API keys.

## 3. Features
- **Multi-language Support**: Translate between English, Telugu, Hindi, Tamil, Spanish, French, German, and Japanese.
- **Auto Detect**: Automatically detects the source language.
- **Swap Languages**: Easily reverse the translation direction.
- **Translation History**: Saves your previous translations in the browser's local storage for easy access.
- **Text-to-Speech**: Listen to the source and translated text.
- **Copy to Clipboard**: One-click copying of translations.
- **Dark/Light Mode**: Toggleable themes for a comfortable viewing experience.
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop screens.
- **Modern UI**: Attractive gradients, glassmorphism elements, and smooth transitions.

## 4. Technologies Used
**Backend**:
- Python
- Flask
- Flask-CORS
- deep-translator (Google Translate engine)

**Frontend**:
- HTML5
- CSS3 (Custom variables, Flexbox/Grid)
- Vanilla JavaScript
- FontAwesome (Icons)
- Google Fonts (Outfit)

## 5. Folder Structure
```
Task1/
├── app.py                 # Flask application and API routes
├── requirements.txt       # Python dependencies
├── README.md              # Project documentation
├── templates/
│   └── index.html         # Main frontend HTML template
└── static/
    ├── style.css          # Styling and theming
    └── script.js          # Client-side logic and API calls
```

## 6. Installation Instructions
Ensure you have Python 3.8+ installed on your system.

## 7. How to Create a Virtual Environment
It's recommended to run the project inside a virtual environment.
Open your terminal in the `Task1` folder and run:

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

## 8. How to Install Dependencies
Once your virtual environment is activated, install the required packages using:
```bash
pip install -r requirements.txt
```

## 9. How to Run the Project
Start the Flask server by running:
```bash
python app.py
```
After the server starts, open your web browser and go to: `http://127.0.0.1:5000/`

## 10. API Endpoint Explanation

**POST `/translate`**
- **Description**: Translates text from a source language to a target language.
- **Request Body**:
  ```json
  {
    "text": "Hello, how are you?",
    "source_language": "en",
    "target_language": "te"
  }
  ```
- **Response (Success)**:
  ```json
  {
    "success": true,
    "translated_text": "హలో, మీరు ఎలా ఉన్నారు?"
  }
  ```
- **Response (Error)**:
  ```json
  {
    "success": false,
    "error": "Error message details"
  }
  ```

## 11. Future Improvements
- Add document translation support (PDF, DOCX).
- Introduce a user authentication system to sync history across devices.
- Integrate premium paid APIs (like OpenAI or DeepL) for higher accuracy and nuance.
- Add voice input capabilities (Speech-to-Text).
- Add support for more regional languages.
