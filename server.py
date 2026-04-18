from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

API_CONFIG = {
    'endpoint': 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    'api_key': 'sk-1b0e57f46a8b4af5b4552339954ba19b',
    'model': 'qwen-plus'
}

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message')
        messages = request.json.get('messages', [])
        
        logger.info(f"收到请求: {user_message}")
        logger.info(f"消息历史: {messages}")
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f"Bearer {API_CONFIG['api_key']}"
        }
        
        logger.info(f"使用的API key: {API_CONFIG['api_key'][:6]}...{API_CONFIG['api_key'][-4:]}")
        logger.info(f"请求头: {headers}")
        
        payload = {
            'model': API_CONFIG['model'],
            'messages': messages,
            'temperature': 0.7
        }
        
        logger.info(f"请求体: {payload}")
        
        response = requests.post(API_CONFIG['endpoint'], headers=headers, json=payload, timeout=30)
        
        logger.info(f"API响应状态码: {response.status_code}")
        logger.info(f"API响应内容: {response.text}")
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            error_msg = f'API请求失败: {response.status_code} {response.text}'
            logger.error(error_msg)
            return jsonify({'error': error_msg}), response.status_code
            
    except requests.exceptions.Timeout:
        error_msg = '请求超时，请稍后重试'
        logger.error(error_msg)
        return jsonify({'error': error_msg}), 504
    except Exception as e:
        error_msg = str(e)
        logger.error(f'发生异常: {error_msg}', exc_info=True)
        return jsonify({'error': error_msg}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)