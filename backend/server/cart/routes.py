from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
from server import db
from server.models import CartItem, Product, User
from server.cart.utils import send_cart_mail



cart = Blueprint('cart', __name__)

@cart.route('/cart/add', methods=['POST'], endpoint='cart_add_item')
@jwt_required()
def add_to_cart():
    data = request.get_json()
    username = get_jwt_identity()['username']
    user = User.query.filter_by(username=username).first()
    product_id = data['product_id']
    quantity = data['quantity']

    cart_item = CartItem.query.filter_by(user_id=user.id, product_id=product_id).first()
    print(f'User: {user.username}, Product ID: {product_id}, Quantity: {quantity}')
    product = Product.query.get_or_404(product_id)

    if cart_item:
        cart_item.quantity += quantity

    else:
        cart_item = CartItem(user_id = user.id, product_id = product_id, quantity=quantity)
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"message":"added to cart"})

@cart.route('/cart/remove/<int:product_id>', methods=['DELETE'], endpoint='cart_remove_item')
@jwt_required()
def remove_from_cart(product_id):
    username = get_jwt_identity()['username']
    user = User.query.filter_by(username = username).first()

    if not user:
        return jsonify({"message":"User not authorised"})

    cart_item = CartItem.query.filter_by(user_id=user.id, product_id=product_id).first()

    if not cart_item:
        return jsonify({"messsage":"Item not found"})
    
    if cart_item.quantity > 1:
        cart_item.quantity -= 1
    else:
        db.session.delete(cart_item)
    
    db.session.commit()

    return jsonify({"message":"Item removed from cart"})

@cart.route('/cart', methods=['GET'], endpoint='cart_display')
@jwt_required()
def get_cart():
    username = get_jwt_identity()['username']
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"message":"user not authorized"})
    
    cart_item = CartItem.query.filter_by(user_id = user.id).all()
    products_in_cart = []

    for item in cart_item:
        product = Product.query.get(item.product_id)
        image_url = request.host_url + 'static/'+ product.image
        if product:
            products_in_cart.append({
                'product_id': product.id,
                'title':product.title,
                'content': product.content,
                'price': product.price,
                'quantity': item.quantity,
                'image': image_url,
            })

    return jsonify({'cart_items': products_in_cart})


@cart.route('/cart/order', methods=['POST'], endpoint='order_placed')
@jwt_required()
def cart_order():
    username = get_jwt_identity()['username']

    if not username:
        return jsonify({"message": "user not verified"})
    
    user = User.query.filter_by(username=username).first()
    cart_item = CartItem.query.filter_by(user_id= user.id).all()
    message = "Your order has been placed successfully. Here are the details: \n\n"
    for item in cart_item:
        product = Product.query.get(item.product_id)
        message += f"Product: {product.title}  Quantity: {item.quantity}  Price: {product.price} \n"

    send_cart_mail(user,message)

    for item in cart_item:
        db.session.delete(item)  

    db.session.commit()

    return jsonify({"message": "Order placed, cart cleared and mail sent"})

@cart.route('/cart/increase/<int:product_id>', methods=['PUT'])
@jwt_required()
def increase_quantity(product_id):
    username = get_jwt_identity()['username']
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message":"User not authorized"})
    
    cart_item = CartItem.query.filter_by(user_id=user.id, product_id = product_id).first()

    if not cart_item:
        return jsonify({"message":"Item not found"})
    
    cart_item.quantity += 1
    db.session.commit()

    return jsonify({"message":"quantity increased", "quantity":cart_item.quantity})


@cart.route('/cart/decrease/<int:product_id>', methods=['PUT'])
@jwt_required()
def decrease_quantity(product_id):
    username = get_jwt_identity()['username']
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"message":"User not authorized"})
    
    cart_item = CartItem.query.filter_by(user_id=user.id, product_id=product_id).first()

    if not cart_item:
        return jsonify({"message":"item not found"})
    
    if cart_item.quantity > 1:
        cart_item.quantity -= 1
        db.session.commit()
        return jsonify({"message":"Quantity decreased", "quantity": cart_item.quantity})
    else:
        return jsonify({"message":"Minimum quantity reached"})