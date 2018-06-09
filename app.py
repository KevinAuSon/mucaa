import json
import os
from flask import Flask, render_template, jsonify, request, send_from_directory
from pydub import AudioSegment
import uuid

app = Flask(__name__, static_url_path='/static/')

@app.route("/")
def index():
    data = {
        'graph': [
                {
                      'id': 0
                    , 'audio': 'drum_kick'
                    , 'speed': 30
                    , 'beats': [0, 90, 180, 270] 
                }
              , {
                      'id': 1
                    , 'audio': 'snare'
                    , 'speed': 30
                    , 'beats': [45, 120, 150, 225, 300, 330] 
                }
              , {
                      'id': 2
                    , 'audio': 'budha'
                    , 'speed': 30
                    , 'beats': [270] 
                }
              , {
                      'id': 3
                    , 'audio': 'sound'
                    , 'speed': 30
                    , 'beats': [] 
                }
          ]
    }

    return render_template("index.html", data=data)


@app.route("/create", methods = ['POST'])
def create():
    graph = request.json
    path = './static/audio/{0}.mp3'
    
    duration = 5 * 1000 # 5 secs
    mashup = AudioSegment.silent(duration=duration)

    for n in graph:
        sound = AudioSegment.from_mp3(path.format(n['audio']))
        for beat in n['beats']:
            beat = (beat + 90) % 360

            if 0 <= beat < 5:
                beat = 360

            start = (360-beat) / 360 * duration
            mashup = mashup.overlay(sound, position=start)

    hash = uuid.uuid4().hex
    out_f = open(path.format('/tmp/' + hash), 'wb')
    mashup.export(out_f, format='mp3')

    return jsonify({'url': 'static/audio/tmp/' + hash + '.mp3'})

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static/', path)

if __name__ == "__main__":
    app.run(debug=True)
