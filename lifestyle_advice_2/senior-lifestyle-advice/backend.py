from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Python Backend for Senior Lifestyle Advice is ready."})

if __name__ == '__main__':
    # This is a secondary backend script. 
    # The primary server for this environment is Node.js/Express.
    app.run(host='0.0.0.0', port=5000)
