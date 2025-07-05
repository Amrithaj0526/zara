from extensions import db

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    bio = db.Column(db.String(500))
    location = db.Column(db.String(120))
    skills = db.Column(db.Text)  # Comma-separated for simplicity
    experience = db.Column(db.Text)  # JSON string or plain text
    education = db.Column(db.Text)   # JSON string or plain text
    image = db.Column(db.String(255))  # Path to profile image

    user = db.relationship('User', backref='profile')

    def validate(self):
        errors = {}
        if self.bio and len(self.bio) > 500:
            errors['bio'] = 'Bio must be 500 characters or less.'
        if self.location and len(self.location) > 120:
            errors['location'] = 'Location must be 120 characters or less.'
        # Add more validation as needed
        return errors
