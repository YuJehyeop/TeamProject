from flask import Flask, render_template, jsonify, request,redirect,url_for
app = Flask(__name__)

# @app.route('/')
# def first_page():
#     return render_template('YJH_map.html')

@app.route('/')
def first_page():
    return render_template('YJH_first_page.html')

@app.route('/YJH/map')
def mpa():
    return render_template('YJH_map.html')

if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)