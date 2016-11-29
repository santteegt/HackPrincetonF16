import os
from flask import Flask, request
# from flask.ext.cors import CORS, cross_origin
from flask_cors import cross_origin
from imageverify import main
from mongo_db_connector import MongoDB_Util
from datetime import datetime

app = Flask(__name__)
# cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
@cross_origin()
def hello():
    type = request.args.get('type')
    userContent = request.args.get('content')
    assert app.logger is not None
    if type == 'url' or type == 'image':
        status = main(userContent, app.logger)
        app.logger.debug("RESPONSE TO GET REQUEST -> {0}".format(status))
    return status

@app.route('/crawl')
@cross_origin()
def crawl():
    type = request.args.get('type')
    userContent = request.args.get('content')
    db_util = MongoDB_Util()
    post = {'url': '' if type == 'text' else userContent,
            'text': userContent if type == 'text' else '', 'date': datetime.utcnow()}
    db_util.insert_record('fb_posts', post)

    app.logger.debug("RESPONSE TO GET REQUEST <<CRAWL>> ->  {0} : {1}".format(type, post))

    return str(True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
