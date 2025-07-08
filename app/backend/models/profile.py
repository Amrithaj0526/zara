from app.backend.extensions import db

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(120), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    skills = db.Column(db.Text, nullable=True)
    experience = db.Column(db.Text, nullable=True)
    education = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(255), nullable=True)
    job_title = db.Column(db.String(120), nullable=True)
    company = db.Column(db.String(120), nullable=True)
    social_links = db.Column(db.Text, nullable=True)
    user = db.relationship('User', backref=db.backref('profile', uselist=False))
