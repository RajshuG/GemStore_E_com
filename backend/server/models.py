from server import db,app
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer as Serializer

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullName = db.Column(db.String(150), nullable=False)
    username = db.Column(db.String(150), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password = db.Column(db.String(60), nullable=False)
    cartItem = db.relationship('CartItem', backref='user', lazy=True)

    def hash_password(self):
        self.password = generate_password_hash(self.password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def genrate_pass_token(user):
        s = Serializer(app.config['SECRET_KEY'])
        token = s.dumps({'user_id':user.id}, salt='password-reset-salt')
        return token
    
    def verify_reset_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token, salt='password-reset-salt', max_age=1800)
        except:
            return None
        return User.query.get(data['user_id'])

    
    def  __repr__(self):
        return f"User ({self.username, self.email, self.fullName})"


class Product(db.Model):
    id  = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.String(150), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(100),default = 'default.jpg', nullable=False)
    def  __repr__(self):
        return f"User ({self.title, self.price, self.image})"

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    def __repr__(self):
        return f"cart ({self.user_id, self.product_id, self.quantity})"