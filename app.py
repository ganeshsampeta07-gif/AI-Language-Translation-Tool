from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from deep_translator import GoogleTranslator
import traceback
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'Invalid request format. JSON expected.'}), 400
            
        text = data.get('text', '').strip()
        source_language = data.get('source_language', 'auto')
        target_language = data.get('target_language', 'en')
        
        if not text:
            return jsonify({'success': False, 'error': 'Text to translate cannot be empty.'}), 400
            
        if source_language != 'auto' and source_language == target_language:
            return jsonify({'success': False, 'error': 'Source and target languages cannot be the same.'}), 400
            
        # Translate using deep-translator
        translator = GoogleTranslator(source=source_language, target=target_language)
        translated_text = translator.translate(text)
        
        return jsonify({
            'success': True,
            'translated_text': translated_text
        })
        
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
