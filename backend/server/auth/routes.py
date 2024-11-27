from server import db, app, mail
from flask import Blueprint, request, jsonify, url_for, redirect
from server.models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime
from flask_mail import Message

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    fullName = data['fullName']
    username = data['username']
    email = data['email']
    password = data['password']
    confirmPassword = data['confirmPassword']

    if password != confirmPassword:
        return jsonify({"message":"Password does not match"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message":"Email already exists"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"message":"username already taken"}), 400

    user = User(fullName = fullName, username = username, email=email, password=password)
    user.hash_password()
    db.session.add(user)
    db.session.commit()

    return jsonify({"message":"Registration Successfull"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"message":"Invalid Credentials"}),401
    access_token = create_access_token(identity={"username": user.username}, expires_delta=datetime.timedelta(days=1))
    return jsonify({"access_token":access_token})

@auth.route('/resetRequest', methods=['POST'])
def request_reset():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"message":"Please enter an Email"})

    user = User.query.filter_by(email=email).first()
    if user:
        token = user.genrate_pass_token()

        reset_url = url_for('auth.reset_pass', token=token, _external=True)

        subject = "Password Reset Request"
        msg = Message(subject, recipients=[user.email])
        msg.body = f" To reset your password, visit the following link: {reset_url}"
        mail.send(msg)

        return jsonify({"message": "Please check your Inbox"})
    
    return jsonify({"error":"Email not found"})

@auth.route('/reset_pass/<token>', methods=['POST','GET'])
def reset_pass(token):
    if request.method == 'GET':
        return redirect(f'http://127:5173/newpass/{token}')
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON data received"})
    new_password = data['password']

    user = User.verify_reset_token(token)
    if not user:
        return jsonify({"error":"Invalid or expired  token"})
    
    user.password = new_password
    user.hash_password()
    db.session.commit()

    return jsonify({"message":"Password has been reset successfully"})

@auth.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    username = get_jwt_identity()['username']
    user = User.query.filter_by(username=username).first()
    if user:
        result = {'id':user.id, 'name': user.fullName, 'email':user.email, 'username':user.username}
        return jsonify(result)
    else:
        return jsonify({"message":"user not found"}), 404
    

@auth.route('/update_profile', methods=['PUT'])
@jwt_required()
def update_profile():
    data = request.get_json()
    username = get_jwt_identity().get('username')

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"message":"user not found"}), 404
    
    new_name = data.get('name')
    new_username = data.get('username')
    new_email = data.get('email')

    exist_username = User.query.filter_by(username=new_username).first()
    exist_email = User.query.filter_by(email=new_email).first()

    if exist_email and exist_email.id != user.id:
        return jsonify({"error":"Email already exists"}), 400
    
    elif exist_username and exist_username.id != user.id:
        return jsonify({"error":"Username already exists"}), 400
    
    user.fullName = new_name if new_name else user.fullName
    user.username = new_username if new_username else user.username
    user.email = new_email if new_email else user.email

    db.session.commit()

    new_token = create_access_token(identity={"username": user.username, "email": user.email})

    return jsonify({"message":"Profile updated successfully", "token":new_token})


