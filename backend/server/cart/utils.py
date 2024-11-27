from flask_mail import Message
from server import mail,app


def send_cart_mail(user, msgContent):
    msg = Message('Order Placed', recipients=[user.email])
    msg.body = msgContent
    mail.send(msg)