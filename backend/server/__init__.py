from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_migrate import Migrate


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SECRET_KEY'] = 'f5f164828b48ff1a7ffc0058ba7c3040'
app.config['JWT_SECRET_KEY'] = 'c3ad6dbbc527028e0201c745d5f5b659'
app.config['MAIL_USERNAME'] = 'rajshugem@gmail.com'
app.config['MAIL_PASSWORD'] = 'ndzs seqc xhcg rlxu'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_DEFAULT_SENDER'] = 'noreply@gmail.com'


jwt  = JWTManager(app)
db  =SQLAlchemy(app)
CORS(app, supports_credentials=True)
mail  = Mail(app)
migrate = Migrate(app,db)

from server.auth.routes  import auth
from server.products.routes import products
from server.cart.routes import cart

app.register_blueprint(auth)
app.register_blueprint(products)
app.register_blueprint(cart)
