from datetime import datetime
from app.backend.extensions import db
from app.backend.models.user import User

class Post(db.Model):
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    media_url = db.Column(db.String(255), nullable=True)
    likes = db.Column(db.Integer, default=0)
    tags = db.Column(db.String(255), nullable=True)
    category = db.Column(db.String(100), nullable=True)
    visibility = db.Column(db.String(20), default='public')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref=db.backref('posts', lazy=True))
