import { Attraction } from './models/attraction.model.js'
import { Contact } from './models/contact.model.js'
import { Image } from './models/image.model.js'
import { User } from './models/user.model.js'
import { Person } from './models/person.model.js'

// Definir asociaciones
Attraction.hasMany(Contact, {
  foreignKey: 'entity_id',
  allowNull: false,
  onDelete: 'CASCADE',
  scope: { entity_type: 'attraction' }
})
Attraction.hasMany(Image, {
  foreignKey: 'entity_id',
  allowNull: false,
  onDelete: 'CASCADE',
  scope: { entity_type: 'attraction' }
})
Contact.belongsTo(Attraction, {
  foreignKey: 'entity_id',
  allowNull: false,
  scope: { entity_type: 'attraction' }
})
Image.belongsTo(Attraction, {
  foreignKey: 'entity_id',
  allowNull: false,
  scope: { entity_type: 'attraction' }
})

User.hasOne(Person, {
  foreignKey: 'user_id',
  allowNull: false,
  onDelete: 'CASCADE'
})

Person.belongsTo(User, {
  foreignKey: 'user_id',
  allowNull: false
})
