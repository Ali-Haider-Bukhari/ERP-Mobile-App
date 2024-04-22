from mongoengine import Document, EmbeddedDocument, FloatField, StringField, EmbeddedDocumentField

class Coordinate(EmbeddedDocument):
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)

class Location(Document):
    coordinate = EmbeddedDocumentField(Coordinate, required=True)
    title = StringField(required=True)
    description = StringField(required=True)

    meta = {'collection': 'locations', 'strict': True}

    @classmethod
    def create_location(cls, latitude, longitude, title, description):
        coordinate = Coordinate(latitude=latitude, longitude=longitude)
        location = cls(coordinate=coordinate, title=title, description=description)
        location.save()
        return location

    @classmethod
    def fetch_all_locations(cls):
        return cls.objects().all()

    def update_location(self, latitude=None, longitude=None, title=None, description=None):
        if latitude is not None:
            self.coordinate.latitude = latitude
        if longitude is not None:
            self.coordinate.longitude = longitude
        if title is not None:
            self.title = title
        if description is not None:
            self.description = description
        self.save()

    @classmethod
    def delete_location(cls, location_id):
        location = cls.objects(id=location_id).first()
        if location:
            location.delete()
            return True
        return False
    
    @classmethod
    def update_location_by_coordinates(cls, latitude, longitude, new_latitude=None, new_longitude=None, title=None, description=None):
        location = cls.objects(coordinate__latitude=latitude, coordinate__longitude=longitude).first()
        if location:
            location.update_location(latitude=new_latitude, longitude=new_longitude, title=title, description=description)
            return location
        return None