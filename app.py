from flask import Flask

app = Flask(__name__)

@app.route('/hello')
def hello_world():
    return 'Flask Dockerized'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)

# Troubleshooting
# Do not have a folder named graphql at root of application. It won't be possible to import graphene
