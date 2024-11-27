from flask import Blueprint, jsonify,request, url_for
from server.models import Product

products = Blueprint('products', __name__)

@products.route('/all', methods=['GET'])
def get_products():
    all_products = Product.query.all()
    result = [{"id":p.id, "title": p.title, "price":p.price, "content":p.content, "image":request.host_url + 'static/'+ p.image} for p in all_products]
    return jsonify(result)

@products.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    image_url = request.host_url + 'static/'+ product.image
    result = {'id':product.id, "title": product.title, "content":product.content, "image":image_url, "price":product.price}
    return jsonify(result)

@products.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '')
    if query:
        products = Product.query.filter((Product.title.ilike(f'%{query}%')) | (Product.content.ilike(f'%{query}%')) ).all()
    else:
        products = []

    return jsonify([{'id':p.id, 'title': p.title, "price": p.price, "content": p.content, "image":p.image} for p in products])